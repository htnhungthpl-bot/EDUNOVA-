import React, { useState, useEffect } from "react";
import { User, ClassRoom, Submission, PromptGenre, WritingLevel } from "../types";
import { UploadedScanRecord } from "../types/scan";
import { api } from "../services/api";
import { GENRE_RUBRICS_MAP } from "../data/genreRubrics";
import {
  autoRepairVietnameseText,
  normalizeVietnameseNFC,
  exportToWordDoc,
  exportToTextFile,
} from "../utils/vietnameseFontUtils";
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Download,
  Upload,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  Eye,
  Award,
  Clock,
  Sparkles,
  BookOpen,
  Check,
  RotateCw,
  Maximize2,
  Layers,
  ChevronRight,
  Filter,
  FileCheck,
  Image as ImageIcon,
  Send,
  HelpCircle,
  MessageSquare,
  Sliders,
} from "lucide-react";

interface TeacherDashboardViewProps {
  currentUser: User;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({ currentUser }) => {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [scanRecords, setScanRecords] = useState<UploadedScanRecord[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("class-4a1");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Tab: 'grading' | 'students' | 'import' | 'reports'
  const [activeTab, setActiveTab] = useState<"grading" | "students" | "import" | "reports">("grading");

  // Filter in Grading Tab
  const [gradingStudentFilter, setGradingStudentFilter] = useState<string>("all");
  const [gradingStatusFilter, setGradingStatusFilter] = useState<"all" | "pending" | "confirmed">("all");
  const [gradingTypeFilter, setGradingTypeFilter] = useState<"all" | "studio" | "scan">("all");

  // Modal Grading Workspace
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const [activeScanRecord, setActiveScanRecord] = useState<UploadedScanRecord | null>(null);
  const [activeVersionIndex, setActiveVersionIndex] = useState<number>(0);
  const [teacherScores, setTeacherScores] = useState<Record<string, { level: 1 | 2 | 3 | 4; score: number }>>({});
  const [teacherNotes, setTeacherNotes] = useState<string>("");
  const [isSavingGrade, setIsSavingGrade] = useState(false);
  const [zoomedScanImage, setZoomedScanImage] = useState<string | null>(null);

  // Add / Edit Student Modal
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formClassId, setFormClassId] = useState("class-4a1");

  // Import CSV / Excel State
  const [importCsvText, setImportCsvText] = useState("");
  const [importPreviewList, setImportPreviewList] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importResultSummary, setImportResultSummary] = useState<string | null>(null);

