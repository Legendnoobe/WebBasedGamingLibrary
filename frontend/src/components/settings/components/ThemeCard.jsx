import React from 'react';
import { Check } from 'lucide-react';

/**
 * Single theme preset card.
 * Shows a color-strip preview, name, description, and an active checkmark.
 */
export default function ThemeCard({ theme, isActive, onClick }) {
    return (
        <div
            onClick={onClick}
            tabIndex="0"
            onKeyDown={e => e.key === 'Enter' && onClick()}
            style={{
                cursor: 'pointer',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                border: isActive
                    ? '2px solid var(--accent)'
                    : '2px solid rgba(255,255,255,0.07)',
                background: theme.values.bgDark,
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: isActive ? '0 0 20px rgba(107,76,255,0.35)' : 'none',
            }}
            onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
            }}
            onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
            }}
        >
            {/* Color strip */}
            <div style={{ height: '38px', display: 'flex' }}>
                {theme.preview.map((color, i) => (
                    <div key={i} style={{ flex: 1, background: color }} />
                ))}
            </div>

            {/* Info row */}
            <div style={{ padding: '9px 12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px', color: theme.values.textMain }}>
                    {theme.name}
                </div>
                <div style={{ fontSize: '11px', color: theme.values.textMuted }}>
                    {theme.desc}
                </div>
            </div>

            {/* Active badge */}
            {isActive && (
                <div style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'var(--accent)', borderRadius: '50%',
                    width: '20px', height: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Check size={12} color="#fff" />
                </div>
            )}
        </div>
    );
}
