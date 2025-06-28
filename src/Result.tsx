import { useContext, useEffect, useRef, useState } from 'react';
import type { DateInfo, PlaylistsData, SavedList } from './result-helper';
import { motion } from 'framer-motion';
import SongTitles from './SongTitles';
// import Bubbles from './Bubbles';
import DisplaySavedPlaylists from './DisplaySavedPlaylists';
import { LanguageContext } from './LanguageContext';

interface  ResultProps {
	playlistId: string;
	onRetake: () => void;
};

const Result = ({ playlistId, onRetake}: ResultProps) => {
	const { prefLang } = useContext(LanguageContext);
	const [playlistsData, setPlaylistsData] = useState<PlaylistsData | null>(null);
	const savedPlaylistRef = useRef(false);

	useEffect(() => {
			fetch('/playlists.json')
					.then(res => {
							if (!res.ok) throw new Error("Failed to fetch");
							return res.json()
					})
					.then(data => {
							setPlaylistsData(data);
					})
					.catch(e => console.error(e));
	}, []);

	useEffect(() => {
		if (!playlistId || savedPlaylistRef.current) return;

		savedPlaylistRef.current = true;

		console.log("初回レンダリングのみ")
		const getUserPlaylists = localStorage.getItem("savedPlaylists");
		let savedList: SavedList[] = getUserPlaylists ? JSON.parse(getUserPlaylists) : [];

		let existing = savedList.find(item => item._id === playlistId);
		if(!existing) {
			const dateFound = new Date();
			const dateInfo: DateInfo = {
				month: dateFound.getMonth(),
				date: dateFound.getDay(),
				day: dateFound.getDate() 
			};
			const newPlaylist = {
				_id: playlistId,
				dateInfo,
				timesFound: 1
			};

			savedList.push(newPlaylist);

		} else {
			savedList.forEach(list => {
				if(list._id === playlistId) {
					list.timesFound++;
				}
			});
		};

		localStorage.setItem("savedPlaylists", JSON.stringify(savedList));

	}, []);

	if (!playlistsData || !playlistsData[playlistId]) return <p>Loading...</p>;

	let iframeSrc = `https://open.spotify.com/embed/playlist/${playlistsData[playlistId].link}?utm_source=generator`

	return(
		<div id="result-holder">
		<div id="content">
			<div id="title">
				<p className='bold'>{prefLang === "en" ? "The mood you captured is..." : "今の気分は..."}</p>
				<h1 id="playlist-title">{playlistsData[playlistId].title}</h1>
			</div>
	
			<motion.iframe 
				id="main-iframe"
				allow="encrypted-media" 
				src={iframeSrc}
				initial={{ opacity: 0, y: 20}}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1.5, delay: 1}}
			/>
			
			<DisplaySavedPlaylists playlistsData={playlistsData} />

			<button
				id="retake-btn"
				className="button" 
				onClick={onRetake}
				style={{
					backgroundImage: `linear-gradient(90deg, #${playlistsData[playlistId].color[0]}, #${playlistsData[playlistId].color[1]}, #${playlistsData[playlistId].color[2]})`,
					color: playlistsData[playlistId].btnWhite ? "var(--white)" : "var(--black)"
				}}
			>
				{prefLang === "en" ? "Take the Quiz Again" : "もう一度クイズをする" }
			</button>
		</div>
		<SongTitles songTitles={playlistsData[playlistId].songs} emoji={playlistsData[playlistId].emoji}/>
	</div>
	)
}

export default Result;