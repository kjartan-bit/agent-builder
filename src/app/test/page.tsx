"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const HERO_GREEN = "#3A5E31";

const FRAMEWORK_STEPS = [
  "Replace your IVR with the AI Front Desk agent that answers questions and route calls.",
  "Enter the more complex tasks you want our Specialist Agent to resolve.",
  "Easily turn the agents on/off and try out new agent features in our AI Agent platform.",
  "Closely monitor the Agents performance viewing call outcomes and listening to call recordings.",
  "Augment your staff when and where it is needed while staying completely on top of AI.",
];

export default function TestPage() {
  const [agentName, setAgentName] = useState("Select agent");
  const [activeTab, setActiveTab] = useState<"talk" | "chat" | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("agentConfig");
      if (raw) {
        const config = JSON.parse(raw);
        if (config?.agent?.name) setAgentName(config.agent.name);
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">

      {/* ── Hero ── */}
      <div
        style={{ backgroundColor: HERO_GREEN }}
        className="relative overflow-hidden px-8 pt-6 pb-14"
      >
        {/* Nav */}
        <nav className="flex items-center gap-5 mb-10">
          <Link
            href="/"
            className="text-white/60 hover:text-white transition-colors"
            style={{ fontSize: 15 }}
          >
            Create
          </Link>
          <span className="text-white/40">|</span>
          <span className="text-white font-semibold" style={{ fontSize: 15 }}>
            Test
          </span>
        </nav>

        {/* Background label placeholder */}
        <p
          className="absolute top-6 right-8 text-white/25 italic select-none"
          style={{ fontSize: 12 }}
        >
          &lt;background graphics of Serena&gt;
        </p>

        {/* Content */}
        <div className="max-w-xl mx-auto text-center">
          {/* Agent selector */}
          <button
            className="border border-white/40 rounded-full px-5 py-2 text-white bg-white/10 hover:bg-white/20 transition-colors mb-8 inline-flex items-center gap-2 cursor-pointer"
            style={{ fontSize: 14 }}
          >
            {agentName}
            <span className="opacity-60 text-xs">▾</span>
          </button>

          <h1
            className="text-white font-bold mb-8"
            style={{ fontSize: 24, lineHeight: 1.4 }}
          >
            Test the agents reliability and compliance
            <br />
            while it resolves your most complex tasks
          </h1>

          {/* Mode buttons */}
          <div className="flex justify-center gap-4 mb-8">
            {(["talk", "chat"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-6 py-2.5 font-medium border transition-colors cursor-pointer capitalize ${
                  activeTab === tab
                    ? "bg-white text-neutral-900 border-white"
                    : "text-white border-white/40 bg-white/10 hover:bg-white/20"
                }`}
                style={{ fontSize: 14 }}
              >
                {tab === "talk" ? "Talk with agent" : "Chat with agent"}
              </button>
            ))}
          </div>

          {/* iframe placeholder */}
          <div
            className="bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white/40 italic"
            style={{ minHeight: 160, fontSize: 13 }}
          >
            {activeTab === "talk" && "Voice integration coming soon"}
            {activeTab === "chat" && "Chat integration coming soon"}
            {!activeTab && "<iframe for both options>"}
          </div>
        </div>
      </div>

      {/* ── Framework section ── */}
      <div className="flex-1 px-8 py-10">
        <div className="max-w-xl mx-auto">
          <h2
            className="font-bold text-neutral-900 mb-6"
            style={{ fontSize: 20, lineHeight: 1.35 }}
          >
            Controlled onboarding framework for reliable and
            compliant AI Voice Agents
          </h2>

          <ol className="space-y-3 mb-6">
            {FRAMEWORK_STEPS.map((step, i) => (
              <li
                key={i}
                className="flex gap-3 text-neutral-700"
                style={{ fontSize: 14, lineHeight: 1.55 }}
              >
                <span className="font-semibold shrink-0 text-neutral-500">
                  {i + 1})
                </span>
                {step}
              </li>
            ))}
          </ol>

          <a
            href="#"
            className="text-neutral-600 underline underline-offset-2"
            style={{ fontSize: 13 }}
          >
            See all available features
          </a>

          <p className="text-neutral-400 mt-6" style={{ fontSize: 13 }}>
            Make the framework a dialogue where we implement problems
            the step applies to.
          </p>
        </div>
      </div>
    </div>
  );
}
