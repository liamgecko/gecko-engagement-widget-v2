"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WidgetTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const WidgetTrigger = ({ isOpen, onToggle }: WidgetTriggerProps) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={onToggle}
        size="icon"
        className="w-14 h-14 rounded-full p-0 [&_svg]:!w-7 [&_svg]:!h-7 cursor-pointer"
        aria-label={isOpen ? "Close chat widget" : "Open chat widget"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="chevron"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center w-full h-full"
            >
              <ChevronDown strokeWidth={2} />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center w-full h-full"
            >
              <MessageSquareText strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}; 