import { AnimatePresence, motion } from "framer-motion";

interface PageTransitionProps {
    children: React.ReactNode;
    transitionKey: string;
    isExiting: boolean;
    onFinishExit?: () => void;
    idName?: string;
}

const PageTransition = ({
        children,
        transitionKey,
        isExiting,
        onFinishExit,
        idName
    }: PageTransitionProps) => (
        <AnimatePresence 
            mode="wait"
            onExitComplete={()=> {
                setTimeout(() => onFinishExit?.(), 1500)
            }}
        >
            {!isExiting && (
                <motion.div
                        className={idName}
                        key={transitionKey}
                        initial={{ opacity: 0 , y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    >
                        {children}
                </motion.div>
            )}
        </AnimatePresence>
);

export default PageTransition;