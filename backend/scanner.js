const fs = require('fs');
const path = require('path');

// ─── Negative EXE name keywords ──────────────────────────────────────────────
const HIGH_NEGATIVE = [
    'unins', 'uninstall', 'setup', 'install', 'redist', 'dxsetup', 'dxwebsetup',
    'crash', 'crs-handler', 'bugreport', 'sentry', 'helper', 'prerequisite', 'prereq',
    'ue4prereq', 'ue4preq', 'netfx', 'dotnet', 'webview2', 'visualcpp',
];
const MED_NEGATIVE = [
    'launcher', 'updater', 'update', 'patcher', 'patch',
    'easyanticheat', 'eac_setup', 'battleye', 'beservice', 'beclient',
    'uplay', 'galaxyclient', 'steam_api', 'steamwebhelper', 'gameoverlayrenderer',
    'vcredist', 'mono', 'unitycrasher', 'crashreportclient', 'crashsender',
    'pluginhost', 'editorserver', 'dedicatedserver',
];
const LOW_NEGATIVE = ['dx', 'vc_redist', 'oalinst', 'physx', 'openal', 'xaudio'];

// ─── Negative FOLDER/PATH segments (any ancestor folder matching → penalty) ──
const HIGH_NEGATIVE_FOLDERS = [
    '_commonredist', 'commonredist', 'redist', 'prerequisites', 'prerequisite',
    'easyanticheat', 'battleye', 'directx', 'vcredist', 'dotnet',
    'netfx', 'support', 'tools_external', 'thirdparty',
];
const MED_NEGATIVE_FOLDERS = [
    'tools', 'utilities', 'extras', 'dlc', 'sdk', 'editor',
    'dedicated_server', 'server',
];

// ─── Positive EXE patterns (overrides mild penalties) ─────────────────────────
// Unreal Engine shipped executables always follow a specific pattern
const POSITIVE_PATTERNS = [
    /[a-z0-9]+-win64-shipping\.exe$/i,   // UE4/5 game: GameName-Win64-Shipping.exe
    /[a-z0-9]+-win32-shipping\.exe$/i,
    /[a-z0-9]+\.exe$/i,                  // Generic: just a name.exe (scored elsewhere)
];
const STRONG_POSITIVE = /[a-z0-9]+-win(64|32)-shipping\.exe$/i;

// ─── Clean up repack/scene release folder names ──────────────────────────────
function cleanGameName(folderName) {
    let name = folderName.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').replace(/[-_.]/g, ' ');
    const ignoreWords = [
        'fitgirl', 'repack', 'dodi', 'skidrow', 'codex', 'cpy', 'rxg', 'kaos',
        'xatab', 'gog', 'v1', 'v2', 'v3', 'patch', 'update', 'edition', 'multi',
        'elamigos', 'masquerade', 'prophet', 'plaza', 'hoodlum', 'razor1911',
    ];
    return name.split(' ')
        .filter(p => !ignoreWords.includes(p.toLowerCase().trim()))
        .join(' ').replace(/\s+/g, ' ').trim();
}

// ─── Simple fuzzy similarity (Jaccard on trigrams) ───────────────────────────
function similarity(a, b) {
    if (!a || !b) return 0;
    const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const na = normalize(a), nb = normalize(b);
    if (!na || !nb) return 0;
    const trigrams = s => { const set = new Set(); for (let i = 0; i < s.length - 2; i++) set.add(s.slice(i, i + 3)); return set; };
    const ta = trigrams(na), tb = trigrams(nb);
    let intersection = 0;
    ta.forEach(t => { if (tb.has(t)) intersection++; });
    const union = ta.size + tb.size - intersection;
    return union === 0 ? 0 : intersection / union;
}

// ─── Check if any ancestor folder segment is in a negative list ───────────────
function getFolderPenalty(exePath, rootPath) {
    let penalty = 0;
    // Segments between rootPath and exePath
    const rel = path.relative(rootPath, exePath).toLowerCase();
    const segments = rel.split(path.sep).slice(0, -1); // exclude the filename itself
    for (const seg of segments) {
        if (HIGH_NEGATIVE_FOLDERS.some(kw => seg.includes(kw))) { penalty -= 20; break; }
        if (MED_NEGATIVE_FOLDERS.some(kw => seg === kw)) { penalty -= 5; }
    }
    return penalty;
}

