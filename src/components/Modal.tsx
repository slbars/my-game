// src/components/Modal.tsx

import React from 'react';
import '../styles/Modal.css';

interface ModalProps {
  result: string;
  onExit: () => void;
}

const Modal: React.FC<ModalProps> = ({ result, onExit }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{result}</h2>
        <button className="btn-exit" onClick={onExit}>
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default Modal;
