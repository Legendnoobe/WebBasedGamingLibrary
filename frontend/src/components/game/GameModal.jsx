/**
 * GameModal — shell only.
 * Delegates rendering to GameViewPanel (read mode) and GameEditPanel (edit mode).
 */
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { COVERS_BASE } from '../../api/api.js';
import GameViewPanel from './GameViewPanel.jsx';
import GameEditPanel from './GameEditPanel.jsx';

export default function GameModal({
    game, groups,
    onClose,
    onPlay,
    onDelete,
    onSave,
    onOpenSgdb,
    onImageFileSelect,
}) {
    const [editMode, setEditMode] = useState(false);

    // Edit field state lives here so it resets properly when game prop changes
    const [editName,      setEditName]      = useState(game.name);
    const [editGroupId,   setEditGroupId]   = useState(game.groupId || 'null');
    const [editPath,      setEditPath]      = useState(game.path || '');
    const [editExe,       setEditExe]       = useState(game.exe  || '');
    const [editSgdbQuery, setEditSgdbQuery] = useState(game.sgdbQuery || '');

    const handleSave = () => {
        onSave({
            name:      editName,
            groupId:   editGroupId === 'null' ? null : editGroupId,
            path:      editPath,
            exe:       editExe,
            sgdbQuery: editSgdbQuery,
        });
        setEditMode(false);
    };

    const handleSgdbOpen = () => {
        const q = editSgdbQuery.trim() || editName || editExe.replace('.exe', '');
        onOpenSgdb(q);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}><X size={20} /></button>

                {/* Cover panel */}
                {game.cover ? (
                    <img
                        src={`${COVERS_BASE}/${game.cover}?t=${Date.now()}`}
                        className="game-detail-cover"
                        alt={game.name}
                        style={{ objectFit: 'contain', background: '#000' }}
                    />
                ) : (
                    <div className="fallback-cover" style={{ width: '35%', fontSize: '80px' }}>
                        {game.name.charAt(0).toUpperCase()}
                    </div>
                )}

                {/* Info panel */}
                <div className="game-detail-info">
                    {editMode ? (
                        <GameEditPanel
                            editName={editName}           setEditName={setEditName}
                            editGroupId={editGroupId}     setEditGroupId={setEditGroupId}
                            editPath={editPath}           setEditPath={setEditPath}
                            editExe={editExe}             setEditExe={setEditExe}
                            editSgdbQuery={editSgdbQuery} setEditSgdbQuery={setEditSgdbQuery}
                            groups={groups}
                            onSave={handleSave}
                            onCancel={() => setEditMode(false)}
                            onSgdbOpen={handleSgdbOpen}
                            onImageFileSelect={onImageFileSelect}
                        />
                    ) : (
                        <GameViewPanel
                            game={game}
                            groups={groups}
                            onEdit={() => setEditMode(true)}
                            onPlay={onPlay}
                            onDelete={() => onDelete(game.id)}
                            onSgdbOpen={handleSgdbOpen}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
