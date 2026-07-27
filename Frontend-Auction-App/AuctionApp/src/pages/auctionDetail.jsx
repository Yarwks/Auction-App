import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

function formatDuration(ms) {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];

  if (days) parts.push(`${days}d`);
  if (hours || days) parts.push(`${hours.toString().padStart(2, '0')}h`);
  if (minutes || hours || days) parts.push(`${minutes.toString().padStart(2, '0')}m`);
  parts.push(`${seconds.toString().padStart(2, '0')}s`);

  return parts.join(' ');
}

export default function AuctionDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}/`);
      setProduct(res.data);
    } catch (err) {
      console.error("couldn't fetch product detail", err);
    }
  };

  useEffect(() => {
    if (!product?.end_time) {
      return undefined;
    }

    const updateTime = async () => {
      const endDate = new Date(product.end_time);
      const diff = endDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Auction closed');
        if (product.is_active) {
          await fetchProduct();
        }
        return;
      }
      setTimeLeft(formatDuration(diff));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBid = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await API.post('/bids/', {
        product: parseInt(id),
        amount: parseFloat(amount),
      });
      setMessage('bid placed successfully');
      setAmount('');
      fetchProduct();
    } catch (err) {
      const msg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "couldn't place bid";
      setError(msg);
    }
  };

  if (!product) return <div className="text-center py-10">loading item...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white border p-6 rounded-lg shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {product.is_active ? (
              <>
                <span className="font-semibold">Time remaining:</span> {timeLeft || 'calculating...'}
              </>
            ) : (
              <>
                <span className="font-semibold">Auction ended:</span>{' '}
                {new Date(product.end_time).toLocaleString()}
              </>
            )}
          </p>
        </div>

        <span
          className={`text-xs font-bold px-2.5 py-1 rounded ${
            product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {product.is_active ? 'Active' : 'Ended'}
        </span>
      </div>

      <p className="text-gray-600">{product.description}</p>

      <div className="bg-gray-50 p-4 rounded border flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">Current Highest Price</p>
          <p className="text-3xl font-extrabold text-black">KSh {product.current_price}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Seller</p>
          <p className="text-sm font-semibold">{product.seller_username}</p>
        </div>
      </div>

      {product.is_active ? (
        <form onSubmit={handleBid} className="space-y-3 pt-2">
          <h3 className="font-semibold text-sm">Place Your Bid</h3>
          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
          {message && <p className="text-green-600 text-sm font-semibold">{message}</p>}
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              placeholder={`Must be > KSh ${product.current_price}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 rounded text-sm flex-1"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-5 py-2 rounded text-sm font-semibold hover:bg-gray-800"
            >
              Bid 
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-red-50 p-3 rounded border border-red-200 text-red-700 text-sm">
          Auction ended. Winner: <span className="font-bold">{product.winner || 'No bids'}</span>
        </div>
      )}
    </div>
  );
}