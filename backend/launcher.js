const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

function launchGame(gamePath, exeName) {
    const fullPath = path.join(gamePath, exeName);
    
    // Safety check: ensure file exists
    if (!fs.existsSync(fullPath)) {
        console.error("Launch candidate not found at:", fullPath);
        return false;
    }

    try {
        // Use 'start' command on Windows to cleanly detach and handle GUI properly (e.g. UAC)
        // Wrapped in double quotes for path safety
        exec(`start "" "${fullPath}"`, { cwd: gamePath }, (err) => {
            if (err) console.error("Launch error:", err);
        });
        return true;
    } catch (e) {
        console.error("Failed to launch game:", e);
        return false;
    }
}

module.exports = { launchGame };
