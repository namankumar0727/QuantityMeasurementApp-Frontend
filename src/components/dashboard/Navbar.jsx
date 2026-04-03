import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  function handleLogin() {
    navigate('/login')  // ✅ Go to login page
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#1a1f6e] to-[#3b5bdb] h-[54px] px-8 flex items-center justify-between shadow-[0_2px_12px_rgba(26,31,110,0.25)] max-sm:px-4 max-sm:h-[50px]">
      {/* Brand - Click to go to dashboard */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-3 font-raleway text-base font-extrabold text-white tracking-wide hover:opacity-90 transition-opacity"
      >
        <svg viewBox="0 0 40 50" width="26" xmlns="http://www.w3.org/2000/svg">
          <rect x="8"  y="2"  width="24" height="34" rx="4" fill="white" opacity="0.9"/>
          <rect x="11" y="27" width="18" height="9"  rx="2" fill="#bfd2ff"/>
          <rect x="11" y="17" width="18" height="8"  rx="2" fill="#dce9ff" opacity="0.8"/>
          <rect x="4"  y="36" width="32" height="8"  rx="3" fill="#e2a96a"/>
        </svg>
        <span className="max-sm:hidden">Quantity Measurement</span>
      </button>

      {/* Right */}
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-white/80 text-[13px] font-semibold max-sm:hidden">
              Hi, {session.name} 👋
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-white/15 border-[1.5px] border-white/40 text-white px-4 py-1.5 rounded-lg text-[13px] font-bold
                hover:bg-white/28 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleLogin}
            className="bg-white/15 border-[1.5px] border-white/40 text-white px-4 py-1.5 rounded-lg text-[13px] font-bold
              hover:bg-white/28 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200"
          >
            Login
          </button>
        )}
      </div>
    </header>
  )
}