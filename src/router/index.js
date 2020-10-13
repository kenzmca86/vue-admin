import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import Dashboard from '../pages/Dashboard'
import Customers from '../pages/customers'
import Products from '../pages/product'
import Category from '../pages/category'
import Orders from '../pages/orders'
import Coupens from '../pages/coupens'
import Home from '../views/Home'
import Login from '../components/users/login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'product',
        name: 'product',
        component: Products,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'category',
        name: 'category',
        component: Category,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'customers',
        name: 'customers',
        component: Customers,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'orders',
        name: 'orders',
        component: Orders,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'coupens',
        name: 'coupens',
        component: Coupens,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'Settings',
        name: 'settings',
        component: Coupens,
        meta: {
          requiresAuth: true
        }
      },
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

const ifNotAuthenticated = (to, from, next) => {
  console.log(store.getters.isAuthenticated)
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

// const ifAuthenticated = (to, from, next) => {
//   if (store.getters.isAuthenticated) {
//     next()
//     return
//   }
//   next('/login')
// }

export default router
