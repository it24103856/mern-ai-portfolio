import { GoogleGenAI } from '@google/genai';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';

// Helper function: Wait for a short period before retrying.
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// @desc    List Gemini models available to the configured API key
// @route   GET /api/ai/models
// @access  Public
export const listAvailableModels = async (req, res, next) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      res.status(500);
      return next(new Error('Gemini API key is not configured on the server'));
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const pager = await ai.models.list({
      config: {
        pageSize: 100,
        queryBase: true,
      },
    });

    const models = [];
    for await (const model of pager) {
      if (model.supportedActions?.includes('generateContent') || !model.supportedActions) {
        models.push({
          name: model.name?.replace(/^models\//, ''),
          displayName: model.displayName,
          description: model.description,
          inputTokenLimit: model.inputTokenLimit,
          outputTokenLimit: model.outputTokenLimit,
          supportedActions: model.supportedActions,
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: models.length,
      models,
    });
  } catch (error) {
    console.error('Gemini Models Error:', error);
    res.status(error.status || error.statusCode || 500);
    return next(new Error(error.message || 'Failed to list Gemini models'));
  }
};

// @desc    Chat with AI Portfolio Assistant using live DB context
// @route   POST /api/ai/chat
// @access  Public
export const chatWithPortfolioAI = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      res.status(400);
      return next(new Error('Message is required'));
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500);
      return next(new Error('Gemini API key is not configured on the server'));
    }

    // 1. MongoDB එකෙන් live portfolio data ටික ගැනීම
    const [profile, projects, skills] = await Promise.all([
      Profile.findOne().lean(),
      Project.find().sort({ order: 1, createdAt: -1 }).lean(),
      Skill.find().lean(),
    ]);

    // 2. Portfolio context එක format කිරීම
    const projectsSummary = projects.length
      ? projects
          .map(
            (p) =>
              `- ${p.title} (${p.category}): ${p.shortDescription}. Tech Stack: [${p.techStack.join(
                ', '
              )}]. Live: ${p.liveUrl || 'N/A'}, GitHub: ${p.githubUrl || 'N/A'}`
          )
          .join('\n')
      : 'No projects added yet.';

    const skillsSummary = skills.length
      ? skills.map((s) => `${s.name} (${s.category})`).join(', ')
      : 'No skills listed yet.';

    const systemInstruction = `
You are an intelligent, friendly, and professional AI Portfolio Assistant representing ${
      profile?.fullName || 'the developer'
    }.
Your job is to answer questions from recruiters, clients, and visitors about ${
      profile?.fullName || 'the developer'
    }'s background, technical skills, and projects.

DEVELOPER PROFILE:
- Name: ${profile?.fullName || 'Developer'}
- Headline: ${profile?.headline || 'Full-Stack Developer'}
- Location: ${profile?.location || 'Sri Lanka'}
- Bio: ${profile?.bio || 'Passionate full-stack software developer.'}
- Availability: ${profile?.availability ? 'Currently open to opportunities/projects' : 'Currently busy'}
- Contact Email: ${profile?.email || 'Available via contact form'}
- GitHub: ${profile?.socialLinks?.github || 'N/A'}
- LinkedIn: ${profile?.socialLinks?.linkedin || 'N/A'}

TECHNICAL SKILLS:
${skillsSummary}

PORTFOLIO PROJECTS:
${projectsSummary}

GUIDELINES:
1. Keep responses concise, helpful, and professional (2-4 sentences unless asked for deep technical details).
2. Always speak positively and accurately based ONLY on the provided data. Do not invent fake projects or experience.
3. If asked something unrelated to the developer or software engineering, politely steer the conversation back to the portfolio or suggest using the Contact form.
4. Reply in the same language the user asks in (English or Sinhala).
`;

    // 3. Gemini API call කිරීම
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Previous chat history format කිරීම (අවසාන messages 6 පමණක් යවමු token save කරන්න)
    const formattedContents = [
      ...history.slice(-6).map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const modelsToTry = [
        'gemini-3.1-flash-lite',
      'gemini-3.7-flash',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      
    ];
    let response;
    let lastError;

    for (const modelName of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 400,
          },
        });
        console.log(`✅ AI response generated using: ${modelName}`);
        break;
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ ${modelName} failed, trying next model...`);
        continue;
      }
    }

    if (!response) throw lastError;

    res.status(200).json({
      success: true,
      reply: response.text,
    });
 } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(error.status || 500);
    next(new Error(error.message || 'Failed to generate AI response.'));
  }
};