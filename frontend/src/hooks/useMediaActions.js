/**
 * useMediaActions.js — Image upload / crop and SteamGridDB action handlers.
 */
import { useState } from 'react';
import { useLocale } from '../i18n/LocaleContext.jsx';
import { uploadCover, uploadHero, sgdbSearch, sgdbGetGame, sgdbApply } from '../api/api.js';

export function useMediaActions({ state, refreshGames }) {
    const { t } = useLocale();
    const {
        showToast, uiConfig, selectedGame, setSelectedGame,
        cropTarget, setCropTarget,
    } = state;

    const [sgdbLoading, setSgdbLoading] = useState(false);

    // ── Image file → crop dialog ──────────────────────────────────────────────
    const handleImageFileSelect = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setCropTarget({ dataUrl: reader.result, type });
        reader.readAsDataURL(file);
        e.target.value = null;
    };

    // ── Crop done → upload ────────────────────────────────────────────────────
    const handleCropDone = async (blob) => {
        if (!selectedGame || !cropTarget) return;
        const formData = new FormData();
        formData.append(cropTarget.type, blob, 'upload.jpg');
        try {
            showToast(t('toast.loading'));
            if (cropTarget.type === 'cover') await uploadCover(selectedGame.id, formData);
            else await uploadHero(selectedGame.id, formData);
            showToast(t('toast.uploaded'));
            const g = await refreshGames();
            const updated = g.find(x => x.id === selectedGame.id);
            if (updated) setSelectedGame(updated);
        } catch { showToast(t('toast.uploadFail')); }
        setCropTarget(null);
    };

    // ── SteamGridDB search ────────────────────────────────────────────────────
    const handleSgdbSearch = async (query) => {
        if (!uiConfig?.steamGridApiKey) { showToast(t('sgdb.needApiKey')); return null; }
        setSgdbLoading(true);
        try { return await sgdbSearch(query); }
        catch { showToast(t('sgdb.searchError')); return null; }
        finally { setSgdbLoading(false); }
    };

    // ── SteamGridDB apply ─────────────────────────────────────────────────────
    const handleSgdbAction = async (gameId, type, url) => {
        setSgdbLoading(true);
        try {
            if (gameId && !type && !url) return await sgdbGetGame(gameId);
            if (type && url && selectedGame) {
                await sgdbApply(selectedGame.id, type, url);
                showToast(t('toast.applied'));
                const g = await refreshGames();
                const updated = g.find(x => x.id === selectedGame.id);
                if (updated) setSelectedGame(updated);
            }
        } catch { showToast(t('sgdb.applyError')); }
        finally { setSgdbLoading(false); }
    };

    return { sgdbLoading, handleImageFileSelect, handleCropDone, handleSgdbSearch, handleSgdbAction };
}
