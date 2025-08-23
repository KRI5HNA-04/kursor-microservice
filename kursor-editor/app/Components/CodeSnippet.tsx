"use client";
import { motion } from "framer-motion";

export default function CodeSnippet() {
  return (
    <motion.div
      className="relative w-[50%] mx-auto mt-20 mb-16 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl font-mono text-sm text-gray-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-gray-300">main.py</span>
        </div>
      </div>

      {/* Code */}
      <pre className="px-4 py-3 whitespace-pre-wrap leading-relaxed">
        <code>
          <span className="text-gray-400">
            # AI-generated life advice optimizer
          </span>
          {"\n"}
          <span className="text-blue-400">def</span>{" "}
          <span className="text-green-300">unlock_life_hacks</span>
          <span className="text-white">():</span>
          {"\n"}
          {"    "}
          <span className="text-gray-400">
            # Load unnecessary amount of data
          </span>
          {"\n"}
          {"    "}
          <span className="text-teal-400">brain_buffer</span>{" "}
          <span className="text-white">=</span>{" "}
          <span className="text-yellow-300">
            ["procrastinate", "debug life", "retry coffee", "404 motivation not
            found"]
          </span>
          {"\n"}
          {"\n"}
          {"    "}
          <span className="text-gray-400">
            # Apply deep learning (aka overthinking)
          </span>
          {"\n"}
          {"    "}
          <span className="text-teal-400">insights</span>{" "}
          <span className="text-white">=</span>{" "}
          <span className="text-white">[</span>
          <span className="text-green-300">hack.upper()</span>{" "}
          <span className="text-blue-400">for</span>{" "}
          <span className="text-green-300">hack</span>{" "}
          <span className="text-blue-400">in</span>{" "}
          <span className="text-teal-400">brain_buffer</span>{" "}
          <span className="text-blue-400">if</span>{" "}
          <span className="text-amber-300">"coffee"</span>{" "}
          <span className="text-white">not in</span>{" "}
          <span className="text-green-300">hack</span>
          <span className="text-white">]</span>
          {"\n"}
          {"\n"}
          {"    "}
          <span className="text-gray-400">
            # Generate wisdom (or just nonsense)
          </span>
          {"\n"}
          {"    "}
          <span className="text-teal-400">wisdom</span>{" "}
          <span className="text-white">=</span>{" "}
          <span className="text-emerald-400">
            "Always commit before you push... relationships, too."
          </span>
          {"\n"}
          {"\n"}
          {"    "}
          <span className="text-purple-400">return</span>{" "}
          <span className="text-white">&#123;</span>
          {"\n"}
          {"        "}
          <span className="text-rose-400">"insights"</span>
          <span className="text-white">:</span>{" "}
          <span className="text-teal-400">insights</span>
          <span className="text-white">,</span>
          {"\n"}
          {"        "}
          <span className="text-rose-400">"wisdom"</span>
          <span className="text-white">:</span>{" "}
          <span className="text-teal-400">wisdom</span>
          <span className="text-white">,</span>
          {"\n"}
          {"        "}
          <span className="text-rose-400">"status"</span>
          <span className="text-white">:</span>{" "}
          <span className="text-emerald-400">
            "✨ Overfitted to reality ✨"
          </span>
          {"\n"}
          {"    "}
          <span className="text-white">&#125;</span>
        </code>
      </pre>
    </motion.div>
  );
}
