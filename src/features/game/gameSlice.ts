import {createAppSlice} from "../../app/createAppSlice"

type gameStep = 'selectArea' | 'drawRectangle' | 'questions' | 'gameOver';
export type gameSliceState = {
    step: gameStep;
    score?: number;
}

const initialState: gameSliceState = {
    step: 'selectArea',
    score: 0,
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const gameSlice = createAppSlice({
    name: "game",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setFirstStep: (state) => {
            state.score = 0;
            state.step = 'selectArea';
        },
        setNextStep: (state) => {
            if (state.step === 'selectArea') {
                state.score = 0;
                state.step = 'drawRectangle';
            } else if (state.step === 'drawRectangle') {
                state.score = 0;
                state.step = 'questions';
            } else if (state.step === 'questions') {
                state.step = 'gameOver';
            } else if (state.step === 'gameOver') {
                state.score = 0;
                state.step = 'selectArea';
            }
        },
        scoreUp: (state) => {
            state.score = (state.score || 0) + 1;
        },
        setStepQuestion: (state) => {
            state.score = 0;
            state.step = 'questions';
        },
    },
})

// Action creators are generated for each case reducer function.
export const {setNextStep, setFirstStep, setStepQuestion, scoreUp} = gameSlice.actions
