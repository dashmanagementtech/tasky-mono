import type { RouteRecordRaw } from 'vue-router'

const projectRoutes: RouteRecordRaw[] = [
  {
    path: '/app/projects',
    meta: {
      layout: 'app',
      parent: '/app/projects',
      name: 'projects',
      protected: true,
    },
    children: [
      {
        path: ':id',
        name: 'view-project',
        component: () => import('../view/ViewProject.vue'),
        children: [
          {
            path: 'add-sprint',
            name: 'add-sprint',
            component: () => import('../view/AddSprint.vue'),
            meta: {
              acl: ['ADMIN', 'SUPER_ADMIN'],
            },
          },
          {
            path: ':sprintId/add-task',
            name: 'add-task-to-sprint',
            component: () => import('../view/AddTask.vue'),
            meta: {
              acl: ['ADMIN', 'SUPER_ADMIN'],
            },
          },
          {
            path: ':sprintId/end',
            name: 'end-sprint',
            component: () => import('../view/EndSprint.vue'),
            meta: {
              acl: ['ADMIN', 'SUPER_ADMIN'],
            },
          },
          {
            path: ':sprintId/:taskId',
            name: 'view-sprint-task',
            component: () => import('../view/ViewTask.vue'),
          },
          {
            path: 'add-task',
            name: 'add-task',
            component: () => import('../view/AddTask.vue'),
          },
          {
            path: 'edit',
            name: 'edit-project',
            component: () => import('../view/EditProject.vue'),
            meta: {
              acl: ['ADMIN', 'SUPER_ADMIN'],
            },
          },
          {
            path: 'add-document',
            name: 'add-document',
            component: () => import('../view/AddDcument.vue'),
            meta: {
              acl: ['ADMIN', 'SUPER_ADMIN'],
            },
          },
        ],
      },
      {
        path: '',
        name: 'projects',
        component: () => import('../view/Index.vue'),
        children: [
          {
            path: 'new',
            name: 'new-project',
            component: () => import('../view/NewProject.vue'),
            meta: {
              acl: ['ADMIN', 'SUPER_ADMIN'],
            },
          },
          {
            path: 'view/:id',
            name: 'peek-project',
            meta: {
              side: true,
            },
            component: () => import('../view/ViewProject.vue'),
          },
        ],
      },
    ],
  },
]

export default projectRoutes
