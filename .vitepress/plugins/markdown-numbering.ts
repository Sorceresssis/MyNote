import type MarkdownIt from 'markdown-it'
import Token from 'markdown-it/lib/token.mjs'

export function useMarkdownNumbering(md: MarkdownIt) {
    md.core.ruler.push('number_heading', (state) => {
        let counter = [0, 0, 0, 0, 0, 0]

        for (let i = 0; i < state.tokens.length; i++) {
            const token = state.tokens[i]

            if (token.type === 'heading_open') {
                const level = parseInt(token.tag.slice(1))

                if (level === 1) continue

                counter[level - 1] += 1
                for (let j = level; j < counter.length; j++) counter[j] = 0

                const numbering = counter.slice(1, level).join('.') + ' '

                const next = state.tokens[i + 1]
                if (next && next.type === 'inline') {
                    const spanToken = new Token('html_inline', '', 0)
                    spanToken.content = `<span class="heading-number">${numbering} </span>`
                    spanToken.level = next.level
                    next.children?.unshift(spanToken)
                }
            }
        }
    })
}
