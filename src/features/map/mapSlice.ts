import {createAppSlice} from "../../app/createAppSlice"
import type {PayloadAction} from "@reduxjs/toolkit";
import {RectangleBounds} from "./mapAPI.ts";

type mapSliceState = {
    rectangleBounds: RectangleBounds | null;
}

const initialState: mapSliceState = {
    rectangleBounds: null,
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const mapSlice = createAppSlice({
    name: "map",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setRectangleBounds: ((state, action: PayloadAction<RectangleBounds | null>) => {
            state.rectangleBounds = action.payload;
        }),
    },
})

// Action creators are generated for each case reducer function.
export const {setRectangleBounds} = mapSlice.actions
