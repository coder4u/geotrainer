import {useAppSelector, useAppDispatch} from "../../app/hooks.ts";
import {endIndex, questionAnswer, reset, VariantName} from "./variantsListSlice.ts";
import {useEffect, useState} from "react";
import {scoreUp, setNextStep} from "../game/gameSlice.ts";


const VariantsList = () => {
    const [isAnswerClicked, setIsAnswerClicked] = useState(false);
    const dispatch = useAppDispatch();

    const currentVariantList = useAppSelector(state => state.variantsList.currentVariantList) || [];
    const currentAnswer = useAppSelector(state => state.variantsList.currentAnswer) || [];
    const questionIndex = useAppSelector(state => state.variantsList.questionIndex) || [];

    const clickHandler = (answerName: VariantName) => {
        if (!isAnswerClicked) {
            const isCorrect = answerName === currentAnswer;

            setIsAnswerClicked(true)
            setTimeout(() => {
                if (isCorrect) {
                    dispatch(scoreUp());
                }
                dispatch(questionAnswer(answerName));
                setIsAnswerClicked(false)
            }, 1000);
        }
    }

    useEffect(() => {
        if (questionIndex === endIndex) {
            dispatch(reset());
            dispatch(setNextStep());
        }
    }, [questionIndex])

    return (
        <ul className="variants-list">
            {currentVariantList.map((variant) => (
                <li
                    key={variant.name + currentAnswer}
                    className={`variant ${isAnswerClicked && currentAnswer === variant.name ? ' -correct' : ''}`}
                    onClick={() => clickHandler(variant.name)}
                >
                    {variant.name}
                </li>
            ))}
        </ul>
    );
}

export default VariantsList;