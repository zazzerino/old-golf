import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { userReducer } from '../user';
import { gameReducer } from '../game/game';

export const store = configureStore({
  reducer: {
    user: userReducer,
    game: gameReducer,
  },
});

console.log('initial state:')
console.log(store.getState());

store.subscribe(() => {
  console.log('state updated:');
  console.log(store.getState());
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
