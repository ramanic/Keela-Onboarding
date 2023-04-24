import Home from './components/Home.vue';
import Organization from './components/Organization.vue';
import Contacts from './components/Contacts.vue';
import Tags from './components/Tags.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/organizations',
    name: 'AddOrganization',
    component: Organization,
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: Contacts,
  },
  {
    path: '/tags',
    name: 'tags',
    component: Tags,
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('./components/Users.vue'),
  },
];

export default routes;
