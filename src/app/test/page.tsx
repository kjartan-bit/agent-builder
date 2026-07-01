"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

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
    <div className="min-h-screen flex flex-col" style={{ background: "#ffffff" }}>

      {/* ── Hero ── */}
      <div
        style={{ background: "#ffffff", paddingBottom: 48 }}
        className="relative px-8 pt-6"
      >
        {/* Nav */}
        <nav className="ds-text-sm-semibold relative flex items-center justify-center gap-5 mb-10">
          <div className="absolute left-0"><Logo /></div>
          <Link href="/" className="transition-colors" style={{ color: "var(--color-primary-700)" }}>
            Create
          </Link>
          <span style={{ color: "var(--color-primary-400)" }}>|</span>
          <span style={{ color: "var(--color-primary-900)" }}>Test</span>
          <div className="absolute right-0">
            <Link
              href="/configure"
              className="ds-text-sm-semibold rounded-full px-4 py-1.5 transition-colors cursor-pointer"
              style={{
                background: "var(--color-primary-500)",
                color: "#fff",
              }}
            >
              Configure Agent
            </Link>
          </div>
        </nav>

        <div className="max-w-xl mx-auto text-center">
          {/* Headline — display-xs bold */}
          <h1
            className="ds-display-xs-bold mb-6"
            style={{ color: "#263238" }}
          >
            Test the Agent's Reliability and Compliance
            <br />
            While It Resolves Your Most Intricate Tasks
          </h1>

          {/* Agent selector */}
          <button
            className="ds-text-sm-medium inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 transition-colors cursor-pointer"
            style={{
              color: "var(--color-primary-800)",
              border: "1.5px solid var(--color-primary-300)",
              background: "var(--color-primary-50)",
            }}
          >
            {agentName}
            <span className="opacity-60 text-xs">▾</span>
          </button>

          {/* Serena image */}
          <div className="flex justify-center mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/final%20serena%20for%20test%20page.png"
              alt="Serena"
              className="rounded-2xl"
              style={{ maxHeight: 200, width: "auto" }}
            />
          </div>

          {/* Mode buttons */}
          <div className="flex justify-center gap-4 mb-8">
            {(["talk", "chat"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="ds-text-sm-semibold rounded-full px-6 py-2.5 transition-colors cursor-pointer"
                style={{
                  background: "var(--color-primary-500)",
                  color: "#fff",
                  border: "1.5px solid var(--color-primary-500)",
                }}
              >
                {tab === "talk" ? "Talk with Agent" : "Chat with Agent"}
              </button>
            ))}
          </div>

          {/* iframe — only shown after a button is clicked */}
          {activeTab && (
            <div
              className="ds-text-sm-regular rounded-2xl flex items-center justify-center italic"
              style={{
                minHeight: 160,
                color: "var(--color-primary-600)",
                border: "1.5px solid #ffffff",
                background: "var(--color-primary-25)",
              }}
            >
              {activeTab === "talk" ? "Voice integration coming soon" : "Chat integration coming soon"}
            </div>
          )}
        </div>
      </div>

      {/* ── Framework section ── */}
      <div className="flex-1 px-8 py-10" style={{ background: "var(--color-neutral-50)" }}>
        <div className="max-w-5xl mx-auto flex gap-10 items-center">

          {/* Video — left */}
          <div style={{ flex: "0 0 52%" }}>
            <video
              src="/platform%20gif%2011sight.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-xl"
              style={{ maxHeight: 400, objectFit: "cover" }}
            />
          </div>

          {/* Framework — right */}
          <div style={{ flex: 1 }}>
            <h2
              className="ds-display-xs-semibold mb-6"
              style={{ color: "var(--color-neutral-950)" }}
            >
              Controlled Onboarding Framework for Reliable and Compliant AI Voice Agents
            </h2>

            <ol className="space-y-4 mb-7">
              {FRAMEWORK_STEPS.map((step, i) => (
                <li
                  key={i}
                  className="ds-text-sm-regular flex gap-3"
                  style={{ color: "var(--color-neutral-700)" }}
                >
                  <span
                    className="ds-text-sm-bold shrink-0 w-5 text-right"
                    style={{ color: "var(--color-primary-500)" }}
                  >
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <a
              href="#"
              className="ds-text-sm-underlined"
              style={{ color: "var(--color-primary-500)" }}
            >
              See all available features
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
