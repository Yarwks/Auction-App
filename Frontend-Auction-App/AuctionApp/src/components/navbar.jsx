import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem('access_token'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md mb-8">
      <Link to="/" className="text-xl font-black tracking-wider">
        AUCTION<span className="text-gray-400">APP</span> 
      </Link>
      <div className="flex gap-4 items-center text-sm font-semibold">
        {token ? (
          <>
            <Link to="/" className="hover:text-gray-300">Dashboard</Link>
            <Link to="/create" className="hover:text-gray-300">List Item</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1.5 rounded text-xs hover:bg-red-700 transition-colors"
            >
              Logout 🚪
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300">Login</Link>
            <Link to="/register" className="bg-white text-black px-3 py-1.5 rounded hover:bg-gray-200">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}