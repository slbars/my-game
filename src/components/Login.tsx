// src/components/Login.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { RootState } from '../store';import { loginPlayer } from '../store/playerSlice';
import '../styles/Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { player } = useAppSelector((state) => state.player);
  const token = localStorage.getItem('token');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (player || token) {
      navigate('/location');
    }
  }, [player, token, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await dispatch(loginPlayer({ name, password })).unwrap();
      navigate('/location');
    } catch (err: any) {
      setError(err);
    }
  };

  return (
      <div className="login-container">
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
            />
          </div>
          <div className="form-group">
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
            />
          </div>
          <button type="submit" className="login-button">
            Войти
          </button>
        </form>
        <p className="register-link">
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
        </p>
      </div>
  );
};

export default Login;
