import { NextRequest, NextResponse } from "next/server";
import Bytez from "bytez.js";

const AXUORA_IDENTITY =
  "You are AxuoraLearn, the AI study assistant of Axuora. You were created and are operated by Axuora. " +
  "Never mention Google, Gemini, or any other company as your creator or provider. If asked who made you, who you are, or who founded the company, say: " +
  "AxuoraLearn was founded by Jayden Liew and Suyi. Axuora is a student-led company; they built AxuoraLearn to help students learn. " +
  "You are Axuora's assistant—always refer to yourself as AxuoraLearn and to the company as Axuora.";

const FORMATTING =
  "Format your answers so they are easy for students to scan: " +
  "Use **bold** for key terms and important ideas. Use ## for main sections and ### for subsections. " +
  "Use bullet or numbered lists for steps, examples, or multiple points. Keep paragraphs short. " +
  "Do not output long walls of text; break content into clear sections with headers. " +
  "When citing sources or including website links, always use markdown links with a short descriptive name: [Source Name](url). " +
  "For example write [CDC](https://...) or [Wikipedia – Cell Biology](https://...) instead of pasting raw URLs. The link text should be the source or site name, not the URL.";

function buildSystemInstruction(youtubeContext?: string, studyPlanContext?: string): string {
  let text = AXUORA_IDENTITY + "\n\n" + FORMATTING;
  if (youtubeContext) {
    text += "\n\n" + youtubeContext;
  }
  if (studyPlanContext) {
    text += "\n\n" + studyPlanContext;
  }
  return text;
}

type YouTubeVideoItem = {
  id: string;
  title: string;
  channelTitle: string;
  description?: string;
  thumbnailUrl?: string;
};

const YOUTUBE_SEARCH_TIMEOUT_MS = 6_000;

