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
      },
      {
        path: '/cart',
        name: 'cart',
        component: () => import('@/views/User/Cart.vue')
      },
      {
        path: '/checkout',
        name: 'checkout',
        component: () => import('@/views/User/Checkout.vue')
      },
      {
        path: '/borrowing-history',
        name: 'borrowing-history',
        component: () => import('@/views/User/BorrowingHistory.vue')
      },
      {
        path: '/wishlist',
        name: 'wishlist',
        component: () => import('@/views/User/Wishlist.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/components/User/Layout/Profile.vue'),
        children: [
          {
            path: '/profile',
            name: 'profile',
            component: () => import('@/views/User/MyProfile.vue')
          },
          {
            path: '/change-password',
            name: 'change-password',
            component: () => import('@/views/User/ChangePassword.vue')
          },
        ]
      },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/User/ForgotPassword.vue')
      },
      {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('@/views/User/ResetPassword.vue'),
        meta: { public: true }
      },
      {
        path: '/contact',
        name: 'contact',
        component: () => import('@/views/User/Contact.vue'),
        meta: { public: true }
      },
    ]
  },

]

export default userRoutes
