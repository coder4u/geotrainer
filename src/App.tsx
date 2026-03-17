import "./App.css";
import './i18n/config';
import {Map} from "./features/map/Map";
import Overlay from "./features/overlay/Overlay";

export const App = () => (
    <div className="App">
        <div className="main">
            <Map/>
        </div>
        <Overlay />
    </div>
)
