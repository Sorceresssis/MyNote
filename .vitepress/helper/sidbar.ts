import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import _ from 'lodash'


interface Frontmatter {
    title: string,
    text: string,
    showInSidebar?: boolean,
    bindLink?: boolean,
}

const DEFAULT_FRONTMATTER: Frontmatter = {
    title: '',
    text: '',
    showInSidebar: true,
    bindLink: false,
}

const INDEX_FILE_NAME = 'index.md'

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

async function parseFrontmatter(filePath: string) {
    const fullPath = path.resolve(filePath)
    const content = await fs.promises.readFile(fullPath, 'utf-8')

    const { data } = matter(content)
    const frontmatter = data as Frontmatter

    return frontmatter
}

export async function getSidebarItem(docRoot: string, fullPath: string): Promise<VPC.SidebarItem | void> {
    const stat = await fs.promises.stat(fullPath)
    if (stat.isFile()) {
        if (!fullPath.endsWith('.md')) return

        const frontmatter = { ...DEFAULT_FRONTMATTER, ...(await parseFrontmatter(fullPath)) }

        if (!frontmatter.showInSidebar) return

        return {
            text: frontmatter.text || path.basename(fullPath, path.extname(fullPath)),
            isFrontmatter: Boolean(frontmatter.text),
            link: `/${path.relative(docRoot, fullPath).replace(/\\/g, '/')}`,
        } as VPC.SidebarItem
    }

    if (stat.isDirectory()) {
        const entries = await fs.promises.readdir(fullPath)

        const hasIndexFile = entries.includes(INDEX_FILE_NAME)
        const indexFilePath = path.join(fullPath, INDEX_FILE_NAME)

        const frontmatter = hasIndexFile
            ? { ...DEFAULT_FRONTMATTER, ...(await parseFrontmatter(indexFilePath)) }
            : _.cloneDeep(DEFAULT_FRONTMATTER)

        if (!frontmatter.showInSidebar) return

        const item: VPC.SidebarItem = {
            text: frontmatter.text || path.basename(fullPath, path.extname(fullPath)),
            isFrontmatter: Boolean(frontmatter.text),
            collapsed: false,
        }

        item.items = (await Promise.all(entries
            .filter(entry => {
                return !entry.startsWith('index')
                    && !entry.startsWith('.')
                    && !entry.startsWith('assets')
                    && !entry.startsWith('image')
            })
            .sort(((a, b) => collator.compare(a, b)))
            .map(async entry => getSidebarItem(docRoot, path.join(fullPath, entry)))))
            .filter(item => item !== void 0) as VPC.SidebarItem[]

        if (frontmatter.bindLink) {
            item.link = `/${path.relative(docRoot, indexFilePath).replace(/\\/g, '/')}`
        }

        return item
    }
}


export function findFirstLink(sidebarItem: VPC.SidebarItem): string | void {
    if (sidebarItem.link) return sidebarItem.link
    if (!sidebarItem.items || sidebarItem.items.length === 0) return

    for (const item of sidebarItem.items) {
        const link = findFirstLink(item)

        if (link) return link
    }
}
