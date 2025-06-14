import { FaSpotify } from "react-icons/fa";

interface LandingProps {
    onRedo: () => void;
    lang: string;
}

const Header = ( { onRedo, lang }: LandingProps ) => {
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