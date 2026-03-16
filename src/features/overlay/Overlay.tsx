import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {setNextStep, setFirstStep, setStep} from "../game/gameSlice.ts";
import VariantsList from "../variantsList/VariantsList.tsx";

const Overlay = () => {
    const dispatch = useAppDispatch();

    const step = useAppSelector(state => state.game.step)
    const overlayText = useAppSelector(state => state.game.overlayText);
    const buttonText = useAppSelector(state => state.game.buttonText);
    const score = useAppSelector(state => state.game.score);

    return (
        <div className="overlay">
            <div className={`overlay-header ${step === 'gameOver' ? ' -game-over' : ''}`}>
                <div className={`overlay-header-text ${step === 'gameOver' ? ' -game-over' : ''}`}>{overlayText}</div>
                {step === 'drawRectangle' && (
                    <button
                        onClick={() => dispatch(setFirstStep())}
                        className="overlay-button -prev"
                    >
                        Back
                    </button>
                )}
                {buttonText && (
                    <button
                        onClick={() => dispatch(step === 'gameOver' ? setStep('questions') : setNextStep())}
                        className="overlay-button"
                    >
                        {buttonText}
                    </button>
                )}
                {step === 'gameOver' && (
                    <button
                        onClick={() => dispatch(setFirstStep())}
                        className="overlay-button -prev"
                    >
                        Set new area
                    </button>
                )}
            </div>
            {step === 'questions' && (
                <VariantsList />
            )}
            {step === 'gameOver' && (
                <div className="game-over-text">
                    Your score: {score}
                </div>
            )}
        </div>
    );
}

export default Overlay;