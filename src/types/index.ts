// Screen Identifiers for the entire application across all 3 roles + common
export type ScreenId =
  // Common screens
  | "common-welcome"
  | "common-auth"
  | "common-profile"
  | "common-notifications"
  | "common-settings"
  | "common-help"
  // Student screens
  | "student-home"
  | "student-writing"
  | "student-assignments"
  | "student-submissions"
  | "student-materials"
  | "student-games"
  | "student-progress"
  // Teacher screens
  | "teacher-dashboard"
  | "teacher-classes"
  | "teacher-students"
  | "teacher-assignments"
  | "teacher-grading"
  | "teacher-materials"
  | "teacher-reports"
  | "teacher-data"
  // Admin screens
  | "admin-dashboard"
  | "admin-users"
  | "admin-schools"
  | "admin-rubrics"
  | "admin-settings"
  | "admin-audit"
  | "admin-backup";

export type UserRole = "student" | "teacher" | "admin" | "school";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  username?: string;
  pinCode?: string;
  mustChangePassword?: boolean;
  status?: "active" | "locked" | "pending";
  avatar: string;
  classId?: string;
  schoolName: string;
  phone?: string;
  joinedDate?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: number;
  schoolYear: string;
  teacherName: string;
  roomNumber?: string;
  studentCount?: number;
  assignmentCount?: number;
  description?: string;
}

export type WritingLevel = "cau" | "doan" | "bai";

export type AssignmentStatus =
  | "Bản nháp"
  | "Đã giao"
  | "Đang thực hiện"
  | "Đã nộp"
  | "Đã phản hồi"
  | "Hoàn thành";

export interface Assignment {
  id: string;
  title: string;
  prompt: string;
  level: WritingLevel;
  topic: string;
  classId: string;
  dueDate: string;
  status: AssignmentStatus;
  targetWords?: number;
  rubricTemplateId: string;
  guidelines: string[];
  createdAt?: string;
}

export interface Version {
  versionNumber: number;
  content: string;
  savedAt: string;
  wordCount: number;
  sentenceCount?: number;
  notes?: string;
}

export interface RubricCriterionDefinition {
  id: string;
  name: string;
  description: string;
  levels: {
    1: string; // Cần hỗ trợ
    2: string; // Đang hình thành
    3: string; // Đạt yêu cầu
    4: string; // Vận dụng tốt
  };
  weight?: number;
}

export interface RubricScore {
  criterionId: string;
  name: string;
  level: 1 | 2 | 3 | 4; // 1: Cần hỗ trợ, 2: Đang hình thành, 3: Đạt yêu cầu, 4: Vận dụng tốt
  score: number; // 1.0 to 5.0
  comment: string;
  evidence: string;
  suggestion: string;
}

export type SubmissionStatus = "Đang làm" | "Đã nộp" | "Đã phản hồi" | "Hoàn thành";

export interface Submission {
  id: string;
  assignmentId?: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  classId: string;
  level: WritingLevel;
  currentContent: string;
  versions: Version[];
  wordCount: number;
  sentenceCount?: number;
  status: SubmissionStatus;
  submittedAt?: string;
  aiFeedback?: {
    strengths: string[];
    improvements: string[];
    socraticQuestions: string[];
    pedagogicalNote: string;
    analyzedAt: string;
  };
  rubricEvaluation?: {
    scores: RubricScore[];
    overallLevel: 1 | 2 | 3 | 4;
    overallScore: number;
    overallComment: string;
    evaluatedAt: string;
    confirmedByTeacher: boolean;
    teacherNotes?: string;
  };
}

export interface Material {
  id: string;
  title: string;
  category: "Cây cối" | "Đồ vật" | "Con vật" | "Gia đình" | "Cảnh đẹp" | "Phương pháp viết";
  skill:
    | "Mở rộng câu"
    | "Từ ngữ gợi tả"
    | "Biện pháp so sánh"
    | "Biện pháp nhân hóa"
    | "Mở bài gián tiếp"
    | "Kết bài mở rộng"
    | "Đoạn văn mạch lạc";
  level: WritingLevel;
  content: string;
  examples: string[];
  tips: string[];
  author: string;
  views: number;
  createdAt?: string;
}

export interface GameResult {
  id: string;
  gameId: "vua-tu-ngu" | "xay-cau-than-toc" | "tham-tu-chinh-ta" | "thu-thach-viet-hay";
  gameName: string;
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  completedAt: string;
  stars: number;
}

export interface AuditLog {
  id: string;
  action: string;
  actorName: string;
  actorRole: UserRole;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  timestamp: string;
  read: boolean;
  targetRole?: UserRole | "all";
}

