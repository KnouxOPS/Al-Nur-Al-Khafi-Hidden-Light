import Home from '../views/Home.vue';
import Biography from '../views/Biography.vue';
import Hadith from '../views/Hadith.vue';
import Companions from '../views/Companions.vue';
import Battles from '../views/Battles.vue';
import Wisdom from '../views/Wisdom.vue';
import About from '../views/About.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/biography', name: 'biography', component: Biography },
  { path: '/hadith', name: 'hadith', component: Hadith },
  { path: '/companions', name: 'companions', component: Companions },
  { path: '/battles', name: 'battles', component: Battles },
  { path: '/wisdom', name: 'wisdom', component: Wisdom },
  { path: '/about', name: 'about', component: About },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

export default routes;