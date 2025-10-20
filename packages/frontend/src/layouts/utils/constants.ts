import type { IRoutes } from '../types'

import ClientIcon from '../icons/ClientIcon.vue'
import DashboardIcon from '../icons/DashboardIcon.vue'
import ProjectIcon from '../icons/ProjectIcon.vue'
import ResourcesIcon from '../icons/ResourcesIcon.vue'
import SettingIcon from '../icons/SettingIcon.vue'
import StaffIcon from '../icons/StaffIcon.vue'

export const ROUTES: IRoutes[] = [
  {
    uri: '/app/dashboard',
    title: 'Dashboard',
    icon: DashboardIcon,
    acl: ['ADMIN', 'USER']
  },
  {
    uri: '/app/projects',
    title: 'Projects',
    icon: ProjectIcon,
    acl: ['ADMIN', 'USER']
  },
  {
    uri: '/app/staff',
    title: 'Staff',
    icon: StaffIcon,
    acl: ['ADMIN', 'SUPER_ADMIN']
  },
  {
    uri: '/app/clients',
    title: 'Clients',
    icon: ClientIcon,
    acl: ['ADMIN', 'SUPER_ADMIN']
  },
  {
    uri: '//dashtechmanagement.com/blog',
    title: 'Resources',
    icon: ResourcesIcon,
    external: true,
    acl: ['ADMIN', 'USER']
  },
]

export const COMMON: IRoutes[] = [
  {
    uri: '/settings',
    title: 'Settings',
    icon: SettingIcon,
    acl: ['ADMIN', 'USER']
  },
]
