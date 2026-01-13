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
 * Analyze images and generate research using vision model
 * @param {Array} images - Array of image objects with base64 data
 * @param {string} topic - Research topic
 * @param {Array} sections - Sections to include
 * @param {string} instructions - Additional instructions
 */
export async function analyzeImagesForResearch(
  images,
  topic = null,
  sections = [],
  instructions = ""
) {
  try {
    // Build content with images
    const content = [
      {
        type: "text",
        text: `${
          topic || "قم بتحليل الصور التالية وإنشاء بحث علمي شامل"
        }\n\n${instructions}`,
      },
    ];

    // Add all images
    images.forEach((img) => {
      content.push({
        type: "image_url",
        image_url: {
          url: img.base64 || img.preview,
        },
      });
    });

    const messages = [
      {
        role: "system",
        content: `أنت باحث أكاديمي متخصص في تحليل الصور وكتابة الأبحاث العلمية.
قم بتحليل الصور المرفقة بعناية واستخدمها كأساس للبحث.
اكتب بحثاً علمياً شاملاً بناءً على محتوى وسياق الصور.
استخدم اللغة العربية الفصحى ومعايير البحث الأكاديمي.
⚠️ مهم: لا تذكر الصور أو تشير إليها في النص - اكتب البحث مباشرة بناءً على محتواها.`,
      },
      {
        role: "user",
        content: content,
      },
    ];

    return chatCompletion(messages, {
      model: "meta-llama/Llama-3.2-11B-Vision-Instruct", // ✅ Cheapest vision model
      max_tokens: 8000,
      temperature: 0.7,
    });
  } catch (error) {
    console.error("Error analyzing images:", error);
    throw error;
  }
}

/**
 * Extract research topic from uploaded images
 * @param {Array} images - Array of image objects with base64 data
 * @returns {Object} - { suggestedTopic, keyThemes, confidence, description }
 */
export async function extractTopicFromImages(images) {
  try {
    const content = [
      {
        type: "text",
        text: `قم بتحليل الصور التالية واقترح موضوع بحث علمي مناسب.

قدم:
1. موضوع بحث واضح ومحدد (جملة واحدة)
2. الموضوعات الرئيسية (3-5 نقاط)
3. وصف موجز لمحتوى الصور
4. مستوى الثقة في التحليل (عالي/متوسط/منخفض)

اكتب إجابتك بتنسيق JSON كالتالي:
{
  "suggestedTopic": "موضوع البحث المقترح",
  "keyThemes": ["موضوع 1", "موضوع 2", "موضوع 3"],
  "description": "وصف مختصر لمحتوى الصور",
  "confidence": "عالي"
}`,
      },
    ];

    // Add all images
    images.forEach((img) => {
      content.push({
        type: "image_url",
        image_url: {
          url: img.base64 || img.preview,
        },
      });
    });

    const messages = [
      {
        role: "system",
        content: `أنت خبير في تحليل الصور الأكاديمية وتحديد موضوعات البحث.
قم بتحليل الصور بعناية وتحديد الموضوع الأكثر ملاءمة للبحث العلمي.
كن دقيقاً ومحدداً في اقتراحاتك.`,
      },
      {
        role: "user",
        content: content,
      },
    ];

    const response = await chatCompletion(messages, {
      model: "meta-llama/Llama-3.2-11B-Vision-Instruct", // ✅ Cheapest vision model
      max_tokens: 1000,
      temperature: 0.7,
    });

    const result = response.choices?.[0]?.message?.content || "{}";

    try {
      // Try to parse JSON response
      return JSON.parse(result);
    } catch (parseError) {
      // If JSON parsing fails, extract topic from text
      console.warn("Failed to parse JSON, extracting topic from text");
      return {
        suggestedTopic: result.split("\n")[0].trim(),
        keyThemes: [],
        description: result,
        confidence: "متوسط",
      };
    }
  } catch (error) {
    console.error("Error extracting topic from images:", error);
    throw error;
  }
}

/**
 * Analyze images and suggest research topic (simplified, faster version)
 * Uses Llama 3.2 11B Vision Turbo for quick topic generation
 * @param {Array<File>} images - Array of image File objects
 * @returns {Promise<string>} - Suggested research topic in Arabic
 */
