import 'dotenv/config';
import express, {Request, Response} from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {GoogleGenAI, ThinkingLevel, Type} from '@google/genai';
import {
  CAREER_HISTORY,
  CASE_STUDIES,
  PARTNERS,
  PROFILE,
  SELECTED_SCREENS,
} from './src/data/portfolioData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const PORTFOLIO_KNOWLEDGE = {
  designer: {
    name: PROFILE.name,
    role: PROFILE.role,
    year: PROFILE.year,
    linkedinUrl: PROFILE.linkedinUrl,
    offlineCvPath: PROFILE.cvUrl,
    summary: PROFILE.heroLead,
    practiceSummary: PROFILE.availabilitySummary,
    capabilities: PROFILE.capabilities,
    toolsMentioned: ['Figma', 'Adobe XD'],
  },
  partners: PARTNERS.map((p) => p.name),
  careerHistory: CAREER_HISTORY.map((entry) => ({
    id: entry.id,
    period: entry.period,
    company: entry.company,
    role: entry.role,
    summary: entry.lede,
    highlights: entry.points,
    projects: entry.projects ?? [],
  })),
  caseStudies: CASE_STUDIES.map((cs) => ({
    slug: cs.slug,
    number: cs.number,
    title: cs.title,
    domain: cs.domain,
    category: cs.category,
    headline: `${cs.headline} ${cs.headlineItalic}`,
    lead: cs.lead,
    meta: cs.meta.map((m) => `${m.label}: ${m.value}`),
    brief: cs.brief.body,
    pillars: cs.brief.pillars.map((p) => `${p.label}: ${p.text}`),
    legacySignals: cs.legacyEvidence?.signals.map((s) => `${s.title}: ${s.body}`),
    researchFindings: cs.research?.findings.map((f) => `${f.title}: ${f.body}`),
    stats: cs.stats?.items.map((s) => `${s.value} — ${s.label}${s.detail ? ` (${s.detail})` : ''}`),
    quotes: cs.quotes?.items.map((q) => `"${q.quote}" — ${q.cite}`),
    strategy: cs.strategy?.items.map((s) => `${s.title}: ${s.body}`),
    highlights: cs.highlights?.points,
    webDomains: cs.webDirection?.domains,
    reflection: cs.reflection?.items.map((r) => `${r.title}: ${r.body}`),
    screenIds: cs.screens.map((s) => `${s.id} (${s.title})`),
  })),
  galleryScreenIds: SELECTED_SCREENS.map((s) => `${s.id}: ${s.product} — ${s.title}`),
};

const VALID_CASE_SLUGS = new Set(CASE_STUDIES.map((c) => c.slug));
const VALID_CAREER_IDS = new Set(CAREER_HISTORY.map((c) => c.id));
const VALID_SCREEN_IDS = new Set([
  ...SELECTED_SCREENS.map((s) => s.id),
  ...CASE_STUDIES.flatMap((c) => c.screens.map((s) => s.id)),
]);

const SYSTEM_INSTRUCTION = `You are the interactive AI Portfolio Agent for ${PROFILE.name} (${PROFILE.role}), built for recruiters, hiring managers, and UX leads.

BILINGUAL LANGUAGE RULE:
- Reply in Arabic (العربية) whenever the user's latest message is written in Arabic OR when the request specifies "[Preferred UI Language: ar]". Keep official brand/product/company proper nouns recognizable (e.g., E-Invest, 7salty, SAS Vaya, KnowledgeNet, DataScience Middle East, Go Bus, Zabatha, Monsooq).
- Reply in English whenever the user writes in English (unless they ask for Arabic).
- Also write "recommendedQuestions" in the SAME language as your reply.

STRICT DATA GROUNDING POLICY (NON-NEGOTIABLE):
1. You MUST answer questions ONLY using facts explicitly present in the PORTFOLIO KNOWLEDGE JSON below.
2. NEVER invent, guess, extrapolate, or use outside general knowledge to fill gaps. Do NOT fabricate: email addresses, phone numbers, residence city, visa status, salary expectations, university degrees, certifications, unmentioned tools, or undocumented metrics.
3. If asked for anything NOT present in PORTFOLIO KNOWLEDGE, clearly state (in the user's language) that this detail is not included in Abouelkhair's portfolio data, and pivot constructively to verified portfolio facts (LinkedIn profile, offline CV, 6 case studies, 24 selected screens, or 7 career roles).
4. Keep answers structured, concise, and helpful for recruiters & UX leads (2–5 sentences or crisp bullet points).
5. Output valid JSON matching the exact schema:
   - "reply": Concise strictly grounded narrative answer.
   - "relatedCaseSlugs": Up to 3 relevant case study slugs from ["e-invest", "7salty", "zabatha", "monsooq", "go-bus", "sas-vaya"].
   - "relatedScreenIds": Up to 4 exact screen id strings from caseStudies[].screenIds or galleryScreenIds (only the id before the space/colon).
   - "relatedCareerIds": Up to 3 exact career "id" strings from careerHistory[].id.
   - "showPartners": Boolean, true when banks/institutions/partners are relevant.
   - "suggestCv": Boolean, true when CV, summary, LinkedIn, or full timeline is relevant.
   - "recommendedQuestions": Exactly 3 short, grounded follow-up questions in the reply language.

PORTFOLIO KNOWLEDGE JSON:
${JSON.stringify(PORTFOLIO_KNOWLEDGE)}`;

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
}

