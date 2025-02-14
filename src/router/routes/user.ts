import type {RouteRecordRaw} from "vue-router";

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/',
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
      },
      {
        path: '/signup',
        name: 'signup',
        component: () => import('@/views/User/Signup.vue')
      },
      {
        path: '/login',
        name: 'user/login',
        component: () => import('@/views/User/Login.vue')
      },
      {
        path: '/books/:slug',
        name: 'book-detail',
        component: () => import('@/views/User/BookDetail.vue')
      },
      {
        path: '/books',
        name: 'books',
        component: () => import('@/views/User/BookList.vue')
      }
    ]
  },

]

export default userRoutes
