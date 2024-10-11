import React, { ReactNode } from 'react';
import '../styles/ErrorModal.css'; // Подключаем стили для модального окна

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  // Этот метод вызывается при возникновении ошибки и обновляет состояние
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  // Логирование ошибки для отладки
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Ошибка в компоненте:', error, errorInfo);
  }

  // Закрыть модальное окно при ошибке
  handleClose = () => {
    this.setState({ hasError: false, errorMessage: null }); // Сбрасываем ошибку
  };

  // Рендеринг интерфейса при ошибке
  render() {
    if (this.state.hasError && this.state.errorMessage) {
      return (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Произошла ошибка</h2>
            <p>{this.state.errorMessage}</p>
            <button onClick={this.handleClose} className="modal-button">
              Закрыть
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
