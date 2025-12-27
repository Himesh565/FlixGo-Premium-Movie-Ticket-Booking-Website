import React from 'react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-36 px-4 md:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-luxury text-gold-500 mb-4">
                        Terms and Conditions
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
                </div>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-gold-500/30 transition-colors">
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using the FlixGo website and services, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-gold-500/30 transition-colors">
                        <h2 className="text-2xl font-bold text-white mb-4">2. Movie Ticket Booking</h2>
                        <ul className="list-disc pl-6 space-y-2 text-gold-100/80">
                            <li>Tickets once confirmed cannot be cancelled, exchanged, or refunded unless explicitly stated.</li>
                            <li>Users must be at least 18 years of age to book A rated movies.</li>
                            <li>Seat allocation is subject to availability and confirmation by the theater.</li>
                        </ul>
                    </section>

                    <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-gold-500/30 transition-colors">
                        <h2 className="text-2xl font-bold text-white mb-4">3. Payment and Pricing</h2>
                        <p>
                            Prices for movie tickets are subject to change without prior notice. The price charged will be as applicable at the time of booking. Additional convenience fees and taxes may apply.
                        </p>
                    </section>

                    <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-gold-500/30 transition-colors">
                        <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>
                        <p>
                            FlixGo is an intermediary and is not responsible for the quality of the movie or the amenities at the theater. Our liability is limited to the value of the ticket booked.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
