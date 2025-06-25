import { motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";

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
		const [fontStyles, setFontStyles] = useState<{ fontSize: string, fontWeight: number }[]>([]);
		const [positionStyles, setPositionStyles] = useState<{ top: string, left: string }[]>([]);
    const refs = useRef<(HTMLHeadingElement | null)[]>([]);
		const [parentHeight, setParentHeight] = useState<string>("");

		useEffect(() => {
       setSongs(shuffleSongs(songTitles));
			 console.log("this is triggered by songTitles");
    }, [songTitles]);

		const newFontStyles = useMemo(() => {
			console.log("this is triggered by songs");
			return songs.map(() => {
				const fontSize = Math.floor(Math.random() * 14 + 10);
				const fontWeight = (Math.random() * 5) * 100 + 300;
				return { fontSize: `${fontSize}px` , fontWeight };
			});
		}, [songs]);

		useEffect(() => {
			setFontStyles(newFontStyles);
			console.log("this is triggered by newFontStyles");
		}, [newFontStyles]);

    useEffect(() => {
			if(refs.current.length === 0 || fontStyles.length === 0) return;

			let left: string;
			let culmulativeTop = 0;

			const heights = refs.current.map((ref) => ref?.offsetHeight ?? 0);
			const widths = refs.current.map((ref) => ref?.offsetWidth ?? 0);

			setElWidths(widths);

			const newPositionStyles = songs.map((_, i) => {
				const top = culmulativeTop + "px";
				culmulativeTop += heights[i] + 8;

				if(i % 2 == 1) {
					left = Math.random() * 80 + "px";
				} else {
					left = Math.random() * 100 + 400 + "px";
				}
				
				return { top: top, left: left }
			})
			console.log("this is triggered by fontStyles");

			setParentHeight(culmulativeTop + "px");

			setPositionStyles(newPositionStyles);

    }, [fontStyles])

    return (
        <div id="songs-holder" style={{ height: parentHeight }}>
            {songs.map((song, i) => { // songs.slice(0, 6).map in case wanting to limit the number displayed
                const elWidth = elWidths[i];

                const minDuration = 10;
                const maxDuration = 50;
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
                            position: "absolute",
                            whiteSpace: "nowrap",
                            opacity: ".8",
                            ...fontStyles[i],
														...positionStyles[i]
                        }}
                        initial={{ x: window.innerWidth + 100 }}
                        animate={{ x: -elWidth - 100 }}
                        transition={{ duration: durations[i], delay: Math.random() * 5 + .5, ease: "linear",repeat: Infinity}}
                    >
                        <h2 ref={(el) => {refs.current[i] = el}}>{song}</h2>
                    </motion.div>)
            })}
        </div>
    );
}


export default SongTitles;