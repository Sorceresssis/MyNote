declare namespace VPC {
    interface SidebarItem {
        text: string,
        isFrontmatter: boolean,
        collapsed?: boolean,
        items?: VPC.SidebarItem[],
        link?: string,
    }

    type Workspace = {
        label: string
        dir: string
    }

    type WorkspaceResolved = VPC.Workspace & {
        sidebar: VPC.SidebarItem
        entryLink: string
    }

    type NavTreeItem = {
        label: string
        type: 'children' | 'link',
        workspaceDirs: string[]
    }
}