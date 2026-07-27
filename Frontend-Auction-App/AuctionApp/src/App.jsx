import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/register'
import Profile from './pages/profile'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import CreateAuction from './pages/createAuction'
import AuctionDetail from './pages/auctionDetail'
import Navbar from './components/navbar' 




function App() {
  return (
    <>
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auctions/:id" element={<AuctionDetail />} />
            <Route path="/create" element={<CreateAuction />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
