import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
    return (
        <div className="bg-white min-h-screen font-sans text-slate-800">

            {/* Header */}
            <div className="bg-white border-b border-slate-100 py-20 text-center px-4">
                <div className="max-w-3xl mx-auto">
                    <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.4em] mb-4">Get in Touch</p>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-brand-dark tracking-tight mb-6 leading-[1.1] uppercase">
                        We're Here<br />to Help You
                    </h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl mx-auto">
                        Have a question about a property auction? Our expert team is ready to assist you every step of the way.
                    </p>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">

                    {/* Email */}
                    <div className="group bg-white border border-slate-100 rounded-2xl p-8 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-300">
                        <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-blue transition-all duration-300">
                            <Mail className="w-5 h-5 text-brand-blue group-hover:text-white transition-colors" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Us</p>
                        <h3 className="text-base font-black text-brand-dark mb-2 uppercase tracking-tight">Email</h3>
                        <a
                            href="mailto:info@madrasauction.com"
                            className="text-brand-blue font-semibold text-sm hover:text-brand-dark transition-colors"
                        >
                            info@madrasauction.com
                        </a>
                        <p className="text-slate-400 text-xs mt-2 font-medium">We reply within 24 hours</p>
                    </div>

                    {/* Phone */}
                    <div className="group bg-white border border-slate-100 rounded-2xl p-8 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-300">
                        <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-blue transition-all duration-300">
                            <Phone className="w-5 h-5 text-brand-blue group-hover:text-white transition-colors" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Call Us</p>
                        <h3 className="text-base font-black text-brand-dark mb-2 uppercase tracking-tight">Phone</h3>
                        <a
                            href="tel:+919655771091"
                            className="text-brand-blue font-semibold text-sm hover:text-brand-dark transition-colors"
                        >
                            +91 96557 71091
                        </a>
                        <p className="text-slate-400 text-xs mt-2 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Mon – Fri, 9am – 6pm IST
                        </p>
                    </div>

                    {/* Office */}
                    <div className="group bg-white border border-slate-100 rounded-2xl p-8 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                        <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-blue transition-all duration-300">
                            <MapPin className="w-5 h-5 text-brand-blue group-hover:text-white transition-colors" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Visit Us</p>
                        <h3 className="text-base font-black text-brand-dark mb-2 uppercase tracking-tight">Office</h3>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">
                            32, 1st Main Road, Ayyappa Nagar,<br />
                            Virugambakkam,<br />
                            Chennai – 600092
                        </p>
                    </div>
                </div>

                {/* Map */}
                <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/60 border border-slate-100 aspect-video w-full">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2788.4021434979863!2d80.18824307321152!3d13.063853112852767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267324f4ab783%3A0x5a5319e17f3a0a4b!2sGayathri%20Thiruvengadam%20%26%20Associates!5e1!3m2!1sen!2sin!4v1770635103522!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Madrasauction Office Location"
                    />
                </div>
            </div>
        </div>
    );
};

export default Contact;
