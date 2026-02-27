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
    IndianRupee,
    Calendar,
    FileText,
    Type,
    Building2,
    FileEdit,
    ClipboardList,
    Bell,
    Settings,
    Sparkles,
    Zap,
    Trash2,
    Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, getFileUrl } from '../apiConfig';

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

    // Form State for Adding/Editing Auction
    const [editingAuctionId, setEditingAuctionId] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        borrowerName: '',
        bankName: '',
        propertyType: '',
        location: '',
        area: '',
        locality: '',
        cityName: '',
        reservePrice: '',
        emdAmount: '',
        bidIncrement: '',
        emdLastDate: '',
        auctionDate: '',
        auctionEndDate: '',
        inspectionDate: '',
        bankContactDetails: '',
        possession: '',
        noticeUrl: '',
        imageUrl: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [autoFillText, setAutoFillText] = useState('');

    const handleAutoFill = () => {
        if (!autoFillText.trim()) return;

        const data = { ...formData };

        // Helper to extract using regex
        const extract = (regex) => {
            const match = autoFillText.match(regex);
            return match ? match[1].trim() : null;
        };

        const parseDateTime = (fieldLabel) => {
            // Robust regex to capture Date and optional Time specifically after a label
            // Handles formats like "Label: 12.03.2026 11:00 AM" or "Label: 12/03/2026 at 11:00 AM"
            const regex = new RegExp(`${fieldLabel}:?\\s*(\\d{2})[./-](\\d{2})[./-](\\d{4})(?:\\s*(?:at|from|on|@)?\\s*(\\d{1,2}:\\d{2}\\s*[APM]{2}))?`, 'i');
            const match = autoFillText.match(regex);
            if (match) {
                const [_, d, m, y, time] = match;
                let dateStr = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                if (time) {
                    let t = time.trim();
                    let [timePart, modifier] = t.split(/\s+/);
                    let [hours, minutes] = timePart.split(':');
                    let h = parseInt(hours, 10);
                    if (modifier && modifier.toUpperCase() === 'PM' && h < 12) h += 12;
                    if (modifier && modifier.toUpperCase() === 'AM' && h === 12) h = 0;
                    dateStr += `T${h.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
                } else {
                    // No time found, default to start of day for valid datetime-local format
                    dateStr += `T00:00`;
                }
                return dateStr;
            }
            return null;
        };

        // Bank & Borrower
        const bank = extract(/Bank Name:\s*(.*)/i);
        if (bank) data.bankName = bank;

        const borrower = extract(/Borrower Name:\s*(.*)/i);
        if (borrower) data.borrowerName = borrower;

        // Property Type Mapping
        const type = extract(/Property Type:\s*(.*)/i);
        if (type) {
            const tl = type.toLowerCase();
            if (tl.includes('flat') || tl.includes('floor')) data.propertyType = 'Flat and Floor';
            else if (tl.includes('residential') || tl.includes('house')) data.propertyType = 'House and Residential Plot';
            else if (tl.includes('land') || tl.includes('plot') || tl.includes('site')) data.propertyType = 'Land, Plot and Site';
            else if (tl.includes('commercial')) data.propertyType = 'All Commercial';
            else if (tl.includes('office')) data.propertyType = 'Office';
            else if (tl.includes('shop')) data.propertyType = 'Shop';
            else if (tl.includes('industrial') || tl.includes('shed')) data.propertyType = 'Industrial Plots, Land & Sheds';
            else if (tl.includes('factory')) data.propertyType = 'Factory Land & buildings';
            else if (tl.includes('car')) data.propertyType = 'Car';
            else if (tl.includes('plant') || tl.includes('machinery')) data.propertyType = 'Plant and Machinery';
        }

        // Description
        const desc = extract(/Description:\s*(.*)/i);
        if (desc) data.description = desc;

        // Location & City
        const loc = extract(/Location:\s*(.*)/i) || extract(/Property Location:\s*(.*)/i);
        if (loc) {
            data.location = loc;
            // Extract city from location if city not explicitly provided
            const parts = loc.split(',');
            if (parts.length > 1) {
                const cityPart = parts[parts.length - 1].split('-')[0].trim();
                data.cityName = cityPart;
            }
        }

        // Area
        const area = extract(/Area:\s*(.*)/i) || extract(/Building Area.*:\s*(.*)/i) || extract(/Total Land Area:\s*(.*)/i) || extract(/Property Dimensions:\s*(.*)/i);
        if (area) data.area = area;

        // Locality
        const locality = extract(/Locality:\s*(.*)/i);
        if (locality) data.locality = locality;

        // City (Explicit)
        const city = extract(/City:\s*(.*)/i);
        if (city) data.cityName = city;

        // Financials
        const rp = extract(/Reserve Price:\s*(?:Rs\.|₹)?\s*([\d,]+)/i);
        if (rp) data.reservePrice = rp.replace(/,/g, '');

        const emdVal = extract(/EMD Amount.*:\s*(?:Rs\.|₹)?\s*([\d,]+)/i);
        if (emdVal) data.emdAmount = emdVal.replace(/,/g, '');

        const bi = extract(/Bid Increment:\s*(?:Rs\.|₹)?\s*([\d,]+)/i);
        if (bi) data.bidIncrement = bi.replace(/,/g, '');

        // Bank Contact
        const contact = extract(/Bank Contact Details:\s*(.*)/i) || extract(/Contact:\s*(.*)/i);
        const email = extract(/Bank Email:\s*(.*)/i) || extract(/Email:\s*(.*)/i);
        if (contact || email) {
            data.bankContactDetails = `${contact || ''} ${email ? `| Email: ${email}` : ''}`.trim();
        }

        // Dates - improved extraction
        const emdDate = parseDateTime('EMD Submission Date') || parseDateTime('EMD Last Date');
        if (emdDate) data.emdLastDate = emdDate;

        const auctionStart = parseDateTime('Auction Start Date & Time') || parseDateTime('Auction Date & Time') || parseDateTime('Auction Date');
        if (auctionStart) data.auctionDate = auctionStart;

        const auctionEnd = parseDateTime('Auction End Date & Time') || parseDateTime('Auction End Date');
        if (auctionEnd) data.auctionEndDate = auctionEnd;

        setFormData(data);
        setAutoFillText(''); // Clear magic fill source
        alert('Magic Auto-Fill completed! Please review the fields.');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            let uploadedFileUrl = formData.noticeUrl;

            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);
                const uploadRes = await fetch(`${API_BASE_URL}/auctions/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${user.token}` },
                    body: uploadData
                });
                if (uploadRes.status === 401 || uploadRes.status === 403) {
                    alert('Session expired. Please login again.');
                    logout();
                    return;
                }
                if (uploadRes.ok) {
                    const uploadResult = await uploadRes.json();
                    uploadedFileUrl = uploadResult.url;
                }
            }

            let uploadedImageUrl = formData.imageUrl;
            if (selectedImage) {
                const uploadData = new FormData();
                uploadData.append('file', selectedImage);
                const uploadRes = await fetch(`${API_BASE_URL}/auctions/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${user.token}` },
                    body: uploadData
                });
                if (uploadRes.status === 401 || uploadRes.status === 403) {
                    alert('Session expired. Please login again.');
                    logout();
                    return;
                }
                if (uploadRes.ok) {
                    const uploadResult = await uploadRes.json();
                    uploadedImageUrl = uploadResult.url;
                }
            }

            const isEditing = !!editingAuctionId;
            const url = isEditing
                ? `${API_BASE_URL}/auctions/${editingAuctionId}`
                : `${API_BASE_URL}/auctions`;

            const finalFormData = { ...formData, noticeUrl: uploadedFileUrl, imageUrl: uploadedImageUrl };

            // Convert empty strings to null for backend compatibility
            ['emdLastDate', 'auctionDate', 'auctionEndDate', 'inspectionDate'].forEach(key => {
                if (finalFormData[key] === '') finalFormData[key] = null;
            });
            ['reservePrice', 'emdAmount', 'bidIncrement'].forEach(key => {
                if (finalFormData[key] === '') finalFormData[key] = null;
            });

            // Auto-generate hidden title/description if the user has omitted them from the UI
            if (!finalFormData.title) {
                finalFormData.title = `${finalFormData.propertyType || 'Property'} at ${finalFormData.cityName || 'Location'}`;
            }

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(finalFormData),
            });

            if (response.ok) {
                alert(isEditing ? 'Auction updated successfully!' : 'Auction posted successfully!');
                setFormData({
                    title: '',
                    description: '',
                    borrowerName: '',
                    bankName: '',
                    propertyType: '',
                    location: '',
                    area: '',
                    locality: '',
                    cityName: '',
                    reservePrice: '',
                    emdAmount: '',
                    bidIncrement: '',
                    emdLastDate: '',
                    auctionDate: '',
                    auctionEndDate: '',
                    inspectionDate: '',
                    bankContactDetails: '',
                    possession: '',
                    noticeUrl: '',
                    imageUrl: '' // Add this
                });
                setSelectedFile(null);
                setSelectedImage(null); // Add this
                setImagePreview(null); // Add this
                setEditingAuctionId(null);
                setAutoFillText(''); // Clear auto-fill text
                setActiveTab(isEditing ? 'my-auctions' : 'auctions');

                // Refresh data
                const aStatsRes = await fetch(`${API_BASE_URL}/auctions/stats`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (aStatsRes.ok) {
                    const aStats = await aStatsRes.json();
                    setStats(prev => ({ ...prev, totalAuctions: aStats.totalAuctions }));
                }
            } else if (response.status === 401 || response.status === 403) {
                alert('Session expired or unauthorized. Logging out...');
                logout();
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

        if (activeTab === 'auctions' || activeTab === 'my-auctions') {
            if (user?.token) {
                fetch(`${API_BASE_URL}/auctions`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                })
                    .then(res => res.json())
                    .then(data => setAllAuctions(data))
                    .catch(err => console.error("Error fetching auctions:", err));
            }
        }
    }, [activeTab, user, navigate]);

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                alert('Failed to update user role.');
            }
        } catch (error) {
            console.error('Error updating role:', error);
            alert('An error occurred.');
        }
    };

    const handleDeleteAuction = async (auctionId) => {
        if (!window.confirm('Are you sure you want to delete this auction?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                alert('Auction deleted successfully!');
                setAllAuctions(prev => prev.filter(a => a.id !== auctionId));
            } else {
                const errorData = await response.text();
                alert(`Failed to delete auction: ${errorData}`);
            }
        } catch (error) {
            console.error('Error deleting auction:', error);
            alert('An error occurred.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === id
                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-display font-black uppercase tracking-tight text-brand-dark flex items-center gap-2">
                        <ShieldCheck className="text-brand-blue w-6 h-6" /> Admin Control
                    </h1>
                </div>

                <div className="flex-1 p-4 space-y-2">
                    <SidebarItem id="overview" icon={LayoutDashboard} label="Admin Overview" />
                    <SidebarItem id="post-auction" icon={PlusSquare} label="Post Auction" />
                    <SidebarItem id="my-auctions" icon={ClipboardList} label="Admin Auctions" />
                    <SidebarItem id="users" icon={Users} label="User Management" />
                    <SidebarItem id="auctions" icon={List} label="All Auctions" />

                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
                {/* Fixed Top Header */}
                <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-3 flex justify-end items-center z-20 shrink-0">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/')}
                            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-brand-dark border border-slate-200 transition-all shadow-sm"
                            title="Back to Home"
                        >
                            <Home className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-red-500 border border-slate-200 transition-all shadow-sm relative"
                            title="Log Out"
                        >
                            <LogOut className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>

                        <div className="relative group ml-1">
                            <button
                                className="w-8 h-8 rounded-full focus:outline-none transition-all shadow-[0_0_0_2px_theme(colors.slate.100)] hover:shadow-[0_0_0_2px_theme(colors.brand.blue)] flex items-center justify-center overflow-hidden bg-brand-blue text-white font-black text-xs cursor-default"
                            >
                                {(user?.fullName || user?.email || 'A').charAt(0).toUpperCase()}
                            </button>
                            {/* Hover tooltip */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                                <p className="text-sm font-black text-slate-800 truncate">{user?.fullName || 'Administrator'}</p>
                                <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-6xl mx-auto pb-10">

                        {activeTab === 'overview' && (
                            <div className="space-y-8 max-w-4xl mx-auto">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h2 className="text-3xl font-display font-black uppercase tracking-tight text-brand-dark">Platform Health</h2>
                                        <p className="text-slate-500 mt-1">Real-time statistics for Madrasauction</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Server Status</p>
                                        <div className="flex items-center gap-2 text-emerald-500 font-bold">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                                            Operational
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-slate-500 font-medium text-xs uppercase tracking-wider">Total Members</h3>
                                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><Users className="w-4 h-4" /></div>
                                        </div>
                                        <p className="text-2xl font-display font-black text-brand-dark">{stats.totalUsers}</p>
                                        <p className="text-[10px] text-green-500 mt-1 font-bold">+12.5% vs last month</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-slate-500 font-medium text-xs uppercase tracking-wider">Active Auctions</h3>
                                            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md"><List className="w-4 h-4" /></div>
                                        </div>
                                        <p className="text-2xl font-display font-black text-brand-dark">{stats.totalAuctions}</p>
                                        <p className="text-[10px] text-brand-blue mt-1 font-bold">{stats.totalAuctions} live listings</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="text-base font-display font-black uppercase tracking-tight text-brand-dark mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-brand-blue" /> Quick Actions</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <button
                                            onClick={() => setActiveTab('post-auction')}
                                            className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-blue hover:bg-blue-50 transition-all text-left group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                <PlusSquare className="w-4 h-4" />
                                            </div>
                                            <p className="font-bold text-sm text-brand-dark">Post New Auction</p>
                                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">Add a new property listing.</p>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('users')}
                                            className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-blue hover:bg-blue-50 transition-all text-left group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <p className="font-bold text-sm text-brand-dark">Manage Users</p>
                                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">Review and manage members.</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'post-auction' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
                                <div>
                                    <h2 className="text-3xl font-display font-black uppercase tracking-tight text-brand-dark">
                                        {editingAuctionId ? 'Edit Auction' : 'Post New Auction'}
                                    </h2>
                                    <p className="text-slate-500 mt-1">
                                        {editingAuctionId ? 'Update details for this property listing.' : 'Create a new property listing on the platform.'}
                                    </p>
                                </div>

                                {!editingAuctionId && (
                                    <div className="bg-gradient-to-br from-brand-blue/5 to-white rounded-2xl shadow-sm border border-brand-blue/10 p-5 space-y-3">
                                        <div className="flex items-center gap-2 text-brand-blue">
                                            <Sparkles className="w-5 h-5 animate-pulse" />
                                            <h3 className="text-sm font-black uppercase tracking-wider">Magic Auto-Fill</h3>
                                        </div>
                                        <p className="text-xs text-slate-500">Paste the auction detail text here and click auto-fill to instantly populate the form below.</p>
                                        <textarea
                                            className="w-full p-3 text-[13px] rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-brand-blue transition-all outline-none min-h-[100px]"
                                            placeholder="Paste details here..."
                                            value={autoFillText}
                                            onChange={(e) => setAutoFillText(e.target.value)}
                                        ></textarea>
                                        <button
                                            onClick={handleAutoFill}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg shadow-brand-blue/20"
                                        >
                                            <Zap className="w-4 h-4" /> Start Magic Fill
                                        </button>
                                    </div>
                                )}

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <form onSubmit={handleFormSubmit} className="p-6 space-y-8">
                                        {/* Row 1: Borrower & Bank */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Borrower Name</label>
                                                <input
                                                    type="text"
                                                    name="borrowerName"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    placeholder="Enter borrower name"
                                                    value={formData.borrowerName}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Bank Name</label>
                                                <input
                                                    type="text"
                                                    name="bankName"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    placeholder="e.g., Punjab National Bank"
                                                    value={formData.bankName}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Row 2: Type & Description */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Property Type</label>
                                                <select
                                                    name="propertyType"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    value={formData.propertyType}
                                                    onChange={handleFormChange}
                                                >
                                                    <option value="">Select Property Type</option>
                                                    <option value="Flat and Floor">Flat and Floor</option>
                                                    <option value="House and Residential Plot">House and Residential Plot</option>
                                                    <option value="Land, Plot and Site">Land, Plot and Site</option>
                                                    <option value="All Commercial">All Commercial</option>
                                                    <option value="Office">Office</option>
                                                    <option value="Shop">Shop</option>
                                                    <option value="Industrial Plots, Land & Sheds">Industrial Plots, Land & Sheds</option>
                                                    <option value="Factory Land & buildings">Factory Land & buildings</option>
                                                    <option value="Car">Car</option>
                                                    <option value="Plant and Machinery">Plant and Machinery</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Description</label>
                                                <input
                                                    type="text"
                                                    name="description"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    placeholder="Brief property description"
                                                    value={formData.description}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Row 3: Location & Area */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Location</label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    placeholder="Full property address"
                                                    value={formData.location}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Area (Dimensions)</label>
                                                <input
                                                    type="text"
                                                    name="area"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    placeholder="e.g., 2,327 Sq. Ft."
                                                    value={formData.area}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Row 4: Possession & Locality */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Possession Status</label>
                                                <select
                                                    name="possession"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    value={formData.possession}
                                                    onChange={handleFormChange}
                                                >
                                                    <option value="">Select Possession Status</option>
                                                    <option value="Symbolic">Symbolic Possession</option>
                                                    <option value="Physical">Physical Possession</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Locality</label>
                                                <input
                                                    type="text"
                                                    name="locality"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    placeholder="e.g., Sriperumbudur"
                                                    value={formData.locality}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Row 5: City & Financials */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">City</label>
                                                <input
                                                    type="text"
                                                    name="cityName"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    placeholder="e.g., Chennai"
                                                    value={formData.cityName}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Reserve Price (₹)</label>
                                                <input
                                                    type="number"
                                                    name="reservePrice"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    placeholder="0.00"
                                                    value={formData.reservePrice}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">EMD Amount (₹)</label>
                                                <input
                                                    type="number"
                                                    name="emdAmount"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    placeholder="0.00"
                                                    value={formData.emdAmount}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Bid Increment (₹)</label>
                                                <input
                                                    type="number"
                                                    name="bidIncrement"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    placeholder="0.00"
                                                    value={formData.bidIncrement}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Row 6: Dates */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">EMD Submission Date</label>
                                                <input
                                                    type="datetime-local"
                                                    name="emdLastDate"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    value={formData.emdLastDate}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Auction Start Date & Time</label>
                                                <input
                                                    type="datetime-local"
                                                    name="auctionDate"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    value={formData.auctionDate}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Auction End Date & Time</label>
                                                <input
                                                    type="datetime-local"
                                                    name="auctionEndDate"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    value={formData.auctionEndDate}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Row 8: Property Image & Auction PDF */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                                            <div>
                                                <label className="block text-xs font-black text-brand-dark mb-2 uppercase tracking-[0.15em]">Property Image (Display)</label>
                                                <div className="flex flex-col gap-3">
                                                    <div className="relative group w-full aspect-video rounded-lg border-2 border-dashed border-slate-200 bg-white overflow-hidden flex items-center justify-center hover:border-brand-blue/50 transition-all cursor-pointer">
                                                        {imagePreview || formData.imageUrl ? (
                                                            <img
                                                                src={imagePreview || getFileUrl(formData.imageUrl)}
                                                                className="w-full h-full object-cover"
                                                                alt="Preview"
                                                            />
                                                        ) : (
                                                            <div className="text-center">
                                                                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Click to upload image</span>
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            onChange={handleImageChange}
                                                        />
                                                    </div>
                                                    {imagePreview && (
                                                        <button
                                                            type="button"
                                                            onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                                                            className="text-[10px] font-black uppercase text-red-500 hover:text-red-700 w-fit"
                                                        >
                                                            Remove Selected Image
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-end pb-1">
                                                <label className="block text-xs font-black text-brand-dark mb-2 uppercase tracking-[0.15em]">Auction Notice (PDF/Image)</label>
                                                <div className="p-4 bg-white rounded-lg border border-slate-200 border-dashed">
                                                    <input
                                                        type="file"
                                                        accept="image/*,application/pdf"
                                                        className="w-full text-[11px] font-medium text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 cursor-pointer"
                                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                                    />
                                                    {formData.noticeUrl && !selectedFile && (
                                                        <div className="mt-3 flex items-center gap-2">
                                                            <div className="w-8 h-10 bg-slate-100 rounded flex items-center justify-center">
                                                                <FileText className="w-4 h-4 text-brand-blue" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Attached Document</p>
                                                                <a href={getFileUrl(formData.noticeUrl)} target="_blank" rel="noreferrer" className="text-xs text-brand-blue font-bold truncate block hover:underline">
                                                                    View Current File
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                                            {editingAuctionId ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingAuctionId(null);
                                                        setFormData({
                                                            title: '', description: '', borrowerName: '', bankName: '', propertyType: '', location: '', area: '', locality: '', cityName: '', reservePrice: '', emdAmount: '', bidIncrement: '', emdLastDate: '', auctionDate: '', auctionEndDate: '', inspectionDate: '', bankContactDetails: '', possession: '', noticeUrl: '', imageUrl: ''
                                                        });
                                                        setSelectedFile(null);
                                                        setSelectedImage(null);
                                                        setImagePreview(null);
                                                        setActiveTab('my-auctions');
                                                    }}
                                                    className="px-6 py-3 font-bold text-xs text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
                                                >
                                                    Cancel Edit
                                                </button>
                                            ) : <div></div>}
                                            <button
                                                type="submit"
                                                disabled={formLoading}
                                                className="px-8 py-3 bg-brand-dark text-white uppercase tracking-widest text-[11px] font-black rounded-lg shadow-lg shadow-brand-dark/20 hover:bg-brand-blue transition-all disabled:opacity-50"
                                            >
                                                {formLoading ? 'Saving...' : (editingAuctionId ? 'Update Auction' : 'Post Auction')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-display font-black uppercase tracking-tight text-brand-dark">User Management</h2>
                                    <p className="text-slate-500 mt-1">View and manage registered users and their platform roles.</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50/80 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role Access</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {allUsers.map(u => (
                                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-black uppercase shadow-sm border border-brand-blue/20">
                                                                {(u.fullName || 'U').charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm text-brand-dark">{u.fullName || 'Unassigned Name'}</p>
                                                                <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={u.role}
                                                            onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                                                            className={`text-xs font-black px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 appearance-none cursor-pointer transition-all ${u.role === 'ADMIN'
                                                                ? 'bg-purple-50 text-purple-700 border-purple-200 focus:ring-purple-200'
                                                                : 'bg-slate-50 text-slate-700 border-slate-200 focus:ring-brand-blue/20 hover:bg-slate-100'
                                                                }`}
                                                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 7l5 5 5-5'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.25rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em', paddingRight: '1.75rem' }}
                                                        >
                                                            <option value="USER" className="font-bold text-slate-700">USER</option>
                                                            <option value="ADMIN" className="font-bold text-purple-700">ADMIN</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                                                        {new Date(u.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {activeTab === 'auctions' && (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-display font-black uppercase tracking-tight text-brand-dark">All Auctions</h2>
                                    <p className="text-sm text-slate-500 mt-1">Master catalog of all property listings.</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50/80 border-b border-slate-100">
                                            <tr>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Property Title</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posted Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {allAuctions.map(auction => (
                                                <tr key={auction.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-5 py-3">
                                                        <p className="font-bold text-sm text-slate-900 truncate max-w-[200px]">{auction.title}</p>
                                                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">{auction.propertyType || auction.cityName}</p>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-[11px] font-bold text-slate-600 border border-slate-200/60">
                                                            {auction.bankName}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 font-black text-sm text-brand-dark">
                                                        ₹{auction.reservePrice}
                                                    </td>
                                                    <td className="px-5 py-3 text-xs font-medium text-slate-500">
                                                        {new Date(auction.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'my-auctions' && (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-display font-black uppercase tracking-tight text-brand-dark">Admin Auctions</h2>
                                    <p className="text-sm text-slate-500 mt-1">Properties posted by you. You have full edit access to these.</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50/80 border-b border-slate-100">
                                            <tr>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Property Title</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {allAuctions.filter(a => a.createdByEmail === user?.email).map(auction => (
                                                <tr key={auction.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-5 py-3">
                                                        <p className="font-bold text-sm text-slate-900 truncate max-w-[200px]">{auction.title}</p>
                                                        <p className="text-[11px] text-brand-blue font-black tracking-wide uppercase mt-0.5">{auction.propertyType} • {auction.cityName}</p>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-[11px] font-bold text-slate-600 border border-slate-200/60">
                                                            {auction.bankName}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 font-black text-sm text-brand-dark">
                                                        ₹{auction.reservePrice}
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setEditingAuctionId(auction.id);
                                                                setFormData({
                                                                    title: auction.title || '',
                                                                    description: auction.description || '',
                                                                    borrowerName: auction.borrowerName || '',
                                                                    bankName: auction.bankName || '',
                                                                    propertyType: auction.propertyType || 'Flat and Floor',
                                                                    location: auction.location || '',
                                                                    area: auction.area || '',
                                                                    locality: auction.locality || '',
                                                                    cityName: auction.cityName || '',
                                                                    reservePrice: auction.reservePrice || '',
                                                                    emdAmount: auction.emdAmount || '',
                                                                    bidIncrement: auction.bidIncrement || '',
                                                                    emdLastDate: auction.emdLastDate ? auction.emdLastDate.slice(0, 16) : '',
                                                                    auctionDate: auction.auctionDate ? auction.auctionDate.slice(0, 16) : '',
                                                                    auctionEndDate: auction.auctionEndDate ? auction.auctionEndDate.slice(0, 16) : '',
                                                                    inspectionDate: auction.inspectionDate ? auction.inspectionDate.slice(0, 16) : '',
                                                                    bankContactDetails: auction.bankContactDetails || '',
                                                                    possession: auction.possession || 'Symbolic',
                                                                    noticeUrl: auction.noticeUrl || '',
                                                                    imageUrl: auction.imageUrl || ''
                                                                });
                                                                setImagePreview(null); // Clear preview for edit
                                                                setActiveTab('post-auction');
                                                            }}
                                                            className="px-3 py-1.5 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white rounded-md text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-1.5 shadow-sm border border-brand-blue/20"
                                                        >
                                                            <FileEdit className="w-3 h-3" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAuction(auction.id)}
                                                            className="ml-2 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-md text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-1.5 shadow-sm border border-red-100"
                                                            title="Delete Auction"
                                                        >
                                                            <Trash2 className="w-3 h-3" /> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {allAuctions.filter(a => a.createdByEmail === user?.email).length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium text-sm">
                                                        You haven't posted any auctions yet.
                                                        <button onClick={() => setActiveTab('post-auction')} className="text-brand-blue font-bold ml-2 hover:underline">Post one now</button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
