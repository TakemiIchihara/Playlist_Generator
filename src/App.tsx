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

function App() {
  type pageState = { page: "landing" } | { page: "question" } | { page: "result"};

  const [page, setPage] = useState<pageState>({ page: "landing" });
  const [nextPageHolder, setNextPageHolder] = useState<pageState | null>(null);
  const { prefLang, setPrefLang } = useContext(LanguageContext);
  const [playlistId, setPlaylistId] = useState<string>("")
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const ogColorSet = ["F4F4F4", "F4F4F6", "EEEEEE", "BFBFBF", "E6E6E9"];
  const [colorOption, setColorOptions] = useState<string[]>(ogColorSet);
  const [QNumber, setQNumber] = useState<number>(1);

  useEffect(() => {
    localStorage.setItem("prefLang", prefLang);
  }, [prefLang])

  const renderMain = () => {
      if(page.page === "landing") 
        return <Landing
            onStartQuiz={() => { 
              loadPage("question");
            }}/>;
      if(page.page === "question")
        return <Question
          onAnswer={(colors: string[], number: number) => {
            setColorOptions(number !== 4 ? colors : ogColorSet);
            setQNumber(number);
          }}
          onFinish={(playlistId) => {
            loadPage("result");
            setPlaylistId(playlistId)
          }}
          />;
      if(page.page === "result") 
        return <Result
          playlistId={playlistId}
          onRetake={() => loadPage("question")}
        />;
      return null;
  }

  const toggleLang = () => {
    setPrefLang( prefLang === "en" ? "jp" : "en");
  }

  type pageKey = pageState["page"];
  const loadPage = (newPageKey: pageKey) => {
    setIsExiting(true);
    setNextPageHolder({ page: newPageKey});
  }

  return (
      <div id="app-screen">
        <Header onRedo={() => {
          setIsExiting(true);
          setTimeout(() => {
            setPage({ page: "landing"});
            setColorOptions(ogColorSet);
            setQNumber(0);
            setPlaylistId("")
            setIsExiting(false);
          }, 5000)
          // setPage({page: "landing"});
          // setColorOptions(ogColorSet);
        }}/>
        <main>
          <AnimatePresence mode="wait">
            <PageTransition
              transitionKey={page.page}
              isExiting={isExiting}
              onFinishExit={() => {
                if(nextPageHolder) {
                  setPage(nextPageHolder);
                  setNextPageHolder(null);
                  setIsExiting(false);
                }
              }}
            >
              {!isExiting && renderMain()}
            </PageTransition>
          </AnimatePresence>
        </main>
        <AnimatePresence mode="wait">
          {page.page === "question" && !isExiting && (
            <Bubbles
              key={QNumber}
              colorData={colorOption}
              count={4}
            />
          )}
        </AnimatePresence>
        <footer>
          <small>© 2025 Spotify</small>
          <div id="lang-setting">
            <small>{prefLang === "en" ? "Language" : "言語設定"}</small>
            <button onClick={toggleLang}>{prefLang}</button>
          </div>
        </footer>
      </div>
  )
}

export default App;