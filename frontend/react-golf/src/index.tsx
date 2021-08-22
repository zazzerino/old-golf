import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { store } from './store';
import { Provider } from 'react-redux';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

type StoreType = typeof store;

function prettyState(store: StoreType) {
  const state = store.getState();
  const golf = { ...(state.golf), games: []}
  return JSON.stringify({ ...state, golf });
}

console.log('initial state: ' + prettyState(store));

store.subscribe(() => console.log('state updated: ' + prettyState(store)));
