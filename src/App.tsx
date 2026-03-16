import "./App.css"
import {Map} from "./features/map/Map"
import Overlay from "./features/overlay/Overlay"

export const App = () => (
    <div className="App">
        <header className="App-header"></header>
        <div className="main">
            <Map/>
        </div>
        <Overlay />
    </div>
)
