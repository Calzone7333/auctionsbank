import React, { useState, useEffect, useMemo } from 'react';
import AuctionCard from '../components/AuctionCard';
import { Search, Filter, X, ChevronDown, SlidersHorizontal, ArrowUpDown, LayoutGrid, List } from 'lucide-react';

const Auctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [priceSort, setPriceSort] = useState(''); // 'asc' or 'desc'

    // UI State
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile filter toggle

    useEffect(() => {
        // Mocking API call or Fetching
        fetch('http://localhost:8080/api/auctions')
            .then(res => res.json())
            .then(data => {
                setAuctions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching auctions:", err);
                setLoading(false);
            });
    }, []);

    const cities = useMemo(() => [...new Set(auctions.map(a => a.cityName))].sort(), [auctions]);
    const banks = useMemo(() => [...new Set(auctions.map(a => a.bankName))].sort(), [auctions]);
    const types = useMemo(() => [...new Set(auctions.map(a => a.propertyType))].sort(), [auctions]);

    const filteredAuctions = useMemo(() => {
        return auctions.filter(auction => {
            const matchesSearch =
                auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                auction.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                auction.bankName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCity = selectedCity ? auction.cityName === selectedCity : true;
            const matchesBank = selectedBank ? auction.bankName === selectedBank : true;
            const matchesType = selectedType ? auction.propertyType === selectedType : true;

            return matchesSearch && matchesCity && matchesBank && matchesType;
        }).sort((a, b) => {
            if (priceSort === 'asc') return a.reservePrice - b.reservePrice;
            if (priceSort === 'desc') return b.reservePrice - a.reservePrice;
            return 0;
        });
    }, [auctions, searchTerm, selectedCity, selectedBank, selectedType, priceSort]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCity('');
        setSelectedBank('');
        setSelectedType('');
        setPriceSort('');
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-display font-bold text-slate-900">
                                Browse Auctions
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Discover investment opportunities across India
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg leading-5 bg-slate-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-aq-gold/50 focus:border-aq-gold sm:text-sm transition duration-200"
                                placeholder="Search property, city, or bank..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filters Row - Clean Horizontal Bar */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        {/* Filter Pill: City */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white border border-gray-200  hover:border-aq-blue/50 text-slate-700 py-2 pl-3 pr-8 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-aq-blue/20 cursor-pointer transition-colors"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option value="">City: All</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Filter Pill: Bank */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white border border-gray-200 hover:border-aq-blue/50 text-slate-700 py-2 pl-3 pr-8 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-aq-blue/20 cursor-pointer transition-colors"
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                            >
                                <option value="">Bank: All</option>
                                {banks.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Filter Pill: Type */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white border border-gray-200 hover:border-aq-blue/50 text-slate-700 py-2 pl-3 pr-8 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-aq-blue/20 cursor-pointer transition-colors"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="">Type: All</option>
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Clear Filters Link */}
                        {(selectedCity || selectedBank || selectedType || searchTerm) && (
                            <button
                                onClick={clearFilters}
                                className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 ml-2 transition-colors"
                            >
                                <X className="h-3 w-3" /> Clear
                            </button>
                        )}

                        <div className="flex-grow"></div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase hidden sm:block">Sort By</span>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-slate-50 border-none text-slate-800 py-2 pl-3 pr-8 rounded-lg text-sm font-bold focus:outline-none focus:ring-0 cursor-pointer"
                                    value={priceSort}
                                    onChange={(e) => setPriceSort(e.target.value)}
                                >
                                    <option value="">Relevance</option>
                                    <option value="asc">Price: Low to High</option>
                                    <option value="desc">Price: High to Low</option>
                                </select>
                                <ArrowUpDown className="absolute right-2 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-aq-blue"></div>
                        <p className="mt-4 text-slate-500 font-medium">Loading auctions...</p>
                    </div>
                ) : (
                    <>
                        {filteredAuctions.length > 0 ? (
                            <>
                                <div className="mb-4 text-sm font-medium text-slate-500">
                                    Showing {filteredAuctions.length} properties
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredAuctions.map((auction) => (
                                        <div key={auction.id} className="transition-all duration-300 hover:-translate-y-1">
                                            <AuctionCard auction={auction} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-xl p-16 text-center border border-gray-100 shadow-sm opacity-0 animate-in fade-in zoom-in duration-500 fill-mode-forwards" style={{ animationFillMode: 'forwards', opacity: 1 }}>
                                <div className="mx-auto h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                                    <Search className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No auctions found</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                                    We couldn't find any properties matching your current filters. Try changing your search query or removing some filters.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2.5 bg-aq-blue text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20"
                                >
                                    View All Auctions
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Auctions;
