// src/components/Login.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginPlayer } from '../api/api';
import { useDispatch } from 'react-redux';
import { setPlayer } from '../store/playerSlice'; // Убедитесь, что setPlayer определен
import '../styles/Login.css';

const Login: React.FC = () => {
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
      const response = await loginPlayer({ name, password });

      if (response && response.player && response.token) {
        // Преобразуем id в число
        const player = {
          ...response.player,
          id: Number(response.player.id),
        };

        // Сохраняем токен в localStorage
        localStorage.setItem('token', response.token);

        // Обновляем состояние игрока в Redux
        dispatch(setPlayer(player));

        // Переход на страницу с локацией
        navigate('/location');
      } else {
        throw new Error('Ошибка при входе: данные игрока не найдены.');
      }
    } catch (err: any) {
      setError('Ошибка при входе. Проверьте имя пользователя и пароль.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Вход в игру</h2>
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
