import { getPage, Route } from './ui';
import { initWebSocket } from './websocket';
import { State, store } from './store';
import { emptyElement } from './util';

const root = document.getElementById('root');

if (root == null) { 
  throw new Error('root elem is null'); 
}

initWebSocket();

// redraw after navigation
window.onpopstate = () => {
  store.publish('NAVIGATE', window.location.pathname as Route);
  render(root, store.state);
}

function render(root: HTMLElement, state: State) {
  emptyElement(root);
  const page = getPage(state.route);
  root.appendChild(page);
}

// rerender on state change
store.subscribe(state => {
  console.log('state updated: ' + JSON.stringify({ ...state, games: state.games.map(g => g.id) }));
  render(root, state);
});
