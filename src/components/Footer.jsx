import React from 'react';
import { Gavel } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center text-white mb-4">
                            <Gavel className="h-6 w-6 mr-2" />
                            <span className="text-xl font-bold">Aquection.</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            India's leading aggregator for bank auction properties. Find your next investment here.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Platform</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition">All Auctions</a></li>
                            <li><a href="#" className="hover:text-white transition">Premium Plans</a></li>
                            <li><a href="#" className="hover:text-white transition">Bank Lists</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition">Disclaimer</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li><a href="mailto:support@aquection.com" className="hover:text-white transition">support@aquection.com</a></li>
                            <li><span className="text-gray-500">Bangalore, India</span></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500">
                    <div className="bg-gray-800 p-4 rounded-md mb-6 border-l-4 border-yellow-500">
                        <p className="font-semibold text-yellow-500 mb-1">Disclaimer:</p>
                        <p>
                            Aquection is an information aggregation platform and is NOT an auction authority.
                            We do not conduct auctions or handle any money related to property purchases.
                            All auction data is sourced from public bank notices. Please verify details directly with the respective bank before participating.
                        </p>
                    </div>
                    <p className="text-center">&copy; {new Date().getFullYear()} Aquection. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
