import React, { useState } from 'react';
import { X, Search, ChevronLeft } from 'lucide-react';
import { useLocale } from '../../i18n/LocaleContext.jsx';

export default function FolderPicker({ pickerMode, drives, currentPath, setCurrentPath, folders, files, onClose, onConfirmFolder, onFileSelect, onLoadDirectory, onNavigateUp, gpFocusIndex }) {
    const { t } = useLocale();

    React.useEffect(() => {
        if (gpFocusIndex >= 0) {
            const el = document.getElementById(`picker-item-${gpFocusIndex}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [gpFocusIndex]);

    const title = pickerMode === 'folder' ? t('picker.titleFolder') : t('picker.titleFile');

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 150 }}>
            <div className="glass-panel"
                style={{ width: '620px', height: '68vh', borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}
                onClick={e => e.stopPropagation()}>
                <div style={{ padding: '20px 24px', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>{title}</h3>
                    <button className="modal-close" style={{ position: 'static' }} onClick={onClose}><X size={20} /></button>
                </div>

                <div style={{ display: 'flex', gap: '8px', padding: '12px 24px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                    <select id="picker-drive-select" value={currentPath.split('\\')[0] + '\\'}
                        onChange={e => onLoadDirectory(e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: '8px', fontSize: '13px' }}>
                        {drives.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <button id="picker-btn-up" className="btn" style={{ padding: '6px 12px', fontSize: '13px', border: 'none' }} onClick={onNavigateUp}>
                        <ChevronLeft size={15} /> {t('picker.up')}
                    </button>
                    <div style={{ flex: 1, padding: '6px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentPath}
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {folders.map((f, idx) => (
                        <PickerRow key={'dir_' + f} id={`picker-item-${idx}`} icon="📁" label={f}
                            isFocused={gpFocusIndex === idx}
                            onClick={() => onLoadDirectory(currentPath + (currentPath.endsWith('\\') ? '' : '\\') + f)} />
                    ))}
                    {pickerMode === 'file' && files.map((file, idx) => (
                        <PickerRow key={'file_' + file} id={`picker-item-${folders.length + idx}`} icon="📄" label={file}
                            isFile isFocused={gpFocusIndex === folders.length + idx}
                            onClick={() => onFileSelect(file)} />
                    ))}
                    {folders.length === 0 && files.length === 0 && (
                        <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '50px', opacity: 0.7 }}>
                            {t('picker.empty')}
                        </div>
                    )}
                </div>

                {pickerMode === 'folder' && (
                    <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.2)' }}>
                        <button id="picker-btn-confirm" className="btn btn-primary" onClick={onConfirmFolder}>
                            ✓ {t('picker.confirm')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function PickerRow({ id, icon, label, isFile, isFocused, onClick }) {
    return (
        <div id={id} onClick={onClick}
            style={{ display: 'flex', gap: '12px', padding: '10px 14px', borderRadius: '9px', cursor: 'pointer', alignItems: 'center', transition: 'background 0.15s', background: isFocused ? 'rgba(107,76,255,0.18)' : (isFile ? 'rgba(255,255,255,0.02)' : 'transparent'), outline: isFocused ? '2px solid rgba(107,76,255,0.5)' : 'none' }}
            onMouseEnter={e => { if (!isFocused) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { if (!isFocused) e.currentTarget.style.background = isFile ? 'rgba(255,255,255,0.02)' : 'transparent'; }}>
            <span style={{ fontSize: '15px' }}>{icon}</span>
            <span style={{ fontSize: '13px' }}>{label}</span>
        </div>
    );
}
