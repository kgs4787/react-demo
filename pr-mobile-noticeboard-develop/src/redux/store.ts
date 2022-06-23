import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './menu/menuSlice'


export const store = configureStore({
    reducer: {
        menu: menuReducer,
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>