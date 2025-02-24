import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TestState {
    value: number;
}

const initialState: TestState = {
    value: 2,
};

const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        increment: (state, action: PayloadAction<number>) => {
            state.value *= action.payload;
        },
        decrement: (state, action: PayloadAction<number>) => {
            state.value /= action.payload;
        },
    },
});

export const { increment, decrement } = testSlice.actions;
export default testSlice.reducer;
