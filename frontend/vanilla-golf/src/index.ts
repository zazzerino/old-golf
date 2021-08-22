import { render, Route } from './ui';
import { initWebSocket } from './websocket';
import { store } from './store';

const root = document.getElementById('root');

if (root == null) { 
  throw new Error('root elem is null'); 
}

initWebSocket();
render(root, store.state);

// rerender after navigation
window.onpopstate = () => {
  store.publish('NAVIGATE', window.location.pathname as Route);
  render(root, store.state);
}

// rerender on state change
store.subscribe(state => {
  console.log('state updated: ' + JSON.stringify({ ...state, games: state.games.map(g => g.id) }));
  render(root, state);
});
