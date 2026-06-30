import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an AI agent configuration generator. Given a description of a business and its AI agent needs, you must output a valid JSON object that populates an agent configuration form.

The JSON must strictly match this structure (fill in fields based on the description; leave unknown fields as their defaults):

{
  "agent": {
    "name": "string — the agent's name, e.g. Ava",
    "greeting": "string — opening message the agent says, include AI disclosure if relevant",
    "screeningQuestions": [{ "text": "string", "requirement": "mandatory" | "optional" }],
    "persona": "Warm & friendly" | "Professional & concise" | "Energetic & upbeat" | "Calm & reassuring" | "Formal & authoritative",
    "voice": "",
    "callers": "string — who typically calls",
    "languages": "string — e.g. Norwegian, English",
    "availability": "Always available" | "Same as business hours (configure later)" | "Custom hours"
  },
  "business": {
    "industry": "Automotive / Dealership" | "Healthcare" | "Financial Services" | "Insurance" | "Retail / E-commerce" | "Hospitality" | "Real Estate" | "Professional Services" | "Telecom / Utilities" | "Logistics" | "Other",
    "name": "string",
    "street": "",
    "country": "",
    "city": "",
    "postalCode": "",
    "state": "",
    "timezone": "Europe/Oslo (CET)" | "Europe/London (GMT)" | "UTC" | "America/New_York (ET)" | "America/Chicago (CT)" | "America/Los_Angeles (PT)" | "Asia/Singapore" | "Other",
    "notStore": false,
    "parkingEnabled": false,
    "parkingDescription": ""
  },
  "tools": {
    "model": "Claude" | "OpenAI" | "Gemini"
  },
  "forwarding": {
    "enabled": false,
    "availability": "Same as opening and closing hours",
    "number": "",
    "email": "",
    "message": ""
  },
  "routing": {
    "callbackEnabled": false,
    "callbackWhen": "",
    "voicemailEnabled": false,
    "voicemailWhen": "",
    "voicemailQuestionEarly": "",
    "voicemailQuestionLate": "",
    "voicemailEmail": ""
  },
  "fallback": {
    "enabled": false,
    "message": ""
  },
  "tasks": [
    {
      "cat": "custom",
      "saved": false,
      "name": "string — optional task name",
      "handle": "string — desired outcome e.g. Schedule appointment",
      "triggers": ["string"],
      "steps": [
        { "instruction": "string", "requirement": "mandatory" | "optional" }
      ],
      "items": [],
      "rules": ["string"],
      "departments": [],
      "parkingEnabled": false
    }
  ],
  "answers": {
    "useBusinessProfile": false,
    "qas": [{ "q": "string", "a": "string" }],
    "documents": []
  },
  "verification": { "enabled": false, "flow": [], "rules": [] },
  "locate": { "enabled": false },
  "callScreening": { "enabled": false },
  "feedback": { "enabled": false },
  "sms": {
    "droppedCall": false,
    "csiRequest": false,
    "missedCall": false,
    "apptReminder": false
  },
  "final": {
    "guardrails": ["string — a rule the agent must follow"],
    "forbiddenTopics": "string",
    "otherReply": "string"
  }
}

Rules:
- Output ONLY valid JSON. No markdown, no explanation, no code blocks.
- Fill in every field you can infer from the description.
- For tasks: if the description mentions booking/scheduling, add a schedule task. If it mentions rescheduling, add a reschedule task. If it mentions cancellation, add a cancel task.
- Each task's steps should be practical workflow steps (e.g. "Gather caller name", "Confirm appointment date").
- If the description mentions human handoff / escalation, set forwarding.enabled to true.
- If the description mentions feedback or satisfaction, set feedback.enabled to true.
- Set tools.model to "Claude" by default unless another model is specified.
- The agent's greeting should be natural and include the business name if known.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return NextResponse.json({ error: "Prompt is too short" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate the agent configuration JSON for this description:\n\n${prompt.trim()}`,
        },
      ],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";

    let state: unknown;
    try {
      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
      state = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse agent configuration. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ state });
  } catch (err) {
    console.error("[generate-agent]", err);
    return NextResponse.json(
      { error: "Failed to generate agent configuration" },
      { status: 500 }
    );
  }
}
