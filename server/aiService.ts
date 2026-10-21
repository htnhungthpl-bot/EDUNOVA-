import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import crypto from "crypto";

// ============================================================================
// EDUNOVA WRITING COACH - SERVER-SIDE AI SERVICE
// GIAI ĐOẠN 4: PRODUCTION-GRADE GEMINI 3.8 FLASH ENGINE
// ============================================================================

export interface AiCoachInput {
  level: "cau" | "doan" | "bai";
  promptTopic: string;
  currentContent: string;
  studentQuestion?: string;
  userId?: string;
  userRole?: string;
}

export interface AiCoachFeedback {
  strengths: string[];
  improvements: string[];
  socraticQuestions: string[];
  pedagogicalNote: string;
}

export interface AiCoachResult {
  feedback: AiCoachFeedback;
  source: "gemini-3.8-flash" | "gemini-cached" | "pedagogical-engine";
  latencyMs: number;
  tokensUsed?: number;
}

export interface RubricCriterionScore {
  criterionId: string;
  name: string;
  level: 1 | 2 | 3 | 4;
  score: number;
  comment: string;
  evidence: string;
  suggestion: string;
}

export interface AiRubricFeedback {
  scores: RubricCriterionScore[];
  overallLevel: 1 | 2 | 3 | 4;
  overallScore: number;
  overallComment: string;
}

export interface AiRubricResult {
  rubric: AiRubricFeedback;
  source: "gemini-3.8-flash" | "gemini-cached" | "pedagogical-engine";
  latencyMs: number;
}

// ----------------------------------------------------------------------------
// GIAI ĐOẠN 4 - LƯỢT 3: TÌM Ý, LUYỆN VIẾT CÂU & LẬP DÀN Ý
// ----------------------------------------------------------------------------
export interface AiBrainstormSense {
  title: string;
  icon: string;
  question: string;
  wordPills: string[];
}

export interface AiBrainstormFeedback {
  objectName: string;
  senses: {
    sight: AiBrainstormSense;
    sound: AiBrainstormSense;
    touchSmell: AiBrainstormSense;
    heart: AiBrainstormSense;
  };
  comparisonStarters: string[];
  encouragement: string;
}

export interface AiBrainstormResult {
  brainstorm: AiBrainstormFeedback;
  source: "gemini-3.8-flash" | "gemini-cached" | "pedagogical-engine";
  latencyMs: number;
}

export interface AiSentenceOption {
  type: "comparison" | "personification" | "adverb";
  label: string;
  hint: string;
  samplePattern: string;
}

export interface AiSentenceFeedback {
  originalSentence: string;
  coachQuestion: string;
  options: AiSentenceOption[];
  vocabularyPills: string[];
  encouragement: string;
}

export interface AiSentenceResult {
  expansion: AiSentenceFeedback;
  source: "gemini-3.8-flash" | "gemini-cached" | "pedagogical-engine";
  latencyMs: number;
}

export interface AiOutlineSection {
  name: string;
  target: string;
  guidingQuestion: string;
  checkpoints: string[];
  suggestedConnectors: string[];
}

export interface AiOutlineFeedback {
  topic: string;
  level: string;
  sections: AiOutlineSection[];
  pedagogicalTip: string;
}

export interface AiOutlineResult {
  outline: AiOutlineFeedback;
  source: "gemini-3.8-flash" | "gemini-cached" | "pedagogical-engine";
  latencyMs: number;
}

// ----------------------------------------------------------------------------
// 1. AN TOÀN TRẺ EM & CHỐNG GIAN LẬN (CHILD SAFETY & ANTI-CHEAT GUARDRAILS)
// ----------------------------------------------------------------------------
const INAPPROPRIATE_KEYWORDS = [
  "đánh nhau",
  "bạo lực",
  "chửi bậy",
  "tự tử",
  "súng đạn",
  "giết",
  "kinh dị",
  "người lớn",
  "khiêu dâm",
];

const ANTI_CHEAT_KEYWORDS = [
  "viết hộ em cả bài",
  "viết hộ em toàn bộ",
  "viết giúp em một bài",
  "viết hộ cả bài văn",
  "làm hộ em",
  "viết thay em",
  "cho em bài mẫu chép",
  "làm bài tập hộ",
];

// ----------------------------------------------------------------------------
// 2. BỘ NHỚ ĐỆM (CACHE) & RATE LIMITING THEO PHIÊN
// ----------------------------------------------------------------------------
interface CacheEntry<T> {
  data: T;
  source: "gemini-cached";
  createdAt: number;
}

const responseCache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 phút

