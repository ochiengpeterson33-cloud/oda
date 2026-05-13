import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, ShieldCheck, Globe2, Building2, PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-earth-beige">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-earth-brown tracking-tight mb-8"
            >
              The Trusted Network for <br className="hidden md:block"/>
              <span className="text-earth-olive">Global B2B Commerce</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-earth-gray-dark mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              Connect with vetted suppliers, streamline your procurement, and scale your business with Oda's premium B2B marketplace.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register" className="w-full sm:w-auto bg-earth-olive hover:bg-earth-olive-dark text-white px-8 py-4 rounded-lg font-medium text-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-earth-olive/20">
                Start Sourcing <ArrowRight size={20} />
              </Link>
              <Link to="/register?role=seller" className="w-full sm:w-auto bg-surface border border-earth-sand text-earth-brown hover:bg-earth-sand/30 hover:border-earth-sand px-8 py-4 rounded-lg font-medium text-lg transition-all flex items-center justify-center mt-4 sm:mt-0">
                Become a Supplier
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -ml-32 w-96 h-96 bg-earth-sand/30 rounded-full blur-3xl -z-0"></div>
        <div className="absolute top-0 right-0 -mr-20 w-80 h-80 bg-earth-terracotta/10 rounded-full blur-3xl -z-0"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface border-t border-earth-sand/30 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-earth-brown mb-4">Why choose Oda?</h2>
            <p className="text-earth-gray-dark max-w-2xl mx-auto">Built specifically for the complexities of modern B2B transactions.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<ShieldCheck size={32} className="text-earth-olive" />}
              title="Verified Suppliers"
              description="Every supplier goes through a rigorous vetting process. Trade with confidence knowing your partners are certified."
            />
            <FeatureCard 
              icon={<PackageSearch size={32} className="text-earth-terracotta" />}
              title="Smart Sourcing"
              description="Advanced search and filtering capabilities. Find exactly what your business needs in a fraction of the time."
            />
            <FeatureCard 
              icon={<BarChart3 size={32} className="text-earth-olive" />}
              title="Procurement Analytics"
              description="Track your spending, manage RFQs, and optimize your supplier network from a centralized dashboard."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-earth-olive text-earth-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How Oda Works</h2>
            <p className="text-earth-sand-light max-w-2xl">A streamlined flow from discovery to delivery.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Step number="01" title="Discover" desc="Search thousands of verified products." />
            <Step number="02" title="Connect" desc="Message suppliers directly via platform." />
            <Step number="03" title="Negotiate" desc="Manage RFQs and lock in bulk pricing." />
            <Step number="04" title="Transact" desc="Securely finalize orders online." />
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 bg-earth-brown text-center text-white border-b border-earth-sand/30">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Simplify your supply chain with oda.</h2>
          <p className="text-earth-sand italic font-light mb-8">Automated invoicing, real-time tracking, and verified quality control for every transaction.</p>
          <Link to="/register" className="inline-block bg-earth-terracotta text-white px-10 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform">
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-surface border border-earth-sand/30 p-8 rounded-2xl shadow-sm"
  >
    <div className="bg-earth-beige w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-earth-brown mb-3">{title}</h3>
    <p className="text-earth-gray-dark leading-relaxed">{description}</p>
  </motion.div>
);

const Step = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div>
    <div className="text-earth-sand font-mono text-xl mb-4">{number}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-earth-sand-light">{desc}</p>
  </div>
);
