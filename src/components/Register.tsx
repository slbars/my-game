import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { createPlayer } from '../api/api';
import { setPlayer } from '../store/playerSlice';
import '../styles/Register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { player } = useAppSelector((state) => state.player);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (player || token) {
      navigate('/location');
    }
  }, [player, token, navigate]);

  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await createPlayer({ name, password });
      const { player } = response;

      if (player) {
        const completePlayer = {
          ...player,
          id: Number(player.id),
          currentExp: 0,
        };

        dispatch(setPlayer(completePlayer));
        localStorage.setItem('userId', player.id.toString());
        navigate('/location');
      } else {
        throw new Error('Ошибка при регистрации: данные игрока или токен не найдены.');
      }
    } catch (err: any) {
      console.error('Ошибка при регистрации:', err);
      setError(err.message || 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="name">Имя</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
