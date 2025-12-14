import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Biography from '../views/Biography.vue';
import Timeline from '../views/Timeline.vue';
import About from '../views/About.vue';
import Contribute from '../views/Contribute.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/biography', name: 'Biography', component: Biography },
  { path: '/timeline', name: 'Timeline', component: Timeline },
  { path: '/about', name: 'About', component: About },
  { path: '/contribute', name: 'Contribute', component: Contribute }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;