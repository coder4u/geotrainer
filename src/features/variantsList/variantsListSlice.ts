import {createAppSlice} from "../../app/createAppSlice"
import type {PayloadAction} from "@reduxjs/toolkit";
import {Settlement} from "../map/mapAPI.ts";

export const questionCount = 10;
const answerCount = 4;
export const endIndex = Infinity;

export type VariantName = string;
export type VariantList = Settlement[];
export type gameSliceState = {
    questionIndex?: number;
    currentVariantList?: VariantList;
    currentAnswer?: string;
    leftVariants?: VariantList;
    allVariants?: VariantList;
}

const initialState: gameSliceState = {
    questionIndex: 0,
    currentAnswer: '',
    allVariants: undefined,
    currentVariantList: undefined,
    leftVariants: undefined,
}

const setNewQuestion = (state: gameSliceState, {allVariants, prevAnswer}: {
    allVariants: VariantList,
    prevAnswer?: VariantName
}) => {
    const leftVariants = (
        state.leftVariants && state.leftVariants.length > 0
            ? state.leftVariants
            : (state.allVariants || allVariants || [])
    );
    const answerRandomIndex = Math.floor(Math.random() * leftVariants.length);
    const answerData = leftVariants[answerRandomIndex];
    const answer = answerData.name;
    state.allVariants = allVariants;
    state.currentAnswer = answer;
    state.currentVariantList = [...allVariants]
        .sort(() => Math.random() - 0.5)
        .filter((item) => item.name !== answer)
        .slice(0, answerCount - 1)
        .concat(answerData)
        .sort(() => Math.random() - 0.5);
    const leftVariantsFiltered = leftVariants.filter((item) => item.name !== answer);

    if (prevAnswer) {
        state.leftVariants = leftVariantsFiltered.filter((item) => item.name !== prevAnswer);
    } else {
        state.leftVariants = leftVariantsFiltered;
    }
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const variantsListSlice = createAppSlice({
    name: "variantsList",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        reset: () => initialState,
        setAllVariants: ((state, action: PayloadAction<VariantList>) => {
            setNewQuestion(state, { allVariants: action.payload });
        }),
        questionAnswer: ((state, action: PayloadAction<string>) => {
            const nextIndex = (state.questionIndex || 0) + 1;

            if (nextIndex < questionCount) {
                state.questionIndex = nextIndex;
                setNewQuestion(state, { allVariants: state.allVariants as VariantList, prevAnswer: action.payload });
            } else {
                state.currentVariantList = undefined;
                state.currentAnswer = '';
                state.leftVariants = undefined;
                state.questionIndex = endIndex;
            }
        }),
    },
})

// Action creators are generated for each case reducer function.
export const {setAllVariants, questionAnswer, reset} = variantsListSlice.actions
