import { easeInOut, motion } from "framer-motion";
// import { color } from "framer-motion";
import { useMemo } from "react";

interface BubblesProps {
    colorData?: string[];
    count: number;
}

const Bubbles = ( { colorData, count }: BubblesProps) => {
    if(!colorData) return;

    const bubbles = useMemo(() => {
        let pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
            
        return Array.from({ length: count }).map((_, i) => {
            let colorOptions: string[] = [...colorData];
            const color1 = pickRandom(colorOptions);
            colorOptions.splice(colorOptions.indexOf(color1), 1);
            const color2 = pickRandom(colorOptions);

            const size = Math.random() * (350 - 280) + 280 + "px";
            const borderRadius = '50%'

            const style: React.CSSProperties = {
                height: size,
                width: size,
                background:  `linear-gradient(${Math.random() * 361}deg, #${color1}, #${color2})`,
                borderRadius,
                position: "absolute",
                zIndex: 0,
                opacity: 0.7,
                filter: "blur(3px)"
            }

            let verValue = Math.random() * (120 - 100) + 100;
            let horValue = Math.random() * (120 - 100) + 100;

            if((i + 1) % 4 === 1) {
                style.top = `-${verValue}px`;
                style.right = `-${horValue}px`;
            } else if ((i + 1) % 4 === 2) {
                style.top = `-${verValue}px`;
                style.left = `-${horValue}px`;
            } else if ((i + 1) % 4 === 3) {
                style.bottom = `-${verValue}px`;
                style.left = `-${horValue}px`;
            } else if ((i + 1) % 4 === 0) {
                style.bottom = `-${verValue}px`;
                style.right = `-${horValue}px`;
            }

            return (
                <div
                    key={`bubble-${count}-${color1}-${color2}-${i}`}
                    style={style}
                    // animate={{ y: [-10, 10] }}
                    // transition={{ duration: isDiagonal ? 4 : 3, repeat: Infinity, repeatType: "mirror" }}
                />
            )
        });
    }, [colorData, count])

    return (
            <motion.div
                className="bubbles-holder"
                key={`bubble-${count}-${colorData.join("")}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 2, delay: .8, ease: easeInOut }}>
                    {bubbles}
            </motion.div>
    );
}

export default Bubbles;