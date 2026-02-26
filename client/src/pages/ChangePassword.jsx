import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const ChangePassword = () => {
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        verify: false
    });

    const toggleVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="min-h-screen bg-white pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-2xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-brand-dark tracking-tighter uppercase">Change Password</h1>
                    <div className="h-1 w-16 bg-brand-blue mx-auto rounded-full"></div>
                </div>

                {/* Form */}
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-6">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? "text" : "password"}
                                    className="w-full px-5 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-brand-dark outline-none transition-all text-sm font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility('current')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-dark transition-colors"
                                >
                                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    className="w-full px-5 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-brand-dark outline-none transition-all text-sm font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility('new')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-dark transition-colors"
                                >
                                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Verify Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Verify New Password</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.verify ? "text" : "password"}
                                    className="w-full px-5 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-brand-dark outline-none transition-all text-sm font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility('verify')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-dark transition-colors"
                                >
                                    {showPasswords.verify ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <button className="bg-brand-dark text-white px-10 py-3.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-brand-blue transition-all shadow-xl shadow-brand-dark/10 flex items-center gap-3">
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
