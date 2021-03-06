import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Profile from '@/views/Profile.vue'
import Tasks from '@/views/Tasks.vue'

export default [
  { path: '/', component: Home, name:'home' },
  { path: '/login', component: Login, name:'login' },
  { path: '/dashboard/:_', 
    component: Dashboard, 
    name: 'dashboard',
    children:[
      {
        path:'profile',
        name:'profile',
        component: Profile
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: Tasks
      }
    ]
  }
]