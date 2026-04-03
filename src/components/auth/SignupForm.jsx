import { useState } from 'react';
import PasswordInput from './PasswordInput';
import { useAuth } from '../../context/AuthContext';

export default function SignupForm({ onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();

  async function handleSignup() {
    if (!name) { setErrors({ name: true }); return; }
    if (!email) { setErrors({ email: true }); return; }
    if (!password) { setErrors({ password: true }); return; }
    if (password.length < 6) { setErrors({ password: true }); return; }
    if (!/^\d{10}$/.test(mobile)) { setErrors({ mobile: true }); return; }

    setLoading(true);
    const success = await signup(name, email, password, mobile);
    setLoading(false);
    
    if (success) {
      onSwitch();
    }
  }

  const inputBase = 'w-full px-3.5 py-2.5 border-[1.5px] rounded-lg font-nunito text-sm text-[#1a1a2e] outline-none transition-all duration-200';
  const inputNormal = 'border-[#e0e0e0] hover:border-[#b0b8e0] focus:border-[#3b5bdb] focus:shadow-[0_0_0_3px_rgba(59,91,219,0.12)] focus:bg-[#f8faff]';
  const inputErr = 'border-danger-500 bg-red-50';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-[#1a1a2e]">Full Name</label>
        <input
          type="text"
          value={name}
          placeholder="Enter your full name"
          onChange={(e) => { setName(e.target.value); setErrors({}); }}
          className={`${inputBase} ${errors.name ? inputErr : inputNormal}`}
        />
      </div>

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
          id="signupPassword"
          value={password}
          placeholder="Create a password (min 6 characters)"
          onChange={(v) => { setPassword(v); setErrors({}); }}
          hasError={errors.password}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-[#1a1a2e]">Mobile Number</label>
        <input
          type="tel"
          value={mobile}
          placeholder="Enter 10-digit mobile number"
          maxLength={10}
          onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); setErrors({}); }}
          className={`${inputBase} ${errors.mobile ? inputErr : inputNormal}`}
        />
      </div>

      <button
        type="button"
        onClick={handleSignup}
        disabled={loading}
        className="mt-1 bg-danger-500 hover:bg-danger-700 disabled:bg-gray-400 text-white rounded-lg py-3 font-nunito text-[15px] font-extrabold tracking-wide transition-all duration-200"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      <p className="text-center text-[13px] text-[#6b7280]">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-danger-500 font-bold hover:underline">
          Login
        </button>
      </p>
    </div>
  );
}