'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ x: 24, opacity: 0 }}      // slide in from right
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -24, opacity: 0 }}        // slide out to left
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-[70vh]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

