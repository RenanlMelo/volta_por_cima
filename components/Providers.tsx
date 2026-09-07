"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Respeita "prefers-reduced-motion": para quem pede menos movimento, as
 * animações vão direto ao estado final (público emocionalmente sensível).
 */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
