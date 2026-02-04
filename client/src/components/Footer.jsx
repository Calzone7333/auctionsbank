import React from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Mail, MapPin, Phone, ArrowUpRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-aq-blue text-white font-sans relative overflow-hidden">
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-aq-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <Gavel className="h-6 w-6 text-aq-blue" />
                            </div>
                            <span className="text-2xl font-display font-bold tracking-tight">Aquection<span className="text-aq-gold">.</span></span>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-sm">
                            India's most trusted aggregator for bank auction properties. We simplify the search for high-value residential, commercial, and industrial assets.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-aq-gold hover:text-white transition-all duration-300">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-aq-gold hover:text-white transition-all duration-300">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-aq-gold hover:text-white transition-all duration-300">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-aq-gold hover:text-white transition-all duration-300">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-display font-bold mb-6 text-aq-gold">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-slate-300 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Home</Link></li>
                            <li><Link to="/auctions" className="text-slate-300 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Auctions</Link></li>
                            <li><Link to="/plans" className="text-slate-300 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Plans</Link></li>
                            <li><Link to="/about" className="text-slate-300 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> About Us</Link></li>
                            <li><Link to="/contact" className="text-slate-300 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Contact</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-display font-bold mb-6 text-aq-gold">Support</h3>
                        <ul className="space-y-3">
                            <li><Link to="/privacy" className="text-slate-300 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-slate-300 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Terms of Service</Link></li>
                            <li><Link to="/blogs" className="text-slate-300 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Blogs</Link></li>
                            <li><Link to="/faq" className="text-slate-300 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-display font-bold mb-6 text-aq-gold">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-300">
                                <MapPin className="h-5 w-5 text-aq-gold shrink-0 mt-0.5" />
                                <span className="text-sm">123, Financial District,<br />Gachibowli, Hyderabad,<br />Telangana - 500032</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <Phone className="h-5 w-5 text-aq-gold shrink-0" />
                                <a href="tel:+917878535701" className="text-sm hover:text-white transition">+91 78785 35701</a>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <Mail className="h-5 w-5 text-aq-gold shrink-0" />
                                <a href="mailto:info@aquection.com" className="text-sm hover:text-white transition">info@aquection.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Disclaimer Box */}


                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Aquection. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition">Sitemap</a>
                        <a href="#" className="hover:text-white transition">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
