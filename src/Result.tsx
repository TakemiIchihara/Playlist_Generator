import { useEffect, useState } from 'react';
import type { PlaylistsData } from './result-helper';
import InsertSwiper from './InsertSwiper';
import { motion } from 'framer-motion';
import SongTitles from './SongTitles';
import Bubbles from './Bubbles';

interface  ResultProps {
    playlistId: string;
    onRetake: () => void;
    lang: string;
};

const Result = ({ playlistId, onRetake, lang}: ResultProps) => {
    const [playlistsData, setPlaylistsData] = useState<PlaylistsData | null>(null);
    //TIP as in Transition In Progress

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

    const getUserPlaylists = localStorage.getItem("savedPlaylists");
    const savedPlaylistsIds: string[] = getUserPlaylists ? JSON.parse(getUserPlaylists) : [];

    let iframeSrc = `https://open.spotify.com/embed/playlist/${playlistsData[playlistId].link}?utm_source=generator`

    return(
        <div id="result-holder">
            <Bubbles colorData={playlistsData[playlistId].color} count={8}/>
            <div id="title">
                <p>{lang === "en" ? "The mood you captured is..." : "今の気分は..."}</p>
                <h1 id="playlist-title">{playlistsData[playlistId].title}</h1>
            </div>
            
            <SongTitles songTitles={playlistsData[playlistId].songs} emoji={playlistsData[playlistId].emoji}/>
            
            <motion.iframe 
                id="main-iframe"
                allow="encrypted-media" 
                src={iframeSrc}
                initial={{ opacity: 0, y: 20}}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: .5}}
            />

            <div id="saved-playlists">
                <h2 className="title">{lang === "en" ? "Your Saved Playlists" : "見つけたプレイリスト"}</h2>
                <InsertSwiper playlistsData={playlistsData} savedPlaylistsIds={savedPlaylistsIds} />
            </div>

            <button id="delete-btn" onClick={() => localStorage.clear()}>{lang === "en" ? "Delete Saved Playlists" : "見つけたプライリストを消す" }</button>

            <button id="retake-btn" onClick={onRetake}>{lang === "en" ? "Take the Quiz Again" : "もう一度クイズをする" }</button>
        </div>
    )
}

export default Result;