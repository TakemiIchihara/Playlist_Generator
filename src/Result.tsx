import { useContext, useEffect, useState } from 'react';
import type { PlaylistsData } from './result-helper';
import { motion } from 'framer-motion';
import SongTitles from './SongTitles';
import Bubbles from './Bubbles';
import DisplaySavedPlaylists from './DisplaySavedPlaylists';
import { LanguageContext } from './LanguageContext';

interface  ResultProps {
    playlistId: string;
    onRetake: () => void;
};

const Result = ({ playlistId, onRetake}: ResultProps) => {
    const [playlistsData, setPlaylistsData] = useState<PlaylistsData | null>(null);
    const { prefLang } = useContext(LanguageContext);

    useEffect(() => {
        fetch('/playlists.json')
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json()
            })
            .then(data => {
                setPlaylistsData(data);
            });
    }, []);

    useEffect(() => {
        if (playlistId) {
            const getUserPlaylists = localStorage.getItem("savedPlaylists")
            let savedList: string[] = getUserPlaylists ? JSON.parse(getUserPlaylists) : [];

            if(!savedList.includes(playlistId)) {
                savedList.push(playlistId);
                localStorage.setItem("savedPlaylists", JSON.stringify(savedList));
            };
        };
    }, [playlistId])

    console.log(playlistId);

    if (!playlistsData || !playlistsData[playlistId]) return <p>Loading...</p>;

    let iframeSrc = `https://open.spotify.com/embed/playlist/${playlistsData[playlistId].link}?utm_source=generator`

    return(
        <div id="result-holder">
            <div id="content">
                <div id="title">
                    <p>{prefLang === "en" ? "The mood you captured is..." : "今の気分は..."}</p>
                    <h1 id="playlist-title">{playlistsData[playlistId].title}</h1>
                </div>
            
                <motion.iframe 
                    id="main-iframe"
                    allow="encrypted-media" 
                    src={iframeSrc}
                    initial={{ opacity: 0, y: 20}}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: .5}}
                />
                
                <DisplaySavedPlaylists playlistsData={playlistsData} />

                <button
                    id="retake-btn"
                    className="button" 
                    onClick={onRetake}
                    style={{ backgroundImage: `linear-gradient(90deg, #${playlistsData[playlistId].color[0]}, #${playlistsData[playlistId].color[1]}, #${playlistsData[playlistId].color[2]})`,}}
                >
                    {prefLang === "en" ? "Take the Quiz Again" : "もう一度クイズをする" }
                </button>
            </div>
            <Bubbles colorData={playlistsData[playlistId].color} count={3}/>
            <SongTitles songTitles={playlistsData[playlistId].songs} emoji={playlistsData[playlistId].emoji}/>
        </div>
    )
}

export default Result;