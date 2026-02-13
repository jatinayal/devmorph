
import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, Send, ChevronDown } from 'lucide-react';
import api from "../configs/axios";

const ContactSection = () => {
    const [formData, setFormData] = useState({
        email: '',
        subject: 'General Inquiry',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const subjects = [
        'General Inquiry',
        'Technical Issue',
        'Feature Request',
        'Billing',
        'Other'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user sees typing
        if (status === 'error') setStatus('idle');
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            setStatus('error');
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        if (!formData.subject) {
            setStatus('error');
            setErrorMessage('Please select a subject.');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await api.post('/api/contact', formData);

            if (response.data.success) {
                setStatus('success');
                setFormData({ email: '', subject: 'General Inquiry', message: '' });
            } else {
                throw new Error(response.data.message || 'Something went wrong.');
            }
        } catch (error) {
            console.error("Contact form error:", error);
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Failed to send message. Please try again.');
        }
    };

    return (
        <section id="contact" className="py-24 relative overflow-hidden">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="
            inline-block
            text-lime-400
            text-sm
            font-bold
            uppercase
            tracking-widest
            mb-4
          ">
                        Get in Touch
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                        Have a question?
                    </h2>
                    <p className="text-white/60 text-lg">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="
          bg-white/5 
          backdrop-blur-xl 
          border border-white/10 
          rounded-3xl 
          p-8 md:p-12
          relative
        ">
                    {/* Status Overlay */}
                    {status === 'success' ? (
                        <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-lime-400/20 text-lime-400 mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                            <p className="text-white/60 mb-8">
                                Thank you for reaching out. We've sent a confirmation to your email.
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="
                  px-8 py-3 
                  rounded-xl 
                  bg-lime-400 
                  text-black 
                  font-semibold 
                  hover:bg-lime-300 
                  transition
                "
                            >
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Email Logic */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 ml-1">Email <span className="text-lime-400">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className="
                    w-full 
                    bg-black/40 
                    border border-white/10 
                    rounded-xl 
                    px-5 py-4 
                    text-white 
                    placeholder:text-white/30 
                    focus:outline-none 
                    focus:border-lime-400/50 
                    focus:ring-1 focus:ring-lime-400/50
                    transition-all
                  "
                                    required
                                />
                            </div>

                            {/* Subject Dropdown */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 ml-1">Subject <span className="text-lime-400">*</span></label>
                                <div className="relative">
                                    <div
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`
                                            w-full 
                                            bg-black/40 
                                            border 
                                            ${isDropdownOpen ? 'border-lime-400/50 ring-1 ring-lime-400/50' : 'border-white/10'}
                                            rounded-xl 
                                            px-5 py-4 
                                            text-white 
                                            cursor-pointer
                                            flex items-center justify-between
                                            transition-all
                                        `}
                                    >
                                        <span>{formData.subject}</span>
                                        <ChevronDown
                                            size={18}
                                            className={`text-white/50 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </div>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="
                                            absolute 
                                            top-full 
                                            left-0 
                                            right-0 
                                            mt-2 
                                            bg-[#0a0a0a] 
                                            border border-white/10 
                                            rounded-xl 
                                            overflow-hidden 
                                            shadow-xl 
                                            z-50
                                            animate-in fade-in zoom-in-95 duration-200
                                        ">
                                            {subjects.map(sub => (
                                                <div
                                                    key={sub}
                                                    onClick={() => {
                                                        setFormData({ ...formData, subject: sub });
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`
                                                        px-5 py-3 
                                                        cursor-pointer 
                                                        transition-colors
                                                        text-sm
                                                        ${formData.subject === sub ? 'text-lime-400 bg-white/5' : 'text-white/80 hover:text-white hover:bg-white/5'}
                                                    `}
                                                >
                                                    {sub}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 ml-1">Message <span className="text-white/40 font-normal ml-1">(Optional)</span></label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="How can we help you?"
                                    rows={4}
                                    className="
                    w-full 
                    bg-black/40 
                    border border-white/10 
                    rounded-xl 
                    px-5 py-4 
                    text-white 
                    placeholder:text-white/30 
                    focus:outline-none 
                    focus:border-lime-400/50 
                    focus:ring-1 focus:ring-lime-400/50
                    transition-all
                    resize-none
                  "
                                />
                            </div>

                            {/* Error Message */}
                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-3 rounded-lg text-sm">
                                    <AlertCircle size={16} />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="
                  w-full 
                  bg-lime-400 
                  text-black 
                  font-bold 
                  px-8 py-4 
                  rounded-xl 
                  hover:bg-lime-300 
                  transition-all 
                  disabled:opacity-70 
                  disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                "
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Decorative Glow */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-lime-400/20 blur-[100px] pointer-events-none rounded-full mix-blend-screen" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full mix-blend-screen" />
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
