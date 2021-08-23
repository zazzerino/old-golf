import { State, store } from './store';
import { gamePage, homePage } from './ui';

export type Route = '/' | '/game';

export interface Link {
  route: Route;
  text: string;
}

export const LINKS: Link[] = [
  { route: '/', text: 'Home' },
  { route: '/game', text: 'Game' }
];

export function navigate(route: Route) {
  window.history.pushState({}, route, window.location.origin + route)
  store.publish('NAVIGATE', route);
}

export const routes: Record<Route, (state: State) => HTMLElement> = {
  '/': homePage,
  '/game': gamePage,
}
