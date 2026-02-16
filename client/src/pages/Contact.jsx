import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ArrowRight } from 'lucide-react';

const Contact = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-base font-semibold text-blue-600 uppercase tracking-wide mb-2">Get in touch</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                        We'd love to hear from you
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-500 leading-relaxed">
                        Have a question about a property? Need help with your plan? Our friendly team is always here to chat.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 outline outline-1 outline-gray-100 p-8 sm:p-10 order-2 lg:order-1">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a message</h2>
                        <form className="space-y-6" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries());
                            data.name = `${data.firstName} ${data.lastName}`;

                            fetch('http://localhost:8080/api/contact', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(data)
                            })
                                .then(res => {
                                    if (res.ok) alert("Message sent successfully!");
                                    else alert("Failed to send message.");
                                })
                                .catch(err => console.error(err));
                        }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                                    <input
                                        name="firstName"
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-900 placeholder-slate-400"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-900 placeholder-slate-400"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-900 placeholder-slate-400"
                                    placeholder="john@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-900 placeholder-slate-400 resize-none"
                                    placeholder="Tell us how we can help..."
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                                Send Message <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Contact Info & Map */}
                    <div className="space-y-12 order-1 lg:order-2">

                        {/* Info Cards */}
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Email</h3>
                                    <p className="text-slate-500 mb-2 text-sm leading-relaxed">Our friendly team is here to help.</p>
                                    <a href="mailto:support@aquection.com" className="text-blue-600 font-semibold hover:underline">support@aquection.com</a>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Office</h3>
                                    <p className="text-slate-500 mb-2 text-sm leading-relaxed">
                                        Come say hello at our office HQ.
                                    </p>
                                    <p className="text-slate-800 font-medium text-sm">
                                        32, 1St Main Road,<br />
                                        Ayyappa Nagar, Virugambakkam,<br />
                                        Chennai - 600092
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Phone</h3>
                                    <p className="text-slate-500 mb-2 text-sm leading-relaxed">Mon-Fri from 9am to 6pm.</p>
                                    <a href="tel:+919655771091" className="text-blue-600 font-semibold hover:underline">+91 - 9655771091</a>
                                </div>
                            </div>
                        </div>

                        {/* Map Container */}
                        <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative shadow-inner">
                            <div className="absolute inset-0 grayscale contrast-[0.9] opacity-70">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2788.4021434979863!2d80.18824307321152!3d13.063853112852767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267324f4ab783%3A0x5a5319e17f3a0a4b!2sGayathri%20Thiruvengadam%20%26%20Associates!5e1!3m2!1sen!2sin!4v1770635103522!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
