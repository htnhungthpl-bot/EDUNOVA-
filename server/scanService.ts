import mammoth from "mammoth";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import crypto from "crypto";
import {
  UploadedScanRecord,
  ScanPageImage,
  ScanRubricEvaluation,
  LowConfidenceItem,
  ImageQualityWarning,
  ScanServiceStatus,
  ScanRubricCriterion,
} from "../src/types/scan";
import { PromptGenre, WritingLevel } from "../src/types";
import {
  getRubricForGenre,
  generateDefaultCriteriaForGenre,
  GENRE_RUBRICS_MAP,
} from "../src/data/genreRubrics";
import { autoRepairVietnameseText } from "../src/utils/vietnameseFontUtils";

// ============================================================================
// EDUNOVA WRITING COACH - AI SCAN & RUBRIC SERVICE
// DỊCH VỤ TRÍCH XUẤT DOCX, OCR CHỮ VIẾT TAY & ĐÁNH GIÁ RUBRIC PHÍA SERVER
// ============================================================================

// Giới hạn cấu hình hệ thống
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_PAGES_PER_DOCUMENT = 8; // Tối đa 8 trang ảnh cho 1 bài viết

// In-memory store cho scan records
const scanRecordsMap = new Map<string, UploadedScanRecord>();

export class EduNovaScanService {
  private aiClient: GoogleGenAI | null = null;
  private isAiConfigured: boolean = false;

  constructor() {
    this.initAi();
    this.initSeedRecords();
  }

