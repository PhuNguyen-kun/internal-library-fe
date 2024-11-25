import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'login',
    component: () => import('@/views/Admin/Login.vue')
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('@/views/Admin/Dashboard.vue')
  }
]

export default routes
