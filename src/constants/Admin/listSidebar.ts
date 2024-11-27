interface MenuItems {
  name?: string
  icon?: any
  href?: string
  separator?: boolean
  action?: string
}

import DashboardIcon from '@/assets/img/Admin/dashboard.svg'
import OrderListsIcon from '@/assets/img/Admin/order-lists.svg'
import ProductStockIcon from '@/assets/img/Admin/product-stock.svg'
import ContactIcon from '@/assets/img/Admin/contact.svg'
import UiElementsIcon from '@/assets/img/Admin/ui-elements.svg'
import TeamIcon from '@/assets/img/Admin/team.svg'
import TableIcon from '@/assets/img/Admin/table.svg'
import LogoutIcon from '@/assets/img/Admin/logout.svg'

export const menuItems: MenuItems[] = [
  { name: 'Dashboard', icon: DashboardIcon, href: '/admin/dashboard' },
  { name: 'Sách', icon: TeamIcon, href: '/admin/books' },
  { name: 'Danh mục sách', icon: ProductStockIcon, href: '/admin/categories' },
  { name: 'Người dùng', icon: ContactIcon, href: '/admin/users' },
  { name: 'Nhân viên', icon: TeamIcon, href: '/admin/employees' },
  { separator: true },
  { name: 'Tác giả', icon: TeamIcon, href: '/admin/authors' },
  { name: 'Nhà xuất bản', icon: TableIcon, href: '/admin/publishers' },
  { name: 'Quản lý đơn mượn', icon: OrderListsIcon, href: "/admin/orders" },
  { name: 'Đánh giá', icon: UiElementsIcon, href: '/admin/reviews' },
  { separator: true },
  { name: 'Logout', icon: LogoutIcon, action: 'logout' }
]
