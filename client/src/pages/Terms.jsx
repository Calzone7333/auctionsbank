import React from 'react';

const Terms = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans py-20 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-16">
                <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-8">Terms of Service</h1>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                    <p className="text-lg">Last Updated: February 4, 2025</p>
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Agreement to Terms</h2>
                        <p>By accessing Aquection, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Use License</h2>
                        <p>Permission is granted to temporarily download one copy of the materials on Aquection's website for personal, non-commercial transitory viewing only.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Disclaimer</h2>
                        <p>The materials on Aquection are provided on an 'as is' basis. Aquection makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Limitations</h2>
                        <p>In no event shall Aquection or its suppliers be liable for any damages arising out of the use or inability to use the materials on Aquection's website.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