// ─── Score a single EXE against its parent game folder ───────────────────────
function scoreExe(exePath, exeName, gameFolder, depthFromGameRoot, rootScanPath) {
    const low = exeName.toLowerCase();
    const nameNoExt = low.replace('.exe', '');
    let score = 0;

    // Strong positive: Unreal shipping EXE → immediately winner candidate
    if (STRONG_POSITIVE.test(low)) score += 25;

    // Depth penalty (prefer shallower), but exempt Binaries/ UE pattern
    const inBinaries = exePath.toLowerCase().includes(`${path.sep}binaries${path.sep}`);
    if (!inBinaries || !STRONG_POSITIVE.test(low)) {
        score -= depthFromGameRoot * 2;
    }

    // File size bonus
    try {
        const sizeMB = fs.statSync(exePath).size / (1024 * 1024);
        if (sizeMB > 50)      score += 8;   // very large → almost certainly game
        else if (sizeMB > 10) score += 5;
        else if (sizeMB > 1)  score += 3;
        else if (sizeMB < 0.1) score -= 6;  // tiny stub
    } catch (_) {}

    // Name similarity to game folder
    const gameFolderClean = cleanGameName(gameFolder).toLowerCase();
    const sim = similarity(gameFolderClean, nameNoExt);
    score += Math.round(sim * 8);

    // Ancestor folder penalties
    if (rootScanPath) score += getFolderPenalty(exePath, path.join(rootScanPath, gameFolder));

    // EXE name keyword penalties
    for (const kw of HIGH_NEGATIVE) { if (low.includes(kw)) { score -= 15; break; } }
    for (const kw of MED_NEGATIVE)  { if (low.includes(kw)) { score -= 7;  break; } }
    for (const kw of LOW_NEGATIVE)  { if (low.includes(kw)) { score -= 3;  break; } }

    // Bonus for capital-start (typical game naming)
    if (/^[A-Z]/.test(exeName)) score += 1;

    return score;
}

// ─── Recursive EXE finder ─────────────────────────────────────────────────────
function findExeRecursive(dirPath, ignoredList, depth = 0, maxDepth = 4) {
    if (depth > maxDepth) return [];
    let exes = [];
    try {

        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(dirPath, item.name);
            if (item.isDirectory()) {
                // Skip known bad folders entirely — don't even descend
                const segLow = item.name.toLowerCase();
                const isBadFolder = HIGH_NEGATIVE_FOLDERS.some(kw => segLow.includes(kw));
                if (!isBadFolder) exes = exes.concat(findExeRecursive(fullPath, ignoredList, depth + 1, maxDepth));
            } else if (item.isFile() && item.name.toLowerCase().endsWith('.exe')) {
                const low = item.name.toLowerCase();
                const isUserIgnored = ignoredList.some(ign => low.includes(ign));
                if (!isUserIgnored) exes.push({ dir: dirPath, file: item.name, fullPath, depth });
            }
        }
    } catch (_) {}
    return exes;
}

// ─── Main scan entry point ────────────────────────────────────────────────────
function scanFolderForGames(folderPath) {
    if (!fs.existsSync(folderPath)) return [];
    const foundGames = [];

    try {
        const db = require('./database');
        const uiConfig = db.getDb().uiConfig || {};
        const ignoredStr = uiConfig.ignoredExes || 'unins, crash, redist, setup, dxwebsetup';
        const ignoredList = ignoredStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

        const rootItems = fs.readdirSync(folderPath, { withFileTypes: true });

        for (const item of rootItems) {
            const itemPath = path.join(folderPath, item.name);

            if (item.isDirectory()) {
                const gameName = cleanGameName(item.name);
                const allExes = findExeRecursive(itemPath, ignoredList);
                if (allExes.length === 0) continue;

                const scored = allExes
                    .map(e => ({ ...e, score: scoreExe(e.fullPath, e.file, item.name, e.depth, folderPath) }))
                    .sort((a, b) => b.score - a.score);

                const best = scored[0];
                // Discard if best score is too low (likely all junk)
                if (best.score < -8) continue;

                foundGames.push({ name: gameName, path: best.dir, exe: best.file });

            } else if (item.isFile() && item.name.toLowerCase().endsWith('.exe')) {
                const low = item.name.toLowerCase();
                const isBasicBad = HIGH_NEGATIVE.some(kw => low.includes(kw));
                const isUserIgnored = ignoredList.some(ign => low.includes(ign));
                if (!isBasicBad && !isUserIgnored) {
                    foundGames.push({
                        name: cleanGameName(path.basename(item.name, '.exe')),
                        path: folderPath,
                        exe: item.name,
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
