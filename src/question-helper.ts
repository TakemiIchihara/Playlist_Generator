export interface QuestionData {
    [key: string]: QuestionType;
}

export interface QuestionType {
    _id: number;
    question: string;
    answers: Answer[];
    colorTheme: string;
}

export interface Answer {
    _id: string;
    answer: string;
    color: string[];
    nextKey: string;
    white: string;
}

export interface ExportProps {
    nextKey: string;
    playlistId: string;
    color: string[];
    QNumber: number;
}