import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/verify-email?token=${token}`);
                if (res.ok) {
                    setStatus('success');
                    setTimeout(() => navigate('/?verified=true'), 3000);
                } else {
                    setStatus('error');
                }
            } catch (e) {
                setStatus('error');
            }
        };

        verify();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-display">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                {status === 'verifying' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-aq-blue animate-spin" />
                        <h2 className="text-xl font-bold text-slate-800">Verifying your email...</h2>
                    </div>
                )}
                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                        <h2 className="text-2xl font-bold text-slate-900">Email Verified!</h2>
                        <p className="text-slate-500">Your email has been successfully verified. Redirecting you to home...</p>
                    </div>
                )}
                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <XCircle className="w-16 h-16 text-red-500" />
                        <h2 className="text-2xl font-bold text-slate-900">Verification Failed</h2>
                        <p className="text-slate-500">The link may be invalid or expired.</p>
                        <button onClick={() => navigate('/')} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">Go Home</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
