import React, { useState } from 'react';
import { Filter, Search, MapPin, Building2, Briefcase, ChevronDown, ChevronUp, X } from 'lucide-react';

const FilterSection = ({ title, icon: Icon, isOpen, onToggle, children }) => (
    <div className="border-b border-gray-100 last:border-0 py-5">
        <button
            onClick={onToggle}
            className="flex items-center justify-between w-full text-left group"
        >
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center group-hover:text-aq-blue transition-colors">
                <Icon className="w-4 h-4 mr-2 text-slate-400 group-hover:text-aq-blue transition-colors" />
                {title}
            </span>
            {isOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-aq-blue" />
            ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-aq-blue" />
            )}
        </button>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            {children}
        </div>
    </div>
);

const CheckboxItem = ({ label, count, checked, onChange }) => (
    <label className="flex items-center cursor-pointer group py-1.5">
        <div className="relative flex items-center">
            <input
                type="checkbox"
                className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-aq-blue checked:border-aq-blue transition-colors"
                checked={checked}
                onChange={onChange}
            />
            <svg
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="2 6 5 9 10 3" />
            </svg>
        </div>
        <span className="ml-3 text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors flex-1">{label}</span>
        {count !== undefined && (
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{count}</span>
        )}
    </label>
);

const FilterSidebar = ({
    activeFiltersCount,
    clearFilters,
    searchTerm,
    setSearchTerm,
    openSections,
    toggleSection,
    cities,
    selectedCities,
    handleCheckboxChange,
    setSelectedCities,
    banks,
    selectedBanks,
    setSelectedBanks,
    types,
    selectedTypes,
    setSelectedTypes
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                <h2 className="text-lg font-display font-bold text-slate-900 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-aq-blue" />
                    Filters
                </h2>
                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors uppercase tracking-wider"
                    >
                        <X className="w-3 h-3 mr-1" /> Clear
                    </button>
                )}
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search properties..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-aq-blue/20 focus:border-aq-blue transition-all placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            <div className="space-y-1">
                {/* City Filter */}
                <FilterSection
                    title="Location"
                    icon={MapPin}
                    isOpen={openSections.city}
                    onToggle={() => toggleSection('city')}
                >
                    <div className="space-y-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {cities.map(city => (
                            <CheckboxItem
                                key={city}
                                label={city}
                                checked={selectedCities.includes(city)}
                                onChange={() => handleCheckboxChange(city, selectedCities, setSelectedCities)}
                            />
                        ))}
                    </div>
                </FilterSection>

                {/* Bank Filter */}
                <FilterSection
                    title="Bank"
                    icon={Building2}
                    isOpen={openSections.bank}
                    onToggle={() => toggleSection('bank')}
                >
                    <div className="space-y-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {banks.map(bank => (
                            <CheckboxItem
                                key={bank}
                                label={bank}
                                checked={selectedBanks.includes(bank)}
                                onChange={() => handleCheckboxChange(bank, selectedBanks, setSelectedBanks)}
                            />
                        ))}
                    </div>
                </FilterSection>

                {/* Property Type Filter */}
                <FilterSection
                    title="Property Type"
                    icon={Briefcase}
                    isOpen={openSections.type}
                    onToggle={() => toggleSection('type')}
                >
                    <div className="space-y-1">
                        {types.map(type => (
                            <CheckboxItem
                                key={type}
                                label={type}
                                checked={selectedTypes.includes(type)}
                                onChange={() => handleCheckboxChange(type, selectedTypes, setSelectedTypes)}
                            />
                        ))}
                    </div>
                </FilterSection>
            </div>
        </div>
    );
};

export default FilterSidebar;
