<script setup lang="ts">
/**
 * 通用食谱计算器。配方写在页面 frontmatter 的 `recipe` 里，营养数据来自 ../nutrition/foods.ts。
 *
 * recipe:
 *   unit: batch          # 预设用量的单位：meal = 每餐（默认），batch = 一批的总量（分成 batchMeals 餐）
 *   mealsPerDay: 2       # 每天吃几餐，默认 2
 *   batchMeals: 6        # 一批分几餐，默认 6
 *   waterRatio: 1.8      # 可选，电饭煲加水量 = 未预煮的干料 × 该值
 *   minMealGrams: 60     # 可选，每餐少于该值时提醒
 *   ranges:              # 可选，口感范围（占干料总重的 %），用量为 0 时不检查
 *     rice: { min: 25, max: 40, low: 饭会发散、偏干, high: ... }
 *   presets:             # 第一个为默认方案；食材顺序按各方案中首次出现的顺序
 *     - name: 均衡
 *       desc: 说明文字
 *       amounts: { rice: 180, blackRice: 60 }   # 干重（g），key 对应 FOODS
 */
import { computed, reactive, ref } from 'vue'
import { useData } from 'vitepress'
import { FOODS, CATEGORY_LABELS } from '../nutrition/foods'

interface Preset {
    name: string
    desc?: string
    amounts: Record<string, number>
}

interface Range {
    min?: number
    max?: number
    low?: string
    high?: string
}

interface RecipeConfig {
    unit?: 'meal' | 'batch'
    mealsPerDay?: number
    batchMeals?: number
    waterRatio?: number
    minMealGrams?: number
    ranges?: Record<string, Range>
    presets: Preset[]
}

/** 杂豆 + 大豆占比超过该值时提醒胀气 */
const BEAN_RATIO_WARN = 0.6
/** 大豆类每天建议 25 ~ 35 g（含豆腐、豆浆等折算） */
const SOY_DAILY_MAX = 35

const { frontmatter } = useData()
const recipe = computed(() => frontmatter.value.recipe as RecipeConfig | undefined)
const presets = computed(() => recipe.value?.presets ?? [])
const mealsPerDay = computed(() => recipe.value?.mealsPerDay ?? 2)
const isBatch = computed(() => recipe.value?.unit === 'batch')
const ranges = computed(() => recipe.value?.ranges ?? {})

const keys = computed(() => [...new Set(presets.value.flatMap(p => Object.keys(p.amounts)))])
const unknownKeys = computed(() => keys.value.filter(k => !FOODS[k]))
const items = computed(() => keys.value
    .filter(k => FOODS[k])
    .map(k => ({
        key: k,
        food: FOODS[k],
        range: ranges.value[k],
        // 滑块上限：至少 60 g，或各方案最大用量的 2 倍
        max: Math.max(60, Math.ceil(Math.max(...presets.value.map(p => p.amounts[k] ?? 0)) * 2)),
    })))

/** 输入值，单位由 recipe.unit 决定 */
const amounts = reactive<Record<string, number>>({ ...presets.value[0]?.amounts })
const meals = ref(recipe.value?.batchMeals ?? 6)
const activePreset = ref(presets.value[0]?.name ?? '')
const step = computed(() => isBatch.value ? 5 : 0.5)

const inputOf = (key: string) => Number(amounts[key]) || 0
const mealGrams = (key: string) => isBatch.value ? inputOf(key) / (meals.value || 1) : inputOf(key)
const batchGrams = (key: string) => isBatch.value ? inputOf(key) : inputOf(key) * meals.value
const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d

function applyPreset(p: Preset) {
    for (const k of keys.value) amounts[k] = p.amounts[k] ?? 0
    activePreset.value = p.name
}

function onInput() {
    const hit = presets.value.find(p => keys.value.every(k => (p.amounts[k] ?? 0) === inputOf(k)))
    activePreset.value = hit ? hit.name : ''
}

const perMeal = computed(() => {
    const sum = { grams: 0, kcal: 0, protein: 0, fat: 0, carb: 0, fiber: 0, beans: 0, soy: 0 }
    for (const { key, food } of items.value) {
        const g = mealGrams(key)
        sum.grams += g
        sum.kcal += food.kcal * g / 100
        sum.protein += food.protein * g / 100
        sum.fat += food.fat * g / 100
        sum.carb += food.carb * g / 100
        sum.fiber += food.fiber * g / 100
        if (food.category === 'legume' || food.category === 'soy') sum.beans += g
        if (food.category === 'soy') sum.soy += g
    }
    return sum
})

/** 占干料总重的比例（0 ~ 1） */
const ratioOf = (key: string) => perMeal.value.grams ? mealGrams(key) / perMeal.value.grams : 0

