// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
import battleReducer from './battleSlice';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

// Создание Redux store
const store = configureStore({
  reducer: {
    player: playerReducer,
    battle: battleReducer,
  },
});

// Типы для RootState и AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Кастомные хуки для использования в компонентах
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Экспортируем store по умолчанию
export default store;
