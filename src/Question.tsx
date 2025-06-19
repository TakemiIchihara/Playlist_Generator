import { useState, useEffect, useContext } from "react";
import type { Answer, QuestionType, QuestionData } from "./question-helper";
import PageTransition from "./PageTransition";
import { LanguageContext } from "./LanguageContext";

interface  QuestionProps {
    onFinish: (playlistId: string) => void;
    onAnswer: (colorOptions: string[], QNumber: number) => void;
};

const Question = ({ onFinish, onAnswer }: QuestionProps) => {
    const { prefLang } = useContext(LanguageContext);
    const [questionsData, setQuestionsData] = useState<QuestionData | null>(null);
    const [nextQKey, setNextQKey] = useState<string>("Q1-1");
    const [question, setQuestion] = useState<QuestionType | null>(null)
    const [path, setPath] = useState<string>("");
    const [isExiting, setIsExiting] = useState<boolean>(false);
    const [QNumber, setQNumber] = useState<number>(1);

    // load the questions data
    useEffect(() => {
        fetch(prefLang === "en" ? '/questions.json' : '/questionsJP.json')
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then(data => {
                setQuestionsData(data);
            })
            .catch(e => console.error(e));
    }, [prefLang]);

    useEffect(() => {
        if(questionsData && questionsData[nextQKey])
            setQuestion(questionsData[nextQKey]);
    }, [questionsData]);

    if (!questionsData || !question) return <p>Loading...</p>;

    const handleNextQuestion = (answer: Answer) => {
        const btns = document.querySelectorAll('.question-btns');
        btns.forEach((btn) => { btn.setAttribute("disabled", "disabled")})

        const nextQNumber = QNumber + 1;
        setQNumber(nextQNumber)

        const updatePath = path + answer._id;
        setPath(updatePath);

        if(answer.nextKey) {
            setIsExiting(true)
            setNextQKey(answer.nextKey);
        } else {
            const top = document.querySelectorAll(".top");
            top.forEach((bubble) => { bubble.setAttribute("className", "remove-top-bubbles")});
            
            setTimeout (() => onFinish(updatePath), 2000);
        }
    }

    const colorOptions = (answer: Answer) => {
        let colorPicks: string[] = [];
        if(answer.nextKey)
            colorPicks = questionsData[answer.nextKey].answers.flatMap((answer) => answer.color);
        return (colorPicks);
    }

    return(
            <PageTransition 
                transitionKey={nextQKey}
                isExiting={isExiting}
                onFinishExit={() => {
                    if(nextQKey) {
                        setQuestion(questionsData[nextQKey]);
                        setIsExiting(false);
                    }
                }}
            >
                {(question && !isExiting) && (
                    <div id="question-main">
                        <div className="question-holder">
                            <h2 className="question-title">{question.question.split("\n").map((line, index) => (<span style={{ display: "block"}} key={index}>{line}</span>))}</h2>
                            <div className="btns-holder">
                            {question.answers.map((answer: Answer) => (
                                <button
                                    key={answer._id}
                                    className="question-btns button"
                                    onClick={() => {
                                        handleNextQuestion(answer);
                                        onAnswer(colorOptions(answer), QNumber);
                                    }}
                                    disabled={isExiting}
                                    style={{
                                        background: `linear-gradient(90deg, #${answer.color[0]}, #${answer.color[1]}, #${answer.color[2]})`,
                                        color: answer.white ? "var(--white)" : "var(--black)",
                                    }}
                                >
                                    {answer.answer}
                                </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </PageTransition>
    )
};

export default Question;