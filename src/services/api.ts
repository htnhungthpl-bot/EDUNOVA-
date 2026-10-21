import { User, ClassRoom, Assignment, Submission, Material, GameResult, AuditLog, EssayPrompt } from "../types";

export const api = {
  // Status
  async getStatus() {
    const res = await fetch("/api/status");
    return res.json();
  },

  // Auth & Users
  async getCurrentUser(email?: string): Promise<{ user: User }> {
    const url = email ? `/api/auth/current?email=${encodeURIComponent(email)}` : "/api/auth/current";
    const res = await fetch(url);
    return res.json();
  },

  async getUsers(): Promise<{ users: User[] }> {
    const res = await fetch("/api/auth/users");
    return res.json();
  },

  async login(credentials: {
    email?: string;
    username?: string;
    identifier?: string;
    password?: string;
    role?: string;
    classId?: string;
    name?: string;
    pinCode?: string;
  } | string): Promise<{ user: User; mustChangePassword?: boolean; message: string }> {
    const body = typeof credentials === "string" ? { email: credentials } : credentials;
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Đăng nhập thất bại");
    }
    return res.json();
  },

  async loginWithPin(classId: string, name: string, pinCode: string): Promise<{ user: User; message: string }> {
    return this.login({ role: "student", classId, name, pinCode });
  },

  async loginGoogle(payload: { email: string; name: string; avatar?: string }): Promise<{ user: User; message: string }> {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Đăng nhập Google thất bại");
    }
    return res.json();
  },

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, oldPassword, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Đổi mật khẩu thất bại");
    }
    return res.json();
  },

  async resetStudentPin(studentId: string): Promise<{ pinCode: string; message: string }> {
    const res = await fetch(`/api/students/${studentId}/reset-pin`, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Không thể cấp lại mã PIN");
    }
    return res.json();
  },

  async toggleUserStatus(userId: string): Promise<{ status: string; message: string }> {
    const res = await fetch(`/api/users/${userId}/toggle-status`, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi thay đổi trạng thái");
    }
    return res.json();
  },

  async getClassRoster(classId: string): Promise<{ students: Array<{ id: string; name: string; email: string; classId: string; pinCode: string; status: string }> }> {
    const res = await fetch(`/api/classes/${classId}/roster`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi tải danh sách lớp");
    }
    return res.json();
  },

  async cleanDemoData(): Promise<{ success: boolean; backupFile: string; message: string }> {
    const res = await fetch("/api/admin/clean-data", {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi làm sạch dữ liệu");
    }
    return res.json();
  },

  async register(data: { name: string; email: string; role: string; classId?: string; schoolName?: string }) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Đăng ký thất bại");
    }
    return res.json();
  },

  // Classes & Students
  async getClasses(): Promise<{ classes: ClassRoom[] }> {
    const res = await fetch("/api/classes");
    return res.json();
  },

  async getStudents(params?: { classId?: string; search?: string }): Promise<{ students: User[] }> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`/api/students?${query}`);
    return res.json();
  },

  async createStudent(data: { name: string; email: string; classId?: string; schoolName?: string }) {
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi tạo học sinh");
    }
    return res.json();
  },

  async updateStudent(id: string, data: { name?: string; email?: string; classId?: string }) {
    const res = await fetch(`/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi cập nhật học sinh");
    }
    return res.json();
  },

  async deleteStudent(id: string) {
    const res = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi xóa học sinh");
    }
    return res.json();
  },

  async importStudents(studentsList: any[], classId?: string) {
    const res = await fetch("/api/students/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentsList, classId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi nhập danh sách học sinh");
    }
    return res.json();
  },

  // Assignments
  async getAssignments(params?: { classId?: string; level?: string }): Promise<{ assignments: Assignment[] }> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`/api/assignments?${query}`);
    return res.json();
  },

  async createAssignment(data: Partial<Assignment>) {
    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi tạo bài tập");
    }
    return res.json();
  },

  async updateAssignment(id: string, data: Partial<Assignment>) {
    const res = await fetch(`/api/assignments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteAssignment(id: string) {
    const res = await fetch(`/api/assignments/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },

  // Submissions & Drafts
  async getSubmissions(params?: { studentId?: string; assignmentId?: string; classId?: string }): Promise<{ submissions: Submission[] }> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`/api/submissions?${query}`);
    return res.json();
  },

  async getSubmission(id: string): Promise<{ submission: Submission }> {
    const res = await fetch(`/api/submissions/${id}`);
    if (!res.ok) throw new Error("Không tìm thấy bài làm");
    return res.json();
  },

  async saveDraft(data: {
    submissionId?: string;
    assignmentId?: string;
    assignmentTitle?: string;
    studentId: string;
    studentName: string;
    classId?: string;
    level: "cau" | "doan" | "bai";
    content: string;
    notes?: string;
    isNewVersion?: boolean;
  }) {
    const res = await fetch("/api/submissions/save-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async submitAssignment(submissionId: string, studentId: string) {
    const res = await fetch("/api/submissions/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId, studentId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi nộp bài");
    }
    return res.json();
  },

  async teacherEvaluateSubmission(data: {
    submissionId: string;
    teacherName: string;
    scores?: any[];
    overallLevel?: number;
    overallScore?: number;
    teacherNotes?: string;
  }) {
    const res = await fetch("/api/submissions/teacher-evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // AI Writing Coach & Rubric
  async getAiCoachFeedback(data: {
    level: "cau" | "doan" | "bai";
    promptTopic?: string;
    currentContent: string;
    studentQuestion?: string;
  }) {
    const res = await fetch("/api/ai/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi gọi AI Writing Coach");
    }
    return res.json();
  },

  async getAiRubricEvaluation(data: {
    content: string;
    level: "cau" | "doan" | "bai";
    topic?: string;
    title?: string;
  }) {
    const res = await fetch("/api/ai/rubric", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi gọi AI Rubric");
    }
    return res.json();
  },

  async getAiBrainstorm(data: { topic: string; level?: string; userId?: string }) {
    const res = await fetch("/api/ai/brainstorm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi gọi AI Tìm ý");
    }
    return res.json();
  },

  async getAiSentenceExpansion(data: { originalSentence: string; technique?: string; userId?: string }) {
    const res = await fetch("/api/ai/expand-sentence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi gọi AI Luyện câu");
    }
    return res.json();
  },

  async getAiOutline(data: { topic: string; level?: string; userId?: string }) {
    const res = await fetch("/api/ai/outline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi gọi AI Lập dàn ý");
    }
    return res.json();
  },

  // Materials
  async getMaterials(params?: { category?: string; skill?: string; level?: string; search?: string }): Promise<{ materials: Material[] }> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`/api/materials?${query}`);
    return res.json();
  },

  async createMaterial(data: Partial<Material>) {
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteMaterial(id: string) {
    const res = await fetch(`/api/materials/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },

  // Games
  async getGameResults(studentId?: string): Promise<{ results: GameResult[] }> {
    const url = studentId ? `/api/games/results?studentId=${encodeURIComponent(studentId)}` : "/api/games/results";
    const res = await fetch(url);
    return res.json();
  },

  async recordGameResult(data: {
    gameId: string;
    gameName: string;
    studentId: string;
    studentName: string;
    score: number;
    maxScore: number;
    stars: number;
  }) {
    const res = await fetch("/api/games/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Admin & Audit
  async getAuditLogs(): Promise<{ logs: AuditLog[] }> {
    const res = await fetch("/api/admin/audit-logs");
    return res.json();
  },

  async getAdminSystem(): Promise<{ settings: any; stats: any }> {
    const res = await fetch("/api/admin/system");
    return res.json();
  },

  async updateAdminSettings(settings: any) {
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  async restoreBackup(backupData: any) {
    const res = await fetch("/api/admin/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backupData),
    });
    return res.json();
  },

  // ==========================================================================
  // PHÂN HỆ AI SCAN & RUBRIC API CLIENT
  // ==========================================================================
  async uploadScanDocx(data: { base64File: string; fileName: string }) {
    const res = await fetch("/api/scan/upload-docx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi xử lý tệp Word.");
    }
    return res.json();
  },

  async uploadScanImages(data: {
    pages: Array<{ base64Data: string; mimeType: string; fileName: string; pageNumber: number }>;
    assignmentTitle?: string;
    genre?: string;
    genreLabel?: string;
    level?: string;
    promptContext?: string;
  }) {
    const res = await fetch("/api/scan/upload-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi nhận dạng ảnh bài viết.");
    }
    return res.json();
  },

  async saveScanRecord(recordData: any) {
    const res = await fetch("/api/scan/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recordData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi lưu bản ghi scan.");
    }
    return res.json();
  },

  async evaluateScanRecord(
    id: string,
    data: {
      confirmedText: string;
      studentName?: string;
      assignmentTitle?: string;
      level?: string;
      genre?: string;
      genreLabel?: string;
      promptContext?: string;
      role?: string;
      userId?: string;
    }
  ) {
    const res = await fetch(`/api/scan/${id}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi đánh giá Rubric cho bài scan.");
    }
    return res.json();
  },

  async getScanList(params?: { userId?: string; role?: string; classId?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`/api/scan/list?${query}`);
    return res.json();
  },

  async getScanDetail(id: string, params?: { userId?: string; role?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`/api/scan/${id}?${query}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi tải thông tin bài scan.");
    }
    return res.json();
  },

  async approveScanEvaluation(
    id: string,
    data: {
      teacherId?: string;
      teacherName?: string;
      officialComment?: string;
      adjustedScores?: any;
    }
  ) {
    const res = await fetch(`/api/scan/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi duyệt kết quả đánh giá.");
    }
    return res.json();
  },

  async convertScanToStudio(id: string) {
    const res = await fetch(`/api/scan/${id}/convert-to-studio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi chuyển bài viết vào Studio.");
    }
    return res.json();
  },

  getScanExportCsvUrl(params: { userId: string; role: string; classId?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return `/api/scan/export-csv?${query}`;
  },

  // =========================================================================
  // KHO ĐỀ VĂN LỚP 4 (ESSAY PROMPTS REPOSITORY)
  // =========================================================================
  async getPrompts(params?: {
    source?: string;
    volume?: string;
    genre?: string;
    level?: string;
    topic?: string;
    search?: string;
  }): Promise<{
    prompts: EssayPrompt[];
    stats: {
      total: number;
      countTap1: number;
      countTap2: number;
      countSourceDoc: number;
      countCurated: number;
      countTeacher: number;
    };
    filteredCount: number;
  }> {
    const query = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => Boolean(v)) as [string, string][]
    ).toString();
    const res = await fetch(`/api/prompts?${query}`);
    if (!res.ok) {
      throw new Error("Không thể tải danh sách đề từ Kho đề.");
    }
    return res.json();
  },

  async getPromptById(id: string, incrementUsage: boolean = false): Promise<{ prompt: EssayPrompt }> {
    const res = await fetch(`/api/prompts/${id}?incrementUsage=${incrementUsage}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Không thể tải chi tiết đề bài.");
    }
    return res.json();
  },

  async createPrompt(data: Partial<EssayPrompt>): Promise<{ prompt: EssayPrompt; message: string }> {
    const res = await fetch("/api/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi tạo đề bài mới.");
    }
    return res.json();
  },

  async updatePrompt(id: string, data: Partial<EssayPrompt>): Promise<{ prompt: EssayPrompt; message: string }> {
    const res = await fetch(`/api/prompts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi cập nhật đề bài.");
    }
    return res.json();
  },

  async deletePrompt(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/prompts/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi xóa đề bài.");
    }
    return res.json();
  },

  async assignPromptToClass(
    id: string,
    data: { classId: string; dueDate?: string; customGuidelines?: string[]; teacherName?: string }
  ): Promise<{ success: boolean; assignment: Assignment; message: string }> {
    const res = await fetch(`/api/prompts/${id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi giao đề bài cho lớp.");
    }
    return res.json();
  },

  async getPromptAiOutline(
    id: string,
    data: { specificSubject?: string; studentLevel?: string }
  ): Promise<{
    success: boolean;
    customOutline: {
      subject: string;
      genre: string;
      level: string;
      introduction: string;
      bodyPoints: string[];
      conclusion: string;
      suggestedWords: string[];
      suggestedComparisons: string[];
      guidingQuestions: string[];
    };
  }> {
    const res = await fetch(`/api/prompts/${id}/ai-outline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Lỗi tạo dàn ý AI cho đề bài.");
    }
    return res.json();
  },
};

