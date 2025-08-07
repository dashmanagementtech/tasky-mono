import type { IRoutes } from '../types'

import ClientIcon from '../icons/ClientIcon.vue'
import DashboardIcon from '../icons/DashboardIcon.vue'
import HelpIcon from '../icons/HelpIcon.vue'
import ProjectIcon from '../icons/ProjectIcon.vue'
import ResourcesIcon from '../icons/ResourcesIcon.vue'
import SettingIcon from '../icons/SettingIcon.vue'
import StaffIcon from '../icons/StaffIcon.vue'

export const ROUTES: IRoutes[] = [
  {
    uri: '/app/dashboard',
    title: 'Dashboard',
    icon: DashboardIcon,
  },
  {
    uri: '/app/projects',
    title: 'Projects',
    icon: ProjectIcon,
  },
  {
    uri: '/app/staff',
    title: 'Staff',
    icon: StaffIcon,
  },
  {
    uri: '/app/clients',
    title: 'Clients',
    icon: ClientIcon,
  },
  {
    uri: '//dashtechmanagement.com/blog',
    title: 'Resources',
    icon: ResourcesIcon,
    external: true
  },
]

export const COMMON: IRoutes[] = [
  {
    uri: '/settings',
    title: 'Settings',
    icon: SettingIcon,
  },
]
