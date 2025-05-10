"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"

export default function Landing() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

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
              repeat: Infinity,
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
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.span>
                  <motion.span
                    className="absolute top-10 -right-6 text-purple-300"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.span>
                  <motion.span
                    className="absolute -top-6 right-10 text-purple-300"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
                Create and book unique experiences on the Solana blockchain. Host events or join one, all through secure and simple slot management.
              </motion.p>
              <motion.div
                className="mt-6 flex flex-col sm:flex-row justify-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to="/create"
                  className="px-8 py-3 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition duration-300 shadow hover:shadow-purple-500/20 transform hover:-translate-y-1"
                >
                  Create Experience
                </Link>
                <Link
                  to="/experiences"
                  className="px-8 py-3 text-base font-medium rounded-md text-purple-600 bg-white hover:bg-gray-100 transition duration-300 transform hover:-translate-y-1"
                >
                  Browse Experiences
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
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="h-64 w-64 absolute bottom-1/4 right-1/3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
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
                title: "Create Experiences",
                desc: "Easily create and manage your events with flexible time slots.",
                iconPath: "M12 6v6m0 0v6m0-6h6m-6 0H6",
              },
              {
                title: "Fast Booking",
                desc: "Instantly book slots with secure Solana blockchain payments.",
                iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
              },
              {
                title: "Minted Reservations",
                desc: "Receive NFTs as proof of reservation for your bookings.",
                iconPath: "M5 13l4 4L19 7",
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
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white shadow-lg shadow-purple-500/30">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.iconPath} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                  <p className="mt-1 text-sm text-gray-300">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
