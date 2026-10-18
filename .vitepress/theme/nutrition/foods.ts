/**
 * 食物营养数据库，所有食谱共用。
 * 数值为每 100 g 干重（生重），2026-10-18 核对。
 *
 * 来源（每条上方注明编号）：
 * - 官方 #id：食物营养成分查询平台 https://nlc.chinanutri.cn/fq/foodinfo/<id>.html （能量 kJ ÷ 4.184 换算为 kcal）
 * - USDA id：FoodData Central https://fdc.nal.usda.gov/food-details/<id>/nutrients
 * 新增食材时优先用官方平台；官方没有的再用 USDA。
 */

export type FoodCategory = 'grain' | 'legume' | 'soy' | 'tuber'

export interface Food {
    name: string
    category: FoodCategory
    /** 需要单独预煮（不计入电饭煲加水量） */
    precook?: boolean
    /** 用到这种食材时显示的提醒 */
    caution?: string
    kcal: number
    protein: number
    fat: number
    /** 碳水化合物（含膳食纤维） */
    carb: number
    fiber: number
}

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
    grain: '谷',
    legume: '豆',
    soy: '大豆',
    tuber: '薯',
}

export const FOODS: Record<string, Food> = {
    // 谷物
    // 官方 #281 粳米(标一)；纤维：USDA 169756
    rice: { name: '大米', category: 'grain', kcal: 350, protein: 7.7, fat: 0.6, carb: 77.4, fiber: 1.3 },
    // USDA 173904 Cereals, oats, regular and quick, not fortified, dry
    oatGroats: { name: '燕麦米', category: 'grain', kcal: 379, protein: 13.2, fat: 6.5, carb: 67.7, fiber: 10.1 },
    // USDA 2710825 Rice, black, unenriched, raw
    blackRice: { name: '黑米', category: 'grain', kcal: 370, protein: 7.6, fat: 3.4, carb: 77.2, fiber: 4.2 },

    // 杂豆
    // USDA 172420 Lentils, raw
    greenLentil: { name: '绿扁豆', category: 'legume', kcal: 352, protein: 24.6, fat: 1.1, carb: 63.4, fiber: 10.7 },
    // USDA 174284 Lentils, pink or red, raw
    redLentil: { name: '红扁豆', category: 'legume', kcal: 358, protein: 23.9, fat: 2.2, carb: 63.1, fiber: 10.8 },
    // 官方 #369 鹰嘴豆[桃豆]；纤维：USDA 173756
    chickpea: { name: '鹰嘴豆', category: 'legume', precook: true, kcal: 342, protein: 21.2, fat: 4.2, carb: 60.0, fiber: 12.2 },
    // 官方 #358 芸豆(干，白)；纤维：USDA 175202
    whiteKidneyBean: {
        name: '白芸豆', category: 'legume', precook: true,
        caution: '白芸豆必须大火滚沸 10 分钟以上再煮软，不能省。',
        kcal: 319, protein: 23.4, fat: 1.4, carb: 57.2, fiber: 15.2,
    },

    // 大豆
    // 官方 #327 黑豆[黑大豆](干)；纤维：USDA 174270 Soybeans（无黑大豆数据，用黄豆代替）
    blackSoybean: { name: '黑豆', category: 'soy', precook: true, kcal: 402, protein: 36.0, fat: 15.9, carb: 33.6, fiber: 9.3 },
}
