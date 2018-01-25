import ueditor from '@/pages/ueditor_demo.vue'
import dict from '@/pages/system/dict/dict_list.vue'
import menu from '@/pages/system/menu/menu_list.vue'
import role from '@/pages/system/role/role_list.vue'
import user from '@/pages/system/user/user_list.vue'
import updatePassword from '@/pages/system/user/update_password.vue'
import timer from '@/pages/timer/timer_list.vue'

const routes = [
  { path: '/ueditor', name: 'ueditor', component: ueditor },
  { path: '/dict', name: 'dict', component: dict },
  { path: '/menu', name: 'menu', component: menu },
  { path: '/role', name: 'role', component: role },
  { path: '/user', name: 'user', component: user },
  { path: '/updatePassword', name: 'updatePassword', component: updatePassword },
  { path: '/timer', name: 'timer', component: timer }
]

export default routes
