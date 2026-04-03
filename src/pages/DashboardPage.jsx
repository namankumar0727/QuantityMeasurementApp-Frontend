import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import TypeGrid from '../components/dashboard/TypeGrid';
import ActionTabs from '../components/dashboard/ActionTabs';
import InputPanel from '../components/dashboard/InputPanel';
import HistoryPanel from '../components/dashboard/HistoryPanel';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const [measureType, setMeasureType] = useState('length');
  const [action, setAction] = useState('comparison');
  const [showHistory, setShowHistory] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we should show history after login
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('showHistory') === 'true' && session) {
      setShowHistory(true);
      // Remove the parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location, session]);

  // Reset action to comparison if temperature is selected and current action is arithmetic
  const handleMeasureTypeChange = (type) => {
    setMeasureType(type);
    if (type === 'temperature' && action === 'arithmetic') {
      setAction('comparison');
    }
  };

  function handleViewHistory() {
    if (!session) {
      navigate('/login?requireLogin=true');
    } else {
      setShowHistory(true);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e6edff] font-nunito text-[#1a1a2e]">
      <Navbar />

      <main className="max-w-[880px] mx-auto px-5 py-7 flex flex-col gap-5 max-sm:px-3 max-sm:py-3.5">
        {/* Toggle between Calculator and History */}
        <div className="flex justify-end">
          {!showHistory ? (
            <button
              onClick={handleViewHistory}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg text-sm font-bold text-[#3b5bdb] hover:bg-[#eef2ff] transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="text-lg">📜</span>
              View History {!session && '(Login Required)'}
            </button>
          ) : (
            <button
              onClick={() => setShowHistory(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg text-sm font-bold text-[#3b5bdb] hover:bg-[#eef2ff] transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="text-lg">📐</span>
              Show Calculator
            </button>
          )}
        </div>

        {!showHistory ? (
          <div className="space-y-5">
            {/* Choose Type Section */}
            <section className="bg-white rounded-2xl px-7 py-6 shadow-md hover:shadow-xl transition-all duration-300">
              <p className="text-[11px] font-extrabold tracking-[2px] text-[#6b7280] mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#3b5bdb] rounded-full"></span>
                CHOOSE TYPE
              </p>
              <TypeGrid selected={measureType} onSelect={handleMeasureTypeChange} />
            </section>

            {/* Choose Action Section */}
            <section className="bg-white rounded-2xl px-7 py-6 shadow-md hover:shadow-xl transition-all duration-300">
              <p className="text-[11px] font-extrabold tracking-[2px] text-[#6b7280] mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#3b5bdb] rounded-full"></span>
                CHOOSE ACTION
              </p>
              <ActionTabs selected={action} onSelect={setAction} measureType={measureType} />
            </section>

            {/* Input Panel Section */}
            <section className="bg-white rounded-2xl px-7 py-6 shadow-md hover:shadow-xl transition-all duration-300">
              <InputPanel measureType={measureType} action={action} />
            </section>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <HistoryPanel />
          </div>
        )}
      </main>
    </div>
  );
}