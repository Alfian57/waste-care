'use client';

import { useEffect } from 'react';

/**
 * Load external CSS asynchronously to prevent render blocking
 */
export function AsyncStyleLoader() {
  useEffect(() => {
    // Load MapTiler SDK CSS only when needed
    const loadStyle = (href: string, id: string) => {
      if (document.getElementById(id)) return;
      
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print';
      link.onload = function() {
        // @ts-ignore
        this.media = 'all';
      };
      document.head.appendChild(link);
    };

    loadStyle(
      'https://cdn.jsdelivr.net/npm/@maptiler/sdk@latest/dist/maptiler-sdk.css',
      'maptiler-css'
    );
    
    loadStyle(
      'https://cdn.jsdelivr.net/npm/@vetixy/circular-std@1.0.0/dist/index.min.css',
      'circular-font-css'
    );
  }, []);

  return null;
}
