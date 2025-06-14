export interface Playlist {
    link: string;
    title: string;
    color: string[];
}

export interface PlaylistsData {
    [playlistId: string] : Playlist;
}