export interface AppSettings {
  fontSize: "normal" | "large" | "huge";
  soundEffects: boolean;
  reducedMotion: boolean;
  schoolName: string;
  currentSchoolYear: string;
  aiStrictSocraticMode: boolean;
  maxSuggestionsPerTurn: number;
  allowStudentSelfAssessment: boolean;
  rubricMaxScore: number;
}

// ============================================================================
// KHO ĐỀ VĂN LỚP 4 (ESSAY PROMPTS REPOSITORY - BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
// ============================================================================

export type PromptSourceType = "source_doc" | "curated" | "teacher";
export type PromptBookVolume = "tap1" | "tap2" | "all";

export type PromptGenre =
  | "thuat-lai-su-viec"     // Thuật lại sự việc (Kể chuyện, chuyến đi, việc tốt, lao động, lễ hội)
  | "viet-don"              // Viết đơn (Nghỉ học, vào Đội, tham gia CLB, mượn sách)
  | "doan-van-neu-y-kien"   // Nêu ý kiến / cảm nghĩ về câu chuyện, bài thơ, nhân vật
  | "mieu-ta-con-vat"       // Bài văn miêu tả con vật (hình dáng, hoạt động, thói quen)
  | "doan-van-tinh-cam"     // Đoạn văn nêu tình cảm, cảm xúc (người thân, thầy cô, quê hương)
  | "mieu-ta-cay-coi"       // Bài văn miêu tả cây cối (bộ phận, thời kì, bóng mát, hoa, quả)
  | "huong-dan-cong-viec"   // Viết hướng dẫn các bước thực hiện công việc (gấp giấy, làm món, trồng cây)
  | "tuong-tuong";          // Đoạn văn / bài văn tưởng tượng (trò chuyện đồ vật, du hành, dị bản)

export interface StepByStepGuidance {
  step1Understanding: {
    questionPrompt: string; // Xác định đề bài yêu cầu gì?
    targetGenre: string;    // Thể loại chính xác
    keyElements: string[];  // Các yếu tố không thể thiếu
  };
  step2Observation: {
    senses: {
      sight?: string;       // Mắt thấy (màu sắc, hình khối, chi tiết)
      sound?: string;       // Tai nghe (âm thanh)
      touch?: string;       // Tay sờ / Cảm giác
      scentOrTaste?: string;// Mùi hương / Vị giác
      emotion?: string;     // Rung cảm trái tim
    };
    guidingQuestions: string[]; // 3-4 câu hỏi gợi ý Socratic
  };
  step3Outline: {
    introduction: string;   // Mở bài (trực tiếp hoặc gián tiếp)
    body: string[];         // Thân bài (các luận điểm / đoạn tả theo trình tự)
    conclusion: string;     // Kết bài (mở rộng hoặc không mở rộng)
  };
  step4VocabularyAndFigurative: {
    vividWords: string[];   // Từ láy, từ gợi tả hay (lung linh, xào xạc, ngút ngàn,...)
    comparisons: string[];  // Gợi ý hình ảnh so sánh
    personifications: string[]; // Gợi ý biện pháp nhân hóa
  };
  step5Checklist: string[]; // Các mục kiểm tra trước khi hoàn thiện
}

export interface EssayPrompt {
  id: string;
  source: PromptSourceType; // "source_doc" | "curated" | "teacher"
  sourceLabel: string;      // Nhãn nguồn gốc rõ ràng
  bookVolume: PromptBookVolume; // "tap1" | "tap2" | "all"
  semester?: "hk1" | "hk2";
  week?: number;
  lessonNumber?: number;
  sgkPage?: number;
  stage?: string;           // Dạng bài / chặng (Tìm hiểu kiểu bài, Lập dàn ý, Viết bài...)
  learningObjectives?: string; // Mục tiêu học tập (thiết kế cho app)
  genre: PromptGenre;
  genreLabel: string;       // Nhãn tiếng Việt thân thiện
  level: WritingLevel;      // "cau" | "doan" | "bai"
  title: string;            // Tiêu đề bài viết theo SGK
  prompt: string;           // Đề bài chi tiết / Yêu cầu thực hành
  topic: string;            // Chủ đề
  targetWords: number;      // Số từ khuyến nghị
  lessonReference?: string; // Vị trí bài học trong chương trình Kết nối tri thức
  stepByStepGuide: StepByStepGuidance;
  sampleExcerpts?: {
    goodIntroExample?: string;
    goodBodyExcerpt?: string;
    goodConclusionExample?: string;
  };
  rubricCriterionIds?: string[];
  suggestedRubricSummary?: string[];
  createdBy?: string;       // userId nếu do giáo viên tạo
  createdByName?: string;
  createdAt: string;
  updatedAt?: string;
  usageCount: number;       // Số lượt học sinh đã chọn viết
  isFeatured?: boolean;     // Đề bài tiêu biểu
}

export * from "./scan";