async function searchYouTube(apiKey: string, query: string, maxResults = 10): Promise<YouTubeVideoItem[]> {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("q", query.slice(0, 200));
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), YOUTUBE_SEARCH_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url.toString(), { signal: controller.signal });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      console.error("[YouTube API] Search timed out after", YOUTUBE_SEARCH_TIMEOUT_MS / 1000, "s");
      return [];
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
  if (!res.ok) {
    const errBody = await res.text();
    console.error("[YouTube API]", res.status, errBody.slice(0, 200));
    return [];
  }
  const data = await res.json();
  if (data.error) {
    console.error("[YouTube API]", data.error?.message ?? JSON.stringify(data.error));
    return [];
  }
  const items = (data.items ?? []) as Array<{
    id?: { videoId?: string };
    snippet?: { title?: string; channelTitle?: string; description?: string; thumbnails?: { medium?: { url?: string }; default?: { url?: string }; high?: { url?: string } } };
  }>;
  return items
    .filter((i) => i.id?.videoId && i.snippet?.title)
    .map((i) => {
      const id = i.id!.videoId!;
      const thumb = i.snippet?.thumbnails?.medium?.url ?? i.snippet?.thumbnails?.high?.url ?? i.snippet?.thumbnails?.default?.url;
      return {
        id,
        title: i.snippet!.title ?? "",
        channelTitle: i.snippet!.channelTitle ?? "",
        description: i.snippet?.description,
        thumbnailUrl: thumb ?? `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
      };
    });
}

export async function POST(request: NextRequest) {
  const bytezKey = process.env.BYTEZ_API_KEY;
  if (!bytezKey) {
    return NextResponse.json(
      {
        error: "Bytez API key not configured",
        hint: "Add BYTEZ_API_KEY to your .env.local file. Get a key at https://bytez.com/settings",
      },
      { status: 503 }
    );
  }

  let body: {
    messages?: Array<{ role: string; content: string }>;
    feature?: string;
    lastMessageImages?: Array<{ mimeType: string; data: string }>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = body.messages ?? [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "messages array is required" }, { status: 400 });
  }

  const lastMessageImages = body.lastMessageImages ?? [];
  const lastUserMessage = messages.length > 0 && messages[messages.length - 1].role === "user"
    ? String(messages[messages.length - 1].content ?? "").trim()
    : "";
  const wantsLearnOrExplain = /\b(learn|explain)\b/i.test(lastUserMessage);
  const studyPlanRegex = /\b(study\s*plan|schedule|calendar|exam\s*prep|prepare\s*for\s*exam|hours\s*per\s*day|add\s*to\s*(my\s*)?calendar)\b/i;
  const wantsStudyPlan = messages.some(
    (m) => m.role === "user" && studyPlanRegex.test(String(m.content ?? "").trim())
  );

  let youtubeContext = "";
  let youtubeVideos: YouTubeVideoItem[] = [];
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  if (wantsLearnOrExplain && lastUserMessage && youtubeApiKey) {
    const query = lastUserMessage.slice(0, 150);
    youtubeVideos = await searchYouTube(youtubeApiKey, query, 10);
    if (youtubeVideos.length > 0) {
      const list = youtubeVideos
        .map((v, i) => `${i + 1}. "${v.title}" by ${v.channelTitle} — https://www.youtube.com/watch?v=${v.id}`)
        .join("\n");
      youtubeContext =
        "The user wants to learn or have something explained. Here are some YouTube videos:\n\n" +
        list +
        "\n\nYou must choose the single best video for the user's request. In your reply: (1) give a short explanation or summary of why these videos help, (2) recommend the best video with its title and the exact link in markdown: [Video Title](https://www.youtube.com/watch?v=VIDEO_ID). Do not list multiple videos in the text; the app will show a video carousel. Keep your explanation concise. Important: Do not greet the user or introduce yourself. Do not say 'Hello', 'I am AxuoraLearn', or mention who founded the company. Start directly with your explanation and the video recommendation.";
    }
  }

  let studyPlanContext = "";
  if (wantsStudyPlan) {
    studyPlanContext =
      "The user wants to create a study plan or schedule (e.g. for exams) that can be added to their Google Calendar. " +
      "Ask the necessary questions: exam date(s), subjects/topics, how many hours per day they can study, preferred study times. Do not greet; go straight to asking or to the plan. " +
      "When you have enough information, build the schedule and present it clearly in markdown (table or list with dates, times, subjects). " +
      "Then you MUST ask: \"Would you like me to add this study plan to your Google Calendar? Reply yes and I'll enable the option.\" " +
      "Do NOT output any JSON or mention a JSON block until the user confirms they want it in Google Calendar (e.g. they say \"yes\", \"please add it\", \"add to calendar\", \"yes add it\"). " +
      "When the user confirms they want the plan in Google Calendar, in your reply you MUST output a JSON code block so the app can add the events. Create one calendar event per study session from the schedule you already built. Use this exact format:\n" +
      "```json\n{\"studyPlan\": [{\"title\": \"Study Math - Topic\", \"date\": \"YYYY-MM-DD\", \"startTime\": \"13:00\", \"endTime\": \"14:00\", \"subject\": \"Math\"}, ...]}\n```\n" +
      "Every event must have: title (string), date (YYYY-MM-DD), startTime (HH:MM 24h), endTime (HH:MM 24h), and optionally subject. Match the dates and times from the schedule you showed. Include all sessions (e.g. 1–4 weeks of events). Put the JSON block at the end of your reply.";
  }

  const systemInstructionText = buildSystemInstruction(youtubeContext, studyPlanContext);

  const bytezMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemInstructionText },
    ...messages
      .filter((m) => m.content && String(m.content).trim())
      .map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content: String(m.content).trim(),
      })),
  ];

  if (bytezMessages.length <= 1) {
    return NextResponse.json({ error: "No non-empty messages" }, { status: 400 });
  }

  const maxTokens = wantsStudyPlan ? 8192 : 2048;

  try {
    const sdk = new Bytez(bytezKey);
    const model = sdk.model("openai/gpt-oss-20b");
    const { error, output } = await model.run(bytezMessages, {
      max_new_tokens: maxTokens,
      temperature: 0.7,
    });

    if (error) {
      console.error("[Bytez]", error);
      return NextResponse.json({ error: "AI service error", details: error }, { status: 502 });
    }

    const text =
      typeof output === "string"
        ? output
        : (output as { content?: string })?.content ?? "";
    const payload: { reply: string; youtubeVideos?: YouTubeVideoItem[] } = { reply: text };
    if (youtubeVideos.length > 0) payload.youtubeVideos = youtubeVideos;
    return NextResponse.json(payload);
  } catch (err) {
    const details = err instanceof Error ? err.message : String(err);
    console.error("[Bytez]", details);
    return NextResponse.json({ error: "AI service error", details }, { status: 502 });
  }
}
