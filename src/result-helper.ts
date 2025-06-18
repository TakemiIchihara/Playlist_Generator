export interface Playlist {
    link: string;
    title: string;
    color: string[];
    songs: string[];
    emoji: string;
}

export interface PlaylistsData {
    [playlistId: string] : Playlist;
}