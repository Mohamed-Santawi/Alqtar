/**
 * AIML API Service
 * Provides integration with AIML API for AI-powered features
 */

const API_URL =
  import.meta.env.VITE_AIML_API_URL || "https://api.aimlapi.com/v1";
const API_KEY =
  import.meta.env.VITE_AIML_API_KEY || "24846e8f3bce499aaf46ae76bb75f388";

/**
 * Make a chat completion request
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} options - Additional options like model, temperature, etc.
 */
export async function chatCompletion(messages, options = {}) {
  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: options.model || "openai/gpt-5-nano-2025-08-07",
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4096,
        ...options,
      }),
    });

    if (!response.ok) {
      let errorMessage = "AI API request failed";
      try {
        const error = await response.json();
        errorMessage = error.error?.message || error.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error("Error in chatCompletion:", error);
    throw error;
  }
}

/**
 * Stream chat completion for real-time responses
 * @param {Array} messages - Array of message objects
 * @param {Function} onChunk - Callback for each streamed chunk
 * @param {Object} options - Additional options
 */
export async function streamChatCompletion(messages, onChunk, options = {}) {
  const response = await fetch(`${API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: options.model || "openai/gpt-5-nano-2025-08-07",
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4096,
      stream: true,
      ...options,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "AI API request failed");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onChunk(content);
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }
}

/**
 * Generate an image using AI
 * @param {string} prompt - The image generation prompt
 * @param {Object} options - Additional options like size, model, etc.
 */
export async function generateImage(prompt, options = {}) {
  const response = await fetch(`${API_URL}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: options.model || "dall-e-3",
      prompt,
      n: options.n || 1,
      size: options.size || "1024x1024",
      ...options,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Image generation failed");
  }

  return response.json();
}

/**
 * Analyze an image and get description
 * @param {string} imageUrl - URL or base64 of the image
 * @param {string} prompt - What to analyze about the image
 */
export async function analyzeImage(
  imageUrl,
  prompt = "وصف هذه الصورة بالتفصيل"
) {
  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    },
  ];

  return chatCompletion(messages, { model: "gpt-4o" });
}

/**
 * Generate research paper content using GPT-5 Nano
 * @param {string} topic - The research topic
 * @param {string} researcherName - Researcher name
 * @param {string} supervisorName - Supervisor name
 * @param {Array} sections - Sections to include (checked options)
 * @param {string} userMessage - Additional user instructions from chat
 * @param {Object} options - Additional options
 */
