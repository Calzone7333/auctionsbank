import React, { useState, useEffect, useMemo } from 'react';
import AuctionCard from '../components/AuctionCard';
import { Search, Filter, X, ChevronDown, ChevronUp, MapPin, Building2, Briefcase, ArrowUpDown } from 'lucide-react';

const Auctions = () => {
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

    useEffect(() => {
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

    // Extract unique values
    const cities = useMemo(() => [...new Set(auctions.map(a => a.cityName))].sort(), [auctions]);
    const banks = useMemo(() => [...new Set(auctions.map(a => a.bankName))].sort(), [auctions]);
    const types = useMemo(() => [...new Set(auctions.map(a => a.propertyType))].sort(), [auctions]);

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
                auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                auction.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                auction.bankName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCity = selectedCities.length === 0 || selectedCities.includes(auction.cityName);
            const matchesBank = selectedBanks.length === 0 || selectedBanks.includes(auction.bankName);
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(auction.propertyType);

            return matchesSearch && matchesCity && matchesBank && matchesType;
        }).sort((a, b) => {
            if (priceSort === 'asc') return a.reservePrice - b.reservePrice;
            if (priceSort === 'desc') return b.reservePrice - a.reservePrice;
            return 0;
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-display font-bold text-slate-900 flex items-center">
                                    <Filter className="w-5 h-5 mr-2 text-aq-blue" /> Filters
                                </h2>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wider"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Search Input */}
                            <div className="relative mb-8">
                                <input
                                    type="text"
                                    placeholder="Search keywords..."
                                    className="w-full bg-slate-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-aq-blue/20 focus:border-aq-blue transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                            </div>

                            <div className="space-y-6">
                                {/* City Filter */}
                                <div className="border-t border-gray-100 pt-6">
                                    <button
                                        onClick={() => toggleSection('city')}
                                        className="flex items-center justify-between w-full text-left mb-3 group"
                                    >
                                        <span className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center">
                                            <MapPin className="w-4 h-4 mr-2 text-slate-400 group-hover:text-aq-blue transition-colors" /> City
                                        </span>
                                        {openSections.city ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>

                                    {openSections.city && (
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {cities.map(city => (
                                                <label key={city} className="flex items-center cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-gray-300 text-aq-blue focus:ring-aq-blue"
                                                        checked={selectedCities.includes(city)}
                                                        onChange={() => handleCheckboxChange(city, selectedCities, setSelectedCities)}
                                                    />
                                                    <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{city}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Bank Filter */}
                                <div className="border-t border-gray-100 pt-6">
                                    <button
                                        onClick={() => toggleSection('bank')}
                                        className="flex items-center justify-between w-full text-left mb-3 group"
                                    >
                                        <span className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center">
                                            <Building2 className="w-4 h-4 mr-2 text-slate-400 group-hover:text-aq-blue transition-colors" /> Bank
                                        </span>
                                        {openSections.bank ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>

                                    {openSections.bank && (
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {banks.map(bank => (
                                                <label key={bank} className="flex items-center cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-gray-300 text-aq-blue focus:ring-aq-blue"
                                                        checked={selectedBanks.includes(bank)}
                                                        onChange={() => handleCheckboxChange(bank, selectedBanks, setSelectedBanks)}
                                                    />
                                                    <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{bank}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Property Type Filter */}
                                <div className="border-t border-gray-100 pt-6">
                                    <button
                                        onClick={() => toggleSection('type')}
                                        className="flex items-center justify-between w-full text-left mb-3 group"
                                    >
                                        <span className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center">
                                            <Briefcase className="w-4 h-4 mr-2 text-slate-400 group-hover:text-aq-blue transition-colors" /> Property Type
                                        </span>
                                        {openSections.type ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </button>

                                    {openSections.type && (
                                        <div className="space-y-2">
                                            {types.map(type => (
                                                <label key={type} className="flex items-center cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-gray-300 text-aq-blue focus:ring-aq-blue"
                                                        checked={selectedTypes.includes(type)}
                                                        onChange={() => handleCheckboxChange(type, selectedTypes, setSelectedTypes)}
                                                    />
                                                    <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Content Header */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center">
                            <div>
                                <h1 className="text-xl font-display font-bold text-slate-900">
                                    Properties for Auction
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    {loading ? 'Loading...' : `Found ${filteredAuctions.length} results`}
                                </p>
                            </div>

                            <div className="flex items-center mt-4 sm:mt-0">
                                <span className="text-xs font-semibold text-slate-500 mr-2">Sort by:</span>
                                <div className="relative">
                                    <select
                                        className="appearance-none bg-slate-50 border border-gray-200 text-slate-700 py-2 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-aq-blue/20 cursor-pointer"
                                        value={priceSort}
                                        onChange={(e) => setPriceSort(e.target.value)}
                                    >
                                        <option value="">Newest First</option>
                                        <option value="asc">Price: Low to High</option>
                                        <option value="desc">Price: High to Low</option>
                                    </select>
                                    <ArrowUpDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl border border-gray-100">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-aq-blue"></div>
                                <p className="mt-4 text-slate-500 font-medium">Fetching properties...</p>
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
                                    <div className="bg-white rounded-xl p-16 text-center border border-gray-100 shadow-sm">
                                        <div className="mx-auto h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                                            <Search className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">No properties match your filters</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto mb-8">
                                            Try removing some filters or searching for different keywords to find what you're looking for.
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            className="px-6 py-2.5 bg-aq-blue text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20"
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
