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

  if (to.path.startsWith('/admin') && to.name !== 'login' && !adminToken) {
    next({ name: 'login' })
  } else if (to.name === 'login' && adminToken) {
    next({ path: '/admin/dashboard' })
  } else {
    next()
  }

  // if (to.path.startsWith('/user') && to.name !== 'user/login' && !userToken) {
  //   next({ name: 'user/login' })
  // } else if (to.name === 'user/login' && userToken) {
  //   next({ path: '/homepage' })
  // } else {
  //   next()
  // }

  // 🔹 Nếu chưa login, vào user (trừ `/homepage`) thì chuyển hướng đến `/user/login`
  if (to.path.startsWith('/user') && !userToken && to.path !== '/homepage') {
    return next({ path: '/user/login' });
  }
})

// router.beforeEach((to, from, next) => {
//   const adminToken = localStorage.getItem('admin_access_token');
//   const userToken = localStorage.getItem('user_access_token');
//
//   // Kiểm tra admin
//   if (to.path.startsWith('/admin')) {
//     if (!adminToken) {
//       return next({ name: 'login' });
//     }
//   }
//
//   // Kiểm tra user
//   if (to.path.startsWith('/user')) {
//     if (!userToken) {
//       return next({ name: 'login' });
//     }
//   }
//
//   next();
// });

// router.beforeEach((to, from, next) => {
//   const adminToken = localStorage.getItem('admin_access_token');
//   const userToken = localStorage.getItem('user_access_token');
//
//   // ✅ Xác định đúng route login
//   const isAdminLoginPage = to.name === 'admin/login';
//   const isUserLoginPage = to.name === 'user/login';
//
//   // 🔹 Nếu chưa đăng nhập, vào trang admin -> chuyển hướng đến login
//   if (to.path.startsWith('/admin') && !adminToken && !isAdminLoginPage) {
//     return next({ path: '/admin/login' });
//   }
//
//   // 🔹 Nếu chưa đăng nhập, vào trang user -> chuyển hướng đến login
//   if (to.path.startsWith('/user') && !userToken && !isUserLoginPage) {
//     return next({ path: '/login' }); // Đảm bảo đúng tên route login user
//   }
//
//   // 🔹 Nếu đã đăng nhập admin mà vào lại trang login, thì chuyển về dashboard
//   if (isAdminLoginPage && adminToken) {
//     return next({ path: '/admin/dashboard' });
//   }
//
//   // 🔹 Nếu đã đăng nhập user mà vào lại trang login, thì chuyển về homepage
//   if (isUserLoginPage && userToken) {
//     return next({ path: '/homepage' });
//   }
//
//   // 🔹 Nếu vào đúng `/admin` nhưng không có đường dẫn con, tự động chuyển về `/admin/dashboard`
//   if (to.path === '/admin' && adminToken) {
//     return next({ path: '/admin/dashboard' });
//   }
//
//   next();
// });

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
