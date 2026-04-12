// themeTokens.js — Shared surface token sets and UI constants for themes

export const DARK_SURFACE = {
    bgPanel:      'rgba(0, 0, 0, 0.42)',
    bgSurface:    'rgba(18, 20, 30, 0.82)',
    bgInput:      'rgba(255, 255, 255, 0.06)',
    borderSubtle: 'rgba(255, 255, 255, 0.06)',
    borderBase:   'rgba(255, 255, 255, 0.10)',
    overlayBg:    'rgba(0, 0, 0, 0.72)',
    scrollbarThumb: 'rgba(255,255,255,0.12)',
};

export const LIGHT_SURFACE = {
    bgPanel:      'rgba(255, 255, 255, 0.88)',
    bgSurface:    'rgba(248, 248, 252, 0.94)',
    bgInput:      'rgba(0, 0, 0, 0.06)',
    borderSubtle: 'rgba(0, 0, 0, 0.08)',
    borderBase:   'rgba(0, 0, 0, 0.14)',
    overlayBg:    'rgba(0, 0, 0, 0.50)',
    scrollbarThumb: 'rgba(0,0,0,0.18)',
};

export const FONT_OPTIONS = ['Inter', 'Roboto', 'Outfit', 'Space Grotesk', 'Nunito', 'Poppins'];

export const THEME_COLOR_FIELDS = [
    { key: 'bgDark',       label: 'Arka Plan' },
    { key: 'bgCard',       label: 'Kart Arka Planı' },
    { key: 'bgCardHover',  label: 'Kart Hover' },
    { key: 'accent',       label: 'Aksan Rengi' },
    { key: 'accentHover',  label: 'Aksan Hover' },
    { key: 'textMain',     label: 'Ana Metin' },
    { key: 'textMuted',    label: 'Soluk Metin' },
    { key: 'playBtnColor', label: 'Oynat Butonu' },
    { key: 'danger',       label: 'Tehlike Rengi' },
];
