import React from 'react';
import { useLocale } from '../../../i18n/LocaleContext.jsx';
import Section from '../components/Section.jsx';

const FLAGS = { tr: '🇹🇷', en: '🇬🇧' };

export default function GeneralTab() {
    const { locale, setLocale, t } = useLocale();

    return (
        <Section title={t('general.title')}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                {t('general.language')}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
                {['tr', 'en'].map(lang => (
                    <button
                        key={lang}
                        id={`lang-btn-${lang}`}
                        className="btn"
                        style={{
                            padding: '10px 24px', fontSize: '15px',
                            background: locale === lang ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                            border: locale === lang ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            color: locale === lang ? '#fff' : 'var(--text-muted)',
                            fontWeight: locale === lang ? 700 : 400,
                            transition: 'all 0.2s',
                            gap: '8px',
                        }}
                        onClick={() => setLocale(lang)}
                    >
                        {FLAGS[lang]} {t(`general.lang${lang.toUpperCase()}`)}
                    </button>
                ))}
            </div>
        </Section>
    );
}