const MODEL_CHAIN: Array<{model: string; useThinking: boolean}> = [
  {model: 'gemini-4-hydrogen', useThinking: true},
  {model: 'gemini-3.1-flash-lite', useThinking: false},
];

function extractFriendlyError(err: unknown, lang: 'en' | 'ar'): {status: number; message: string} {
  const raw = err instanceof Error ? err.message : String(err ?? '');
  let parsedCode: number | undefined;
  let parsedMsg: string | undefined;

  try {
    const startIdx = raw.indexOf('{');
    if (startIdx >= 0) {
      const jsonObj = JSON.parse(raw.slice(startIdx));
      parsedCode = Number(jsonObj?.error?.code);
      parsedMsg = typeof jsonObj?.error?.message === 'string' ? jsonObj.error.message : undefined;
    }
  } catch {
    // keep raw fallback
  }

  const lower = (parsedMsg || raw).toLowerCase();
  if (parsedCode === 503 || lower.includes('unavailable') || lower.includes('high demand')) {
    return {
      status: 503,
      message:
        lang === 'ar'
          ? 'خادم الذكاء الاصطناعي يواجه ضغطاً مؤقتاً حالياً. يرجى المحاولة مرة أخرى خلال ثوانٍ.'
          : 'The AI service is experiencing temporary high demand. Please retry in a moment.',
    };
  }
  if (parsedCode === 429 || lower.includes('resource_exhausted') || lower.includes('quota')) {
    return {
      status: 429,
      message:
        lang === 'ar'
          ? 'تم تجاوز حد الطلبات المؤقت. يرجى المحاولة بعد قليل أو التحقق من إعدادات المفتاح.'
          : 'Rate quota temporarily reached. Please retry shortly or check your API key tier in Settings > Secrets.',
    };
  }
  if (parsedCode === 403 || parsedCode === 400 || lower.includes('api_key_invalid') || lower.includes('permission_denied')) {
    return {
      status: parsedCode || 400,
      message:
        lang === 'ar'
          ? 'يرجى التحقق من مفتاح Gemini API في لوحة الإعدادات (Settings > Secrets).'
          : 'Please check that a valid GEMINI_API_KEY is configured in the Settings > Secrets panel.',
    };
  }

  return {
    status: 500,
    message:
      parsedMsg ||
      raw ||
      (lang === 'ar'
        ? 'تعذر الاتصال بمساعد البورتفوليو حالياً.'
        : 'Unable to reach the portfolio assistant right now.'),
  };
}

