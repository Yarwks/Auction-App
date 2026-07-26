import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 truncate">{product.title}</h3>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {product.is_active ? 'Active' : 'Ended'}
          </span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>
      </div>

      <div className="pt-3 border-t flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-400 block font-semibold">Current Price</span>
          <span className="text-lg font-black text-black">${product.current_price || product.starting_bid}</span>
        </div>
        <Link
          to={`/auctions/${product.id}`}
          className="bg-black text-white text-xs font-bold px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          View Bid
        </Link>
      </div>
    </div>
  );
}