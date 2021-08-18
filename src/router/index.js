import { createRouter, createWebHistory } from '@ionic/vue-router';
import Dashboard from '@/pages/Dashboard.vue';
// import VOD from '@/pages/VOD.vue';
import Stream from '@/pages/Stream.vue';
import livestreamManage from '@/pages/livestreamManage.vue';
import VODBucketManage from '@/pages/VODBucketManage.vue';
import VODBucketManageredirect from '@/pages/VODBucketManage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/stream/live'
  },
  {
		path: '/dashboard',
		name: 'Dashboard',
		component: Dashboard
	},
  {
		path: '/stream/:type',
		name: 'Stream',
		component: Stream
	},
  {
		path: '/stream/:type',
		name: 'VOD',
		component: Stream
	},
  {
		path: '/livestreams/:streamId',
		name: 'LivestreamManage',
		component: livestreamManage
	},
	{
		path: '/vodstreams/:streamId/:sname/:fname',
		name: 'VODBucketManage',
		component: VODBucketManage
	},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