async function generateWithFallback(
  contents: Array<{role: 'user' | 'model'; parts: Array<{text: string}>}>,
) {
  let lastError: unknown;
  for (let i = 0; i < MODEL_CHAIN.length; i += 1) {
    const candidate = MODEL_CHAIN[i];
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await ai.models.generateContent({
          model: candidate.model,
          contents,
          config: {
            abortSignal: AbortSignal.timeout(14000),
            systemInstruction: SYSTEM_INSTRUCTION,
            ...(candidate.useThinking
              ? {thinkingConfig: {thinkingLevel: ThinkingLevel.LOW}}
              : {}),
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                reply: {
                  type: Type.STRING,
                  description: 'Concise factual answer strictly grounded in portfolio data.',
                },
                relatedCaseSlugs: {
                  type: Type.ARRAY,
                  items: {type: Type.STRING},
                  description: 'Up to 3 relevant case study slugs.',
                },
                relatedScreenIds: {
                  type: Type.ARRAY,
                  items: {type: Type.STRING},
                  description: 'Up to 4 exact screen IDs from the portfolio knowledge.',
                },
                relatedCareerIds: {
                  type: Type.ARRAY,
                  items: {type: Type.STRING},
                  description: 'Up to 3 exact career entry IDs.',
                },
                showPartners: {
                  type: Type.BOOLEAN,
                  description: 'Whether institutional partners are relevant.',
                },
                suggestCv: {
                  type: Type.BOOLEAN,
                  description: 'Whether offline CV or LinkedIn is relevant.',
                },
                recommendedQuestions: {
                  type: Type.ARRAY,
                  items: {type: Type.STRING},
                  description: 'Exactly 3 grounded recruiter follow-up questions.',
                },
              },
              required: [
                'reply',
                'relatedCaseSlugs',
                'relatedScreenIds',
                'relatedCareerIds',
                'showPartners',
                'suggestCv',
                'recommendedQuestions',
              ],
            },
          },
        });
      } catch (err) {
        lastError = err;
        const msg = (err instanceof Error ? err.message : String(err ?? '')).toLowerCase();
        const isAuthFailure =
          msg.includes('api_key_invalid') ||
          msg.includes('permission_denied') ||
          msg.includes('"code":403') ||
          msg.includes('api key not valid');

        console.warn(
          `[Portfolio Agent] Model "${candidate.model}" attempt ${attempt + 1} failed:`,
          err instanceof Error ? err.message.slice(0, 180) : err,
        );

        if (isAuthFailure) {
          throw err;
        }

        const isQuota =
          msg.includes('429') ||
          msg.includes('resource_exhausted') ||
          msg.includes('quota');
        if (isQuota) {
          // Immediately fall through to the next model instead of retrying an exhausted quota
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json({limit: '1mb'}));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      models: MODEL_CHAIN.map((m) => m.model),
    });
  });

  app.post('/api/chat', async (req: Request, res: Response) => {
    const lang: 'en' | 'ar' = req.body?.lang === 'ar' ? 'ar' : 'en';
    try {
      if (!process.env.GEMINI_API_KEY) {
        res.status(503).json({
          error:
            lang === 'ar'
              ? 'مفتاح Gemini API غير مهيأ. يرجى إضافته في Settings > Secrets.'
              : 'Gemini API key is not configured. Add GEMINI_API_KEY in the Settings > Secrets panel.',
        });
        return;
      }

      const rawMessages = req.body?.messages;
      const caseContextSlug =
        typeof req.body?.caseContext === 'string' &&
        VALID_CASE_SLUGS.has(req.body.caseContext as never)
          ? req.body.caseContext
          : null;

      if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
        res.status(400).json({error: 'Please provide at least one chat message.'});
        return;
      }

      const sanitized: ChatMessageInput[] = rawMessages
        .slice(-12)
        .filter(
          (m): m is ChatMessageInput =>
            Boolean(m) &&
            (m.role === 'user' || m.role === 'assistant') &&
            typeof m.content === 'string' &&
            m.content.trim().length > 0,
        )
        .map((m) => ({
          role: m.role,
          content: m.content.trim().slice(0, 1500),
        }));

      if (
        sanitized.length === 0 ||
        sanitized[sanitized.length - 1].role !== 'user'
      ) {
        res
          .status(400)
          .json({error: 'The latest message must be a non-empty user prompt.'});
        return;
      }

      const contents = sanitized.map((m, idx) => {
        const isLastUser = idx === sanitized.length - 1;
        let text = m.content;
        if (isLastUser) {
          const hints = [`[Preferred UI Language: ${lang}]`];
          if (caseContextSlug) {
            hints.push(`[Active Case Context: "${caseContextSlug}"]`);
          }
          text = `${hints.join(' ')}\n${m.content}`;
        }
        return {
          role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
          parts: [{text}],
        };
      });

      const response = await generateWithFallback(contents);
      const rawText = (response.text ?? '').trim();

      let parsed: {
        reply?: string;
        relatedCaseSlugs?: string[];
        relatedScreenIds?: string[];
        relatedCareerIds?: string[];
        showPartners?: boolean;
        suggestCv?: boolean;
        recommendedQuestions?: string[];
      } = {};
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = {reply: rawText};
      }

      const reply =
        typeof parsed.reply === 'string' && parsed.reply.trim().length > 0
          ? parsed.reply.trim()
          : lang === 'ar'
            ? 'تعذر استخراج إجابة موثقة من بيانات البورتفوليو لهذا السؤال.'
            : 'I could not extract a grounded answer from the portfolio data for that question.';

      const relatedCaseSlugs = Array.isArray(parsed.relatedCaseSlugs)
        ? parsed.relatedCaseSlugs
            .filter((slug) => VALID_CASE_SLUGS.has(slug as never))
            .slice(0, 3)
        : [];

      const relatedScreenIds = Array.isArray(parsed.relatedScreenIds)
        ? parsed.relatedScreenIds
            .filter((id) => VALID_SCREEN_IDS.has(id))
            .slice(0, 4)
        : [];

      const relatedCareerIds = Array.isArray(parsed.relatedCareerIds)
        ? parsed.relatedCareerIds
            .filter((id) => VALID_CAREER_IDS.has(id))
            .slice(0, 3)
        : [];

      const recommendedQuestions = Array.isArray(parsed.recommendedQuestions)
        ? parsed.recommendedQuestions
            .filter((q): q is string => typeof q === 'string' && q.trim().length > 0)
            .map((q) => q.trim().slice(0, 120))
            .slice(0, 3)
        : [];

      res.json({
        reply,
        relatedCaseSlugs,
        relatedScreenIds,
        relatedCareerIds,
        showPartners: Boolean(parsed.showPartners),
        suggestCv: Boolean(parsed.suggestCv),
        recommendedQuestions,
      });
    } catch (error: unknown) {
      const friendly = extractFriendlyError(error, lang);
      res.status(friendly.status).json({error: friendly.message});
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://localhost:${port}`);
  });
}

startServer();