export async function generateResearchPaper(
  topic,
  researcherName = "",
  supervisorName = "",
  sections = [],
  userMessage = "",
  options = {}
) {
  // Build concise sections list
  const sectionsList =
    sections.length > 0
      ? sections.join("، ")
      : "المقدمة، فهرس المحتوى، الملخص، المنهجية، النتائج، الخاتمة، المراجع";

  // Build optimized prompt - concise but complete
  let userPrompt = `موضوع: "${topic}"\n`;
  if (researcherName) userPrompt += `باحث: ${researcherName}\n`;
  if (supervisorName) userPrompt += `مشرف: ${supervisorName}\n`;
  userPrompt += `أقسام: ${sectionsList}\n`;
  if (userMessage) userPrompt += `ملاحظات: ${userMessage}\n`;

  const messages = [
    {
      role: "system",
      content: `أنت باحث أكاديمي متخصص. اكتب بحثاً علمياً كاملاً بلغة عربية رصينة ومعايير أكاديمية.

قواعد مهمة جداً:
- اكتب المحتوى بالعربية فقط
- لا تكتب أي أكواد LaTeX أو HTML أو أي لغة برمجة
- لا تكتب أي تعليمات تنفيذ أو إرشادات
- لا تكتب أي ملاحظات تمهيدية أو تنبيهات
- ابدأ مباشرة بعنوان البحث ثم المحتوى
- استخدم تنسيق نصي بسيط بالعربية فقط
- لا تذكر أي شيء عن الخطوط أو الألوان أو التنسيق`,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];

  const response = await chatCompletion(messages, {
    model: options.model || "openai/gpt-5-nano-2025-08-07",
    maxTokens: options.maxTokens || 8000, // Reduced from 12000 for efficiency
    temperature: options.temperature || 0.7,
  });

  // Log token usage for monitoring
  if (response.usage) {
    console.log("📊 Token Usage:", {
      prompt: response.usage.prompt_tokens,
      completion: response.usage.completion_tokens,
      total: response.usage.total_tokens,
      cost: `${(response.usage.total_tokens * 0.000001).toFixed(6)} credits`, // Approximate
    });
  }

  return response;
}

/**
 * Generate questions from content
 * @param {string} content - The content to generate questions from
 * @param {Object} options - Question generation options
 */
export async function generateQuestions(content, options = {}) {
  const questionTypes = options.types || [
    "اختيار من متعدد",
    "صح وخطأ",
    "أسئلة مقالية",
  ];
  const count = options.count || 10;

  const messages = [
    {
      role: "system",
      content: `أنت معلم خبير في إنشاء الأسئلة التعليمية.
قم بإنشاء أسئلة متنوعة وشاملة مع الإجابات النموذجية.
تأكد من تغطية جميع النقاط المهمة في المحتوى.`,
    },
    {
      role: "user",
      content: `قم بإنشاء ${count} سؤال من المحتوى التالي:
"${content}"

أنواع الأسئلة المطلوبة: ${questionTypes.join("، ")}

قم بتنسيق الإجابة بصيغة JSON كالتالي:
{
  "questions": [
    {
      "type": "نوع السؤال",
      "question": "نص السؤال",
      "options": ["خيار 1", "خيار 2", ...], // للاختيار من متعدد فقط
      "answer": "الإجابة الصحيحة",
      "explanation": "شرح الإجابة"
    }
  ]
}`,
    },
  ];

  return chatCompletion(messages, { model: "gpt-4o" });
}

/**
 * Solve a question with step-by-step explanation
 * @param {string} question - The question to solve
 * @param {string} imageUrl - Optional image URL if question has an image
 */
export async function solveQuestion(question, imageUrl = null) {
  const content = imageUrl
    ? [
        {
          type: "text",
          text: `حل السؤال التالي مع شرح تفصيلي للخطوات والمصادر:\n${question}`,
        },
        { type: "image_url", image_url: { url: imageUrl } },
      ]
    : `حل السؤال التالي مع شرح تفصيلي للخطوات والمصادر:\n${question}`;

  const messages = [
    {
      role: "system",
      content: `أنت معلم خبير في حل المسائل والأسئلة.
قم بحل السؤال بطريقة منظمة مع شرح كل خطوة.
اذكر المصادر والقوانين المستخدمة.
قدم الإجابة النهائية بوضوح.`,
    },
    {
      role: "user",
      content,
    },
  ];

  return chatCompletion(messages, { model: "gpt-4o" });
}

/**
 * Generate mind map structure from content
 * @param {string} content - The content to create mind map from
 */
export async function generateMindMap(content) {
  const messages = [
    {
      role: "system",
      content: `أنت خبير في إنشاء الخرائط الذهنية.
قم بتحليل المحتوى وإنشاء هيكل خريطة ذهنية منظم.`,
    },
    {
      role: "user",
      content: `قم بإنشاء خريطة ذهنية للمحتوى التالي:
"${content}"

قم بتنسيق الإجابة بصيغة JSON كالتالي:
{
  "title": "العنوان الرئيسي",
  "nodes": [
    {
      "id": "1",
      "label": "الفرع الرئيسي",
      "children": [
        {
          "id": "1-1",
          "label": "الفرع الفرعي",
          "children": []
        }
      ]
    }
  ]
}`,
    },
  ];

  return chatCompletion(messages, { model: "gpt-4o" });
}

/**
 * Summarize a document
 * @param {string} content - The document content
 * @param {string} type - Summary type: 'brief', 'detailed', 'bullet-points'
 */
export async function summarizeDocument(content, type = "detailed") {
  const typeInstructions = {
    brief: "قم بتلخيص المحتوى في فقرة واحدة موجزة",
    detailed: "قم بتلخيص المحتوى بشكل مفصل مع الحفاظ على الأفكار الرئيسية",
    "bullet-points": "قم بتلخيص المحتوى على شكل نقاط رئيسية",
  };

  const messages = [
    {
      role: "system",
      content: "أنت خبير في تلخيص المحتوى الأكاديمي والعلمي باللغة العربية.",
    },
    {
      role: "user",
      content: `${
        typeInstructions[type] || typeInstructions.detailed
      }:\n\n${content}`,
    },
  ];

  return chatCompletion(messages, { model: "gpt-4o" });
}

/**
 * Generate presentation slides
 * @param {string} content - The content to create presentation from
 * @param {number} slideCount - Number of slides to generate
 */
export async function generatePresentation(content, slideCount = 10) {
  const messages = [
    {
      role: "system",
      content: `أنت خبير في إنشاء العروض التقديمية الاحترافية.
قم بإنشاء شرائح عرض منظمة وجذابة.`,
    },
    {
      role: "user",
      content: `قم بإنشاء عرض تقديمي من ${slideCount} شريحة للمحتوى التالي:
"${content}"

قم بتنسيق الإجابة بصيغة JSON كالتالي:
{
  "title": "عنوان العرض",
  "slides": [
    {
      "title": "عنوان الشريحة",
      "content": ["نقطة 1", "نقطة 2", ...],
      "notes": "ملاحظات للمقدم"
    }
  ]
}`,
    },
  ];

  return chatCompletion(messages, { model: "gpt-4o" });
}

export default {
  chatCompletion,
  streamChatCompletion,
  generateImage,
  analyzeImage,
  generateResearchPaper,
  generateQuestions,
  solveQuestion,
  generateMindMap,
  summarizeDocument,
  generatePresentation,
};
