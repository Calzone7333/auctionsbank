import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
    return (
        <div className="bg-white min-h-screen font-sans text-slate-800">

            {/* Header */}
            <div className="bg-white border-b border-slate-100 py-20 text-center px-4">
                <div className="max-w-3xl mx-auto">
                    <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.4em] mb-4">Get in Touch</p>
                    <div className="relative inline-block mb-6">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-brand-dark tracking-tight leading-[1.1] uppercase relative z-10">
                            We're Here<br />to Help You
                        </h1>
                        <div className="absolute w-52 h-3 bg-brand-blue/30 -bottom-2 left-1/2 transform -translate-x-1/2 -rotate-2 z-0 rounded-full"></div>
                        <div className="absolute w-40 h-2 bg-brand-blue/20 -bottom-4 left-1/2 transform -translate-x-1/2 rotate-1 z-0 rounded-full"></div>
                    </div>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl mx-auto">
                        Have a question about a property auction? Our expert team is ready to assist you every step of the way.
                    </p>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="bg-[#fbfdf2] py-24 border-b-[20px] border-brand-blue">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mb-16">

                        {/* Email */}
                        <div className="flex flex-col items-center px-4">
                            <div className="w-24 h-24 mb-6 relative flex justify-center items-center group">
                                <div className="absolute inset-0 bg-brand-blue/20 rounded-full transform -rotate-12 translate-x-1 translate-y-1 group-hover:rotate-0 transition-transform duration-300"></div>
                                <div className="w-16 h-16 bg-brand-dark rounded-[20px] shadow-lg flex items-center justify-center relative z-10 border-2 border-brand-blue/30 transform group-hover:-translate-y-1 transition-transform duration-300 text-white">
                                    <Mail className="w-7 h-7 text-[#fff8e1]" />
                                </div>
                                <div className="absolute top-0 right-0 w-3 h-3 border-2 border-brand-blue rounded-sm rotate-12"></div>
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Us</p>
                            <h4 className="font-bold text-lg text-brand-dark mb-3">Email</h4>
                            <a href="mailto:info@madrasauction.com" className="text-sm text-brand-blue font-semibold leading-relaxed hover:text-brand-dark transition-colors">
                                info@madrasauction.com
                            </a>
                            <p className="text-slate-400 text-xs mt-2 font-medium">We reply within 24 hours</p>
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col items-center px-4">
                            <div className="w-24 h-24 mb-6 relative flex justify-center items-center group">
                                <div className="absolute inset-0 bg-brand-blue/20 rounded-full transform rotate-12 -translate-x-1 translate-y-2 group-hover:rotate-0 transition-transform duration-300"></div>
                                <div className="w-16 h-16 bg-brand-dark rounded-[20px] shadow-lg flex items-center justify-center relative z-10 border-2 border-brand-blue/30 transform group-hover:-translate-y-1 transition-transform duration-300 text-white">
                                    <Phone className="w-7 h-7 text-[#fff8e1]" />
                                </div>
                                <div className="absolute top-2 -left-2 w-3 h-3 border-2 border-brand-blue rounded-full"></div>
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Call Us</p>
                            <h4 className="font-bold text-lg text-brand-dark mb-3">Phone</h4>
                            <a href="tel:+919655771091" className="text-sm text-brand-blue font-semibold leading-relaxed hover:text-brand-dark transition-colors">
                                +91 96557 71091
                            </a>
                            <p className="text-slate-400 text-xs mt-2 font-medium flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3" /> Mon – Fri, 9am – 6pm IST
                            </p>
                        </div>

                        {/* Office */}
                        <div className="flex flex-col items-center px-4">
                            <div className="w-24 h-24 mb-6 relative flex justify-center items-center group">
                                <div className="absolute inset-0 bg-brand-blue/20 rounded-full transform -rotate-6 translate-x-2 -translate-y-1 group-hover:rotate-0 transition-transform duration-300"></div>
                                <div className="w-16 h-16 bg-brand-dark rounded-[20px] shadow-lg flex items-center justify-center relative z-10 border-2 border-brand-blue/30 transform group-hover:-translate-y-1 transition-transform duration-300 text-white">
                                    <MapPin className="w-7 h-7 text-[#fff8e1]" />
                                </div>
                                <div className="absolute -bottom-1 -right-2 w-3 h-3 border-2 border-brand-blue rounded-sm -rotate-45"></div>
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Visit Us</p>
                            <h4 className="font-bold text-lg text-brand-dark mb-3">Office</h4>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
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
        </div>
    );
};

export default Contact;
