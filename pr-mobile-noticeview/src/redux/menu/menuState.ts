import {Lnb} from '@/types'

export interface MenuState {
    selectedMenu: string
    leftMenuExpanded: boolean

    currentRequestId: string | undefined
    lnb: Lnb[] | null
    lnbLoading: boolean
    lnbError: any | null 
    leftSubMenu: LeftSubMenu[]
    curFocusMenu: string
    curOpenMenu: string
}

export interface LeftSubMenu {
  controlKey: string
  id: string
  label: string
  rootUri: string
  subMenu: {
    id: string
    name: string
    uri: string
  }[]
}

export const initialState: MenuState = {
    selectedMenu: '',
    leftMenuExpanded: true,

    currentRequestId: '',
    lnb: null,
    lnbLoading: false,
    lnbError: null,
    leftSubMenu: [
        {
            controlKey: 'leftMenukey1',
            id: 'dashboard',
            label: 'DashBoard',
            rootUri: '',
            subMenu: [
                {
                    id: 'dashboard',
                    name: 'DashBoard',
                    uri: '',
                },
                {
                    id: 'dashboard',
                    name: 'KanBan Board',
                    uri: '',
                },
                {
                    id: 'dashboard',
                    name: 'My DashBoard',
                    uri: '',
                },
                {
                    id: 'dashboard',
                    name: 'Project DashBoard',
                    uri: '',
                },
                {
                    id: 'dashboard',
                    name: 'HelpDesk DashBoard',
                    uri: '',
                },
                

            ],
        },
        {
            controlKey: 'leftMenukey2',
            id: 'myproject',
            label: 'My프로젝트',
            rootUri: '',
            subMenu: [{
                id: 'projectmanage',
                name: '프로젝트 관리',
                uri: '',
            }],
        },
        {
            controlKey: 'leftMenukey3',
            id: 'issuemanage',
            label: '이슈관리',
            rootUri: '',
            subMenu: [{
                id: 'issueinfo',
                name: '이슈정보',
                uri: '',
            }],
        },
        {
            controlKey: 'leftMenukey4',
            id: 'devops',
            label: 'DevOps',
            rootUri: '',
            subMenu: [{
                    id: 'devopsmanage',
                    name: 'DevOps 관리',
                    uri: '',
                },
                {
                    id: 'devopsdashboard',
                    name: 'Dashboard',
                    uri: '',
                },],
        },
        {
            controlKey: 'leftMenukey5',
            id: 'qna',
            label: 'Q&A',
            rootUri: '',
            subMenu: [
                {
                    id: 'servicerequest',
                    name: 'Dashboard',
                    uri: '',
                }
            ],
        },
        {
            controlKey: 'leftMenukey6',
            id: 'options',
            label: '환경설정',
            rootUri: '',
            subMenu: [
                {
                    id: 'issuestatemanage',
                    name: '이슈 상태관리',
                    uri: '',
                },
                {
                    id: 'workflowmanage',
                    name: 'WorkFolw관리',
                    uri: '',
                },
                {
                    id: 'userdefinefield',
                    name: '사용자 정의 필드',
                    uri: '',
                },
                {
                    id: 'issuetypemanage',
                    name: '이슈 타입관리',
                    uri: '',
                },
                {
                    id: 'itsnotice',
                    name: '공지사항',
                    uri: '',
                },
                {
                    id: 'itsgitmanage',
                    name: 'Git관리',
                    uri: '',
                }
            ],
        },
    ],
    curFocusMenu: '',
    curOpenMenu: '',

}