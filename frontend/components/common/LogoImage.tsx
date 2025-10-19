/**
 * LogoImage Component
 *
 * A wrapper around Next.js Image with built-in fallback support
 * for external CDN images that may fail to load
 */

"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoImageProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  fallbackText?: string;
}

export function LogoImage({
  src,
  alt,
  size = 32,
  className = "",
  fallbackText,
}: LogoImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    // Fallback: Show initials or icon
    const initials = fallbackText || alt.substring(0, 2).toUpperCase();

    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-br from-primary-green to-primary-green-light text-white font-semibold ${className}`}
        style={{ width: size, height: size, fontSize: size / 2.5 }}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      onError={() => setHasError(true)}
      unoptimized // Skip Next.js optimization for external CDN images
    />
  );
}
