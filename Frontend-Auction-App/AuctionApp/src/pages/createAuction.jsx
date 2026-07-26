import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function CreateAuction() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    starting_bid: '',
    end_time: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await API.post('/products/', {
        ...formData,
        starting_bid: parseFloat(formData.starting_bid),
      });
      navigate('/');
    } catch (err) {
      setError('failed to create auction listing');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white border p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">List an Item for Auction</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600">Item Title</label>
          <input
            type="text"
            placeholder="e.g. Vintage Leather Jacket"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border p-2 rounded text-sm w-full mt-1"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600">Description</label>
          <textarea
            placeholder="Describe condition, specs, etc."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border p-2 rounded text-sm w-full mt-1 h-24"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600">Starting Price ($)</label>
          <input
            type="number"
            step="0.01"
            placeholder="10.00"
            value={formData.starting_bid}
            onChange={(e) => setFormData({ ...formData, starting_bid: e.target.value })}
            className="border p-2 rounded text-sm w-full mt-1"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600">End Date & Time</label>
          <input
            type="datetime-local"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            className="border p-2 rounded text-sm w-full mt-1"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white p-2.5 rounded text-sm font-semibold hover:bg-gray-800"
        >
          Publish Auction 
        </button>
      </form>
    </div>
  );
}