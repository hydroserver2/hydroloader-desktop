import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/RootLayout.vue'),
    beforeEnter: (to, from, next) => {
      let originalUrl = new URL(window.location.href)
      next(originalUrl.searchParams.get('route') + '?id=' + originalUrl.searchParams.get('id'))
    }
  },
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'file-streams', component: () => import('pages/FileStreams.vue') },
      { path: 'file-templates', component: () => import('pages/FileTemplates.vue') },
      { path: 'file-monitoring', component: () => import('pages/FileMonitoring.vue') }
    ]
  },
  {
    path: '/modal',
    component: () => import('layouts/ModalLayout.vue'),
    children: [
      { path: 'file-stream-wizard', component: () => import('pages/FileStreamWizard.vue') }
    ]
  }
];

export default routes;
