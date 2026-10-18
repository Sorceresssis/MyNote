import type { Plugin } from 'vite'
import path from 'path'
import fs from 'fs'

export function viteMarkdownImage(): Plugin {
    return {
        name: 'vite-markdown-image',
        enforce: 'pre',
        transform(code, id) {
            if (!id.endsWith('.md')) return;

            const imageRegex = /!\[(.*?)\]\((.*?)\)/g;

            const replaced = code.replace(imageRegex, (match, alt, src) => {
                const resolvedPath = path.resolve(path.dirname(id), src);
                if (!fs.existsSync(resolvedPath)) {
                    return `![${alt}](/image/404.svg)`;
                }
                return match;
            });

            return replaced;
        }
    }
}
