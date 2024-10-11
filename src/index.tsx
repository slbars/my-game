import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Единственный Router в приложении
import { Provider } from 'react-redux';
import index from './store';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={index}>
        <BrowserRouter> {/* Убедитесь, что это единственный Router */}
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
