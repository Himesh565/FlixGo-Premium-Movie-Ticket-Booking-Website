import React from 'react';

const AboutUs = () => {
    const developers = [
        {
            name: "Himesh Ambaliya",
            role: "Full Stack Web Developer",
            image: "/creators/himesh.png",
            bio: "Passionate about building scalable web applications and crafting seamless user experiences. Expert in React and Node.js ecosystems.",
            skills: ["React", "Node.js", "MongoDB", "Tailwind"]
        },
        {
            name: "Hemanshu Nirmal",
            role: "Backend Developer",
            image: "/creators/hemanshu.png",
            bio: "Dedicated to designing robust server-side architectures and ensuring data security. Specialist in API development and database optimization.",
            skills: ["Express", "MongoDB", "REST APIs", "Auth"]
        },
        {
            name: "Deep Makwana",
            role: "Frontend Developer",
            image: "/creators/deep.png",
            bio: "Creative developer with a keen eye for design. Focused on creating intuitive and aesthetically pleasing user interfaces.",
            skills: ["React", "UI/UX", "CSS", "Animations"]
        }
    ];

    const stats = [
        { label: "Active Users", value: "10k+" },
        { label: "Cities", value: "50+" },
        { label: "Movies", value: "1000+" },
        { label: "Theaters", value: "200+" }
    ];

    const features = [
        {
            title: "Seamless Booking",
            description: "Book your tickets in just a few clicks with our optimized and user-friendly interface.",
            icon: "🎫"
        },
        {
            title: "Premium Experience",
            description: "Enjoy a visual treat with our modern, dark-themed gold aesthetic designed for cinema lovers.",
            icon: "✨"
        },
        {
            title: "Secure Payments",
            description: "Your transactions are safe with us. We use top-tier encryption for all payment processes.",
            icon: "🔒"
        },
        {
            title: "24/7 Support",
            description: "Need help? Our dedicated support team is available round the clock to assist you.",
            icon: "🎧"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-36 px-4 md:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold font-luxury text-gold-500 mb-6">
                        About FlixGo
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Redefining the way you experience cinema. We are more than just a ticket booking platform;
                        we are your gateway to the world of entertainment.
                    </p>
                </div>

                {/* Our Story Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 animate-fade-in">
                    <div className="order-2 md:order-1 relative">
                        <div className="absolute inset-0 bg-gold-500/20 blur-3xl rounded-full opacity-20"></div>
                        <img
                            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop"
                            alt="Cinema Hall"
                            className="relative rounded-2xl border border-white/10 shadow-2xl transform hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-3xl font-bold font-luxury text-white mb-6">Our Story</h2>
                        <div className="text-gray-400 space-y-4 leading-relaxed">
                            <p>
                                Founded in 2024 by a group of passionate BCA students, FlixGo started with a simple idea:
                                to make movie booking as exciting as the movie itself. We noticed that existing platforms
                                were functional but lacked the flair and premium feel that cinema deserves.
                            </p>
                            <p>
                                We set out to build a platform that combines cutting-edge technology with stunning design.
                                From our humble beginnings as a college project to a full-fledged booking solution,
                                our journey has been fueled by innovation and a love for movies.
                            </p>
                            <p>
                                Today, FlixGo stands as a testament to what happens when technology meets creativity.
                                We are committed to continuously improving and bringing you the best cinema experience possible.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-colors">
                            <div className="text-3xl md:text-4xl font-bold text-gold-500 mb-2">{stat.value}</div>
                            <div className="text-gray-400 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Why Choose Us Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold font-luxury text-center text-white mb-12">
                        Why Choose <span className="text-gold-500">FlixGo?</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="p-6 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl hover:border-gold-500/30 transition-all hover:-translate-y-1 group">
                                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech Stack Section */}
                <div className="mb-20 text-center">
                    <h2 className="text-2xl font-bold font-luxury text-white mb-8">Powered By Modern Tech</h2>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Vite'].map((tech) => (
                            <span key={tech} className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 font-mono text-sm hover:border-gold-500/50 hover:text-gold-500 transition-colors cursor-default">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Developers Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold font-luxury text-center text-white mb-12">
                        Meet The <span className="text-gold-500">Creators</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {developers.map((dev, index) => (
                            <div
                                key={index}
                                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-gold-500/10 flex flex-col h-full"
                            >
                                <div className="relative z-10 flex flex-col items-center text-center flex-grow">
                                    <div className="w-28 h-28 mb-4 rounded-full p-1 bg-gradient-to-br from-gold-500 to-transparent">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-black/50">
                                            <img
                                                src={dev.image}
                                                alt={dev.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gold-400 transition-colors">
                                        {dev.name}
                                    </h3>
                                    <div className="text-gold-500 text-sm font-semibold mb-3">
                                        {dev.role}
                                    </div>

                                    <p className="text-gray-400 text-sm mb-4 italic">"{dev.bio}"</p>

                                    <div className="flex flex-wrap justify-center gap-2 mt-auto">
                                        {dev.skills.map(skill => (
                                            <span key={skill} className="px-2 py-1 bg-black/40 rounded text-xs text-gray-300 border border-white/5">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
