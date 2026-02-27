import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 运营管理
  {
    path: '/operation',
    component: Layout,
    redirect: '/operation/carousel',
    name: 'Operation',
    meta: { title: '运营管理', icon: 'el-icon-s-operation' },
    children: [
      {
        path: 'carousel',
        name: 'Carousel',
        component: () => import('@/views/operation/carousel/index'),
        meta: { title: '首页轮播图', icon: 'el-icon-picture-outline' }
      },
      {
        path: 'tips',
        name: 'Tips',
        component: () => import('@/views/operation/tips/index'),
        meta: { title: '温馨提示', icon: 'el-icon-bell' }
      }
    ]
  },

  // 社区百科
  {
    path: '/encyclopedia',
    component: Layout,
    redirect: '/encyclopedia/community',
    name: 'Encyclopedia',
    meta: { title: '社区百科', icon: 'el-icon-reading' },
    children: [
      {
        path: 'community',
        name: 'Community',
        component: () => import('@/views/encyclopedia/community/index'),
        meta: { title: '社区信息管理', icon: 'el-icon-office-building' }
      },
      {
        path: 'community/add',
        name: 'CommunityAdd',
        component: () => import('@/views/encyclopedia/community/add'),
        meta: { title: '新增社区信息' },
        hidden: true
      },
      {
        path: 'policy',
        name: 'Policy',
        component: () => import('@/views/encyclopedia/policy/index'),
        meta: { title: '养老政策管理', icon: 'el-icon-s-order' }
      }
    ]
  },

  // 养老服务
  {
    path: '/service',
    component: Layout,
    redirect: '/service/recipes',
    name: 'Service',
    meta: { title: '养老服务', icon: 'el-icon-food' },
    children: [
      {
        path: 'recipes',
        name: 'Recipes',
        component: () => import('@/views/service/recipes/index'),
        meta: { title: '养老食谱管理', icon: 'el-icon-s-custom' }
      },
      {
        path: 'institutions',
        name: 'Institutions',
        component: () => import('@/views/service/institutions/index'),
        meta: { title: '养老机构管理', icon: 'el-icon-office-building' }
      },
      {
        path: 'health-centers',
        name: 'HealthCenters',
        component: () => import('@/views/service/health-centers/index'),
        meta: { title: '健康中心管理', icon: 'el-icon-s-cooperation' }
      },
      {
        path: 'health-guide',
        name: 'HealthGuide',
        component: () => import('@/views/service/health-guide/index'),
        meta: { title: '健康指南管理', icon: 'el-icon-document' }
      },
      {
        path: 'service-map',
        name: 'ServiceMap',
        component: () => import('@/views/service/service-map/index'),
        meta: { title: '服务地图管理', icon: 'el-icon-location' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
