import { FaRainbow } from "react-icons/fa";

interface LandingProps {
    onRedo: () => void;
}

const Header = ( { onRedo}: LandingProps ) => {
    return (
        <header>
            <div id="header-holder" onClick={onRedo}>
                <FaRainbow
                    id="logo" 
                />
                <p>Playlist Generator</p>
            </div>
        </header>
    )
}
export default Header;