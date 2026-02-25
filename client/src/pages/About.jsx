import React from 'react';
import { Target, Users, Shield, TrendingUp, Award, Globe, Rocket, BookOpen, Search, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="font-sans text-slate-800 bg-[#fbfcfd] overflow-hidden">

            {/* Hero Section */}
            <div
                className="relative pt-32 pb-32 md:pt-48 md:pb-48 text-center"
                style={{
                    backgroundImage: "url('/about_hero.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight drop-shadow-lg">
                        About Us
                    </h1>
                    <p className="text-lg md:text-xl text-white/95 mb-10 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                        From discovering prime bank auctions to seamless acquisitions, our platform empowers you to think beyond the confines of traditional real estate and invest with confidence.
                    </p>
                    <Link to="/auctions" className="px-8 py-3 bg-brand-blue text-white font-bold rounded-full hover:bg-white hover:text-brand-blue transition-colors shadow-xl shadow-brand-blue/30 inline-flex items-center gap-2 transform hover:-translate-y-1">
                        Join Now <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Alternating Values Section */}
            <div className="py-24 bg-[#fbfdf2]">
                <div className="text-center mb-24 relative max-w-2xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-display font-black text-brand-dark relative z-10 tracking-tight">
                        Empowering Investors to Achieve Success
                    </h2>
                    {/* Hand-drawn underline effect */}
                    <div className="absolute w-72 h-3 bg-brand-blue/30 -bottom-2 left-1/2 transform -translate-x-1/2 -rotate-1 z-0 rounded-full"></div>
                    <div className="absolute w-64 h-2 bg-brand-blue/20 -bottom-4 left-1/2 transform -translate-x-1/2 rotate-1 z-0 rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">

                    {/* Block 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 lg:pr-12">
                            <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-5 leading-tight">
                                Developing Confident and <br className="hidden md:block" /> Successful Investors
                            </h3>
                            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                                We rigorously vet each listing to ensure full transparency. Find genuine auction properties across the country with complete legal and procedural clarity, making your investment journey secure, reliable, and straightforward.
                            </p>
                            <Link to="/auctions" className="px-8 py-3 bg-brand-blue text-white font-bold rounded-full hover:shadow-lg transition-transform hover:-translate-y-1 inline-flex items-center gap-2">
                                View More <ArrowRight className="w-4 h-4 opacity-70" />
                            </Link>
                        </div>
                        <div className="order-1 lg:order-2 relative flex justify-center items-center">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-10 text-brand-blue/40 w-12 h-12">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5l-10 14M22 12H2M19 19L5 5" /></svg>
                            </div>
                            <div className="absolute -top-6 left-10 w-4 h-4 border-2 border-brand-blue/30 rounded-sm transform rotate-45"></div>

                            {/* Blob Image */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-brand-blue/10 transform translate-x-4 -translate-y-4 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%]"></div>
                                <img src="/about_confident.jpg"
                                    className="w-[280px] h-[280px] md:w-[380px] md:h-[380px] object-cover relative z-10 border-8 border-white shadow-xl rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%]"
                                    alt="Investment" />
                            </div>

                            {/* Squiggles */}
                            <div className="absolute -bottom-10 right-0 text-brand-dark/30 w-24 h-16">
                                <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                    <path d="M10,30 Q20,10 30,30 T50,30 T70,30 T90,30" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Block 2 (Reversed) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-1 relative flex justify-center items-center">
                            {/* Decorative Elements */}
                            <div className="absolute top-10 left-0 text-brand-blue/40 w-10 h-10">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" /></svg>
                            </div>
                            <div className="absolute top-0 right-20 w-3 h-3 border-2 border-brand-blue/30 rounded-sm transform -rotate-12"></div>

                            {/* Blob Image */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-brand-blue/10 transform -translate-x-4 translate-y-4 rounded-[50%_50%_30%_70%_/_60%_30%_70%_40%]"></div>
                                <img src="/about_analytics.jpg"
                                    className="w-[280px] h-[280px] md:w-[380px] md:h-[380px] object-cover relative z-10 border-8 border-white shadow-xl rounded-[40%_60%_70%_30%_/_50%_60%_40%_50%]"
                                    alt="Analytics" />
                            </div>

                            {/* Squiggles */}
                            <div className="absolute -bottom-10 left-10 text-brand-dark/30 w-24 h-16">
                                <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                    <path d="M10,30 Q15,50 25,30 T45,30 T65,30 T85,30" />
                                </svg>
                            </div>
                        </div>
                        <div className="order-2 lg:pl-12">
                            <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-5 leading-tight">
                                Enjoy Investing with a Unique <br className="hidden md:block" /> Platform Experience
                            </h3>
                            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                                Access comprehensive market valuations, legal checklists, and competitive analytics. We provide the intelligence you need to evaluate properties effectively and bid confidently in every auction, stripping away the guesswork.
                            </p>
                            <Link to="/auctions" className="px-8 py-3 bg-brand-blue text-white font-bold rounded-full hover:shadow-lg transition-transform hover:-translate-y-1 inline-flex items-center gap-2">
                                View More <ArrowRight className="w-4 h-4 opacity-70" />
                            </Link>
                        </div>
                    </div>

                    {/* Block 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                        <div className="order-2 md:order-1 md:pr-12">
                            <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-5 leading-tight">
                                Passionate Experts That <br className="hidden md:block" /> Make a Difference
                            </h3>
                            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                                Our dedicated team of real estate analysts and legal advisors are always here to guide you. We simplify complex bureaucratic processes, turning challenging auction participations into straightforward acquisitions for every user.
                            </p>
                            <Link to="/auctions" className="px-8 py-3 bg-brand-blue text-white font-bold rounded-full hover:shadow-lg transition-transform hover:-translate-y-1 inline-flex items-center gap-2">
                                View More <ArrowRight className="w-4 h-4 opacity-70" />
                            </Link>
                        </div>
                        <div className="order-1 md:order-2 relative flex justify-center items-center">
                            {/* Decorative Elements */}
                            <div className="absolute top-10 left-0 text-brand-blue/40 w-10 h-10">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M2 12h20" /></svg>
                            </div>
                            <div className="absolute -top-8 right-12 w-4 h-4 border-2 border-brand-blue/30 rounded-full"></div>

                            {/* Blob Image */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-brand-blue/10 transform translate-x-4 translate-y-2 rounded-[20%_80%_60%_40%_/_40%_60%_40%_60%]"></div>
                                <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80"
                                    className="w-[280px] h-[280px] md:w-[380px] md:h-[380px] object-cover relative z-10 border-8 border-white shadow-xl rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]"
                                    alt="Support" />
                            </div>

                            {/* Squiggles */}
                            <div className="absolute -bottom-8 right-10 text-brand-dark/30 w-24 h-16 transform -rotate-12">
                                <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                    <path d="M10,40 Q25,10 40,40 T70,40 T90,40" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team / Experts Section commented out */}

            {/* Why it works Section */}
            <div className="py-24 bg-[#fbfdf2] border-b-[20px] border-brand-blue">
                <div className="text-center mb-20 relative max-w-xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-display font-black text-brand-dark relative z-10 tracking-tight">
                        Why it works
                    </h2>
                    <div className="absolute w-44 h-3 bg-brand-blue/30 -bottom-2 left-1/2 transform -translate-x-1/2 -rotate-2 z-0 rounded-full"></div>
                    <div className="absolute w-36 h-2 bg-brand-blue/20 -bottom-4 left-1/2 transform -translate-x-1/2 rotate-1 z-0 rounded-full"></div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {/* Feature 1 */}
                        <div className="flex flex-col items-center px-4">
                            <div className="w-24 h-24 mb-6 relative flex justify-center items-center group">
                                <div className="absolute inset-0 bg-brand-blue/20 rounded-full transform -rotate-12 translate-x-1 translate-y-1 group-hover:rotate-0 transition-transform duration-300"></div>
                                <div className="w-16 h-16 bg-brand-dark rounded-[20px] shadow-lg flex items-center justify-center relative z-10 border-2 border-brand-blue/30 transform group-hover:-translate-y-1 transition-transform duration-300 text-white">
                                    <Target className="w-7 h-7 text-[#fff8e1]" />
                                </div>
                                <div className="absolute top-0 right-0 w-3 h-3 border-2 border-brand-blue rounded-sm rotate-12"></div>
                            </div>
                            <h4 className="font-bold text-lg text-brand-dark mb-3">Verified Listings</h4>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                We assure that all property details are vetted, cutting down on time wasted on expired or incorrect auctions.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="flex flex-col items-center px-4">
                            <div className="w-24 h-24 mb-6 relative flex justify-center items-center group">
                                <div className="absolute inset-0 bg-brand-blue/20 rounded-full transform rotate-12 -translate-x-1 translate-y-2 group-hover:rotate-0 transition-transform duration-300"></div>
                                <div className="w-16 h-16 bg-brand-dark rounded-[20px] shadow-lg flex items-center justify-center relative z-10 border-2 border-brand-blue/30 transform group-hover:-translate-y-1 transition-transform duration-300 text-white">
                                    <BookOpen className="w-7 h-7 text-[#fff8e1]" />
                                </div>
                                <div className="absolute top-2 -left-2 w-3 h-3 border-2 border-brand-blue rounded-full"></div>
                            </div>
                            <h4 className="font-bold text-lg text-brand-dark mb-3">Trusted Content</h4>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                Created by experts. Receive trusted legal and procedure manuals to bid securely and clearly.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="flex flex-col items-center px-4">
                            <div className="w-24 h-24 mb-6 relative flex justify-center items-center group">
                                <div className="absolute inset-0 bg-brand-blue/20 rounded-full transform -rotate-6 translate-x-2 -translate-y-1 group-hover:rotate-0 transition-transform duration-300"></div>
                                <div className="w-16 h-16 bg-brand-dark rounded-[20px] shadow-lg flex items-center justify-center relative z-10 border-2 border-brand-blue/30 transform group-hover:-translate-y-1 transition-transform duration-300 text-white">
                                    <TrendingUp className="w-7 h-7 text-[#fff8e1]" />
                                </div>
                                <div className="absolute -bottom-1 -right-2 w-3 h-3 border-2 border-brand-blue rounded-sm -rotate-45"></div>
                            </div>
                            <h4 className="font-bold text-lg text-brand-dark mb-3">Tools to empower investors</h4>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                Investors feel confident knowing their capability, understanding bids and meeting the goals of every auction.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
};

export default About;
