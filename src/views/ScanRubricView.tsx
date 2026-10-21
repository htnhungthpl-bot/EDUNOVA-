import React, { useState, useEffect, useRef } from "react";
import { User, Assignment, WritingLevel, ClassRoom, PromptGenre } from "../types";
import {
  UploadedScanRecord,
  ScanRubricEvaluation,
  ScanFileType,
  ImageQualityWarning,
  LowConfidenceItem,
} from "../types/scan";
import { api } from "../services/api";
import { GENRE_RUBRICS_MAP, getRubricForGenre } from "../data/genreRubrics";
import {
  autoRepairVietnameseText,
  normalizeVietnameseNFC,
  exportToWordDoc,
  exportToTextFile,
} from "../utils/vietnameseFontUtils";
import {
  FileText,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Edit3,
  Award,
  BookOpen,
  Printer,
  ChevronRight,
  Clock,
  Eye,
  FileCheck,
  Check,
  AlertCircle,
  HelpCircle,
  Image as ImageIcon,
  UserCheck,
  Save,
  Trash2,
  Send,
  History,
  X,
  Layers,
  Users,
  Sliders,
  RotateCw,
  ZoomIn,
  Maximize2,
  Split,
  Columns,
  Compass,
  PlusCircle,
} from "lucide-react";

interface ScanRubricViewProps {
  currentUser: User;
  onNavigateToWriting: (content: string, assignmentTitle: string, level: WritingLevel) => void;
  onBackToHome: () => void;
  initialAssignment?: Assignment | null;
}