function rangeState(key: string, range?: Range): 'low' | 'high' | '' {
    if (!range || mealGrams(key) <= 0) return ''
    // 按显示出来的整数百分比判断，避免显示 25% 却提示偏低
    const shown = Math.round(ratioOf(key) * 100)
    if (range.min != null && shown < range.min) return 'low'
    if (range.max != null && shown > range.max) return 'high'
    return ''
}

function rangeText(r?: Range) {
    if (!r) return ''
    if (r.min != null && r.max != null) return `${r.min}–${r.max}%`
    return r.max != null ? `≤ ${r.max}%` : `≥ ${r.min}%`
}

const hasBeans = computed(() => items.value.some(i => i.food.category === 'legume' || i.food.category === 'soy'))
const beanRatio = computed(() => perMeal.value.grams ? perMeal.value.beans / perMeal.value.grams : 0)
const proteinEnergy = computed(() => perMeal.value.kcal ? perMeal.value.protein * 4 / perMeal.value.kcal : 0)

const water = computed(() => {
    const ratio = recipe.value?.waterRatio
    if (!ratio) return 0
    return items.value.filter(i => !i.food.precook).reduce((s, i) => s + batchGrams(i.key), 0) * ratio
})

const warnings = computed(() => {
    const list: string[] = []
    const m = perMeal.value
    for (const { key, food, range } of items.value) {
        const state = rangeState(key, range)
        if (!state) continue
        const msg = state === 'low' ? range!.low : range!.high
        list.push(`${food.name}占 ${Math.round(ratioOf(key) * 100)}%，${state === 'low' ? '低于' : '高于'}建议的 ${rangeText(range)}${msg ? '：' + msg : ''}。`)
    }
    if (beanRatio.value > BEAN_RATIO_WARN) {
        list.push(`豆类占 ${Math.round(beanRatio.value * 100)}%，超过 ${BEAN_RATIO_WARN * 100}% 容易胀气，也不像米饭了。`)
    }
    const soyDaily = m.soy * mealsPerDay.value
    if (soyDaily > SOY_DAILY_MAX) {
        list.push(`大豆类每天 ${round(soyDaily)} g，超过建议的 ${SOY_DAILY_MAX} g（豆腐、豆浆也要算在内）。`)
    }
    const min = recipe.value?.minMealGrams
    if (min && m.grams > 0 && m.grams < min) {
        list.push(`每餐不到 ${min} g，分量偏少，容易饿，注意配菜里的蛋白质和蔬菜要吃够。`)
    }
    for (const { key, food } of items.value) {
        if (food.caution && mealGrams(key) > 0) list.push(food.caution)
    }
    return list
})
</script>

<template>
    <div v-if="!recipe || !presets.length" class="rc rc-error">
        RecipeCalculator：当前页面的 frontmatter 里没有 <code>recipe.presets</code>。
    </div>
    <div v-else class="rc">
        <p v-if="unknownKeys.length" class="rc-error">
            以下食材不在 foods.ts 里，已忽略：{{ unknownKeys.join('、') }}
        </p>

        <div v-if="presets.length > 1" class="rc-presets">
            <button
                v-for="p in presets"
                :key="p.name"
                :class="{ active: activePreset === p.name }"
                @click="applyPreset(p)"
            >{{ p.name }}</button>
        </div>
        <p class="rc-desc">{{ presets.find(p => p.name === activePreset)?.desc ?? (activePreset ? '' : '自定义配比') }}</p>

        <table class="rc-table">
            <thead>
                <tr>
                    <th>食材</th>
                    <th>{{ isBatch ? `${meals} 餐合计（g）` : '每餐（g）' }}</th>
                    <th>{{ isBatch ? '每餐' : `${meals} 餐合计` }}</th>
                    <th>占比</th>
                    <th>热量 / 餐</th>
                    <th>蛋白质 / 餐</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="{ key, food, range, max } in items" :key="key">
                    <td>
                        {{ food.name }}
                        <span class="rc-tag" :class="food.category">{{ CATEGORY_LABELS[food.category] }}</span>
                    </td>
                    <td class="rc-input">
                        <input v-model.number="amounts[key]" type="range" min="0" :max="max" :step="step" @input="onInput">
                        <input v-model.number="amounts[key]" type="number" min="0" :step="step" @input="onInput">
                    </td>
                    <td>{{ isBatch ? round(mealGrams(key)) : round(batchGrams(key)) }} g</td>
                    <td class="rc-ratio" :class="rangeState(key, range)" :title="range ? `建议 ${rangeText(range)}` : ''">
                        {{ Math.round(ratioOf(key) * 100) }}%
                        <small v-if="range">{{ rangeText(range) }}</small>
                    </td>
                    <td>{{ Math.round(food.kcal * mealGrams(key) / 100) }} kcal</td>
                    <td>{{ round(food.protein * mealGrams(key) / 100) }} g</td>
                </tr>
            </tbody>
        </table>

        <div class="rc-meals">
            {{ isBatch ? '分成' : '一次做' }}
            <input v-model.number="meals" type="number" min="1" max="30" step="1">
            餐，干料共 <b>{{ round(perMeal.grams * meals) }} g</b>
            <template v-if="water">，电饭煲加水约 <b>{{ Math.round(water / 10) * 10 }} ml</b>（预煮的食材不计）</template>
        </div>

        <div class="rc-stats">
            <div><span>热量</span><b>{{ Math.round(perMeal.kcal) }}</b><small>kcal / 餐</small></div>
            <div><span>蛋白质</span><b>{{ round(perMeal.protein) }}</b><small>g / 餐</small></div>
            <div><span>脂肪</span><b>{{ round(perMeal.fat) }}</b><small>g / 餐</small></div>
            <div><span>碳水（含纤维）</span><b>{{ round(perMeal.carb) }}</b><small>g / 餐</small></div>
            <div><span>膳食纤维</span><b>{{ round(perMeal.fiber) }}</b><small>g / 餐</small></div>
            <div><span>每天（{{ mealsPerDay }} 餐）</span><b>{{ Math.round(perMeal.kcal * mealsPerDay) }}</b><small>kcal</small></div>
            <div v-if="hasBeans"><span>豆类占比</span><b>{{ Math.round(beanRatio * 100) }}%</b><small>按干重</small></div>
            <div><span>蛋白质供能</span><b>{{ Math.round(proteinEnergy * 100) }}%</b><small>占本餐热量</small></div>
        </div>

        <ul v-if="warnings.length" class="rc-warnings">
            <li v-for="w in warnings" :key="w">{{ w }}</li>
        </ul>
    </div>
