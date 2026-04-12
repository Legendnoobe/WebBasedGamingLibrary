// themePresets.js — All theme preset definitions.
// Surface tokens: see themeTokens.js
import { DARK_SURFACE, LIGHT_SURFACE } from './themeTokens.js';

export { FONT_OPTIONS, THEME_COLOR_FIELDS } from './themeTokens.js';

export const THEMES = [
    // ── Dark Themes ──────────────────────────────────────────────────────────
    {
        key: 'dark_matter', name: '🌑 Dark Matter', desc: 'Varsayılan — Lacivert & Mor',
        preview: ['#0f1118', '#6b4cff', '#8266ff'],
        values: { bgDark: '#0f1118', bgCard: 'rgba(25, 28, 38, 0.6)', bgCardHover: 'rgba(35, 38, 50, 0.8)', textMain: '#f5f5f7', textMuted: '#a1a3af', accent: '#6b4cff', accentHover: '#8266ff', danger: '#ff4757', playBtnColor: '#6b4cff', playBtnOpacity: 0.75, fontFamily: 'Inter', ...DARK_SURFACE },
    },
    {
        key: 'ocean_depths', name: '🌊 Ocean Depths', desc: 'Derin Mavi & Cyan',
        preview: ['#050f1a', '#0077b6', '#00b4d8'],
        values: { bgDark: '#050f1a', bgCard: 'rgba(5, 25, 45, 0.7)', bgCardHover: 'rgba(10, 40, 70, 0.85)', textMain: '#e8f4fd', textMuted: '#90b8d4', accent: '#0098d4', accentHover: '#00b4d8', danger: '#ef233c', playBtnColor: '#0098d4', playBtnOpacity: 0.8, fontFamily: 'Inter', ...DARK_SURFACE },
    },
    {
        key: 'crimson_fire', name: '🔥 Crimson Fire', desc: 'Kırmızı & Turuncu',
        preview: ['#120808', '#c1121f', '#e85d04'],
        values: { bgDark: '#120808', bgCard: 'rgba(30, 10, 10, 0.7)', bgCardHover: 'rgba(45, 15, 15, 0.85)', textMain: '#ffe8e8', textMuted: '#c49a9a', accent: '#c1121f', accentHover: '#e85d04', danger: '#ff6b35', playBtnColor: '#c1121f', playBtnOpacity: 0.8, fontFamily: 'Inter', ...DARK_SURFACE },
    },
    {
        key: 'forest_night', name: '🌲 Forest Night', desc: 'Koyu Yeşil & Nane',
        preview: ['#080f0a', '#2d6a4f', '#52b788'],
        values: { bgDark: '#080f0a', bgCard: 'rgba(10, 25, 15, 0.7)', bgCardHover: 'rgba(15, 38, 22, 0.85)', textMain: '#e8faf0', textMuted: '#7fb899', accent: '#2d6a4f', accentHover: '#52b788', danger: '#e63946', playBtnColor: '#2d6a4f', playBtnOpacity: 0.8, fontFamily: 'Inter', ...DARK_SURFACE },
    },
    {
        key: 'sunset_gold', name: '☀️ Sunset Gold', desc: 'Altın & Amber',
        preview: ['#100c00', '#d4a017', '#f4a261'],
        values: { bgDark: '#100c00', bgCard: 'rgba(28, 20, 0, 0.7)', bgCardHover: 'rgba(42, 30, 5, 0.85)', textMain: '#fff8e7', textMuted: '#c8a96e', accent: '#d4a017', accentHover: '#f4a261', danger: '#d62828', playBtnColor: '#d4a017', playBtnOpacity: 0.8, fontFamily: 'Inter', ...DARK_SURFACE },
    },
    {
        key: 'monochrome', name: '⚙️ Monochrome', desc: 'Saf Siyah-Beyaz',
        preview: ['#000000', '#ffffff', '#888888'],
        values: { bgDark: '#000000', bgCard: 'rgba(20, 20, 20, 0.7)', bgCardHover: 'rgba(35, 35, 35, 0.85)', textMain: '#ffffff', textMuted: '#888888', accent: '#cccccc', accentHover: '#ffffff', danger: '#ff3333', playBtnColor: '#cccccc', playBtnOpacity: 0.8, fontFamily: 'Inter', ...DARK_SURFACE },
    },
    {
        key: 'midnight_blue', name: '🌙 Midnight Blue', desc: 'Gece Mavisi & İndigo',
        preview: ['#04061a', '#3a3fc4', '#6366f1'],
        values: { bgDark: '#04061a', bgCard: 'rgba(8, 12, 40, 0.7)', bgCardHover: 'rgba(14, 20, 58, 0.85)', textMain: '#e0e0ff', textMuted: '#8890cc', accent: '#4f52d4', accentHover: '#6366f1', danger: '#f43f5e', playBtnColor: '#4f52d4', playBtnOpacity: 0.82, fontFamily: 'Outfit', ...DARK_SURFACE },
    },
    {
        key: 'neon_cyberpunk', name: '🟣 Neon Cyberpunk', desc: 'Koyu + Neon Pembe & Cyan',
        preview: ['#0a000f', '#ff2d9b', '#00fff0'],
        values: { bgDark: '#0a000f', bgCard: 'rgba(18, 0, 28, 0.75)', bgCardHover: 'rgba(28, 0, 44, 0.9)', textMain: '#f0e8ff', textMuted: '#a070cc', accent: '#ff2d9b', accentHover: '#ff60b8', danger: '#ff4d4d', playBtnColor: '#ff2d9b', playBtnOpacity: 0.85, fontFamily: 'Space Grotesk', ...DARK_SURFACE },
    },
    {
        key: 'abyss_teal', name: '🌀 Abyss Teal', desc: 'Neredeyse Siyah & Teal',
        preview: ['#020d0d', '#0f6b6b', '#14b8a6'],
        values: { bgDark: '#020d0d', bgCard: 'rgba(4, 24, 24, 0.75)', bgCardHover: 'rgba(8, 38, 38, 0.9)', textMain: '#e0ffff', textMuted: '#5fa8a8', accent: '#0f766e', accentHover: '#14b8a6', danger: '#fb923c', playBtnColor: '#0f766e', playBtnOpacity: 0.82, fontFamily: 'Roboto', ...DARK_SURFACE },
    },
    // ── Light Themes ─────────────────────────────────────────────────────────
    {
        key: 'cloud_white', name: '☁️ Cloud White', desc: 'Temiz Beyaz & Gri (Açık)', light: true,
        preview: ['#f0f2f5', '#4f46e5', '#818cf8'],
        values: { bgDark: '#f0f2f5', bgCard: 'rgba(255, 255, 255, 0.78)', bgCardHover: 'rgba(228, 230, 240, 0.92)', textMain: '#1e1e2e', textMuted: '#6b7280', accent: '#4f46e5', accentHover: '#6366f1', danger: '#dc2626', playBtnColor: '#4f46e5', playBtnOpacity: 0.85, fontFamily: 'Inter', ...LIGHT_SURFACE },
    },
    {
        key: 'sakura', name: '🌸 Sakura', desc: 'Pembe & Gül (Açık)', light: true,
        preview: ['#fdf2f8', '#db2777', '#f472b6'],
        values: { bgDark: '#fdf2f8', bgCard: 'rgba(255, 240, 248, 0.82)', bgCardHover: 'rgba(252, 220, 238, 0.96)', textMain: '#1a0010', textMuted: '#9d174d', accent: '#db2777', accentHover: '#f472b6', danger: '#b91c1c', playBtnColor: '#db2777', playBtnOpacity: 0.85, fontFamily: 'Nunito', ...LIGHT_SURFACE, bgPanel: 'rgba(255, 240, 248, 0.92)', bgSurface: 'rgba(253, 242, 248, 0.96)' },
    },
    {
        key: 'mint_fresh', name: '🌿 Mint Fresh', desc: 'Açık Yeşil & Nane (Açık)', light: true,
        preview: ['#f0faf4', '#059669', '#34d399'],
        values: { bgDark: '#f0faf4', bgCard: 'rgba(240, 255, 248, 0.82)', bgCardHover: 'rgba(209, 250, 229, 0.96)', textMain: '#052e16', textMuted: '#065f46', accent: '#059669', accentHover: '#34d399', danger: '#dc2626', playBtnColor: '#059669', playBtnOpacity: 0.85, fontFamily: 'Poppins', ...LIGHT_SURFACE, bgPanel: 'rgba(240, 255, 248, 0.92)', bgSurface: 'rgba(248, 255, 251, 0.96)' },
    },
];
