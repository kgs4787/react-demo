import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {  } from './menuActions'
import { initialState } from './menuState'

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setSelectedMenu(state, action: PayloadAction<string>) {
            state.selectedMenu = action.payload
        },
        changeLeftMenuExpandedFg(state, action: PayloadAction<boolean>) {
            state.leftMenuExpanded = action.payload
        },
    }
})

export const { setSelectedMenu, changeLeftMenuExpandedFg } = menuSlice.actions
export default menuSlice.reducer