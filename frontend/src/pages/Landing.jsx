"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-70"
            initial={{
              x: Math.random() * 100 + "%",
              y: -10,
              opacity: 0.1 + Math.random() * 0.5,
              scale: 0.5 + Math.random() * 1.5,
            }}
            animate={{ y: "120vh", opacity: 0 }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <main className="text-center max-w-3xl">
              <motion.h1
                className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="block">Welcome to</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 relative">
                  Slot Mint
                  <motion.span
                    className="absolute -top-6 -right-10 text-purple-300"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.span>
                  <motion.span
                    className="absolute top-10 -right-6 text-purple-300"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.span>
                  <motion.span
                    className="absolute -top-6 right-10 text-purple-300"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.span>
                </span>
              </motion.h1>
              <motion.p
                className="mt-4 text-base text-gray-300 sm:text-lg md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Create and book unique experiences on the Solana blockchain.
                Each booking is minted as a unique NFT, providing verifiable
                proof of your reservation and exclusive access to experiences.
              </motion.p>
              <motion.div
                className="mt-6 flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to="/create"
                  className="group relative px-8 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 hover:from-purple-500 hover:via-purple-400 hover:to-indigo-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Create Experience
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-indigo-500/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
                </Link>
                <Link
                  to="/experiences"
                  className="group relative px-8 py-3 text-base font-medium rounded-lg text-purple-600 bg-white hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1 border-2 border-purple-500/20 hover:border-purple-500/40"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Browse Experiences
                    <Sparkles className="w-4 h-4 text-purple-500 group-hover:animate-pulse" />
                  </span>
                </Link>
              </motion.div>
            </main>
          </div>
        </div>

        {/* Decorative Gradient Bubbles */}
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <motion.div
            className="h-56 w-56 absolute top-1/4 right-1/4 rounded-full bg-gradient-to-r from-purple-600/30 to-blue-500/30 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="h-64 w-64 absolute bottom-1/4 right-1/3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-800/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              className="text-base text-purple-400 font-semibold tracking-wide uppercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Features
            </motion.h2>
            <motion.p
              className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Everything you need to manage experiences
            </motion.p>
          </div>

          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature Item */}
            {[
              {
                title: "NFT-Backed Bookings",
                desc: "Every booking is minted as a unique NFT, providing verifiable proof of your reservation and exclusive access.",
                iconPath: "M5 13l4 4L19 7",
              },
              {
                title: "Create Experiences",
                desc: "Easily create and manage your events with flexible time slots and NFT-based reservations.",
                iconPath: "M12 6v6m0 0v6m0-6h6m-6 0H6",
              },
              {
                title: "Secure Payments",
                desc: "Instantly book slots with secure Solana blockchain payments and receive your booking NFT.",
                iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white shadow-lg shadow-purple-500/30 px-2 py-2">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={feature.iconPath}
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-300">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              className="text-base text-purple-400 font-semibold tracking-wide uppercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Book, Mint, Experience
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Browse & Book",
                desc: "Find your perfect experience and select your preferred time slot",
              },
              {
                step: "02",
                title: "Mint NFT",
                desc: "Your booking is automatically minted as a unique NFT on Solana",
              },
              {
                step: "03",
                title: "Enjoy Experience",
                desc: "Show your NFT for exclusive access to your booked experience",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-purple-400/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mt-4">
                  {step.title}
                </h3>
                <p className="mt-2 text-gray-300">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-800/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              className="text-base text-purple-400 font-semibold tracking-wide uppercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Benefits
            </motion.h2>
            <motion.p
              className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Why Choose NFT Bookings?
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Verifiable Proof",
                desc: "Each booking is permanently recorded on the Solana blockchain",
              },
              {
                title: "Exclusive Access",
                desc: "Your NFT serves as a digital key to your booked experience",
              },
              {
                title: "Secure Payments",
                desc: "All transactions are secured by Solana's blockchain technology",
              },
              {
                title: "No Middlemen",
                desc: "Direct booking between creators and participants",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-purple-400/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <h3 className="text-lg font-bold text-white">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-gray-300 text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:max-w-2xl">
              <motion.h2
                className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Ready to transform your booking experience?
              </motion.h2>
              <motion.p
                className="mt-3 text-lg text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Join the future of experience booking with blockchain
                technology. Create your first NFT-backed experience today.
              </motion.p>
            </div>
            <motion.div
              className="mt-8 lg:mt-0 lg:ml-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                <button className="group relative px-8 py-3 text-base font-medium rounded-lg text-purple-600 bg-gradient-to-r from-white to-gray-100 hover:from-gray-50 hover:to-white transition-all duration-300 shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1">
                  <Link to="/experiences" className="relative z-10 flex items-center justify-center gap-2">
                    Get Started
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/10 via-purple-500/10 to-indigo-500/10 blur-xl group-hover:blur-2xl transition-all duration-300" />
                </button>
                <button className="group relative px-8 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-indigo-500/20 hover:from-purple-600/30 hover:via-purple-500/30 hover:to-indigo-500/30 transition-all duration-300 border-2 border-purple-500/30 hover:border-purple-500/50 backdrop-blur-sm">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Learn More
                    <Sparkles className="w-4 h-4 text-purple-300 group-hover:animate-pulse" />
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
