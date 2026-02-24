import React from 'react';
import { Filter, Search, MapPin, Building2, Briefcase, ChevronDown, ChevronUp, X } from 'lucide-react';

const FilterSection = ({ title, icon: Icon, isOpen, onToggle, children }) => (
    <div className="border-b border-slate-50 last:border-0 py-4">
        <button
            onClick={onToggle}
            className="flex items-center justify-between w-full text-left group"
        >
            <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-brand-blue" />
                {title}
            </span>
            {isOpen
                ? <ChevronUp className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-blue transition-colors" />
                : <ChevronDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-blue transition-colors" />
            }
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
            {children}
        </div>
    </div>
);

const CheckboxItem = ({ label, checked, onChange }) => (
    <label className="flex items-center cursor-pointer group py-1.5 gap-3">
        <div className="relative flex items-center flex-shrink-0">
            <input
                type="checkbox"
                className="peer appearance-none w-4 h-4 border-2 border-slate-200 rounded checked:bg-brand-blue checked:border-brand-blue transition-all"
                checked={checked}
                onChange={onChange}
            />
            <svg
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            >
                <polyline points="2 6 5 9 10 3" />
            </svg>
        </div>
        <span className="text-[12px] text-slate-500 font-semibold group-hover:text-brand-dark transition-colors flex-1 leading-snug">
            {label}
        </span>
    </label>
);

const FilterSidebar = ({
    activeFiltersCount, clearFilters, searchTerm, setSearchTerm,
    openSections, toggleSection,
    cities, selectedCities, handleCheckboxChange, setSelectedCities,
    banks, selectedBanks, setSelectedBanks,
    types, selectedTypes, setSelectedTypes
}) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-50">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                        <Filter className="w-3.5 h-3.5 text-brand-blue" />
                    </div>
                    <h2 className="text-[11px] font-black text-brand-dark uppercase tracking-widest">Filters</h2>
                    {activeFiltersCount > 0 && (
                        <span className="text-[9px] font-black bg-brand-blue text-white rounded-full w-4 h-4 flex items-center justify-center leading-none">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>
                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-[9px] font-black text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors uppercase tracking-widest"
                    >
                        <X className="w-2.5 h-2.5" /> Clear
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative mb-5">
                <input
                    type="text"
                    placeholder="Search properties..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-9 pr-4 text-[12px] font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all placeholder:text-slate-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-3.5 h-3.5 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-3 h-3 text-slate-300 hover:text-brand-dark transition-colors" />
                    </button>
                )}
            </div>

            {/* Sections */}
            <div>
                <FilterSection title="Location" icon={MapPin} isOpen={openSections.city} onToggle={() => toggleSection('city')}>
                    <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
                        {cities.length === 0
                            ? <p className="text-[11px] text-slate-300 italic">No cities available</p>
                            : cities.map(city => (
                                <CheckboxItem
                                    key={city}
                                    label={city}
                                    checked={selectedCities.includes(city)}
                                    onChange={() => handleCheckboxChange(city, selectedCities, setSelectedCities)}
                                />
                            ))
                        }
                    </div>
                </FilterSection>

                <FilterSection title="Bank" icon={Building2} isOpen={openSections.bank} onToggle={() => toggleSection('bank')}>
                    <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
                        {banks.length === 0
                            ? <p className="text-[11px] text-slate-300 italic">No banks available</p>
                            : banks.map(bank => (
                                <CheckboxItem
                                    key={bank}
                                    label={bank}
                                    checked={selectedBanks.includes(bank)}
                                    onChange={() => handleCheckboxChange(bank, selectedBanks, setSelectedBanks)}
                                />
                            ))
                        }
                    </div>
                </FilterSection>

                <FilterSection title="Property Type" icon={Briefcase} isOpen={openSections.type} onToggle={() => toggleSection('type')}>
                    <div className="space-y-0.5">
                        {types.length === 0
                            ? <p className="text-[11px] text-slate-300 italic">No types available</p>
                            : types.map(type => (
                                <CheckboxItem
                                    key={type}
                                    label={type}
                                    checked={selectedTypes.includes(type)}
                                    onChange={() => handleCheckboxChange(type, selectedTypes, setSelectedTypes)}
                                />
                            ))
                        }
                    </div>
                </FilterSection>
            </div>
        </div>
    );
};

export default FilterSidebar;
