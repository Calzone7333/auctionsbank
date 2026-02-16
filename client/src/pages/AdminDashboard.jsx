import React, { useState, useEffect } from 'react';
import {
    Users,
    LayoutDashboard,
    List,
    LogOut,
    ShieldCheck,
    TrendingUp,
    AlertCircle,
    Home,
    PlusSquare,
    Upload,
    MapPin,
    DollarSign,
    Calendar,
    FileText,
    Type,
    Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAuctions: 0
    });
    const [allUsers, setAllUsers] = useState([]);
    const [allAuctions, setAllAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State for Adding Auction
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        bankName: '',
        cityName: '',
        propertyType: 'Residential',
        reservePrice: '',
        emdAmount: '',
        auctionDate: '',
        noticeUrl: ''
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auctions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Auction posted successfully!');
                setFormData({
                    title: '',
                    description: '',
                    bankName: '',
                    cityName: '',
                    propertyType: 'Residential',
                    reservePrice: '',
                    emdAmount: '',
                    auctionDate: '',
                    noticeUrl: ''
                });
                setActiveTab('auctions');
                // Refresh stats
                const aStatsRes = await fetch(`${API_BASE_URL}/auctions/stats`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (aStatsRes.ok) {
                    const aStats = await aStatsRes.json();
                    setStats(prev => ({ ...prev, totalAuctions: aStats.totalAuctions }));
                }
            } else {
                alert('Failed to post auction.');
            }
        } catch (error) {
            console.error('Error posting auction:', error);
            alert('An error occurred.');
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userHeaders = { 'Authorization': `Bearer ${user.token}` };
                const [uStatsRes, aStatsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/users/stats`, { headers: userHeaders }),
                    fetch(`${API_BASE_URL}/auctions/stats`, { headers: userHeaders })
                ]);

                if (uStatsRes.ok && aStatsRes.ok) {
                    const uStats = await uStatsRes.json();
                    const aStats = await aStatsRes.json();

                    setStats({
                        totalUsers: uStats.totalUsers,
                        totalAuctions: aStats.totalAuctions
                    });
                }
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) fetchStats();
    }, [user]);

    useEffect(() => {
        if (activeTab === 'users' && user?.token) {
            fetch(`${API_BASE_URL}/users`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            })
                .then(res => {
                    if (res.status === 403) {
                        navigate('/');
                        return null;
                    }
                    return res.json();
                })
                .then(data => {
                    if (data) setAllUsers(data);
                })
                .catch(err => console.error("Error fetching users:", err));
        }

        if (activeTab === 'auctions' && user?.token) {
            fetch(`${API_BASE_URL}/auctions`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            })
                .then(res => res.json())
                .then(data => setAllAuctions(data))
                .catch(err => console.error("Error fetching auctions:", err));
        }
    }, [activeTab, user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === id
                ? 'bg-aq-blue text-white shadow-lg shadow-aq-blue/20'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-display flex">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="text-aq-blue w-6 h-6" /> Admin Control
                    </h1>
                </div>

                <div className="flex-1 p-4 space-y-2">
                    <SidebarItem id="overview" icon={LayoutDashboard} label="Admin Overview" />
                    <SidebarItem id="post-auction" icon={PlusSquare} label="Post Auction" />
                    <SidebarItem id="users" icon={Users} label="User Management" />
                    <SidebarItem id="auctions" icon={List} label="All Auctions" />

                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-aq-blue hover:bg-blue-50"
                        >
                            <Home className="w-5 h-5" />
                            Back to Home
                        </button>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100">
                    <div className="bg-slate-900 p-4 rounded-xl mb-4 text-white">
                        <p className="text-[10px] text-white/50 font-bold uppercase mb-1">Signed in as Administrator</p>
                        <p className="text-sm font-bold truncate">{user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-500 px-4 py-2 text-sm font-bold hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" /> Exit Portal
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 p-6 lg:p-10">
                <div className="max-w-6xl mx-auto">

                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900">Platform Health</h2>
                                    <p className="text-slate-500 mt-1">Real-time statistics for Aquection</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Server Status</p>
                                    <div className="flex items-center gap-2 text-emerald-500 font-bold">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                                        Operational
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-slate-500 font-medium text-sm">Total Members</h3>
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
                                    </div>
                                    <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
                                    <p className="text-xs text-green-500 mt-2 font-bold">+12.5% vs last month</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-slate-500 font-medium text-sm">Active Auctions</h3>
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><List className="w-5 h-5" /></div>
                                    </div>
                                    <p className="text-3xl font-bold text-slate-900">{stats.totalAuctions}</p>
                                    <p className="text-xs text-blue-500 mt-2 font-bold">{stats.totalAuctions} live listings</p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-aq-blue" /> Quick Actions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setActiveTab('post-auction')}
                                        className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-aq-blue hover:bg-blue-50 transition-all text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-aq-blue/10 text-aq-blue flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <PlusSquare className="w-5 h-5" />
                                        </div>
                                        <p className="font-bold text-slate-900">Post New Auction</p>
                                        <p className="text-xs text-slate-500 mt-1">Add a new property listing to the platform.</p>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('users')}
                                        className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-aq-blue hover:bg-blue-50 transition-all text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <p className="font-bold text-slate-900">Manage Users</p>
                                        <p className="text-xs text-slate-500 mt-1">Review and manage platform members.</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'post-auction' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900">Post New Auction</h2>
                                <p className="text-slate-500 mt-1">Create a new property listing on the platform.</p>
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                <form onSubmit={handleFormSubmit} className="p-8 space-y-8">
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-500" /> Property Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Auction Title</label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-aq-blue transition-all"
                                                    placeholder="e.g., 3BHK Luxury Apartment in Anna Nagar"
                                                    value={formData.title}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                                <textarea
                                                    name="description"
                                                    rows="4"
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-aq-blue transition-all"
                                                    placeholder="Detailed description..."
                                                    value={formData.description}
                                                    onChange={handleFormChange}
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Property Type</label>
                                                <select
                                                    name="propertyType"
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-aq-blue transition-all"
                                                    value={formData.propertyType}
                                                    onChange={handleFormChange}
                                                >
                                                    <option value="Residential">Residential</option>
                                                    <option value="Commercial">Commercial</option>
                                                    <option value="Industrial">Industrial</option>
                                                    <option value="Agricultural">Agricultural</option>
                                                    <option value="Land">Land / Plot</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Notice URL (Optional)</label>
                                                <input
                                                    type="url"
                                                    name="noticeUrl"
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-aq-blue transition-all"
                                                    placeholder="https://..."
                                                    value={formData.noticeUrl}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-emerald-500" /> Location & Bank Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Bank Name</label>
                                                <input
                                                    type="text"
                                                    name="bankName"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-aq-blue transition-all"
                                                    placeholder="e.g., SBI"
                                                    value={formData.bankName}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">City Name</label>
                                                <input
                                                    type="text"
                                                    name="cityName"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-aq-blue transition-all"
                                                    placeholder="e.g., Chennai"
                                                    value={formData.cityName}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-amber-500" /> Financials & Schedule
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Reserve Price (₹)</label>
                                                <input
                                                    type="number"
                                                    name="reservePrice"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-aq-blue transition-all"
                                                    placeholder="0.00"
                                                    value={formData.reservePrice}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">EMD Amount (₹)</label>
                                                <input
                                                    type="number"
                                                    name="emdAmount"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-aq-blue transition-all"
                                                    placeholder="0.00"
                                                    value={formData.emdAmount}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Auction Date</label>
                                                <input
                                                    type="datetime-local"
                                                    name="auctionDate"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-aq-blue transition-all"
                                                    value={formData.auctionDate}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-6 border-t border-slate-100">
                                        <button
                                            type="submit"
                                            disabled={formLoading}
                                            className="px-10 py-4 bg-aq-gold text-white font-bold rounded-2xl shadow-lg shadow-aq-gold/20 hover:bg-yellow-600 transition-all disabled:opacity-50"
                                        >
                                            {formLoading ? 'Posting...' : 'Post Auction Listing'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900">User Management</h2>
                                <p className="text-slate-500 mt-1">View and manage registered users.</p>
                            </div>
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {allUsers.map(u => (
                                            <tr key={u.id} className="hover:bg-slate-50/50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-bold text-slate-900">{u.fullName || 'User'}</p>
                                                        <p className="text-xs text-slate-500">{u.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'auctions' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900">All Auctions</h2>
                                <p className="text-slate-500 mt-1">Master catalog of all property listings.</p>
                            </div>
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Property Title</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Bank</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Posted Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {allAuctions.map(auction => (
                                            <tr key={auction.id} className="hover:bg-slate-50/50">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-900 truncate max-w-xs">{auction.title}</p>
                                                    <p className="text-xs text-slate-500">{auction.propertyName || auction.city}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700">
                                                    {auction.bankName}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-900">
                                                    ₹{auction.reservePrice}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {new Date(auction.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
