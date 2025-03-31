import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const adminToken = localStorage.getItem('admin_access_token')
  const userToken = localStorage.getItem('user_access_token')

  if (to.path === '/signup' && userToken) {
    return next({ name: 'homepage' });
  }

  if (to.path.startsWith('/admin') && to.name !== 'login' && !adminToken) {
    next({ name: 'login' })
  } else if (to.name === 'login' && adminToken) {
    next({ path: '/admin/dashboard' })
  } else {
    next()
  }

  if (to.path.startsWith('/user') && !userToken && to.path !== '/') {
    return next({ path: '/user/login' });
  }
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin')) {
    document.title = 'Admin Kiai Library';
  } else {
    document.title = 'Kiai Library';
  }
  next();
});

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin')) {
    document.body.className = 'admin-theme';
  } else {
    document.body.className = 'user-theme';
  }
  next();
});

export default router
