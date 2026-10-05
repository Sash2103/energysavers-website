'use client';
import { useEffect } from 'react';
import { watchWorkplans, unwatchWorkplans } from './dom';

// Workplans run their current once, when they come into view (shown complete with reduced motion).
export default function Workplans() {
  useEffect(() => {
    watchWorkplans(document);
    return () => unwatchWorkplans(document);
  }, []);
  return null;
}
