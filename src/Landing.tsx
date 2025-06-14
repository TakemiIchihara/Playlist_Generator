import { useEffect, useState } from "react";

interface  LandingProps {
    onStartQuiz: () => void;
    lang: string;
}

const Landing = ({ onStartQuiz, lang }: LandingProps) => {
    const [title, setTitle] = useState<any>(null);

    useEffect(() => {
        if(lang) {
            setTitle( lang === "en" ? "Let's Capture Your Mood<br />With Songs" : `あなたの気分に合った<br />プレイリストを探す`);
        }
    }, [lang])

    return(
        <div id="landing-holder">
            <h1 
                className="title"
                dangerouslySetInnerHTML={{__html: title}}></h1>
            <button className="title button" onClick={onStartQuiz}>{lang === "en" ? "Let's get started" : "クイズを始める"}</button>
        </div>
    )
}

export default Landing;