import React from 'react';

const Privacy = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-blue"></div>
                <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.4em] mb-4">Legal Notice</p>
                <h1 className="text-4xl md:text-6xl font-display font-black text-brand-dark mb-10 uppercase tracking-tight">Privacy Policy</h1>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-10">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Last Updated: February 4, 2025</p>
                    <section>
                        <h2 className="text-2xl font-display font-black text-brand-dark mb-4 uppercase tracking-tight">1. Introduction</h2>
                        <p>Welcome to Madrasauction. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our platform.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-display font-black text-brand-dark mb-4 uppercase tracking-tight">2. Data We Collect</h2>
                        <ul className="list-disc pl-6 space-y-2 font-medium">
                            <li>Identity Data: Name, username, or similar identifier.</li>
                            <li>Contact Data: Email address and telephone numbers.</li>
                            <li>Technical Data: IP address, login data, browser type and version.</li>
                            <li>Usage Data: Information about how you use our website and services.</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-display font-black text-brand-dark mb-4 uppercase tracking-tight">3. How We Use Your Data</h2>
                        <p className="font-medium">We use your data to provide our services, manage your account, notify you about auction updates, and improve our platform functionality.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-display font-black text-brand-dark mb-4 uppercase tracking-tight">4. Data Security</h2>
                        <p className="font-medium">We have introduced appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
