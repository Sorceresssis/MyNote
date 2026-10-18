export const REPOSITORY = 'https://github.com/Sorceresssis/MyNote'


enum WorkspaceDir {
    // CS: 计算机
    JAVASCRIPT = 'CS1_Language/CS1.1_JavaScript',
    PYTHON = 'CS1_Language/CS1.2_Python',
    JAVA = 'CS1_Language/CS1.3_Java',
    CPP = 'CS1_Language/CS1.4_Cpp',
    COMPUTER_NETWORK = 'CS2_Fundamentals/CS2.1_ComputerNetwork',
    MULTIMEDIA = 'CS2_Fundamentals/CS2.3_Multimedia',
    HARDWARE = 'CS2_Fundamentals/CS2.5_Hardware',
    DATABASE = 'CS3_Database',
    WEB = 'CS4_Web',
    FRONTEND = 'CS5_Frontend',
    BACKEND = 'CS6_Backend',
    ANDROID = 'CS7_Android',
    TOOLS = 'CS8_Tools',

    // LF: 生活
    LIVELIHOOD = 'LF1_Livelihood',
    HEALTH = 'LF2_Health',
}

export const workspaces: VPC.Workspace[] = [
    { label: 'JavaScript', dir: WorkspaceDir.JAVASCRIPT },
    { label: 'Python', dir: WorkspaceDir.PYTHON },
    { label: 'Java', dir: WorkspaceDir.JAVA },
    { label: 'C++', dir: WorkspaceDir.CPP },
    { label: '计算机网络', dir: WorkspaceDir.COMPUTER_NETWORK },
    { label: '多媒体', dir: WorkspaceDir.MULTIMEDIA },
    { label: '硬件', dir: WorkspaceDir.HARDWARE },
    { label: '数据库', dir: WorkspaceDir.DATABASE },
    { label: 'Web 基础', dir: WorkspaceDir.WEB },
    { label: '前端', dir: WorkspaceDir.FRONTEND },
    { label: '后端', dir: WorkspaceDir.BACKEND },
    { label: 'Android', dir: WorkspaceDir.ANDROID },
    { label: '工具', dir: WorkspaceDir.TOOLS },
    { label: '生计', dir: WorkspaceDir.LIVELIHOOD },
    { label: '健康', dir: WorkspaceDir.HEALTH },
]

export const navTree: VPC.NavTreeItem[] = [
    {
        label: 'Language',
        type: 'children',
        workspaceDirs: [
            WorkspaceDir.JAVASCRIPT,
            WorkspaceDir.PYTHON,
            WorkspaceDir.JAVA,
            WorkspaceDir.CPP,
        ]
    },
    {
        label: '计算机基础',
        type: 'children',
        workspaceDirs: [
            WorkspaceDir.COMPUTER_NETWORK,
            WorkspaceDir.MULTIMEDIA,
            WorkspaceDir.HARDWARE,
            WorkspaceDir.DATABASE,
        ]
    },
    {
        label: 'Web',
        type: 'children',
        workspaceDirs: [
            WorkspaceDir.WEB,
            WorkspaceDir.FRONTEND,
            WorkspaceDir.BACKEND,
        ]
    },
    {
        label: 'Android',
        type: 'link',
        workspaceDirs: [WorkspaceDir.ANDROID]
    },
    {
        label: '工具',
        type: 'link',
        workspaceDirs: [WorkspaceDir.TOOLS]
    },
    {
        label: '生活',
        type: 'children',
        workspaceDirs: [
            WorkspaceDir.LIVELIHOOD,
            WorkspaceDir.HEALTH,
        ]
    },
]
