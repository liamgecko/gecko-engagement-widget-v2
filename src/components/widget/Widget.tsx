"use client";

import { useState } from "react";
import { WidgetTrigger } from "./WidgetTrigger";
import { WidgetContainer } from "./WidgetContainer";

export const Widget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <WidgetContainer isOpen={isOpen} onClose={handleClose} />
      <WidgetTrigger isOpen={isOpen} onToggle={handleToggle} />
    </div>
  );
}; 