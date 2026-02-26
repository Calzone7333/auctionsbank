import React from 'react';
import { Heart, Ghost, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favourites = () => {
    return (
        <div className="min-h-screen bg-white pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-brand-dark tracking-tighter uppercase">My Favourites</h1>
                    <div className="h-1 w-16 bg-brand-blue mx-auto rounded-full"></div>
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <div className="p-6 bg-white rounded-full shadow-xl">
                        <Heart size={40} className="text-red-400" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-brand-dark">No Favourites Yet</h3>
                        <p className="text-slate-500 text-sm mt-1">Properties you heart will appear here.</p>
                    </div>
                    <Link
                        to="/auctions"
                        className="bg-brand-blue text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-dark transition-all flex items-center gap-3"
                    >
                        <Gavel size={16} /> Explore Auctions
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Favourites;
