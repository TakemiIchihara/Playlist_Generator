import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface SongTitlesProps {
    songTitles: string[];
    emoji: string;
}

const shuffleSongs = (array: string[]) => {
    let newArray = [...array];

    for(let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

const SongTitles = ({ songTitles }: SongTitlesProps) => {
    const [songs, setSongs] = useState<string[]>([]);

    const [elWidths, setElWidths] = useState<number[]>([]);
    const [styles, setStyles] = useState<{ fontSize: string, fontWeight: number, top: string}[]>([]);
    const refs = useRef<(HTMLHeadingElement | null)[]>([]);

    useEffect(() => {
       setSongs(shuffleSongs(songTitles));
    }, [songTitles]);

    useEffect(() => {
        let top = 0;
        const newStyles = songs.map(() => {
            const fontSize = Math.random() * 24 + 10;
            const fontWeight = (Math.random() * 5) * 100 + 300;
            top += fontSize + 16;
            return { fontSize: `${fontSize}px` , fontWeight, top: `${top}px`}
        })

        setStyles(newStyles);
    }, [songs])

    useEffect(() => {
        if(refs.current.length === 0 || styles.length === 0) return;

        const timeoutId = setTimeout(() => {
            const heights = refs.current.map((ref) => ref?.offsetHeight ?? 0);
            const widths = refs.current.map((ref) => ref?.offsetWidth ?? 0);

            setElWidths(widths);

            let culmulativeTop = 0;
            const updateStyles = styles.map((style, i) => {
                const updateHeights = {
                    ...style,
                    top: culmulativeTop + "px"
                };
                culmulativeTop += heights[i] + 8;
                return updateHeights;
            });

            setStyles(updateStyles);
        }, 0);
        return () => clearTimeout(timeoutId);
    }, [styles])

    return (
        <div id="songs-holder">
            {songs.map((song, i) => {
                const elWidth = elWidths[i];

                const minDuration = 6;
                const maxDuration = 20;
                const minWidth = Math.min(...elWidths);
                const maxWidth = Math.max(...elWidths);

                const durations = elWidths.map((w) => {
                const normalized = (w - minWidth) / (maxWidth - minWidth); // 0 to 1
                return normalized * (maxDuration - minDuration) + minDuration;
});

                return (
                    <motion.div
                        key={`${i}`}
                        className="song-name"
                        style={{
                            display: "inline-block",
                            position: "absolute",
                            whiteSpace: "nowrap",
                            opacity: ".8",
                            ...styles[i]
                        }}
                        initial={{ x: window.innerWidth + 100 }}
                        animate={{ x: -elWidth - 100 }}
                        transition={{ duration: durations[i], delay: Math.random() * 5 + .5, ease: "linear",repeat: Infinity}}
                    >
                        <motion.h2
                            key={`${i}-${song}`}
                            ref={(el) => {refs.current[i] = el}}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0}}
                            transition={{ duration: 1 }}
                        >
                            {song}
                        </motion.h2>
                    </motion.div>)
            })}
        </div>
    );
}

export default SongTitles;