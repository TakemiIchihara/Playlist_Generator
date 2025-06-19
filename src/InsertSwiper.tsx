import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import { useState } from 'react';
import type { Playlist, PlaylistsData } from './result-helper';
declare module 'swiper/css/navigation'
declare module 'swiper/css/pagination'

interface InsertSwiperProps {
    playlistsData: PlaylistsData;
    savedPlaylistsIds: string[];
}

const InsertSwiper = ( { playlistsData, savedPlaylistsIds }: InsertSwiperProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    
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
                const data: Playlist = playlistsData[id];
                return (
                    <SwiperSlide
                        key={id}
                        style={{ background: `linear-gradient(135deg, #${data.color[0]}, #${data.color[1]}, #${data.color[2]})` }}
                    >
                        <div className="emoji-bg">
                            { Array.from({ length: 4 }).map((_, rowI) => (
                                <div className="emoji-bg-row" key={rowI}>
                                    { Array.from({ length: 5 }).map((_, colI) => (
                                        <span key={colI}>{data.emoji}</span>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="swiper-content"style={{ position: "relative", zIndex: 1 }}>
                        <h1 style={{ fontSize: "40px" }}>{data.title}</h1>
                        </div>
                        {index === activeIndex && (
                            <iframe
                                src={`https://open.spotify.com/embed/playlist/${data.link}?utm_source=generator`}
                                allow="encrypted-media"
                            />)
                        }
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
}

export default InsertSwiper;