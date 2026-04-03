import { useState, useEffect } from 'react';
import { historyAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function HistoryPanel() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({});
  const { session } = useAuth();

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    fetchHistory();
    fetchStats();
  }, [filter, session]);

  const fetchHistory = async () => {
    if (!session) return;
    setLoading(true);
    try {
      let response;
      if (filter === 'all') {
        response = await historyAPI.getAll();
      } else if (filter === 'errors') {
        response = await historyAPI.getErrors();
      } else {
        response = await historyAPI.getByOperation(filter);
      }
      setHistory(response.data);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!session) return;
    try {
      const operations = ['COMPARE', 'CONVERT', 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'];
      const counts = {};
      for (const op of operations) {
        const res = await historyAPI.getCount(op);
        counts[op] = res.data.count;
      }
      setStats(counts);
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  if (!session) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(59,91,219,0.08)] p-8 text-center">
        <div className="text-gray-500">
          <p className="mb-4">🔒 Please login to view your measurement history</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-[#3b5bdb] text-white rounded-lg hover:bg-[#1a3db5] transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const getOperationBadge = (op) => {
    const colors = {
      COMPARE: 'bg-blue-100 text-blue-700',
      CONVERT: 'bg-green-100 text-green-700',
      ADD: 'bg-purple-100 text-purple-700',
      SUBTRACT: 'bg-orange-100 text-orange-700',
      MULTIPLY: 'bg-pink-100 text-pink-700',
      DIVIDE: 'bg-red-100 text-red-700',
    };
    return colors[op] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(59,91,219,0.08)] overflow-hidden">
      {/* Header with Stats */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="font-extrabold text-[#1a1a2e]">📜 Operation History</h3>
          <div className="flex gap-2 flex-wrap">
            {['all', 'errors', 'COMPARE', 'CONVERT', 'ADD', 'SUBTRACT'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all
                  ${filter === f 
                    ? 'bg-[#3b5bdb] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {f === 'all' ? 'All' : f === 'errors' ? 'Errors' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-4 mt-3 text-xs flex-wrap">
          {Object.entries(stats).map(([op, count]) => (
            <div key={op} className="flex items-center gap-1">
              <span className="font-bold text-[#3b5bdb]">{count}</span>
              <span className="text-gray-500">{op}</span>
            </div>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No operations yet. Start measuring!</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {history.map((item) => (
              <div key={item.id} className="px-6 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getOperationBadge(item.operationType)}`}>
                        {item.operationType}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-[#1a1a2e]">{item.input}</div>
                    <div className={`text-xs mt-1 ${item.isError ? 'text-red-500' : 'text-green-600'}`}>
                      {item.result}
                    </div>
                  </div>
                  {item.isError && (
                    <div className="text-red-400 text-xs">⚠️</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}