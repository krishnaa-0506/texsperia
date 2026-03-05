import { useState } from 'react';
import { X, Lock, Users, Calendar, DollarSign, Download, Eye, EyeOff } from 'lucide-react';
import { adminLogin, getAllRegistrations, getRegistrationStats } from '../lib/mongodb';

interface Registration {
  _id: string;
  registration_id: string;
  full_name: string;
  mobile_number: string;
  email: string;
  college_name: string;
  department: string;
  participation_day: string;
  selected_events: any[];
  total_participants: number;
  payment_amount: number;
  upi_transaction_id: string;
  payment_screenshot_url?: string;
  created_at: string;
}

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    day1Count: 0,
    day2Count: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const result = await adminLogin(password);
      if (result.success) {
        setIsLoggedIn(true);
        await loadData();
      } else {
        setLoginError('Invalid password');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }

  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [regsData, statsData] = await Promise.all([
        getAllRegistrations(),
        getRegistrationStats()
      ]);

      setRegistrations(regsData as Registration[]);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Registration ID',
      'Name',
      'Mobile',
      'Email',
      'College',
      'Department',
      'Day',
      'Events',
      'Participants',
      'Amount',
      'Transaction ID',
      'Date'
    ];

    const rows = registrations.map(reg => [
      reg.registration_id,
      reg.full_name,
      reg.mobile_number,
      reg.email,
      reg.college_name,
      reg.department,
      reg.participation_day,
      reg.selected_events.map(e => e.eventName).join('; '),
      reg.total_participants,
      reg.payment_amount,
      reg.upi_transaction_id,
      new Date(reg.created_at).toLocaleString()
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold text-white">Admin Login</h2>
            <p className="text-gray-400 mt-2">Enter password to access admin panel</p>
          </div>

          <form onSubmit={handleLogin}>
            {loginError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                {loginError}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none pr-12"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Close
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/50 rounded-xl p-6">
              <Users className="w-8 h-8 text-blue-400 mb-2" />
              <p className="text-gray-300 text-sm">Total Registrations</p>
              <p className="text-3xl font-bold text-white">{stats.totalRegistrations}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/50 rounded-xl p-6">
              <Calendar className="w-8 h-8 text-green-400 mb-2" />
              <p className="text-gray-300 text-sm">Day 1 Participants</p>
              <p className="text-3xl font-bold text-white">{stats.day1Count}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/50 rounded-xl p-6">
              <Calendar className="w-8 h-8 text-purple-400 mb-2" />
              <p className="text-gray-300 text-sm">Day 2 Participants</p>
              <p className="text-3xl font-bold text-white">{stats.day2Count}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/50 rounded-xl p-6">
              <DollarSign className="w-8 h-8 text-yellow-400 mb-2" />
              <p className="text-gray-300 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white">₹{stats.totalRevenue}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export to CSV
            </button>
            <button
              onClick={loadData}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Refresh Data
            </button>
          </div>

          {/* Registrations Table */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Reg ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Mobile</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">College</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Day</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Events</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {registrations.map((reg) => (
                    <tr key={reg._id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300">{reg.registration_id}</td>
                      <td className="px-6 py-4 text-sm text-white font-medium">{reg.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{reg.mobile_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{reg.college_name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          reg.participation_day === 'day1' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {reg.participation_day === 'day1' ? 'Day 1' : 'Day 2'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {reg.selected_events.length} events
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-yellow-400">
                        ₹{reg.payment_amount}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedRegistration(reg)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Details Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedRegistration(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-white mb-6">Registration Details</h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Registration ID</p>
                  <p className="text-white font-semibold">{selectedRegistration.registration_id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Registration Date</p>
                  <p className="text-white font-semibold">
                    {new Date(selectedRegistration.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Full Name</p>
                  <p className="text-white font-semibold">{selectedRegistration.full_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Mobile Number</p>
                  <p className="text-white font-semibold">{selectedRegistration.mobile_number}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white font-semibold">{selectedRegistration.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">College</p>
                  <p className="text-white font-semibold">{selectedRegistration.college_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Department</p>
                  <p className="text-white font-semibold">{selectedRegistration.department}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Participation Day</p>
                  <p className="text-white font-semibold">
                    {selectedRegistration.participation_day === 'day1' ? 'Day 1' : 'Day 2'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Selected Events</p>
                <div className="space-y-2">
                  {selectedRegistration.selected_events.map((event, idx) => (
                    <div key={idx} className="bg-gray-800 rounded-lg p-4">
                      <p className="text-white font-semibold mb-2">{event.eventName}</p>
                      {event.teamName && (
                        <>
                          <p className="text-gray-400 text-sm">Team: {event.teamName}</p>
                          <p className="text-gray-400 text-sm">Members: {event.numberOfMembers}</p>
                          <p className="text-gray-400 text-sm">Leader Phone: {event.teamLeaderPhone}</p>
                          <p className="text-gray-400 text-sm">Team Members: {event.memberNames}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Participants</p>
                  <p className="text-white font-semibold">{selectedRegistration.total_participants}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Payment Amount</p>
                  <p className="text-yellow-400 font-bold text-xl">₹{selectedRegistration.payment_amount}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-400 text-sm mb-1">UPI Transaction ID</p>
                  <p className="text-white font-semibold">{selectedRegistration.upi_transaction_id}</p>
                </div>
              </div>

              {selectedRegistration.payment_screenshot_url && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Payment Screenshot</p>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <img 
                      src={selectedRegistration.payment_screenshot_url} 
                      alt="Payment Screenshot" 
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
