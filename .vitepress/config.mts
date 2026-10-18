import { defineConfig } from 'vitepress'
import path from 'node:path'
import { getSidebarItem, findFirstLink } from './helper/sidbar'
import { workspaces, navTree } from './constant'
import { genHomeIndex } from './helper/home_page'
import { useMarkdownNumbering } from './plugins/markdown-numbering'
import { useMarkdownVueComponent } from './plugins/markdown-vue-component'
import { viteMarkdownImage } from './plugins/vite-markdown-image'


const docRoot = path.resolve(__dirname, '..')

export default async () => {
  const workspaceResolveds: VPC.WorkspaceResolved[] = await Promise.all(workspaces.map(async ws => {
    const sidebar = (await getSidebarItem(docRoot, path.join(docRoot, ws.dir)))!
    return {
      label: sidebar.isFrontmatter ? sidebar.text : ws.label,
      dir: ws.dir,
      sidebar,
      entryLink: findFirstLink(sidebar) || '/',
    }
  }))

  await genHomeIndex(docRoot, workspaceResolveds)

  const sidebarMulti = workspaceResolveds.reduce((acc, ws) => {
    acc[ws.dir] = ws.sidebar.items!
    return acc
  }, {} as Record<string, VPC.SidebarItem[]>)

  const nav = navTree.map(item => {
    if (item.type === 'link') {
      if (item.workspaceDirs.length !== 1) {
        throw new Error(`For navItem of type link, the length of its workspace must be 1, but got ${item.workspaceDirs.length} in ${item.label}`)
      }
      const wsr = workspaceResolveds.find(ws => ws.dir === item.workspaceDirs[0])
      if (!wsr) {
        throw new Error(`Cannot find workspace ${item.workspaceDirs[0]} in ${item.label}`)
      }

      return {
        text: wsr.sidebar.isFrontmatter ? wsr.label : item.label,
        link: wsr.entryLink,
      }
    }

    if (item.type === 'children') {
      return {
        text: item.label,
        items: item.workspaceDirs.map(wsDir => {
          const wsr = workspaceResolveds.find(ws => ws.dir === wsDir)
          if (!wsr) {
            throw new Error(`Cannot find workspace ${wsDir} in ${item.label}`)
          }
          return {
            text: wsr.label,
            link: wsr.entryLink,
          }
        })
      }
    }

    throw new Error(`Unknown navItem type ${item.type} in ${item.label}`)
  })

  return defineConfig({
    title: "Sorceress's Note",
    description: 'A note for sorceress',
    head: [
      ['link', { rel: 'icon', type: 'image/x-icon', href: '/MyNote/favicon.ico' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:site_name', content: 'Sorceress\'s Note' }],
      ['meta', { name: 'google-site-verification', content: 'EbkZ0BRPgPljhAykPUNHc9dt6DtvljJxVizkeFa9N-Q' }],
    ],
    lang: 'zh-CN',
    base: '/MyNote',
    ignoreDeadLinks: true,
    themeConfig: {
      logo: '/logo.png',
      search: { provider: 'local' },
      socialLinks: [
        { icon: 'github', link: 'https://github.com/Sorceresssis/MyNote' }
      ],
      nav,
      sidebar: sidebarMulti,
      outline: 'deep',
    },
    markdown: {
      math: true,
      image: { lazyLoading: true },
      lineNumbers: true,
      config: (md) => {
        md.set({ html: false })
        useMarkdownNumbering(md)
        useMarkdownVueComponent(md)
      },
      languageAlias: {
        'svg': 'html',
        'mysql': 'sql',
      }
    },
    vite: {
      plugins: [
        viteMarkdownImage()
      ]
    }
  })
}
