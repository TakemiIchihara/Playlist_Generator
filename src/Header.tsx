import { FaSpotify } from "react-icons/fa";

interface LandingProps {
    onRedo: () => void;
}

const Header = ( { onRedo}: LandingProps ) => {
    return (
        <header>
            <FaSpotify
                id="logo" 
                onClick={onRedo}
            />
        </header>
    )
}
export default Header;