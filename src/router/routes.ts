import type { RouteRecordRaw } from 'vue-router'
import adminRoutes from './routes/admin';
import userRoutes from "@/router/routes/user";

const routes: RouteRecordRaw[] = [
  ...adminRoutes,
  ...userRoutes,
  {
    path: '/demo',
    name: 'demo',
    component: () => import("@/components/DemoComponents.vue")
  }
]

export default routes