</template>

<style scoped>
.rc {
    margin: 16px 0;
    padding: 16px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background: var(--vp-c-bg-soft);
}

.rc-error {
    color: var(--vp-c-danger-1);
    font-size: 14px;
}

.rc-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.rc-presets button {
    padding: 4px 14px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 16px;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    font-size: 14px;
    transition: border-color .2s, color .2s;
}

.rc-presets button:hover {
    border-color: var(--vp-c-brand-1);
}

.rc-presets button.active {
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
}

.rc-desc {
    margin: 8px 0 0;
    color: var(--vp-c-text-2);
    font-size: 13px;
}

.rc .rc-table {
    display: table;
    width: 100%;
    margin: 12px 0;
}

.rc-table td,
.rc-table th {
    padding: 6px 8px;
    white-space: nowrap;
}

.rc-input {
    display: flex;
    align-items: center;
    gap: 8px;
}

.rc-input input[type=range] {
    width: 110px;
    accent-color: var(--vp-c-brand-1);
}

.rc input[type=number] {
    width: 64px;
    padding: 2px 6px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
}

.rc-tag {
    margin-left: 4px;
    padding: 0 5px;
    border-radius: 4px;
    font-size: 12px;
}

.rc-tag.grain {
    background: var(--vp-c-warning-soft);
    color: var(--vp-c-warning-1);
}

.rc-tag.legume {
    background: var(--vp-c-success-soft);
    color: var(--vp-c-success-1);
}

.rc-tag.soy {
    background: var(--vp-c-tip-soft);
    color: var(--vp-c-tip-1);
}

.rc-tag.tuber {
    background: var(--vp-c-danger-soft);
    color: var(--vp-c-danger-1);
}

.rc-ratio small {
    margin-left: 4px;
    color: var(--vp-c-text-3);
    font-size: 12px;
}

.rc-ratio.low,
.rc-ratio.high {
    color: var(--vp-c-danger-1);
    font-weight: 600;
}

.rc-meals {
    font-size: 14px;
}

.rc-meals input {
    margin: 0 4px;
}

.rc-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
    margin-top: 12px;
}

.rc-stats div {
    display: flex;
    flex-direction: column;
    padding: 8px 10px;
    border-radius: 6px;
    background: var(--vp-c-bg);
}

.rc-stats span {
    color: var(--vp-c-text-2);
    font-size: 12px;
}

.rc-stats b {
    font-size: 20px;
    line-height: 1.4;
    font-variant-numeric: tabular-nums;
}

.rc-stats small {
    color: var(--vp-c-text-3);
    font-size: 12px;
}

.rc-warnings {
    margin: 12px 0 0;
    padding: 8px 12px 8px 28px;
    border-radius: 6px;
    background: var(--vp-c-warning-soft);
    font-size: 13px;
}

.rc-warnings li + li {
    margin-top: 4px;
}
</style>
