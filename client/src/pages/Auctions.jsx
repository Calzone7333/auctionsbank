import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AuctionCard from '../components/AuctionCard';
import FilterSidebar from '../components/FilterSidebar';
import { Search, ArrowUpDown, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const Auctions = () => {
    const [searchParams] = useSearchParams();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedBanks, setSelectedBanks] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [priceSort, setPriceSort] = useState(''); // 'asc' or 'desc'

    // UI State for Collapsible Sections
    const [openSections, setOpenSections] = useState({
        city: true,
        bank: true,
        type: true
    });
    const [viewMode, setViewMode] = useState('grid');

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Initialize filters from URL params
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
            .then(data => {
                setAuctions(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching auctions:", err);
                setAuctions([]);
                setLoading(false);
            });
    }, []);

    // Extract unique values with safe checks
    const cities = useMemo(() =>
        Array.isArray(auctions) ? [...new Set(auctions.filter(a => a?.cityName).map(a => a.cityName))].sort() : [],
        [auctions]);
    const banks = useMemo(() =>
        Array.isArray(auctions) ? [...new Set(auctions.filter(a => a?.bankName).map(a => a.bankName))].sort() : [],
        [auctions]);
    const types = useMemo(() =>
        Array.isArray(auctions) ? [...new Set(auctions.filter(a => a?.propertyType).map(a => a.propertyType))].sort() : [],
        [auctions]);

    // Handle Checkbox Changes
    const handleCheckboxChange = (value, state, setState) => {
        if (state.includes(value)) {
            setState(state.filter(item => item !== value));
        } else {
            setState([...state, value]);
        }
    };

    const filteredAuctions = useMemo(() => {
        return auctions.filter(auction => {
            const matchesSearch =
                (auction.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (auction.cityName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (auction.bankName?.toLowerCase() || '').includes(searchTerm.toLowerCase());

            const matchesCity = selectedCities.length === 0 || selectedCities.includes(auction.cityName);
            const matchesBank = selectedBanks.length === 0 || selectedBanks.includes(auction.bankName);
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(auction.propertyType);

            return matchesSearch && matchesCity && matchesBank && matchesType;
        }).sort((a, b) => {
            if (priceSort === 'asc') return a.reservePrice - b.reservePrice;
            if (priceSort === 'desc') return b.reservePrice - a.reservePrice;
            return 0; // Default: No sort or as received (id usually)
        });
    }, [auctions, searchTerm, selectedCities, selectedBanks, selectedTypes, priceSort]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCities([]);
        setSelectedBanks([]);
        setSelectedTypes([]);
        setPriceSort('');
    };

    const activeFiltersCount = selectedCities.length + selectedBanks.length + selectedTypes.length;

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* Header Section */}
            <div className="bg-slate-900 pt-10 pb-24 text-center px-4">
                <div className="max-w-3xl mx-auto space-y-4">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
                        Discover Prime Bank Auctions
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Explore verified properties from top national banks at unbeatable prices. Secure your investment today.
                    </p>
                </div>
            </div>

            {/* Main Content Area - overlapping the dark header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <FilterSidebar
                            activeFiltersCount={activeFiltersCount}
                            clearFilters={clearFilters}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            openSections={openSections}
                            toggleSection={toggleSection}
                            cities={cities}
                            selectedCities={selectedCities}
                            handleCheckboxChange={handleCheckboxChange}
                            setSelectedCities={setSelectedCities}
                            banks={banks}
                            selectedBanks={selectedBanks}
                            setSelectedBanks={setSelectedBanks}
                            types={types}
                            selectedTypes={selectedTypes}
                            setSelectedTypes={setSelectedTypes}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Results Toolbar */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h2 className="font-bold text-slate-800 text-lg">
                                    {loading ? 'Loading...' : `${filteredAuctions.length} Properties Found`}
                                </h2>
                                {activeFiltersCount > 0 && (
                                    <p className="text-xs text-slate-500 mt-0.5">Applied filters affecting results</p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative group w-full sm:w-48">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <ArrowUpDown className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <select
                                        className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-10 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all cursor-pointer"
                                        value={priceSort}
                                        onChange={(e) => setPriceSort(e.target.value)}
                                    >
                                        <option value="">Sort: Relevant</option>
                                        <option value="asc">Price: Low to High</option>
                                        <option value="desc">Price: High to Low</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                                <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-200">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-white rounded-2xl h-[420px] shadow-sm animate-pulse border border-gray-100 overflow-hidden">
                                        <div className="h-48 bg-slate-100"></div>
                                        <div className="p-6 space-y-4">
                                            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                            <div className="space-y-2 pt-4">
                                                <div className="h-3 bg-slate-100 rounded w-full"></div>
                                                <div className="h-3 bg-slate-100 rounded w-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {filteredAuctions.length > 0 ? (
                                    <div className={`grid ${viewMode === 'list' ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'}`}>
                                        {filteredAuctions.map((auction) => (
                                            <div key={auction.id} className="transition-all duration-300 hover:-translate-y-1">
                                                <AuctionCard auction={auction} viewMode={viewMode} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                                            <Search className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto mb-8 text-sm">
                                            We couldn't find matches for your filters. Try clearing them or using different keywords.
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all text-sm"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auctions;
