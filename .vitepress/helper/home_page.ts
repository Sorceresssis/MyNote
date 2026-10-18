import fs from 'node:fs'



export async function genHomeIndex(docRoot: string, wsrs: VPC.WorkspaceResolved[]): Promise<void> {
    const indexPath = `${docRoot}/index.md`
    await fs.promises.writeFile(indexPath,
        `---
layout: home

hero:
    name: "Sorceress's Note"
    tagline: "Everything has its wonders, even darkness and silence."
    actions: ${wsrs.map(wsr => `
        - theme: alt
          text: ${wsr.label}
          link: ${wsr.entryLink}`
        ).join('')}
---
`
    )
}