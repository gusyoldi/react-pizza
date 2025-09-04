import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Hook para dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook para selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
