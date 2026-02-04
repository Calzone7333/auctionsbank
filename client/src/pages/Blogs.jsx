import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Clock, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blogs = () => {
    const [activeTab, setActiveTab] = useState('All');

    // Mock Data for Blogs
    const blogs = [
        {
            id: 1,
            title: "Top 5 Tips for Buying Bank Auction Properties",
            excerpt: "Navigating the world of bank auctions can be tricky. Here are the top 5 strategies to ensure you get the best deal without hidden risks.",
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
            author: "Sarah Jenkins",
            date: "Feb 12, 2025",
            readTime: "5 min read",
            category: "Guide",
            featured: true
        },
        {
            id: 2,
            title: "Understanding E-Auctions: A Beginner's Guide",
            excerpt: "What is an E-Auction? How does it differ from a physical auction? We break down the process step-by-step for first-time bidders.",
            image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
            author: "Rahul Sharma",
            date: "Feb 10, 2025",
            readTime: "8 min read",
            category: "Education",
            featured: false
        },
        {
            id: 3,
            title: "Commercial vs Residential: Where to Invest?",
            excerpt: "Analyzing the ROI of commercial spaces versus residential properties in the current Indian market context.",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
            author: "Priya Mehta",
            date: "Feb 08, 2025",
            readTime: "6 min read",
            category: "Investment",
            featured: false
        },
        {
            id: 4,
            title: "Legal Checklist Before Bidding",
            excerpt: "Don't get caught in legal tangles. Use this comprehensive checklist to verify documents.",
            image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
            author: "Legal Team",
            date: "Feb 05, 2025",
            readTime: "10 min read",
            category: "Legal",
            featured: false
        },
        {
            id: 5,
            title: "The Future of Real Estate in 2026",
            excerpt: "Experts predict a surge in affordable housing. Find out what this means for auction properties.",
            image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?q=80&w=1000&auto=format&fit=crop",
            author: "Ankit Verma",
            date: "Feb 01, 2025",
            readTime: "4 min read",
            category: "Trends",
            featured: false
        }
    ];

    const categories = ['All', 'Guide', 'Education', 'Investment', 'Legal', 'Trends'];

    const filteredBlogs = activeTab === 'All' ? blogs : blogs.filter(b => b.category === activeTab);
    const featuredBlog = blogs.find(b => b.featured);

    return (
        <div className="bg-slate-50 min-h-screen font-sans">

            {/* Header with Search */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-900">Aquection<span className="text-aq-gold">.</span> Insights</h1>
                        <p className="text-sm text-slate-500">Your daily dose of real estate intelligence.</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full bg-slate-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-aq-gold/20 focus:border-aq-gold transition-all"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Featured Post - Large Horizontal Layout */}
                {featuredBlog && activeTab === 'All' && (
                    <div className="mb-16">
                        <Link to="#" className="group relative block rounded-3xl overflow-hidden shadow-2xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                                {/* Image Side */}
                                <div className="relative h-64 lg:h-auto overflow-hidden">
                                    <div className="absolute inset-0 bg-aq-blue/20 group-hover:bg-transparent transition-colors z-10 w-full h-full"></div>
                                    <img
                                        src={featuredBlog.image}
                                        alt={featuredBlog.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                {/* Content Side */}
                                <div className="bg-aq-blue text-white p-8 md:p-12 flex flex-col justify-center relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <div className="w-32 h-32 rounded-full border-2 border-white"></div>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-aq-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Featured</span>
                                        <span className="text-slate-300 text-sm">{featuredBlog.readTime}</span>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight group-hover:text-aq-gold transition-colors">
                                        {featuredBlog.title}
                                    </h2>

                                    <p className="text-slate-300 mb-8 text-lg font-light leading-relaxed">
                                        {featuredBlog.excerpt}
                                    </p>

                                    <div className="flex items-center gap-3 mt-auto">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{featuredBlog.author}</p>
                                            <p className="text-xs text-slate-400">{featuredBlog.date}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-10 border-b border-gray-200 pb-4">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === cat
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid Layout for Other Posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBlogs.map((blog) => (
                        // Skip featured blog in the grid if showing 'All'
                        (activeTab === 'All' && blog.featured) ? null : (
                            <Link to="#" key={blog.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm">
                                        {blog.category}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center text-xs text-slate-400 mb-3 gap-3">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {blog.date}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}</span>
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-slate-900 mb-3 leading-snug group-hover:text-aq-blue transition-colors">
                                        {blog.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                                        {blog.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                        <span className="text-xs font-semibold text-slate-600">{blog.author}</span>
                                        <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-aq-gold group-hover:text-white transition-all">
                                            <ChevronRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    ))}
                </div>

            </div>

            {/* Newsletter Minimal */}
            <div className="border-t border-gray-100 bg-white py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">Subscribe to our newsletter</h3>
                    <p className="text-slate-500 mb-8">Get the latest posts delivered right to your email.</p>
                    <div className="flex bg-slate-50 border border-gray-200 rounded-full p-1.5 focus-within:ring-2 focus-within:ring-aq-gold/20 focus-within:border-aq-gold transition-all shadow-sm">
                        <input type="email" placeholder="Enter your email" className="flex-grow bg-transparent px-4 py-2 outline-none text-slate-700 placeholder-slate-400" />
                        <button className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-aq-blue transition-colors">Subscribe</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Blogs;
