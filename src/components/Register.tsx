// src/components/Register.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlayer } from '../api/api';
import { useDispatch } from 'react-redux';
import { setPlayer } from '../store/playerSlice';
import '../styles/Register.css';

const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name || !password) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    try {
      const response = await createPlayer({ name, password });

      if (response && response.player) {
        dispatch(setPlayer(response.player));
        navigate('/location');
      } else {
        throw new Error('Ошибка при регистрации: данные игрока не найдены.');
      }
    } catch (err: any) {
      console.error('Ошибка при регистрации:', err);
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response.data.errors) {
          const messages = err.response.data.errors.map((error: any) => error.msg).join(' ');
          setError(messages);
        } else {
          setError('Ошибка при регистрации. Возможно, имя уже используется.');
        }
      } else {
        setError('Ошибка при регистрации. Возможно, имя уже используется.');
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Регистрация</h2>
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
        <button type="submit" className="register-button">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Register;
