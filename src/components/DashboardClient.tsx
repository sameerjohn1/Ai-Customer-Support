"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

function DashboardClient({ ownerId }: { ownerId: string }) {
  const navigate = useRouter();
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="text-lg font-semibold tracking-tight cursor-pointer"
            onClick={() => navigate.push("/")}
          >
            Support <span className="text-zinc-400">AI</span>
          </div>
          <button
            className="px-4 py-2 rounded-lg border
          border-zinc-300 text-sm hover:bg-zinc-100 transition"
          >
            Embed Chatbot
          </button>
        </div>
      </motion.div>

      <div className="flex justify-center px-4 py-14"></div>
    </div>
  );
}

export default DashboardClient;
