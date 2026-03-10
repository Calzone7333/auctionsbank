import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuctionCard from '../components/AuctionCard';
import FilterSidebar from '../components/FilterSidebar';
import { Search, ArrowUpDown, LayoutGrid, List, ChevronDown, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
        <div className="h-32 bg-slate-100" />
        <div className="p-4 space-y-3">
            <div className="flex gap-2">
                <div className="h-5 w-20 bg-slate-100 rounded-full" />
                <div className="h-5 w-24 bg-slate-100 rounded-full" />
            </div>
            <div className="h-4 bg-slate-100 rounded-lg w-4/5" />
            <div className="h-4 bg-slate-100 rounded-lg w-3/5" />
            <div className="h-px bg-slate-50 my-2" />
            <div className="flex justify-between items-end">
                <div className="h-6 w-20 bg-slate-100 rounded-lg" />
                <div className="h-5 w-16 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-9 bg-slate-100 rounded-xl mt-2" />
        </div>
    </div>
);

const Auctions = () => {
    const [searchParams] = useSearchParams();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedBanks, setSelectedBanks] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [priceSort, setPriceSort] = useState('');

    const [openSections, setOpenSections] = useState({ city: true, bank: true, type: true });
    const [viewMode, setViewMode] = useState('list');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const auctionsPerPage = 10;

    const toggleSection = (section) =>
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));

    useEffect(() => {
        const searchQuery = searchParams.get('search');
        const typeQuery = searchParams.get('type');
        const cityQuery = searchParams.get('city');
        if (searchQuery) setSearchTerm(searchQuery);
        if (typeQuery) setSelectedTypes([typeQuery]);
        if (cityQuery) setSelectedCities([cityQuery]);
    }, [searchParams]);

    useEffect(() => {
        setLoading(true);
        const headers = {};
        const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
        if (storedUser) {
             try {
                 const userData = JSON.parse(storedUser);
                 if (userData.token) headers['Authorization'] = `Bearer ${userData.token}`;
             } catch(e) {}
        }

        fetch(`${API_BASE_URL}/auctions`, { headers })
            .then(res => {
                if (res.status === 401) return []; // Access denied
                return res.json();
            })
            .then(data => { setAuctions(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(err => { console.error('Error fetching auctions:', err); setAuctions([]); setLoading(false); });
    }, []);

    const cities = useMemo(() => [...new Set(auctions.filter(a => a?.cityName).map(a => a.cityName))].sort(), [auctions]);
    const banks = useMemo(() => [...new Set(auctions.filter(a => a?.bankName).map(a => a.bankName))].sort(), [auctions]);
    const types = useMemo(() => [...new Set(auctions.filter(a => a?.propertyType).map(a => a.propertyType))].sort(), [auctions]);

    const handleCheckboxChange = (value, state, setState) => {
        setState(state.includes(value) ? state.filter(i => i !== value) : [...state, value]);
    };

    const filteredAuctions = useMemo(() => {
        return auctions
            .filter(a => {
                const q = searchTerm.toLowerCase();
                const matchesSearch =
                    (a.title?.toLowerCase() || '').includes(q) ||
                    (a.cityName?.toLowerCase() || '').includes(q) ||
                    (a.bankName?.toLowerCase() || '').includes(q);
                return matchesSearch
                    && (selectedCities.length === 0 || selectedCities.includes(a.cityName))
                    && (selectedBanks.length === 0 || selectedBanks.includes(a.bankName))
                    && (selectedTypes.length === 0 || selectedTypes.includes(a.propertyType));
            })
            .sort((a, b) => {
                if (priceSort === 'asc') return a.reservePrice - b.reservePrice;
                if (priceSort === 'desc') return b.reservePrice - a.reservePrice;
                // Default sort: Newest first (descending by ID/_id)
                return (b._id || b.id || 0) > (a._id || a.id || 0) ? 1 : -1;
            });
    }, [auctions, searchTerm, selectedCities, selectedBanks, selectedTypes, priceSort]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCities, selectedBanks, selectedTypes, priceSort]);

    const clearFilters = () => {
        setSearchTerm(''); setSelectedCities([]); setSelectedBanks([]); setSelectedTypes([]); setPriceSort('');
    };

    const activeFiltersCount = selectedCities.length + selectedBanks.length + selectedTypes.length + (searchTerm ? 1 : 0);

    return (
        <div className="bg-[#fbfdf2] min-h-screen font-sans border-t border-brand-blue/10">
            {/* ── Page Header ── */}
            <div className="bg-white border-b border-slate-100 py-16 text-center px-4">
                <div className="max-w-3xl mx-auto">
                    <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.4em] mb-4">Discover Opportunities</p>
                    <div className="relative inline-block mb-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-brand-dark tracking-tight leading-[1.1] uppercase relative z-10">
                            Bank Auctions Central
                        </h1>
                        <div className="absolute w-52 h-3 bg-brand-blue/30 -bottom-2 left-1/2 transform -translate-x-1/2 -rotate-2 z-0 rounded-full"></div>
                        <div className="absolute w-40 h-2 bg-brand-blue/20 -bottom-4 left-1/2 transform -translate-x-1/2 rotate-1 z-0 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32">

                {/* Toolbar Card */}
                <div className="bg-white rounded-[20px] shadow-xl shadow-slate-200/50 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-20 border border-slate-100">
                    {/* Left: count + mobile filter toggle */}
                    <div className="flex items-center gap-4 w-full sm:w-auto pl-2">
                        <button
                            onClick={() => setMobileFilterOpen(v => !v)}
                            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-brand-dark rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-brand-blue transition-all shadow-md"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <span className="bg-white text-brand-dark text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center ml-1">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                        <div>
                            <p className="font-black text-brand-dark text-[14px] uppercase tracking-wider">
                                {loading ? 'Loading...' : `${filteredAuctions.length} Properties`}
                            </p>
                            {activeFiltersCount > 0 && (
                                <button onClick={clearFilters} className="flex items-center gap-1 text-[10px] text-red-500 font-bold hover:text-red-700 transition-colors uppercase tracking-widest mt-1">
                                    <X className="w-3 h-3" /> Clear Active Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: sort + view mode */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        {/* Sort */}
                        <div className="relative flex-1 sm:flex-none sm:w-56">
                            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-blue pointer-events-none" />
                            <select
                                className="appearance-none w-full bg-slate-50 border border-slate-200 text-[11px] font-black uppercase tracking-widest text-brand-dark py-3.5 pl-11 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all cursor-pointer shadow-sm hover:border-brand-blue/50"
                                value={priceSort}
                                onChange={(e) => setPriceSort(e.target.value)}
                            >
                                <option value="">Sort: Relevant</option>
                                <option value="asc">Price: Low → High</option>
                                <option value="desc">Price: High → Low</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-blue pointer-events-none" />
                        </div>

                        {/* View toggle */}
                        <div className="flex bg-slate-100 rounded-xl p-1.5 border border-slate-200 gap-1 shadow-inner">
                            {[['grid', LayoutGrid], ['list', List]].map(([mode, Icon]) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === mode
                                        ? 'bg-brand-dark text-white shadow-md'
                                        : 'text-slate-500 hover:text-brand-dark hover:bg-slate-200'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ── Sidebar ── */}
                    {/* Desktop */}
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <FilterSidebar
                            activeFiltersCount={activeFiltersCount}
                            clearFilters={clearFilters}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            openSections={openSections}
                            toggleSection={toggleSection}
                            cities={cities} selectedCities={selectedCities}
                            handleCheckboxChange={handleCheckboxChange} setSelectedCities={setSelectedCities}
                            banks={banks} selectedBanks={selectedBanks} setSelectedBanks={setSelectedBanks}
                            types={types} selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes}
                        />
                    </div>

                    {/* Mobile drawer */}
                    {mobileFilterOpen && (
                        <div className="lg:hidden">
                            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileFilterOpen(false)} />
                            <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 overflow-y-auto p-4 shadow-2xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-brand-dark">Filters</span>
                                    <button onClick={() => setMobileFilterOpen(false)}>
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                                <FilterSidebar
                                    activeFiltersCount={activeFiltersCount}
                                    clearFilters={clearFilters}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    openSections={openSections}
                                    toggleSection={toggleSection}
                                    cities={cities} selectedCities={selectedCities}
                                    handleCheckboxChange={handleCheckboxChange} setSelectedCities={setSelectedCities}
                                    banks={banks} selectedBanks={selectedBanks} setSelectedBanks={setSelectedBanks}
                                    types={types} selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes}
                                />
                            </div>
                        </div>
                    )}

                    {/* ── Grid / List ── */}
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <div className={`grid gap-5 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}>
                                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : filteredAuctions.length > 0 ? (
                            <div className={`grid ${viewMode === 'list' ? 'grid-cols-1 gap-0 bg-white shadow-sm' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'}`}>
                                {filteredAuctions.slice((currentPage - 1) * auctionsPerPage, currentPage * auctionsPerPage).map((auction, i) => (
                                    <motion.div
                                        key={auction.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: i * 0.04 }}
                                        className="h-full"
                                    >
                                        <AuctionCard auction={auction} viewMode={viewMode} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-100 py-24 flex flex-col items-center text-center px-6">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                                    <Search className="w-7 h-7 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight mb-2">No Properties Found</h3>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed font-medium">
                                    We couldn't find any matches. Try clearing your filters or using different keywords.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-8 py-3 bg-brand-dark text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-brand-blue transition-all duration-300 shadow-lg"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination component */}
                        {!loading && filteredAuctions.length > auctionsPerPage && (
                            <div className="mt-12 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(prev - 1, 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${currentPage === 1 ? 'border-slate-100 text-slate-300 cursor-not-allowed' : 'border-slate-200 text-brand-dark hover:border-brand-blue hover:text-brand-blue bg-white shadow-sm'}`}
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                {(() => {
                                    const totalPages = Math.ceil(filteredAuctions.length / auctionsPerPage);
                                    const pages = [];

                                    if (totalPages <= 7) {
                                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                                    } else {
                                        if (currentPage <= 4) {
                                            for (let i = 1; i <= 5; i++) pages.push(i);
                                            pages.push('...');
                                            pages.push(totalPages);
                                        } else if (currentPage >= totalPages - 3) {
                                            pages.push(1);
                                            pages.push('...');
                                            for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                                        } else {
                                            pages.push(1);
                                            pages.push('...');
                                            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                                            pages.push('...');
                                            pages.push(totalPages);
                                        }
                                    }

                                    return pages.map((page, index) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-slate-400">
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => {
                                                    setCurrentPage(page);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`w-10 h-10 flex items-center justify-center rounded-lg border text-[14px] font-black transition-all ${currentPage === page ? 'border-brand-blue bg-white text-brand-blue ring-1 ring-brand-blue shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-blue hover:text-brand-blue'}`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ));
                                })()}

                                <button
                                    onClick={() => {
                                        const totalPages = Math.ceil(filteredAuctions.length / auctionsPerPage);
                                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === Math.ceil(filteredAuctions.length / auctionsPerPage)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${currentPage === Math.ceil(filteredAuctions.length / auctionsPerPage) ? 'border-slate-100 text-slate-300 cursor-not-allowed' : 'border-slate-200 text-brand-dark hover:border-brand-blue hover:text-brand-blue bg-white shadow-sm'}`}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auctions;
