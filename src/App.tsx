import { useContext, useEffect, useState } from 'react';
import Header from './Header';
import Landing from './Landing';
import Result from './Result';
import './App.css';
import PageTransition from './PageTransition';
import Question from './Question';
import Bubbles from './Bubbles';
import { AnimatePresence } from 'framer-motion';
import { LanguageContext } from './LanguageContext';
import type { ExportProps } from './question-helper';
import Loading from './Loading';

const OG_COLOR_SET: string[] = ["F4F4F4", "F4F4F6", "EEEEEE", "BFBFBF", "E6E6E9"];

function App() {
  type pageState = { page: "landing" } | { page: "question" } | { page: "result"}| { page: "loading" };

  const [page, setPage] = useState<pageState>({ page: "landing" });
  const { prefLang, setPrefLang } = useContext(LanguageContext);

  const [questionProps, setQuestionProps] = useState<ExportProps | undefined>(undefined);
  const [bubbleColor, setBubbleColor] = useState<string[]>(OG_COLOR_SET)
  const [playlistId, setPlaylistId] = useState<string>("")

  useEffect(() => {
    localStorage.setItem("prefLang", prefLang);
  }, [prefLang])

  const renderMain = () => {
    // Landing Operation
    if(page.page === "landing") 
      return <Landing
          onStartQuiz={() => { 
            loadPage("question");
          }}/>;

    // Question Operation
    if(page.page === "question")
      return <Question
        onAnswer={(exportProps) => {
          if(exportProps)
            if (exportProps.QNumber > 0 && exportProps.QNumber <= 4) {
              setQuestionProps(exportProps);
              setBubbleColor(exportProps.color);
              loadPage("question");
            }
        }}
        onFinish={(passedId) => {
          setPlaylistId(passedId);
          loadPage("result");
        }}
        exportProps={questionProps}
        />;

    // Result Operation
    if(page.page === "result") 
      if(questionProps) {
        return <Result
          playlistId={playlistId}
          onRetake={() => {
            loadPage("question");
            setQuestionProps(undefined);
            setPlaylistId("");
            }}
        />;
      } else {
        <h1 style={{ whiteSpace: "pre-wrap" }}>{prefLang === "en" ? `Something went wrong...\nPlease try again!` : `エラー\nもう一度一から試してみてください`}</h1>
      }

    // Loading Operation
    if(page.page === "loading")
      return <Loading />

    // Default Operation
    return null;
  }

  type pageKey = pageState["page"];
  const loadPage = (newPageKey: pageKey) => {
    setPage({page: "loading"});
    setTimeout(() => {
      // setPage({page: "loading"});
        window.scrollTo({ top: 0 });
        setPage({ page: newPageKey});
    }, 3000)
  }

  console.log("bubbleColor", bubbleColor)

  return (
      <div id="app-screen">
        <Header onRedo={() => {
          loadPage("landing");
          setQuestionProps(undefined);
        }}/>
        <main id="main">
          <AnimatePresence mode="wait">
            <PageTransition
              transitionKey={page.page}
            >
              {renderMain()}
            </PageTransition>
          </AnimatePresence>
        </main>
        <AnimatePresence mode="wait">
          {(page.page === "question" || page.page === "result") &&
            <Bubbles
              key={bubbleColor.join("-")}
              colorData={questionProps?.QNumber !== undefined ? bubbleColor : OG_COLOR_SET}
              count={4}
            />}
        </AnimatePresence>
        <footer>
          <small>© 2025 TkmIchihara</small>
          <div id="lang-setting">
            <small>{prefLang === "en" ? "Language" : "言語設定"} <span className='bold'>:</span></small>
            <button onClick={() => setPrefLang( prefLang === "en" ? "jp" : "en")}>{prefLang === "en" ? prefLang : "日本語"}</button>
          </div>
        </footer>
      </div>
  )
}

export default App;