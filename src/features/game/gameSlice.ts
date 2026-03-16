import {createAppSlice} from "../../app/createAppSlice"
import type {PayloadAction} from "@reduxjs/toolkit";
import {Settlement} from "../map/mapAPI.ts";

const questionCount = 10;
const answerCount = 4;

export type VariantName = string;
export type VariantList = Settlement[];
export type GameAnswer = {
    isCorrect: boolean;
    answer: string;
}

export type gameSliceState = {
    step: string;
    overlayText: string;
    buttonText: string;
    questionIndex?: number;
    score?: number;
    currentVariantList?: VariantList;
    currentAnswer?: string;
    leftVariants?: VariantList;
    allVariants?: VariantList;
}

type gameStep = 'selectArea' | 'drawRectangle' | 'questions' | 'gameOver';

const steps: Record<gameStep, gameSliceState> = {
    'selectArea': {
        step: 'selectArea',
        overlayText: 'Please select the target area on the map.',
        buttonText: 'Next',
    },
    'drawRectangle': {
        step: 'drawRectangle',
        overlayText: 'Please draw a rectangle on the map.',
        buttonText: '',
    },
    'questions': {
        step: 'questions',
        overlayText: 'What is the name of the chosen city or village?',
        buttonText: '',
        questionIndex: 0,
        score: 0,
        currentVariantList: [],
        leftVariants: [],
    },
    'gameOver': {
        step: 'gameOver',
        overlayText: 'Game over',
        buttonText: 'Play again',
        questionIndex: 0,
        currentAnswer: '',
        allVariants: [],
        currentVariantList: [],
        leftVariants: [],
    }
}

const initialState: gameSliceState = {
    ...steps['selectArea'],
}

const setNewQuestion = (state: gameSliceState, {allVariants, prevAnswer}: {
    allVariants: VariantList,
    prevAnswer?: VariantName
}) => {
    const answerRandomIndex = Math.floor(Math.random() * allVariants.length);
    const answerData = allVariants[answerRandomIndex];
    const answer = answerData.name;
    state.allVariants = allVariants;
    state.currentAnswer = answer;
    state.currentVariantList = [...allVariants]
        .sort(() => Math.random() - 0.5)
        .filter((item) => item.name !== answer)
        .slice(0, answerCount - 1)
        .concat(answerData)
        .sort(() => Math.random() - 0.5);
    const leftVariants = (state.leftVariants && state.leftVariants.length > 0
            ? state.leftVariants
            : state.allVariants || []
    ).filter((item) => item.name !== answer);

    if (prevAnswer) {
        state.leftVariants = leftVariants.filter((item) => item.name !== prevAnswer);
    } else {
        state.leftVariants = leftVariants;
    }
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const gameSlice = createAppSlice({
    name: "game",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: create => ({
        setFirstStep: create.reducer(() => {
            return steps['selectArea'];
        }),
        setNextStep: create.reducer((state) => {
            if (state.step === 'selectArea') {
                return steps['drawRectangle'];
            }
            if (state.step === 'drawRectangle') {
                return steps['questions'];
            }
            if (state.step === 'questions') {
                return steps['gameOver'];
            }
            if (state.step === 'gameOver') {
                return steps['selectArea'];
            }
        }),
        setParam: create.reducer((state, action: PayloadAction<{ name: keyof gameSliceState, value: any }>) => {
            // @ts-ignore
            state[action.payload.name] = action.payload.value;
        }),
        setStep: create.reducer((_, action: PayloadAction<gameStep>) => {
            return steps[action.payload];
        }),
        setAllVariants: create.reducer((state, action: PayloadAction<VariantList>) => {
            setNewQuestion(state, { allVariants: action.payload });
        }),
        questionAnswer: create.reducer((state, action: PayloadAction<GameAnswer>) => {
            if (typeof state.questionIndex !== "undefined" && state.questionIndex + 1 <= questionCount) {
                state.questionIndex += 1;
                if (action.payload.isCorrect) {
                    state.score = (state.score || 0) + 1;
                }

                setNewQuestion(state, { allVariants: state.allVariants as VariantList, prevAnswer: action.payload.answer });
            } else {
                return {
                    ...state,
                    ...steps['gameOver']
                };
            }
        }),
    }),
})

// Action creators are generated for each case reducer function.
export const {setNextStep, setParam, setFirstStep, setStep, setAllVariants, questionAnswer} = gameSlice.actions