  // Toast notice
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [clsRes, stdRes, subRes, scanRes] = await Promise.all([
        api.getClasses(),
        api.getStudents({ classId: selectedClass || undefined }),
        api.getSubmissions({ classId: selectedClass || undefined }),
        api.getScanList({ classId: selectedClass || undefined, role: currentUser.role, userId: currentUser.id }),
      ]);
      setClasses(clsRes.classes || []);
      setStudents(stdRes.students || []);
      setSubmissions(subRes.submissions || []);
      setScanRecords(scanRes.records || []);
    } catch (err) {
      console.error("Error loading teacher dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedClass]);

  // Standard 6 Rubric Criteria for Grade 4
  const standardCriteria = [
    { id: "c1", name: "1. Đáp ứng yêu cầu đề bài & Thể loại", desc: "Viết đúng thể loại theo SGK Tiếng Việt 4, mở bài và kết bài rõ ràng." },
    { id: "c2", name: "2. Nội dung & Phát triển ý", desc: "Quan sát chi tiết, chọn lọc hình ảnh tiêu biểu, sắp xếp ý mạch lạc." },
    { id: "c3", name: "3. Diễn đạt câu & Dùng từ gợi cảm", desc: "Câu văn trôi chảy, đúng ngữ pháp, dùng từ láy và từ ngữ gợi tả sinh động." },
    { id: "c4", name: "4. Vận dụng So sánh & Nhân hóa", desc: "Có hình ảnh so sánh, nhân hóa giúp bài văn giàu cảm xúc và hình ảnh." },
    { id: "c5", name: "5. Bố cục & Liên kết đoạn văn", desc: "Phân đoạn hợp lý, câu chuyển tiếp tự nhiên giữa các phần mở, thân, kết." },
    { id: "c6", name: "6. Chính tả, dấu câu & Trình bày", desc: "Chữ viết sạch sẽ, đúng chính tả, ngắt câu và đặt dấu câu chuẩn xác." },
  ];

  // --------------------------------------------------------------------------
  // HÀM TÍNH TOÁN 6 TIÊU CHÍ RUBRIC CHUYÊN BIỆT THEO ĐÚNG THỂ LOẠI (GDPT 2018)
  // --------------------------------------------------------------------------
  const getSubmissionCriteria = (
    title: string,
    sub?: Submission | null,
    scan?: UploadedScanRecord | null
  ) => {
    if (scan?.evaluation?.criteria && scan.evaluation.criteria.length > 0) {
      return scan.evaluation.criteria.map((c, idx) => ({
        id: c.criterionId || `criterion-${idx + 1}`,
        name: c.name,
        desc: c.comment || c.evidence || standardCriteria[idx]?.desc || "Tiêu chuẩn đánh giá môn Tiếng Việt 4",
      }));
    }

    if (sub?.rubricEvaluation?.scores && sub.rubricEvaluation.scores.length > 0) {
      return sub.rubricEvaluation.scores.map((s, idx) => ({
        id: s.criterionId || `c${idx + 1}`,
        name: s.name.startsWith(`${idx + 1}.`) ? s.name : `${idx + 1}. ${s.name}`,
        desc: s.comment || s.evidence || standardCriteria[idx]?.desc || "Tiêu chí chấm theo GDPT 2018",
      }));
    }

    const t = (title || "").toLowerCase();
    let genreKey: PromptGenre = "mieu-ta-cay-coi";
    if (t.includes("mèo") || t.includes("con vật") || t.includes("chó") || t.includes("công") || t.includes("chim")) {
      genreKey = "mieu-ta-con-vat";
    } else if (t.includes("đơn") || t.includes("câu lạc bộ")) {
      genreKey = "viet-don";
    } else if (t.includes("cảm xúc") || t.includes("tình cảm") || t.includes("sông la")) {
      genreKey = "doan-van-tinh-cam";
    } else if (t.includes("trải nghiệm") || t.includes("bát tràng") || t.includes("thuật lại") || t.includes("ngày hội")) {
      genreKey = "thuat-lai-su-viec";
    } else if (t.includes("tưởng tượng") || t.includes("giọt sương")) {
      genreKey = "tuong-tuong";
    } else if (t.includes("ý kiến") || t.includes("lí do")) {
      genreKey = "doan-van-neu-y-kien";
    } else if (t.includes("hướng dẫn") || t.includes("sử dụng") || t.includes("gấp giấy")) {
      genreKey = "huong-dan-cong-viec";
    }

    const rubric = GENRE_RUBRICS_MAP[genreKey];
    if (rubric && rubric.criteriaTemplates && rubric.criteriaTemplates.length > 0) {
      return rubric.criteriaTemplates.map((item, idx) => ({
        id: item.criterionId || `c${idx + 1}`,
        name: item.name.includes(".") ? item.name : `${idx + 1}. ${item.name}`,
        desc: item.description || standardCriteria[idx]?.desc || "Tiêu chuẩn đánh giá chuẩn SGK Tiếng Việt 4",
      }));
    }

    return standardCriteria;
  };

  const activeDisplayCriteria = React.useMemo(() => {
    const title = activeSubmission?.assignmentTitle || activeScanRecord?.assignmentTitle || "";
    return getSubmissionCriteria(title, activeSubmission, activeScanRecord);
  }, [activeSubmission, activeScanRecord]);

  // --------------------------------------------------------------------------
  // MỞ BÀI ĐỂ CHẤM VÀ NHẬN XÉT (DIGITAL SUBMISSION HOẶC SCAN RECORD)
  // --------------------------------------------------------------------------
  const handleOpenSubmissionForGrading = (sub: Submission) => {
    setActiveSubmission(sub);
    setActiveScanRecord(null);
    setActiveVersionIndex(sub.versions && sub.versions.length > 0 ? sub.versions.length - 1 : 0);

    const criteria = getSubmissionCriteria(sub.assignmentTitle, sub, null);
    const initialScores: Record<string, { level: 1 | 2 | 3 | 4; score: number }> = {};
    const scoreDefaults: Record<number, number> = { 1: 2.0, 2: 3.2, 3: 4.2, 4: 4.8 };

    criteria.forEach((crit, idx) => {
      const existing = sub.rubricEvaluation?.scores?.find(
        (s) => s.criterionId === crit.id || s.criterionId === `c${idx + 1}` || s.criterionId === `criterion-${idx + 1}`
      );
      const lvl = existing?.level || 3;
      const scr = existing?.score || scoreDefaults[lvl] || 4.2;
      initialScores[crit.id] = { level: lvl, score: scr };
      initialScores[`c${idx + 1}`] = { level: lvl, score: scr };
      initialScores[`criterion-${idx + 1}`] = { level: lvl, score: scr };
    });

    setTeacherScores(initialScores);
    setTeacherNotes(sub.rubricEvaluation?.teacherNotes || sub.rubricEvaluation?.overallComment || "");
    setIsGradingModalOpen(true);
  };

  const handleOpenScanForGrading = (scan: UploadedScanRecord) => {
    setActiveScanRecord(scan);
    setActiveSubmission(null);

    const criteria = getSubmissionCriteria(scan.assignmentTitle, null, scan);
    const initialScores: Record<string, { level: 1 | 2 | 3 | 4; score: number }> = {};
    const scoreDefaults: Record<number, number> = { 1: 2.0, 2: 3.2, 3: 4.2, 4: 4.8 };

    criteria.forEach((crit, idx) => {
      const existing = scan.evaluation?.criteria?.find(
        (c) => c.criterionId === crit.id || c.criterionId === `criterion-${idx + 1}` || c.criterionId === `c${idx + 1}`
      );
      const adjusted = scan.evaluation?.teacherAdjustedScores?.[crit.id] || scan.evaluation?.teacherAdjustedScores?.[`criterion-${idx + 1}`];
      const lvl = adjusted?.level || existing?.suggested_level || 3;
      const scr = adjusted?.score || existing?.score || scoreDefaults[lvl] || 4.2;
      initialScores[crit.id] = { level: lvl, score: scr };
      initialScores[`c${idx + 1}`] = { level: lvl, score: scr };
      initialScores[`criterion-${idx + 1}`] = { level: lvl, score: scr };
    });

    setTeacherScores(initialScores);
    setTeacherNotes(
      scan.evaluation?.teacherOfficialComment ||
      scan.evaluation?.overall_feedback ||
      ""
    );
    setIsGradingModalOpen(true);
  };

  // Tạo bài nộp mẫu tức thì để giáo viên chấm thử nếu học sinh chưa có bài
  const handleCreateSampleSubmissionForStudent = async (student: User) => {
    try {
      const sampleContent = `Mỗi buổi sớm mùa thu, khi sương mai còn đọng long lanh trên từng ngọn cỏ, em lại háo hức cùng các bạn cắp sách tới trường. Ngôi trường Chu Văn An thân yêu của chúng em rộn rã tiếng cười đùa và rực rỡ sắc cờ hoa.\n\nTrong giờ học Tiếng Việt, cô giáo đã hướng dẫn chúng em cách quan sát và dùng biện pháp so sánh. Em luôn cố gắng rèn luyện từng câu văn để ngày một tiến bộ hơn.`;
      
      const newSub = await api.saveDraft({
        studentId: student.id,
        studentName: student.name,
        classId: student.classId || "class-4a1",
        assignmentTitle: "Bài luyện viết cảm nghĩ buổi sớm đến trường",
        level: "doan",
        content: sampleContent,
        notes: "Bài nộp khởi tạo để giáo viên chấm & nhận xét",
      });

      if (newSub && newSub.submission) {
        handleOpenSubmissionForGrading(newSub.submission);
        loadData();
      }
    } catch (err: any) {
      showToast("Lỗi khi mở bài làm của học sinh: " + err.message, "error");
    }
  };

  // Cập nhật mức điểm khi giáo viên bấm đổi mức (1 | 2 | 3 | 4)
  const handleChangeCriterionLevel = (criterionId: string, level: 1 | 2 | 3 | 4, idx?: number) => {
    const scoreMap: Record<number, number> = { 1: 2.0, 2: 3.2, 3: 4.2, 4: 4.8 };
    const scr = scoreMap[level] || 4.2;
    setTeacherScores((prev) => {
      const next = { ...prev, [criterionId]: { level, score: scr } };
      if (idx !== undefined) {
        next[`c${idx + 1}`] = { level, score: scr };
        next[`criterion-${idx + 1}`] = { level, score: scr };
      }
      return next;
    });
  };

  // Tính điểm trung bình cộng của giáo viên
  const calculateAverageScore = (): number => {
    if (!activeDisplayCriteria || activeDisplayCriteria.length === 0) return 4.2;
    const scores = activeDisplayCriteria.map((c) => teacherScores[c.id]?.score || 4.2);
    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / scores.length).toFixed(1));
  };

  // Lưu và phê duyệt chính thức
  const handleSaveOfficialGrading = async () => {
    setIsSavingGrade(true);
    const avgScore = calculateAverageScore();
    const overallLevel: 1 | 2 | 3 | 4 = avgScore >= 4.5 ? 4 : avgScore >= 3.8 ? 3 : avgScore >= 2.6 ? 2 : 1;

    try {
      if (activeSubmission) {
        // Chấm bài viết từ Trình soạn thảo Studio theo Rubric chuyên biệt
        const formattedScores = activeDisplayCriteria.map((c) => ({
          criterionId: c.id,
          name: c.name,
          level: teacherScores[c.id]?.level || 3,
          score: teacherScores[c.id]?.score || 4.2,
          comment: `Giáo viên đánh giá Mức ${teacherScores[c.id]?.level || 3}`,
        }));

        await api.teacherEvaluateSubmission({
          submissionId: activeSubmission.id,
          teacherName: currentUser.name,
          scores: formattedScores,
          overallLevel: overallLevel,
          overallScore: avgScore,
          teacherNotes: teacherNotes.trim() || "Thầy/Cô rất khen ngợi bài viết của em, hãy tiếp tục phát huy nhé!",
        });

        showToast(`Đã phê duyệt và gửi nhận xét chính thức cho em ${activeSubmission.studentName}!`, "success");
      } else if (activeScanRecord) {
        // Chấm bài viết tay từ Scan & Rubric
        await api.approveScanEvaluation(activeScanRecord.id, {
          teacherId: currentUser.id,
          teacherName: currentUser.name,
          officialComment: teacherNotes.trim() || "Thầy/Cô đánh giá bài viết tay đạt yêu cầu tốt, chữ viết rõ ràng và ý văn phong phú.",
          adjustedScores: teacherScores,
        });

        showToast(`Đã phê duyệt nhận xét bài scan của em ${activeScanRecord.studentName}!`, "success");
      }

      setIsGradingModalOpen(false);
      loadData(); // Tải lại dữ liệu mới nhất
    } catch (err: any) {
      showToast(err.message || "Có lỗi khi lưu kết quả chấm bài.", "error");
    } finally {
      setIsSavingGrade(false);
    }
  };

  // Gợi ý nhanh lời nhận xét của giáo viên
  const quickCommentTemplates = [
    "Cô rất khen ngợi em đã quan sát rất tỉ mỉ và biết dùng hình ảnh so sánh sinh động!",
    "Bài viết đúng thể loại và đủ ý. Em chú ý ngắt câu bằng dấu chấm để đoạn văn mạch lạc hơn nhé.",
    "Ý văn rất trong sáng, cảm xúc chân thực. Em hãy thử thêm một số từ láy gợi tả để bài viết hay hơn nữa.",
    "Chữ viết của em rất sạch sẽ, đúng chính tả. Hãy tiếp tục phát huy tinh thần tự rèn luyện này!",
  ];

  // --------------------------------------------------------------------------
  // DANH SÁCH BÀI CẦN CHẤM & ĐÃ CHẤM TỔNG HỢP (STUDIO + SCAN)
  // --------------------------------------------------------------------------
  interface UnifiedSubmissionItem {
    id: string;
    type: "studio" | "scan";
    studentId: string;
    studentName: string;
    classId: string;
    title: string;
    level: WritingLevel;
    date: string;
    wordCount: number;
    isConfirmed: boolean;
    overallLevel?: number;
    overallScore?: number;
    rawStudio?: Submission;
    rawScan?: UploadedScanRecord;
  }

  const unifiedList: UnifiedSubmissionItem[] = [
    ...submissions.map((s) => ({
      id: s.id,
      type: "studio" as const,
      studentId: s.studentId,
      studentName: s.studentName,
      classId: s.classId,
      title: s.assignmentTitle,
      level: s.level,
      date: s.submittedAt || "Mới nộp",
      wordCount: s.wordCount,
      isConfirmed: Boolean(s.rubricEvaluation?.confirmedByTeacher),
      overallLevel: s.rubricEvaluation?.overallLevel,
      overallScore: s.rubricEvaluation?.overallScore,
      rawStudio: s,
    })),
    ...scanRecords.map((sc) => ({
      id: sc.id,
      type: "scan" as const,
      studentId: sc.studentId || "std-001",
      studentName: sc.studentName || "Học sinh",
      classId: sc.classId || "class-4a1",
      title: sc.assignmentTitle,
      level: sc.level,
      date: sc.confirmedAt ? new Date(sc.confirmedAt).toLocaleDateString("vi-VN") : "Hôm nay",
      wordCount: (sc.confirmedText || sc.extractedRawText).trim().split(/\s+/).filter(Boolean).length,
      isConfirmed: Boolean(sc.evaluation?.teacherApproved),
      overallLevel: sc.evaluation?.teacherAdjustedScores
        ? 4
        : sc.evaluation?.criteria?.[0]?.suggested_level || 3,
      overallScore: sc.evaluation?.criteria
        ? Number(
            (
              sc.evaluation.criteria.reduce((a, b) => a + b.score, 0) /
              (sc.evaluation.criteria.length || 1)
            ).toFixed(1)
          )
        : 4.2,
      rawScan: sc,
    })),
  ];

  // Lọc theo bộ lọc của giáo viên
  const filteredUnifiedList = unifiedList.filter((item) => {
    if (gradingStudentFilter !== "all" && item.studentId !== gradingStudentFilter) return false;
    if (gradingTypeFilter !== "all" && item.type !== gradingTypeFilter) return false;
    if (gradingStatusFilter === "pending" && item.isConfirmed) return false;
    if (gradingStatusFilter === "confirmed" && !item.isConfirmed) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.studentName.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = unifiedList.filter((item) => !item.isConfirmed).length;

  // Filtered Students in Students Tab
  const filteredStudents = students.filter((s) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      alert("Vui lòng điền đủ họ tên và email học sinh.");
      return;
    }
    try {
      if (editingStudentId) {
        await api.updateStudent(editingStudentId, {
          name: formName,
          email: formEmail,
          classId: formClassId,
        });
      } else {
        await api.createStudent({
          name: formName,
          email: formEmail,
          classId: formClassId,
        });
      }
      setShowStudentModal(false);
      setEditingStudentId(null);
      setFormName("");
      setFormEmail("");
      loadData();
      showToast("Đã lưu thông tin học sinh thành công!", "success");
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleDeleteStudent = async (student: User) => {
    if (!confirm(`Thầy/Cô có chắc chắn muốn xóa học sinh ${student.name} khỏi hệ thống?`)) return;
    try {
      await api.deleteStudent(student.id);
      loadData();
      showToast(`Đã xóa học sinh ${student.name}`, "info");
    } catch (err: any) {
      alert("Lỗi xóa học sinh: " + err.message);
    }
  };

  // CSV Import Parsing & Validation
  const handleParseCsvForPreview = () => {
    setImportErrors([]);
    setImportResultSummary(null);
    if (!importCsvText.trim()) {
      alert("Vui lòng dán nội dung CSV hoặc danh sách học sinh.");
      return;
    }

    const lines = importCsvText.trim().split("\n");
    const parsed: any[] = [];
    const errors: string[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("Họ và tên") || trimmed.startsWith("Họ tên")) {
        return;
      }

      const parts = trimmed.split(/[,;\t]+/).map((p) => p.trim().replace(/^"|"$/g, ""));
      const rowNum = index + 1;

      if (parts.length < 2) {
        errors.push(`Dòng ${rowNum}: Định dạng thiếu cột. Cần tối thiểu: [Họ tên], [Email]`);
        return;
      }

      const name = parts[0];
      const email = parts[1];
      const targetClass = parts[2] || selectedClass;

      if (!name || name.length < 2) {
        errors.push(`Dòng ${rowNum}: Họ tên quá ngắn hoặc rỗng.`);
        return;
      }

      if (!email || !email.includes("@")) {
        errors.push(`Dòng ${rowNum}: Email '${email}' không đúng định dạng.`);
        return;
      }

      const isAlreadyInDb = students.some((s) => s.email.toLowerCase() === email.toLowerCase());
      if (isAlreadyInDb) {
        errors.push(`Dòng ${rowNum}: Email '${email}' đã tồn tại trong danh sách lớp.`);
        return;
      }

      parsed.push({ rowNum, name, email, classId: targetClass });
    });

    setImportPreviewList(parsed);
    setImportErrors(errors);
  };

  const handleExecuteImport = async () => {
    if (importPreviewList.length === 0) {
      alert("Chưa có dòng dữ liệu hợp lệ nào để nhập.");
      return;
    }
    try {
      const res = await api.importStudents(importPreviewList, selectedClass);
      setImportResultSummary(`Đã nhập thành công ${res.results.imported} học sinh vào hệ thống!`);
      setImportPreviewList([]);
      setImportCsvText("");
      loadData();
    } catch (err: any) {
      alert("Lỗi nhập dữ liệu: " + err.message);
    }
  };

  const downloadSampleCsv = () => {
    const sampleContent =
      "\uFEFF" +
      "Họ và tên,Email,Lớp\nNguyễn Minh Hoàng,hoang.nguyen@edunova.edu.vn,class-4a1\nTrần Bảo Trâm,tram.tran@edunova.edu.vn,class-4a1\nLê Đức Anh,anh.le@edunova.edu.vn,class-4a1\n";
    const blob = new Blob([sampleContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mau_nhap_hoc_sinh_edunova.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportStudentsCsv = () => {
    window.location.href = `/api/export/students-csv?classId=${selectedClass}`;
  };

  const exportSubmissionsCsv = () => {
    window.location.href = `/api/export/submissions-csv?classId=${selectedClass}`;
  };

  // Rubric Statistics
  const level4Count = submissions.filter((s) => s.rubricEvaluation?.overallLevel === 4).length;
  const level3Count = submissions.filter((s) => s.rubricEvaluation?.overallLevel === 3).length;
  const level2Count = submissions.filter((s) => s.rubricEvaluation?.overallLevel === 2).length;
  const level1Count = submissions.filter((s) => s.rubricEvaluation?.overallLevel === 1).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce ${
            toast.type === "success"
              ? "bg-emerald-600 text-white border-emerald-500"
              : toast.type === "error"
              ? "bg-rose-600 text-white border-rose-500"
              : "bg-slate-800 text-white border-slate-700"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {toast.message}
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-linear-to-r from-emerald-700 via-teal-700 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
            Khu Vực Dành Cho Giáo Viên
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Quản Lý Lớp Học & Chấm Bài Viết Văn
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Thầy/Cô: <span className="font-bold text-amber-300">{currentUser.name}</span> • Mở bài làm học sinh để đọc nội dung, chấm 6 tiêu chí Rubric GDPT 2018 và gửi nhận xét dặn dò chính thức.
          </p>
        </div>

        {/* 4 Tab Buttons */}
        <div className="flex flex-wrap bg-emerald-950/40 p-1.5 rounded-2xl border border-emerald-500/30 text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab("grading")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "grading"
                ? "bg-white text-emerald-900 shadow-xs font-black"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Chấm bài & Nhận xét
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-emerald-950 text-[10px] font-black">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === "students" ? "bg-white text-emerald-900 shadow-xs font-black" : "text-emerald-200 hover:text-white"
            }`}
          >
            Học sinh ({students.length})
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === "import" ? "bg-white text-emerald-900 shadow-xs font-black" : "text-emerald-200 hover:text-white"
            }`}
          >
            Nhập Excel / CSV
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === "reports" ? "bg-white text-emerald-900 shadow-xs font-black" : "text-emerald-200 hover:text-white"
            }`}
          >
            Báo cáo & Thống kê
          </button>
        </div>
      </div>

      {/* Class Selector & Export bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold uppercase text-slate-400">Chọn lớp phụ trách:</span>
          <div className="flex gap-2">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedClass === cls.id
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cls.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportStudentsCsv}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" /> Xuất DS Học Sinh (.CSV)
          </button>
          <button
            onClick={exportSubmissionsCsv}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-orange-600" /> Xuất Báo Cáo Bài Viết (.CSV)
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: CHẤM BÀI & NHẬN XÉT (TÍNH NĂNG CHÍNH CỦA GIÁO VIÊN)            */}
      {/* ==================================================================== */}
      {activeTab === "grading" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Danh Sách Bài Viết Cần Chấm & Duyệt Điểm
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Thầy/Cô có thể bấm trực tiếp vào từng bài để mở xem nội dung, tra cứu các bản nháp, chấm 6 tiêu chí Rubric và phê duyệt.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Hiển thị: <strong className="text-emerald-700">{filteredUnifiedList.length}</strong> bài nộp
              </span>
            </div>
          </div>

          {/* Thanh công cụ lọc bài viết */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Lọc theo học sinh */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Lọc theo học sinh:</label>
              <select
                value={gradingStudentFilter}
                onChange={(e) => setGradingStudentFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-emerald-500"
              >
                <option value="all">-- Tất cả học sinh trong lớp --</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Lọc theo trạng thái chấm */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Trạng thái phê duyệt:</label>
              <select
                value={gradingStatusFilter}
                onChange={(e) => setGradingStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-emerald-500"
              >
                <option value="all">Tất cả bài viết</option>
                <option value="pending">Chờ giáo viên duyệt ({pendingCount})</option>
                <option value="confirmed">Đã phê duyệt chính thức</option>
              </select>
            </div>

            {/* Lọc theo nguồn nộp (Studio / Scan) */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Nguồn bài nộp:</label>
              <select
                value={gradingTypeFilter}
                onChange={(e) => setGradingTypeFilter(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-emerald-500"
              >
                <option value="all">Tất cả nguồn bài</option>
                <option value="studio">Bài viết số (Studio Luyện viết)</option>
                <option value="scan">Bài viết tay / Scan Word</option>
              </select>
            </div>

            {/* Tìm kiếm nhanh */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Tìm kiếm nhanh:</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tên học sinh, đề bài..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Bảng danh sách bài nộp */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Học sinh</th>
                  <th className="py-3 px-4">Đề bài & Cấp độ</th>
                  <th className="py-3 px-4">Nguồn bài</th>
                  <th className="py-3 px-4">Độ dài</th>
                  <th className="py-3 px-4">Trạng thái Rubric</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUnifiedList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 italic">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileCheck className="w-8 h-8 text-slate-300" />
                        <p>Không có bài nộp nào phù hợp với bộ lọc hiện tại.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUnifiedList.map((item) => {
                    const isPending = !item.isConfirmed;
                    return (
                      <tr
                        key={item.type + "-" + item.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isPending ? "bg-amber-50/20" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
                              {item.studentName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{item.studentName}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{item.date}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="font-extrabold text-slate-800 line-clamp-1">{item.title}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 inline-block mt-0.5">
                            {item.level === "cau" ? "Luyện câu" : item.level === "doan" ? "Luyện đoạn" : "Bài văn"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {item.type === "studio" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200">
                              <BookOpen className="w-3 h-3 text-teal-600" /> Studio
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
                              <ImageIcon className="w-3 h-3 text-indigo-600" /> Scan viết tay
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-700">
                          {item.wordCount} từ
                        </td>

                        <td className="py-3.5 px-4">
                          {item.isConfirmed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              Đã duyệt • Mức {item.overallLevel} ({item.overallScore}đ)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300 animate-pulse">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              Chờ giáo viên duyệt
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.type === "studio" && item.rawStudio) {
                                handleOpenSubmissionForGrading(item.rawStudio);
                              } else if (item.type === "scan" && item.rawScan) {
                                handleOpenScanForGrading(item.rawScan);
                              }
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-2xs ${
                              isPending
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white font-black cursor-pointer scale-102"
                                : "bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {isPending ? "Mở bài chấm & nhận xét" : "Xem & Sửa điểm"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: DANH SÁCH HỌC SINH                                            */}
      {/* ==================================================================== */}
      {activeTab === "students" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm học sinh theo họ tên hoặc email..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 font-medium"
              />
            </div>

            <button
              onClick={() => {
                setEditingStudentId(null);
                setFormName("");
                setFormEmail("");
                setShowStudentModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Thêm học sinh mới
            </button>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-4">Mã PIN Đăng nhập</th>
                  <th className="py-3 px-4">Lớp</th>
                  <th className="py-3 px-4">Số bài đã nộp</th>
                  <th className="py-3 px-4">Mức Rubric gần nhất</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                      Không tìm thấy học sinh nào trong lớp.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((std) => {
                    const studentSubs = unifiedList.filter((s) => s.studentId === std.id);
                    const lastSub = studentSubs[0];
                    return (
                      <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                          <img
                            src={std.avatar}
                            alt={std.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div>{std.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{std.email}</div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 font-mono text-emerald-900 font-black text-xs tracking-wider border border-emerald-200">
                              {std.pinCode || "1234"}
                            </span>
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const res = await api.resetStudentPin(std.id);
                                  std.pinCode = res.pinCode;
                                  showToast(`Đã cấp lại mã PIN mới (${res.pinCode}) cho học sinh ${std.name}!`, "success");
                                  loadData();
                                } catch (err: any) {
                                  showToast(err.message, "error");
                                }
                              }}
                              className="px-2 py-0.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-emerald-700 text-[10px] font-bold border border-slate-200 transition-colors"
                              title="Tạo ngẫu nhiên mã PIN mới cho học sinh này"
                            >
                              Đổi PIN
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            {classes.find((c) => c.id === std.classId)?.name || "4A1"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          <button
                            type="button"
                            onClick={() => {
                              setGradingStudentFilter(std.id);
                              setActiveTab("grading");
                            }}
                            className="text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            {studentSubs.length} bài đã nộp
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          {lastSub?.overallLevel ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Mức {lastSub.overallLevel} ({lastSub.overallScore}đ)
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Chưa chấm</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Nút Xem bài & Chấm điểm */}
                            <button
                              type="button"
                              onClick={() => {
                                setGradingStudentFilter(std.id);
                                setActiveTab("grading");
                                if (studentSubs.length > 0) {
                                  const first = studentSubs[0];
                                  if (first.type === "studio" && first.rawStudio) {
                                    handleOpenSubmissionForGrading(first.rawStudio);
                                  } else if (first.type === "scan" && first.rawScan) {
                                    handleOpenScanForGrading(first.rawScan);
                                  }
                                }
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-200 transition-colors"
                              title="Xem các bài viết của học sinh này"
                            >
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              Chấm bài ({studentSubs.length})
                            </button>

                            <button
                              onClick={() => {
                                setEditingStudentId(std.id);
                                setFormName(std.name);
                                setFormEmail(std.email);
                                setFormClassId(std.classId || "class-4a1");
                                setShowStudentModal(true);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(std)}
                              className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                              title="Xóa học sinh"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: NHẬP EXCEL / CSV                                              */}
      {/* ==================================================================== */}
      {activeTab === "import" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Nhập Danh Sách Học Sinh Bằng Excel / CSV
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Hệ thống tự động kiểm tra định dạng email, phát hiện dữ liệu trùng lặp và báo lỗi từng dòng.
              </p>
            </div>
            <button
              onClick={downloadSampleCsv}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Tải tệp mẫu .CSV
            </button>
          </div>

          {importResultSummary && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {importResultSummary}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Dán nội dung từ tệp Excel/CSV (Định dạng: Họ và tên, Email, Mã lớp):
            </label>
            <textarea
              rows={6}
              value={importCsvText}
              onChange={(e) => setImportCsvText(e.target.value)}
              placeholder={`Nguyễn Văn An,an.nguyen@edunova.edu.vn,class-4a1\nTrần Thị Mai,mai.tran@edunova.edu.vn,class-4a1\nLê Tuấn Kiệt,kiet.le@edunova.edu.vn,class-4a1`}
              className="w-full p-4 rounded-2xl border border-slate-200 font-mono text-xs focus:outline-emerald-500"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-500 italic">
              💡 Mẹo: Có thể sao chép trực tiếp các cột từ Excel rồi dán vào khung trên.
            </span>
            <button
              onClick={handleParseCsvForPreview}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" /> Kiểm tra & Xem trước danh sách
            </button>
          </div>

          {/* Error reporting per row */}
          {importErrors.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Phát hiện {importErrors.length} cảnh báo/lỗi cần xử lý:
              </div>
              <ul className="text-xs text-rose-700 space-y-0.5 list-disc pl-5">
                {importErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview Table */}
          {importPreviewList.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-700">
                  Danh sách hợp lệ sẵn sàng nhập ({importPreviewList.length} học sinh):
                </h4>
                <button
                  onClick={handleExecuteImport}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Xác nhận nhập vào lớp {selectedClass}
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Dòng</th>
                      <th className="py-2.5 px-3">Họ và tên</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">Mã lớp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {importPreviewList.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-400 font-mono">{row.rowNum}</td>
                        <td className="py-2 px-3 font-bold text-slate-800">{row.name}</td>
                        <td className="py-2 px-3 text-slate-600">{row.email}</td>
                        <td className="py-2 px-3 text-slate-500">{row.classId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: BÁO CÁO & THỐNG KÊ TIẾN ĐỘ                                    */}
      {/* ==================================================================== */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Tổng học sinh</span>
              <p className="text-2xl font-black text-slate-900">{students.length} em</p>
              <p className="text-[11px] text-emerald-600 font-bold">Lớp {selectedClass}</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Tổng số bài nộp</span>
              <p className="text-2xl font-black text-slate-900">{unifiedList.length} bài</p>
              <p className="text-[11px] text-slate-500">Gồm {submissions.length} bài Studio & {scanRecords.length} bài Scan</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Mức 4 (Vận dụng tốt)</span>
              <p className="text-2xl font-black text-emerald-600">{level4Count} bài</p>
              <p className="text-[11px] text-slate-500">Điểm 4.6 – 5.0</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Cần rèn luyện thêm</span>
              <p className="text-2xl font-black text-orange-600">{level1Count + level2Count} bài</p>
              <p className="text-[11px] text-slate-500">Cần hỗ trợ về từ láy, câu</p>
            </div>
          </div>

          {/* Visual Distribution Bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  Phân Bố 4 Mức Rubric Đánh Giá Toàn Lớp
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Dựa trên {submissions.length} lượt đánh giá
              </span>
            </div>

            {/* Visual Bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-800">Mức 4: Vận dụng tốt (4.6 – 5.0đ)</span>
                  <span className="text-emerald-800">
                    {level4Count} bài ({Math.round((level4Count / (submissions.length || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((level4Count / (submissions.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-blue-800">Mức 3: Đạt yêu cầu (3.6 – 4.5đ)</span>
                  <span className="text-blue-800">
                    {level3Count} bài ({Math.round((level3Count / (submissions.length || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((level3Count / (submissions.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-orange-800">Mức 2: Đang hình thành (2.6 – 3.5đ)</span>
                  <span className="text-orange-800">
                    {level2Count} bài ({Math.round((level2Count / (submissions.length || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((level2Count / (submissions.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-rose-800">Mức 1: Cần hỗ trợ (1.0 – 2.5đ)</span>
                  <span className="text-rose-800">
                    {level1Count} bài ({Math.round((level1Count / (submissions.length || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((level1Count / (submissions.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Pedagogical Skill Insights */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
              <h4 className="font-black uppercase text-amber-900">
                🔍 Phân tích kỹ năng cần chú ý trong tuần tới:
              </h4>
              <p className="leading-relaxed">
                • <span className="font-bold">Biện pháp so sánh:</span> 70% học sinh đã biết dùng từ "như", cần khuyến khích thêm các từ so sánh phong phú hơn như "tựa như", "giống như", "chẳng khác nào".
              </p>
              <p className="leading-relaxed">
                • <span className="font-bold">Chính tả:</span> Cần tiếp tục cho học sinh chơi trò "Thám tử chính tả" để khắc phục triệt để lỗi lẫn lộn l/n và x/s.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL WORKSPACE: MỞ BÀI HỌC SINH ĐỂ CHẤM & GỬI NHẬN XÉT CHÍNH THỨC    */}
      {/* ==================================================================== */}
      {isGradingModalOpen && (activeSubmission || activeScanRecord) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {activeSubmission ? "Bài Viết Studio" : "Bài Viết Tay / Scan"}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Học sinh: <strong className="text-slate-900">{activeSubmission?.studentName || activeScanRecord?.studentName}</strong>
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">
                      Lớp {selectedClass.replace("class-", "").toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    {activeSubmission?.assignmentTitle || activeScanRecord?.assignmentTitle}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsGradingModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - 2 Columns */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* CỘT TRÁI (6 CỘT): NỘI DUNG BÀI VIẾT HỌC SINH + CÁC BẢN NHÁP / ẢNH SCAN */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-black text-xs uppercase tracking-wider text-slate-700">
                      Nội dung bài viết học sinh
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const contentToExport = activeSubmission
                          ? activeSubmission.versions?.[activeVersionIndex]?.content || activeSubmission.currentContent
                          : activeScanRecord?.confirmedText || activeScanRecord?.extractedRawText || "";
                        const studentName = activeSubmission?.studentName || activeScanRecord?.studentName || "Học sinh";
                        const title = activeSubmission?.assignmentTitle || activeScanRecord?.assignmentTitle || "Bài làm Tiếng Việt 4";

                        exportToWordDoc({
                          title,
                          author: studentName,
                          content: contentToExport,
                          genreLabel: activeSubmission?.level === "cau" ? "Luyện câu" : "Bài văn lớp 4",
                          rubricEvaluation: {
                            overallScore: calculateAverageScore(),
                            overallLevel: (calculateAverageScore() >= 4.5 ? 4 : calculateAverageScore() >= 3.8 ? 3 : calculateAverageScore() >= 2.6 ? 2 : 1) as any,
                            overallComment: teacherNotes,
                            teacherApprovedBy: currentUser.name,
                            teacherOfficialComment: teacherNotes,
                          },
                        });
                        showToast("Đã tải bài làm học sinh về máy định dạng Word (.doc chuẩn UTF-8)!", "success");
                      }}
                      className="px-2.5 py-1 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Tải bài viết của học sinh ra tệp Word chuẩn font tiếng Việt"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" /> Tải Word (.doc)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const contentToExport = activeSubmission
                          ? activeSubmission.versions?.[activeVersionIndex]?.content || activeSubmission.currentContent
                          : activeScanRecord?.confirmedText || activeScanRecord?.extractedRawText || "";
                        const studentName = activeSubmission?.studentName || activeScanRecord?.studentName || "Học sinh";
                        const title = activeSubmission?.assignmentTitle || activeScanRecord?.assignmentTitle || "Bài làm Tiếng Việt 4";

                        exportToTextFile({
                          title,
                          author: studentName,
                          content: contentToExport,
                          notes: teacherNotes,
                        });
                        showToast("Đã tải bài làm học sinh về máy định dạng Text (.txt chuẩn UTF-8)!", "success");
                      }}
                      className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Tải bài làm dạng văn bản thuần UTF-8 kèm BOM"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" /> Tải (.txt)
                    </button>

                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
                      Độ dài:{" "}
                      <strong className="text-emerald-700">
                        {activeSubmission
                          ? activeSubmission.versions?.[activeVersionIndex]?.wordCount || activeSubmission.wordCount
                          : (activeScanRecord?.confirmedText || "").trim().split(/\s+/).filter(Boolean).length}
                      </strong>{" "}
                      từ
                    </span>
                  </div>
                </div>

                {/* Tabs các phiên bản nháp (nếu bài viết có nhiều phiên bản) */}
                {activeSubmission && activeSubmission.versions && activeSubmission.versions.length > 1 && (
                  <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto text-xs">
                    <span className="text-[10px] font-bold text-slate-400 pl-2">Lịch sử bản nháp:</span>
                    {activeSubmission.versions.map((ver, vIdx) => (
                      <button
                        key={vIdx}
                        type="button"
                        onClick={() => setActiveVersionIndex(vIdx)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          activeVersionIndex === vIdx
                            ? "bg-white text-emerald-800 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Bản {ver.versionNumber} ({ver.wordCount} từ)
                      </button>
                    ))}
                  </div>
                )}

                {/* Khung hiển thị nội dung bài viết */}
                <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 text-sm sm:text-base leading-relaxed text-slate-900 font-sans vietnamese-essay-text max-h-[460px] overflow-y-auto whitespace-pre-wrap select-text shadow-inner">
                  {activeSubmission
                    ? activeSubmission.versions?.[activeVersionIndex]?.content || activeSubmission.currentContent
                    : activeScanRecord?.confirmedText || activeScanRecord?.extractedRawText}
                </div>

                {/* Nếu là bài scan ảnh: hiển thị ảnh chụp trang vở để đối chiếu nét chữ */}
                {activeScanRecord && activeScanRecord.pageImages && activeScanRecord.pageImages.length > 0 && (
                  <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                        Ảnh bài viết tay gốc ({activeScanRecord.pageImages.length} trang):
                      </span>
                      <button
                        type="button"
                        onClick={() => setZoomedScanImage(activeScanRecord.pageImages?.[0]?.dataUrl || null)}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <Maximize2 className="w-3 h-3" /> Phóng to soi nét chữ
                      </button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {activeScanRecord.pageImages.map((p, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => setZoomedScanImage(p.dataUrl)}
                          className="h-28 w-24 shrink-0 rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-emerald-500 relative group"
                        >
                          <img src={p.dataUrl} alt={`Trang ${p.pageNumber}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold">
                            Soi nét
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CỘT PHẢI (6 CỘT): BẢNG ĐIỀU KHIỂN CHẤM RUBRIC 6 TIÊU CHÍ & LỜI DẶN DÒ */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-emerald-600" />
                      Chấm 6 Tiêu Chí Rubric (GDPT 2018)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Bấm chọn mức 1 • 2 • 3 • 4 cho từng tiêu chí để điều chỉnh điểm
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Điểm trung bình:</span>
                    <p className="text-xl font-black text-emerald-700">
                      {calculateAverageScore()} / 5.0đ
                    </p>
                  </div>
                </div>

                {/* 6 Tiêu chí Rubric điều chỉnh linh hoạt theo thể loại */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {activeDisplayCriteria.map((crit, idx) => {
                    const currentLevel = teacherScores[crit.id]?.level || 3;
                    const currentScore = teacherScores[crit.id]?.score || 4.2;

                    return (
                      <div
                        key={crit.id}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 space-y-2 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900 leading-tight">
                            {crit.name}
                          </span>
                          <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                            {currentScore.toFixed(1)}đ
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 leading-relaxed">{crit.desc}</p>

                        {/* 4 Mức độ lựa chọn nhanh */}
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          {[
                            { lvl: 1, label: "Mức 1 (2.0đ)", desc: "Cần hỗ trợ", color: "hover:bg-rose-50 text-rose-800" },
                            { lvl: 2, label: "Mức 2 (3.2đ)", desc: "Đang hình thành", color: "hover:bg-amber-50 text-amber-800" },
                            { lvl: 3, label: "Mức 3 (4.2đ)", desc: "Đạt yêu cầu", color: "hover:bg-blue-50 text-blue-800" },
                            { lvl: 4, label: "Mức 4 (4.8đ)", desc: "Vận dụng tốt", color: "hover:bg-emerald-50 text-emerald-800" },
                          ].map((item) => {
                            const isSelected = currentLevel === item.lvl;
                            return (
                              <button
                                key={item.lvl}
                                type="button"
                                onClick={() => handleChangeCriterionLevel(crit.id, item.lvl as 1 | 2 | 3 | 4, idx)}
                                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                                  isSelected
                                    ? item.lvl === 4
                                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                      : item.lvl === 3
                                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                      : item.lvl === 2
                                      ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                                      : "bg-rose-500 text-white border-rose-500 shadow-xs"
                                    : `bg-white border-slate-200 ${item.color}`
                                }`}
                              >
                                <span className="block font-black">{item.lvl === 4 ? "Mức 4" : item.lvl === 3 ? "Mức 3" : item.lvl === 2 ? "Mức 2" : "Mức 1"}</span>
                                <span className="block text-[9px] opacity-90 truncate">{item.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Lời nhận xét & dặn dò chính thức của giáo viên */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      Lời nhận xét & dặn dò học sinh của Thầy/Cô:
                    </label>
                    <span className="text-[11px] text-slate-400">Học sinh sẽ nhìn thấy lời dặn này</span>
                  </div>

                  {/* Gợi ý lời nhận xét mẫu */}
                  <div className="flex flex-wrap gap-1.5">
                    {quickCommentTemplates.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTeacherNotes((prev) => (prev ? prev + "\n" + tmpl : tmpl))}
                        className="text-[10px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg border border-emerald-200 transition-colors text-left"
                      >
                        + Gợi ý {idx + 1}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={4}
                    value={teacherNotes}
                    onChange={(e) => setTeacherNotes(e.target.value)}
                    placeholder="Thầy/Cô ghi lời nhận xét động viên, chỉ ra điểm sáng và gợi mở hướng hoàn thiện cho học sinh..."
                    className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-500 font-medium">
                Người duyệt: <strong className="text-slate-800">{currentUser.name}</strong> • Kết quả sẽ cập nhật vào sổ điểm và giao diện của học sinh.
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsGradingModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Đóng
                </button>

                <button
                  type="button"
                  disabled={isSavingGrade}
                  onClick={handleSaveOfficialGrading}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  {isSavingGrade ? "Đang lưu..." : "Phê duyệt & Gửi nhận xét cho học sinh"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal phóng to ảnh scan trong khi giáo viên chấm bài */}
      {zoomedScanImage && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setZoomedScanImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setZoomedScanImage(null)}
              className="absolute top-2 right-2 p-2 rounded-xl bg-black/60 text-white hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={zoomedScanImage} alt="Ảnh scan phóng to" className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl" />
          </div>
        </div>
      )}

      {/* Modal Add / Edit Student */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 sm:p-8 space-y-4 relative">
            <button
              onClick={() => setShowStudentModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900">
              {editingStudentId ? "Chỉnh sửa thông tin học sinh" : "Thêm học sinh mới"}
            </h3>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên học sinh</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Minh An"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email học sinh</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Ví dụ: an.nguyen@edunova.edu.vn"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lớp</label>
                <select
                  value={formClassId}
                  onChange={(e) => setFormClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Lưu học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
