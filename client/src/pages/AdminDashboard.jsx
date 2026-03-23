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
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ExternalLink,
    FileDown,
    Eye,
    Menu,
    X,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Clock,
    Target,
    Activity,
    CreditCard,
    Briefcase,
    Plus,
    FilePlus
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCity, setFilterCity] = useState('');
    const [filterBank, setFilterBank] = useState('');
    const [filterType, setFilterType] = useState('');
    const [chartRange, setChartRange] = useState('7days');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        bankContactDetails: '',
        possession: '',
        noticeUrl: '',
        imageUrl: '',
        noticeUrls: [],
        imageUrls: []
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [autoFillText, setAutoFillText] = useState('');

    const handleAutoFill = () => {
        if (!autoFillText.trim()) return;

        const data = { ...formData };
        const text = autoFillText;

        // Mandating separators for common words to avoid false positives inside sentences
        const fieldMappings = {
            bankName: /(?:Bank Name|Financial Institution|Lender|Institution)[:\-\.=]{1,}\s*/i,
            borrowerName: /(?:Borrower Name|Borrower[s]?|Co-Borrower|Client|Name of Borrower|Account Name)[:\-\.=]{1,}\s*/i,
            propertyType: /(?:Property Type|Type|Category|Prop Type|Asset Category)[:\-\.=]{1,}\s*/i,
            description: /(?:Description|Desc|Details|Property Details|Short Description|Property Info)[:\-\.=]{1,}\s*/i,
            location: /(?:Location|Address|Property Location|Property Address|Prop Address|Site Address|Situated at|Boundaries|North|South|East|West|GPS|Survey|Patta|Longitude|Latitude)[:\-\.=]{1,}\s*/i,
            area: /(?:Area|Building Area|Total Land Area|Property Dimensions|Dimension|Extent|Sqft|Sq\.?ft|Extent of Land|Size|Land Area|Built-up|Undivided Share)[:\-\.=]{1,}\s*/i,
            locality: /(?:Locality|Loc|Area Name|Neighborhood|Mandal|Village|Tehsil|Landmark|Near)[:\-\.=]{1,}\s*/i,
            cityName: /(?:City|Town|District|Place|State)[:\-\.=]{1,}\s*/i,
            reservePrice: /(?:Reserve Price|Price|RP|Start Price|Min Price|Base Price|Auction Price)[:\-\.=]{1,}\s*/i,
            emdAmount: /(?:EMD Amount|EMD|Earnest Money|Initial Deposit|EMD \(Rs\)|EMD Price)[:\-\.=]{1,}\s*/i,
            bidIncrement: /(?:Bid Increment|Increment|Bid Multiplier|Bid Step|Min Increment)[:\-\.=]{1,}\s*/i,
            bankContactDetails: /(?:Bank Contact Details|Authorised Officer|Contact Officer|Contact Details|Contact No|Property ID|Website|Cell|Tel|Ph|Email|Mail|In-charge)[:\-\.=]{1,}\s*/i,
            possession: /(?:Possession|Possession Type|Status of Possession|Nature of Possession)[:\-\.=]{1,}\s*/i,
            emdLastDate: /(?:EMD Last Date|Last Date of EMD|EMD Submission|EMD Submission Date|Last Date|Last date for EMD)[:\-\.=]{1,}\s*/i,
            auctionDate: /(?:Auction Start Date & Time|Auction Date & Time|Auction Date|Date of Auction|Auction Start|Start Date|Date & Time of Auction|Auction Date & Time)[:\-\.=]{1,}\s*/i,
            auctionEndDate: /(?:Auction End Date & Time|Auction End Date|Auction End|End Date|Auction Ending)[:\-\.]{1,}\s*/i
        };

        const startOfLineLabels = [
            { field: 'bankName', regex: /^Bank[:\-\.=\s]+(?=\S)/im },
            { field: 'bankContactDetails', regex: /^(?:Contact|Phone|Mobile|Ph)[:\-\.=\s]+(?=\S)/im },
            { field: 'borrowerName', regex: /^Borrower[:\-\.=\s]+(?=\S)/im },
            { field: 'area', regex: /^Area[:\-\.=\s]+(?=\S)/im },
            { field: 'location', regex: /^(?:Location|Address)[:\-\.=\s]+(?=\S)/im }
        ];

        const matches = [];
        Object.entries(fieldMappings).forEach(([field, regex]) => {
            const pattern = new RegExp(regex.source, 'gi');
            let match;
            while ((match = pattern.exec(text)) !== null) {
                matches.push({ field, index: match.index, length: match[0].length, label: match[0] });
            }
        });
        startOfLineLabels.forEach(({ field, regex }) => {
            const pattern = new RegExp(regex.source, 'gim');
            let match;
            while ((match = pattern.exec(text)) !== null) {
                matches.push({ field, index: match.index, length: match[0].length, label: match[0] });
            }
        });

        matches.sort((a, b) => a.index - b.index || b.length - a.length);
        const filteredMatches = [];
        let lastEnd = -1;
        matches.forEach(m => {
            if (m.index >= lastEnd) { filteredMatches.push(m); lastEnd = m.index + m.length; }
        });

        const extracted = {};
        for (let i = 0; i < filteredMatches.length; i++) {
            const current = filteredMatches[i];
            const next = filteredMatches[i + 1];
            let start = current.index + current.length;
            let end = next ? next.index : text.length;
            let value = text.substring(start, end).trim();

            const cleanPrefix = /^(?:Branch Office|Branch|Lender|Borrower|Address|Location|Area|Details|North|South|East|West|GPS|Survey|Patta|Website|Property ID|[:\-\*=\.\s\[\]\(\)])+/i;
            value = value.replace(cleanPrefix, '').trim();

            if (extracted[current.field]) {
                if (['bankContactDetails', 'description', 'location', 'borrowerName'].includes(current.field)) {
                    extracted[current.field] += ' | ' + value;
                }
            } else {
                extracted[current.field] = value;
            }
        }

        if (extracted.bankName) data.bankName = extracted.bankName;
        if (extracted.borrowerName) data.borrowerName = extracted.borrowerName;
        if (extracted.propertyType) data.propertyType = extracted.propertyType;
        if (extracted.description) data.description = extracted.description;
        if (extracted.location) data.location = extracted.location;
        if (extracted.area) data.area = extracted.area;
        if (extracted.locality) data.locality = extracted.locality;
        if (extracted.possession) {
            const p = extracted.possession.toLowerCase();
            if (p.includes('phys')) data.possession = 'Physical';
            else if (p.includes('symb') || p.includes('const')) data.possession = 'Symbolic';
            else data.possession = extracted.possession;
        }
        if (extracted.cityName) data.cityName = extracted.cityName.split('/')[0].split(',')[0].replace(/(?:District|City|Town|State)[:\s]*/i, '').trim();

        const parseNum = (val) => {
            if (!val) return null;
            let clean = val.replace(/,/g, '').toLowerCase();
            let mult = 1;
            if (clean.includes('lakh')) mult = 100000;
            if (clean.includes('crore') || clean.includes('cr')) mult = 10000000;
            const nm = clean.match(/(\d+(?:\.\d+)?)/);
            if (nm) {
                let n = parseFloat(nm[1]);
                if (mult > 1) n = n * mult;
                return Math.floor(n).toString();
            }
            return null;
        };
        if (extracted.reservePrice) data.reservePrice = parseNum(extracted.reservePrice);
        if (extracted.emdAmount) data.emdAmount = parseNum(extracted.emdAmount);
        if (extracted.bidIncrement) data.bidIncrement = parseNum(extracted.bidIncrement);

        const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        const parseDate = (val) => {
            if (!val) return null;
            let ds = "";
            let ts = "10:00";
            const dmy = val.match(/(\d{1,2})[./\-\s]+(\d{1,2})[./\-\s]+(\d{2,4})/);
            if (dmy) {
                let [_, d, m, y] = dmy;
                if (y.length === 2) y = "20" + y;
                ds = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
            } else {
                const mm = val.match(new RegExp(`(\\d{1,2})[./\\-\\s]+(${monthNames.join('|')})[./\\-\\s]+(\\d{2,4})`, 'i'));
                if (mm) {
                    let [_, d, m, y] = mm;
                    if (y.length === 2) y = "20" + y;
                    const mI = monthNames.indexOf(m.toLowerCase().substring(0, 3)) + 1;
                    ds = `${y}-${mI.toString().padStart(2, '0')}-${d.padStart(2, '0')}`;
                }
            }
            if (!ds) return null;
            const tm = val.match(/(\d{1,2})[:.](\d{2})(?:\s*:?\d{2})?(?:\s*([APM]{2}))?/i);
            if (tm) {
                let h = parseInt(tm[1], 10);
                const m = tm[2], mod = tm[3]?.toUpperCase();
                if (mod === 'PM' && h < 12) h += 12;
                if (mod === 'AM' && h === 12) h = 0;
                ts = `${h.toString().padStart(2, '0')}:${m.padStart(2, '0')}`;
            }
            return `${ds}T${ts}`;
        };
        if (extracted.emdLastDate) data.emdLastDate = parseDate(extracted.emdLastDate);
        if (extracted.auctionDate) data.auctionDate = parseDate(extracted.auctionDate);
        if (extracted.auctionEndDate) data.auctionEndDate = parseDate(extracted.auctionEndDate);

        if (extracted.bankContactDetails) data.bankContactDetails = extracted.bankContactDetails.replace(/[|#]+/g, ' ').trim();

        setFormData(data);
        setAutoFillText('');
        alert('Magic Auto-Fill completed! Please review the fields.');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedImages(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index]);
            return newPreviews.filter((_, i) => i !== index);
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            let finalImageUrls = [...(formData.imageUrls || [])];
            let finalNoticeUrls = [...(formData.noticeUrls || [])];

            // Upload new images if any
            if (selectedImages.length > 0) {
                for (const imgFile of selectedImages) {
                    const imgData = new FormData();
                    imgData.append('file', imgFile);
                    const imgRes = await fetch(`${API_BASE_URL}/auctions/upload`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${user.token}` },
                        body: imgData
                    });
                    if (imgRes.ok) {
                        const uploadResult = await imgRes.json();
                        finalImageUrls.push(uploadResult.url);
                    }
                }
            }

            // Upload new notices if any
            if (selectedFiles.length > 0) {
                for (const noticeFile of selectedFiles) {
                    const noticeData = new FormData();
                    noticeData.append('file', noticeFile);
                    const noticeRes = await fetch(`${API_BASE_URL}/auctions/upload`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${user.token}` },
                        body: noticeData
                    });
                    if (noticeRes.ok) {
                        const uploadResult = await noticeRes.json();
                        finalNoticeUrls.push(uploadResult.url);
                    }
                }
            }

            const dataToSubmit = {
                ...formData,
                imageUrl: finalImageUrls[0] || '', // First image as main
                imageUrls: finalImageUrls,
                noticeUrl: finalNoticeUrls[0] || '', // First notice as main
                noticeUrls: finalNoticeUrls,
                // Sanitize numbers
                reservePrice: formData.reservePrice || null,
                emdAmount: formData.emdAmount || null,
                bidIncrement: formData.bidIncrement || null
            };

            console.log("DEBUG: Posting Auction Data:", dataToSubmit);

            const url = editingAuctionId
                ? `${API_BASE_URL}/auctions/${editingAuctionId}`
                : `${API_BASE_URL}/auctions`;

            const method = editingAuctionId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify(dataToSubmit)
            });

            if (response.ok) {
                alert(editingAuctionId ? 'Auction updated successfully!' : 'Auction posted successfully!');
                setEditingAuctionId(null);
                setFormData({
                    title: '', description: '', borrowerName: '', bankName: '',
                    propertyType: '', location: '', area: '', locality: '',
                    cityName: '', reservePrice: '', emdAmount: '', bidIncrement: '',
                    emdLastDate: '', auctionDate: '', auctionEndDate: '',
                    bankContactDetails: '', possession: '', noticeUrl: '', imageUrl: '',
                    noticeUrls: [], imageUrls: []
                });
                setSelectedFiles([]);
                setSelectedImages([]);
                setImagePreviews([]);
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
                // Refresh auctions list with full admin data
                const auctRes = await fetch(`${API_BASE_URL}/auctions/admin/all`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (auctRes.ok) {
                    const auctData = await auctRes.json();
                    const sortedData = Array.isArray(auctData)
                        ? auctData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        : [];
                    setAllAuctions(sortedData);
                }
            } else if (response.status === 401) {
                alert('Session expired. Please login again.');
                logout();
            } else if (response.status === 403) {
                const errorMessage = await response.text();
                alert(errorMessage || 'Unauthorized. You may not have permission for this action.');
            } else {
                const errorData = await response.json().catch(() => ({}));
                const msg = errorData.message || errorData.error || 'Server Error';
                console.error("Post failed:", errorData);
                alert(`Failed: ${msg}`);
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
        setCurrentPage(1); // Reset page on tab change

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

        if (activeTab === 'overview' || activeTab === 'auctions' || activeTab === 'my-auctions') {
            if (user?.token) {
                fetch(`${API_BASE_URL}/auctions/admin/all`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                })
                    .then(res => {
                        if (!res.ok) {
                            console.error('Admin auction fetch failed:', res.status);
                            return [];
                        }
                        return res.json();
                    })
                    .then(data => {
                        const sortedData = Array.isArray(data)
                            ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            : [];
                        setAllAuctions(sortedData);
                    })
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

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-40 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h1 className="text-xl font-display font-black uppercase tracking-tight text-brand-dark flex items-center gap-2">
                        <ShieldCheck className="text-brand-blue w-6 h-6" /> Admin Control
                    </h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
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
                <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-3 flex justify-between items-center z-20 shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2 ml-auto">
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
                            <div className="space-y-6 max-w-4xl mx-auto">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-2xl font-display font-black tracking-tight text-brand-dark">Dashboard Overview</h2>
                                    <div className="flex items-center gap-3">
                                        <div className="relative group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search Dashboard..."
                                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all w-48"
                                            />
                                        </div>
                                        <div className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-brand-dark cursor-pointer transition-all">
                                            <Bell className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Top Row: 4 Stat Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Total Auctions', value: stats.totalAuctions, change: '+12%', icon: List, color: 'text-brand-blue', bg: 'bg-blue-50' },
                                        { label: 'Platform Users', value: stats.totalUsers, change: '+5%', icon: Users, color: 'text-brand-blue', bg: 'bg-blue-50' },
                                        { label: 'Active Listings', value: allAuctions.length, change: '+8%', icon: Zap, color: 'text-brand-blue', bg: 'bg-blue-50' },
                                        { label: 'Success Rate', value: '92%', change: '+3%', icon: Target, color: 'text-brand-blue', bg: 'bg-blue-50' }
                                    ].map((s, i) => (
                                        <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-2.5 ${s.bg} ${s.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                                                    <s.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex items-center gap-1 px-2 py-1 bg-brand-blue/10 text-brand-blue rounded-lg text-[10px] font-black">
                                                    <ArrowUpRight className="w-3 h-3" /> {s.change}
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                                            <p className="text-2xl font-display font-black text-brand-dark tracking-tight">{s.value}</p>
                                            <p className="text-[10px] text-slate-400 mt-2">vs last week</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Middle Row: Charts & Score */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Main Area Chart */}
                                    <div className="lg:col-span-8 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-base font-display font-black text-brand-dark">Property Growth</h3>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                                                    {chartRange === '7days' ? 'Daily velocity (7 Days)' :
                                                        chartRange === '30days' ? 'Daily velocity (30 Days)' :
                                                            'Monthly velocity (Full Year)'}
                                                </p>
                                            </div>
                                            <select
                                                value={chartRange}
                                                onChange={(e) => setChartRange(e.target.value)}
                                                className="text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none bg-slate-50 cursor-pointer hover:border-brand-blue/50 transition-colors"
                                            >
                                                <option value="7days">Last 7 Days</option>
                                                <option value="30days">Last 30 Days</option>
                                                <option value="12months">Yearly (Monthly)</option>
                                            </select>
                                        </div>
                                        <div className="h-[280px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart
                                                    data={(() => {
                                                        const now = new Date();
                                                        if (chartRange === '12months') {
                                                            const last12Months = [...Array(12)].map((_, i) => {
                                                                const d = new Date();
                                                                d.setMonth(d.getMonth() - i);
                                                                return {
                                                                    key: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`,
                                                                    label: d.toLocaleDateString('en-US', { month: 'short' })
                                                                };
                                                            }).reverse();

                                                            const counts = allAuctions.reduce((acc, auction) => {
                                                                const date = new Date(auction.createdAt);
                                                                const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                                                                acc[key] = (acc[key] || 0) + 1;
                                                                return acc;
                                                            }, {});

                                                            return last12Months.map(m => ({
                                                                name: m.label,
                                                                uploads: counts[m.key] || 0
                                                            }));
                                                        }

                                                        const days = chartRange === '30days' ? 30 : 7;
                                                        const lastNDays = [...Array(days)].map((_, i) => {
                                                            const d = new Date();
                                                            d.setDate(d.getDate() - i);
                                                            return d.toISOString().split('T')[0];
                                                        }).reverse();

                                                        const counts = allAuctions.reduce((acc, auction) => {
                                                            const date = auction.createdAt?.split('T')[0];
                                                            if (date) acc[date] = (acc[date] || 0) + 1;
                                                            return acc;
                                                        }, {});

                                                        return lastNDays.map(date => ({
                                                            name: new Date(date).toLocaleDateString('en-US', {
                                                                day: days === 7 ? 'numeric' : 'numeric',
                                                                month: days === 7 ? 'short' : 'short'
                                                            }),
                                                            uploads: counts[date] || 0
                                                        }));
                                                    })()}
                                                >
                                                    <defs>
                                                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#0066FF" stopOpacity={0.1} />
                                                            <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis
                                                        dataKey="name"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                                        dy={10}
                                                        interval={chartRange === '30days' ? 4 : 0}
                                                    />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'black', fontSize: '11px' }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="uploads"
                                                        stroke="#0066FF"
                                                        strokeWidth={4}
                                                        fillOpacity={1}
                                                        fill="url(#chartGradient)"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Breakdown Donut Chart */}
                                    <div className="lg:col-span-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-all">
                                        <h3 className="text-base font-display font-black text-brand-dark">Listing Breakdown</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 mb-6">Filtered by selected timeframe</p>
                                        <div className="h-[180px] w-full relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={(() => {
                                                            const filtered = allAuctions.filter(a => {
                                                                const createdDate = new Date(a.createdAt);
                                                                const now = new Date();
                                                                if (chartRange === '7days') return (now - createdDate) <= 7 * 24 * 60 * 60 * 1000;
                                                                if (chartRange === '30days') return (now - createdDate) <= 30 * 24 * 60 * 60 * 1000;
                                                                if (chartRange === '12months') return (now - createdDate) <= 365 * 24 * 60 * 60 * 1000;
                                                                return true;
                                                            });

                                                            const counts = filtered.reduce((acc, a) => {
                                                                const type = a.propertyType || 'Other';
                                                                acc[type] = (acc[type] || 0) + 1;
                                                                return acc;
                                                            }, {});
                                                            const sorted = Object.entries(counts)
                                                                .map(([name, value]) => ({ name, value }))
                                                                .sort((a, b) => b.value - a.value)
                                                                .slice(0, 4);
                                                            return sorted.length > 0 ? sorted : [{ name: 'No Data', value: 1 }];
                                                        })()}
                                                        cx="50%" cy="50%"
                                                        innerRadius={50}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {['#0066FF', '#3b82f6', '#93c5fd', '#bae6fd'].map((color, index) => (
                                                            <Cell key={`cell-${index}`} fill={color} />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <p className="text-2xl font-black text-brand-dark transition-all">
                                                    {allAuctions.filter(a => {
                                                        const createdDate = new Date(a.createdAt);
                                                        const now = new Date();
                                                        if (chartRange === '7days') return (now - createdDate) <= 7 * 24 * 60 * 60 * 1000;
                                                        if (chartRange === '30days') return (now - createdDate) <= 30 * 24 * 60 * 60 * 1000;
                                                        if (chartRange === '12months') return (now - createdDate) <= 365 * 24 * 60 * 60 * 1000;
                                                        return true;
                                                    }).length}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Selected</p>
                                            </div>
                                        </div>
                                        <div className="mt-6 space-y-3">
                                            {(() => {
                                                const filtered = allAuctions.filter(a => {
                                                    const createdDate = new Date(a.createdAt);
                                                    const now = new Date();
                                                    if (chartRange === '7days') return (now - createdDate) <= 7 * 24 * 60 * 60 * 1000;
                                                    if (chartRange === '30days') return (now - createdDate) <= 30 * 24 * 60 * 60 * 1000;
                                                    if (chartRange === '12months') return (now - createdDate) <= 365 * 24 * 60 * 60 * 1000;
                                                    return true;
                                                });
                                                const counts = filtered.reduce((acc, a) => {
                                                    const type = a.propertyType || 'Other';
                                                    acc[type] = (acc[type] || 0) + 1;
                                                    return acc;
                                                }, {});
                                                const total = filtered.length || 1;
                                                const sorted = Object.entries(counts)
                                                    .map(([name, value]) => ({ name, value }))
                                                    .sort((a, b) => b.value - a.value)
                                                    .slice(0, 3);
                                                const colors = ['bg-brand-blue', 'bg-blue-500', 'bg-blue-300'];
                                                return sorted.map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between text-[11px] font-bold">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${colors[i]}`} />
                                                            <span className="text-slate-500 truncate max-w-[100px]">{item.name}</span>
                                                        </div>
                                                        <span className="text-brand-dark uppercase tracking-widest">{Math.round((item.value / total) * 100)}%</span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* New Section: Market Insights */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* User Growth Line Chart */}
                                    <div className="lg:col-span-7 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-base font-display font-black text-brand-dark">Community Growth</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">User registration velocity</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black italic">
                                                    <Users className="w-3 h-3" /> {allUsers.length} MEMBERS
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-[220px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart
                                                    data={(() => {
                                                        const last14Days = [...Array(14)].map((_, i) => {
                                                            const d = new Date();
                                                            d.setDate(d.getDate() - i);
                                                            return d.toISOString().split('T')[0];
                                                        }).reverse();

                                                        const counts = allUsers.reduce((acc, user) => {
                                                            const date = user.createdAt?.split('T')[0] || user.dateJoined?.split('T')[0];
                                                            if (date) acc[date] = (acc[date] || 0) + 1;
                                                            return acc;
                                                        }, {});

                                                        return last14Days.map(date => ({
                                                            name: new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                                                            users: counts[date] || 0
                                                        }));
                                                    })()}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis
                                                        dataKey="name"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 800 }}
                                                        interval={2}
                                                    />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 800 }} />
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'black', fontSize: '10px' }}
                                                    />
                                                    <Line
                                                        type="stepAfter"
                                                        dataKey="users"
                                                        stroke="#0066FF"
                                                        strokeWidth={3}
                                                        dot={{ r: 4, fill: '#0066FF', strokeWidth: 2, stroke: '#fff' }}
                                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Price Segment Bar Chart */}
                                    <div className="lg:col-span-5 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                                        <h3 className="text-base font-display font-black text-brand-dark mb-1">Price Segments</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Auction distribution by Reserve Price</p>
                                        <div className="h-[220px] w-full">
                                            {(() => {
                                                const priceRanges = [
                                                    { name: '< 50L', min: 0, max: 5000000, color: '#93c5fd' },
                                                    { name: '50L - 1Cr', min: 5000000, max: 10000000, color: '#60a5fa' },
                                                    { name: '1Cr - 5Cr', min: 10000000, max: 50000000, color: '#3b82f6' },
                                                    { name: '5Cr+', min: 50000000, max: Infinity, color: '#0066FF' }
                                                ];
                                                const priceData = priceRanges.map(r => ({
                                                    ...r,
                                                    count: allAuctions.filter(a => {
                                                        const price = Number(a.reservePrice);
                                                        return price >= r.min && price < r.max;
                                                    }).length
                                                }));
                                                return (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={priceData} layout="vertical" margin={{ left: 20 }}>
                                                            <XAxis type="number" hide />
                                                            <YAxis
                                                                dataKey="name"
                                                                type="category"
                                                                axisLine={false}
                                                                tickLine={false}
                                                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                                                            />
                                                            <Tooltip
                                                                cursor={{ fill: '#f8fafc' }}
                                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'black', fontSize: '10px' }}
                                                            />
                                                            <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20}>
                                                                {priceData.map((entry, idx) => (
                                                                    <Cell key={`cell-${idx}`} fill={entry.color} />
                                                                ))}
                                                            </Bar>
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Strategic Insights */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
                                    {/* Top Cities Distribution */}
                                    <div className="lg:col-span-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-base font-display font-black text-brand-dark">Geographic Reach</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Top cities by auction volume</p>
                                            </div>
                                            <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="h-[250px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={(() => {
                                                        const cityCounts = allAuctions.reduce((acc, a) => {
                                                            const city = a.cityName || 'Unknown';
                                                            acc[city] = (acc[city] || 0) + 1;
                                                            return acc;
                                                        }, {});
                                                        return Object.entries(cityCounts)
                                                            .map(([name, count]) => ({ name, count }))
                                                            .sort((a, b) => b.count - a.count)
                                                            .slice(0, 6);
                                                    })()}
                                                    margin={{ bottom: 20 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis
                                                        dataKey="name"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                                                    />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                                                    <Tooltip
                                                        cursor={{ fill: '#f8fafc' }}
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'black', fontSize: '10px' }}
                                                    />
                                                    <Bar dataKey="count" fill="#0066FF" radius={[8, 8, 0, 0]} barSize={35} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Bank Participation Radar-like Bar Chart */}
                                    <div className="lg:col-span-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-base font-display font-black text-brand-dark">Banking Partners</h3>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional distribution</p>
                                            </div>
                                            <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl">
                                                <Briefcase className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {(() => {
                                                const bankCounts = allAuctions.reduce((acc, a) => {
                                                    const bank = a.bankName || 'Other';
                                                    acc[bank] = (acc[bank] || 0) + 1;
                                                    return acc;
                                                }, {});
                                                const total = allAuctions.length || 1;
                                                return Object.entries(bankCounts)
                                                    .map(([name, count]) => ({ name, count }))
                                                    .sort((a, b) => b.count - a.count)
                                                    .slice(0, 5)
                                                    .map((bank, i) => (
                                                        <div key={i} className="group">
                                                            <div className="flex justify-between items-center mb-1.5">
                                                                <span className="text-xs font-black text-brand-dark group-hover:text-brand-blue transition-colors line-clamp-1">{bank.name}</span>
                                                                <span className="text-[10px] font-black text-slate-400">{bank.count} Assets</span>
                                                            </div>
                                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-brand-blue transition-all duration-1000 ease-out"
                                                                    style={{ width: `${(bank.count / total) * 100}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ));
                                            })()}
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-slate-100">
                                            <div className="flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 overflow-hidden">
                                                            BK
                                                        </div>
                                                    ))}
                                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-dark flex items-center justify-center text-[8px] font-black text-white">+2</div>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Institutions</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row: Recent Activities & Progress */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 font-sans">
                                    {/* Recent Auctions Feed */}
                                    <div className="lg:col-span-8 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-base font-display font-black text-brand-dark">Recent Submissions</h3>
                                            <button onClick={() => setActiveTab('auctions')} className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline">View All</button>
                                        </div>
                                        <div className="space-y-4">
                                            {allAuctions.slice(0, 5).map(auction => (
                                                <div key={auction.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-all group cursor-pointer" onClick={() => navigate(`/auctions/${auction.id}`)}>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 group-hover:bg-white group-hover:border-brand-blue/30 group-hover:text-brand-blue transition-all">
                                                            <Building2 className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-brand-dark line-clamp-1">{auction.title}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[10px] text-slate-400 font-bold uppercase">{auction.cityName}</span>
                                                                <span className="text-slate-200">•</span>
                                                                <span className="text-[10px] font-black text-brand-blue uppercase">{auction.propertyType}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-black text-brand-dark">₹{auction.reservePrice ? Number(auction.reservePrice).toLocaleString('en-IN') : '---'}</p>
                                                        <div className="flex items-center justify-end gap-1 mt-0.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                                                            <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Active</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Score Card & Activity Feed */}
                                    <div className="lg:col-span-4 space-y-6">
                                        {/* Status Score Card */}
                                        <div className="bg-brand-dark p-6 rounded-[2rem] text-white overflow-hidden relative">
                                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Property Score</h3>
                                                <Activity className="w-4 h-4 text-blue-400" />
                                            </div>
                                            <div className="flex items-baseline justify-between mb-4">
                                                <p className="text-3xl font-display font-black tracking-tight">Excellent</p>
                                                <p className="text-sm font-bold text-blue-400">92%</p>
                                            </div>
                                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                                                <div className="w-[92%] h-full bg-brand-blue rounded-full shadow-[0_0_10px_rgba(0,102,255,0.5)]" />
                                            </div>
                                            <button
                                                onClick={() => setActiveTab('post-auction')}
                                                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                            >
                                                Boost Platform Score
                                            </button>
                                        </div>

                                        {/* Activity Log */}
                                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                                            <h3 className="text-base font-display font-black text-brand-dark mb-6">Recent Activity</h3>
                                            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                                {[
                                                    { label: 'New Auction Uploaded', time: '10:45 AM', color: 'text-blue-500' },
                                                    { label: 'User Role Updated', time: '09:12 AM', color: 'text-brand-blue' },
                                                    { label: 'Notice File Processed', time: 'Yesterday', color: 'text-blue-400' }
                                                ].map((log, i) => (
                                                    <div key={i} className="flex gap-4 relative">
                                                        <div className={`w-6 h-6 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center z-10 ${log.color}`}>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-brand-dark leading-none">{log.label}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{log.time}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
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

                                        {/* Row 7: Bank Contact */}
                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Bank Contact Details</label>
                                                <input
                                                    type="text"
                                                    name="bankContactDetails"
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                                    placeholder="Enter bank contact persons, phone numbers, or emails"
                                                    value={formData.bankContactDetails}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Row 8: Property Image & Auction PDF */}
                                        <div className="grid grid-cols-1 gap-8 bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200">
                                            {/* Property Images Section */}
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <label className="block text-xs font-black text-brand-dark uppercase tracking-[0.15em]">Property Images</label>
                                                        <p className="text-[10px] text-slate-400 font-bold mt-1">First image will be the display photo. Others appear in gallery.</p>
                                                    </div>
                                                    <div className="relative">
                                                        <button type="button" className="px-4 py-2 bg-brand-blue text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-dark transition-all shadow-sm flex items-center gap-2">
                                                            <Plus className="w-3 h-3" /> Add Image
                                                        </button>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            onChange={handleImageChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                                    {/* Main Display Image Preview */}
                                                    <div className="lg:col-span-12">
                                                        {(imagePreviews.length > 0 || (formData.imageUrls && formData.imageUrls.length > 0)) ? (
                                                            <div className="space-y-4">
                                                                <div className="relative group aspect-[21/9] rounded-2xl overflow-hidden border border-slate-200 bg-white">
                                                                    <img
                                                                        src={imagePreviews[0] || getFileUrl(formData.imageUrls[0])}
                                                                        className="w-full h-full object-cover"
                                                                        alt="Main Preview"
                                                                    />
                                                                    <div className="absolute top-4 left-4 px-3 py-1 bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                                        Main Display
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImage(0)}
                                                                        className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>

                                                                {/* Remaining Images Grid */}
                                                                {(imagePreviews.length > 1 || (formData.imageUrls && formData.imageUrls.length > 1)) && (
                                                                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                                                        {/* Handle Previews for newly selected images beyond the first one */}
                                                                        {imagePreviews.slice(1).map((preview, idx) => (
                                                                            <div key={`new-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white">
                                                                                <img src={preview} className="w-full h-full object-cover" alt="Other Preview" />
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeImage(idx + 1)}
                                                                                    className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                                                                                >
                                                                                    <X size={12} />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                        {/* Handle existing imageUrls from backend beyond the first one if editing */}
                                                                        {formData.imageUrls && formData.imageUrls.slice(1).map((url, idx) => (
                                                                            <div key={`old-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white">
                                                                                <img src={getFileUrl(url)} className="w-full h-full object-cover" alt="Saved Preview" />
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setFormData(p => ({ ...p, imageUrls: p.imageUrls.filter((_, i) => i !== idx + 1) }))}
                                                                                    className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                                                                                >
                                                                                    <X size={12} />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="relative group aspect-[21/9] rounded-2xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center hover:border-brand-blue/30 transition-all cursor-pointer">
                                                                <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No images selected</p>
                                                                <p className="text-[10px] text-slate-300 font-bold mt-1">Images are optional</p>
                                                                <input
                                                                    type="file"
                                                                    multiple
                                                                    accept="image/*"
                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                    onChange={handleImageChange}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Auction Notice Section */}
                                            <div className="pt-6 border-t border-slate-200 border-dashed">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <label className="block text-xs font-black text-brand-dark uppercase tracking-[0.15em]">Auction Notice (PDF/Image)</label>
                                                        <p className="text-[10px] text-slate-400 font-bold mt-1">Upload multiple notices, certificates, or property documents.</p>
                                                    </div>
                                                    <div className="relative">
                                                        <button type="button" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-dark transition-all shadow-sm flex items-center gap-2">
                                                            <FilePlus className="w-3 h-3" /> Add Doc
                                                        </button>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            onChange={(e) => setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)])}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    {/* Existing Docs */}
                                                    {formData.noticeUrls && formData.noticeUrls.map((url, idx) => (
                                                        <div key={`saved-doc-${idx}`} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-blue-50 text-brand-blue rounded-lg">
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight truncate max-w-[200px]">SAVED_NOTICE_{idx + 1}</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData(p => ({ ...p, noticeUrls: p.noticeUrls.filter((_, i) => i !== idx) }))}
                                                                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {/* New Selected Docs */}
                                                    {selectedFiles.map((file, idx) => (
                                                        <div key={`new-doc-${idx}`} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-brand-blue/20 animate-in fade-in slide-in-from-right-4 duration-300">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-brand-blue text-white rounded-lg">
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <span className="text-[11px] font-black text-brand-blue uppercase tracking-tight truncate max-w-[200px]">{file.name}</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                                                                className="p-1.5 text-brand-blue/50 hover:text-red-500 rounded-lg"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {(!selectedFiles.length && (!formData.noticeUrls || !formData.noticeUrls.length)) && (
                                                        <div className="py-4 text-center">
                                                            <FileText className="w-8 h-8 text-slate-200 mx-auto mb-1" />
                                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No documents added</p>
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
                                                            title: '', description: '', borrowerName: '', bankName: '',
                                                            propertyType: '', location: '', area: '', locality: '',
                                                            cityName: '', reservePrice: '', emdAmount: '', bidIncrement: '',
                                                            emdLastDate: '', auctionDate: '', auctionEndDate: '',
                                                            bankContactDetails: '', possession: '', noticeUrl: '', imageUrl: '',
                                                            noticeUrls: [], imageUrls: []
                                                        });
                                                        setSelectedFiles([]);
                                                        setSelectedImages([]);
                                                        setImagePreviews([]);
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
                                            {allUsers
                                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                .map(u => (
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
                                                                    ? 'bg-blue-50 text-brand-blue border-blue-200 focus:ring-blue-200'
                                                                    : 'bg-slate-50 text-slate-700 border-slate-200 focus:ring-brand-blue/20 hover:bg-slate-100'
                                                                    }`}
                                                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 7l5 5 5-5'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.25rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em', paddingRight: '1.75rem' }}
                                                            >
                                                                <option value="USER" className="font-bold text-slate-700">USER</option>
                                                                <option value="ADMIN" className="font-bold text-brand-blue">ADMIN</option>
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

                                {allUsers.length > itemsPerPage && (
                                    <div className="flex justify-center items-center gap-2 py-6">
                                        <button
                                            onClick={() => setCurrentPage(1)}
                                            disabled={currentPage === 1}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                        >
                                            <ChevronsLeft size={14} />
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                        >
                                            <ChevronLeft size={14} />
                                        </button>

                                        {(() => {
                                            const totalPages = Math.ceil(allUsers.length / itemsPerPage);
                                            const pages = [];
                                            const startPage = Math.max(1, currentPage - 2);
                                            const endPage = Math.min(totalPages, startPage + 4);
                                            const adjustedStart = Math.max(1, endPage - 4);

                                            for (let i = adjustedStart; i <= endPage; i++) {
                                                pages.push(
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentPage(i)}
                                                        className={`w-8 h-8 rounded-lg text-xs font-black border transition-all ${currentPage === i
                                                            ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20'
                                                            : 'bg-white text-slate-500 border-slate-200 hover:border-brand-blue hover:text-brand-blue'
                                                            }`}
                                                    >
                                                        {i}
                                                    </button>
                                                );
                                            }
                                            return pages;
                                        })()}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(allUsers.length / itemsPerPage)))}
                                            disabled={currentPage === Math.ceil(allUsers.length / itemsPerPage)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(Math.ceil(allUsers.length / itemsPerPage))}
                                            disabled={currentPage === Math.ceil(allUsers.length / itemsPerPage)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                        >
                                            <ChevronsRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'auctions' && (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-display font-black uppercase tracking-tight text-brand-dark">All Auctions</h2>
                                    <p className="text-sm text-slate-500 mt-1">Master catalog of all property listings.</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    {/* Search & Filter Bar */}
                                    <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-wrap gap-3">
                                        <div className="relative flex-1 min-w-[200px]">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by title, borrower, or city..."
                                                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all bg-white"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <select
                                                className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-blue"
                                                value={filterCity}
                                                onChange={(e) => setFilterCity(e.target.value)}
                                            >
                                                <option value="">All Cities</option>
                                                {[...new Set(allAuctions.map(a => a.cityName).filter(Boolean))].sort().map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                            <select
                                                className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-blue"
                                                value={filterType}
                                                onChange={(e) => setFilterType(e.target.value)}
                                            >
                                                <option value="">All Types</option>
                                                {[...new Set(allAuctions.map(a => a.propertyType).filter(Boolean))].sort().map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50/80 border-b border-slate-100">
                                            <tr>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Property Details</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Borrower & Location</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank & Contact</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Financials</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Docs</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {(() => {
                                                const filteredAuctions = allAuctions.filter(a => {
                                                    const matchesSearch = !searchTerm ||
                                                        [a.title, a.borrowerName, a.cityName, a.bankName, a.locality].some(field =>
                                                            field?.toLowerCase().includes(searchTerm.toLowerCase())
                                                        );
                                                    const matchesCity = !filterCity || a.cityName === filterCity;
                                                    const matchesType = !filterType || a.propertyType === filterType;
                                                    return matchesSearch && matchesCity && matchesType;
                                                });

                                                return filteredAuctions
                                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                    .map(auction => (
                                                        <tr key={auction.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-5 py-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                                                        {auction.imageUrl ? (
                                                                            <img src={getFileUrl(auction.imageUrl)} className="w-full h-full object-cover" alt="Thumb" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                                <ImageIcon size={14} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="font-bold text-sm text-slate-900 truncate max-w-[200px]">{auction.title}</p>
                                                                        <p className="text-[11px] font-black text-brand-blue uppercase tracking-wider mt-0.5">{auction.propertyType}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <p className="font-bold text-xs text-slate-700">{auction.borrowerName || 'N/A'}</p>
                                                                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {auction.cityName}</p>
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <p className="font-bold text-xs text-slate-700">{auction.bankName}</p>
                                                                <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{auction.bankContactDetails || 'No Contact'}</p>
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <p className="font-black text-sm text-brand-dark">₹{auction.reservePrice}</p>
                                                                <p className="text-[10px] text-slate-400 mt-0.5">{new Date(auction.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                                                            </td>
                                                            <td className="px-5 py-3 text-center">
                                                                <div className="flex items-center justify-center gap-1">
                                                                    {(auction.noticeUrls && auction.noticeUrls.length > 0) ? (
                                                                        auction.noticeUrls.map((url, idx) => (
                                                                            <a
                                                                                key={idx}
                                                                                href={getFileUrl(url)}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="p-1.5 text-brand-blue hover:bg-blue-50 rounded-lg transition-colors inline-block"
                                                                                title={`Notice ${idx + 1}`}
                                                                            >
                                                                                <FileDown className="w-3.5 h-3.5" />
                                                                            </a>
                                                                        ))
                                                                    ) : auction.noticeUrl ? (
                                                                        <a
                                                                            href={getFileUrl(auction.noticeUrl)}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="p-1.5 text-brand-blue hover:bg-blue-50 rounded-lg transition-colors inline-block"
                                                                            title="View Notice"
                                                                        >
                                                                            <FileDown className="w-3.5 h-3.5" />
                                                                        </a>
                                                                    ) : (
                                                                        <span className="text-[10px] text-slate-300 italic">No File</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3 text-right">
                                                                <button
                                                                    onClick={() => navigate(`/auctions/${auction.id}`)}
                                                                    className="p-2 text-slate-400 hover:text-brand-blue hover:bg-slate-50 rounded-lg transition-all"
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ));
                                            })()}
                                        </tbody>
                                    </table>
                                </div>

                                {(() => {
                                    const filteredAuctions = allAuctions.filter(a => {
                                        const matchesSearch = !searchTerm ||
                                            [a.title, a.borrowerName, a.cityName, a.bankName, a.locality].some(field =>
                                                field?.toLowerCase().includes(searchTerm.toLowerCase())
                                            );
                                        const matchesCity = !filterCity || a.cityName === filterCity;
                                        const matchesType = !filterType || a.propertyType === filterType;
                                        return matchesSearch && matchesCity && matchesType;
                                    });
                                    if (filteredAuctions.length === 0) return (
                                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                                            No auctions found matching your search.
                                        </div>
                                    );
                                    if (filteredAuctions.length <= itemsPerPage) return null;

                                    const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage);
                                    const pages = [];
                                    const startPage = Math.max(1, currentPage - 2);
                                    const endPage = Math.min(totalPages, startPage + 4);
                                    const adjustedStart = Math.max(1, endPage - 4);

                                    return (
                                        <div className="flex justify-center items-center gap-2 py-6">
                                            <button
                                                onClick={() => setCurrentPage(1)}
                                                disabled={currentPage === 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                            >
                                                <ChevronsLeft size={14} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                            >
                                                <ChevronLeft size={14} />
                                            </button>

                                            {(() => {
                                                for (let i = adjustedStart; i <= endPage; i++) {
                                                    pages.push(
                                                        <button
                                                            key={i}
                                                            onClick={() => setCurrentPage(i)}
                                                            className={`w-8 h-8 rounded-lg text-xs font-black border transition-all ${currentPage === i
                                                                ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20'
                                                                : 'bg-white text-slate-500 border-slate-200 hover:border-brand-blue hover:text-brand-blue'
                                                                }`}
                                                        >
                                                            {i}
                                                        </button>
                                                    );
                                                }
                                                return pages;
                                            })()}

                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                disabled={currentPage === totalPages}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                            >
                                                <ChevronsRight size={14} />
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {activeTab === 'my-auctions' && (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-display font-black uppercase tracking-tight text-brand-dark">Admin Auctions</h2>
                                    <p className="text-sm text-slate-500 mt-1">Manage all platform listings. You have full edit access to every auction.</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    {/* Search & Filter Bar */}
                                    <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-wrap gap-3">
                                        <div className="relative flex-1 min-w-[200px]">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search your postings..."
                                                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all bg-white"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <select
                                                className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-blue"
                                                value={filterCity}
                                                onChange={(e) => setFilterCity(e.target.value)}
                                            >
                                                <option value="">All Cities</option>
                                                {[...new Set(allAuctions.map(a => a.cityName).filter(Boolean))].sort().map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                            <select
                                                className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-blue"
                                                value={filterType}
                                                onChange={(e) => setFilterType(e.target.value)}
                                            >
                                                <option value="">All Types</option>
                                                {[...new Set(allAuctions.map(a => a.propertyType).filter(Boolean))].sort().map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50/80 border-b border-slate-100">
                                            <tr>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Property Details</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Borrower & Location</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank & Contact</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Financials</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Docs</th>
                                                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {(() => {
                                                // Show ALL auctions in the management tab for admins
                                                const myAuctions = allAuctions;
                                                const filteredMyAuctions = myAuctions.filter(a => {
                                                    const matchesSearch = !searchTerm ||
                                                        [a.title, a.borrowerName, a.cityName, a.bankName, a.locality].some(field =>
                                                            field?.toLowerCase().includes(searchTerm.toLowerCase())
                                                        );
                                                    const matchesCity = !filterCity || a.cityName === filterCity;
                                                    const matchesType = !filterType || a.propertyType === filterType;
                                                    return matchesSearch && matchesCity && matchesType;
                                                });

                                                return filteredMyAuctions
                                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                                    .map(auction => (
                                                        <tr key={auction.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-5 py-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                                                        {auction.imageUrl ? (
                                                                            <img src={getFileUrl(auction.imageUrl)} className="w-full h-full object-cover" alt="Thumb" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                                <ImageIcon size={14} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="font-bold text-sm text-slate-900 truncate max-w-[200px]">{auction.title}</p>
                                                                        <p className="text-[11px] text-brand-blue font-black tracking-wide uppercase mt-0.5">{auction.propertyType}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <p className="font-bold text-xs text-slate-700">{auction.borrowerName || 'N/A'}</p>
                                                                <p className="text-[10px] text-slate-500 truncate max-w-[150px] flex items-center gap-1 mt-0.5"><MapPin className="w-2.5 h-2.5" /> {auction.location || auction.cityName}</p>
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <p className="font-bold text-xs text-slate-700">{auction.bankName}</p>
                                                                <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{auction.bankContactDetails || 'No Contact'}</p>
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <p className="font-black text-sm text-brand-dark">₹{auction.reservePrice}</p>
                                                            </td>
                                                            <td className="px-5 py-3 text-center">
                                                                <div className="flex items-center justify-center gap-1">
                                                                    {(auction.noticeUrls && auction.noticeUrls.length > 0) ? (
                                                                        auction.noticeUrls.map((url, idx) => (
                                                                            <a
                                                                                key={idx}
                                                                                href={getFileUrl(url)}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="p-1.5 text-brand-blue hover:bg-blue-50 rounded-lg transition-colors inline-block"
                                                                                title={`Notice ${idx + 1}`}
                                                                            >
                                                                                <FileDown className="w-3.5 h-3.5" />
                                                                            </a>
                                                                        ))
                                                                    ) : auction.noticeUrl ? (
                                                                        <a
                                                                            href={getFileUrl(auction.noticeUrl)}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="p-1.5 text-brand-blue hover:bg-blue-50 rounded-lg transition-colors inline-block"
                                                                            title="View Notice"
                                                                        >
                                                                            <FileDown className="w-3.5 h-3.5" />
                                                                        </a>
                                                                    ) : (
                                                                        <span className="text-[10px] text-slate-300 italic">No File</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3 text-right">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <button
                                                                        onClick={() => navigate(`/auctions/${auction.id}`)}
                                                                        className="p-2 text-slate-400 hover:text-brand-blue hover:bg-slate-50 rounded-lg transition-all"
                                                                        title="View Details"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
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
                                                                                possession: auction.possession || '',
                                                                                noticeUrl: auction.noticeUrl || '',
                                                                                imageUrl: auction.imageUrl || '',
                                                                                noticeUrls: auction.noticeUrls || (auction.noticeUrl ? [auction.noticeUrl] : []),
                                                                                imageUrls: auction.imageUrls || (auction.imageUrl ? [auction.imageUrl] : [])
                                                                            });
                                                                            setImagePreviews([]);
                                                                            setSelectedFiles([]);
                                                                            setSelectedImages([]);
                                                                            setActiveTab('post-auction');
                                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                        }}
                                                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                                                        title="Edit Auction"
                                                                    >
                                                                        <FileEdit className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteAuction(auction.id)}
                                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                        title="Delete Auction"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ));
                                            })()}
                                            {(() => {
                                                const myAuctions = allAuctions;
                                                const filteredMyAuctions = myAuctions.filter(a => {
                                                    const matchesSearch = !searchTerm ||
                                                        [a.title, a.borrowerName, a.cityName, a.bankName, a.locality].some(field =>
                                                            field?.toLowerCase().includes(searchTerm.toLowerCase())
                                                        );
                                                    const matchesCity = !filterCity || a.cityName === filterCity;
                                                    const matchesType = !filterType || a.propertyType === filterType;
                                                    return matchesSearch && matchesCity && matchesType;
                                                });
                                                if (filteredMyAuctions.length === 0 && myAuctions.length > 0) return (
                                                    <tr>
                                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium text-sm">
                                                            No matches found for your search.
                                                        </td>
                                                    </tr>
                                                );
                                                if (myAuctions.length === 0) return (
                                                    <tr>
                                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium text-sm">
                                                            No auctions found in the database.
                                                            <button onClick={() => setActiveTab('post-auction')} className="text-brand-blue font-bold ml-2 hover:underline">Post one now</button>
                                                        </td>
                                                    </tr>
                                                );
                                                return null;
                                            })()}
                                        </tbody>
                                    </table>
                                </div>

                                {(() => {
                                    const myAuctions = allAuctions;
                                    const filteredMyAuctions = myAuctions.filter(a => {
                                        const matchesSearch = !searchTerm ||
                                            [a.title, a.borrowerName, a.cityName, a.bankName, a.locality].some(field =>
                                                field?.toLowerCase().includes(searchTerm.toLowerCase())
                                            );
                                        const matchesCity = !filterCity || a.cityName === filterCity;
                                        const matchesType = !filterType || a.propertyType === filterType;
                                        return matchesSearch && matchesCity && matchesType;
                                    });
                                    if (filteredMyAuctions.length <= itemsPerPage) return null;

                                    const totalPages = Math.ceil(filteredMyAuctions.length / itemsPerPage);
                                    const pages = [];
                                    const startPage = Math.max(1, currentPage - 2);
                                    const endPage = Math.min(totalPages, startPage + 4);
                                    const adjustedStart = Math.max(1, endPage - 4);

                                    return (
                                        <div className="flex justify-center items-center gap-2 py-6">
                                            <button
                                                onClick={() => setCurrentPage(1)}
                                                disabled={currentPage === 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                            >
                                                <ChevronsLeft size={14} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                            >
                                                <ChevronLeft size={14} />
                                            </button>

                                            {(() => {
                                                for (let i = adjustedStart; i <= endPage; i++) {
                                                    pages.push(
                                                        <button
                                                            key={i}
                                                            onClick={() => setCurrentPage(i)}
                                                            className={`w-8 h-8 rounded-lg text-xs font-black border transition-all ${currentPage === i
                                                                ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20'
                                                                : 'bg-white text-slate-500 border-slate-200 hover:border-brand-blue hover:text-brand-blue'
                                                                }`}
                                                        >
                                                            {i}
                                                        </button>
                                                    );
                                                }
                                                return pages;
                                            })()}

                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                disabled={currentPage === totalPages}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                                            >
                                                <ChevronsRight size={14} />
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;