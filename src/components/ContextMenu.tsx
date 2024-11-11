// frontend/src/components/ContextMenu.tsx

import React from 'react';
import '../styles/ContextMenu.css';

interface ContextMenuProps {
  x: number;
  y: number;
  onInfoClick: () => void;
  onMentionClick: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onInfoClick, onMentionClick }) => {
  return (
    <div className="context-menu" style={{ top: y, left: x }}>
      <button className="context-menu-item" onClick={onInfoClick}>
        Инфо
      </button>
      <button className="context-menu-item" onClick={onMentionClick}>
        Упомянуть
      </button>
    </div>
  );
};

export default ContextMenu;
