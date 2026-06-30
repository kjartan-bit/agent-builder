"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFFFF" }}>

      {/* ── Hero — primary-200 (#CBE5C7) light green ── */}
      <div
        style={{ background: "var(--color-primary-200)" }}
        className="relative px-8 pt-6 pb-14 overflow-hidden"
      >
        {/* Nav */}
        <nav className="flex items-center justify-center gap-5 mb-10">
          <Link
            href="/"
            className="transition-colors"
            style={{ fontSize: 15, color: "#4ca749" }}
          >
            Create
          </Link>
          <span style={{ color: "var(--color-primary-500)" }}>|</span>
          <span className="font-semibold" style={{ fontSize: 15, color: "var(--color-primary-900)" }}>
            Test
          </span>
        </nav>

        <div className="max-w-xl mx-auto text-center">
          {/* Agent selector */}
          <button
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 transition-colors cursor-pointer"
            style={{
              fontSize: 14,
              color: "var(--color-primary-800)",
              border: "1.5px solid var(--color-primary-400)",
              background: "var(--color-primary-100)",
            }}
          >
            {agentName}
            <span className="opacity-60 text-xs">▾</span>
          </button>

          <h1
            className="font-bold mb-8"
            style={{ fontSize: 24, lineHeight: 1.4, color: "#263238" }}
          >
            Test the Agent's Reliability and Compliance
            <br />
            While It Resolves Your Most Complex Tasks
          </h1>

          {/* Mode buttons */}
          <div className="flex justify-center gap-4 mb-8">
            {(["talk", "chat"] as const).map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="rounded-full px-6 py-2.5 font-semibold transition-colors cursor-pointer"
                  style={{
                    fontSize: 14,
                    background: active ? "#4ca749" : "var(--color-primary-100)",
                    color: active ? "#fff" : "var(--color-primary-800)",
                    border: active
                      ? "1.5px solid #4ca749"
                      : "1.5px solid var(--color-primary-300)",
                  }}
                >
                  {tab === "talk" ? "Talk with Agent" : "Chat with Agent"}
                </button>
              );
            })}
          </div>

          {/* iframe / placeholder */}
          <div
            className="rounded-2xl flex items-center justify-center italic"
            style={{
              minHeight: 160,
              fontSize: 13,
              color: "#4ca749",
              border: "1.5px solid var(--color-primary-300)",
              background: "var(--color-primary-200)",
            }}
          >
            {activeTab === "talk" && "Voice integration coming soon"}
            {activeTab === "chat" && "Chat integration coming soon"}
            {!activeTab && "<iframe for both options>"}
          </div>
        </div>
      </div>

      {/* ── Framework section — neutral-50 ── */}
      <div className="flex-1 px-8 py-10" style={{ background: "#FFFFFF" }}>
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-bold mb-6"
            style={{ fontSize: 20, lineHeight: 1.35, color: "var(--color-neutral-950)" }}
          >
            Controlled Onboarding Framework for Reliable and Compliant AI Voice Agents
          </h2>

          <ol className="space-y-4 mb-7">
            {FRAMEWORK_STEPS.map((step, i) => (
              <li
                key={i}
                className="flex gap-3"
                style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-neutral-700)" }}
              >
                <span
                  className="font-bold shrink-0 w-5 text-right"
                  style={{ color: "#4ca749" }}
                >
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>

          <a
            href="#"
            className="underline underline-offset-2"
            style={{ fontSize: 13, color: "#4ca749" }}
          >
            See all available features
          </a>

          <p className="mt-6" style={{ fontSize: 13, color: "var(--color-neutral-500)" }}>
            Make the framework a dialogue where we implement problems the step applies to.
          </p>
        </div>
      </div>
    </div>
  );
}
