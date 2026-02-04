import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

const Contact = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* Header Section */}
            <div className="bg-aq-blue text-white py-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <span className="text-aq-gold font-bold tracking-widest uppercase text-sm mb-2 block">Get in Touch</span>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Contact Us</h1>
                    <p className="text-slate-300 max-w-xl mx-auto text-lg font-light leading-relaxed">
                        Have questions about an auction or need assistance with plans? Our team is here to help you every step of the way.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Info Card 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                                <Phone className="h-5 w-5 text-aq-blue" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Call Us</h3>
                                <p className="text-sm text-slate-500 mb-2">Mon-Sat from 9am to 6pm</p>
                                <a href="tel:+917878535701" className="text-aq-gold font-bold hover:text-yellow-600 transition-colors">
                                    +91 78785 35701
                                </a>
                            </div>
                        </div>

                        {/* Info Card 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                                <Mail className="h-5 w-5 text-aq-blue" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Email Us</h3>
                                <p className="text-sm text-slate-500 mb-2">Typically replies within 2 hours</p>
                                <a href="mailto:info@aquection.com" className="text-aq-gold font-bold hover:text-yellow-600 transition-colors block">
                                    info@aquection.com
                                </a>
                                <a href="mailto:support@aquection.com" className="text-aq-gold font-bold hover:text-yellow-600 transition-colors">
                                    support@aquection.com
                                </a>
                            </div>
                        </div>

                        {/* Info Card 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                                <MapPin className="h-5 w-5 text-aq-blue" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Visit Us</h3>
                                <p className="text-sm text-slate-500 mb-2">Come say hello at our office HQ.</p>
                                <p className="text-slate-700 font-medium">
                                    123, Financial District,<br />
                                    Gachibowli, Hyderabad,<br />
                                    Telangana - 500032
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 h-full">
                            <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Send us a Message</h2>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Your Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aq-gold/50 focus:border-aq-gold transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aq-gold/50 focus:border-aq-gold transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Subject</label>
                                    <select className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aq-gold/50 focus:border-aq-gold transition-all text-slate-600">
                                        <option>General Inquiry</option>
                                        <option>Auction Support</option>
                                        <option>Premium Plan Query</option>
                                        <option>Partnership Proposal</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Message</label>
                                    <textarea
                                        rows="6"
                                        placeholder="How can we help you today?"
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-aq-gold/50 focus:border-aq-gold transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button type="submit" className="w-full md:w-auto px-8 py-3.5 bg-aq-blue text-white font-bold rounded-lg hover:bg-blue-900 transition-all shadow-lg flex items-center justify-center gap-2 group">
                                    Send Message <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>

            {/* Map Section */}
            <div className="w-full h-96 bg-gray-200 grayscale opacity-80 relative">
                {/* Embed Google Map Placeholder */}
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15224.99616235129!2d78.33776410318536!3d17.44778709598285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93a276ad8d6d%3A0xcb0e8b2d287bb4a5!2sGachibowli%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1707040000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

        </div>
    );
};

export default Contact;
