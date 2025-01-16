import type {RouteRecordRaw} from "vue-router";

const userRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'user',
    component: () => import('@/components/User/Layout/Layout.vue'),
    redirect: '/homepage',
    children: [
      {
        path: '/homepage',
        name: 'homepage',
        component: () => import('@/views/User/Homepage.vue')
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/views/User/About.vue')
      }
    ]
  },

]

export default userRoutes
