import React, { useState } from 'react';
import { Check, ShieldCheck, Sparkles, Building2, Phone, FileText, MapPin, Zap, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../apiConfig';
import { useNavigate } from 'react-router-dom';

const Plans = () => {
    const { user, refreshUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const benefits = [
        { icon: MapPin, text: 'Unlock Complete Property Address & Locality' },
        { icon: FileText, text: 'Download Original Auction Notice & PDF' },
        { icon: Phone, text: 'Access Authorize Person & Bank Contact Details' },
        { icon: Building2, text: 'Direct Bank Communication Portal' },
        { icon: ShieldCheck, text: 'Verified Property Valuation Reports' },
        { icon: Zap, text: 'Early Access to New Auction Listings' }
    ];

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!user) {
            alert('Please login to purchase a premium plan');
            return;
        }

        if (user.accountType === 'PREMIUM') {
            alert('You are already a premium member');
            return;
        }

        setIsProcessing(true);

        try {
            // Load Razorpay Script
            const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

            if (!res) {
                alert("Razorpay SDK failed to load. Are you online?");
                setIsProcessing(false);
                return;
            }

            // 1. Get Razorpay Key from Backend
            const keyRes = await fetch(`${API_BASE_URL}/payments/key`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (keyRes.status === 401 || keyRes.status === 403) {
                alert('Session expired. Please login again.');
                logout();
                return;
            }
            const keyData = await keyRes.json();
            const razorpayKey = keyData.key;

            if (!razorpayKey) {
                throw new Error("Invalid payment configuration on server");
            }

            // 2. Create Order on Backend
            const orderRes = await fetch(`${API_BASE_URL}/payments/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ amount: 999 })
            });

            if (orderRes.status === 401 || orderRes.status === 403) {
                alert('Session expired. Please login again.');
                logout();
                return;
            }

            if (!orderRes.ok) throw new Error('Failed to create order');
            const orderData = await orderRes.json();

            // 3. Open Razorpay Checkout
            const options = {
                key: razorpayKey,
                amount: orderData.amount,
                currency: orderData.currency || "INR",
                name: "Aquection Premium",
                description: "1 Month Elite Membership",
                image: "/logo.png", // Use local logo if available
                order_id: orderData.orderId,
                handler: async function (response) {
                    setIsProcessing(true);
                    try {
                        // 4. Verify Payment on Backend
                        const verifyRes = await fetch(`${API_BASE_URL}/payments/verify-payment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${user.token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const result = await verifyRes.json();

                        if (verifyRes.ok) {
                            alert('Congratulations! Your account has been upgraded to PREMIUM.');
                            await refreshUser();
                            // Refresh and redirect
                            window.location.href = '/dashboard';
                        } else {
                            alert(result.message || 'Payment verification failed.');
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                        alert("Error verifying payment. Please contact support.");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: user.fullName || "",
                    email: user.email || "",
                    contact: user.phoneNumber || ""
                },
                theme: {
                    color: "#0052cc"
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert(error.message || 'Something went wrong. Please try again later.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-brand-blue/20">
                        <Sparkles size={12} /> Membership
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter uppercase">
                        Choose Your <span className="text-brand-blue">Elite Plan</span>
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base font-medium">
                        Invest in your future with premium access to verified property auctions.
                        Get all the hidden details you need to make informed decisions.
                    </p>
                </div>

                {/* Plan Card */}
                <div className="max-w-md mx-auto relative">
                    {/* Background Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-emerald-400 rounded-3xl blur opacity-20"></div>

                    <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-full transform transition-transform hover:scale-[1.02] duration-300">
                        {/* Plan Header */}
                        <div className="bg-brand-dark p-8 text-white relative">
                            <div className="absolute top-4 right-4 animate-pulse">
                                <Zap className="text-brand-blue fill-brand-blue" size={24} />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-widest mb-2">Premium Member</h3>
                            <div className="flex items-baseline gap-1 mt-4">
                                <span className="text-2xl font-bold uppercase tracking-tight text-brand-blue">Only</span>
                                <span className="text-5xl font-black tracking-tighter">₹999</span>
                                <span className="text-slate-400 font-bold">/month</span>
                            </div>
                        </div>

                        {/* Benefits List */}
                        <div className="p-8 flex-1 space-y-6">
                            <ul className="space-y-4">
                                {benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-start gap-4 group">
                                        <div className="mt-0.5 p-1 bg-emerald-50 text-emerald-600 rounded-md group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <benefit.icon className="w-4 h-4 text-slate-400 group-hover:text-brand-blue transition-colors" />
                                            <span className="text-[13px] font-bold text-slate-600 group-hover:text-brand-dark transition-colors">{benefit.text}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Footer / CTA */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100">
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full bg-brand-blue hover:bg-brand-dark text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:shadow-brand-dark/20 transition-all active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Become Premium Member
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <p className="text-center mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Instant Activation • 30 Days Validity
                            </p>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" crossOrigin="anonymous" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" crossOrigin="anonymous" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-4" crossOrigin="anonymous" />
                    <span className="text-sm font-black tracking-widest uppercase text-slate-900 italic">RAZORPAY</span>
                </div>
            </div>
        </div>
    );
};

export default Plans;