export async function analyzeImagesForTopic(images) {
  try {
    // Convert images to base64
    const imageBase64Array = await Promise.all(
      images.map(async (img) => {
        const file = img.file || img;
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result;
            resolve(base64);
          };
          reader.readAsDataURL(file);
        });
      })
    );

    // Build content with images
    const content = [
      {
        type: "text",
        text: "بناءً على هذه الصور، اقترح عنوان بحث أكاديمي مناسب باللغة العربية. أعطني العنوان فقط بدون أي نص إضافي.",
      },
      ...imageBase64Array.map((base64) => ({
        type: "image_url",
        image_url: {
          url: base64,
        },
      })),
    ];

    const messages = [
      {
        role: "system",
        content:
          "أنت مساعد ذكي متخصص في تحليل الصور واقتراح موضوعات بحثية أكاديمية باللغة العربية. اقترح عنواناً واضحاً ومحدداً.",
      },
      {
        role: "user",
        content: content,
      },
    ];

    // Call Llama 3.2 11B Vision Turbo
    const response = await chatCompletion(messages, {
      model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
      max_tokens: 100,
      temperature: 0.7,
    });

    const suggestedTopic =
      response.choices?.[0]?.message?.content?.trim() || "";

    console.log("🎯 AI suggested topic from images:", suggestedTopic);

    return suggestedTopic;
  } catch (error) {
    console.error("Error analyzing images for topic:", error);
    throw error;
  }
}

/**
 * Generate illustrative images for research content
 * @param {string} researchContent - The research text content
 * @param {number} imageCount - Number of images to generate
 */
export async function generateIllustrativeImages(
  researchContent,
  imageCount = 3
) {
  try {
    // Extract key concepts/topics from research (simple approach)
    const topics = extractKeyTopics(researchContent, imageCount);

    const imagePromises = topics.map(async (topic) => {
      const response = await fetch(`${API_URL}/images/generations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `${topic}, scientific illustration, high quality, professional`,
          model: "openai/gpt-image-1",
          n: 1,
          size: "1024x1024",
        }),
      });

      if (!response.ok) {
        throw new Error(`Image generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        topic,
        url: data.data?.[0]?.url || null,
        base64: data.data?.[0]?.b64_json || null,
      };
    });

    return Promise.all(imagePromises);
  } catch (error) {
    console.error("Error generating images:", error);
    throw error;
  }
}

// Helper function to extract key topics
function extractKeyTopics(content, count) {
  // Simple extraction: Find section headers or key phrases
  const lines = content.split("\n");
  const topics = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Look for section headers (typically shorter lines with meaningful content)
    if (
      trimmed.length > 10 &&
      trimmed.length < 80 &&
      !trimmed.startsWith("-")
    ) {
      topics.push(trimmed);
      if (topics.length >= count) break;
    }
  }

  // Fallback if not enough topics found
  while (topics.length < count) {
    topics.push("Scientific illustration");
  }

  return topics.slice(0, count);
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

  // تعليمات واضحة للأقسام المحددة فقط
  if (sections.length > 0) {
    userPrompt += `\n⚠️ مهم جداً: اكتب فقط الأقسام التالية ولا تكتب أي أقسام أخرى:\n${sections.join(
      "\n"
    )}\n\n`;
    userPrompt += `ممنوع كتابة أي أقسام غير المذكورة أعلاه. اكتب فقط الأقسام المحددة.\n`;
    userPrompt += `⚠️ مهم جداً: لا تكرر أي قسم - كل قسم يجب أن يظهر مرة واحدة فقط.\n`;
    userPrompt += `⚠️ مهم جداً: لا تكتب "فهرس المحتوى" كقسم في المحتوى.\n`;
  } else {
    userPrompt += `أقسام: ${sectionsList}\n`;
  }

  if (userMessage) userPrompt += `\nملاحظات إضافية: ${userMessage}\n`;

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
- لا تذكر أي شيء عن الخطوط أو الألوان أو التنسيق
- ⚠️ مهم جداً: إذا تم تحديد أقسام محددة فقط، اكتب فقط هذه الأقسام ولا تضيف أي أقسام أخرى غير مذكورة
- التزم تماماً بالأقسام المحددة في التعليمات ولا تخرج عنها
- ⚠️ مهم جداً: لا تكرر أي قسم - كل قسم يجب أن يظهر مرة واحدة فقط
- ⚠️ مهم جداً: لا تكتب "فهرس المحتوى" كقسم في المحتوى - الفهرس سيتم إضافته تلقائياً`,
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
  analyzeImagesForResearch,
  extractTopicFromImages,
  analyzeImagesForTopic, // NEW
  generateIllustrativeImages,
  generateResearchPaper,
  generateQuestions,
  solveQuestion,
  generateMindMap,
  summarizeDocument,
  generatePresentation,
};
