import type MarkdownIt from 'markdown-it'

/**
 * markdown 关闭了 html 解析（md.set({ html: false })），
 * 这里只放行「单独占一行、首字母大写的自闭合 Vue 组件」，例如 `<RecipeCalculator />`。
 * 其他 HTML 仍然按普通文本转义。
 */
const COMPONENT_LINE = /^<([A-Z][A-Za-z0-9]*)\s*\/>\s*$/

export function useMarkdownVueComponent(md: MarkdownIt) {
    md.block.ruler.before('paragraph', 'vue_component', (state, startLine, _endLine, silent) => {
        const start = state.bMarks[startLine] + state.tShift[startLine]
        const line = state.src.slice(start, state.eMarks[startLine])

        if (!COMPONENT_LINE.test(line)) return false
        if (silent) return true

        const token = state.push('html_block', '', 0)
        token.content = line.trim() + '\n'
        token.map = [startLine, startLine + 1]
        state.line = startLine + 1
        return true
    })
}
