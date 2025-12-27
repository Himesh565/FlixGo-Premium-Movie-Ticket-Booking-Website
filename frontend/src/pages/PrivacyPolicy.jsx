import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-36 px-4 md:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-luxury text-gold-500 mb-4">
                        Privacy Policy
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
                </div>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-gold-500/30 transition-colors">
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                        <p>
                            At FlixGo, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal information when you visit our website.
                        </p>
                    </section>

                    <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-gold-500/30 transition-colors">
                        <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
                        <p className="mb-4">
                            We may collect, use, store and transfer different kinds of personal data about you:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gold-100/80">
                            <li><strong>Identity Data:</strong> includes first name, last name, username.</li>
                            <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                            <li><strong>Transaction Data:</strong> includes details about payments and bookings.</li>
                        </ul>
                    </section>

                    <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-gold-500/30 transition-colors">
                        <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Data</h2>
                        <p>
                            We will only use your personal data when the law allows us to. We use it to process your ticket bookings, manage our relationship with you, and improve our services.
                        </p>
                    </section>

                    <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-gold-500/30 transition-colors">
                        <h2 className="text-2xl font-bold text-white mb-4">4. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy, please contact us at: <span className="text-gold-500">privacy@flixgo.com</span>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
