/**
 * AIML API Service
 * Provides integration with AIML API for AI-powered features
 */

const API_URL =
  import.meta.env.VITE_AIML_API_URL || "https://api.aimlapi.com/v1";
const API_KEY = import.meta.env.VITE_AIML_API_KEY;

/**
 * Make a chat completion request
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} options - Additional options like model, temperature, etc.
 */
export async function chatCompletion(messages, options = {}) {
  const response = await fetch(`${API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: options.model || "gpt-4o",
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4096,
      ...options,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "AI API request failed");
  }

  return response.json();
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
      model: options.model || "gpt-4o",
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
 * Generate research paper content
 * @param {string} topic - The research topic
 * @param {Array} sections - Sections to include
 * @param {Object} options - Additional options
 */
export async function generateResearchPaper(
  topic,
  sections = [],
  options = {}
) {
  const sectionsList =
    sections.length > 0
      ? sections.join("، ")
      : "مقدمة، فهرس المحتويات، المنهجية، النتائج، الخاتمة، المراجع";

  const messages = [
    {
      role: "system",
      content: `أنت باحث أكاديمي متخصص في كتابة البحوث العلمية باللغة العربية.
قم بإنشاء بحث علمي شامل ومنظم مع الالتزام بالمعايير الأكاديمية.
استخدم لغة علمية رصينة ودقيقة.`,
    },
    {
      role: "user",
      content: `اكتب بحثاً علمياً حول الموضوع التالي: "${topic}"
يجب أن يتضمن البحث الأقسام التالية: ${sectionsList}
${options.additionalInstructions || ""}`,
    },
  ];

  return chatCompletion(messages, {
    model: options.model || "gpt-4o",
    maxTokens: options.maxTokens || 8000,
  });
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
