import React, { useState, useEffect } from 'react';
import { Upload, Building2, LayoutDashboard, List, LogOut, FileText, MapPin, IndianRupee, Calendar, Type, ShieldCheck, CheckCircle2, Home, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';

const BankDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [docUploaded, setDocUploaded] = useState(false);
    const [myAuctions, setMyAuctions] = useState([]);
    const [loading, setLoading] = useState(false);

    // File Upload State
    const [idCardFile, setIdCardFile] = useState(null);
    const [authLetterFile, setAuthLetterFile] = useState(null);
    const [verificationPending, setVerificationPending] = useState(user?.isVerificationPending || false);
    const [uploading, setUploading] = useState(false);

    // Form State (for Post Auction)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        bankName: '',
        cityName: '',
        propertyType: 'Residential',
        reservePrice: '',
        emdAmount: '',
        auctionDate: '',
        noticeUrl: '',
        // New Fields
        area: '',
        facing: '',
        possession: 'Physical',
        ownership: 'Freehold',
        contactOfficer: '',
        bidIncrement: '',
        inspectionDate: '',
        emdLastDate: ''
    });

    useEffect(() => {
        const fetchMyAuctions = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/auctions/my`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMyAuctions(data);
                }
            } catch (error) {
                console.error("Error fetching my auctions:", error);
            }
        };

        if (user?.token && (activeTab === 'my-auctions' || activeTab === 'overview')) {
            fetchMyAuctions();
        }
    }, [user, activeTab]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePostAuction = async (e) => {
        e.preventDefault();
        setLoading(true);
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
                alert('Auction posted successfully! It will be reviewed by admin.');
                setFormData({
                    title: '', description: '', bankName: '', cityName: '',
                    propertyType: 'Residential', reservePrice: '', emdAmount: '',
                    auctionDate: '', noticeUrl: '',
                    area: '', facing: '', possession: 'Physical', ownership: 'Freehold',
                    contactOfficer: '', bidIncrement: '', inspectionDate: '', emdLastDate: ''
                });
                setActiveTab('my-auctions');
            } else {
                alert('Failed to post auction.');
            }
        } catch (error) {
            console.error('Error posting auction:', error);
            alert('Error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleFileUpload = async () => {
        if (!idCardFile || !authLetterFile) {
            alert("Please upload both Employee ID and Authorization Letter.");
            return;
        }

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('idCard', idCardFile);
        uploadData.append('authLetter', authLetterFile);

        try {
            const response = await fetch(`${API_BASE_URL}/users/upload-verification`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: uploadData
            });

            if (response.ok) {
                setVerificationPending(true);
                setDocUploaded(true);
                alert("Documents submitted successfully! Waiting for admin approval.");
            } else {
                alert("Failed to upload documents.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading documents.");
        } finally {
            setUploading(false);
        }
    };

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === id
                ? 'bg-aq-gold text-white shadow-lg shadow-aq-gold/20'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-display flex text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="text-aq-gold w-6 h-6" /> Bank Portal
                    </h1>
                </div>

                <div className="flex-1 p-4 space-y-2">
                    <SidebarItem id="overview" icon={LayoutDashboard} label="Overview" />
                    <SidebarItem id="post-auction" icon={Upload} label="Post New Auction" />
                    <SidebarItem id="my-auctions" icon={List} label="My Listings" />

                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-aq-gold hover:bg-yellow-50"
                        >
                            <Home className="w-5 h-5" />
                            Back to Home
                        </button>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100">
                    <div className="bg-slate-50 p-4 rounded-xl mb-4 text-slate-900">
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-500 px-4 py-2 text-sm font-bold hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 p-6 lg:p-10">
                {/* Mobile Header */}
                <div className="lg:hidden mb-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                    <h1 className="font-bold text-slate-900">Bank Dashboard</h1>
                    <div className="flex gap-2">
                        <button onClick={() => setActiveTab('post-auction')} className="p-2 bg-aq-gold text-white rounded-lg"><Upload className="w-5 h-5" /></button>
                        <button onClick={handleLogout} className="p-2 bg-slate-100 text-red-500 rounded-lg"><LogOut className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Header Section */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Overview</h2>
                                    <p className="text-slate-500 text-sm mt-0.5">Manage your auctions and profile.</p>
                                </div>
                                {!user?.isVerified && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 shadow-sm animate-fade-in">
                                        <div className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Verification Pending</span>
                                    </div>
                                )}
                            </div>

                            {/* Verification Alert Banner */}
                            {!user?.isVerified && (
                                <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-md shadow-amber-500/5 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                        <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-100 group-hover:scale-105 transition-transform">
                                            <ShieldCheck className="w-7 h-7 text-amber-500" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-base font-bold text-slate-900">KYC Verification Required</h3>
                                            </div>
                                            <p className="text-slate-500 text-xs leading-relaxed mb-3 max-w-2xl">
                                                Upload official <span className="font-bold text-slate-700">ID Card</span> and <span className="font-bold text-slate-700">Auth Letter</span> to activate account.
                                            </p>

                                            {verificationPending || user?.isVerificationPending ? (
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                    <div>
                                                        <p className="font-bold text-xs">Documents Submitted</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className="relative group/upload">
                                                        <input type="file" onChange={(e) => setIdCardFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                                        <div className={`px-4 py-2 border border-dashed ${idCardFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50'} rounded-lg flex items-center gap-2 transition-all hover:border-aq-blue cursor-pointer`}>
                                                            {idCardFile ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Upload className="w-3 h-3 text-slate-400" />}
                                                            <span className="text-xs font-medium text-slate-600 truncate max-w-[100px]">{idCardFile ? "ID Added" : "Upload ID"}</span>
                                                        </div>
                                                    </div>

                                                    <div className="relative group/upload">
                                                        <input type="file" onChange={(e) => setAuthLetterFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                                        <div className={`px-4 py-2 border border-dashed ${authLetterFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50'} rounded-lg flex items-center gap-2 transition-all hover:border-aq-blue cursor-pointer`}>
                                                            {authLetterFile ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <FileText className="w-3 h-3 text-slate-400" />}
                                                            <span className="text-xs font-medium text-slate-600 truncate max-w-[100px]">{authLetterFile ? "Letter Added" : "Upload Letter"}</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={handleFileUpload}
                                                        disabled={uploading || !idCardFile || !authLetterFile}
                                                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-slate-900/10"
                                                    >
                                                        {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Submit"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl opacity-60 -mr-10 -mt-10 pointer-events-none"></div>
                                </div>
                            )}

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Total Auctions Card */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow transition-shadow group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <List className="w-16 h-16 text-aq-blue" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-10 h-10 bg-blue-50 text-aq-blue rounded-xl flex items-center justify-center">
                                                <List className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                                        </div>
                                        <p className="text-slate-400 font-medium text-xs uppercase tracking-wide">Total Properties</p>
                                        <h3 className="text-2xl font-bold text-slate-900 mt-1">{myAuctions.length}</h3>
                                    </div>
                                </div>

                                {/* Active Bids Card */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow transition-shadow group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <IndianRupee className="w-16 h-16 text-purple-600" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                                <IndianRupee className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">New</span>
                                        </div>
                                        <p className="text-slate-400 font-medium text-xs uppercase tracking-wide">Active Bids</p>
                                        <h3 className="text-2xl font-bold text-slate-900 mt-1">0</h3>
                                    </div>
                                </div>

                                {/* Account Status Card */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow transition-shadow group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <ShieldCheck className="w-16 h-16 text-amber-500" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user?.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user?.isVerified ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                                                {user?.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 font-medium text-xs uppercase tracking-wide">Account Status</p>
                                        <h3 className="text-xl font-bold text-slate-900 mt-1 truncate">
                                            {user?.isVerified ? 'Verified Partner' : (user?.isVerificationPending || verificationPending ? 'In Review' : 'Action Required')}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Action Banner */}
                            <div className={`relative rounded-3xl p-8 overflow-hidden ${user?.isVerified ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="max-w-xl">
                                        <h3 className={`text-2xl font-bold mb-2 ${user?.isVerified ? 'text-white' : 'text-slate-500'}`}>Ready to list a new property?</h3>
                                        <p className={`${user?.isVerified ? 'text-slate-300' : 'text-slate-500'} text-sm leading-relaxed`}>
                                            Upload verify bank auction details seamlessly using our secure portal. Reach thousands of potential buyers instantly.
                                        </p>
                                    </div>
                                    <button
                                        disabled={!user?.isVerified}
                                        onClick={() => setActiveTab('post-auction')}
                                        className={`px-8 py-4 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${user?.isVerified ? 'bg-aq-gold text-white hover:bg-yellow-600 shadow-lg shadow-yellow-600/20 hover:shadow-xl' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                                    >
                                        <Upload className="w-4 h-4" />
                                        Post New Auction
                                    </button>
                                </div>

                                {/* Background Patterns */}
                                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
                                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-aq-gold/10 rounded-full blur-3xl pointer-events-none"></div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'post-auction' && (
                        <div className="space-y-6">
                            {!user?.isVerified ? (
                                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                                    <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Post Auction Feature Locked</h3>
                                    <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
                                        Your account is under verification. Once our team approves your documentation, you will be able to publish new auctions.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-slate-900">Post New Auction</h2>
                                        <p className="text-slate-500">Fill in the details below to publish a new auction notice.</p>
                                    </div>

                                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                                            <h3 className="font-bold text-slate-700 flex items-center gap-2"><FileText className="w-4 h-4" /> Property Details</h3>
                                        </div>
                                        <form onSubmit={handlePostAuction} className="p-6 md:p-8 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="col-span-2 text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Auction Title</label>
                                                    <input type="text" name="title" required value={formData.title} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-aq-blue/20 outline-none" placeholder="e.g. 2BHK Apartment in Anna Nagar" />
                                                </div>
                                                <div className="col-span-2 text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Description</label>
                                                    <textarea name="description" rows="3" value={formData.description} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-aq-blue/20 outline-none" placeholder="Property features, boundaries, etc."></textarea>
                                                </div>
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Bank Name</label>
                                                    <div className="relative">
                                                        <Building2 className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                                                        <input type="text" name="bankName" required value={formData.bankName} onChange={handleFormChange} className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" placeholder="Bank Name" />
                                                    </div>
                                                </div>
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">City</label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                                                        <input type="text" name="cityName" required value={formData.cityName} onChange={handleFormChange} className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" placeholder="City" />
                                                    </div>
                                                </div>
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Property Type</label>
                                                    <div className="relative">
                                                        <Type className="absolute left-3 top-3 text-slate-400 w-5 h-5 z-10" />
                                                        <select name="propertyType" value={formData.propertyType} onChange={handleFormChange} className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none appearance-none relative">
                                                            <option value="Residential">Residential</option>
                                                            <option value="Commercial">Commercial</option>
                                                            <option value="Industrial">Industrial</option>
                                                            <option value="Land">Land / Plot</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Reserve Price (₹)</label>
                                                    <input type="number" name="reservePrice" required value={formData.reservePrice} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" placeholder="0.00" />
                                                </div>
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">EMD Amount (₹)</label>
                                                    <input type="number" name="emdAmount" required value={formData.emdAmount} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" placeholder="0.00" />
                                                </div>
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Auction Date</label>
                                                    <input type="datetime-local" name="auctionDate" required value={formData.auctionDate} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" />
                                                </div>

                                                {/* New Detailed Fields */}
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Area (e.g. 1200 Sq.ft)</label>
                                                    <input type="text" name="area" required value={formData.area} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" placeholder="e.g. 1200 Sq.ft" />
                                                </div>
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Facing</label>
                                                    <select name="facing" value={formData.facing} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none">
                                                        <option value="">Select Direction</option>
                                                        <option value="North">North</option>
                                                        <option value="South">South</option>
                                                        <option value="East">East</option>
                                                        <option value="West">West</option>
                                                        <option value="North-East">North-East</option>
                                                        <option value="North-West">North-West</option>
                                                        <option value="South-East">South-East</option>
                                                        <option value="South-West">South-West</option>
                                                    </select>
                                                </div>
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Possession Type</label>
                                                    <select name="possession" value={formData.possession} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none">
                                                        <option value="Physical">Physical Possession</option>
                                                        <option value="Symbolic">Symbolic Possession</option>
                                                    </select>
                                                </div>
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Ownership Type</label>
                                                    <select name="ownership" value={formData.ownership} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none">
                                                        <option value="Freehold">Freehold</option>
                                                        <option value="Leasehold">Leasehold</option>
                                                        <option value="Co-operative Society">Co-operative Society</option>
                                                    </select>
                                                </div>
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Bid Increment (₹)</label>
                                                    <input type="number" name="bidIncrement" required value={formData.bidIncrement} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" placeholder="10000" />
                                                </div>
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Contact Officer</label>
                                                    <input type="text" name="contactOfficer" required value={formData.contactOfficer} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" placeholder="Officer Name" />
                                                </div>
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Inspection Date</label>
                                                    <input type="datetime-local" name="inspectionDate" required value={formData.inspectionDate} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" />
                                                </div>
                                                <div className="text-slate-900">
                                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Last Date for EMD</label>
                                                    <input type="datetime-local" name="emdLastDate" required value={formData.emdLastDate} onChange={handleFormChange} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" />
                                                </div>
                                            </div>

                                            <div className="pt-4 flex justify-end gap-3">
                                                <button type="button" onClick={() => setActiveTab('overview')} className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                                                <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl bg-aq-gold text-white font-bold hover:bg-yellow-600 transition-colors shadow-lg shadow-aq-gold/20">
                                                    {loading ? 'Posting...' : 'Publish Auction'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'my-auctions' && (
                        <div className="space-y-6">
                            {!user?.isVerified ? (
                                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                                    <List className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Listings Unavailable</h3>
                                    <p className="text-slate-500 max-w-lg mx-auto">
                                        Complete your account verification to view and manage your auction listings.
                                    </p>
                                </div>
                            ) : myAuctions.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {myAuctions.map(auction => (
                                        <div key={auction.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center text-slate-900">
                                            <div>
                                                <h4 className="font-bold text-slate-900">{auction.title}</h4>
                                                <p className="text-sm text-slate-500">{auction.cityName} • ₹{auction.reservePrice.toLocaleString()}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${auction.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                                {auction.isActive ? 'Active' : 'Draft'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-900">
                                    <List className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900">No Auctions Listed Yet</h3>
                                    <p className="text-slate-500 mb-6">You haven't posted any auctions on the platform yet.</p>
                                    <button onClick={() => setActiveTab('post-auction')} className="px-6 py-2 bg-aq-blue text-white rounded-lg font-bold text-sm">Post Your First Auction</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BankDashboard;
