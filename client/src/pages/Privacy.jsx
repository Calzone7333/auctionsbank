import React from 'react';

const Privacy = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans py-20 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-16">
                <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-8">Privacy Policy</h1>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                    <p className="text-lg">Last Updated: February 4, 2025</p>
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Introduction</h2>
                        <p>Welcome to Madrasauction. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our platform.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Data We Collect</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Identity Data: Name, username, or similar identifier.</li>
                            <li>Contact Data: Email address and telephone numbers.</li>
                            <li>Technical Data: IP address, login data, browser type and version.</li>
                            <li>Usage Data: Information about how you use our website and services.</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">3. How We Use Your Data</h2>
                        <p>We use your data to provide our services, manage your account, notify you about auction updates, and improve our platform functionality.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Data Security</h2>
                        <p>We have introduced appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
