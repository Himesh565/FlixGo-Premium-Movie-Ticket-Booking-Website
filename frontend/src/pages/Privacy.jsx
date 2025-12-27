import React from 'react';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-black text-gray-300 py-20 px-4">
            <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-luxury font-bold text-white mb-8 text-center">
                    Privacy <span className="text-gold-500">Policy</span>
                </h1>

                <div className="space-y-6 text-sm md:text-base leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
                        <p>
                            We collect information that you provide directly to us when you create an account, make a booking, or communicate with us. This includes:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
                            <li>Name and contact information (email address).</li>
                            <li>Payment information (processed securely by third-party providers).</li>
                            <li>Booking history and preferences.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
                        <p>
                            We use the collected information for the following purposes:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
                            <li>To process and confirm your movie ticket bookings.</li>
                            <li>To send you booking confirmations and updates.</li>
                            <li>To improve our website and customer service.</li>
                            <li>To prevent fraud and ensure security.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Cookies</h2>
                        <p>
                            We use cookies to enhance your experience on our website. Cookies help us remember your preferences and keep you logged in. You can control cookie settings through your browser.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Third-Party Services</h2>
                        <p>
                            We may share your information with third-party service providers (such as payment gateways) solely for the purpose of fulfilling your service requests. We do not sell your personal data to advertisers.
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

export default Privacy;
