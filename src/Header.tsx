import { FaRainbow } from "react-icons/fa";

interface LandingProps {
    onRedo: () => void;
}

const Header = ( { onRedo}: LandingProps ) => {
    return (
        <header>
            <div id="header-holder" onClick={onRedo}>
                <h1>TKM</h1>
                <FaRainbow
                    id="logo" 
                />
            </div>
        </header>
    )
}
export default Header;