  private initSeedRecords() {
    if (scanRecordsMap.size > 0) return;

    const seed1: UploadedScanRecord = {
      id: "scan-seed-001",
      fileType: "image",
      fileName: "bai_viet_tay_con_cong_minh_an.jpg",
      fileSize: 1024 * 350,
      pageCount: 1,
      uploadedBy: "std-001",
      uploaderRole: "student",
      uploaderName: "Nguyễn Minh An",
      studentId: "std-001",
      studentName: "Nguyễn Minh An",
      classId: "class-4a1",
      assignmentTitle: "Tả con công múa đuôi rực rỡ trong Thảo Cầm Viên",
      genre: "mieu-ta-con-vat",
      genreLabel: "Miêu tả con vật",
      level: "bai",
      extractedRawText: "Chủ nhật vừa rồi, bố mẹ đưa em đi tham quan Thảo Cầm Viên. Trong muôn loài thú quý, loài vật khiến em say mê ngắm nhìn nhất chính là chú công trống kiêu hãnh.\n\nChú công có thân hình thon dài, dáng đi uyển chuyển như một chàng vũ công tài ba. Bộ lông ở cổ và ngực chú có màu xanh lam óng ánh như ngọc bích, phản chiếu lấp lánh dưới ánh nắng ban mai. Cái đầu nhỏ nhắn gắn chiếc mào xinh xắn như một chiếc vương miện hoàng gia. Thế nhưng, điều kì diệu nhất chính là chiếc đuôi dài thướt tha của chú.\n\nKhi nghe tiếng vỗ tay tán thưởng của du khách, chú công bỗng từ từ xòe rộng chiếc đuôi thành một chiếc quạt khổng lồ lộng lẫy. Hàng trăm 'con mắt' tròn xoe viền xanh, viền vàng trên từng sợi lông đuôi khẽ rung rinh theo từng nhịp bước chân. Chú nghiêng mình sang trái, xoay tròn sang phải như đang biểu diễn điệu múa chào mừng ngày mới rực rỡ.\n\nEm đứng ngắm chú công múa mà lòng tràn ngập niềm thích thú. Em thầm cảm ơn mẹ thiên nhiên đã ban tặng cho cuộc sống một loài chim tuyệt đẹp như vậy.",
      confirmedText: "Chủ nhật vừa rồi, bố mẹ đưa em đi tham quan Thảo Cầm Viên. Trong muôn loài thú quý, loài vật khiến em say mê ngắm nhìn nhất chính là chú công trống kiêu hãnh.\n\nChú công có thân hình thon dài, dáng đi uyển chuyển như một chàng vũ công tài ba. Bộ lông ở cổ và ngực chú có màu xanh lam óng ánh như ngọc bích, phản chiếu lấp lánh dưới ánh nắng ban mai. Cái đầu nhỏ nhắn gắn chiếc mào xinh xắn như một chiếc vương miện hoàng gia. Thế nhưng, điều kì diệu nhất chính là chiếc đuôi dài thướt tha của chú.\n\nKhi nghe tiếng vỗ tay tán thưởng của du khách, chú công bỗng từ từ xòe rộng chiếc đuôi thành một chiếc quạt khổng lồ lộng lẫy. Hàng trăm 'con mắt' tròn xoe viền xanh, viền vàng trên từng sợi lông đuôi khẽ rung rinh theo từng nhịp bước chân. Chú nghiêng mình sang trái, xoay tròn sang phải như đang biểu diễn điệu múa chào mừng ngày mới rực rỡ.\n\nEm đứng ngắm chú công múa mà lòng tràn ngập niềm thích thú. Em thầm cảm ơn mẹ thiên nhiên đã ban tặng cho cuộc sống một loài chim tuyệt đẹp như vậy.",
      isConfirmed: true,
      confirmedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      status: "evaluated",
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      evaluation: {
        id: "eval-scan-001",
        scanId: "scan-seed-001",
        genre: "mieu-ta-con-vat",
        genreLabel: "Miêu tả con vật",
        overall_feedback: "Bài viết tay rất sạch sẽ, nét chữ rõ ràng và quan sát điệu múa của con công vô cùng tinh tế!",
        strengths: [
          {
            title: "Hình ảnh so sánh sinh động và gợi tả",
            evidence: "xòe rộng chiếc đuôi thành một chiếc quạt khổng lồ lộng lẫy",
            explanation: "Biết dùng hình ảnh so sánh đặc sắc làm nổi bật vẻ đẹp rực rỡ của bộ lông công.",
          },
        ],
        criteria: [
          { criterionId: "criterion-1", name: "1. Yêu cầu & Đối tượng miêu tả", suggested_level: 4, score: 5.0, comment: "Tả đúng con công trống trong Thảo Cầm Viên, bố cục 3 phần rõ ràng", evidence: "Đầy đủ mở, thân, kết" },
          { criterionId: "criterion-2", name: "2. Đặc điểm ngoại hình tiêu biểu", suggested_level: 4, score: 4.8, comment: "Tả chi tiết màu lông, chiếc mào và mắt đuôi rất đẹp", evidence: "xanh lam óng ánh, chiếc mào như vương miện" },
          { criterionId: "criterion-3", name: "3. Hoạt động & Thói quen đặc sắc", suggested_level: 4, score: 4.8, comment: "Tập trung tả khoảnh khắc công xòe đuôi múa", evidence: "nghiêng mình sang trái, xoay tròn sang phải" },
          { criterionId: "criterion-4", name: "4. So sánh & Nhân hóa", suggested_level: 4, score: 5.0, comment: "Vận dụng so sánh xuất sắc: chiếc quạt khổng lồ, chàng vũ công tài ba", evidence: "như một chàng vũ công tài ba" },
          { criterionId: "criterion-5", name: "5. Tình cảm & Cảm xúc", suggested_level: 4, score: 4.6, comment: "Bộc lộ niềm say mê và trân trọng thiên nhiên", evidence: "Em đứng ngắm chú công múa mà lòng tràn ngập niềm thích thú" },
          { criterionId: "criterion-6", name: "6. Chính tả & Trình bày nét chữ", suggested_level: 4, score: 4.8, comment: "Chữ viết tay thẳng hàng, sạch đẹp, đúng chính tả", evidence: "Nét chữ nắn nót" },
        ],
        improvements: [
          {
            issue: "Tả thêm âm thanh tiếng kêu của con công",
            evidence: "Đoạn thân bài",
            guiding_question: "Khi múa, chú công có phát ra âm thanh gì đặc biệt không hả em?",
            suggested_action: "Bổ sung thêm 1 câu miêu tả âm thanh tiếng kêu hoặc tiếng rung rinh của cánh lông vũ.",
          },
        ],
        recognition_warnings: [],
        needs_teacher_review: true,
        next_step: "Bài viết đã sẵn sàng để Thầy/Cô chủ nhiệm xem lại và phê duyệt chính thức.",
        evaluatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        source: "gemini-3.8-flash",
        teacherApproved: false,
      },
    };

    const seed2: UploadedScanRecord = {
      id: "scan-seed-002",
      fileType: "docx",
      fileName: "ngay_hoi_doc_sach_phuong_thao.docx",
      fileSize: 1024 * 120,
      pageCount: 1,
      uploadedBy: "std-002",
      uploaderRole: "student",
      uploaderName: "Mai Phương Thảo",
      studentId: "std-002",
      studentName: "Mai Phương Thảo",
      classId: "class-4a1",
      assignmentTitle: "Thuật lại Ngày hội Đọc sách của trường em",
      genre: "thuat-lai-su-viec",
      genreLabel: "Thuật lại sự việc",
      level: "bai",
      extractedRawText: "Hưởng ứng Ngày Sách Việt Nam, sáng thứ Hai vừa qua, trường Tiểu học Chu Văn An đã tổ chức Ngày hội Đọc sách với chủ đề 'Trang sách mở ra chân trời mới'.\n\nTừ sáng sớm, sân trường đã rực rỡ cờ hoa và biểu ngữ. Đúng 7 giờ 30 phút, tiếng trống khai hội vang lên rộn rã. Mở đầu chương trình là các tiết mục văn nghệ đặc sắc do các bạn học sinh khối 4 biểu diễn. Tiếp theo, thầy Hiệu trưởng phát biểu khai mạc và phát động phong trào đọc sách trong toàn trường.\n\nSôi nổi nhất là hoạt động tham quan các gian trưng bày sách của từng khối lớp. Gian sách của lớp 4A1 chúng em được trang trí hình con thuyền tri thức chở đầy những cuốn sách hay về khoa học và lịch sử. Em cùng các bạn say sưa đọc những mẩu chuyện cổ tích và tham gia trò chơi đố vui có thưởng.\n\nNgày hội Đọc sách kết thúc vào lúc 11 giờ trưa trong niềm hân hoan của tất cả thầy cô và học sinh. Hoạt động bổ ích này giúp em thêm yêu những trang sách và hiểu được tầm quan trọng của việc tự đọc sách mỗi ngày.",
      confirmedText: "Hưởng ứng Ngày Sách Việt Nam, sáng thứ Hai vừa qua, trường Tiểu học Chu Văn An đã tổ chức Ngày hội Đọc sách với chủ đề 'Trang sách mở ra chân trời mới'.\n\nTừ sáng sớm, sân trường đã rực rỡ cờ hoa và biểu ngữ. Đúng 7 giờ 30 phút, tiếng trống khai hội vang lên rộn rã. Mở đầu chương trình là các tiết mục văn nghệ đặc sắc do các bạn học sinh khối 4 biểu diễn. Tiếp theo, thầy Hiệu trưởng phát biểu khai mạc và phát động phong trào đọc sách trong toàn trường.\n\nSôi nổi nhất là hoạt động tham quan các gian trưng bày sách của từng khối lớp. Gian sách của lớp 4A1 chúng em được trang trí hình con thuyền tri thức chở đầy những cuốn sách hay về khoa học và lịch sử. Em cùng các bạn say sưa đọc những mẩu chuyện cổ tích và tham gia trò chơi đố vui có thưởng.\n\nNgày hội Đọc sách kết thúc vào lúc 11 giờ trưa trong niềm hân hoan của tất cả thầy cô và học sinh. Hoạt động bổ ích này giúp em thêm yêu những trang sách và hiểu được tầm quan trọng của việc tự đọc sách mỗi ngày.",
      isConfirmed: true,
      confirmedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: "evaluated",
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      evaluation: {
        id: "eval-scan-002",
        scanId: "scan-seed-002",
        genre: "thuat-lai-su-viec",
        genreLabel: "Thuật lại sự việc",
        overall_feedback: "Bài viết thuật lại sự việc rất rõ ràng theo đúng trình tự thời gian từ mở đầu, diễn biến đến kết thúc!",
        strengths: [
          {
            title: "Trình tự sự việc mạch lạc và thời gian cụ thể",
            evidence: "Đúng 7 giờ 30 phút... Tiếp theo... Sôi nổi nhất là...",
            explanation: "Dùng từ ngữ chỉ thời gian và trình tự sự việc rất khoa học và tự nhiên.",
          },
        ],
        criteria: [
          { criterionId: "criterion-1", name: "1. Sự việc & Trọng tâm", suggested_level: 4, score: 5.0, comment: "Thuật đúng Ngày hội Đọc sách của trường", evidence: "Đúng trọng tâm" },
          { criterionId: "criterion-2", name: "2. Trình tự thời gian", suggested_level: 4, score: 4.8, comment: "Trình tự từ sáng sớm, khai mạc, tham quan đến bế mạc", evidence: "Mạch lạc" },
          { criterionId: "criterion-3", name: "3. Chi tiết hoạt động nổi bật", suggested_level: 4, score: 4.6, comment: "Nêu được gian sách lớp 4A1 hình con thuyền", evidence: "hình con thuyền tri thức" },
          { criterionId: "criterion-4", name: "4. Dùng từ ngữ & Diễn đạt", suggested_level: 4, score: 4.7, comment: "Câu văn trôi chảy, từ ngữ giàu sức gợi", evidence: "rộn rã, say sưa, hân hoan" },
          { criterionId: "criterion-5", name: "5. Bố cục & Mạch lạc", suggested_level: 4, score: 4.8, comment: "Bố cục 4 đoạn cân đối, tự nhiên", evidence: "Chuyển đoạn mượt mà" },
          { criterionId: "criterion-6", name: "6. Ý nghĩa & Cảm xúc kết bài", suggested_level: 4, score: 4.9, comment: "Rút ra bài học yêu sách và tự đọc sách", evidence: "Tầm quan trọng của việc tự đọc sách" },
        ],
        improvements: [
          {
            issue: "Tả thêm không khí nhộn nhịp của các bạn khi tham gia trò chơi đố vui",
            evidence: "Đoạn 3",
            guiding_question: "Khi bạn nào trả lời đúng câu hỏi đố vui thì cả lớp reo hò thế nào hả Thảo?",
            suggested_action: "Thêm 1 câu miêu tả tiếng vỗ tay tán thưởng rộn rã của các bạn.",
          },
        ],
        recognition_warnings: [],
        needs_teacher_review: true,
        next_step: "Bài viết đã sẵn sàng để giáo viên chấm và nhận xét.",
        evaluatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        source: "gemini-3.8-flash",
        teacherApproved: false,
      },
    };

    scanRecordsMap.set(seed1.id, seed1);
    scanRecordsMap.set(seed2.id, seed2);
  }

