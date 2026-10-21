// ============================================================================
// EDUNOVA WRITING COACH - PHÂN HỆ AI SCAN & RUBRIC (TYPES & INTERFACES)
// GIAI ĐOẠN MỞ RỘNG: TẢI BÀI VIẾT - ĐÁNH GIÁ - NHẬN XÉT - TỰ SỬA BÀI
// ============================================================================

import { WritingLevel, PromptGenre } from "./index";

export type ScanFileType = "docx" | "image";

export interface ScanPageImage {
  pageNumber: number;
  dataUrl: string; // Base64 data URL for preview and OCR
  fileName: string;
  fileSize: number;
}

export interface LowConfidenceItem {
  pageIndex: number;
  wordOrPhrase: string;
  contextSentence: string;
  suggestion?: string;
  reason: "chữ viết tay mờ" | "nét chữ dính nhau" | "dấu thanh không rõ" | "chưa chắc chắn";
}

export interface ImageQualityWarning {
  pageIndex: number;
  type: "blur" | "dark" | "glare" | "tilt" | "crop";
  message: string;
}

export interface UploadedScanRecord {
  id: string;
  fileType: ScanFileType;
  fileName: string;
  fileSize: number;
  pageCount: number;
  uploadedBy: string; // userId
  uploaderRole: "student" | "teacher" | "admin";
  uploaderName: string;
  studentId: string;
  studentName: string;
  classId: string;
  assignmentId?: string;
  assignmentTitle: string;
  genre?: PromptGenre;
  genreLabel?: string;
  level: WritingLevel;
  
  // Trích xuất & Xác nhận
  extractedRawText: string;
  confirmedText: string;
  isConfirmed: boolean;
  confirmedAt?: string;

  // Cảnh báo chất lượng và độ tin cậy
  qualityWarnings?: ImageQualityWarning[];
  lowConfidenceItems?: LowConfidenceItem[];
  pageImages?: ScanPageImage[];

  // Kết quả đánh giá Rubric
  evaluation?: ScanRubricEvaluation;
  status: "uploaded" | "extracted" | "confirmed" | "evaluated" | "approved";

  // Liên kết bài viết & Studio
  linkedSubmissionId?: string;
  linkedVersionNumber?: number;

  createdAt: string;
  updatedAt: string;
}

export interface ScanRubricCriterion {
  criterionId: string;
  name: string;
  suggested_level: 1 | 2 | 3 | 4; // 1: Cần hỗ trợ, 2: Đang hình thành, 3: Đạt yêu cầu, 4: Vận dụng tốt
  score: number; // Thang 5.0 (Ví dụ: 3.5, 4.0, 4.8)
  evidence: string; // Trích dẫn ngắn nguyên văn từ bài viết
  explanation?: string; // Giải thích bằng ngôn ngữ thân thiện lớp 4
  guiding_question?: string; // Câu hỏi gợi mở Socratic giúp học sinh tự suy nghĩ
  suggested_action?: string; // Hành động cụ thể học sinh có thể làm để nâng cấp
  comment?: string; // Nhận xét / góp ý chi tiết từ giáo viên hoặc hệ thống
}

export interface ScanRubricStrength {
  title: string;
  evidence: string;
  explanation: string;
}

export interface ScanRubricImprovement {
  issue: string;
  evidence: string;
  guiding_question: string;
  suggested_action: string;
}

export interface ScanRubricEvaluation {
  id: string;
  scanId: string;
  genre?: PromptGenre;
  genreLabel?: string;
  overall_feedback: string;
  strengths: ScanRubricStrength[]; // Tối thiểu 1-2 điểm mạnh thực sự
  criteria: ScanRubricCriterion[]; // 6 tiêu chí chuẩn Bộ GD&ĐT
  improvements: ScanRubricImprovement[]; // Tối đa 2-3 vấn đề ưu tiên rèn luyện
  recognition_warnings: string[];
  needs_teacher_review: boolean;
  next_step: string;
  evaluatedAt: string;
  source: "gemini-3.8-flash" | "pedagogical-engine";

  // Phê duyệt và điều chỉnh của Giáo viên
  teacherApproved: boolean;
  teacherApprovedAt?: string;
  teacherApprovedBy?: string;
  teacherAdjustedScores?: Record<string, { level: 1 | 2 | 3 | 4; score: number; comment?: string }>;
  teacherOfficialComment?: string;
}

export interface BatchUploadItem {
  tempId: string;
  file: File;
  fileName: string;
  fileType: ScanFileType;
  fileSize: number;
  previewUrl?: string;
  studentId: string;
  studentName: string;
  status: "pending" | "extracting" | "extracted" | "error";
  extractedText?: string;
  error?: string;
}

export interface ScanServiceStatus {
  docxSupported: boolean;
  ocrVisionSupported: boolean;
  model: string;
  maxFileSizeMb: number;
  maxPagesPerDocument: number;
  totalScansProcessed: number;
}
