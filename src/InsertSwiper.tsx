import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import { useContext, useState } from 'react';
import type { Playlist, PlaylistsData, SavedList } from './result-helper';
import { LanguageContext } from './LanguageContext';
import { FaApple, FaSpotify } from 'react-icons/fa';
import { FaCaretRight } from 'react-icons/fa6';
import { motion } from 'framer-motion';
declare module 'swiper/css/navigation'
declare module 'swiper/css/pagination'

interface InsertSwiperProps {
    playlistsData: PlaylistsData;
		playlistId: string;
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
			<span className='month'>{renderedMonth} </span>
			<span className='day'>{renderedDay}{prefLang === "jp" && "日"} </span>
			<span className='date'>({renderedDate})</span>
		</>
	);
}

const positionStyle = (currentIndex: number) => {
	if(currentIndex === 0) {
		return { left: "48px" };
	} else if(currentIndex >= 1 && 8 >= currentIndex || currentIndex === 10) {
		return { left: "24px" };
	} else if (currentIndex === 9) {
		return { left: "-8px" };
	} else if((currentIndex >= 10 && 18 >= currentIndex) || currentIndex === 20) {
		return { left: "8px", letterSpacing: "-8px" };
	} else {
		return { left: "-40px", letterSpacing: "-8px" };
	}
};

const InsertSwiper = ({ playlistsData, playlistId}: InsertSwiperProps) => {
	const { prefLang } = useContext(LanguageContext)
	const [activeIndex, setActiveIndex] = useState(0);

	const getUserPlaylists = localStorage.getItem("savedPlaylists");
	const savedPlaylists: SavedList[] = getUserPlaylists ? JSON.parse(getUserPlaylists) : [];

	return (
		<Swiper
			effect="coverflow"
			modules={[EffectCoverflow]}
			spaceBetween={35}
			slidesPerView={1.15}
			centeredSlides={true}
			initialSlide={Math.max(0, savedPlaylists.findIndex((list) => list._id === playlistId))}
			// loop={savedPlaylists.length >= 4}
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
						<div 
							className="framed"
							style={{ padding: index !== activeIndex ? "unset" : "16px" }}
						>
							{/* inactive slides design */}
								{index !== activeIndex && (
									<>
									<span className='prev-number'>{index + 1}</span>
									<span className='next-number'>{index + 1}</span>
									</>
								)}
							<div 
								className="swiper-slide-bg" 
								style={{ 
									background: `linear-gradient(135deg, #${data.color[0]}, #${data.color[1]}, #${data.color[2]})`,
									height: index !== activeIndex ? "440px" : "232px" 
								}}
							>

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

								<motion.div 
									className="swiper-content"
									key={index}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: .5, delay: .3, ease: "easeOut" }}
									style={{ color: data.fontColor ? `var(--${data.fontColor})` : "var(--lt-white)" }}
								>
									{index === activeIndex && (
										<>
										<h2>{data.title}</h2>

										<h3
											className='current-index'
											style={ positionStyle(activeIndex) }
										>
											{index + 1}
										</h3>
										<ul className="playlist-status">
											<li>{prefLang === "en" ? "Times you captured" : "見つけた回数"}<span className="bold status-desc">{list.timesFound}{prefLang === "en" ? "" : " 回"}</span></li>
											<li>{prefLang === "en" ? "First found" : "初めて見つけた日"}<span className="bold status-desc">{getDateInfo(
												list.dateInfo.month,
												list.dateInfo.day,
												list.dateInfo.date,
												prefLang)}</span></li>
										</ul>
										</>
									)}
								</motion.div>
							</div>
							{index === activeIndex && (
								<motion.div 
									className="links"
									key={index}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: .5, delay: .3, ease: "easeOut" }}
								>
									<p className="links-cta">
										{prefLang !== "jp" && "Listen to "}
										<span
											style={{
												fontWeight: 900,
												background: `linear-gradient(135deg, #${data.color[0]}, #${data.color[1]}, #${data.color[2]}`,
												color: "transparent",
												backgroundClip: "text"
											}}
										>
											{data.title}
										</span>
										{prefLang === "jp" && "を聴いてみる"}
									</p>

									<div className="apple app-link">
										<div className="app-type">
											<FaCaretRight className='right-arrow' />
											<FaSpotify className='app-logos spotify-logo spotify-color' />
											<p className="app-names">Spotify</p>
										</div>
										<a
											href={`https://open.spotify.com/playlist/${data.link}`}
											target="_blank"
											rel='noopener noreferrer'
										>
											<button 
												className="spotify-link link-btns button"
												style={{ 
													background: `linear-gradient(white, var(--white)) padding-box, linear-gradient(135deg, #${data.color[0]}, #${data.color[1]}, #${data.color[2]}) border-box`,
													border: "transparent solid 2px"
												}}
											>{prefLang === "en" ? "Play" : "再生する"}</button>
										</a>
									</div>

									<div 
										className="divider"
										style={{ background: `linear-gradient(135deg, #${data.color[0]}, #${data.color[1]}, #${data.color[2]}`}}
									/>

									<div className="spotify app-link">
										<div className="app-type">
											<FaCaretRight className='right-arrow' />
											<FaApple className='app-logos apple-logo apple-color' />
											<p className="app-names">Apple Music</p>
										</div>
										<a 
											href={`https://music.apple.com/us/playlist/${data.title}/pl.u-${data.apple}`}
											target="_blank"
											rel='noopener noreferrer'
										>
											<button
												className="apple-link link-btns button"
												style={{
													background: `linear-gradient(white, var(--white)) padding-box, linear-gradient(-45deg, #${data.color[0]}, #${data.color[1]}, #${data.color[2]}) border-box`,
													border: "transparent solid 2px"
												}}
											>{prefLang === "en" ? "Play" : "再生する"}</button>
										</a>
									</div>
								</motion.div>
							)}
							<div 
								className="framed-bg"
								style={{
									border: "solid 6px transparent",
									background: `linear-gradient(white, var(--white)) padding-box, linear-gradient(135deg, #${data.color[0]}, #${data.color[1]}, #${data.color[2]}) border-box`
								}}
							/>
						</div>
					</SwiperSlide>
				);
			})}
		</Swiper>
	);
}

export default InsertSwiper;