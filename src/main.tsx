import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageContext } from './LanguageContext.tsx'

const Root = () => {
  const [prefLang, setPrefLang] = useState<string>(() => {
    const savedLang = localStorage.getItem("prefLang");
    if(savedLang)
      return savedLang;

    return navigator.language.startsWith("ja") ? "jp" : "en";
  })

  useEffect(() => {
    localStorage.setItem("prefLang", prefLang);
  })

  return (
    <LanguageContext.Provider value={{ prefLang, setPrefLang }}>
      <App />
    </LanguageContext.Provider>
  )
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
