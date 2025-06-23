import { AnimatePresence, motion } from "framer-motion";

interface PageTransitionProps {
    children: React.ReactNode;
    transitionKey: string;
    onFinishExit?: () => void;
    idName?: string;
}

const PageTransition = ({
        children,
        transitionKey,
        onFinishExit,
        idName
    }: PageTransitionProps) => (
        <AnimatePresence 
            mode="wait"
            onExitComplete={()=> {
                setTimeout(() => onFinishExit?.(), 0)
            }}
        >
            <motion.div
                    className={idName}
                    key={transitionKey}
                    initial={{ opacity: 0 , y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                >
                    {children}
            </motion.div>
        </AnimatePresence>
);

export default PageTransition;