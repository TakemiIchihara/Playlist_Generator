import { createContext } from "react";

export const LanguageContext = createContext<{
    prefLang: string;
    setPrefLang: (lang: string) => void
}> ({
    prefLang: "en",
    setPrefLang: () => {}
});