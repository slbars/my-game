// src/index/index.ts

import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
import battleReducer from './battleSlice';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

// Создание Redux index
const index = configureStore({
  reducer: {
    player: playerReducer,
    battle: battleReducer,
  },
});

// Типы для RootState и AppDispatch
export type RootState = ReturnType<typeof index.getState>;
export type AppDispatch = typeof index.dispatch;

// Кастомные хуки для использования в компонентах
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Экспорт index по умолчанию
export default index;
