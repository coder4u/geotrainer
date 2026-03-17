import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {setNextStep, setFirstStep, setStepQuestion} from "../game/gameSlice.ts";
import VariantsList from "../variantsList/VariantsList.tsx";
import {useTranslation} from "react-i18next";
import {questionCount} from "../variantsList/variantsListSlice.ts";

const Overlay = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const step = useAppSelector(state => state.game.step);
    const score = useAppSelector(state => state.game.score);
    const questionIndex = useAppSelector(state => state.variantsList.questionIndex);
    const rectangleBounds = useAppSelector(state => state.map.rectangleBounds);
    let overlayText = '';

    switch (step) {
        case 'selectArea':
            overlayText = t("Please select the target area on the map.");
            break;
        case 'drawRectangle':
            overlayText = t("Please draw a rectangle on the map.");
            break;
        case 'questions':
            overlayText = t("What is the name of the chosen city or village?");
            break;
        case 'gameOver':
            overlayText = t("Game over");
            break;
    }

    return (
        <div className="overlay">
            <div className={`overlay-header ${step === 'gameOver' ? ' -game-over' : ''}`}>
                <div className={`overlay-header-text ${step === 'gameOver' ? ' -game-over' : ''}`}>
                    {overlayText}
                </div>
                {step === 'questions' && (
                    <div className="overlay-question-counter">
                        {(questionIndex || 0) + 1} / {questionCount}
                    </div>
                )}
                {step === 'drawRectangle' && (
                    <button
                        onClick={() => dispatch(setFirstStep())}
                        className="overlay-button -prev"
                    >
                        {t("Back")}
                    </button>
                )}

                {(step === 'selectArea' || step === 'gameOver' || (step === 'drawRectangle' && rectangleBounds)) && (
                    <button
                        onClick={() => step === 'gameOver' ? dispatch(setStepQuestion()) : dispatch(setNextStep())}
                        className="overlay-button"
                    >
                        {step === 'gameOver' ? t("Play again") : t("Next")}
                    </button>
                )}
                {step === 'gameOver' && (
                    <button
                        onClick={() => dispatch(setFirstStep())}
                        className="overlay-button -prev"
                    >
                        {t("Set new area")}
                    </button>
                )}
            </div>
            {step === 'questions' && (
                <VariantsList />
            )}
            {step === 'gameOver' && (
                <div className="game-over-text">
                    {t("Your score:")} {score}
                </div>
            )}
        </div>
    );
}

export default Overlay;