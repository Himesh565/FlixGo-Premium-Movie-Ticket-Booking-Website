import React from 'react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-black text-gray-300 py-20 px-4">
            <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-luxury font-bold text-white mb-8 text-center">
                    Terms & <span className="text-gold-500">Conditions</span>
                </h1>

                <div className="space-y-6 text-sm md:text-base leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
                        <p>
                            Welcome to FlixGo. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. User Accounts</h2>
                        <p>
                            To access certain features of the website, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Movie Bookings</h2>
                        <p>
                            All bookings made through FlixGo are subject to availability. Prices for tickets are subject to change without notice. Once a ticket is booked, it is confirmed immediately upon payment success.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Refunds & Cancellation Policy</h2>
                        <p className="mb-2">
                            <strong>Cancellations:</strong> Tickets can be cancelled up to 4 hours before the showtime for a refund. No refunds will be provided for cancellations made within 4 hours of the showtime.
                        </p>
                        <p>
                            <strong>Payment Failures:</strong> In the event of a payment failure where the amount has been deducted from your account but the ticket was not booked, the amount will be automatically refunded to your original payment method within <strong>5-7 business days</strong>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Intellectual Property</h2>
                        <p>
                            The content, organization, graphics, design, and other matters related to the Site are protected under applicable copyrights and other proprietary laws. Copying, redistribution, use, or publication by you of any such matters or any part of the Site is strictly prohibited.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Your continued use of the site after any such changes constitutes your acceptance of the new terms.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
                        Last updated: December 2025
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
