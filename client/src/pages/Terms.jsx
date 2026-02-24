import React from 'react';

const Terms = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-blue"></div>
                <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.4em] mb-4">Legal Notice</p>
                <h1 className="text-4xl md:text-6xl font-display font-black text-brand-dark mb-10 uppercase tracking-tight">Terms of Service</h1>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-10">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Last Updated: February 4, 2025</p>
                    <section>
                        <h2 className="text-2xl font-display font-black text-brand-dark mb-4 uppercase tracking-tight">1. Agreement to Terms</h2>
                        <p className="font-medium">By accessing Madrasauction, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-display font-black text-brand-dark mb-4 uppercase tracking-tight">2. Use License</h2>
                        <p className="font-medium">Permission is granted to temporarily download one copy of the materials on Madrasauction's website for personal, non-commercial transitory viewing only.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-display font-black text-brand-dark mb-4 uppercase tracking-tight">3. Disclaimer</h2>
                        <p className="font-medium">The materials on Madrasauction are provided on an 'as is' basis. Madrasauction makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-display font-black text-brand-dark mb-4 uppercase tracking-tight">4. Limitations</h2>
                        <p className="font-medium">In no event shall Madrasauction or its suppliers be liable for any damages arising out of the use or inability to use the materials on Madrasauction's website.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
