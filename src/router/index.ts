import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'neco',
      redirect: '/lobby',
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: '/lobby',
          name: 'lobby',
          component: () => import('../views/Lobby/LobbyView.vue'),
          meta: { title: 'NMO' },
        },
        {
          path: '/list',
          name: 'list',
          component: () => import('../views/List/ListView.vue'),
          meta: { title: 'NMO服务器列表' },
        },
        {
          path: '/activity',
          name: 'activity',
          component: () => import('../views/Activity/ActivityView.vue'),
          meta: { title: 'NMO活动列表' },
        },
        {
          path: '/news/:id?',
          name: 'news',
          component: () => import('../views/News/NewsView.vue'),
          meta: { title: 'NMO新闻' },
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/About/AboutView.vue'),
          meta: { title: '关于NMO' },
        },
      ],
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
    },
    {
      path: '/:catchAll(.*)*',
      redirect: '/404',
    },
  ],
})

router.beforeEach((to, _, next) => {
  if (to.meta.title) {
    document.title = String(to.meta.title)
  }

  next()
})

export { router }
