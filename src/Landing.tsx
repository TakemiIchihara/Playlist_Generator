import { useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import { FaCaretRight } from "react-icons/fa"

interface  LandingProps {
    onStartQuiz: () => void;
}

const Landing = ({ onStartQuiz }: LandingProps) => {
    const { prefLang } = useContext(LanguageContext);

    return(
        <div id="landing-holder">
            <h1 className="title"
							style={{ whiteSpace: "pre-wrap"}}
						>
							{prefLang === "en" ? `Let's Capture Your Mood\nWith Songs` : `あなたの気分に合った\nプレイリストを探す`}
						</h1>
            <button
            	className="title button"
							onClick={onStartQuiz}
						>
							{prefLang === "en" ? "Let's get started" : "クイズを始める"}
							<FaCaretRight id="arrow-right"/>
						</button>
        </div>
    )
}

export default Landing;