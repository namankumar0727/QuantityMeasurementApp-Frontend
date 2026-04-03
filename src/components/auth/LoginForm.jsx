import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from './PasswordInput';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

export default function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin() {
    if (!email) { setErrors({ email: true }); return; }
    if (!password) { setErrors({ password: true }); return; }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    
    if (success) {
      navigate('/dashboard');
    }
  }

  function handleGoogleLogin() {
    window.location.href = authAPI.getOAuthUrl();
  }

  const inputBase = 'w-full px-3.5 py-2.5 border-[1.5px] rounded-lg font-nunito text-sm text-[#1a1a2e] outline-none transition-all duration-200';
  const inputNormal = 'border-[#e0e0e0] hover:border-[#b0b8e0] focus:border-[#3b5bdb] focus:shadow-[0_0_0_3px_rgba(59,91,219,0.12)] focus:bg-[#f8faff]';
  const inputErr = 'border-danger-500 bg-red-50';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-[#1a1a2e]">Email Id</label>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
          className={`${inputBase} ${errors.email ? inputErr : inputNormal}`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-[#1a1a2e]">Password</label>
        <PasswordInput
          id="loginPassword"
          value={password}
          placeholder="Enter your password"
          onChange={(v) => { setPassword(v); setErrors({}); }}
          hasError={errors.password}
        />
      </div>

      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className="mt-1 bg-danger-500 hover:bg-danger-700 disabled:bg-gray-400 text-white rounded-lg py-3 font-nunito text-[15px] font-extrabold tracking-wide shadow-[0_4px_16px_rgba(229,57,53,0.35)] transition-all duration-200"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-lg py-2.5 font-nunito text-[14px] font-bold text-gray-700 transition-all duration-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-[13px] text-[#6b7280]">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-danger-500 font-bold hover:underline">
          Sign Up
        </button>
      </p>
    </div>
  );
}