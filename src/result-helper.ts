export interface PlaylistsData {
	[playlistId: string] : Playlist;
}

export interface Playlist {
	link: string;
	apple: string;
	title: string;
	color: string[];
	songs: string[];
	emoji: string;
	fontColor: string;
	btnWhite: boolean;
}

export interface SavedList {
	_id: string;
	dateInfo: DateInfo;
	timesFound: number;
}

export interface DateInfo {
	month: number;
	date: number;
	day: number;
}