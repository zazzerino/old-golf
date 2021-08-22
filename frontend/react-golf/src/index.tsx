import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';
import { store } from './store/store';
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

function prettify(store: StoreType) {
  const state = store.getState().golf;
  return JSON.stringify({ ...state, games: [] });
}

function logState() {
  console.log('state: ' + prettify(store));
}

logState();
store.subscribe(() => logState());
