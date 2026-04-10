import React from 'react';
import Section from '../components/Section.jsx';
import { useLocale } from '../../../i18n/LocaleContext.jsx';

export default function ApiTab({ uiConfig, onConfigChange }) {
    const { t } = useLocale();
    return (
        <Section title={t('api.title')} desc={t('api.desc')}>
            <input
                id="input-sgdb-api-key"
                type="text"
                placeholder={t('api.placeholder')}
                value={uiConfig.steamGridApiKey || ''}
                onChange={e => onConfigChange('steamGridApiKey', e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '13px', padding: '11px 14px', background: 'rgba(0,0,0,0.4)' }}
            />
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px' }}>
                🔗{' '}
                <a href="https://www.steamgriddb.com/profile/preferences/api" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
                    {t('api.linkText')}
                </a>{' '}
                {t('api.linkSuffix')}
            </p>
        </Section>
    );
}
