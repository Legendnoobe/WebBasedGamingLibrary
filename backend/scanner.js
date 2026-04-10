const fs = require('fs');
const path = require('path');

// ─── Negative keywords — installers, helpers, crash reporters, etc. ─────────
const HIGH_NEGATIVE = ['unins', 'uninstall', 'setup', 'install', 'redist', 'dxsetup',
    'dxwebsetup', 'crash', 'crs-handler', 'bugreport', 'sentry', 'helper'];
const MED_NEGATIVE  = ['launcher', 'updater', 'update', 'patcher', 'patch',
    'easyanticheat', 'battleye', 'uplay', 'galaxyclient', 'steam_api'];
const LOW_NEGATIVE  = ['dx', 'vc_redist', 'oalinst', 'physx'];

// ─── Clean up repack/scene release folder names ──────────────────────────────
function cleanGameName(folderName) {
    let name = folderName.replace(/\[.*?\]/g, '');
    name = name.replace(/\(.*?\)/g, '');
    name = name.replace(/[-_.]/g, ' ');

    const ignoreWords = [
        'fitgirl', 'repack', 'dodi', 'skidrow', 'codex', 'cpy', 'rxg', 'kaos',
        'xatab', 'gog', 'v1', 'v2', 'v3', 'patch', 'update', 'edition', 'multi',
        'elamigos', 'masquerade', 'prophet', 'plaza', 'hoodlum', 'razor1911'
    ];

    const parts = name.split(' ');
    const cleaned = parts.filter(p => !ignoreWords.includes(p.toLowerCase().trim()));
    return cleaned.join(' ').replace(/\s+/g, ' ').trim();
}

// ─── Simple fuzzy similarity (Jaccard on trigrams) ───────────────────────────
function similarity(a, b) {
    if (!a || !b) return 0;
    const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const na = normalize(a), nb = normalize(b);
    if (!na || !nb) return 0;

    const trigrams = s => {
        const set = new Set();
        for (let i = 0; i < s.length - 2; i++) set.add(s.slice(i, i + 3));
        return set;
    };

    const ta = trigrams(na), tb = trigrams(nb);
    let intersection = 0;
    ta.forEach(t => { if (tb.has(t)) intersection++; });
    const union = ta.size + tb.size - intersection;
    return union === 0 ? 0 : intersection / union;
}

// ─── Score a single EXE against its parent game folder ───────────────────────
function scoreExe(exePath, exeName, gameFolder, depthFromGameRoot) {
    const low = exeName.toLowerCase();
    const nameNoExt = low.replace('.exe', '');
    let score = 0;

    // Depth penalty (prefer shallower executables)
    score -= depthFromGameRoot * 2;

    // File size bonus (real game executables are usually large)
    try {
        const stat = fs.statSync(exePath);
        const sizeMB = stat.size / (1024 * 1024);
        if (sizeMB > 10) score += 5;
        else if (sizeMB > 1) score += 3;
        else if (sizeMB < 0.1) score -= 4; // tiny = probably a stub
    } catch (_) {}

    // Name similarity bonus — does the exe name match the game folder name?
    const gameFolderClean = cleanGameName(gameFolder).toLowerCase();
    const sim = similarity(gameFolderClean, nameNoExt);
    score += Math.round(sim * 8); // up to +8 for a perfect name match

    // Negative keyword penalties
    for (const kw of HIGH_NEGATIVE) {
        if (low.includes(kw)) { score -= 10; break; }
    }
    for (const kw of MED_NEGATIVE) {
        if (low.includes(kw)) { score -= 5; break; }
    }
    for (const kw of LOW_NEGATIVE) {
        if (low.includes(kw)) { score -= 3; break; }
    }

    // Bonus for EXE name that starts with a capital / matches typical game naming
    if (/^[A-Z]/.test(exeName)) score += 1;

    return score;
}

// ─── Recursive EXE finder, returns candidates with depth info ────────────────
function findExeRecursive(dirPath, depth = 0, maxDepth = 3) {
    if (depth > maxDepth) return [];
    let exes = [];
    try {
        const db = require('./database');
        const uiConfig = db.getDb().uiConfig || {};
        const ignoredStr = uiConfig.ignoredExes || 'unins, crash, redist, setup, dxwebsetup';
        const ignoredList = ignoredStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(dirPath, item.name);
            if (item.isDirectory()) {
                exes = exes.concat(findExeRecursive(fullPath, depth + 1, maxDepth));
            } else if (item.isFile() && item.name.toLowerCase().endsWith('.exe')) {
                const low = item.name.toLowerCase();
                const isUserIgnored = ignoredList.some(ign => low.includes(ign));
                if (!isUserIgnored) {
                    exes.push({ dir: dirPath, file: item.name, fullPath, depth });
                }
            }
        }
    } catch (_) {}
    return exes;
}

// ─── Main scan entry point ────────────────────────────────────────────────────
function scanFolderForGames(folderPath) {
    if (!fs.existsSync(folderPath)) return [];

    let foundGames = [];

    try {
        const rootItems = fs.readdirSync(folderPath, { withFileTypes: true });

        for (const item of rootItems) {
            const itemPath = path.join(folderPath, item.name);

            if (item.isDirectory()) {
                const gameName = cleanGameName(item.name);
                const allExes = findExeRecursive(itemPath);

                if (allExes.length > 0) {
                    // Score every candidate and pick the winner
                    const scored = allExes.map(e => ({
                        ...e,
                        score: scoreExe(e.fullPath, e.file, item.name, e.depth)
                    })).sort((a, b) => b.score - a.score);

                    const best = scored[0];

                    foundGames.push({
                        name: gameName,
                        rawFolderName: item.name,
                        path: best.dir,
                        exe: best.file,
                        _candidates: scored.length // for debugging
                    });
                }

            } else if (item.isFile() && item.name.toLowerCase().endsWith('.exe')) {
                // EXE directly in the root scan folder
                const low = item.name.toLowerCase();
                const isBasicBad = HIGH_NEGATIVE.some(kw => low.includes(kw));
                if (!isBasicBad) {
                    foundGames.push({
                        name: cleanGameName(path.basename(item.name, '.exe')),
                        rawFolderName: '',
                        path: folderPath,
                        exe: item.name
                    });
                }
            }
        }
    } catch (err) {
        console.error('Error scanning folder:', err);
    }

    return foundGames;
}

module.exports = { scanFolderForGames, cleanGameName };
