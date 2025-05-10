import React from "react"
import { motion } from "motion/react"
export const ExperienceLoader = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-purple-900 overflow-hidden relative">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-70"
              style={{
                width: Math.random() * 6 + 2 + "px",
                height: Math.random() * 6 + 2 + "px",
                background: `rgba(${150 + Math.random() * 100}, ${100 + Math.random() * 100}, ${200 + Math.random() * 55}, ${0.3 + Math.random() * 0.7})`,
              }}
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

        <div className="relative z-10 container mx-auto px-4 py-12">
          <motion.div
            className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-400/30 overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Loading Header */}
            <div className="relative bg-gradient-to-r from-purple-800/80 to-indigo-800/80 p-8 md:p-12 border-b border-purple-400/20">
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 bg-purple-500/30 rounded-full animate-pulse" />
                  <div className="h-4 w-24 bg-purple-500/30 rounded animate-pulse" />
                </div>

                <div className="h-8 w-3/4 bg-purple-500/30 rounded-lg animate-pulse mb-4" />
                <div className="h-4 w-full bg-purple-500/30 rounded animate-pulse mb-2" />
                <div className="h-4 w-5/6 bg-purple-500/30 rounded animate-pulse" />
              </div>
            </div>

            {/* Loading Content */}
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <div className="h-8 w-48 bg-purple-500/30 rounded-lg animate-pulse" />
                <div className="h-6 w-32 bg-purple-500/30 rounded-full animate-pulse" />
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-purple-500/20 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
}