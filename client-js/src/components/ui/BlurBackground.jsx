import React from "react";
import { motion } from "framer-motion";

export const BlurBackground = () => {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-background pointer-events-none">
            {/* Primary Blob */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [-50, 50, -50],
                    y: [-20, 20, -20],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/10 blur-[120px]"
            />

            {/* Secondary Blob */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [30, -30, 30],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-secondary/10 blur-[120px]"
            />

            {/* Grid Overlay for "Cyber/AI" feel */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#65a30d40_1px,transparent_1px),linear-gradient(to_bottom,#65a30d40_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            />
        </div>
    );
};
