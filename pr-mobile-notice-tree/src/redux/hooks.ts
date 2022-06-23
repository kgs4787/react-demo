import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';

export const useItsDispatch = () => useDispatch<AppDispatch>();
export const useItsSelector: TypedUseSelectorHook<RootState> = useSelector;