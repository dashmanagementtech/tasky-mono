import type { RouteRecordRaw } from 'vue-router';

const projectRoutes: RouteRecordRaw[] = [
  {
    path: '/app/projects',
    meta: {
      layout: 'app',
      parent: '/app/projects',
      acl: [],
      name: 'projects'
    },
    children: [
      {
        path: '',
        name: 'projects',
        component: () => import('../view/Index.vue'),
      },
      {
        path: ':id',
        name: 'view-project',
        component: () => import('../view/ViewProject.vue'),
        children: [
          {
            path: 'add-sprint',
            name: 'add-sprint',
            component: () => import('../view/AddSprint.vue')
          }
        ]
      },
      {
        path: 'edit/:id',
        name: 'edit-project',
        component: () => import('../view/EditProject.vue')
      },
      {
        path: '',
        component: () => import('../view/Index.vue'),
        children: [
          {
            path: 'new',
            name: 'new-project',
            component: () => import('../view/NewProject.vue')
          },
          {
            path: 'view/:id',
            name: 'peek-project',
            meta: {
              side: true
            },
            component: () => import('../view/ViewProject.vue')
          }
        ]
      }
    ]
  },
]

export default projectRoutes;
