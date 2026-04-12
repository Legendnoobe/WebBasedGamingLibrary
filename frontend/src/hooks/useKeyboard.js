/**
 * useKeyboard.js — Keyboard navigation hook.
 * Maps keyboard events to the same callback interface as useGamepad so
 * App.jsx can pass identical handlers to both inputs without duplication.
 *
 * Bindings:
 *   ArrowUp/Down/Left/Right  → onUp / onDown / onLeft / onRight
 *   Enter                    → onSelect  (open details)
 *   Space                    → onHoldA   (quick launch / confirm)
 *   Escape                   → onBack
 *   F                        → onStart   (settings / fullscreen via onStart)
 *   [ / ]                    → onLB / onRB
 */
import { useEffect, useRef } from 'react';

const KEY_MAP = {
    ArrowUp:    'onUp',
    ArrowDown:  'onDown',
    ArrowLeft:  'onLeft',
    ArrowRight: 'onRight',
    Enter:      'onSelect',
    ' ':        'onHoldA',
    Escape:     'onBack',
    '[':        'onLB',
    ']':        'onRB',
};

// Keys that should NOT trigger when focus is on an input/textarea
const INPUT_BLOCKLIST = new Set(['ArrowUp', 'ArrowDown', ' ', 'Enter', 'Escape']);

export function useKeyboard(callbacks) {
    const cbRef = useRef(callbacks);
    useEffect(() => { cbRef.current = callbacks; });

    useEffect(() => {
        const onKeyDown = (e) => {
            const tag = document.activeElement?.tagName;
            const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

            // Let inputs handle their own keys (except Escape which still closes modals)
            if (isInput && INPUT_BLOCKLIST.has(e.key) && e.key !== 'Escape') return;

            const cbName = KEY_MAP[e.key];
            if (!cbName) return;

            // Prevent default browser scroll for arrow keys and space
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            cbRef.current[cbName]?.();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);
}
