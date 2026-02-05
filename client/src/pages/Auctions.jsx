import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AuctionCard from '../components/AuctionCard';
import FilterSidebar from '../components/FilterSidebar';
import { Search, ArrowUpDown, LayoutGrid, List, ChevronDown } from 'lucide-react';

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
        fetch('http://localhost:8081/api/auctions')
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
    const cities = useMemo(() => [...new Set(auctions.filter(a => a?.cityName).map(a => a.cityName))].sort(), [auctions]);
    const banks = useMemo(() => [...new Set(auctions.filter(a => a?.bankName).map(a => a.bankName))].sort(), [auctions]);
    const types = useMemo(() => [...new Set(auctions.filter(a => a?.propertyType).map(a => a.propertyType))].sort(), [auctions]);

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
            {/* Page Header Background */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <span>Home</span>
                        <span>/</span>
                        <span className="font-bold text-slate-800">Auctions</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        {/* Results Header */}
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-end gap-4">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
                                    Active Auctions
                                </h1>
                                <p className="text-slate-500">
                                    {loading ? 'Searching properties...' : (
                                        <>
                                            Showing <span className="font-bold text-slate-900">{filteredAuctions.length}</span> properties
                                            {activeFiltersCount > 0 && <span> with active filters</span>}
                                        </>
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                                    <button className="p-2 text-slate-800 bg-gray-100 rounded-md shadow-sm">
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    {/* List view button placeholder - functionality to be added if needed */}
                                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <ArrowUpDown className="h-4 w-4 text-slate-400 group-hover:text-aq-blue transition-colors" />
                                    </div>
                                    <select
                                        className="appearance-none bg-white border border-gray-200 hover:border-aq-blue text-slate-700 py-2.5 pl-10 pr-10 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-aq-blue/20 transition-all cursor-pointer shadow-sm"
                                        value={priceSort}
                                        onChange={(e) => setPriceSort(e.target.value)}
                                    >
                                        <option value="">Sort by: Featured</option>
                                        <option value="asc">Price: Low to High</option>
                                        <option value="desc">Price: High to Low</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                    </div>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {filteredAuctions.map((auction) => (
                                            <div key={auction.id} className="transition-all duration-300 hover:-translate-y-1">
                                                <AuctionCard auction={auction} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                                        <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 relative">
                                            <Search className="h-10 w-10" />
                                            <div className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs ring-4 ring-white">0</div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">No properties match your filters</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
                                            We couldn't find any auctions matching your current criteria. Try removing some filters or searching for different keywords.
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            className="px-8 py-3 bg-aq-blue text-white font-bold rounded-xl hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl active:scale-95"
                                        >
                                            Clear All Filters
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
