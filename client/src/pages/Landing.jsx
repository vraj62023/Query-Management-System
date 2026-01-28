import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="font-sans text-slate-900">
            
            {/* 1. HERO SECTION (Split Layout) */}
            <header className="relative overflow-hidden bg-white pt-16 pb-32 lg:pt-24 lg:pb-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        
                        {/* Text Content */}
                        <div className="text-center lg:text-left">
                            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wide uppercase mb-6">
                                New: Query Management System For Your Organization
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
                                Turn Chaos into <br />
                                <span className="text-blue-600">Resolved Tickets.</span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                The internal helpdesk that actually helps. Streamline requests, track performance, and empower your team heads to solve problems faster.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                    Start Free Trial
                                </Link>
                                <Link to="/login" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-all">
                                    Live Demo
                                </Link>
                            </div>
                            
                            {/* Small Social Proof Text */}
                            <p className="mt-6 text-sm text-slate-500">
                                ⭐ Trusted by 500+ Engineering Teams
                            </p>
                        </div>

                        {/* Visual / Image Placeholder */}
                        <div className="relative lg:block">
                            {/* Decorative Blob Background */}
                            <div className="absolute top-0 -right-4 -z-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                            <div className="absolute -bottom-8 left-20 -z-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                            
                            {/* The "Image" (Using a nice card UI mock as a placeholder) */}
                            <div className="relative rounded-2xl bg-white/30 backdrop-blur-xl border border-white/20 shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="space-y-4">
                                    <div className="h-8 w-1/3 bg-slate-800/10 rounded-lg"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-slate-800/10 rounded"></div>
                                        <div className="h-4 w-5/6 bg-slate-800/10 rounded"></div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <div className="h-20 w-full bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-center text-blue-600 font-bold">
                                            Ticket #402 Resolved
                                        </div>
                                        <div className="h-20 w-full bg-green-500/10 rounded-xl border border-green-500/20 flex items-center justify-center text-green-600 font-bold">
                                            98% Efficiency
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </header>

            {/* 2. LOGO STRIP (Fills space, adds authority) */}
            <div className="border-y border-slate-100 bg-slate-50 py-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Powering Support for</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Simple Text Logos as placeholders */}
                        <span className="text-xl font-bold text-slate-600">AcmeCorp</span>
                        <span className="text-xl font-bold text-slate-600">GlobalBank</span>
                        <span className="text-xl font-bold text-slate-600">TechStart</span>
                        <span className="text-xl font-bold text-slate-600">Nebula</span>
                        <span className="text-xl font-bold text-slate-600">CloudSystem</span>
                    </div>
                </div>
            </div>

            {/* 3. FEATURE GRID (With Icons) */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to manage requests</h2>
                        <p className="text-lg text-slate-600">Stop using spreadsheets and email chains. Switch to a system designed for resolution.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Smart Assignment", desc: "Automatically route queries to the specific Department Head based on expertise.", icon: "⚡" },
                            { title: "Real-time Tracking", desc: "Watch the status flip from Pending to Resolved instantly without refreshing.", icon: "🔄" },
                            { title: "Role-Based Security", desc: "Admins, Heads, and Users see exactly what they need to see. Nothing more.", icon: "🛡️" }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-xl transition-shadow duration-300 hover:border-blue-100 group">
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. TESTIMONIALS (Social Proof) */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-16">Loved by Engineering Teams</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <p className="text-lg text-slate-700 italic mb-6">"Finally, a system where I don't have to chase people to get my software installed. I raised a ticket, and the IT Head solved it in 10 minutes."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                                <div>
                                    <div className="font-bold text-slate-900">Alex Johnson</div>
                                    <div className="text-sm text-slate-500">Senior Developer</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <p className="text-lg text-slate-700 italic mb-6">"The dashboard view is a lifesaver. I can see exactly which department is overloaded and re-assign tasks instantly."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                                <div>
                                    <div className="font-bold text-slate-900">Sarah Williams</div>
                                    <div className="text-sm text-slate-500">Operations Manager</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FINAL CTA (The "Footer Hook") */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to streamline your workflow?</h2>
                    <p className="text-slate-400 text-lg mb-8">Join 500+ teams resolving queries faster today.</p>
                    <Link to="/register" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/50">
                        Get Started for Free
                    </Link>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
                    <p>&copy; 2026 QueryFlow Systems. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;