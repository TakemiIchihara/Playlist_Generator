import { useState, useEffect, useContext } from "react";
import type { Answer, QuestionType, QuestionData, ExportProps } from "./question-helper";
import PageTransition from "./PageTransition";
import { LanguageContext } from "./LanguageContext";

interface  QuestionProps {
	onFinish: (passedId: string) => void;
	onAnswer: (exportProps?: ExportProps) => void;
	exportProps?: ExportProps;
};

const Question = ({ onFinish, onAnswer, exportProps }: QuestionProps) => {
	const { prefLang } = useContext(LanguageContext);
	const [questionsData, setQuestionsData] = useState<QuestionData | null>(null);
	const nextQKey = exportProps !== undefined && exportProps.nextKey ? exportProps.nextKey : "Q1-1";
	const [question, setQuestion] = useState<QuestionType | null>(null)
	const path: string = exportProps !== undefined && exportProps.playlistId ? exportProps.playlistId :"";
	let QNumber: number = exportProps !== undefined && exportProps.QNumber ? exportProps.QNumber : 1;

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

	// Setting the very first question as the questionData is successfully retrieved
	useEffect(() => {
		if(questionsData && questionsData[nextQKey])
			setQuestion(questionsData[nextQKey]);
	}, [questionsData]);

	useEffect(() => {
		if(questionsData && questionsData[nextQKey])
			setQuestion(questionsData[nextQKey]);
	}, [nextQKey])

	if (!questionsData || !question) return (<p>Loading...</p>);

	const disableBtns = () => {
		const btns = document.querySelectorAll('.question-btns');
		btns.forEach((btn) => { btn.setAttribute("disabled", "disabled")})
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
		>
			{ question && (
				<div className="question-holder">
					<div className="question">
						<h1 className="q-title">{prefLang === "en"? "Question" : "問題" }: {QNumber}</h1>
						<h2 className="question-title">{question.question.split("\n").map((line, index) => (<span style={{ display: "block"}} key={index}>{line}</span>))}</h2>
					</div>
					<div className="btns-holder">
						{question.answers.map((answer: Answer) => (
							<button
								key={answer._id}
								className="question-btns button"
								onClick={() => {
									disableBtns();
									QNumber <= 4 ? QNumber += 1 : QNumber;
									const nextKey = path.length > 7 ? "Q1-1" : answer.nextKey;
									onAnswer({nextKey: nextKey, playlistId: path + answer._id, color: colorOptions(answer), QNumber});
									if(QNumber === 5){
										const playlistId = path + answer._id;
										onFinish(playlistId)
									}
								}}
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
			)}
			</PageTransition>
	)
};

export default Question;