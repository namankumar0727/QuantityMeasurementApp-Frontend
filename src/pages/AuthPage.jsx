import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import BrandPanel from '../components/auth/BrandPanel';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [visible, setVisible] = useState('login');
  const [animating, setAnimating] = useState(false);
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Track if toast has been shown
  const hasShownToast = useRef(false);

  useEffect(() => {
    console.log("🔍 AuthPage - session:", session);
    console.log("🔍 AuthPage - loading:", loading);
    
    if (!loading && session) {
      // ✅ After login, go to dashboard
      navigate('/', { replace: true });
    }
  }, [session, loading, navigate, location]);

  useEffect(() => {
    // Check for OAuth success in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth_success') === 'true') {
      console.log("🎯 OAuth success in URL, removing param");
      window.history.replaceState({}, document.title, window.location.pathname);
      // ✅ Only show toast once
      if (!hasShownToast.current) {
        hasShownToast.current = true;
        toast.success('Google login successful! Redirecting...');
      }
    }
    
    // Show message if login required for history
    if (params.get('requireLogin') === 'true') {
      // ✅ Only show toast once
      if (!hasShownToast.current) {
        hasShownToast.current = true;
        toast.info('Please login to view your measurement history');
      }
    }
  }, []);

  function switchTab(tab) {
    if (tab === activeTab || animating) return;
    setAnimating(true);
    setActiveTab(tab);
    setTimeout(() => {
      setVisible(tab);
      setAnimating(false);
    }, 180);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff] font-nunito p-4">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#a8c0ff] opacity-35 blur-[80px] -top-36 -left-24 animate-float1" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#ffd6d6] opacity-35 blur-[80px] -bottom-24 -right-24 animate-float2" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#ffebc8] opacity-35 blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float3" />
      </div>

      <div className="relative z-10 flex bg-white rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.12)] overflow-hidden w-full max-w-[700px] min-h-[420px] animate-slideUp max-sm:flex-col max-sm:max-w-[420px] max-sm:min-h-0">
        <BrandPanel />

        <div className="flex-1 flex flex-col px-10 py-9 max-sm:px-5 max-sm:py-6 overflow-y-auto">
          <div className="flex gap-6 mb-7 border-b border-[#e0e0e0]">
            {['login', 'signup'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => switchTab(tab)}
                className={`pb-2 text-[13px] font-bold tracking-[1px] uppercase relative transition-colors duration-200
                  after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px]
                  after:bg-[#e53935] after:transition-transform after:duration-250 after:origin-left
                  ${activeTab === tab
                    ? 'text-[#1a1a2e] after:scale-x-100'
                    : 'text-[#6b7280] hover:text-[#1a1a2e] after:scale-x-0'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="transition-all duration-200" style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateX(12px)' : 'translateX(0)' }}>
            {visible === 'login'
              ? <LoginForm onSwitch={() => switchTab('signup')} />
              : <SignupForm onSwitch={() => switchTab('login')} />
            }
          </div>
          
          {/* ✅ Back to dashboard link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-[#6b7280] hover:text-[#3b5bdb] transition-colors"
            >
              ← Back to Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}