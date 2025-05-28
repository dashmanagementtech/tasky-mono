import type { IRoutes } from '../types'

import DashboardIcon from '../icons/DashboardIcon.vue'
import ProjectIcon from '../icons/ProjectIcon.vue'
import StaffIcon from '../icons/StaffIcon.vue'
import ClientIcon from '../icons/ClientIcon.vue'
import ResourcesIcon from '../icons/ResourcesIcon.vue'
import HelpIcon from '../icons/HelpIcon.vue'
import SettingIcon from '../icons/SettingIcon.vue'

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
    uri: '/app/resources',
    title: 'Resources',
    icon: ResourcesIcon,
  },
]

export const COMMON: IRoutes[] = [
  {
    uri: '/help',
    title: 'Help',
    icon: HelpIcon
  },
  {
    uri: '/settings',
    title: 'Settings',
    icon: SettingIcon
  }
]
