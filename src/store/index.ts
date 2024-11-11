// frontend/src/store/index.ts

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
import battleReducer from './battleSlice';
import socketReducer from './socketSlice';
import playerListReducer from './playerListSlice'; // Импортируем новый срез
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['player', 'battle'], // Не сохраняем сокетное состояние и список игроков
};

const rootReducer = combineReducers({
  player: playerReducer,
  battle: battleReducer,
  socket: socketReducer,
  playerList: playerListReducer, // Добавляем новый срез
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['socket'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
