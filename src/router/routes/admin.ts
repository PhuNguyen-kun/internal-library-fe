import type { RouteRecordRaw } from 'vue-router';

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/login',
    name: 'login',
    component: () => import('@/views/Admin/Login.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/components/Admin/Layout/Layout.vue'),
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'admin/dashboard',
        component: () => import('@/views/Admin/Dashboard.vue'),
      },
      {
        path: 'books',
        name: 'admin/books',
        component: () => import('@/views/Admin/Books.vue'),
      },
      {
        path: 'categories',
        name: 'admin/categories',
        component: () => import('@/views/Admin/Categories.vue'),
      },
      {
        path: 'users',
        name: 'admin/users',
        component: () => import('@/views/Admin/Users.vue'),
      },
      {
        path: 'employees',
        name: 'admin/employees',
        component: () => import('@/views/Admin/Employees.vue'),
      },
      {
        path: 'authors',
        name: 'admin/authors',
        component: () => import('@/views/Admin/Authors.vue'),
      },
      {
        path: 'publishers',
        name: 'admin/publishers',
        component: () => import('@/views/Admin/Publishers.vue'),
      },
      {
        path: 'orders',
        name: 'admin/orders',
        component: () => import('@/views/Admin/Orders.vue'),
      },
      {
        path: 'reviews',
        name: 'admin/reviews',
        component: () => import('@/views/Admin/Reviews.vue'),
      },
    ],
  },
];

export default adminRoutes;
