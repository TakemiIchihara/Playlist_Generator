export interface Playlist {
    link: string;
    title: string;
    color: string[];
    songs: string[];
    emoji: string;
    "font-color": string;
}

export interface PlaylistsData {
    [playlistId: string] : Playlist;
}