"use client";
import { useEffect } from 'react';

export default function TwitterWidgetLoader() {
  useEffect(() => {
    // Check if Twitter widgets script is already loaded
    if (window.twttr) {
      window.twttr.widgets.load();
      return;
    }

    // Load Twitter widgets script
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.body.appendChild(script);

    return () => {
      // Cleanup is not necessary as the script will be reused
    };
  }, []);

  return null;
}
