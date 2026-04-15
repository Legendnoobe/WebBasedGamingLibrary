import React from 'react';
import Section from '../components/Section.jsx';
import ThemeCard from '../components/ThemeCard.jsx';
import CustomThemeBuilder from '../components/CustomThemeBuilder.jsx';
import { THEMES, FONT_OPTIONS } from '../themePresets.js';
import { useLocale } from '../../../i18n/LocaleContext.jsx';

export default function AppearanceTab({ uiConfig, onConfigChange, applyUiConfig, onThemeSelect, activeThemeKey }) {
    const { t } = useLocale();
    const darkThemes  = THEMES.filter(th => !th.light);
    const lightThemes = THEMES.filter(th =>  th.light);

    return (
        <>
            <Section title={t('appearance.darkThemes')}>
                <ThemeGrid themes={darkThemes} activeKey={activeThemeKey} onSelect={onThemeSelect} />
            </Section>

            <Section title={t('appearance.lightThemes')}>
                <ThemeGrid themes={lightThemes} activeKey={activeThemeKey} onSelect={onThemeSelect} />
            </Section>

            <CustomThemeBuilder
                currentConfig={uiConfig}
                onApply={(theme) => onThemeSelect({ key: theme.key, values: theme })}
                onConfigChange={onConfigChange}
            />

            <Section title={t('appearance.fontTitle')}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {FONT_OPTIONS.map(f => (
                        <button
                            key={f}
                            className="btn"
                            style={{
                                fontSize: '13px', padding: '7px 14px',
                                background: uiConfig.fontFamily === f ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                                border: 'none', fontFamily: `'${f}', sans-serif`,
                            }}
                            onClick={() => {
                                onConfigChange('fontFamily', f);
                                document.body.style.fontFamily = `'${f}', -apple-system, sans-serif`;
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </Section>

            <Section title={t('appearance.playOpacity')}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                        type="range" min="0" max="1" step="0.05"
                        value={uiConfig.playBtnOpacity ?? 0.75}
                        onChange={e => {
                            const v = parseFloat(e.target.value);
                            onConfigChange('playBtnOpacity', v);
                            document.documentElement.style.setProperty('--play-btn-opacity', v);
                        }}
                        style={{ flex: 1, accentColor: 'var(--accent)' }}
                    />
                    <span style={{ minWidth: '42px', textAlign: 'right', fontSize: '14px', fontWeight: 600 }}>
                        {Math.round((uiConfig.playBtnOpacity ?? 0.75) * 100)}%
                    </span>
                </div>
            </Section>

            <Section title={t('appearance.heroBrightness')}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                        type="range" min="0" max="1" step="0.05"
                        value={uiConfig.heroBrightness ?? 0.6}
                        onChange={e => {
                            const v = parseFloat(e.target.value);
                            onConfigChange('heroBrightness', v);
                        }}
                        style={{ flex: 1, accentColor: 'var(--accent)' }}
                    />
                    <span style={{ minWidth: '42px', textAlign: 'right', fontSize: '14px', fontWeight: 600 }}>
                        {Math.round((uiConfig.heroBrightness ?? 0.6) * 100)}%
                    </span>
                </div>
            </Section>

            <Section title={t('appearance.accentColor')}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="color"
                        value={uiConfig.accent?.startsWith('#') ? uiConfig.accent : '#6b4cff'}
                        onChange={e => {
                            onConfigChange('accent', e.target.value);
                            document.documentElement.style.setProperty('--accent', e.target.value);
                        }}
                        style={{ width: '44px', height: '44px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '8px', padding: 0 }}
                    />
                    <input
                        value={uiConfig.accent || ''}
                        onChange={e => onConfigChange('accent', e.target.value)}
                        style={{ flex: 1, fontFamily: 'monospace', fontSize: '13px' }}
                        placeholder="#6b4cff or rgba(…)"
                    />
                </div>
            </Section>
        </>
    );
}

function ThemeGrid({ themes, activeKey, onSelect }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {themes.map(theme => (
                <ThemeCard key={theme.key} theme={theme} isActive={activeKey === theme.key} onClick={() => onSelect(theme)} />
            ))}
        </div>
    );
}