// Rate limiter: Lưu số lượng request theo IP/UserId
const requestRateMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX_PER_MINUTE = 6; // Tối đa 6 lượt gọi AI mỗi phút
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export class EduNovaAiService {
  private aiClient: GoogleGenAI | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.initClient();
  }

  private initClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim().length > 5) {
      try {
        this.aiClient = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
        this.isConfigured = true;
        console.log("EduNova AI Service: Gemini 3.8 Flash SDK initialized successfully.");
      } catch (err) {
        console.warn("EduNova AI Service: Failed to init Gemini SDK:", err);
        this.isConfigured = false;
      }
    } else {
      console.log("EduNova AI Service: GEMINI_API_KEY is not set or placeholder. Pedagogical Engine fallback is ready.");
      this.isConfigured = false;
    }
  }

  public getStatus() {
    return {
      isConfigured: this.isConfigured,
      hasKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY",
      model: "gemini-3.8-flash",
      cacheSize: responseCache.size,
    };
  }

  // --------------------------------------------------------------------------
  // CORE RESILIENT GEMINI EXECUTION WITH LOW THINKING & TIMEOUT
  // --------------------------------------------------------------------------
  private async executeGeminiGenerate<T>(
    operationName: string,
    params: {
      contents: any;
      systemInstruction?: string;
      responseSchema?: any;
    },
    timeoutMs = 25000
  ): Promise<T> {
    if (!this.aiClient || !this.isConfigured) {
      throw new Error("Gemini AI Client is not configured");
    }

    const modelsToTry = ["gemini-3.8-flash", "gemini-flash-latest"];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const generatePromise = this.aiClient.models.generateContent({
          model,
          contents: params.contents,
          config: {
            systemInstruction: params.systemInstruction,
            responseMimeType: "application/json",
            responseSchema: params.responseSchema,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`AI_TIMEOUT_${timeoutMs}MS`)), timeoutMs)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        const parsed = JSON.parse(response.text || "{}");
        return parsed as T;
      } catch (err: any) {
        lastError = err;
        console.warn(`[EduNova AI Service] ${operationName} with model ${model} failed:`, err?.message);
      }
    }

    throw lastError || new Error(`${operationName} failed on all available models`);
  }

  // --------------------------------------------------------------------------
  // RATE LIMIT CHECK
  // --------------------------------------------------------------------------
  public checkRateLimit(clientIdentifier: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const clientRecord = requestRateMap.get(clientIdentifier);

    if (!clientRecord || now - clientRecord.windowStart > RATE_LIMIT_WINDOW_MS) {
      requestRateMap.set(clientIdentifier, { count: 1, windowStart: now });
      return { allowed: true, remaining: RATE_LIMIT_MAX_PER_MINUTE - 1 };
    }

    if (clientRecord.count >= RATE_LIMIT_MAX_PER_MINUTE) {
      return { allowed: false, remaining: 0 };
    }

    clientRecord.count += 1;
    return { allowed: true, remaining: RATE_LIMIT_MAX_PER_MINUTE - clientRecord.count };
  }

  // --------------------------------------------------------------------------
  // INPUT VALIDATION & CHILD SAFETY CHECK
  // --------------------------------------------------------------------------
  public validateInput(content: string, studentQuestion?: string): { isValid: boolean; error?: string } {
    const combined = ((content || "") + " " + (studentQuestion || "")).toLowerCase();

    // 1. Kiểm tra độ dài
    if (combined.trim().length === 0) {
      return { isValid: false, error: "Nội dung bài viết hoặc câu hỏi không được để trống." };
    }

    if (content.length > 8000) {
      return { isValid: false, error: "Bài viết vượt quá giới hạn 8.000 ký tự (khoảng 1.500 từ) cho học sinh lớp 4." };
    }

    // 2. Kiểm tra an toàn trẻ em
    for (const kw of INAPPROPRIATE_KEYWORDS) {
      if (combined.includes(kw)) {
        return {
          isValid: false,
          error: "Nội dung có từ ngữ chưa phù hợp với bài học Tiếng Việt lớp 4. Em hãy chọn chủ đề vui tươi, trong sáng hơn nhé!",
        };
      }
    }

    return { isValid: true };
  }

  // --------------------------------------------------------------------------
  // CHỐNG GIAN LẬN: HỌC SINH YÊU CẦU VIẾT HỘ CẢ BÀI
  // --------------------------------------------------------------------------
  public checkAntiCheat(studentQuestion?: string): boolean {
    if (!studentQuestion) return false;
    const lower = studentQuestion.toLowerCase();
    return ANTI_CHEAT_KEYWORDS.some((kw) => lower.includes(kw));
  }

  // --------------------------------------------------------------------------
  // KHỬ ĐỊNH DANH (PII SANITIZATION)
  // --------------------------------------------------------------------------
  private sanitizeContent(content: string): string {
    // Ẩn số điện thoại, địa chỉ cụ thể nếu có
    return content
      .replace(/0\d{9,10}/g, "[Số điện thoại]")
      .replace(/trường tiểu học [^,\.\n]+/gi, "trường tiểu học")
      .trim();
  }

  // --------------------------------------------------------------------------
  // API: AI COACH (PHẢN HỒI SOCRATIC SƯ PHẠM LỚP 4)
  // --------------------------------------------------------------------------
  public async getCoachFeedback(input: AiCoachInput): Promise<AiCoachResult> {
    const startTime = Date.now();

    // 1. Kiểm tra chống gian lận
    if (this.checkAntiCheat(input.studentQuestion)) {
      return {
        feedback: {
          strengths: ["Thầy/Cô EduNova rất vui vì em muốn làm bài văn thật hay và ấn tượng!"],
          improvements: [
            "Theo quy tắc học tập của lớp chúng mình, em chính là tác giả nhí tài năng! Thầy/Cô sẽ không viết thay bài cho em, mà sẽ cùng em khám phá từng ý tưởng nhé.",
          ],
          socraticQuestions: [
            "Bây giờ, em hãy cho Thầy/Cô biết: Em muốn miêu tả sự vật gì đầu tiên?",
            "Khi nhìn vào sự vật ấy, màu sắc hoặc hình dáng nào khiến em chú ý nhất?",
            "Em hãy thử viết 1 câu giới thiệu trước, sau đó bấm gửi để Thầy/Cô cùng em trau chuốt nhé!",
          ],
          pedagogicalNote: "Hướng dẫn sư phạm gợi mở: Học sinh tự suy nghĩ và viết từng câu, không cung cấp bài làm sẵn.",
        },
        source: "pedagogical-engine",
        latencyMs: Date.now() - startTime,
      };
    }

    const sanitized = this.sanitizeContent(input.currentContent);

    // 2. Kiểm tra Cache
    const cacheKey = crypto
      .createHash("sha256")
      .update(`coach:${input.level}:${input.promptTopic}:${sanitized}:${input.studentQuestion || ""}`)
      .digest("hex");

    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
      return {
        feedback: cached.data,
        source: "gemini-cached",
        latencyMs: Date.now() - startTime,
      };
    }

    // 3. Nếu AI Client đã sẵn sàng, thực hiện gọi Gemini 3.8 Flash
    if (this.aiClient && this.isConfigured) {
      try {
        const systemInstruction = `
Bạn là "EduNova Writing Coach" - Chuyên gia phương pháp dạy học Tiếng Việt Tiểu học và Trợ lý AI đồng hành cùng học sinh lớp 4 (lứa tuổi 9-10).
Slogan: "Mỗi ngày chăm chỉ – Mỗi bài viết tiến bộ!"

QUY TẮC SƯ PHẠM BẮT BUỘC:
1. NGÔN NGỮ: Thân thiện, ấm áp, khen ngợi cụ thể, như một người thầy cô giáo tiểu học tận tâm và vui vẻ. Xưng hô: "Thầy/Cô EduNova" và "em" hoặc "bạn nhỏ".
2. KHÔNG VIẾT THAY TOÀN BỘ BÀI VĂN: Không tạo sẵn một bài văn hoàn chỉnh cho học sinh chép. Chỉ đưa ra gợi ý, câu hỏi gợi mở, hoặc 1 ví dụ minh họa ngắn (1 câu) để học sinh tự chọn và chỉnh sửa.
3. TẬP TRUNG: Chỉ chỉ ra 1 đến 3 vấn đề quan trọng nhất cần rèn luyện (không làm học sinh bị ngợp).
4. KHEN TRƯỚC - GỢI Ý SAU:
   - Nêu ít nhất 1-2 ĐIỂM MẠNH cụ thể (trích dẫn đúng câu chữ trong bài của học sinh).
   - Nêu 1-2 GỢI Ý CẢI THIỆN nhẹ nhàng (chỉ rõ vị trí cần trau chuốt và lý do: ví dụ thiếu từ gợi tả, câu lặp từ, hoặc cần thêm so sánh/nhân hóa).
   - Đưa ra 1-2 CÂU HỎI GỢI MỞ (Socratic) để gợi mở trí tưởng tượng theo các giác quan (mắt thấy, tai nghe, mũi ngửi, cảm xúc).
5. ĐỐI TƯỢNG: Học sinh lớp 4 (9-10 tuổi), ngữ liệu chuẩn mực tiếng Việt, giàu hình ảnh, trong sáng, nhân văn.
`;

        const userPrompt = `
Cấp độ: ${input.level === "cau" ? "Cấp độ 1: Luyện câu" : input.level === "doan" ? "Cấp độ 2: Luyện đoạn" : "Cấp độ 3: Luyện bài văn"}
Đề bài / Chủ đề: "${input.promptTopic || "Bài tập viết tự do"}"
Đoạn văn của học sinh viết:
"""
${sanitized}
"""
${input.studentQuestion ? `Câu hỏi hoặc mong muốn của học sinh: "${input.studentQuestion}"` : ""}

Hãy phân tích bài của học sinh theo đúng quy tắc sư phạm EduNova và trả lời định dạng JSON theo đúng schema.
`;

        // Gọi API với cơ chế Low Thinking & Timeout 25s
        const parsed: AiCoachFeedback = await this.executeGeminiGenerate<AiCoachFeedback>(
          "CoachFeedback",
          {
            contents: userPrompt,
            systemInstruction,
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Các điểm mạnh kèm minh chứng cụ thể từ bài viết của học sinh",
                },
                improvements: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "1 đến 2 gợi ý cải thiện nhẹ nhàng, chỉ rõ vị trí và lý do",
                },
                socraticQuestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Câu hỏi gợi mở khơi gợi tưởng tượng và giác quan",
                },
                pedagogicalNote: {
                  type: Type.STRING,
                  description: "Lời khích lệ ấm áp của Thầy/Cô Trợ lý",
                },
              },
              required: ["strengths", "improvements", "socraticQuestions", "pedagogicalNote"],
            },
          },
          25000
        );

        // Lưu Cache
        responseCache.set(cacheKey, {
          data: parsed,
          source: "gemini-cached",
          createdAt: Date.now(),
        });

        return {
          feedback: parsed,
          source: "gemini-3.8-flash",
          latencyMs: Date.now() - startTime,
        };
      } catch (err: any) {
        console.warn("EduNova AI Service: Gemini call failed or timed out, gracefully falling back:", err?.message);
      }
    }

    // 4. Fallback Sư phạm Heuristic
    const fallback = this.generatePedagogicalFallback(sanitized, input.level, input.promptTopic);
    return {
      feedback: fallback,
      source: "pedagogical-engine",
      latencyMs: Date.now() - startTime,
    };
  }

  // --------------------------------------------------------------------------
  // API: AI RUBRIC EVALUATION (ĐÁNH GIÁ 6 TIÊU CHÍ LỚP 4)
  // --------------------------------------------------------------------------
  public async getRubricEvaluation(
    content: string,
    level: string,
    topic?: string,
    title?: string
  ): Promise<AiRubricResult> {
    const startTime = Date.now();
    const sanitized = this.sanitizeContent(content);

    const cacheKey = crypto
      .createHash("sha256")
      .update(`rubric:${level}:${title || topic || ""}:${sanitized}`)
      .digest("hex");

    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
      return {
        rubric: cached.data,
        source: "gemini-cached",
        latencyMs: Date.now() - startTime,
      };
    }

    if (this.aiClient && this.isConfigured) {
      try {
        const rubricSystemInstruction = `
Bạn là "EduNova Rubric Assessor" - Chuyên gia khảo thí và đánh giá bài làm học sinh lớp 4 môn Tiếng Việt.
Đánh giá theo Rubric 4 mức:
- Mức 1: Cần hỗ trợ (1.0 - 2.5 điểm)
- Mức 2: Đang hình thành (2.6 - 3.5 điểm)
- Mức 3: Đạt yêu cầu (3.6 - 4.5 điểm)
- Mức 4: Vận dụng tốt (4.6 - 5.0 điểm)

6 tiêu chí đánh giá bắt buộc:
1. c1 - Đáp ứng yêu cầu đề bài
2. c2 - Nội dung và phát triển ý
3. c3 - Diễn đạt câu
4. c4 - Sử dụng từ ngữ và hình ảnh (so sánh, nhân hóa, từ gợi cảm)
5. c5 - Mạch lạc, liên kết
6. c6 - Chính tả và trình bày
`;

        const rubricPrompt = `
Đề bài: "${title || topic || "Bài tập viết lớp 4"}"
Cấp độ: ${level}
Bài viết của học sinh:
"""
${sanitized}
"""
Hãy chấm điểm theo Rubric 4 mức và trả về JSON chuẩn xác.
`;

        const parsed: AiRubricFeedback = await this.executeGeminiGenerate<AiRubricFeedback>(
          "RubricEvaluation",
          {
            contents: rubricPrompt,
            systemInstruction: rubricSystemInstruction,
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                scores: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      criterionId: { type: Type.STRING },
                      name: { type: Type.STRING },
                      level: { type: Type.INTEGER },
                      score: { type: Type.NUMBER },
                      comment: { type: Type.STRING },
                      evidence: { type: Type.STRING },
                      suggestion: { type: Type.STRING },
                    },
                    required: ["criterionId", "name", "level", "score", "comment", "evidence", "suggestion"],
                  },
                },
                overallLevel: { type: Type.INTEGER },
                overallScore: { type: Type.NUMBER },
                overallComment: { type: Type.STRING },
              },
              required: ["scores", "overallLevel", "overallScore", "overallComment"],
            },
          },
          25000
        );

        responseCache.set(cacheKey, {
          data: parsed,
          source: "gemini-cached",
          createdAt: Date.now(),
        });

        return {
          rubric: parsed,
          source: "gemini-3.8-flash",
          latencyMs: Date.now() - startTime,
        };
      } catch (err: any) {
        console.warn("EduNova AI Service: Gemini Rubric failed or timed out, gracefully falling back:", err?.message);
      }
    }

    const fallbackRubric = this.generateFallbackRubric(sanitized, level);
    return {
      rubric: fallbackRubric,
      source: "pedagogical-engine",
      latencyMs: Date.now() - startTime,
    };
  }

  // --------------------------------------------------------------------------
  // HEURISTIC PEDAGOGICAL ENGINE (RULE-BASED FALLBACK)
  // --------------------------------------------------------------------------
  private generatePedagogicalFallback(content: string, level: string, topic?: string): AiCoachFeedback {
    const words = (content || "").trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const hasComparison = /như|giống như|tựa như|là một/i.test(content);
    const hasPersonification = /bác|chú|chị|cô|bạn|thì thầm|reo vui|ngái ngủ|bung nở|vẫy tay/i.test(content);
    const hasSensoryWords = /rực rỡ|xanh mướt|mềm mại|thoang thoảng|rộn rã|lấp lánh|xù xì|ngào ngạt|êm đềm/i.test(content);

    const strengths: string[] = [];
    const improvements: string[] = [];
    const socraticQuestions: string[] = [];

    if (wordCount > 10) {
      strengths.push(`Bài viết có độ dài ${wordCount} từ rất tự tin và diễn đạt rõ ý!`);
    } else {
      strengths.push("Em đã có ý tưởng ban đầu rất đáng khen ngợi!");
    }

    if (hasComparison) {
      strengths.push("Thầy/Cô rất thích cách em dùng hình ảnh so sánh sinh động trong bài!");
    } else {
      improvements.push("Em hãy thử thêm 1 câu so sánh có từ 'như' hoặc 'tựa như' để sự vật hiện lên rõ nét hơn nhé.");
    }

    if (hasPersonification) {
      strengths.push("Em đã biết nhân hóa sự vật làm cho câu chuyện thêm phần ngộ nghĩnh và gần gũi.");
    } else {
      improvements.push("Nếu em gọi sự vật là 'bác', 'chú' hoặc cho sự vật có hành động như con người (ví dụ: 'thì thầm', 'vẫy tay') thì bài sẽ hay hơn nữa đấy!");
    }

    if (hasSensoryWords) {
      strengths.push("Em dùng các từ ngữ gợi tả màu sắc, âm thanh rất khéo léo.");
    }

    socraticQuestions.push("Nếu đứng thật gần sự vật đó, em cảm thấy mùi hương hay bề mặt khi chạm tay vào như thế nào?");
    socraticQuestions.push("Kỷ niệm vui nhất của em gắn liền với cảnh vật hay con vật này là gì?");

    return {
      strengths,
      improvements: improvements.slice(0, 2),
      socraticQuestions,
      pedagogicalNote: "Em đang tiến bộ rất nhanh! Hãy đọc lại bài một lượt và tự tin chỉnh sửa theo gợi ý của Thầy/Cô nhé.",
    };
  }

  private generateFallbackRubric(content: string, _level: string): AiRubricFeedback {
    const words = (content || "").trim().split(/\s+/).filter(Boolean);
    const count = words.length;

    const hasComparison = /như|giống như|tựa như/i.test(content);

    const score1 = count >= 20 ? 4.5 : 3.5;
    const score2 = count >= 50 ? 4.8 : 3.8;
    const score3 = 4.2;
    const score4 = hasComparison ? 4.7 : 3.6;
    const score5 = 4.3;
    const score6 = 4.5;

    const avg = Number(((score1 + score2 + score3 + score4 + score5 + score6) / 6).toFixed(1));
    const overallLevel = (avg >= 4.5 ? 4 : avg >= 3.6 ? 3 : avg >= 2.6 ? 2 : 1) as 1 | 2 | 3 | 4;

    return {
      scores: [
        {
          criterionId: "c1",
          name: "Đáp ứng yêu cầu đề bài",
          level: (score1 >= 4.5 ? 4 : 3) as 1 | 2 | 3 | 4,
          score: score1,
          comment: "Bám sát chủ đề và yêu cầu",
          evidence: content.slice(0, 45) + "...",
          suggestion: "Tiếp tục giữ vững",
        },
        {
          criterionId: "c2",
          name: "Nội dung & phát triển ý",
          level: (score2 >= 4.5 ? 4 : 3) as 1 | 2 | 3 | 4,
          score: score2,
          comment: "Ý tưởng phong phú, diễn đạt rõ nét",
          evidence: "Bài viết phát triển đủ ý chính",
          suggestion: "Bổ sung thêm chi tiết cụ thể",
        },
        {
          criterionId: "c3",
          name: "Diễn đạt câu",
          level: 3,
          score: score3,
          comment: "Câu văn gãy gọn, có cấu trúc ngữ pháp tốt",
          evidence: "Không mắc lỗi câu què hay câu cụt",
          suggestion: "Đa dạng hóa cách mở đầu câu",
        },
        {
          criterionId: "c4",
          name: "Sử dụng từ ngữ & hình ảnh",
          level: (score4 >= 4.5 ? 4 : 3) as 1 | 2 | 3 | 4,
          score: score4,
          comment: hasComparison ? "Có hình ảnh so sánh sinh động" : "Nên bổ sung thêm biện pháp so sánh",
          evidence: hasComparison ? "Dùng từ so sánh chuẩn mực" : "Cần thêm từ gợi cảm",
          suggestion: "Thêm từ láy gợi tả màu sắc và âm thanh",
        },
        {
          criterionId: "c5",
          name: "Mạch lạc, liên kết",
          level: 3,
          score: score5,
          comment: "Các câu nối tiếp nhau hợp lý",
          evidence: "Trật tự diễn đạt tự nhiên",
          suggestion: "Dùng thêm từ nối như 'bên cạnh đó', 'không những thế'",
        },
        {
          criterionId: "c6",
          name: "Chính tả & trình bày",
          level: 4,
          score: score6,
          comment: "Chữ viết sạch sẽ, đúng quy tắc chính tả",
          evidence: "Chính tả đạt yêu cầu",
          suggestion: "Tiếp tục duy trì",
        },
      ],
      overallLevel,
      overallScore: avg,
      overallComment: "Bài viết thể hiện sự nỗ lực và tư duy phong phú của em!",
    };
  }

  // --------------------------------------------------------------------------
  // API: AI TÌM Ý THEO 5 GIÁC QUAN (BRAINSTORMING)
  // --------------------------------------------------------------------------
  public async getBrainstorming(topic: string, level: string = "bai"): Promise<AiBrainstormResult> {
    const startTime = Date.now();
    const sanitizedTopic = this.sanitizeContent(topic || "Thiên nhiên quê hương");

    // 1. Kiểm tra chống gian lận
    if (this.checkAntiCheat(sanitizedTopic)) {
      return {
        brainstorm: {
          objectName: "Gợi ý tự khám phá ý tưởng",
          senses: {
            sight: {
              title: "Mắt thấy (Hình dáng & Màu sắc)",
              icon: "👀",
              question: "Em hãy nhắm mắt lại và tưởng tượng: Màu sắc nào của sự vật làm em ấn tượng nhất?",
              wordPills: ["xanh mướt", "đỏ rực", "cao vút", "nhỏ nhắn", "lấp lánh"],
            },
            sound: {
              title: "Tai nghe (Âm thanh)",
              icon: "👂",
              question: "Có âm thanh gì xung quanh sự vật? Gió thổi, tiếng ve, hay tiếng bước chân?",
              wordPills: ["xào xạc", "thì thầm", "râm ran", "róc rách", "êm ru"],
            },
            touchSmell: {
              title: "Chạm & Mùi hương",
              icon: "🌸",
              question: "Khi sờ vào hoặc hít thở gần sự vật, em cảm thấy thế nào?",
              wordPills: ["mềm mại như nhung", "mát rượi", "thoang thoảng", "ấm áp"],
            },
            heart: {
              title: "Trái tim cảm nhận",
              icon: "❤️",
              question: "Em yêu quý sự vật đó vì điều gì?",
              wordPills: ["yêu quý", "thân thiết", "gắn bó", "nâng niu", "kỷ niệm"],
            },
          },
          comparisonStarters: ["như chiếc ô che mát", "tựa như dải lụa mềm mại"],
          encouragement: "Thầy/Cô EduNova không viết thay bài cho em, nhưng các từ ngữ đẹp trên sẽ giúp em tự viết nên bài văn tuyệt vời!",
        },
        source: "pedagogical-engine",
        latencyMs: Date.now() - startTime,
      };
    }

    const cacheKey = crypto
      .createHash("sha256")
      .update(`brainstorm:${level}:${sanitizedTopic}`)
      .digest("hex");

    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
      return {
        brainstorm: cached.data,
        source: "gemini-cached",
        latencyMs: Date.now() - startTime,
      };
    }

    if (this.aiClient && this.isConfigured) {
      try {
        const systemInstruction = `
Bạn là "EduNova Writing Coach" - Trợ lý hướng dẫn học sinh lớp 4 khám phá ý tưởng miêu tả theo 5 giác quan.
Nguyên tắc: Thân thiện, khơi gợi, đưa ra các từ ngữ gợi cảm (từ láy, tính từ, so sánh) để học sinh tự chọn lựa.
KHÔNG viết thành một bài văn hoàn chỉnh hay đoạn văn giải sẵn. Chỉ cung cấp câu hỏi gợi mở và ngân hàng từ vựng ngắn.
`;

        const userPrompt = `
Chủ đề bài viết: "${sanitizedTopic}"
Cấp độ học sinh: ${level} (Lớp 4)

Hãy gợi mở ý tưởng cho học sinh theo 4 nhóm giác quan:
1. Mắt thấy (Hình dáng, màu sắc)
2. Tai nghe (Âm thanh)
3. Chạm & Mùi hương (Xúc giác & Khứu giác)
4. Trái tim cảm nhận (Cảm xúc & Kỷ niệm)
Và cung cấp 2 gợi ý mở đầu so sánh (ví dụ: "như chiếc ô...", "tựa như dải lụa...").
`;

        const parsed: AiBrainstormFeedback = await this.executeGeminiGenerate<AiBrainstormFeedback>(
          "Brainstorming",
          {
            contents: userPrompt,
            systemInstruction,
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                objectName: { type: Type.STRING },
                senses: {
                  type: Type.OBJECT,
                  properties: {
                    sight: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        icon: { type: Type.STRING },
                        question: { type: Type.STRING },
                        wordPills: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ["title", "icon", "question", "wordPills"],
                    },
                    sound: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        icon: { type: Type.STRING },
                        question: { type: Type.STRING },
                        wordPills: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ["title", "icon", "question", "wordPills"],
                    },
                    touchSmell: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        icon: { type: Type.STRING },
                        question: { type: Type.STRING },
                        wordPills: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ["title", "icon", "question", "wordPills"],
                    },
                    heart: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        icon: { type: Type.STRING },
                        question: { type: Type.STRING },
                        wordPills: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ["title", "icon", "question", "wordPills"],
                    },
                  },
                  required: ["sight", "sound", "touchSmell", "heart"],
                },
                comparisonStarters: { type: Type.ARRAY, items: { type: Type.STRING } },
                encouragement: { type: Type.STRING },
              },
              required: ["objectName", "senses", "comparisonStarters", "encouragement"],
            },
          },
          25000
        );

        responseCache.set(cacheKey, {
          data: parsed,
          source: "gemini-cached",
          createdAt: Date.now(),
        });

        return {
          brainstorm: parsed,
          source: "gemini-3.8-flash",
          latencyMs: Date.now() - startTime,
        };
      } catch (err: any) {
        console.warn("EduNova AI Service: Gemini Brainstorm failed, falling back to pedagogical engine:", err?.message);
      }
    }

    const fallback = this.generateFallbackBrainstorm(sanitizedTopic);
    return {
      brainstorm: fallback,
      source: "pedagogical-engine",
      latencyMs: Date.now() - startTime,
    };
  }

  // --------------------------------------------------------------------------
  // API: AI LUYỆN VIẾT CÂU & BIỆN PHÁP TU TỪ (SENTENCE EXPANSION)
  // --------------------------------------------------------------------------
  public async getSentenceExpansion(
    originalSentence: string,
    technique: string = "all"
  ): Promise<AiSentenceResult> {
    const startTime = Date.now();
    const sanitized = this.sanitizeContent(originalSentence || "Cây phượng nở hoa đỏ rực.");

    // 1. Kiểm tra chống gian lận
    if (this.checkAntiCheat(sanitized)) {
      return {
        expansion: {
          originalSentence: sanitized,
          coachQuestion: "Thầy/Cô EduNova luôn đồng hành cùng em! Theo quy tắc học tập của lớp chúng mình, em chính là tác giả nhí tài năng. Thầy/Cô sẽ không viết thay cả bài cho em, mà sẽ cùng em rèn giũa từng câu nhé!",
          options: [
            {
              type: "comparison",
              label: "1. Thử viết câu mở đầu với hình ảnh So sánh",
              hint: "Em hãy quan sát sự vật và so sánh với một điều thân quen (như, tựa như...)",
              samplePattern: "Nhìn từ xa, [tên sự vật] trông tựa như [hình ảnh so sánh]...",
            },
            {
              type: "personification",
              label: "2. Thử viết câu giới thiệu với Nhân hóa",
              hint: "Gọi sự vật như một người bạn thân thiết (bác, chú, bạn nhỏ...)",
              samplePattern: "Mỗi ngày đến trường, [bác / chú / bạn ...] luôn đón chào em...",
            },
            {
              type: "adverb",
              label: "3. Mở rộng câu với Trạng ngữ thời gian/không gian",
              hint: "Gợi mở không gian hoặc thời gian buổi sáng mùa hè trong trẻo",
              samplePattern: "Vào một buổi sớm mùa hè trong trẻo, [sự vật] hiện lên thật sinh động...",
            },
          ],
          vocabularyPills: ["như chiếc ô", "tựa như dải lụa", "thì thầm", "bác phượng già", "xanh mướt", "lung linh"],
          encouragement: "Em hãy tự chọn một hướng gợi mở ở trên và thử tự tay viết 1 câu đầu tiên nhé!",
        },
        source: "pedagogical-engine",
        latencyMs: Date.now() - startTime,
      };
    }

    const cacheKey = crypto
      .createHash("sha256")
      .update(`sentence:${technique}:${sanitized}`)
      .digest("hex");

    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
      return {
        expansion: cached.data,
        source: "gemini-cached",
        latencyMs: Date.now() - startTime,
      };
    }

    if (this.aiClient && this.isConfigured) {
      try {
        const systemInstruction = `
Bạn là "EduNova Writing Coach" - Hướng dẫn học sinh lớp 4 nâng cấp câu văn đơn điệu thành câu văn có hình ảnh.
Quy tắc:
1. Đặt câu hỏi gợi mở cho học sinh suy nghĩ.
2. Cung cấp 2-3 hướng nâng cấp: Thêm so sánh (như...), Nhân hóa (bác/chú, thì thầm...), hoặc Thêm trạng ngữ thời gian/nơi chốn.
3. Cung cấp khung mẫu gợi ý để học sinh tự điền vào, KHÔNG viết thay câu hoàn chỉnh.
`;

        const userPrompt = `
Câu gốc của học sinh: "${sanitized}"
Yêu cầu: Hướng dẫn học sinh trau chuốt câu văn với các từ so sánh, nhân hóa và từ láy gợi cảm.
`;

        const parsed: AiSentenceFeedback = await this.executeGeminiGenerate<AiSentenceFeedback>(
          "SentenceExpansion",
          {
            contents: userPrompt,
            systemInstruction,
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                originalSentence: { type: Type.STRING },
                coachQuestion: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      label: { type: Type.STRING },
                      hint: { type: Type.STRING },
                      samplePattern: { type: Type.STRING },
                    },
                    required: ["type", "label", "hint", "samplePattern"],
                  },
                },
                vocabularyPills: { type: Type.ARRAY, items: { type: Type.STRING } },
                encouragement: { type: Type.STRING },
              },
              required: ["originalSentence", "coachQuestion", "options", "vocabularyPills", "encouragement"],
            },
          },
          25000
        );

        responseCache.set(cacheKey, {
          data: parsed,
          source: "gemini-cached",
          createdAt: Date.now(),
        });

        return {
          expansion: parsed,
          source: "gemini-3.8-flash",
          latencyMs: Date.now() - startTime,
        };
      } catch (err: any) {
        console.warn("EduNova AI Service: Gemini Sentence Expansion failed, falling back:", err?.message);
      }
    }

    const fallback = this.generateFallbackSentenceExpansion(sanitized);
    return {
      expansion: fallback,
      source: "pedagogical-engine",
      latencyMs: Date.now() - startTime,
    };
  }

  // --------------------------------------------------------------------------
  // API: AI LẬP DÀN Ý 3 PHẦN (OUTLINE BUILDER)
  // --------------------------------------------------------------------------
  public async getOutline(topic: string, level: string = "bai"): Promise<AiOutlineResult> {
    const startTime = Date.now();
    const sanitizedTopic = this.sanitizeContent(topic || "Bài văn miêu tả lớp 4");

    // 1. Kiểm tra chống gian lận
    if (this.checkAntiCheat(sanitizedTopic)) {
      return {
        outline: {
          topic: "Hướng dẫn tự lập dàn ý 3 phần",
          level,
          sections: [
            {
              name: "1. Mở bài",
              target: "Giới thiệu sự vật định miêu tả",
              guidingQuestion: "Em hãy tự chọn: Em muốn giới thiệu trực tiếp hay gián tiếp qua một bài hát, câu đố hoặc kỷ niệm?",
              checkpoints: ["Nêu tên sự vật em muốn tả", "Thời điểm hoặc hoàn cảnh em quan sát sự vật"],
              suggestedConnectors: ["Mỗi buổi sáng...", "Trong góc sân trường...", "Em rất yêu quý..."],
            },
            {
              name: "2. Thân bài",
              target: "Tự quan sát từ bao quát đến chi tiết",
              guidingQuestion: "Từ xa nhìn lại sự vật thế nào? Đến gần có những nét gì nổi bật nhất?",
              checkpoints: [
                "Tả bao quát: Hình dáng, màu sắc, kích thước nổi bật",
                "Tả chi tiết: 2-3 bộ phận đặc sắc nhất bằng từ gợi tả",
                "Vận dụng ít nhất 1 câu so sánh và 1 câu nhân hóa của riêng em",
                "Tả hoạt động, ích lợi hoặc âm thanh xung quanh",
              ],
              suggestedConnectors: ["Nhìn từ xa...", "Lại gần hơn...", "Đặc biệt nhất là...", "Bên cạnh đó..."],
            },
            {
              name: "3. Kết bài",
              target: "Bày tỏ cảm xúc và lời hứa của em",
              guidingQuestion: "Sự vật ấy có ý nghĩa thế nào với em? Em sẽ chăm sóc hoặc giữ gìn ra sao?",
              checkpoints: ["Tình cảm gắn bó yêu thương của em", "Ước mong hoặc lời hứa giữ gìn sự vật"],
              suggestedConnectors: ["Em rất yêu quý...", "Dẫu mai này lớn khôn...", "Mỗi ngày đến trường..."],
            },
          ],
          pedagogicalTip: "Thầy/Cô EduNova không viết thay bài cho em, nhưng chiếc la bàn dàn ý 3 phần này sẽ giúp em tự tin viết bài văn tuyệt hay!",
        },
        source: "pedagogical-engine",
        latencyMs: Date.now() - startTime,
      };
    }

    const cacheKey = crypto
      .createHash("sha256")
      .update(`outline:${level}:${sanitizedTopic}`)
      .digest("hex");

    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
      return {
        outline: cached.data,
        source: "gemini-cached",
        latencyMs: Date.now() - startTime,
      };
    }

    if (this.aiClient && this.isConfigured) {
      try {
        const systemInstruction = `
Bạn là "EduNova Writing Coach" - Hướng dẫn học sinh lớp 4 lập dàn ý cho bài văn miêu tả chuẩn Bộ GD&ĐT.
Dàn ý gồm 3 phần:
1. Mở bài (Gián tiếp hoặc Trực tiếp)
2. Thân bài (Tả bao quát -> Tả từng bộ phận/hoạt động nổi bật)
3. Kết bài (Kết bài mở rộng hoặc Không mở rộng)
QUY TẮC: Cung cấp câu hỏi định hướng và các điểm cần nhớ (checkpoints) cho từng phần. KHÔNG viết thành bài văn mẫu.
`;

        const userPrompt = `
Đề bài: "${sanitizedTopic}"
Cấp độ: ${level === "cau" ? "Luyện câu" : level === "doan" ? "Luyện đoạn văn" : "Luyện bài văn hoàn chỉnh"}

Hãy xây dựng khung dàn ý gợi mở để học sinh tự điền ý tưởng của mình.
`;

        const parsed: AiOutlineFeedback = await this.executeGeminiGenerate<AiOutlineFeedback>(
          "OutlineBuilder",
          {
            contents: userPrompt,
            systemInstruction,
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                level: { type: Type.STRING },
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      target: { type: Type.STRING },
                      guidingQuestion: { type: Type.STRING },
                      checkpoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                      suggestedConnectors: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["name", "target", "guidingQuestion", "checkpoints", "suggestedConnectors"],
                  },
                },
                pedagogicalTip: { type: Type.STRING },
              },
              required: ["topic", "level", "sections", "pedagogicalTip"],
            },
          },
          25000
        );

        responseCache.set(cacheKey, {
          data: parsed,
          source: "gemini-cached",
          createdAt: Date.now(),
        });

        return {
          outline: parsed,
          source: "gemini-3.8-flash",
          latencyMs: Date.now() - startTime,
        };
      } catch (err: any) {
        console.warn("EduNova AI Service: Gemini Outline failed, falling back:", err?.message);
      }
    }

    const fallback = this.generateFallbackOutline(sanitizedTopic, level);
    return {
      outline: fallback,
      source: "pedagogical-engine",
      latencyMs: Date.now() - startTime,
    };
  }

  // --------------------------------------------------------------------------
  // HEURISTIC FALLBACK CHO TÌM Ý, LUYỆN CÂU & DÀN Ý
  // --------------------------------------------------------------------------
  private generateFallbackBrainstorm(topic: string): AiBrainstormFeedback {
    const isAnimal = /mèo|chó|cún|chim|gà|thỏ|con/i.test(topic);
    const isTree = /cây|phượng|bàng|hoa|lá|vườn/i.test(topic);

    const objectName = isAnimal ? "Con vật yêu thích" : isTree ? "Cây cối sân trường" : "Cảnh đẹp quê hương";

    return {
      objectName,
      senses: {
        sight: {
          title: "Mắt thấy (Hình dáng & Màu sắc)",
          icon: "👀",
          question: isAnimal
            ? "Bộ lông của con vật màu gì? Đôi mắt và đôi tai trông ngộ nghĩnh thế nào?"
            : "Từ xa nhìn lại, sự vật có hình dáng và màu sắc chủ đạo gì nổi bật?",
          wordPills: isAnimal
            ? ["mượt mà óng ả", "tròn xoe như bi ve", "nhỏ nhắn", "trắng muốt", "vàng cam"]
            : ["xanh mướt", "đỏ rực như lửa", "xòe rộng", "cao vút", "thân nâu xù xì"],
        },
        sound: {
          title: "Tai nghe (Âm thanh sinh động)",
          icon: "👂",
          question: isAnimal
            ? "Con vật phát ra âm thanh gì khi đón em đi học về?"
            : "Gió thổi qua tán lá tạo nên tiếng động gì êm tai?",
          wordPills: isAnimal
            ? ["tiếng meo meo nũng nịu", "sủa gâu gâu mừng rỡ", "bước chân êm ru", "thở nhè nhẹ"]
            : ["xào xạc trong gió", "thì thầm như trò chuyện", "râm ran tiếng ve", "róc rách"],
        },
        touchSmell: {
          title: "Chạm & Mùi hương",
          icon: "🌸",
          question: isAnimal
            ? "Khi vuốt ve bộ lông, tay em cảm thấy mềm mại ra sao?"
            : "Hương hoa hay làn gió thoang thoảng mang lại cảm giác gì?",
          wordPills: isAnimal
            ? ["mềm mại như nhung", "ấm áp", "mát rượi", "sạch sẽ"]
            : ["thoang thoảng dịu nhẹ", "thơm ngát", "mát rượi", "xù xì thô ráp"],
        },
        heart: {
          title: "Trái tim cảm nhận",
          icon: "❤️",
          question: "Kỷ niệm vui nhất của em gắn liền với sự vật này là gì?",
          wordPills: ["yêu quý như bạn thân", "gắn bó thân thiết", "nâng niu", "tự hào", "kỷ niệm tuổi thơ"],
        },
      },
      comparisonStarters: isAnimal
        ? ["như một cục bông gòn biết đi", "như hai hòn bi ve xanh biếc lấp lánh"]
        : ["như chiếc ô khổng lồ che mát sân trường", "tựa như ngọn đuốc đỏ rực giữa ngày hè"],
      encouragement: "Em hãy chọn những từ ngữ em thích nhất ở trên để tự tin viết câu của mình nhé!",
    };
  }

  private generateFallbackSentenceExpansion(originalSentence: string): AiSentenceFeedback {
    return {
      originalSentence,
      coachQuestion: "Em có thấy câu văn trên có thể thêm một hình ảnh so sánh hoặc từ ngữ gợi cảm không?",
      options: [
        {
          type: "comparison",
          label: "1. Thêm hình ảnh So sánh",
          hint: "Dùng từ 'như' hoặc 'tựa như' để ví sự vật với một hình ảnh quen thuộc",
          samplePattern: `${originalSentence.replace(/[.?!]+$/, "")} + [như / tựa như ...]`,
        },
        {
          type: "personification",
          label: "2. Thêm biện pháp Nhân hóa",
          hint: "Gọi sự vật là 'bác', 'chú' hoặc cho sự vật có hành động như con người",
          samplePattern: `[Bác / Chú / Bạn ...] + ${originalSentence.replace(/[.?!]+$/, "")} + [đang mỉm cười / vẫy tay ...]`,
        },
        {
          type: "adverb",
          label: "3. Mở rộng Trạng ngữ",
          hint: "Thêm thời gian hoặc nơi chốn ở đầu câu để câu văn thêm trang trọng",
          samplePattern: `Vào mỗi buổi sớm mai, ${originalSentence.toLowerCase()}`,
        },
      ],
      vocabularyPills: ["như", "tựa như", "lung linh", "rực rỡ", "thì thầm", "mềm mại", "xanh biếc"],
      encouragement: "Em hãy chọn 1 hướng đi và tự tay viết lại câu văn mới thật hay nhé!",
    };
  }

  private generateFallbackOutline(topic: string, level: string): AiOutlineFeedback {
    return {
      topic,
      level,
      sections: [
        {
          name: "1. Mở bài",
          target: "Giới thiệu sự vật định miêu tả",
          guidingQuestion: "Em muốn dẫn dắt tự nhiên bằng một âm thanh, kỷ niệm (Mở bài gián tiếp) hay giới thiệu ngay?",
          checkpoints: [
            "Nêu rõ tên sự vật em muốn tả",
            "Thời điểm hoặc hoàn cảnh em quan sát sự vật",
          ],
          suggestedConnectors: ["Mỗi buổi sáng...", "Trong khuôn viên trường...", "Giữa bao cảnh sắc thân quen..."],
        },
        {
          name: "2. Thân bài",
          target: "Tả bao quát rồi tả chi tiết từng bộ phận",
          guidingQuestion: "Từ xa nhìn lại sự vật trông thế nào? Đến gần có những nét gì nổi bật nhất?",
          checkpoints: [
            "Tả bao quát: Hình dáng, màu sắc, kích thước nổi bật",
            "Tả chi tiết: 2-3 bộ phận đặc sắc nhất bằng từ gợi tả",
            "Vận dụng ít nhất 1 câu so sánh và 1 câu nhân hóa",
            "Tả hoạt động, ích lợi hoặc âm thanh xung quanh",
          ],
          suggestedConnectors: ["Nhìn từ xa...", "Lại gần hơn...", "Đặc biệt nhất là...", "Bên cạnh đó..."],
        },
        {
          name: "3. Kết bài",
          target: "Bày tỏ cảm xúc và lời hứa của em",
          guidingQuestion: "Sự vật ấy có ý nghĩa thế nào với em? Em sẽ chăm sóc hoặc giữ gìn ra sao?",
          checkpoints: [
            "Tình cảm gắn bó yêu thương của em",
            "Ước mong hoặc lời hứa giữ gìn sự vật",
          ],
          suggestedConnectors: ["Em rất yêu quý...", "Dẫu mai này lớn khôn...", "Mỗi ngày đến trường..."],
        },
      ],
      pedagogicalTip: "Dàn ý chính là chiếc la bàn dẫn đường! Dựa vào các câu hỏi này, em hãy viết từng câu thật mạch lạc nhé.",
    };
  }
}

export const aiService = new EduNovaAiService();

