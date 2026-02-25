import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Gavel } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-brand-dark text-white font-sans pt-20 pb-10">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">

                    {/* Brand Column */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-12 w-12 bg-white rounded-full text-brand-dark">
                                <Gavel className="h-7 w-7 text-brand-blue" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-white leading-none tracking-tighter uppercase">
                                    Madrasauction
                                </span>
                                <span className="text-[10px] font-bold text-brand-blue tracking-[0.2em] uppercase">
                                    Property Auctions
                                </span>
                            </div>
                        </Link>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            India's trusted platform for bank auction properties. We provide verified listings, legal guidance, and professional support to help you secure your next investment with confidence.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: '#' },
                                { Icon: Twitter, href: '#' },
                                { Icon: Instagram, href: '#' },
                                { Icon: Linkedin, href: '#' },
                            ].map(({ Icon, href }, idx) => (
                                <a key={idx} href={href} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-blue hover:border-brand-blue transition-all duration-300">
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest mb-8 text-brand-blue border-l-4 border-brand-blue pl-4">Quick Links</h3>
                        <ul className="space-y-4 text-sm font-semibold text-slate-400">
                            <li>
                                <Link to="/" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center gap-2">
                                    <ArrowRight className="w-3 h-3 text-brand-blue" /> Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/auctions" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center gap-2">
                                    <ArrowRight className="w-3 h-3 text-brand-blue" /> All Auctions
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center gap-2">
                                    <ArrowRight className="w-3 h-3 text-brand-blue" /> About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/blogs" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center gap-2">
                                    <ArrowRight className="w-3 h-3 text-brand-blue" /> Blog & News
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center gap-2">
                                    <ArrowRight className="w-3 h-3 text-brand-blue" /> Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-white hover:pl-2 transition-all duration-200 flex items-center gap-2">
                                    <ArrowRight className="w-3 h-3 text-brand-blue" /> FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest mb-8 text-brand-blue border-l-4 border-brand-blue pl-4">Contact Us</h3>
                        <ul className="space-y-6 text-sm font-semibold text-slate-400">
                            <li className="flex items-start gap-4 hover:text-white transition-colors cursor-default">
                                <Mail className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Email</p>
                                    <a href="mailto:info@madrasauction.com" className="hover:text-brand-blue transition-colors">
                                        info@madrasauction.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 hover:text-white transition-colors cursor-default">
                                <Phone className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Phone</p>
                                    <a href="tel:+919655771091" className="hover:text-brand-blue transition-colors">
                                        +91 96557 71091
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 transition-colors cursor-default">
                                <MapPin className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Office</p>
                                    <span className="leading-relaxed text-slate-400">
                                        32, 1st Main Road, Ayyappa Nagar,<br />
                                        Virugambakkam, Chennai - 600092
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5 pt-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[11px] font-semibold text-slate-500 text-center md:text-left">
                            © {new Date().getFullYear()} <span className="text-white"> Hado Global Services Pvt Ltd</span>. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest">
                            <Link to="/terms" className="text-slate-500 hover:text-white transition-colors">Terms & Conditions</Link>
                            <Link to="/privacy" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
                            <Link to="/contact" className="text-slate-500 hover:text-white transition-colors">Contact</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
