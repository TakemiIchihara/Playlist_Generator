import { useContext } from "react";
import InsertSwiper from "./InsertSwiper";
import type { PlaylistsData } from "./result-helper";
import { LanguageContext } from "./LanguageContext";

interface DisplaySavedPlaylistsProps {
    playlistsData: PlaylistsData;
}

const DisplaySavedPlaylists = ( { playlistsData }: DisplaySavedPlaylistsProps) => {
    const { prefLang } = useContext(LanguageContext);

    const getUserPlaylists = localStorage.getItem("savedPlaylists");
    const savedPlaylistsIds: string[] = getUserPlaylists ? JSON.parse(getUserPlaylists) : [];

    return (
        <section id="saved-playlists">
            <div id="saved-playlists-title">
                <h2 className="title">{prefLang === "en" ? "Your Saved Playlists" : "見つけたプレイリスト"}</h2>
                <button
                    id="delete-btn"
                    onClick={() => {localStorage.clear(); window.alert("Your captured playlists are successfully deleted")}}>
                        {prefLang === "en" ? "Delete" : "削除" }
                </button>
            </div>
            <div id="swiper-holder">
                <InsertSwiper playlistsData={playlistsData} savedPlaylistsIds={savedPlaylistsIds} />
            </div>
        </section>
    );
};

export default DisplaySavedPlaylists;