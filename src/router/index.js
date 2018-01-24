import ueditor from '@/pages/ueditor_demo.vue'
import dict from '@/pages/dict/dict_list.vue'
import menu from '@/pages/menu/menu_list.vue'
import role from '@/pages/role/role_list.vue'
import user from '@/pages/user/user_list.vue'
import updatePassword from '@/pages/user/update_password.vue'

const routes = [
  { path: '/ueditor', name: 'ueditor', component: ueditor },
  { path: '/dict', name: 'dict', component: dict },
  { path: '/menu', name: 'menu', component: menu },
  { path: '/role', name: 'role', component: role },
  { path: '/user', name: 'user', component: user },
  { path: '/updatePassword', name: 'updatePassword', component: updatePassword }
]

export default routes