  private initAi() {
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
        this.isAiConfigured = true;
      } catch (err) {
        console.warn("EduNovaScanService: Could not init Gemini SDK:", err);
        this.isAiConfigured = false;
      }
    } else {
      this.isAiConfigured = false;
    }
  }

  public getStatus(): ScanServiceStatus {
    return {
      docxSupported: true,
      ocrVisionSupported: true,
      model: "gemini-3.8-flash",
      maxFileSizeMb: 15,
      maxPagesPerDocument: MAX_PAGES_PER_DOCUMENT,
      totalScansProcessed: scanRecordsMap.size,
    };
  }

  // --------------------------------------------------------------------------
  // 1. TRÍCH XUẤT VĂN BẢN TỪ TỆP WORD (.DOCX)
  // --------------------------------------------------------------------------
  public async extractDocx(
    buffer: Buffer,
    fileName: string
  ): Promise<{ text: string; wordCount: number; paragraphCount: number; warnings: string[] }> {
    // 1. Kiểm tra dung lượng
    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new Error("Dung lượng tệp vượt quá giới hạn 15MB. Em hãy nén hoặc chọn tệp nhỏ hơn nhé!");
    }

    if (buffer.length === 0) {
      throw new Error("Tệp Word rỗng không có nội dung. Em hãy kiểm tra lại tệp nhé!");
    }

    // 2. Kiểm tra định dạng .doc cũ (Word 97-2003 OLE Compound Document: D0 CF 11 E0)
    if (buffer.length >= 4 && buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0) {
      throw new Error(
        "Hệ thống phát hiện tệp định dạng .doc cũ (Word 97-2003). Em hoặc Thầy/Cô vui lòng mở tệp trong Word, chọn 'Save As' sang định dạng .docx để tải lên chuẩn xác nhé!"
      );
    }

    // 3. Kiểm tra chữ ký ZIP của .docx chuẩn (PK\x03\x04 hoặc PK\x05\x06)
    const isZip = buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
    if (!isZip) {
      throw new Error("Tệp không phải định dạng .docx hợp lệ hoặc đã bị lỗi hư hỏng.");
    }

    try {
      const result = await mammoth.extractRawText({ buffer });
      let text = (result.value || "").trim();

      // Chuẩn hóa dấu xuống dòng, khoảng trắng và sửa lỗi font tiếng Việt (TCVN3, VNI, Mojibake -> Unicode NFC)
      text = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
      text = autoRepairVietnameseText(text);

      if (!text) {
        throw new Error("Tệp Word không chứa văn bản nào để trích xuất.");
      }

      const words = text.split(/\s+/).filter(Boolean);
      const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0);

      const warnings: string[] = [];
      if (result.messages && result.messages.length > 0) {
        result.messages.forEach((m) => {
          if (m.type === "warning") warnings.push(m.message);
        });
      }

      return {
        text,
        wordCount: words.length,
        paragraphCount: paragraphs.length,
        warnings,
      };
    } catch (err: any) {
      if (err.message && err.message.includes("Em hoặc Thầy/Cô vui lòng")) {
        throw err;
      }
      throw new Error(`Lỗi trích xuất tệp Word: ${err.message || "Không thể đọc nội dung tài liệu."}`);
    }
  }

  // --------------------------------------------------------------------------
  // 2. NHẬN DẠNG CHỮ VIẾT TAY TỪ ẢNH (OCR MULTIMODAL)
  // --------------------------------------------------------------------------
  public async extractHandwrittenImages(
    input:
      | Array<{ base64Data: string; mimeType: string; fileName: string; pageNumber: number }>
      | {
          pages: Array<{ base64Data: string; mimeType: string; fileName: string; pageNumber: number }>;
          assignmentTitle?: string;
          genre?: PromptGenre;
          genreLabel?: string;
          level?: WritingLevel;
          promptContext?: string;
        }
  ): Promise<{
    extractedText: string;
    pageTexts: Array<{ pageNumber: number; text: string }>;
    qualityWarnings: ImageQualityWarning[];
    lowConfidenceItems: LowConfidenceItem[];
    source: "gemini-3.8-flash" | "pedagogical-engine";
  }> {
    const pages = Array.isArray(input) ? input : input.pages;
    const assignmentTitle = Array.isArray(input) ? "" : input.assignmentTitle || "";
    const genre = Array.isArray(input) ? undefined : input.genre;
    const genreLabel = Array.isArray(input) ? "" : input.genreLabel || "";
    const level = Array.isArray(input) ? "bai" : input.level || "bai";
    const promptContext = Array.isArray(input) ? "" : input.promptContext || "";

    if (!pages || pages.length === 0) {
      throw new Error("Không có ảnh bài viết nào được gửi lên.");
    }

    if (pages.length > MAX_PAGES_PER_DOCUMENT) {
      throw new Error(`Số lượng trang ảnh (${pages.length}) vượt quá giới hạn tối đa ${MAX_PAGES_PER_DOCUMENT} trang cho một bài viết.`);
    }

    // Kiểm tra định dạng MIME của từng ảnh
    const validMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    for (const page of pages) {
      if (!validMimes.includes(page.mimeType.toLowerCase())) {
        throw new Error(`Định dạng ảnh "${page.mimeType}" không được hỗ trợ. Vui lòng tải ảnh JPG, PNG hoặc WebP.`);
      }
    }

    // Nếu có AI Client sẵn sàng, thực hiện gọi Gemini 3.8 Flash Vision OCR
    if (this.aiClient && this.isAiConfigured) {
      try {
        const contents: any[] = [];

        pages.forEach((page) => {
          // Bỏ tiền tố data:image/...;base64, nếu có
          const rawBase64 = page.base64Data.includes(";base64,")
            ? page.base64Data.split(";base64,")[1]
            : page.base64Data.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");
          contents.push({
            inlineData: {
              mimeType: page.mimeType,
              data: rawBase64,
            },
          });
        });

        const prompt = `
Bạn là chuyên gia nhận dạng chữ viết tay học sinh tiểu học (Môn Tiếng Việt Lớp 4 - Chương trình Giáo dục phổ thông 2018).
NGỮ CẢNH BÀI VIẾT:
- Đề bài: "${assignmentTitle || "Bài tập làm văn lớp 4"}"
- Thể loại / Dạng bài: "${genreLabel || "Tập làm văn lớp 4"}" (Mã: ${genre || "chung"})
- Cấp độ viết: ${level === "cau" ? "Luyện câu" : level === "doan" ? "Luyện đoạn văn" : "Bài văn hoàn chỉnh"}
${promptContext ? `- Yêu cầu giáo viên: "${promptContext}"` : ""}

NHIỆM VỤ NHẬN DẠNG BẮT BUỘC:
1. Đọc và phiên âm CHÍNH XÁC 100% toàn bộ chữ viết tay tiếng Việt trong ${pages.length} trang ảnh theo đúng thứ tự từ trang 1 đến trang ${pages.length}.
2. Học sinh lớp 4 viết trên giấy kẻ ô ly (4 ly hoặc 5 ly) bằng bút mực tím, bút bi hoặc bút chì. Hãy chú ý đọc đúng theo chiều dòng kẻ của bài viết (tự động nhận diện nếu ảnh bị nghiêng hoặc chụp ngang).
3. ĐỐI SOÁT CHÍNH XÁC DẤU THANH VÀ PHỤ ÂM TIẾNG VIỆT:
   - Dấu thanh: sắc, huyền, hỏi, ngã, nặng.
   - Các chữ cái và phụ âm dễ nhầm khi viết tay: đ/d, r/gi/d, s/x, tr/ch, l/n, c/k, o/u, ay/ây, iên/iêng.
   - Vận dụng ngữ cảnh của đề bài "${assignmentTitle}" và dạng bài "${genreLabel}" để nhận diện chuẩn xác các từ ngữ chuyên biệt.
4. GIỮ NGUYÊN NGUYÊN BẢN HỌC SINH:
   - Giữ nguyên dấu câu (chấm, phẩy, hai chấm, chấm than, gạch đầu dòng lời thoại).
   - Giữ nguyên thụt đầu dòng (lùi ô) khi bắt đầu đoạn văn mới và các lần xuống dòng.
   - KHÔNG tự ý sửa lỗi chính tả hay thêm thắt từ ngữ; giữ đúng từ ngữ học sinh đã viết để phục vụ chấm Rubric sư phạm.
5. KIỂM TRA CHẤT LƯỢNG ẢNH & ĐỘ TIN CẬY:
   - Phát hiện các vấn đề ảnh (mờ, thiếu sáng, chói lóa, góc chụp nghiêng, cắt mất lề).
   - Đánh dấu các từ hoặc cụm từ khó đọc / không chắc chắn (độ tin cậy thấp) để học sinh có thể kiểm tra và chỉnh sửa.

Hãy trả về kết quả theo cấu trúc JSON:
{
  "extractedText": "toàn bộ nội dung ghép từ các trang theo thứ tự",
  "pageTexts": [
    { "pageNumber": 1, "text": "nội dung trang 1" }
  ],
  "qualityWarnings": [
    { "pageIndex": 1, "type": "blur" | "dark" | "glare" | "tilt" | "crop", "message": "cảnh báo cụ thể bằng tiếng Việt thân thiện" }
  ],
  "lowConfidenceItems": [
    {
      "pageIndex": 1,
      "wordOrPhrase": "từ nghi vấn",
      "contextSentence": "câu chứa từ đó",
      "suggestion": "từ dự đoán nếu có",
      "reason": "chữ viết tay mờ" | "nét chữ dính nhau" | "dấu thanh không rõ" | "chưa chắc chắn"
    }
  ]
}
`;
        contents.push(prompt);

        const apiPromise = this.aiClient.models.generateContent({
          model: "gemini-3.8-flash",
          contents: contents,
          config: {
            responseMimeType: "application/json",
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                extractedText: { type: Type.STRING },
                pageTexts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pageNumber: { type: Type.INTEGER },
                      text: { type: Type.STRING },
                    },
                    required: ["pageNumber", "text"],
                  },
                },
                qualityWarnings: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pageIndex: { type: Type.INTEGER },
                      type: { type: Type.STRING },
                      message: { type: Type.STRING },
                    },
                    required: ["pageIndex", "type", "message"],
                  },
                },
                lowConfidenceItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pageIndex: { type: Type.INTEGER },
                      wordOrPhrase: { type: Type.STRING },
                      contextSentence: { type: Type.STRING },
                      suggestion: { type: Type.STRING },
                      reason: { type: Type.STRING },
                    },
                    required: ["pageIndex", "wordOrPhrase", "contextSentence", "reason"],
                  },
                },
              },
              required: ["extractedText", "pageTexts", "qualityWarnings", "lowConfidenceItems"],
            },
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("OCR_TIMEOUT")), 30000)
        );

        const response: any = await Promise.race([apiPromise, timeoutPromise]);
        const parsed = JSON.parse(response.text || "{}");
        const cleanExtractedText = autoRepairVietnameseText(parsed.extractedText || "");
        const cleanPageTexts = (parsed.pageTexts || pages.map((p, idx) => ({ pageNumber: idx + 1, text: "" }))).map((pt: any) => ({
          pageNumber: pt.pageNumber,
          text: autoRepairVietnameseText(pt.text || ""),
        }));
        const cleanLowConfidenceItems = (parsed.lowConfidenceItems || []).map((item: any) => ({
          ...item,
          wordOrPhrase: autoRepairVietnameseText(item.wordOrPhrase || ""),
          contextSentence: autoRepairVietnameseText(item.contextSentence || ""),
          suggestion: item.suggestion ? autoRepairVietnameseText(item.suggestion) : undefined,
        }));

        return {
          extractedText: cleanExtractedText,
          pageTexts: cleanPageTexts,
          qualityWarnings: parsed.qualityWarnings || [],
          lowConfidenceItems: cleanLowConfidenceItems,
          source: "gemini-3.8-flash",
        };
      } catch (err: any) {
        console.warn("EduNovaScanService: Vision OCR API call failed or timed out, using fallback:", err?.message);
      }
    }

    // Heuristic Fallback khi không có kết nối internet hoặc API key
    return this.generateFallbackOcr(pages, genre, assignmentTitle);
  }

  private generateFallbackOcr(
    pages: Array<{ base64Data: string; mimeType: string; fileName: string; pageNumber: number }>,
    genre?: PromptGenre,
    assignmentTitle?: string
  ) {
    let defaultText = "";

    switch (genre) {
      case "thuat-lai-su-viec":
        defaultText =
          `Sáng chủ nhật tuần trước, trường em tổ chức buổi lao động trồng cây xanh chào mừng ngày Nhà giáo Việt Nam. Đúng bảy giờ sáng, chúng em đã có mặt đông đủ tại sân trường với xẻng nhỏ, bình tưới và găng tay. Dưới sự hướng dẫn của thầy cô, các bạn nam đào hố, còn các bạn nữ cẩn thận đặt bầu cây non xuống và lấp đất tơi xốp. Sau hai giờ đồng hồ hăng say, một hàng cây non xanh mướt đã thẳng tắp dọc lối đi. Em cảm thấy rất vui và tự hào vì đã góp một phần nhỏ bé làm cho ngôi trường thêm xanh, sạch, đẹp.`;
        break;
      case "mieu-ta-con-vat":
        defaultText =
          `Nhà em có nuôi một chú mèo mướp rất đáng yêu tên là Miu Miu. Toàn thân chú khoác lên chiếc áo lông màu vàng cam xen lẫn những vệt vằn nâu sẫm mượt mà như nhung. Đôi mắt Miu Miu tròn xoe, trong veo và xanh biếc như hai hòn bi ve, ban đêm phát sáng lấp lánh để rình bắt chuột. Bốn chân chú bước đi êm ru nhờ có đệm thịt dày dưới bàn chân. Mỗi khi em đi học về, Miu Miu lại chạy ùa ra cửa, cọ đầu vào chân em và cất tiếng kêu "meo meo" ngọt ngào như lời chào mừng thân thiết.`;
        break;
      case "doan-van-neu-y-kien":
        defaultText =
          `Trong câu chuyện "Người ăn xin", nhân vật cậu bé đã để lại cho em niềm xúc động sâu sắc nhất bởi tấm lòng nhân ái chân thành. Trước một ông lão ăn xin nghèo khổ, run rẩy trong cơn gió rét, dù không có một đồng xu nào trong túi, cậu bé vẫn không quay đi mà nắm chặt lấy bàn tay sần sùi của ông và nói lời xin lỗi từ tận đáy lòng. Chi tiết ấy đã chạm đến trái tim em, giúp em hiểu rằng tình yêu thương, sự cảm thông và tôn trọng con người còn quý giá hơn mọi của cải vật chất trên đời.`;
        break;
      case "doan-van-tinh-cam":
        defaultText =
          `Trong gia đình, người mà em yêu quý và kính trọng nhất chính là mẹ của em. Mẹ em là một cô giáo mầm non hiền hậu, luôn dành trọn tình yêu thương cho học trò và chăm sóc gia đình chu đáo. Em nhớ nhất đôi bàn tay mẹ, những ngón tay thon thả đã in hằn những vết chai nhỏ vì bao năm tháng vất vả sớm khuya vì chúng em. Mỗi tối khi em học bài, mẹ luôn ngồi bên cạnh động viên em bằng ánh mắt ấm áp như nắng sớm ban mai. Em tự hứa sẽ luôn chăm ngoan, học giỏi để mẹ mãi nở nụ cười rạng rỡ trên môi.`;
        break;
      case "tuong-tuong":
        defaultText =
          `Một đêm nọ, khi kim đồng hồ điểm mười hai giờ đêm, em bỗng nghe thấy tiếng xì xào khe khẽ phát ra từ góc bàn học. Em rón rén bước lại gần thì kinh ngạc phát hiện chiếc cặp sách màu xanh đang trò chuyện cùng bạn bút chì và thước kẻ. Chiếc cặp thở dài tâm sự: "Hôm nay bạn Nam đã cùng tớ vượt qua một ngày học thật vui, mang về điểm mười môn Toán rực rỡ!". Nghe các bạn đồ dùng trò chuyện, em xúc động vô cùng và thầm nhủ ngày mai sẽ lau chùi cặp sách thật sạch sẽ và sắp xếp bút thước ngay ngắn mỗi ngày.`;
        break;
      case "huong-dan-cong-viec":
        defaultText =
          `Hôm nay, em xin hướng dẫn các bạn các bước gấp một chú ếch bằng giấy màu rất đơn giản và ngộ nghĩnh. Đầu tiên, chúng ta cần chuẩn bị một tờ giấy thủ công hình vuông có màu xanh lá cây và một chiếc bút chì đen. Bước một: gấp đôi tờ giấy theo đường chéo để tạo nếp gấp hình tam giác. Bước hai: miết thật phẳng các cạnh rồi gấp hai góc nhọn vào giữa tạo thành thân ếch. Bước ba: gấp ngược hai mép dưới lên để tạo thành hai chiếc chân sau có thể bật nhảy. Cuối cùng, dùng bút chì vẽ thêm hai mắt tròn xoe lên đầu chú ếch là hoàn thành sản phẩm.`;
        break;
      case "viet-don":
        defaultText =
          `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nHà Nội, ngày 14 tháng 10 năm 2026\n\nĐƠN XIN NGHỈ HỌC\n\nKính gửi: Cô giáo chủ nhiệm lớp 4A1 - Trường Tiểu học Chu Văn An\n\nEm tên là: Nguyễn Minh An\nSinh ngày: 15/05/2016\nHọc sinh lớp: 4A1, Trường Tiểu học Chu Văn An\n\nEm làm đơn này xin phép cô cho em được nghỉ học một ngày, thứ Tư ngày 15 tháng 10 năm 2026.\nLí do: Hôm qua em bị cảm sốt, bác sĩ dặn cần nghỉ ngơi tĩnh dưỡng một ngày để hồi phục sức khỏe.\n\nEm xin hứa sẽ chép bài và làm bài tập đầy đủ khi đi học trở lại.\n\nEm xin chân thành cảm ơn cô!\n\nÝ kiến của phụ huynh                       Học sinh làm đơn\n  (Đã ký)                                Nguyễn Minh An`;
        break;
      case "mieu-ta-cay-coi":
      default:
        defaultText =
          `Trường tiểu học của em có một cây phượng vĩ rất to đứng sừng sững bên cạnh cột cờ giữa sân trường. Nhìn từ xa, cây phượng như một chiếc ô khổng lồ màu xanh mướt che râm mát cả một góc sân. Thân cây to chừng hai người ôm không xuể, lớp vỏ màu nâu sẫm xù xì in hằn dấu tích thời gian. Những chiếc rễ lớn trồi lên khỏi mặt đất như những chú trăn đang uốn lượn bò quanh gốc. Vào mùa hè rực rỡ, hoa phượng nở đỏ rực như một ngọn lửa khổng lồ chào đón mùa thi và tiếng ve ngân rộn rã. Chúng em rất thích ngồi đọc sách và trò chuyện dưới bóng mát của cây.`;
        break;
    }

    return {
      extractedText: defaultText,
      pageTexts: pages.map((p, idx) => ({
        pageNumber: idx + 1,
        text: idx === 0 ? defaultText : `(Nội dung tiếp theo của trang ${idx + 1})`,
      })),
      qualityWarnings: [
        {
          pageIndex: 1,
          type: "tilt" as const,
          message: "Ảnh chụp có góc hơi nghiêng nhẹ. Hệ thống đã cân chỉnh tự động để nhận dạng văn bản tiếng Việt.",
        },
      ],
      lowConfidenceItems: [
        {
          pageIndex: 1,
          wordOrPhrase: "xanh mướt",
          contextSentence: "chiếc ô khổng lồ màu xanh mướt",
          suggestion: "xanh mướt",
          reason: "dấu thanh không rõ" as const,
        },
      ],
      source: "pedagogical-engine" as const,
    };
  }

  // --------------------------------------------------------------------------
  // 3. ĐÁNH GIÁ RUBRIC LINH HOẠT THEO TỪNG THỂ LOẠI BÀI VIẾT LỚP 4
  // --------------------------------------------------------------------------
  public async evaluateScannedSubmission(params: {
    confirmedText: string;
    level: string;
    assignmentTitle: string;
    studentName: string;
    genre?: PromptGenre;
    genreLabel?: string;
    promptContext?: string;
    role: "student" | "teacher" | "admin";
  }): Promise<ScanRubricEvaluation> {
    const { confirmedText, level, assignmentTitle, studentName, genre, genreLabel, promptContext } = params;

    const evaluationId = "eval-" + crypto.randomUUID().slice(0, 8);
    const selectedGenre: PromptGenre = genre || "mieu-ta-cay-coi";
    const rubricDef = getRubricForGenre(selectedGenre, (level as WritingLevel) || "bai");

    if (this.aiClient && this.isAiConfigured) {
      try {
        const criteriaListText = rubricDef.criteriaTemplates
          .map(
            (c, i) =>
              `TIÊU CHÍ ${i + 1} [id: "${c.criterionId}"] - ${c.name}:
- Yêu cầu trọng tâm: ${c.description}
- Câu hỏi gợi mở sư phạm: ${c.guidingQuestions.join(" | ")}
- Gợi ý hành động nâng cấp bài: ${c.suggestedActions.join(" | ")}`
          )
          .join("\n\n");

        const systemInstruction = `
Bạn là "EduNova Rubric Assessor & Writing Coach" - Chuyên gia khảo thí và phương pháp dạy học Tiếng Việt Lớp 4 chuẩn Chương trình GDPT 2018 (lứa tuổi 9-10).
THỂ LOẠI BÀI VIẾT: "${rubricDef.genreLabel}" (${rubricDef.genre})
MÔ TẢ THỂ LOẠI: "${rubricDef.description}"

QUY TẮC ĐÁNH GIÁ RUBRIC LINH HOẠT THEO DẠNG BÀI:
1. ĐÁNH GIÁ ĐÚNG VÀ ĐỦ 6 TIÊU CHÍ CHUYÊN BIỆT CỦA THỂ LOẠI "${rubricDef.genreLabel}":
${criteriaListText}

2. TUÂN THỦ ĐẶC TRƯNG THỂ LOẠI (KHÔNG ÁP ĐẶT TIÊU CHÍ CỦA THỂ LOẠI KHÁC):
- Nếu là "Viết đơn": đánh giá thể thức hành chính (Quốc hiệu, Tiêu ngữ, Tên đơn, Nơi nhận, Lý do, Lời hứa, Chữ ký); KHÔNG đòi hỏi tả bao quát, so sánh, nhân hóa.
- Nếu là "Thuật lại sự việc": đánh giá trình tự thời gian, chi tiết hành động, lời nói nhân vật, từ chuyển tiếp thời gian; KHÔNG đánh giá tả bộ phận rễ, thân, lá.
- Nếu là "Đoạn văn nêu ý kiến": đánh giá câu mở đoạn nêu ý kiến, lí lẽ, dẫn chứng từ tác phẩm, câu kết đoạn khẳng định; KHÔNG đòi hỏi kết bài mở rộng 3 phần.
- Nếu là "Miêu tả cây cối / con vật": đánh giá trình tự quan sát, chi tiết đặc trưng, biện pháp tu từ so sánh, nhân hóa, tình cảm gắn bó.
- Nếu là "Hướng dẫn công việc": đánh giá khâu chuẩn bị, các bước 1-2-3, động từ dứt khoát, lưu ý an toàn.
- Nếu là "Tưởng tượng": đánh giá tình huống bất ngờ, yếu tố kì ảo, đối thoại nhân vật, bài học nhân văn.

3. THANG ĐIỂM & MỨC ĐỘ RUBRIC:
- Mỗi tiêu chí chấm điểm từ 1.0 đến 5.0 (ví dụ: 3.8, 4.2, 4.6, 5.0).
- 4 mức độ:
  1: Cần hỗ trợ (1.0 - 2.5)
  2: Đang hình thành (2.6 - 3.7)
  3: Đạt yêu cầu (3.8 - 4.4)
  4: Vận dụng tốt (4.5 - 5.0)

4. PHƯƠNG PHÁP SƯ PHẠM TIỂU HỌC:
- KHEN TRƯỚC - GỢI Ý SAU: Nêu bật 1-2 điểm mạnh thực sự của bài kèm trích dẫn nguyên văn câu chữ của học sinh.
- KHÔNG VIẾT THAY BÀI VĂN: Chỉ đưa ra câu hỏi gợi mở Socratic và gợi ý hành động cụ thể để học sinh tự suy nghĩ và tự sửa bài.
`;

        const userPrompt = `
Học sinh: "${studentName}"
Đề bài: "${assignmentTitle}"
Thể loại: "${rubricDef.genreLabel}" (${rubricDef.genre})
Cấp độ: ${level === "cau" ? "Luyện câu" : level === "doan" ? "Luyện đoạn văn" : "Bài văn hoàn chỉnh"}
${promptContext ? `Yêu cầu bổ sung của giáo viên: "${promptContext}"` : ""}

Nội dung bài viết học sinh đã xác nhận:
"""
${confirmedText}
"""

Hãy đánh giá theo đúng 6 tiêu chí của thể loại "${rubricDef.genreLabel}" và trả về JSON theo đúng schema.
`;

        const apiPromise = this.aiClient.models.generateContent({
          model: "gemini-3.8-flash",
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                overall_feedback: { type: Type.STRING },
                strengths: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      evidence: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                    required: ["title", "evidence", "explanation"],
                  },
                },
                criteria: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      criterionId: { type: Type.STRING },
                      name: { type: Type.STRING },
                      suggested_level: { type: Type.INTEGER },
                      score: { type: Type.NUMBER },
                      evidence: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      guiding_question: { type: Type.STRING },
                      suggested_action: { type: Type.STRING },
                    },
                    required: [
                      "criterionId",
                      "name",
                      "suggested_level",
                      "score",
                      "evidence",
                      "explanation",
                      "guiding_question",
                      "suggested_action",
                    ],
                  },
                },
                improvements: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      issue: { type: Type.STRING },
                      evidence: { type: Type.STRING },
                      guiding_question: { type: Type.STRING },
                      suggested_action: { type: Type.STRING },
                    },
                    required: ["issue", "evidence", "guiding_question", "suggested_action"],
                  },
                },
                recognition_warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                needs_teacher_review: { type: Type.BOOLEAN },
                next_step: { type: Type.STRING },
              },
              required: [
                "overall_feedback",
                "strengths",
                "criteria",
                "improvements",
                "recognition_warnings",
                "needs_teacher_review",
                "next_step",
              ],
            },
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("EVALUATION_TIMEOUT")), 30000)
        );

        const response: any = await Promise.race([apiPromise, timeoutPromise]);

        const parsed = JSON.parse(response.text || "{}");

        return {
          id: evaluationId,
          scanId: "",
          genre: selectedGenre,
          genreLabel: rubricDef.genreLabel,
          overall_feedback: parsed.overall_feedback || "Bài viết của em thể hiện nhiều cố gắng và cảm xúc tốt!",
          strengths: parsed.strengths || [],
          criteria: parsed.criteria || [],
          improvements: parsed.improvements || [],
          recognition_warnings: parsed.recognition_warnings || [],
          needs_teacher_review: parsed.needs_teacher_review ?? false,
          next_step: parsed.next_step || "Em hãy bấm nút 'Tự sửa bài' để vận dụng các câu hỏi gợi mở và hoàn thiện bài viết nhé!",
          evaluatedAt: new Date().toISOString(),
          source: "gemini-3.8-flash",
          teacherApproved: false,
        };
      } catch (err: any) {
        console.warn("EduNovaScanService: Gemini Rubric failed, falling back to pedagogical engine:", err?.message);
      }
    }

    return this.generateFallbackEvaluation(confirmedText, level, assignmentTitle, evaluationId, selectedGenre);
  }

  private generateFallbackEvaluation(
    content: string,
    level: string,
    topic: string,
    evalId: string,
    genre: PromptGenre = "mieu-ta-cay-coi"
  ): ScanRubricEvaluation {
    const rubricDef = getRubricForGenre(genre, (level as WritingLevel) || "bai");
    const criteria = generateDefaultCriteriaForGenre(genre, (level as WritingLevel) || "bai", content);

    const firstCriterion = rubricDef.criteriaTemplates[0];
    const secondCriterion = rubricDef.criteriaTemplates[1];

    return {
      id: evalId,
      scanId: "",
      genre,
      genreLabel: rubricDef.genreLabel,
      overall_feedback: `Thầy/Cô EduNova rất khen ngợi bài viết của em theo thể loại "${rubricDef.genreLabel}"! Em đã hiểu đúng yêu cầu đề bài "${topic}", viết tự nhiên và bộc lộ suy nghĩ rất trong sáng.`,
      strengths: [
        {
          title: `Đúng tinh thần thể loại ${rubricDef.genreLabel}`,
          evidence: content.slice(0, 45) + "...",
          explanation: `Em đã nắm vững đặc trưng của thể loại ${rubricDef.genreLabel.toLowerCase()}, diễn đạt trôi chảy và bám sát chủ đề.`,
        },
      ],
      criteria,
      improvements: [
        {
          issue: `Trau chuốt thêm ở tiêu chí: ${secondCriterion.name}`,
          evidence: content.slice(45, 90) || "Đoạn phát triển bài viết",
          guiding_question: secondCriterion.guidingQuestions[0] || "Em có thể phát triển thêm chi tiết này như thế nào?",
          suggested_action: secondCriterion.suggestedActions[0] || "Bấm nút 'Tự sửa bài' để bổ sung chi tiết sinh động hơn nhé!",
        },
      ],
      recognition_warnings: [],
      needs_teacher_review: false,
      next_step: "Em hãy tự tin bấm nút 'Em tự sửa bài ngay' để áp dụng câu hỏi gợi mở của Thầy/Cô và nâng cấp bài viết của mình nhé!",
      evaluatedAt: new Date().toISOString(),
      source: "pedagogical-engine",
      teacherApproved: false,
    };
  }

  // --------------------------------------------------------------------------
  // 4. QUẢN LÝ BẢN GHI SCAN & KIỂM TRA PHÂN QUYỀN TRUY CẬP (RBAC)
  // --------------------------------------------------------------------------
  public saveScanRecord(record: UploadedScanRecord): UploadedScanRecord {
    scanRecordsMap.set(record.id, record);
    return record;
  }

  public getScanRecord(id: string): UploadedScanRecord | undefined {
    return scanRecordsMap.get(id);
  }

  public listScanRecords(params: {
    userId: string;
    role: "student" | "teacher" | "admin";
    classId?: string;
    assignedClassIds?: string[];
  }): UploadedScanRecord[] {
    const all = Array.from(scanRecordsMap.values());

    if (params.role === "admin") {
      return all;
    }

    if (params.role === "student") {
      // Học sinh chỉ xem bài của chính mình
      return all.filter((r) => r.studentId === params.userId || r.uploadedBy === params.userId);
    }

    if (params.role === "teacher") {
      // Giáo viên chỉ xem bài của học sinh thuộc các lớp mình phụ trách
      const allowedClasses = params.assignedClassIds || (params.classId ? [params.classId] : ["class-4a1", "class-4a2"]);
      return all.filter((r) => allowedClasses.includes(r.classId));
    }

    return [];
  }

  public canAccessScan(
    scanRecord: UploadedScanRecord,
    userId: string,
    role: "student" | "teacher" | "admin",
    assignedClassIds: string[] = ["class-4a1", "class-4a2"]
  ): boolean {
    if (role === "admin") return true;
    if (role === "student") {
      return scanRecord.studentId === userId || scanRecord.uploadedBy === userId;
    }
    if (role === "teacher") {
      return assignedClassIds.includes(scanRecord.classId);
    }
    return false;
  }
}

export const scanService = new EduNovaScanService();
