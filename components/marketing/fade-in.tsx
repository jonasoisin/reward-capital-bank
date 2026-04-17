"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeIn({ children, className, delay = 0, direction = "up" }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px"
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  let x = 0;
  let y = 0;

  if (direction === "up") y = 22;
  else if (direction === "down") y = -22;
  else if (direction === "left") x = 22;
  else if (direction === "right") x = -22;

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translate(0px, 0px)" : `translate(${x}px, ${y}px)`,
    transition: `opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: "opacity, transform",
  };

  return (
    <div ref={ref} className={cn(className)} style={style}>
      {children}
    </div>
  );
}
