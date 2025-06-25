import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import { useContext, useState } from 'react';
import type { Playlist, PlaylistsData } from './result-helper';
import { LanguageContext } from './LanguageContext';
import { FaApple, FaSpotify } from 'react-icons/fa';
import { motion } from 'framer-motion';
declare module 'swiper/css/navigation'
declare module 'swiper/css/pagination'

interface InsertSwiperProps {
    playlistsData: PlaylistsData;
    savedPlaylistsIds: string[];
}

const InsertSwiper = ( { playlistsData, savedPlaylistsIds }: InsertSwiperProps) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const { prefLang } = useContext(LanguageContext)

	return (
		<Swiper
			effect="coverflow"
			modules={[EffectCoverflow]}
			spaceBetween={35}
			slidesPerView={1.65}
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
			{savedPlaylistsIds.map((id, index) => {
				if(!(id in playlistsData)) return null;

				const data: Playlist = playlistsData[id];

				return (
					<SwiperSlide
						key={id}
					>
						<div className="swiper-slide-bg" style={{ background: `linear-gradient(135deg, #${data.color[0]}, #${data.color[1]}, #${data.color[2]})` }}>

							{/* setting a background emoji pattern for the swiper */}
							{index === activeIndex && (
								<div className="emoji-bg">
									{ Array.from({ length: 4 }).map((_, rowI) => (
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
							style={{ position: "relative", zIndex: 1 }}
							>
								<h1 style={{ fontSize: "40px" }}>{data.title}</h1>
								
								{index === activeIndex && (
									<iframe
										src={`https://open.spotify.com/embed/playlist/${data.link}?utm_source=generator`}
										allow="encrypted-media"
									/>)
								}
							</div>
						</div>

						{index === activeIndex &&
						<motion.div className="links"
							initial={{ opacity: 0, y: 5 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 5 }}
							transition={{ duration: .3, delay: .2, ease: "easeIn"}}
						>
								<>
									<button className="spotify-links link-btns">
										<a href={`https://open.spotify.com/playlist/${data.link}`}>{prefLang === "en" ? "Open in Spotify" : "Spotifyで開く"}</a>
										<FaSpotify />
									</button>
									<button className="apple-links link-btns">
										<a href={`https://music.apple.com/us/playlist/${data.title}/pl.u-${data.apple}`}>{prefLang === "en" ? "Open in Apple Music" : "Apple Musicで開く"}</a>
										<FaApple />
									</button>
								</>
							
						</motion.div>
						}
					</SwiperSlide>
				);
			})}
		</Swiper>
	);
}

export default InsertSwiper;