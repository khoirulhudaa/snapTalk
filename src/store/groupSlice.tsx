import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface groupStates {
    group: any,
}

const initialState: groupStates = {
    group: {},
}

const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        getGroupDetail: (state, action:PayloadAction<any>) => {
            state.group = {
                ...state.group,
                ...action.payload
            }   
        },
    }
})

export const { getGroupDetail } = groupSlice.actions
export default groupSlice.reducer