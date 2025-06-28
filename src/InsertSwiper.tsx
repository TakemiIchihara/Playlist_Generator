import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import { useContext, useState } from 'react';
import type { Playlist, PlaylistsData, SavedList } from './result-helper';
import { LanguageContext } from './LanguageContext';
import { FaApple, FaSpotify } from 'react-icons/fa';
import { FaCaretRight } from 'react-icons/fa6';
declare module 'swiper/css/navigation'
declare module 'swiper/css/pagination'

interface InsertSwiperProps {
    playlistsData: PlaylistsData;
}

const getDateInfo = (month: number, day: number, date: number, prefLang: string) => {
	const renderedMonth = (() => {
		if(prefLang === "jp") {
			switch(month) {
				case 0: return "1月";
				case 1: return "2月";
				case 2: return "3月";
				case 3: return "4月";
				case 4: return "5月";
				case 5: return "6月";
				case 6: return "7月";
				case 7: return "8月";
				case 8: return "9月";
				case 9: return "10月";
				case 10: return "11月";
				case 11: return "12月";
				default: return "";
			}
		} else {
			switch(month){
				case 0: return "Jan";
				case 1: return "Feb";
				case 2: return "Mar";
				case 3: return "Apr";
				case 4: return "May";
				case 5: return "Jun";
				case 6: return "Jul";
				case 7: return "Aug";
				case 8: return "Sep";
				case 9: return "Oct";
				case 10: return "Nov";
				case 11: return "Dec";
				default: return "";
			};
		}
			
	})();

	const renderedDay = day + 1;

	console.log(day)

	const renderedDate = (() => {
		if(prefLang === "jp") {
			switch(date) {
				case 0: return "月";
				case 1: return "火";
				case 2: return "水";
				case 3: return "木";
				case 4: return "金";
				case 5: return "土";
				case 6: return "日";
				default: return "";
			}
		} else {
			switch(date) {
				case 0: return "Mon";
				case 1: return "Tue";
				case 2: return "Wed";
				case 3: return "Thu";
				case 4: return "Fri";
				case 5: return "Sat";
				case 6: return "Sun";
				default: return "";
			}
		};
	})();
	
	return (
		<>
			<span className='month'>{renderedMonth}</span>
			<span className='day'>{renderedDay}{prefLang === "jp" && "日"}</span>
			<span className='date'>({renderedDate})</span>
		</>
	);
}

const InsertSwiper = ({ playlistsData }: InsertSwiperProps) => {
	const { prefLang } = useContext(LanguageContext)
	const [activeIndex, setActiveIndex] = useState(0);

	const getUserPlaylists = localStorage.getItem("savedPlaylists");
	const savedPlaylists: SavedList[] = getUserPlaylists ? JSON.parse(getUserPlaylists) : [];

	return (
		<Swiper
			effect="coverflow"
			modules={[EffectCoverflow]}
			spaceBetween={35}
			slidesPerView={1.3}
			centeredSlides={true}
			coverflowEffect={{
				rotate: 15,
				stretch: 25,
				depth: 100,
				modifier: 1,
				slideShadows : true,
			}}
			onSlideChange={(swiper) => {
				setActiveIndex(swiper.activeIndex);
			}}
			pagination={{ clickable: true }}
			navigation
		>
			{ savedPlaylists.map( (list, index) => {
				if(!(list._id in playlistsData)) return null;

				const data: Playlist = playlistsData[list._id];

				return (
					<SwiperSlide
						key={list._id}
					>
						<div className="swiper-slide-bg" style={{ background: `linear-gradient(135deg, #${data.color[0]}, #${data.color[1]}, #${data.color[2]})` }}>

							{/* setting a background emoji pattern for the swiper */}
							{index === activeIndex && (
								<div className="emoji-bg">
									{ Array.from({ length: 5 }).map((_, rowI) => (
										<div className="emoji-bg-row" key={rowI}>
											{ Array.from({ length: 5 }).map((_, colI) => (
												<span key={colI}>{data.emoji}</span>
											))}
										</div>
									))}
								</div>
							)}

							<div
							className="swiper-content"
							style={{
								position: "relative",
								zIndex: 11,
								height: "inherit" 
							}}
							>
								{index !== activeIndex && (
									<>
									<span className='prev-number'>{index + 1}</span>
									<span className='next-number'>{index + 1}</span>
									</>
								)}
								
								{index === activeIndex && (
									<>
										<h2>{data.title}</h2>

										<ul className="playlist-status">
											<li>{prefLang === "en" ? "Times you found" : "見つけた回数"}: <span className="bold">{list.timesFound}</span></li>
											<li>{prefLang === "en" ? "Date you first found" : "初めて見つけた日"}: <span className="bold">{getDateInfo(
												list.dateInfo.month,
												list.dateInfo.day,
												list.dateInfo.date,
												prefLang)}</span></li>
										</ul>
										

										<div className="links">
											<a
											href={`https://open.spotify.com/playlist/${data.link}`}
											target="_blank"
											rel='noopener noreferrer'
											>
												<button className="spotify-link link-btns button">
													<span className='btn-content' >
														<FaCaretRight className='right-arrow' />
														{prefLang === "en" ? <>Open in <span className="app-names spotify-color bold">Spotify</span></> : <><span className="spotify-color app-names bold">Spotify</span> で開く</>}
													</span>
													<FaSpotify className='app-logos spotify-logo spotify-color' />
												</button>
											</a>
												<a 
												href={`https://music.apple.com/us/playlist/${data.title}/pl.u-${data.apple}`}
												target="_blank"
												rel='noopener noreferrer'
											>
												<button className="apple-link link-btns button">
													<span className='btn-content' >
														<FaCaretRight className='right-arrow' />
														{prefLang === "en" ? <>Open in <span className="app-names apple-color bold">Apple Music</span></> : <><span className="apple-color app-names bold">Apple Music</span> で開く</>}
													</span>
													<FaApple className='app-logos apple-logo apple-color' />
												</button>
											</a>
										</div>
									</>
								)}
							</div>
						</div>
					</SwiperSlide>
				);
			})}
		</Swiper>
	);
}

export default InsertSwiper;