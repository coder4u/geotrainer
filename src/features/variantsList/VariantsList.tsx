import {useAppSelector, useAppDispatch} from "../../app/hooks.ts";
import {questionAnswer, VariantName} from "../game/gameSlice.ts";
import {useState} from "react";


const VariantsList = () => {
    const [isAnswerClicked, setIsAnswerClicked] = useState(false);
    const dispatch = useAppDispatch();

    const currentVariantList = useAppSelector(state => state.game.currentVariantList) || [];
    const currentAnswer = useAppSelector(state => state.game.currentAnswer) || [];

    const clickHandler = (answerName: VariantName) => {
        const isCorrect = answerName === currentAnswer;

        setIsAnswerClicked(true)
        setTimeout(() => {
            dispatch(questionAnswer({ answer: answerName, isCorrect }))
            setIsAnswerClicked(false)
        }, 1000);
    }

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