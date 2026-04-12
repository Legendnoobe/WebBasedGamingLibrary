/**
 * sorting.js — Game list sorting helpers used by useAppState.
 */
import { SORT_KEY_LIST } from '../components/layout/TopBar.jsx';

export const SORT_OPTIONS_MAPPING = (t) =>
    SORT_KEY_LIST.map(key => ({ key, label: t(`sort.${key}`) }));

let _randomSeed = Math.random();
export function resetRandomSeed() { _randomSeed = Math.random(); }

export function applySorting(games, sortKey, groups) {
    const copy = [...games];
    switch (sortKey) {
        case 'name_asc':    return copy.sort((a, b) => a.name.localeCompare(b.name));
        case 'name_desc':   return copy.sort((a, b) => b.name.localeCompare(a.name));
        case 'last_played': return copy.sort((a, b) => {
            if (!a.lastPlayed && !b.lastPlayed) return 0;
            if (!a.lastPlayed) return 1;
            if (!b.lastPlayed) return -1;
            return new Date(b.lastPlayed) - new Date(a.lastPlayed);
        });
        case 'added_new':   return copy.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        case 'added_old':   return copy.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
        case 'group':       return copy.sort((a, b) => {
            const ga = groups.find(g => g.id === a.groupId)?.name || 'zzz';
            const gb = groups.find(g => g.id === b.groupId)?.name || 'zzz';
            return ga.localeCompare(gb);
        });
        case 'random': {
            const seeded = copy.map((v, i) => ({ v, r: Math.abs(Math.sin(_randomSeed + i)) }));
            return seeded.sort((a, b) => a.r - b.r).map(x => x.v);
        }
        default: return copy.sort((a, b) => a.name.localeCompare(b.name));
    }
}
