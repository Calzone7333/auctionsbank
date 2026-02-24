import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuctionCard from '../components/AuctionCard';
import FilterSidebar from '../components/FilterSidebar';
import { Search, ArrowUpDown, LayoutGrid, List, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
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
    const [viewMode, setViewMode] = useState('grid');

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
        fetch(`${API_BASE_URL}/auctions`)
            .then(res => res.json())
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
                return 0;
            });
    }, [auctions, searchTerm, selectedCities, selectedBanks, selectedTypes, priceSort]);

    const clearFilters = () => {
        setSearchTerm(''); setSelectedCities([]); setSelectedBanks([]); setSelectedTypes([]); setPriceSort('');
    };

    const activeFiltersCount = selectedCities.length + selectedBanks.length + selectedTypes.length + (searchTerm ? 1 : 0);

    return (
        <div className="bg-slate-50 min-h-screen font-sans">

            {/* ── Main Content ── */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">

                {/* Toolbar Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Left: count + mobile filter toggle */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setMobileFilterOpen(v => !v)}
                            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-dark hover:bg-brand-dark hover:text-white transition-all"
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <span className="bg-brand-blue text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                        <div>
                            <p className="font-black text-brand-dark text-base leading-tight">
                                {loading ? 'Loading...' : `${filteredAuctions.length} Properties`}
                            </p>
                            {activeFiltersCount > 0 && (
                                <button onClick={clearFilters} className="flex items-center gap-1 text-[9px] text-red-500 font-bold hover:text-red-700 transition-colors">
                                    <X className="w-2.5 h-2.5" /> Clear filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: sort + view mode */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Sort */}
                        <div className="relative flex-1 sm:flex-none sm:w-48">
                            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                            <select
                                className="appearance-none w-full bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-widest text-brand-dark py-2.5 pl-9 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all cursor-pointer"
                                value={priceSort}
                                onChange={(e) => setPriceSort(e.target.value)}
                            >
                                <option value="">Sort: Relevant</option>
                                <option value="asc">Price: Low → High</option>
                                <option value="desc">Price: High → Low</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                        </div>

                        {/* View toggle */}
                        <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100 gap-0.5">
                            {[['grid', LayoutGrid], ['list', List]].map(([mode, Icon]) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`p-2 rounded-lg transition-all ${viewMode === mode
                                        ? 'bg-brand-dark text-white shadow-sm'
                                        : 'text-slate-400 hover:text-brand-dark'
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
                            <div className={`grid gap-5 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}>
                                {filteredAuctions.map((auction, i) => (
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auctions;