export const ScanRubricView: React.FC<ScanRubricViewProps> = ({
  currentUser,
  onNavigateToWriting,
  onBackToHome,
  initialAssignment,
}) => {
  // Navigation tabs within Scan view: "upload" | "history"
  const [activeTab, setActiveTab] = useState<"upload" | "history">("upload");

  // Step Workflow: 1: Tải tệp, 2: Trích xuất, 3: Xác nhận văn bản, 4: Đánh giá Rubric & Tự sửa
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // File type selection: "docx" | "image"
  const [selectedFileType, setSelectedFileType] = useState<ScanFileType>("docx");

  // Assignment & metadata linked to classes & students
  const [realClasses, setRealClasses] = useState<ClassRoom[]>([]);
  const [realStudents, setRealStudents] = useState<User[]>([]);
  const [realAssignments, setRealAssignments] = useState<Assignment[]>([]);

  const [selectedClassId, setSelectedClassId] = useState<string>(
    currentUser.classId || "class-4a1"
  );
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    initialAssignment?.id || ""
  );
  const [assignmentTitle, setAssignmentTitle] = useState(
    initialAssignment?.title || "Tả một cây bóng mát trên sân trường em"
  );
  const [assignmentPrompt, setAssignmentPrompt] = useState(
    initialAssignment?.prompt || ""
  );

  // Genre / Thể loại bài viết tập làm văn Lớp 4
  const [selectedGenre, setSelectedGenre] = useState<PromptGenre>(() => {
    if (initialAssignment?.topic) {
      const lower = initialAssignment.topic.toLowerCase();
      if (lower.includes("đơn")) return "viet-don";
      if (lower.includes("con vật")) return "mieu-ta-con-vat";
      if (lower.includes("cây")) return "mieu-ta-cay-coi";
      if (lower.includes("ý kiến")) return "doan-van-neu-y-kien";
      if (lower.includes("tình cảm")) return "doan-van-tinh-cam";
      if (lower.includes("tưởng tượng")) return "tuong-tuong";
      if (lower.includes("hướng dẫn")) return "huong-dan-cong-viec";
      if (lower.includes("thuật lại") || lower.includes("kể")) return "thuat-lai-su-viec";
    }
    return "mieu-ta-cay-coi";
  });

  const [level, setLevel] = useState<WritingLevel>(initialAssignment?.level || "bai");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currentUser.role === "student" ? currentUser.id : "std-001"
  );
  const [selectedStudentName, setSelectedStudentName] = useState<string>(
    currentUser.role === "student" ? currentUser.name : "Nguyễn Minh An"
  );

  // File states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileBase64, setFileBase64] = useState<string>("");

  // Image pages for OCR (multi-page handwritten pages)
  const [imagePages, setImagePages] = useState<
    Array<{ base64Data: string; mimeType: string; fileName: string; pageNumber: number }>
  >([]);
  const [activeImagePageIndex, setActiveImagePageIndex] = useState<number>(0);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showSideBySide, setShowSideBySide] = useState<boolean>(true);
  const [showRubricPreviewModal, setShowRubricPreviewModal] = useState<boolean>(false);

  // Extraction & Confirmation states
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractionStatusText, setExtractionStatusText] = useState("");
  const [originalScannedText, setOriginalScannedText] = useState("");
  const [extractedRawText, setExtractedRawText] = useState("");
  const [confirmedText, setConfirmedText] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [qualityWarnings, setQualityWarnings] = useState<ImageQualityWarning[]>([]);
  const [lowConfidenceItems, setLowConfidenceItems] = useState<LowConfidenceItem[]>([]);
  const [extractionWarnings, setExtractionWarnings] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rubric Evaluation states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentScanId, setCurrentScanId] = useState<string>("");
  const [evaluation, setEvaluation] = useState<ScanRubricEvaluation | null>(null);

  // Version Comparison Modal
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Teacher official review states
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [teacherOfficialComment, setTeacherOfficialComment] = useState("");
  const [teacherAdjustedScores, setTeacherAdjustedScores] = useState<Record<string, { level: 1 | 2 | 3 | 4; score: number }>>({});
  const [isSavingTeacherReview, setIsSavingTeacherReview] = useState(false);

  // History list
  const [historyRecords, setHistoryRecords] = useState<UploadedScanRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Notice toast
  const [notice, setNotice] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotice = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 4000);
  };

  // Load real metadata on mount
  useEffect(() => {
    async function loadMeta() {
      try {
        const [clsRes, stdRes, asgRes] = await Promise.all([
          api.getClasses(),
          api.getStudents(),
          api.getAssignments(),
        ]);
        if (clsRes.classes && clsRes.classes.length > 0) {
          setRealClasses(clsRes.classes);
        }
        if (stdRes.students && stdRes.students.length > 0) {
          setRealStudents(stdRes.students);
          // If teacher, set first student in their class
          if (currentUser.role === "teacher") {
            const myClassStds = stdRes.students.filter((s) => s.classId === (currentUser.classId || "class-4a1"));
            if (myClassStds.length > 0) {
              setSelectedStudentId(myClassStds[0].id);
              setSelectedStudentName(myClassStds[0].name);
            }
          }
        }
        if (asgRes.assignments && asgRes.assignments.length > 0) {
          setRealAssignments(asgRes.assignments);
        }
      } catch (err) {
        console.warn("Could not load real metadata:", err);
      }
    }
    loadMeta();
  }, [currentUser]);

  // Load history when tab is clicked
  useEffect(() => {
    if (activeTab === "history") {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await api.getScanList({
        userId: currentUser.id,
        role: currentUser.role,
        classId: currentUser.role === "teacher" ? selectedClassId : (currentUser.classId || "class-4a1"),
      });
      setHistoryRecords(res.records || []);
    } catch (err: any) {
      console.error("Error loading scan history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // --------------------------------------------------------------------------
  // TẢI TỆP WORD (.DOCX) HOẶC ẢNH
  // --------------------------------------------------------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSelectedFile(file);
  };

  const processSelectedFile = (file: File) => {
    setErrorMessage(null);

    // Kiểm tra định dạng tệp
    const lowerName = file.name.toLowerCase();
    if (selectedFileType === "docx") {
      if (lowerName.endsWith(".doc")) {
        setErrorMessage(
          "Hệ thống phát hiện tệp định dạng .doc cũ (Word 97-2003). Em hoặc Thầy/Cô vui lòng mở tệp trong Word, chọn 'Save As' sang định dạng .docx để tải lên chuẩn xác nhé!"
        );
        return;
      }
      if (!lowerName.endsWith(".docx")) {
        setErrorMessage("Vui lòng chọn tệp tài liệu Word có đuôi .docx.");
        return;
      }
    } else {
      const validImageExts = [".jpg", ".jpeg", ".png", ".webp"];
      if (!validImageExts.some((ext) => lowerName.endsWith(ext))) {
        setErrorMessage("Vui lòng chọn ảnh chụp bài viết có định dạng JPG, PNG hoặc WebP.");
        return;
      }
    }

    // Kiểm tra dung lượng (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Dung lượng tệp vượt quá 15MB. Em hãy nén hoặc chọn tệp nhỏ hơn nhé!");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSize(file.size);

    // Tự động chuẩn hóa và tối ưu kích thước ảnh (tối đa 2048px, giữ nguyên độ nét chữ viết tay tiếng Việt)
    const optimizeImageBase64 = (rawBase64: string, mime: string): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 2048;
          let width = img.width;
          let height = img.height;
          if (width <= maxDim && height <= maxDim) {
            resolve(rawBase64);
            return;
          }
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(rawBase64);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const outMime = mime === "image/png" ? "image/png" : "image/jpeg";
          resolve(canvas.toDataURL(outMime, 0.92));
        };
        img.onerror = () => resolve(rawBase64);
        img.src = rawBase64;
      });
    };

    // Đọc Base64
    const reader = new FileReader();
    reader.onload = async () => {
      const rawBase64 = reader.result as string;

      if (selectedFileType === "image") {
        const optimizedBase64 = await optimizeImageBase64(rawBase64, file.type || "image/jpeg");
        setFileBase64(optimizedBase64);
        setImagePages([
          {
            base64Data: optimizedBase64,
            mimeType: file.type || "image/jpeg",
            fileName: file.name,
            pageNumber: 1,
          },
        ]);
      } else {
        setFileBase64(rawBase64);
      }
      showNotice(`Đã chọn tệp: ${file.name} (${Math.round(file.size / 1024)} KB)`, "success");
    };
    reader.onerror = () => {
      setErrorMessage("Không thể đọc tệp từ thiết bị của em. Vui lòng thử lại!");
    };
    reader.readAsDataURL(file);
  };

  // Xoay ảnh 90 độ bằng canvas (chiều kim đồng hồ hoặc ngược chiều)
  const handleRotateImage = (pageIndex: number, direction: "cw" | "ccw" = "cw") => {
    const page = imagePages[pageIndex];
    if (!page) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Hoán đổi chiều rộng và chiều cao khi xoay 90 độ
      canvas.width = img.height;
      canvas.height = img.width;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (direction === "cw") {
        ctx.translate(canvas.width, 0);
        ctx.rotate((90 * Math.PI) / 180);
      } else {
        ctx.translate(0, canvas.height);
        ctx.rotate((-90 * Math.PI) / 180);
      }

      ctx.drawImage(img, 0, 0);
      const newBase64 = canvas.toDataURL(page.mimeType || "image/jpeg", 0.92);

      setImagePages((prev) =>
        prev.map((p, idx) => (idx === pageIndex ? { ...p, base64Data: newBase64 } : p))
      );
      if (pageIndex === 0) {
        setFileBase64(newBase64);
      }
      showNotice(`Đã xoay trang ${pageIndex + 1} 90° thành công!`, "success");
    };
    img.src = page.base64Data;
  };

  // Thêm trang ảnh bài viết (Trang 2, Trang 3...)
  const handleAddImagePage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePages.length >= 8) {
      showNotice("Tối đa 8 trang cho một bài viết.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const rawBase64 = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 2048;
        let width = img.width;
        let height = img.height;
        let finalBase64 = rawBase64;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            finalBase64 = canvas.toDataURL(file.type || "image/jpeg", 0.92);
          }
        }

        const newPageNumber = imagePages.length + 1;
        setImagePages((prev) => [
          ...prev,
          {
            base64Data: finalBase64,
            mimeType: file.type || "image/jpeg",
            fileName: file.name,
            pageNumber: newPageNumber,
          },
        ]);
        setActiveImagePageIndex(newPageNumber - 1);
        showNotice(`Đã thêm Trang ${newPageNumber}: ${file.name}`, "success");
      };
      img.onerror = () => {
        const newPageNumber = imagePages.length + 1;
        setImagePages((prev) => [
          ...prev,
          {
            base64Data: rawBase64,
            mimeType: file.type || "image/jpeg",
            fileName: file.name,
            pageNumber: newPageNumber,
          },
        ]);
        setActiveImagePageIndex(newPageNumber - 1);
      };
      img.src = rawBase64;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Xóa trang ảnh
  const handleRemovePage = (index: number) => {
    if (imagePages.length <= 1) {
      setImagePages([]);
      setSelectedFile(null);
      setFileName("");
      setFileBase64("");
      return;
    }
    setImagePages((prev) =>
      prev
        .filter((_, idx) => idx !== index)
        .map((p, idx) => ({ ...p, pageNumber: idx + 1 }))
    );
    if (activeImagePageIndex >= index && activeImagePageIndex > 0) {
      setActiveImagePageIndex(activeImagePageIndex - 1);
    }
    showNotice(`Đã xóa trang ${index + 1}`, "info");
  };

  // Nạp bài mẫu chuẩn sư phạm theo đúng thể loại đã chọn
  const handleLoadSampleForGenre = (g: PromptGenre) => {
    setSelectedGenre(g);
    const rubric = GENRE_RUBRICS_MAP[g];
    setLevel(rubric.defaultLevel);

    let sampleTitle = "";
    let sampleContent = "";

    switch (g) {
      case "thuat-lai-su-viec":
        sampleTitle = "Kể lại một buổi lao động trồng cây xanh tại trường em";
        sampleContent = `Sáng chủ nhật tuần trước, trường em tổ chức buổi lao động trồng cây xanh chào mừng ngày Nhà giáo Việt Nam. Đúng bảy giờ sáng, chúng em đã có mặt đông đủ tại sân trường với xẻng nhỏ, bình tưới và găng tay. Dưới sự hướng dẫn của thầy cô, các bạn nam đào hố, còn các bạn nữ cẩn thận đặt bầu cây non xuống và lấp đất tơi xốp. Sau hai giờ đồng hồ hăng say, một hàng cây non xanh mướt đã thẳng tắp dọc lối đi. Em cảm thấy rất vui và tự hào vì đã góp một phần nhỏ bé làm cho ngôi trường thêm xanh, sạch, đẹp.`;
        break;
      case "mieu-ta-con-vat":
        sampleTitle = "Tả chú mèo mướp đáng yêu nuôi trong nhà em";
        sampleContent = `Nhà em có nuôi một chú mèo mướp rất đáng yêu tên là Miu Miu. Toàn thân chú khoác lên chiếc áo lông màu vàng cam xen lẫn những vệt vằn nâu sẫm mượt mà như nhung. Đôi mắt Miu Miu tròn xoe, trong veo và xanh biếc như hai hòn bi ve, ban đêm phát sáng lấp lánh để rình bắt chuột. Bốn chân chú bước đi êm ru nhờ có đệm thịt dày dưới bàn chân. Mỗi khi em đi học về, Miu Miu lại chạy ùa ra cửa, cọ đầu vào chân em và cất tiếng kêu "meo meo" ngọt ngào như lời chào mừng thân thiết.`;
        break;
      case "doan-van-neu-y-kien":
        sampleTitle = "Nêu cảm nghĩ về nhân vật cậu bé trong câu chuyện Người ăn xin";
        sampleContent = `Trong câu chuyện "Người ăn xin", nhân vật cậu bé đã để lại cho em niềm xúc động sâu sắc nhất bởi tấm lòng nhân ái chân thành. Trước một ông lão ăn xin nghèo khổ, run rẩy trong cơn gió rét, dù không có một đồng xu nào trong túi, cậu bé vẫn không quay đi mà nắm chặt lấy bàn tay sần sùi của ông và nói lời xin lỗi từ tận đáy lòng. Chi tiết ấy đã chạm đến trái tim em, giúp em hiểu rằng tình yêu thương, sự cảm thông và tôn trọng con người còn quý giá hơn mọi của cải vật chất trên đời.`;
        break;
      case "doan-van-tinh-cam":
        sampleTitle = "Tình cảm, cảm xúc của em đối với người mẹ kính yêu";
        sampleContent = `Trong gia đình, người mà em yêu quý và kính trọng nhất chính là mẹ của em. Mẹ em là một cô giáo mầm non hiền hậu, luôn dành trọn tình yêu thương cho học trò và chăm sóc gia đình chu đáo. Em nhớ nhất đôi bàn tay mẹ, những ngón tay thon thả đã in hằn những vết chai nhỏ vì bao năm tháng vất vả sớm khuya vì chúng em. Mỗi tối khi em học bài, mẹ luôn ngồi bên cạnh động viên em bằng ánh mắt ấm áp như nắng sớm ban mai. Em tự hứa sẽ luôn chăm ngoan, học giỏi để mẹ mãi nở nụ cười rạng rỡ trên môi.`;
        break;
      case "tuong-tuong":
        sampleTitle = "Trò chuyện cùng chiếc cặp sách vào một đêm trăng";
        sampleContent = `Một đêm nọ, khi kim đồng hồ điểm mười hai giờ đêm, em bỗng nghe thấy tiếng xì xào khe khẽ phát ra từ góc bàn học. Em rón rén bước lại gần thì kinh ngạc phát hiện chiếc cặp sách màu xanh đang trò chuyện cùng bạn bút chì và thước kẻ. Chiếc cặp thở dài tâm sự: "Hôm nay bạn Nam đã cùng tớ vượt qua một ngày học thật vui, mang về điểm mười môn Toán rực rỡ!". Nghe các bạn đồ dùng trò chuyện, em xúc động vô cùng và thầm nhủ ngày mai sẽ lau chùi cặp sách thật sạch sẽ và sắp xếp bút thước ngay ngắn mỗi ngày.`;
        break;
      case "huong-dan-cong-viec":
        sampleTitle = "Hướng dẫn các bước gấp một chú ếch bằng giấy màu";
        sampleContent = `Hôm nay, em xin hướng dẫn các bạn các bước gấp một chú ếch bằng giấy màu rất đơn giản và ngộ nghĩnh. Đầu tiên, chúng ta cần chuẩn bị một tờ giấy thủ công hình vuông có màu xanh lá cây và một chiếc bút chì đen. Bước một: gấp đôi tờ giấy theo đường chéo để tạo nếp gấp hình tam giác. Bước hai: miết thật phẳng các cạnh rồi gấp hai góc nhọn vào giữa tạo thành thân ếch. Bước ba: gấp ngược hai mép dưới lên để tạo thành hai chiếc chân sau có thể bật nhảy. Cuối cùng, dùng bút chì vẽ thêm hai mắt tròn xoe lên đầu chú ếch là hoàn thành sản phẩm.`;
        break;
      case "viet-don":
        sampleTitle = "Đơn xin nghỉ học do bị ốm gửi cô giáo chủ nhiệm";
        sampleContent = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nHà Nội, ngày 14 tháng 10 năm 2026\n\nĐƠN XIN NGHỈ HỌC\n\nKính gửi: Cô giáo chủ nhiệm lớp 4A1 - Trường Tiểu học Chu Văn An\n\nEm tên là: Nguyễn Minh An\nSinh ngày: 15/05/2016\nHọc sinh lớp: 4A1, Trường Tiểu học Chu Văn An\n\nEm làm đơn này xin phép cô cho em được nghỉ học một ngày, thứ Tư ngày 15 tháng 10 năm 2026.\nLí do: Hôm qua em bị cảm sốt, bác sĩ dặn cần nghỉ ngơi tĩnh dưỡng một ngày để hồi phục sức khỏe.\n\nEm xin hứa sẽ chép bài và làm bài tập đầy đủ khi đi học trở lại.\n\nEm xin chân thành cảm ơn cô!\n\nÝ kiến của phụ huynh                       Học sinh làm đơn\n  (Đã ký)                                Nguyễn Minh An`;
        break;
      case "mieu-ta-cay-coi":
      default:
        sampleTitle = "Tả một cây bóng mát trên sân trường em";
        sampleContent = `Trường tiểu học Kim Đồng của em có một cây phượng vĩ rất to đứng sừng sững bên cạnh cột cờ giữa sân trường. Em không biết bác phượng đã ở đây bao nhiêu năm rồi, chỉ biết từ ngày em mới bước vào lớp một thì bác đã đứng đó dang rộng vòng tay che chở cho chúng em.

Nhìn từ xa, cây phượng như một chiếc ô khổng lồ màu xanh mướt, đến mùa hè thì rực cháy như một ngọn lửa khổng lồ. Thân cây to chừng hai người ôm không xuể, lớp vỏ màu nâu sẫm xù xì in hằn những vết tích của thời gian. Những chiếc rễ lớn trồi lên khỏi mặt đất như những chú trăn khổng lồ đang uốn lượn bò quanh gốc. Từ thân cây đâm ra nhiều cành lớn tỏa bóng sum suê. Lá phượng nhỏ li ti như lá me non, xếp đều tăm tắp hai bên cuống lá. Vào mùa hè, hoa phượng nở đỏ rực cả một góc trời, từng chùm hoa đỏ thắm rung rinh trong gió như chào đón mùa thi và tiếng ve ngân rộn rã.

Em rất yêu quý cây phượng vĩ trường em. Mỗi giờ ra chơi, chúng em lại tụ tập dưới bóng râm mát của cây để đọc sách và chơi đùa. Mai này dù có lớn lên và học ở ngôi trường mới, hình bóng cây phượng vĩ thân thương vẫn mãi đọng sâu trong tâm trí em.`;
        break;
    }

    setAssignmentTitle(sampleTitle);
    setFileName(`Bai_Mau_${g}.docx`);
    setFileSize(sampleContent.length * 2);
    setOriginalScannedText(sampleContent);
    setExtractedRawText(sampleContent);
    setConfirmedText(sampleContent);
    setIsConfirmed(false);
    showNotice(`Đã nạp bài văn mẫu thể loại: ${rubric.genreLabel}!`, "success");
  };

  // Nạp bài văn mẫu DOCX (tương thích nút cũ)
  const handleLoadSampleDocx = () => {
    handleLoadSampleForGenre(selectedGenre);
  };

  // --------------------------------------------------------------------------
  // BƯỚC 2: TRÍCH XUẤT VĂN BẢN (DOCX HOẶC OCR VỚI NGỮ CẢNH THỂ LOẠI)
  // --------------------------------------------------------------------------
  const handleStartExtraction = async () => {
    if (!fileName) {
      setErrorMessage("Em hãy chọn tệp Word (.docx) hoặc ảnh bài viết trước nhé!");
      return;
    }

    setIsExtracting(true);
    setCurrentStep(2);
    setExtractionProgress(25);
    setExtractionStatusText(`Đang phân tích cấu trúc tệp theo thể loại "${GENRE_RUBRICS_MAP[selectedGenre]?.genreLabel || "Tập làm văn lớp 4"}"...`);
    setErrorMessage(null);

    try {
      if (selectedFileType === "docx") {
        setExtractionProgress(50);
        setExtractionStatusText("Đang đọc tệp Word (.docx), trích xuất tiêu đề và các đoạn văn...");

        // Nếu là tệp mẫu được tạo trong bộ nhớ hoặc tệp thật
        if (extractedRawText && !selectedFile) {
          setOriginalScannedText(extractedRawText);
        } else {
          // Gọi API phía server
          try {
            const res = await api.uploadScanDocx({
              base64File: fileBase64,
              fileName: fileName,
            });
            const cleanText = autoRepairVietnameseText(res.text || "");
            setOriginalScannedText(cleanText);
            setExtractedRawText(cleanText);
            setConfirmedText(cleanText);
            setExtractionWarnings(res.warnings || []);
          } catch (apiErr: any) {
            if (extractedRawText) {
              const cleanText = autoRepairVietnameseText(extractedRawText);
              setOriginalScannedText(cleanText);
              setConfirmedText(cleanText);
            } else {
              throw apiErr;
            }
          }
        }
      } else {
        // Nhận dạng OCR ảnh với ngữ cảnh Thể loại & Đề bài
        setExtractionProgress(50);
        setExtractionStatusText(`AI Vision đang nhận dạng chữ viết tay tiếng Việt theo dạng bài "${GENRE_RUBRICS_MAP[selectedGenre]?.genreLabel}"...`);

        const res = await api.uploadScanImages({
          pages: imagePages,
          assignmentTitle: assignmentTitle,
          genre: selectedGenre,
          genreLabel: GENRE_RUBRICS_MAP[selectedGenre]?.genreLabel || "Tập làm văn lớp 4",
          level: level,
          promptContext: assignmentPrompt,
        });

        const cleanText = autoRepairVietnameseText(res.extractedText || "");
        setOriginalScannedText(cleanText);
        setExtractedRawText(cleanText);
        setConfirmedText(cleanText);
        setQualityWarnings(res.qualityWarnings || []);
        setLowConfidenceItems(res.lowConfidenceItems || []);
      }

      setExtractionProgress(90);
      setExtractionStatusText("Chuẩn hóa văn bản tiếng Việt và dấu câu hoàn tất!");

      setTimeout(() => {
        setIsExtracting(false);
        setExtractionProgress(100);
        setCurrentStep(3); // Chuyển sang Bước 3: Xem trước & Xác nhận văn bản
        showNotice("Trích xuất văn bản thành công! Em hãy kiểm tra đối chiếu và xác nhận nhé.", "success");
      }, 600);
    } catch (err: any) {
      setIsExtracting(false);
      setErrorMessage(err.message || "Có lỗi khi trích xuất nội dung tệp. Vui lòng thử lại!");
      setCurrentStep(1);
    }
  };

  // --------------------------------------------------------------------------
  // BƯỚC 3: XÁC NHẬN VĂN BẢN
  // --------------------------------------------------------------------------
  const handleConfirmText = async () => {
    if (!confirmedText.trim()) {
      showNotice("Văn bản bài viết không được để trống.", "error");
      return;
    }

    setIsConfirmed(true);

    // Lưu bản ghi scan lên server
    const scanId = currentScanId || "scan-" + Date.now();
    setCurrentScanId(scanId);

    try {
      await api.saveScanRecord({
        id: scanId,
        fileType: selectedFileType,
        fileName: fileName,
        fileSize: fileSize,
        pageCount: selectedFileType === "image" ? imagePages.length : 1,
        uploadedBy: currentUser.id,
        uploaderRole: currentUser.role,
        uploaderName: currentUser.name,
        studentId: selectedStudentId,
        studentName: selectedStudentName,
        classId: currentUser.role === "teacher" ? selectedClassId : (currentUser.classId || "class-4a1"),
        assignmentId: selectedAssignmentId || undefined,
        assignmentTitle: assignmentTitle,
        genre: selectedGenre,
        genreLabel: GENRE_RUBRICS_MAP[selectedGenre]?.genreLabel,
        level: level,
        extractedRawText: extractedRawText,
        confirmedText: confirmedText,
        isConfirmed: true,
        confirmedAt: new Date().toISOString(),
        qualityWarnings: qualityWarnings,
        lowConfidenceItems: lowConfidenceItems,
        pageImages: selectedFileType === "image" ? imagePages.map((p) => ({
          pageNumber: p.pageNumber,
          dataUrl: p.base64Data,
          fileName: p.fileName,
          fileSize: Math.round(p.base64Data.length * 0.75),
        })) : undefined,
        status: "confirmed",
      });
      showNotice("✨ Em đã xác nhận nội dung bài viết thành công! Giờ có thể bắt đầu đánh giá Rubric.", "success");
    } catch (err: any) {
      console.warn("Save scan record warning:", err);
    }
  };

  // --------------------------------------------------------------------------
  // BƯỚC 4: BẮT ĐẦU ĐÁNH GIÁ RUBRIC CHUYÊN BIỆT THEO THỂ LOẠI
  // --------------------------------------------------------------------------
  const handleStartRubricEvaluation = async () => {
    if (!isConfirmed) {
      showNotice("Em vui lòng bấm 'Xác nhận văn bản' trước khi yêu cầu đánh giá nhé!", "error");
      return;
    }

    if (!confirmedText.trim()) {
      showNotice("Chưa có văn bản hợp lệ để đánh giá.", "error");
      return;
    }

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      const scanId = currentScanId || "scan-" + Date.now();
      setCurrentScanId(scanId);

      const res = await api.evaluateScanRecord(scanId, {
        confirmedText: confirmedText,
        studentName: selectedStudentName,
        assignmentTitle: assignmentTitle,
        level: level,
        genre: selectedGenre,
        genreLabel: GENRE_RUBRICS_MAP[selectedGenre]?.genreLabel,
        promptContext: assignmentPrompt,
        role: currentUser.role,
        userId: currentUser.id,
      });

      setEvaluation(res.evaluation);
      setCurrentStep(4);
      showNotice(`Đánh giá Rubric hoàn tất cho thể loại "${GENRE_RUBRICS_MAP[selectedGenre]?.genreLabel}"!`, "success");
    } catch (err: any) {
      setErrorMessage(err.message || "Có lỗi khi đánh giá Rubric. Em hãy thử lại nhé!");
    } finally {
      setIsEvaluating(false);
    }
  };

  // --------------------------------------------------------------------------
  // XUẤT VĂN BẢN SANG WORD (.DOC) VÀ TEXT (.TXT) CHUẨN FONT TIẾNG VIỆT
  // --------------------------------------------------------------------------
  const handleDownloadWordDoc = () => {
    const textToExport = confirmedText || extractedRawText || "";
    if (!textToExport.trim()) {
      showNotice("Chưa có nội dung bài viết để tải về.", "info");
      return;
    }
    const studentName = selectedStudentName || currentUser.name || "Học sinh";
    const promptTitle = assignmentTitle || "Bài làm Tiếng Việt Lớp 4";
    const genreTitle = GENRE_RUBRICS_MAP[selectedGenre]?.genreLabel || "Tập làm văn lớp 4";

    exportToWordDoc({
      title: promptTitle,
      author: studentName,
      grade: "Lớp 4",
      school: "Trường Tiểu học Chu Văn An",
      content: textToExport,
      genreLabel: genreTitle,
      rubricEvaluation: evaluation
        ? {
            overallScore: evaluation.criteria && evaluation.criteria.length > 0
              ? Number(
                  (
                    evaluation.criteria.reduce((sum, c) => sum + c.score, 0) /
                    evaluation.criteria.length
                  ).toFixed(1)
                )
              : 4.5,
            overallLevel: evaluation.criteria?.[0]?.suggested_level || 3,
            overallComment: evaluation.overall_feedback,
            teacherApprovedBy: evaluation.teacherApprovedBy,
            teacherOfficialComment: evaluation.teacherOfficialComment,
          }
        : undefined,
      fileName: `Bai_Lam_${studentName}_${promptTitle}`,
    });
    showNotice("Đã tải tệp Word (.doc) với bộ font Tiếng Việt chuẩn 100%!", "success");
  };

  const handleDownloadTextFile = () => {
    const textToExport = confirmedText || extractedRawText || "";
    if (!textToExport.trim()) {
      showNotice("Chưa có nội dung bài viết để tải về.", "info");
      return;
    }
    const studentName = selectedStudentName || currentUser.name || "Học sinh";
    const promptTitle = assignmentTitle || "Bài làm Tiếng Việt Lớp 4";

    exportToTextFile({
      title: promptTitle,
      author: studentName,
      content: textToExport,
      notes: evaluation?.overall_feedback || (evaluation?.teacherOfficialComment ? `Lời dặn của cô: ${evaluation.teacherOfficialComment}` : undefined),
      fileName: `Bai_Lam_${studentName}_${promptTitle}`,
    });
    showNotice("Đã tải tệp Text (.txt chuẩn UTF-8) thành công!", "success");
  };

  // --------------------------------------------------------------------------
  // NÚT TỰ SỬA BÀI -> CHUYỂN SANG TRÌNH SOẠN THẢO LUYỆN VIẾT
  // --------------------------------------------------------------------------
  const handleSelfReviseInEditor = async () => {
    if (!confirmedText.trim()) return;
    try {
      if (currentScanId) {
        await api.convertScanToStudio(currentScanId);
      }
    } catch (e) {
      console.warn("Convert to studio sync:", e);
    }
    onNavigateToWriting(confirmedText, assignmentTitle, level);
  };

  // --------------------------------------------------------------------------
  // GIÁO VIÊN PHÊ DUYỆT & ĐIỀU CHỈNH ĐÁNH GIÁ
  // --------------------------------------------------------------------------
  const handleApproveTeacherReview = async () => {
    if (!currentScanId || !evaluation) return;
    setIsSavingTeacherReview(true);

    try {
      await api.approveScanEvaluation(currentScanId, {
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        officialComment: teacherOfficialComment,
        adjustedScores: teacherAdjustedScores,
      });

      setEvaluation((prev) =>
        prev
          ? {
              ...prev,
              teacherApproved: true,
              teacherApprovedAt: new Date().toISOString(),
              teacherApprovedBy: currentUser.name,
              teacherOfficialComment: teacherOfficialComment,
              teacherAdjustedScores: teacherAdjustedScores,
            }
          : null
      );

      setShowTeacherModal(false);
      showNotice("✅ Thầy/Cô đã phê duyệt kết quả đánh giá cho học sinh thành công!", "success");
    } catch (err: any) {
      showNotice(err.message || "Lỗi lưu phê duyệt của giáo viên.", "error");
    } finally {
      setIsSavingTeacherReview(false);
    }
  };

  // Xem lại một bài từ lịch sử
  const handleViewHistoricalRecord = (record: UploadedScanRecord) => {
    setSelectedFileType(record.fileType);
    setFileName(record.fileName);
    setFileSize(record.fileSize);
    setAssignmentTitle(record.assignmentTitle);
    setLevel(record.level);
    setSelectedStudentId(record.studentId);
    setSelectedStudentName(record.studentName);
    setSelectedClassId(record.classId);
    if (record.assignmentId) setSelectedAssignmentId(record.assignmentId);
    setOriginalScannedText(record.extractedRawText);
    setExtractedRawText(record.extractedRawText);
    setConfirmedText(record.confirmedText);
    setIsConfirmed(record.isConfirmed);
    setCurrentScanId(record.id);
    if (record.evaluation) {
      setEvaluation(record.evaluation);
      setCurrentStep(4);
    } else {
      setCurrentStep(3);
    }
    setActiveTab("upload");
    showNotice(`Đã mở bài scan: ${record.fileName}`, "info");
  };

  // Format Helper
  const getLevelBadge = (lvl: number) => {
    switch (lvl) {
      case 4:
        return { label: "Mức 4: Vận dụng tốt", color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
      case 3:
        return { label: "Mức 3: Đạt yêu cầu", color: "bg-blue-100 text-blue-800 border-blue-300" };
      case 2:
        return { label: "Mức 2: Đang hình thành", color: "bg-amber-100 text-amber-800 border-amber-300" };
      default:
        return { label: "Mức 1: Cần hỗ trợ", color: "bg-rose-100 text-rose-800 border-rose-300" };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Toast Notification */}
      {notice && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-sm font-bold flex items-center gap-2.5 transition-all transform animate-bounce ${
            notice.type === "success"
              ? "bg-emerald-600 text-white border-emerald-500"
              : notice.type === "error"
              ? "bg-rose-600 text-white border-rose-500"
              : "bg-slate-900 text-white border-slate-700"
          }`}
        >
          {notice.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-200" /> : <AlertTriangle className="w-5 h-5 text-amber-200" />}
          <span>{notice.message}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-linear-to-r from-teal-700 via-emerald-700 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <FileText className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-emerald-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                Phân hệ AI Scan & Rubric
              </span>
              <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-lg text-xs font-semibold backdrop-blur-xs">
                {currentUser.role === "teacher" ? "Dành cho Giáo viên chấm bài" : "Học sinh lớp 4"}
              </span>
              <span className="bg-emerald-900/60 text-emerald-200 text-xs px-2 py-0.5 rounded-md font-medium border border-emerald-500/30">
                Word .docx & Ảnh chữ viết tay
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {currentUser.role === "teacher"
                ? "AI SCAN & RUBRIC – CHẤM BÀI HỌC SINH"
                : "AI SCAN & RUBRIC – TẢI BÀI VIẾT CỦA EM"}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl font-medium leading-relaxed">
              Tải bài viết từ tệp Word hoặc chụp ảnh chữ viết tay. Hệ thống trích xuất nội dung, cho phép em kiểm tra
              và sửa lỗi nhận dạng, sau đó đánh giá theo Rubric 6 tiêu chí chuẩn Bộ GD&ĐT kèm hướng dẫn tự sửa bài.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === "upload"
                  ? "bg-white text-emerald-800 shadow-md scale-102"
                  : "bg-emerald-800/60 hover:bg-emerald-800 text-white"
              }`}
            >
              <Upload className="w-4 h-4" /> Tải bài mới
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === "history"
                  ? "bg-white text-emerald-800 shadow-md scale-102"
                  : "bg-emerald-800/60 hover:bg-emerald-800 text-white"
              }`}
            >
              <History className="w-4 h-4" /> Lịch sử bài scan
            </button>
          </div>
        </div>
      </div>

      {/* View Mode: History list */}
      {activeTab === "history" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-800">Lịch Sử Các Bài Viết Đã Scan & Đánh Giá</h2>
              <p className="text-xs text-slate-500">
                {currentUser.role === "teacher"
                  ? "Danh sách bài làm của học sinh thuộc các lớp Thầy/Cô phụ trách."
                  : "Các bài viết của chính em đã được tải lên và đánh giá Rubric."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={api.getScanExportCsvUrl({
                  userId: currentUser.id,
                  role: currentUser.role,
                  classId: currentUser.role === "teacher" ? selectedClassId : (currentUser.classId || "class-4a1"),
                })}
                download
                className="px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Tải báo cáo kết quả đánh giá Rubric dạng CSV (chuẩn tiếng Việt Excel)"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                Xuất báo cáo (CSV)
              </a>
              <button
                onClick={loadHistory}
                disabled={isLoadingHistory}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingHistory ? "animate-spin" : ""}`} />
                Làm mới
              </button>
            </div>
          </div>

          {isLoadingHistory ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
              <p className="text-xs font-semibold">Đang tải danh sách bài scan...</p>
            </div>
          ) : historyRecords.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                📂
              </div>
              <h3 className="font-bold text-slate-700">Chưa có bài scan nào được lưu</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Em hoặc Thầy/Cô hãy tải bài viết đầu tiên từ tệp Word (.docx) hoặc ảnh chữ viết tay để trải nghiệm nhé!
              </p>
              <button
                onClick={() => setActiveTab("upload")}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Tải bài viết ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {rec.fileType === "docx" ? "Tệp Word" : "Ảnh chụp"}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{rec.studentName}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{rec.assignmentTitle}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(rec.createdAt).toLocaleDateString("vi-VN")} • {rec.fileName}
                      </p>
                    </div>

                    {rec.evaluation?.teacherApproved && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-amber-600" /> Cô đã duyệt
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 bg-white p-2.5 rounded-xl border border-slate-100 italic">
                    "{rec.confirmedText || rec.extractedRawText}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <span className="text-slate-500 font-medium">
                      Trạng thái: <strong className="text-emerald-700">{rec.status}</strong>
                    </span>
                    <button
                      onClick={() => handleViewHistoricalRecord(rec)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View Mode: Upload & Rubric Stepper */}
      {activeTab === "upload" && (
        <div className="space-y-6">
          {/* Stepper Header */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { step: 1, label: "Tải tệp", icon: Upload },
                { step: 2, label: "Trích xuất", icon: RefreshCw },
                { step: 3, label: "Xác nhận văn bản", icon: Edit3 },
                { step: 4, label: "Đánh giá & Tự sửa", icon: Award },
              ].map((s) => {
                const Icon = s.icon;
                const isCurrent = currentStep === s.step;
                const isPast = currentStep > s.step;
                return (
                  <div
                    key={s.step}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${
                      isCurrent
                        ? "bg-emerald-50 text-emerald-800 font-black ring-2 ring-emerald-400"
                        : isPast
                        ? "text-emerald-600 font-bold"
                        : "text-slate-400 font-medium"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                        isCurrent
                          ? "bg-emerald-600 text-white shadow-sm"
                          : isPast
                          ? "bg-emerald-200 text-emerald-900"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isPast ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className="text-[11px] sm:text-xs line-clamp-1">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Lưu ý khi xử lý tệp:</p>
                <p className="text-xs leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* BƯỚC 1: TẢI TỆP WORD (.DOCX) HOẶC ẢNH BÀI VIẾT                   */}
          {/* ================================================================ */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Context Selector: Phân quyền Lớp học, Học sinh & Bài tập */}
              <div className="space-y-4 pb-6 border-b border-slate-100">
                {currentUser.role === "teacher" ? (
                  /* GIAO DIỆN GIÁO VIÊN: Chọn Lớp -> Chọn Học Sinh -> Chọn Bài Tập */
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-teal-50/50 p-4 rounded-2xl border border-teal-100">
                    <div className="md:col-span-3 space-y-1">
                      <label className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-teal-700" />
                        Lớp phụ trách:
                      </label>
                      <select
                        value={selectedClassId}
                        onChange={(e) => {
                          const newCls = e.target.value;
                          setSelectedClassId(newCls);
                          // Cập nhật danh sách học sinh theo lớp mới
                          const stdsInCls = realStudents.filter((s) => s.classId === newCls);
                          if (stdsInCls.length > 0) {
                            setSelectedStudentId(stdsInCls[0].id);
                            setSelectedStudentName(stdsInCls[0].name);
                          }
                          // Cập nhật bài tập nếu có
                          const asgsInCls = realAssignments.filter((a) => a.classId === newCls);
                          if (asgsInCls.length > 0) {
                            setSelectedAssignmentId(asgsInCls[0].id);
                            setAssignmentTitle(asgsInCls[0].title);
                            setLevel(asgsInCls[0].level);
                            setAssignmentPrompt(asgsInCls[0].prompt);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-teal-200 text-xs font-semibold bg-white focus:outline-teal-500"
                      >
                        {realClasses
                          .filter((c) => currentUser.role === "admin" || !currentUser.classId || c.id === currentUser.classId)
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.grade ? `Khối ${c.grade}` : "Lớp 4"})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="md:col-span-4 space-y-1">
                      <label className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-teal-700" />
                        Học sinh nộp bài:
                      </label>
                      <select
                        value={selectedStudentId}
                        onChange={(e) => {
                          const sid = e.target.value;
                          setSelectedStudentId(sid);
                          const st = realStudents.find((s) => s.id === sid);
                          if (st) setSelectedStudentName(st.name);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-teal-200 text-xs font-semibold bg-white focus:outline-teal-500"
                      >
                        {realStudents
                          .filter((s) => s.role === "student" && s.classId === selectedClassId)
                          .map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.name} ({st.email})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="md:col-span-5 space-y-1">
                      <label className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                        Gắn với bài tập đã giao:
                      </label>
                      <select
                        value={selectedAssignmentId}
                        onChange={(e) => {
                          const aid = e.target.value;
                          setSelectedAssignmentId(aid);
                          const asg = realAssignments.find((a) => a.id === aid);
                          if (asg) {
                            setAssignmentTitle(asg.title);
                            setLevel(asg.level);
                            setAssignmentPrompt(asg.prompt);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-teal-200 text-xs font-semibold bg-white focus:outline-teal-500"
                      >
                        <option value="">-- Bài tập tự do (Tự nhập đề bài) --</option>
                        {realAssignments
                          .filter((a) => a.classId === selectedClassId)
                          .map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.title} ({a.level === "cau" ? "Luyện câu" : a.level === "doan" ? "Luyện đoạn" : "Bài văn"})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  /* GIAO DIỆN HỌC SINH: Hồ sơ của em + Chọn bài tập được giao */
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                    <div className="md:col-span-4 space-y-1">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                        Học sinh:
                      </span>
                      <p className="text-xs font-black text-slate-800 bg-white px-3 py-2 rounded-xl border border-emerald-200">
                        {currentUser.name} (Lớp {currentUser.classId === "class-4a1" ? "4A1" : currentUser.classId})
                      </p>
                    </div>

                    <div className="md:col-span-8 space-y-1">
                      <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                        Chọn bài tập cô giáo đã giao:
                      </label>
                      <select
                        value={selectedAssignmentId}
                        onChange={(e) => {
                          const aid = e.target.value;
                          setSelectedAssignmentId(aid);
                          const asg = realAssignments.find((a) => a.id === aid);
                          if (asg) {
                            setAssignmentTitle(asg.title);
                            setLevel(asg.level);
                            setAssignmentPrompt(asg.prompt);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs font-semibold bg-white focus:outline-emerald-500"
                      >
                        <option value="">-- Em tự luyện viết tự do (Tự nhập đề) --</option>
                        {realAssignments
                          .filter((a) => a.classId === (currentUser.classId || "class-4a1"))
                          .map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.title} ({a.level === "cau" ? "Luyện câu" : a.level === "doan" ? "Luyện đoạn" : "Luyện bài văn"})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* BỘ CHỌN THỂ LOẠI / DẠNG BÀI TẬP LÀM VĂN LỚP 4 */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      Thể loại / Dạng bài viết (SGK Tiếng Việt 4 Kết nối tri thức):
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRubricPreviewModal(true)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 w-fit shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      Xem 6 tiêu chí Rubric chuyên biệt ({GENRE_RUBRICS_MAP[selectedGenre]?.genreLabel})
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(Object.keys(GENRE_RUBRICS_MAP) as PromptGenre[]).map((gKey) => {
                      const gInfo = GENRE_RUBRICS_MAP[gKey];
                      const isSelected = selectedGenre === gKey;
                      return (
                        <button
                          key={gKey}
                          type="button"
                          onClick={() => {
                            setSelectedGenre(gKey);
                            setLevel(gInfo.defaultLevel);
                          }}
                          className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-2.5 ${
                            isSelected
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-md font-bold scale-102"
                              : "bg-slate-50/70 text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-white"
                          }`}
                        >
                          <span className="text-xl shrink-0">{gInfo.icon}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate leading-tight">{gInfo.genreLabel}</p>
                            <p className={`text-[10px] truncate mt-0.5 ${isSelected ? "text-emerald-100" : "text-slate-500"}`}>
                              {gInfo.defaultLevel === "cau" ? "Luyện câu" : gInfo.defaultLevel === "doan" ? "Luyện đoạn" : "Luyện bài văn"}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dòng nhập tên đề bài & cấp độ */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      Tên đề bài / Yêu cầu viết văn:
                    </label>
                    <input
                      type="text"
                      value={assignmentTitle}
                      onChange={(e) => setAssignmentTitle(e.target.value)}
                      placeholder="Nhập tên đề bài..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden font-medium"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-orange-600" />
                      Cấp độ bài viết:
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as WritingLevel)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden font-medium bg-white"
                    >
                      <option value="cau">Cấp độ 1: Luyện câu (1-2 câu có hình ảnh)</option>
                      <option value="doan">Cấp độ 2: Luyện đoạn văn (4-8 câu)</option>
                      <option value="bai">Cấp độ 3: Luyện bài văn hoàn chỉnh</option>
                    </select>
                  </div>
                </div>

                {/* Hướng dẫn bài tập nếu được chọn */}
                {assignmentPrompt && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <span className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Yêu cầu & Hướng dẫn sư phạm từ giáo viên:
                    </span>
                    <p className="text-slate-700 leading-relaxed italic">{assignmentPrompt}</p>
                  </div>
                )}
              </div>

              {/* Lựa chọn nguồn tệp: 2 Tab rõ ràng */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    Chọn Định Dạng Tải Lên:
                  </h3>
                  <button
                    onClick={() => handleLoadSampleForGenre(selectedGenre)}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 border border-emerald-200 w-fit"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Thử nghiệm ngay với bài mẫu ({GENRE_RUBRICS_MAP[selectedGenre]?.genreLabel})
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFileType("docx");
                      setSelectedFile(null);
                      setFileName("");
                      setExtractedRawText("");
                      setConfirmedText("");
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all text-left flex items-start gap-3.5 ${
                      selectedFileType === "docx"
                        ? "border-emerald-500 bg-emerald-50/60 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedFileType === "docx" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">1. Tệp Word (.docx)</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Hỗ trợ .docx chuẩn, giữ nguyên các đoạn và tiếng Việt có dấu. Tối đa 15MB.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFileType("image");
                      setSelectedFile(null);
                      setFileName("");
                      setExtractedRawText("");
                      setConfirmedText("");
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all text-left flex items-start gap-3.5 ${
                      selectedFileType === "image"
                        ? "border-emerald-500 bg-emerald-50/60 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedFileType === "image" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">2. Ảnh chụp bài viết</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Chụp chữ viết tay trên vở ô ly. Hỗ trợ xoay ảnh 90°, phóng to và tải nhiều trang ảnh.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* TẢI TỆP WORD (.DOCX) HOẶC BỘ ĐIỀU KHIỂN ẢNH CHỤP CHỮ VIẾT TAY */}
              {selectedFileType === "docx" ? (
                /* Drag & Drop Upload Zone cho DOCX */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) {
                      processSelectedFile(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                    fileName
                      ? "border-emerald-400 bg-emerald-50/30"
                      : "border-slate-300 hover:border-emerald-400 hover:bg-slate-50/60"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                  />

                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <Upload className="w-6 h-6" />
                  </div>

                  {fileName ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-emerald-800 flex items-center justify-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        {fileName}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Dung lượng: {Math.round(fileSize / 1024)} KB • Bấm để chọn lại tệp khác
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-800">
                        Kéo thả tệp Word (.docx) vào đây
                      </p>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        hoặc <span className="text-emerald-700 underline font-bold">bấm vào đây để chọn tệp</span> từ máy tính của em.
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Lưu ý: Không dùng tệp .doc cũ. Dung lượng tối đa 15MB.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* GIAO DIỆN TẢI & TIỀN XỬ LÝ ẢNH CHỤP VỞ Ô LY (XOAY 90°, PHÓNG TO, ĐA TRANG) */
                <div className="space-y-4">
                  {imagePages.length === 0 ? (
                    /* Khi chưa có ảnh nào */
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files?.[0]) {
                          processSelectedFile(e.dataTransfer.files[0]);
                        }
                      }}
                      className="border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/20 rounded-3xl p-8 text-center cursor-pointer transition-all"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                      />

                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                        <ImageIcon className="w-6 h-6" />
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-bold text-slate-800">
                          Tải lên hoặc chụp ảnh bài viết tay của em
                        </p>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          Bấm để chọn ảnh từ máy hoặc chụp trực tiếp từ camera điện thoại. Hỗ trợ định dạng JPG, PNG, WebP.
                        </p>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-amber-800 text-[11px] font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          Hệ thống hỗ trợ xoay ảnh 90° nếu chụp nằm ngang và phóng to đối chiếu
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Khi đã có ảnh: Hiển thị bộ sưu tập các trang với công cụ Xoay 90°, Phóng to, Thêm trang */
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            Danh sách trang ảnh đã tải ({imagePages.length} trang):
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Tổng dung lượng: {Math.round(fileSize / 1024)} KB
                          </span>
                        </div>

                        {/* Nút thêm trang tiếp theo */}
                        <div className="flex items-center gap-2">
                          <label className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                            <PlusCircle className="w-3.5 h-3.5" />
                            Thêm trang tiếp theo
                            <input
                              type="file"
                              onChange={handleAddImagePage}
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Lưới các trang ảnh */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {imagePages.map((page, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-300 shadow-sm space-y-2.5 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black">
                                Trang {page.pageNumber}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleRotateImage(idx, "cw")}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                                  title="Xoay ảnh 90° theo chiều kim đồng hồ"
                                >
                                  <RotateCw className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setZoomedImage(page.base64Data)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors"
                                  title="Phóng to ảnh để kiểm tra"
                                >
                                  <Maximize2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePage(idx)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors"
                                  title="Xóa trang ảnh này"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Vùng xem trước ảnh */}
                            <div
                              onClick={() => setZoomedImage(page.base64Data)}
                              className="w-full h-52 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer border border-slate-200 relative group"
                            >
                              <img
                                src={page.base64Data}
                                alt={`Trang ${page.pageNumber}`}
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                <ZoomIn className="w-4 h-4" /> Bấm để phóng to
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-500 truncate text-center font-medium">
                              {page.fileName}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Hướng dẫn chụp ảnh chuẩn sư phạm */}
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="font-bold">Mẹo để AI nhận dạng chữ viết tay đạt độ chính xác 100%:</p>
                          <p className="text-[11px] text-amber-800 leading-relaxed">
                            - Nếu ảnh chụp bằng điện thoại bị nằm ngang hoặc ngược, em hãy bấm nút <strong>Xoay 90°</strong> để ảnh thẳng đứng theo chiều đọc tự nhiên của trang vở.<br />
                            - Chụp ảnh đủ sáng, chụp thẳng góc với trang vở ô ly để các dấu thanh tiếng Việt (hỏi, ngã, sắc, nặng) hiện rõ nét.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                >
                  Quay lại Trang chủ
                </button>

                <button
                  type="button"
                  disabled={selectedFileType === "docx" ? !fileName : imagePages.length === 0}
                  onClick={handleStartExtraction}
                  className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
                    (selectedFileType === "docx" ? fileName : imagePages.length > 0)
                      ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:scale-102 hover:shadow-emerald-500/25 cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  Tiến hành trích xuất nội dung ({GENRE_RUBRICS_MAP[selectedGenre]?.genreLabel})
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* BƯỚC 2: TIẾN TRÌNH TRÍCH XUẤT VĂN BẢN                            */}
          {/* ================================================================ */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse">
                <RefreshCw className="w-10 h-10 animate-spin" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-black text-slate-900">Đang Trích Xuất Bài Viết...</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{extractionStatusText}</p>
              </div>

              <div className="max-w-md mx-auto space-y-1.5">
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-linear-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                    style={{ width: `${extractionProgress}%` }}
                  />
                </div>
                <p className="text-[11px] font-bold text-emerald-700 text-right">{extractionProgress}%</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 max-w-md mx-auto text-xs text-amber-800 text-left space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Quy tắc sư phạm EduNova:
                </p>
                <p className="text-[11px] leading-relaxed text-amber-700">
                  Sau khi trích xuất, em sẽ được xem lại toàn bộ văn bản và tự tay chỉnh sửa những chỗ nhận dạng chưa
                  chuẩn trước khi yêu cầu AI chấm Rubric.
                </p>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* BƯỚC 3: XEM TRƯỚC & XÁC NHẬN VĂN BẢN (BẮT BUỘC TRƯỚC KHI CHẤM)   */}
          {/* ================================================================ */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                      Bước 3: Xem trước & Xác nhận
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{fileName}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">Kiểm Tra & Chỉnh Sửa Văn Bản Nhận Dạng</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">
                    Độ dài: <strong className="text-emerald-700">{confirmedText.split(/\s+/).filter(Boolean).length}</strong> từ
                  </span>
                </div>
              </div>

              {/* Quality Warnings (nếu ảnh có góc nghiêng, mờ) */}
              {qualityWarnings.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Lưu ý về chất lượng ảnh chụp:</span>
                  </div>
                  <ul className="text-xs list-disc list-inside space-y-1 text-amber-900">
                    {qualityWarnings.map((w, idx) => (
                      <li key={idx}>{w.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Low confidence items list */}
              {lowConfidenceItems.length > 0 && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span>Các từ cần kiểm tra lại (độ tin cậy thấp do chữ viết tay):</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lowConfidenceItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white border border-blue-200 px-2.5 py-1 rounded-lg text-slate-800"
                      >
                        Nghi vấn: <strong className="text-rose-600">"{item.wordOrPhrase}"</strong> ({item.reason})
                        {item.suggestion && (
                          <span className="text-emerald-600 ml-1">→ gợi ý: "{item.suggestion}"</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Toolbar điều khiển chế độ xem (Song song đối chiếu ảnh & văn bản hoặc Toàn màn hình) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                    Chế độ kiểm tra & sửa văn bản:
                  </span>
                  {selectedFileType === "image" && imagePages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowSideBySide(!showSideBySide)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        showSideBySide
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Columns className="w-3.5 h-3.5" />
                      {showSideBySide ? "Đang bật: Xem song song (Ảnh & Chữ)" : "Bật xem song song đối chiếu"}
                    </button>
                  )}
                </div>

                {/* Công cụ tiện ích: Sửa lỗi font Unicode, Chuẩn hóa câu, Tải về máy */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirmedText) return;
                      const repaired = autoRepairVietnameseText(confirmedText);
                      setConfirmedText(repaired);
                      setIsConfirmed(false);
                      showNotice("✅ Đã sửa lỗi font và chuyển đổi toàn bộ sang Unicode NFC chuẩn!", "success");
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                    title="Tự động phát hiện và sửa lỗi font tiếng Việt (TCVN3, VNI, UTF-8 lỗi dấu) sang Unicode chuẩn"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Sửa lỗi font Unicode
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!confirmedText) return;
                      exportToWordDoc({
                        title: assignmentTitle,
                        author: selectedStudentName,
                        content: confirmedText,
                        genreLabel: GENRE_RUBRICS_MAP[selectedGenre]?.genreLabel,
                      });
                      showNotice("Đã tải bài viết về máy định dạng Word (.doc chuẩn UTF-8)!", "success");
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold transition-colors flex items-center gap-1"
                    title="Tải bài viết về máy tệp Word chuẩn font tiếng Việt"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    Tải Word (.doc)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!confirmedText) return;
                      // Chuẩn hóa: Viết hoa chữ cái đầu sau dấu chấm, chấm than, hỏi; xóa khoảng trắng thừa
                      let cleaned = confirmedText.replace(/\s+/g, " ").trim();
                      cleaned = cleaned.replace(/(^|[.?!]\s+)([a-zà-ỹ])/g, (_, p1, p2) => p1 + p2.toUpperCase());
                      setConfirmedText(cleaned);
                      setIsConfirmed(false);
                      showNotice("Đã chuẩn hóa viết hoa đầu câu và khoảng trắng!", "success");
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
                    title="Tự động viết hoa đầu câu và sửa khoảng cách"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Chuẩn hóa câu
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (originalScannedText) {
                        setConfirmedText(originalScannedText);
                        setIsConfirmed(false);
                        showNotice("Đã khôi phục lại nguyên bản nhận dạng!", "info");
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
                    title="Khôi phục lại nội dung ban đầu máy nhận dạng"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                    Khôi phục bản gốc
                  </button>
                </div>
              </div>

              {/* KHU VỰC HIỂN THỊ: CHẾ ĐỘ XEM SONG SONG (SIDE-BY-SIDE) HOẶC ĐƠN LẺ */}
              {selectedFileType === "image" && imagePages.length > 0 && showSideBySide ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                  {/* CỘT TRÁI: ẢNH CHỤP VỞ Ô LY CÓ BỘ ĐIỀU KHIỂN & ĐỔI TRANG */}
                  <div className="md:col-span-6 bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-3 flex flex-col">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-black text-slate-800">
                          Ảnh gốc bài viết tay:
                        </span>
                        {imagePages.length > 1 && (
                          <div className="flex items-center gap-1">
                            {imagePages.map((_, pIdx) => (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => setActiveImagePageIndex(pIdx)}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                                  activeImagePageIndex === pIdx
                                    ? "bg-emerald-600 text-white"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                T{pIdx + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleRotateImage(activeImagePageIndex, "cw")}
                          className="px-2 py-1 rounded-lg bg-white hover:bg-emerald-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1"
                          title="Xoay ảnh 90° nếu chụp nằm ngang"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          Xoay 90°
                        </button>

                        <button
                          type="button"
                          onClick={() => setZoomedImage(imagePages[activeImagePageIndex]?.base64Data)}
                          className="px-2 py-1 rounded-lg bg-white hover:bg-blue-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1"
                          title="Phóng to ảnh toàn màn hình để soi nét chữ"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          Soi nét chữ
                        </button>
                      </div>
                    </div>

                    {/* Vùng xem ảnh cuộn mượt mà */}
                    <div
                      onClick={() => setZoomedImage(imagePages[activeImagePageIndex]?.base64Data)}
                      className="flex-1 min-h-[420px] max-h-[560px] bg-white rounded-xl overflow-auto border border-slate-200 flex items-center justify-center p-2 cursor-zoom-in group relative"
                    >
                      <img
                        src={imagePages[activeImagePageIndex]?.base64Data}
                        alt={`Trang ${activeImagePageIndex + 1}`}
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pointer-events-none">
                        <ZoomIn className="w-3 h-3" /> Bấm để phóng to đối chiếu
                      </div>
                    </div>
                  </div>

                  {/* CỘT PHẢI: TRÌNH SOẠN THẢO VĂN BẢN TRÍCH XUẤT */}
                  <div className="md:col-span-6 flex flex-col space-y-2">
                    <div className="flex items-center justify-between text-xs pb-1">
                      <label className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                        Văn bản đã nhận dạng (Gõ sửa trực tiếp):
                      </label>
                      <span className="text-slate-400 text-[11px]">
                        Em hãy đối chiếu với ảnh bên trái
                      </span>
                    </div>

                    <textarea
                      value={confirmedText}
                      onChange={(e) => {
                        setConfirmedText(normalizeVietnameseNFC(e.target.value));
                        setIsConfirmed(false); // Khi gõ sửa, yêu cầu xác nhận lại
                      }}
                      onPaste={() => {
                        // Tự động sửa lỗi font khi dán từ tệp Word hoặc tài liệu cũ
                        setTimeout(() => {
                          setConfirmedText((prev) => autoRepairVietnameseText(prev));
                        }, 50);
                      }}
                      rows={18}
                      className="flex-1 w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-hidden text-sm sm:text-base leading-relaxed text-slate-800 font-sans vietnamese-essay-text bg-slate-50/50 min-h-[420px]"
                      placeholder="Nội dung bài viết nhận dạng sẽ hiển thị ở đây..."
                    />
                  </div>
                </div>
              ) : (
                /* CHẾ ĐỘ XEM ĐƠN LẺ TOÀN CHIỀU RỘNG (DÀNH CHO WORD HOẶC TẮT SONG SONG) */
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                      Văn bản bài viết (Em có thể gõ sửa trực tiếp vào khung này):
                    </label>
                    <span className="text-slate-400 text-[11px]">
                      Học sinh có toàn quyền chỉnh sửa lỗi chính tả hoặc lỗi nhận dạng
                    </span>
                  </div>

                  <textarea
                    value={confirmedText}
                    onChange={(e) => {
                      setConfirmedText(normalizeVietnameseNFC(e.target.value));
                      setIsConfirmed(false); // Khi gõ sửa, yêu cầu xác nhận lại
                    }}
                    onPaste={() => {
                      setTimeout(() => {
                        setConfirmedText((prev) => autoRepairVietnameseText(prev));
                      }, 50);
                    }}
                    rows={14}
                    className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-hidden text-sm sm:text-base leading-relaxed text-slate-800 font-sans vietnamese-essay-text bg-slate-50/50"
                    placeholder="Nội dung bài viết sau khi trích xuất sẽ hiển thị ở đây..."
                  />
                </div>
              )}

              {/* Confirmation Box */}
              <div
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  isConfirmed
                    ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                    : "bg-amber-50/70 border-amber-300 text-amber-900"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                    {isConfirmed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    )}
                    <span>
                      {isConfirmed
                        ? "✨ Nội dung văn bản ĐÃ ĐƯỢC XÁC NHẬN CHÍNH XÁC!"
                        : "⚠️ Em hãy đọc kỹ lại và bấm xác nhận trước khi đánh giá Rubric nhé!"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Hệ thống tuân thủ nguyên tắc không tự ý âm thầm sửa bài của học sinh.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmText}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 ${
                    isConfirmed
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                  }`}
                >
                  {isConfirmed ? (
                    <>
                      <Check className="w-4 h-4" /> Đã xác nhận văn bản
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Bấm xác nhận văn bản
                    </>
                  )}
                </button>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                  >
                    ← Chọn tệp khác
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadWordDoc}
                    className="px-3.5 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Tải văn bản bài làm về máy dạng tệp Word (.doc) chuẩn font tiếng Việt"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    Tải Word (.doc)
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTextFile}
                    className="px-3 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Tải văn bản dạng tệp Text UTF-8"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Tải Text (.txt)
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={!isConfirmed || isEvaluating}
                    onClick={handleStartRubricEvaluation}
                    title={
                      !isConfirmed
                        ? "Em hãy bấm nút 'Bấm xác nhận văn bản' ở trên trước khi đánh giá nhé!"
                        : undefined
                    }
                    className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
                      isConfirmed && !isEvaluating
                        ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:scale-102 hover:shadow-emerald-500/25 cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    {isEvaluating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Đang đánh giá Rubric...
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        Bắt đầu đánh giá Rubric
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* BƯỚC 4: KẾT QUẢ ĐÁNH GIÁ RUBRIC & HƯỚNG DẪN TỰ SỬA BÀI            */}
          {/* ================================================================ */}
          {currentStep === 4 && evaluation && (
            <div className="space-y-6">
              {/* Top Banner: Article Info & Print Button */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Kết quả đánh giá Rubric 6 Tiêu Chí
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Học sinh: <strong className="text-slate-800">{selectedStudentName}</strong>
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">
                      {new Date(evaluation.evaluatedAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">{assignmentTitle}</h2>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      exportToWordDoc({
                        title: assignmentTitle,
                        author: selectedStudentName,
                        content: confirmedText,
                        genreLabel: GENRE_RUBRICS_MAP[selectedGenre]?.genreLabel,
                        rubricEvaluation: {
                          overallScore: evaluation.criteria
                            ? Number((evaluation.criteria.reduce((a, b) => a + b.score, 0) / (evaluation.criteria.length || 1)).toFixed(1))
                            : 4.5,
                          overallLevel: evaluation.criteria?.[0]?.suggested_level || 4,
                          overallComment: evaluation.overall_feedback,
                          teacherApprovedBy: evaluation.teacherApprovedBy,
                          teacherOfficialComment: evaluation.teacherOfficialComment,
                        },
                      });
                      showNotice("Đã tải bài làm kèm kết quả Rubric (.doc chuẩn UTF-8)!", "success");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Tải bài viết kèm bảng điểm Rubric ra tệp Word chuẩn tiếng Việt"
                  >
                    <Download className="w-4 h-4 text-emerald-600" /> Tải Word (.doc)
                  </button>

                  <button
                    onClick={() => {
                      exportToTextFile({
                        title: assignmentTitle,
                        author: selectedStudentName,
                        content: confirmedText,
                        notes: `Nhận xét: ${evaluation.overall_feedback}`,
                      });
                      showNotice("Đã tải bài làm về máy tệp Text (.txt chuẩn UTF-8)!", "success");
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    title="Tải văn bản thuần UTF-8 kèm BOM"
                  >
                    <Download className="w-4 h-4 text-slate-500" /> Tải Text (.txt)
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> In phiếu nhận xét
                  </button>

                  <button
                    onClick={() => setShowCompareModal(true)}
                    className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-blue-600" /> So sánh bài gốc & đã sửa
                  </button>

                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" /> Xem lại văn bản gốc
                  </button>

                  {/* NÚT TỰ SỬA BÀI QUAN TRỌNG NHẤT */}
                  <button
                    onClick={handleSelfReviseInEditor}
                    className="px-5 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:scale-103 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-amber-200" />
                    Em tự sửa bài ngay
                  </button>
                </div>
              </div>

              {/* HUY HIỆU & LỜI DẶN KHI GIÁO VIÊN ĐÃ PHÊ DUYỆT CHÍNH THỨC */}
              {evaluation.teacherApproved && (
                <div className="bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 rounded-3xl p-5 border-2 border-emerald-500 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        ✓
                      </div>
                      <div>
                        <span className="text-xs font-black uppercase text-emerald-900 tracking-wider">
                          ĐÃ ĐƯỢC GIÁO VIÊN PHÊ DUYỆT CHÍNH THỨC
                        </span>
                        <p className="text-[11px] text-emerald-800 font-medium">
                          Người duyệt: <strong>{evaluation.teacherApprovedBy || "Cô Lê Thị Thu Hương"}</strong> • {evaluation.teacherApprovedAt ? new Date(evaluation.teacherApprovedAt).toLocaleString("vi-VN") : "Hôm nay"}
                        </p>
                      </div>
                    </div>
                    <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
                      Kết quả chính thức
                    </span>
                  </div>
                  {evaluation.teacherOfficialComment && (
                    <div className="bg-white/90 p-3.5 rounded-2xl border border-emerald-200 text-xs text-slate-800 font-sans vietnamese-essay-text leading-relaxed italic">
                      "{evaluation.teacherOfficialComment}"
                    </div>
                  )}
                </div>
              )}

              {/* 1. Lời nhận xét tổng quan (Khen trước - Gợi ý sau) */}
              <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-3xl p-6 border-2 border-amber-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-xl shadow-xs">
                    🦉
                  </div>
                  <div>
                    <h3 className="text-base font-black text-amber-950">Lời Nhận Xét Từ Thầy/Cô Trợ Lý EduNova</h3>
                    <p className="text-xs text-amber-800 font-semibold">Tâm tình sư phạm dành riêng cho em</p>
                  </div>
                </div>

                <p className="text-sm text-amber-950 leading-relaxed font-medium bg-white/70 p-4 rounded-2xl border border-amber-100">
                  "{evaluation.overall_feedback}"
                </p>

                {/* Điểm mạnh thực sự kèm bằng chứng */}
                {evaluation.strengths.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Điểm mạnh nổi bật của bài viết:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {evaluation.strengths.map((st, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-2xs space-y-1.5"
                        >
                          <div className="flex items-center gap-1.5 font-extrabold text-xs text-emerald-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{st.title}</span>
                          </div>
                          {st.evidence && (
                            <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                              Dẫn chứng: "{st.evidence}"
                            </p>
                          )}
                          <p className="text-xs text-slate-700 leading-relaxed">{st.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Chi tiết 6 Tiêu Chí Rubric chuẩn Bộ GD&ĐT */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Chi Tiết 6 Tiêu Chí Đánh Giá Rubric</h3>
                    <p className="text-xs text-slate-500">
                      Đánh giá theo 4 mức độ: Cần hỗ trợ • Đang hình thành • Đạt yêu cầu • Vận dụng tốt
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 hidden sm:block">Chuẩn Bộ GD&ĐT Tiểu học</span>
                </div>

                <div className="space-y-4">
                  {evaluation.criteria.map((crit) => {
                    const badge = getLevelBadge(crit.suggested_level);
                    return (
                      <div
                        key={crit.criterionId}
                        className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/40 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                              {crit.criterionId.toUpperCase()}
                            </span>
                            <h4 className="font-extrabold text-sm text-slate-900">{crit.name}</h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-extrabold px-3 py-1 rounded-full border ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                            <span className="text-xs font-black text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                              {crit.score.toFixed(1)} / 5.0
                            </span>
                          </div>
                        </div>

                        {/* Thanh điểm tiến độ */}
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              crit.suggested_level === 4
                                ? "bg-emerald-500"
                                : crit.suggested_level === 3
                                ? "bg-blue-500"
                                : crit.suggested_level === 2
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${(crit.score / 5) * 100}%` }}
                          />
                        </div>

                        {/* Evidence & Explanation */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                          <div className="md:col-span-6 space-y-1">
                            <span className="font-bold text-slate-700">Dẫn chứng từ bài viết:</span>
                            <p className="italic text-slate-600 bg-white p-2 rounded-xl border border-slate-100">
                              "{crit.evidence}"
                            </p>
                            <p className="text-slate-700 font-medium">{crit.explanation}</p>
                          </div>

                          <div className="md:col-span-6 p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                            <span className="font-bold text-amber-900 flex items-center gap-1">
                              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                              Câu hỏi gợi mở giúp em tự suy nghĩ:
                            </span>
                            <p className="text-amber-950 font-semibold italic">{crit.guiding_question}</p>
                            <p className="text-emerald-800 font-bold text-[11px] pt-1 border-t border-amber-200/60">
                              👉 Gợi ý hành động: {crit.suggested_action}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Danh sách 2-3 vấn đề trọng tâm cần cải thiện */}
              {evaluation.improvements.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                      🎯
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        Nhiệm Vụ Ưu Tiên Để Bài Viết Hay Hơn (Tối đa 2-3 điểm)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Em không cần sửa tất cả cùng lúc, hãy tập trung vào các gợi ý trọng tâm này nhé!
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evaluation.improvements.map((imp, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl border-2 border-orange-100 bg-orange-50/40 space-y-2.5"
                      >
                        <div className="flex items-center gap-2 text-xs font-black text-orange-950">
                          <span className="w-5 h-5 rounded-full bg-orange-200 text-orange-900 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{imp.issue}</span>
                        </div>

                        {imp.evidence && (
                          <p className="text-xs text-slate-600 italic bg-white p-2 rounded-xl border border-orange-100">
                            Chỗ cần sửa: "{imp.evidence}"
                          </p>
                        )}

                        <div className="space-y-1 text-xs">
                          <p className="font-bold text-amber-900 flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                            Câu hỏi gợi mở:
                          </p>
                          <p className="text-slate-800 italic">{imp.guiding_question}</p>
                        </div>

                        <div className="pt-2 border-t border-orange-200/60 text-xs">
                          <span className="font-bold text-emerald-800">✨ Hành động em có thể làm:</span>
                          <p className="text-slate-700 font-medium">{imp.suggested_action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Nhiệm vụ tiếp theo & Nút hành động */}
              <div className="bg-linear-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md">
                      Bước tiếp theo của em
                    </span>
                    <h3 className="text-lg font-black">{evaluation.next_step}</h3>
                    <p className="text-xs text-emerald-100">
                      Bấm nút bên dưới để mở trình soạn thảo Luyện viết với bài này và tự tay hoàn thiện theo câu hỏi gợi mở.
                    </p>
                  </div>

                  <button
                    onClick={handleSelfReviseInEditor}
                    className="px-6 py-3.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-sm shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Edit3 className="w-5 h-5 text-emerald-700" />
                    Tự Sửa Bài Trong Trình Soạn Thảo →
                  </button>
                </div>
              </div>

              {/* Khu vực Giáo viên Phê duyệt & Điều chỉnh */}
              {currentUser.role === "teacher" && (
                <div className="bg-white rounded-3xl p-6 border-2 border-teal-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-teal-600" />
                      <h4 className="font-extrabold text-sm text-slate-900">
                        Dành Cho Giáo Viên: Phê Duyệt & Nhận Xét Chính Thức
                      </h4>
                    </div>

                    {evaluation.teacherApproved ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đã phê duyệt chính thức
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl">
                        Chờ giáo viên phê duyệt
                      </span>
                    )}
                  </div>

                  {evaluation.teacherApproved && evaluation.teacherOfficialComment && (
                    <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 text-xs text-teal-950 space-y-1">
                      <p className="font-bold text-teal-900">Lời dặn chính thức của Thầy/Cô ({evaluation.teacherApprovedBy}):</p>
                      <p className="italic">"{evaluation.teacherOfficialComment}"</p>
                    </div>
                  )}

                  {!evaluation.teacherApproved && (
                    <div className="space-y-3">
                      {/* Cho phép điều chỉnh điểm từng tiêu chí */}
                      <div className="space-y-2 pt-2 border-t border-teal-100">
                        <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-teal-700" />
                          Điều chỉnh mức điểm 6 tiêu chí Rubric (nếu cần):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {evaluation.criteria.map((crit) => (
                            <div key={crit.criterionId} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                              <div className="flex justify-between items-center font-bold text-slate-800">
                                <span className="truncate max-w-[130px]">{crit.name}</span>
                                <span className="text-emerald-700 font-black">
                                  {teacherAdjustedScores[crit.criterionId]?.score ?? crit.score}đ
                                </span>
                              </div>
                              <select
                                value={teacherAdjustedScores[crit.criterionId]?.level ?? crit.suggested_level}
                                onChange={(e) => {
                                  const lvl = Number(e.target.value) as 1 | 2 | 3 | 4;
                                  const scoreMap: Record<number, number> = { 1: 2.0, 2: 3.2, 3: 4.2, 4: 4.8 };
                                  setTeacherAdjustedScores((prev) => ({
                                    ...prev,
                                    [crit.criterionId]: {
                                      level: lvl,
                                      score: scoreMap[lvl] || 4.0,
                                    },
                                  }));
                                }}
                                className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-medium"
                              >
                                <option value={4}>Mức 4: Vận dụng tốt (4.8đ)</option>
                                <option value={3}>Mức 3: Đạt yêu cầu (4.2đ)</option>
                                <option value={2}>Mức 2: Đang hình thành (3.2đ)</option>
                                <option value={1}>Mức 1: Cần hỗ trợ (2.0đ)</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Lời nhận xét & dặn dò học sinh của Thầy/Cô:
                        </label>
                        <textarea
                          value={teacherOfficialComment}
                          onChange={(e) => setTeacherOfficialComment(e.target.value)}
                          rows={3}
                          placeholder="Thầy/Cô nhập lời dặn dò, khen ngợi hoặc hướng dẫn học sinh sửa bài tại đây..."
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-teal-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          disabled={isSavingTeacherReview}
                          onClick={handleApproveTeacherReview}
                          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          {isSavingTeacherReview ? "Đang lưu..." : "Phê duyệt & Gửi nhận xét cho học sinh"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* HỘP THOẠI SO SÁNH BÀI GỐC & BẢN ĐÃ SỬA (DIFF & TIẾN BỘ HỌC SINH)       */}
      {/* ==================================================================== */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    So Sánh Bài Gốc & Bản Đã Sửa (Theo Dõi Tiến Bộ)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Đối chiếu văn bản ban đầu nhận dạng từ Word/ảnh và bản em đã tự sửa theo câu hỏi gợi mở.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thống kê tiến bộ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-slate-400">Từ bản gốc</span>
                <p className="text-lg font-black text-slate-700">
                  {(originalScannedText || extractedRawText).trim().split(/\s+/).filter(Boolean).length} từ
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-emerald-700">Từ bản đã sửa</span>
                <p className="text-lg font-black text-emerald-800">
                  {confirmedText.trim().split(/\s+/).filter(Boolean).length} từ
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-amber-800">Số câu văn</span>
                <p className="text-lg font-black text-amber-900">
                  {confirmedText.split(/[.?!]+/).filter((s) => s.trim().length > 0).length} câu
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-teal-800">Hình ảnh so sánh</span>
                <p className="text-lg font-black text-teal-900">
                  {(confirmedText.match(/như|tựa như|giống như/gi) || []).length} hình ảnh
                </p>
              </div>
            </div>

            {/* Bố cục 2 cột đối chiếu trực quan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  Phiên bản 1: Bản gốc nhận dạng (DOCX / Ảnh scan)
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-sans vietnamese-essay-text leading-relaxed text-slate-700 max-h-72 overflow-y-auto whitespace-pre-wrap">
                  {originalScannedText || extractedRawText || "Chưa có văn bản gốc."}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Phiên bản 2: Bản em đã trau chuốt & tự sửa
                </span>
                <div className="p-4 rounded-2xl bg-emerald-50/50 border-2 border-emerald-300 text-xs sm:text-sm font-sans vietnamese-essay-text leading-relaxed text-slate-900 max-h-72 overflow-y-auto whitespace-pre-wrap">
                  {confirmedText || "Chưa có văn bản chỉnh sửa."}
                </div>
              </div>
            </div>

            {/* Nút hành động trong Modal */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
              >
                Đóng bảng so sánh
              </button>

              <button
                onClick={() => {
                  setShowCompareModal(false);
                  handleSelfReviseInEditor();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-emerald-200" />
                Mở trong Studio để sửa tiếp →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* HỘP THOẠI XEM 6 TIÊU CHÍ RUBRIC CHUYÊN BIỆT THEO THỂ LOẠI (GDPT 2018)  */}
      {/* ==================================================================== */}
      {showRubricPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-2xl bg-emerald-50 border border-emerald-200">
                  {GENRE_RUBRICS_MAP[selectedGenre]?.icon || "📝"}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      Hệ thống Rubric Tiểu học
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Chuẩn Chương trình GDPT 2018
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    6 Tiêu Chí Rubric Đánh Giá: {GENRE_RUBRICS_MAP[selectedGenre]?.genreLabel}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRubricPreviewModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mô tả thể loại & quy tắc sư phạm */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs space-y-1 leading-relaxed">
              <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Đặc trưng sư phạm thể loại:
              </p>
              <p className="text-slate-700">{GENRE_RUBRICS_MAP[selectedGenre]?.description}</p>
              <p className="text-[11px] text-emerald-800 italic pt-1 border-t border-emerald-200/60">
                * Rubric này được thiết kế linh hoạt, tuyệt đối không áp đặt các tiêu chí của thể loại khác (ví dụ: không bắt bài Viết đơn phải có so sánh/nhân hóa, hoặc không bắt bài Kể chuyện phải tả thân cây cối).
              </p>
            </div>

            {/* Danh sách 6 tiêu chí */}
            <div className="space-y-4">
              {GENRE_RUBRICS_MAP[selectedGenre]?.criteriaTemplates.map((crit, idx) => (
                <div
                  key={crit.criterionId}
                  className="p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-300 bg-slate-50/40 space-y-3 transition-all"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        {idx + 1}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900">{crit.name}</h4>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      Mã: {crit.criterionId} • Thang điểm 5.0
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-100">
                    <strong className="text-slate-900">Yêu cầu cốt lõi:</strong> {crit.description}
                  </p>

                  {/* 4 Mức độ chuẩn hóa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
                      <span className="font-bold text-rose-800 block">Mức 1: Cần hỗ trợ (1.0-2.5đ)</span>
                      <p className="text-[10px] leading-tight text-slate-600">
                        Chưa đáp ứng yêu cầu cơ bản về {crit.name.toLowerCase()}, thiếu ý trọng tâm hoặc chưa đúng thể loại.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                      <span className="font-bold text-amber-800 block">Mức 2: Đang hình thành (2.6-3.7đ)</span>
                      <p className="text-[10px] leading-tight text-slate-600">
                        Đã có ý thức thể hiện nhưng còn sơ sài, thiếu dẫn chứng hoặc từ ngữ diễn đạt chưa thật gãy gọn.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1">
                      <span className="font-bold text-blue-800 block">Mức 3: Đạt yêu cầu (3.8-4.4đ)</span>
                      <p className="text-[10px] leading-tight text-slate-600">
                        Đầy đủ nội dung theo chuẩn kiến thức kĩ năng lớp 4, bố cục rõ ràng, câu cú trôi chảy.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                      <span className="font-bold text-emerald-800 block">Mức 4: Vận dụng tốt (4.5-5.0đ)</span>
                      <p className="text-[10px] leading-tight text-slate-600">
                        Sáng tạo, dùng từ ngữ đắt giá, giàu hình ảnh gợi cảm và thể hiện cảm xúc chân thực.
                      </p>
                    </div>
                  </div>

                  {/* Câu hỏi gợi mở & hành động */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                      <span className="font-bold text-amber-900 flex items-center gap-1 text-[11px]">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        Câu hỏi Socratic gợi mở:
                      </span>
                      <p className="text-[11px] text-amber-950 italic">
                        "{crit.guidingQuestions[0]}"
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-200 space-y-1">
                      <span className="font-bold text-teal-900 flex items-center gap-1 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        Gợi ý hành động tự hoàn thiện:
                      </span>
                      <p className="text-[11px] text-teal-950">
                        {crit.suggestedActions[0]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRubricPreviewModal(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Đã hiểu 6 tiêu chí này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* LIGHTBOX PHÓNG TO ẢNH CHỤP BÀI VIẾT TAY (KIỂM TRA CHỮ VIẾT TAY)         */}
      {/* ==================================================================== */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[92vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="absolute top-2 right-2 flex items-center gap-2 z-10 bg-black/60 px-3 py-1.5 rounded-2xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  if (imagePages[activeImagePageIndex]) {
                    handleRotateImage(activeImagePageIndex, "cw");
                    // Cập nhật lại ảnh đang phóng to
                    setTimeout(() => {
                      if (imagePages[activeImagePageIndex]) {
                        setZoomedImage(imagePages[activeImagePageIndex].base64Data);
                      }
                    }, 100);
                  }
                }}
                className="p-2 rounded-xl text-white hover:bg-white/20 transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Xoay ảnh 90°"
              >
                <RotateCw className="w-4 h-4" />
                Xoay 90°
              </button>

              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="p-2 rounded-xl text-white hover:bg-white/20 transition-colors"
                title="Đóng (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={zoomedImage}
              alt="Bài viết tay phóng to"
              className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
            />

            <p className="text-white/80 text-xs font-medium mt-3 text-center bg-black/50 px-4 py-1.5 rounded-full">
              🔍 Bấm ra ngoài hoặc bấm nút X để đóng • Em có thể đối chiếu nét chữ và dấu thanh tiếng Việt
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
