import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login/', formData);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      navigate('/');
      useLocation().reload(); 
    } catch (err) {
      setError('invalid username or password!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Welcome Back</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="border p-2 rounded text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="border p-2 rounded text-sm"
          required
        />
        <button type="submit" className="bg-black text-white p-2 rounded font-semibold text-sm hover:bg-gray-800">
          Login
        </button>
      </form>
    </div>
  );
}