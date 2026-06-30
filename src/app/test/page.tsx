"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/Nav";

export default function TestAgent() {
  const [agentName, setAgentName] = useState("Your Agent");
  const [phone, setPhone] = useState("");
  const [smsBody, setSmsBody] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("agentConfig");
      if (raw) {
        const config = JSON.parse(raw);
        if (config?.agent?.name) setAgentName(config.agent.name);
      }
    } catch {}
  }, []);

  const handleSend = () => {
    if (!phone || !smsBody) return;
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-25">
      <Nav />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <p
            className="font-semibold uppercase text-primary-600 mb-2"
            style={{ fontSize: 11, letterSpacing: "0.14em" }}
          >
            Test Environment
          </p>
          <h1 className="font-bold text-neutral-950 mb-1" style={{ fontSize: 30 }}>
            Test your agent
          </h1>
          <p className="text-neutral-500 mb-8" style={{ fontSize: 15 }}>
            Agent:{" "}
            <span className="font-semibold text-neutral-900">{agentName}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <VoiceCard active={voiceActive} onToggle={() => setVoiceActive((v) => !v)} />
            <SmsCard
              phone={phone}
              body={smsBody}
              sent={smsSent}
              onPhoneChange={setPhone}
              onBodyChange={setSmsBody}
              onSend={handleSend}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function VoiceCard({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-1">
        <span style={{ fontSize: 22 }}>🎙️</span>
        <h2 className="font-semibold text-neutral-900" style={{ fontSize: 18 }}>
          Voice test
        </h2>
      </div>
      <p className="text-neutral-500 mb-6" style={{ fontSize: 14 }}>
        Simulate an inbound call to your agent.
      </p>

      <div
        className={`flex-1 rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-4 mb-4 transition-colors ${
          active ? "border-primary-400 bg-primary-25" : "border-neutral-200"
        }`}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-colors ${
            active ? "bg-primary-500 text-white" : "bg-neutral-100 text-neutral-400"
          }`}
        >
          {active ? "⏹" : "🎤"}
        </div>
        <p className="text-neutral-600 font-medium" style={{ fontSize: 14 }}>
          {active ? "Call in progress…" : "Ready to call"}
        </p>
        {active && (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-1 bg-primary-400 rounded-full animate-pulse"
                style={{ height: 8 + Math.sin(i) * 6, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onToggle}
        className={`w-full py-2.5 rounded-lg font-semibold transition-colors cursor-pointer ${
          active
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-primary-600 hover:bg-primary-700 text-white"
        }`}
        style={{ fontSize: 14 }}
      >
        {active ? "End call" : "Start call"}
      </button>
      <p className="text-neutral-400 text-center mt-3" style={{ fontSize: 12 }}>
        Voice integration coming soon
      </p>
    </div>
  );
}

function SmsCard({
  phone,
  body,
  sent,
  onPhoneChange,
  onBodyChange,
  onSend,
}: {
  phone: string;
  body: string;
  sent: boolean;
  onPhoneChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-1">
        <span style={{ fontSize: 22 }}>💬</span>
        <h2 className="font-semibold text-neutral-900" style={{ fontSize: 18 }}>
          SMS test
        </h2>
      </div>
      <p className="text-neutral-500 mb-6" style={{ fontSize: 14 }}>
        Send a test message to your agent.
      </p>

      <div className="flex flex-col gap-4 flex-1">
        <div>
          <label
            className="block font-medium text-neutral-700 mb-1.5"
            style={{ fontSize: 14 }}
          >
            Phone number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+47 000 00 000"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 placeholder:text-neutral-400"
            style={{ fontSize: 14 }}
          />
        </div>
        <div className="flex-1">
          <label
            className="block font-medium text-neutral-700 mb-1.5"
            style={{ fontSize: 14 }}
          >
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder="Hi, I'd like to book a service appointment…"
            rows={5}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-neutral-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 placeholder:text-neutral-400"
            style={{ fontSize: 14 }}
          />
        </div>
        <button
          onClick={onSend}
          disabled={!phone || !body}
          className={`w-full py-2.5 rounded-lg font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed ${
            sent
              ? "bg-primary-500 text-white"
              : "bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-200 disabled:text-neutral-400 text-white"
          }`}
          style={{ fontSize: 14 }}
        >
          {sent ? "✓ Sent!" : "Send SMS"}
        </button>
      </div>
      <p className="text-neutral-400 text-center mt-3" style={{ fontSize: 12 }}>
        SMS integration coming soon
      </p>
    </div>
  );
}
