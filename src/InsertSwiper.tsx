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
        <div id="swiper-holder">
            <Swiper
                effect="coverflow"
                modules={[EffectCoverflow]}
                // spaceBetween={8}
                slidesPerView={1.5}
                centeredSlides={true}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 300,
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
                        <SwiperSlide key={id} style={{ background: `linear-gradient(135deg, #${data.color[0]}, #${data.color[1]}, #${data.color[2]})` }}>
                                <h1>{data.title}</h1>
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
        </div>
    );
}

export default InsertSwiper;