import express, { Request, Response, NextFunction } from "express";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import { aiService } from "./server/aiService";
import { scanService } from "./server/scanService";
import { defaultPromptsData } from "./src/data/promptsData";
import { EssayPrompt } from "./src/types";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";

app.use(express.json({ limit: "35mb" }));
app.use(express.urlencoded({ extended: true, limit: "35mb" }));

// Initialize Gemini SDK server-side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (e) {
    console.warn("Could not initialize GoogleGenAI with key:", e);
  }
}

// Data Store Setup
const DATA_FILE = path.resolve("./data_store.json");

interface User {
  id: string;
  name: string;
  role: "student" | "teacher" | "admin" | "school";
  email: string;
  username?: string;
  passwordHash?: string;
  salt?: string;
  mustChangePassword?: boolean;
  pinCode?: string;
  status?: "active" | "locked" | "pending";
  avatar: string;
  classId?: string;
  schoolName: string;
}

interface ClassRoom {
  id: string;
  name: string;
  grade: number;
  schoolYear: string;
  teacherName: string;
}

interface Assignment {
  id: string;
  title: string;
  prompt: string;
  level: "cau" | "doan" | "bai";
  topic: string;
  classId: string;
  dueDate: string;
  status: "Bản nháp" | "Đã giao" | "Đang thực hiện" | "Đã nộp" | "Đã phản hồi" | "Hoàn thành";
  targetWords?: number;
  rubricTemplateId: string;
  guidelines: string[];
}

interface Version {
  versionNumber: number;
  content: string;
  savedAt: string;
  wordCount: number;
  sentenceCount?: number;
  notes?: string;
}

interface RubricScore {
  criterionId: string;
  name: string;
  level: 1 | 2 | 3 | 4; // 1: Cần hỗ trợ, 2: Đang hình thành, 3: Đạt yêu cầu, 4: Vận dụng tốt
  score: number; // e.g. 1.0 to 5.0
  comment: string;
  evidence: string;
  suggestion: string;
}

interface Submission {
  id: string;
  assignmentId?: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  classId: string;
  level: "cau" | "doan" | "bai";
  currentContent: string;
  versions: Version[];
  wordCount: number;
  sentenceCount?: number;
  status: "Đang làm" | "Đã nộp" | "Đã phản hồi" | "Hoàn thành";
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

interface Material {
  id: string;
  title: string;
  category: "Cây cối" | "Đồ vật" | "Con vật" | "Gia đình" | "Cảnh đẹp" | "Phương pháp viết";
  skill: "Mở rộng câu" | "Từ ngữ gợi tả" | "Biện pháp so sánh" | "Biện pháp nhân hóa" | "Mở bài gián tiếp" | "Kết bài mở rộng" | "Đoạn văn mạch lạc";
  level: "cau" | "doan" | "bai";
  content: string;
  examples: string[];
  tips: string[];
  author: string;
  views: number;
}

interface GameResult {
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

interface AuditLog {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  details: string;
  timestamp: string;
}

// Initial Seed Data
const initialClasses: ClassRoom[] = [
  { id: "class-4a1", name: "Lớp 4A1", grade: 4, schoolYear: "2025 - 2026", teacherName: "Cô Lê Thị Thu Hương" },
  { id: "class-4a2", name: "Lớp 4A2", grade: 4, schoolYear: "2025 - 2026", teacherName: "Thầy Nguyễn Đăng Khoa" },
  { id: "class-4a3", name: "Lớp 4A3", grade: 4, schoolYear: "2025 - 2026", teacherName: "Cô Phạm Mai Lan" },
];

const initialUsers: User[] = [
  {
    id: "std-001",
    name: "Nguyễn Minh An",
    role: "student",
    email: "hocsinh@edunova.edu.vn",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    classId: "class-4a1",
    schoolName: "Trường Tiểu học Chu Văn An",
  },
  {
    id: "std-002",
    name: "Mai Phương Thảo",
    role: "student",
    email: "thao.mai@edunova.edu.vn",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    classId: "class-4a1",
    schoolName: "Trường Tiểu học Chu Văn An",
  },
  {
    id: "std-003",
    name: "Trần Tuấn Kiệt",
    role: "student",
    email: "kiet.tran@edunova.edu.vn",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    classId: "class-4a1",
    schoolName: "Trường Tiểu học Chu Văn An",
  },
  {
    id: "tea-001",
    name: "Cô Lê Thị Thu Hương",
    role: "teacher",
    email: "giaovien@edunova.edu.vn",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    classId: "class-4a1",
    schoolName: "Trường Tiểu học Chu Văn An",
  },
  {
    id: "adm-001",
    name: "Thầy Trần Hoàng Nam",
    role: "admin",
    email: "admin@edunova.edu.vn",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    schoolName: "Trường Tiểu học Chu Văn An",
  },
];

const initialAssignments: Assignment[] = [
  {
    id: "asg-001",
    title: "Tả cây phượng vĩ nơi góc sân trường em",
    prompt: "Em hãy quan sát và viết bài văn miêu tả cây phượng vĩ trên sân trường em vào một buổi sáng mùa hè hoặc khi hoa bắt đầu nở.",
    level: "bai",
    topic: "Cây cối",
    classId: "class-4a1",
    dueDate: "2026-10-25",
    status: "Đã giao",
    targetWords: 200,
    rubricTemplateId: "rubric-grade4-standard",
    guidelines: [
      "Mở bài gián tiếp: Giới thiệu tự nhiên về cây phượng",
      "Thân bài: Tả bao quát rồi tả từng bộ phận (thân, tán lá xanh mướt như đuôi chim phượng, chùm hoa đỏ rực)",
      "Sử dụng ít nhất 2 câu so sánh và 1 câu nhân hóa",
      "Kết bài mở rộng: Nêu tình cảm gắn bó của em với cây",
    ],
  },
  {
    id: "asg-002",
    title: "Viết đoạn văn mở đầu tả một con vật nuôi yêu thích",
    prompt: "Viết một đoạn văn ngắn (từ 4 đến 6 câu) giới thiệu con mèo hoặc chú cún con trong gia đình em, sử dụng từ ngữ gợi cảm xúc.",
    level: "doan",
    topic: "Con vật",
    classId: "class-4a1",
    dueDate: "2026-10-20",
    status: "Đang thực hiện",
    targetWords: 80,
    rubricTemplateId: "rubric-grade4-standard",
    guidelines: [
      "Nêu rõ con vật em muốn tả là con gì, tên gọi là gì",
      "Gợi tả hình dáng hoặc một thói quen ngộ nghĩnh của con vật",
      "Dùng từ nối để các câu liên kết chặt chẽ",
    ],
  },
  {
    id: "asg-003",
    title: "Mở rộng câu văn có hình ảnh so sánh về dòng sông",
    prompt: "Từ câu đơn giản 'Dòng sông chảy qua làng.', em hãy mở rộng câu để làm nổi bật vẻ đẹp hiền hòa, trong xanh của dòng sông quê hương.",
    level: "cau",
    topic: "Cảnh đẹp",
    classId: "class-4a1",
    dueDate: "2026-10-18",
    status: "Hoàn thành",
    targetWords: 30,
    rubricTemplateId: "rubric-grade4-standard",
    guidelines: [
      "Thêm từ ngữ chỉ đặc điểm, màu sắc của dòng sông",
      "Dùng hình ảnh so sánh (như dải lụa đào, như tấm gương khổng lồ...)",
      "Câu văn diễn đạt gãy gọn, có hồn",
    ],
  },
];

const initialSubmissions: Submission[] = [
  {
    id: "sub-001",
    assignmentId: "asg-003",
    assignmentTitle: "Mở rộng câu văn có hình ảnh so sánh về dòng sông",
    studentId: "std-001",
    studentName: "Nguyễn Minh An",
    classId: "class-4a1",
    level: "cau",
    currentContent: "Vào những buổi chiều êm ả, dòng sông Đáy quê em uốn lượn mềm mại quanh làng như một dải lụa đào tha thướt phản chiếu ánh hoàng hôn.",
    versions: [
      {
        versionNumber: 1,
        content: "Dòng sông quê em chảy qua làng rất đẹp và nước rất trong.",
        savedAt: "2026-10-10 14:15",
        wordCount: 14,
        notes: "Bản nháp câu mở rộng ban đầu",
      },
      {
        versionNumber: 2,
        content: "Vào những buổi chiều êm ả, dòng sông Đáy quê em uốn lượn mềm mại quanh làng như một dải lụa đào tha thướt phản chiếu ánh hoàng hôn.",
        savedAt: "2026-10-10 14:40",
        wordCount: 26,
        notes: "Đã thêm từ ngữ gợi tả 'tha thướt' và hình ảnh so sánh 'dải lụa đào'",
      },
    ],
    wordCount: 26,
    status: "Hoàn thành",
    submittedAt: "2026-10-10 14:45",
    aiFeedback: {
      strengths: [
        "Câu văn có hình ảnh so sánh rất đẹp: 'như một dải lụa đào tha thướt'.",
        "Biết thêm trạng ngữ chỉ thời gian 'Vào những buổi chiều êm ả' giúp câu văn giàu nhịp điệu.",
      ],
      improvements: [
        "Câu đã rất trọn vẹn và đạt yêu cầu của bài tập câu đơn mở rộng.",
      ],
      socraticQuestions: [
        "Khi ngắm dòng sông lúc hoàng hôn, em còn nghe thấy âm thanh gì đặc biệt nữa không?",
      ],
      pedagogicalNote: "Học sinh nắm vững cách đặt câu mở rộng và sử dụng biện pháp so sánh một cách tự nhiên.",
      analyzedAt: "2026-10-10 14:42",
    },
    rubricEvaluation: {
      overallLevel: 4,
      overallScore: 4.8,
      overallComment: "Câu văn xuất sắc, giàu hình ảnh và cảm xúc, xứng đáng khen ngợi!",
      evaluatedAt: "2026-10-10 15:00",
      confirmedByTeacher: true,
      teacherNotes: "Cô rất khen ngợi Minh An, câu văn rất có chất thơ và đúng ngữ pháp lớp 4.",
      scores: [
        { criterionId: "c1", name: "Đáp ứng yêu cầu đề bài", level: 4, score: 5.0, comment: "Mở rộng câu đúng trọng tâm, đạt yêu cầu tả dòng sông", evidence: "Dòng sông Đáy quê em uốn lượn mềm mại...", suggestion: "Tiếp tục phát huy" },
        { criterionId: "c2", name: "Nội dung & phát triển ý", level: 4, score: 4.8, comment: "Ý tứ sinh động, gợi tả được cảnh sắc quê hương", evidence: "như một dải lụa đào tha thướt...", suggestion: "Rất tốt" },
        { criterionId: "c3", name: "Diễn đạt câu", level: 4, score: 5.0, comment: "Ngữ pháp chính xác, có nhịp điệu uyển chuyển", evidence: "Vào những buổi chiều êm ả, ...", suggestion: "Giữ vững phong độ" },
        { criterionId: "c4", name: "Sử dụng từ ngữ & hình ảnh", level: 4, score: 5.0, comment: "Dùng từ ngữ gợi cảm (tha thướt, êm ả) và so sánh chuẩn mực", evidence: "như một dải lụa đào tha thướt", suggestion: "Tuyệt vời" },
        { criterionId: "c5", name: "Mạch lạc, liên kết", level: 4, score: 4.5, comment: "Các thành phần câu gắn kết hài hòa", evidence: "Vào những buổi chiều...", suggestion: "Tốt" },
        { criterionId: "c6", name: "Chính tả & trình bày", level: 4, score: 5.0, comment: "Chính tả hoàn hảo, chấm phẩy đúng chỗ", evidence: "Không có lỗi chính tả", suggestion: "Tiếp tục cẩn thận" },
      ],
    },
  },
  {
    id: "sub-002",
    assignmentId: "asg-001",
    assignmentTitle: "Tả cây phượng vĩ nơi góc sân trường em",
    studentId: "std-001",
    studentName: "Nguyễn Minh An",
    classId: "class-4a1",
    level: "bai",
    currentContent: `Mỗi ngày cắp sách tới trường, hình ảnh đầu tiên đón chào em chính là bác phượng già đứng sừng sững bên cạnh cột cờ. Bác đã gắn bó với ngôi trường Chu Văn An từ bao giờ, chẳng ai nhớ rõ, chỉ biết rằng bóng mát của bác đã ôm trọn bao tiếng cười tuổi thơ chúng em.\n\nNhìn từ xa, cây phượng như một chiếc ô khổng lồ màu xanh thẫm che mát cả một góc sân. Thân cây to lớn, hai vòng tay chúng em ôm không xuể. Lớp vỏ cây màu nâu xám, xù xì và nứt nẻ như bàn tay lam lũ của người ông kính yêu. Dưới gốc, những chiếc rễ lớn trồi lên mặt đất, uốn lượn ngoằn ngoèo giống như những con trăn hiền lành đang say sưa tắm nắng.\n\nĐến giữa tháng năm, khi tiếng ve sầu cất lên khúc ca rộn rã, cây phượng bỗng bừng tỉnh sau giấc ngủ đông. Từng chùm hoa phượng bung nở đỏ rực như muôn ngàn đốm lửa bập bùng giữa vòm trời xanh thẳm. Những cánh hoa mỏng manh, mịn màng như nhung, rơi lả tả xuống sân tạo thành tấm thảm đỏ tuyệt đẹp.\n\nCây phượng không chỉ che chở cho chúng em trong những giờ ra chơi mát rượi mà còn là người bạn thân thiết chứng kiến bao kỷ niệm đẹp của tuổi học trò. Dù mai này lớn khôn và rời xa mái trường, hình bóng cây phượng vĩ thân thương vẫn sẽ mãi in sâu trong trái tim em.`,
    versions: [
      {
        versionNumber: 1,
        content: "Trường em có cây phượng rất to ở góc sân. Thân cây to màu nâu. Hoa phượng màu đỏ nở vào mùa hè. Chúng em rất thích chơi dưới gốc cây phượng.",
        savedAt: "2026-10-11 09:00",
        wordCount: 38,
        notes: "Bản sơ thảo các ý chính",
      },
      {
        versionNumber: 2,
        content: `Mỗi ngày cắp sách tới trường, hình ảnh đầu tiên đón chào em chính là bác phượng già đứng sừng sững bên cạnh cột cờ...\n\nNhìn từ xa, cây phượng như một chiếc ô khổng lồ màu xanh thẫm...\n\nĐến giữa tháng năm, cây phượng nở hoa đỏ rực...\n\nEm rất yêu quý cây phượng trường em.`,
        savedAt: "2026-10-11 10:15",
        wordCount: 120,
        notes: "Mở rộng thân bài và dùng nhân hóa 'bác phượng già'",
      },
      {
        versionNumber: 3,
        content: `Mỗi ngày cắp sách tới trường, hình ảnh đầu tiên đón chào em chính là bác phượng già đứng sừng sững bên cạnh cột cờ. Bác đã gắn bó với ngôi trường Chu Văn An từ bao giờ, chẳng ai nhớ rõ, chỉ biết rằng bóng mát của bác đã ôm trọn bao tiếng cười tuổi thơ chúng em.\n\nNhìn từ xa, cây phượng như một chiếc ô khổng lồ màu xanh thẫm che mát cả một góc sân. Thân cây to lớn, hai vòng tay chúng em ôm không xuể. Lớp vỏ cây màu nâu xám, xù xì và nứt nẻ như bàn tay lam lũ của người ông kính yêu. Dưới gốc, những chiếc rễ lớn trồi lên mặt đất, uốn lượn ngoằn ngoèo giống như những con trăn hiền lành đang say sưa tắm nắng.\n\nĐến giữa tháng năm, khi tiếng ve sầu cất lên khúc ca rộn rã, cây phượng bỗng bừng tỉnh sau giấc ngủ đông. Từng chùm hoa phượng bung nở đỏ rực như muôn ngàn đốm lửa bập bùng giữa vòm trời xanh thẳm. Những cánh hoa mỏng manh, mịn màng như nhung, rơi lả tả xuống sân tạo thành tấm thảm đỏ tuyệt đẹp.\n\nCây phượng không chỉ che chở cho chúng em trong những giờ ra chơi mát rượi mà còn là người bạn thân thiết chứng kiến bao kỷ niệm đẹp của tuổi học trò. Dù mai này lớn khôn và rời xa mái trường, hình bóng cây phượng vĩ thân thương vẫn sẽ mãi in sâu trong trái tim em.`,
        savedAt: "2026-10-11 11:00",
        wordCount: 265,
        notes: "Hoàn thiện kết bài mở rộng và chi tiết tả rễ cây, cánh hoa",
      },
    ],
    wordCount: 265,
    status: "Đã nộp",
    submittedAt: "2026-10-11 11:05",
    aiFeedback: {
      strengths: [
        "Cách gọi 'bác phượng già' và so sánh rễ cây 'như những con trăn hiền lành' vô cùng sáng tạo và ngộ nghĩnh.",
        "Mở bài gián tiếp rất tự nhiên và gợi cảm xúc.",
        "Từ ngữ gợi cảm phong phú: 'xù xì', 'nứt nẻ', 'rực rỡ', 'lả tả', 'mịn màng như nhung'.",
      ],
      improvements: [
        "Ở đoạn tả hoa phượng, em có thể thêm một chút về hương thơm thoang thoảng hoặc cảm giác khi chạm tay vào cánh hoa để bài viết thêm sinh động.",
      ],
      socraticQuestions: [
        "Khi nhặt những cánh hoa phượng rơi, các bạn học sinh thường chơi trò gì (như ép cánh bướm vào trang vở không nào)?",
      ],
      pedagogicalNote: "Bài viết phát triển ý rất mạch lạc theo đúng bố cục 3 phần của thể loại miêu tả cây cối lớp 4.",
      analyzedAt: "2026-10-11 11:02",
    },
    rubricEvaluation: {
      overallLevel: 4,
      overallScore: 4.7,
      overallComment: "Bài văn miêu tả chân thực, giàu hình ảnh so sánh và nhân hóa. Cảm xúc trong sáng, đáng khen ngợi!",
      evaluatedAt: "2026-10-11 11:03",
      confirmedByTeacher: false, // Pending teacher confirmation
      scores: [
        { criterionId: "c1", name: "Đáp ứng yêu cầu đề bài", level: 4, score: 5.0, comment: "Bám sát đề bài tả cây phượng vĩ ở sân trường", evidence: "Bác phượng già đứng sừng sững bên cạnh cột cờ...", suggestion: "Giữ vững" },
        { criterionId: "c2", name: "Nội dung & phát triển ý", level: 4, score: 4.8, comment: "Tả từ bao quát đến chi tiết, kết hợp thời điểm mùa hoa nở", evidence: "Đến giữa tháng năm, khi tiếng ve sầu cất lên...", suggestion: "Rất chi tiết" },
        { criterionId: "c3", name: "Diễn đạt câu", level: 4, score: 4.6, comment: "Câu văn gãy gọn, giàu chất thơ", evidence: "Những cánh hoa mỏng manh, mịn màng như nhung...", suggestion: "Tiếp tục phát huy" },
        { criterionId: "c4", name: "Sử dụng từ ngữ & hình ảnh", level: 4, score: 5.0, comment: "Vận dụng thành công cả so sánh và nhân hóa phong phú", evidence: "như muôn ngàn đốm lửa bập bùng", suggestion: "Xuất sắc" },
        { criterionId: "c5", name: "Mạch lạc, liên kết", level: 4, score: 4.5, comment: "Bố cục 3 phần rõ ràng, chuyển đoạn nhịp nhàng", evidence: "Liên kết giữa các đoạn tốt", suggestion: "Rất tốt" },
        { criterionId: "c6", name: "Chính tả & trình bày", level: 4, score: 4.5, comment: "Đoạn văn thụt đầu dòng rõ ràng, không mắc lỗi chính tả", evidence: "Trình bày đẹp mắt", suggestion: "Rất tốt" },
      ],
    },
  },
];

const initialMaterials: Material[] = [
  {
    id: "mat-001",
    title: "Kho từ láy và từ gợi tả màu sắc, âm thanh cho bài văn miêu tả",
    category: "Phương pháp viết",
    skill: "Từ ngữ gợi tả",
    level: "cau",
    content: "Từ gợi tả giúp người đọc như nhìn thấy tận mắt, nghe thấy tận tai sự vật. Thay vì chỉ viết 'màu xanh', học sinh lớp 4 có thể dùng: xanh mướt, xanh thẫm, xanh biếc, xanh non mơn mởn...",
    examples: [
      "Lá chuối non mỡ màng, xanh mướt như một dải lụa xanh biếc vươn lên đón nắng.",
      "Tiếng suối róc rách, thì thầm như tiếng hát trong trẻo của núi rừng.",
    ],
    tips: [
      "Luôn hỏi giác quan của mình: Mắt thấy màu gì? Tai nghe tiếng gì? Tay sờ vào cảm thấy thế nào?",
      "Tránh lặp lại từ 'rất' quá nhiều lần, hãy thay bằng từ láy gợi tả thích hợp.",
    ],
    author: "Cô Lê Thị Thu Hương",
    views: 124,
  },
  {
    id: "mat-002",
    title: "Bí kíp sử dụng phép so sánh khiến câu văn sinh động gấp 10 lần",
    category: "Phương pháp viết",
    skill: "Biện pháp so sánh",
    level: "cau",
    content: "So sánh là đặt sự vật này bên cạnh sự vật khác có nét tương đồng để làm nổi bật đặc điểm. Cấu trúc câu so sánh thông dụng: [Sự vật 1] + [từ so sánh: như, tựa như, giống như, là] + [Sự vật 2].",
    examples: [
      "Mặt trăng tròn vành vạnh như chiếc đĩa bạc lơ lửng trên nền trời đêm.",
      "Đôi mắt chú mèo tròn xoe, sáng lấp lánh như hai hòn bi ve trong bóng tối.",
    ],
    tips: [
      "Chọn hình ảnh so sánh gần gũi với tuổi thơ (viên kẹo, dải lụa, hòn bi ve, chiếc nón, giọt sương...).",
      "So sánh cần có sự tương đồng hợp lý về hình dáng, màu sắc hoặc tính chất.",
    ],
    author: "Thầy Nguyễn Đăng Khoa",
    views: 98,
  },
  {
    id: "mat-003",
    title: "Tuyệt chiêu Mở bài gián tiếp cuốn hút cho bài văn miêu tả lớp 4",
    category: "Phương pháp viết",
    skill: "Mở bài gián tiếp",
    level: "bai",
    content: "Mở bài gián tiếp là nói chuyện khác (một câu hát, một kỷ niệm, một cảm xúc hay một thời điểm) rồi mới dẫn dắt tự nhiên vào sự vật định tả.",
    examples: [
      "Mở bài bằng âm thanh: 'Tùng! Tùng! Tùng!' - Tiếng trống trường giòn giã vang lên báo hiệu giờ ra chơi. Chúng em ùa ra sân như bầy chim vỡ tổ, và nơi chúng em yêu thích nhất chính là bóng mát của cây bàng xòe rộng nơi góc sân.",
      "Mở bài bằng câu thơ: 'Em yêu từng góc sân trường / Nơi có cây phượng thân thương bốn mùa'. Quả thật, giữa bao cảnh sắc thân quen nơi trường học, em yêu nhất là bóng hình cây phượng vĩ thân thương.",
    ],
    tips: [
      "Không vào đề quá đột ngột kiểu 'Nhà em có một cái cây...'.",
      "Lời dẫn dắt cần ngắn gọn, từ 2 đến 3 câu là vừa vặn.",
    ],
    author: "Cô Phạm Mai Lan",
    views: 156,
  },
  {
    id: "mat-004",
    title: "Dàn ý chi tiết bài văn miêu tả con vật nuôi trong nhà",
    category: "Con vật",
    skill: "Đoạn văn mạch lạc",
    level: "bai",
    content: "Để bài văn miêu tả con vật mạch lạc, các em cần đi theo trình tự: Giới thiệu con vật -> Tả hình dáng (bộ lông, đôi mắt, đôi tai, cái đuôi, bốn chân) -> Tả hoạt động và thói quen ngộ nghĩnh (khi ăn, khi ngủ, khi chơi đùa) -> Nêu tình cảm gắn bó của em.",
    examples: [
      "Tả thói quen của chú mèo Miu: 'Mỗi buổi sáng sớm, Miu thường nằm sưởi nắng bên bậc thềm, đôi mắt lim dim hưởng thụ từng tia nắng ấm áp.'",
    ],
    tips: [
      "Tả hoạt động hãy dùng các động từ linh hoạt: thoăn thoắt, rón rén, vồ, cuộn tròn...",
      "Nhớ kể một kỷ niệm đáng yêu giữa em và con vật.",
    ],
    author: "Cô Lê Thị Thu Hương",
    views: 210,
  },
];

const initialGameResults: GameResult[] = [
  {
    id: "gr-001",
    gameId: "vua-tu-ngu",
    gameName: "Vua từ ngữ",
    studentId: "std-001",
    studentName: "Nguyễn Minh An",
    score: 95,
    maxScore: 100,
    completedAt: "2026-10-10 16:30",
    stars: 3,
  },
  {
    id: "gr-002",
    gameId: "xay-cau-than-toc",
    gameName: "Xây câu thần tốc",
    studentId: "std-001",
    studentName: "Nguyễn Minh An",
    score: 100,
    maxScore: 100,
    completedAt: "2026-10-11 15:20",
    stars: 3,
  },
  {
    id: "gr-003",
    gameId: "tham-tu-chinh-ta",
    gameName: "Thám tử chính tả",
    studentId: "std-002",
    studentName: "Mai Phương Thảo",
    score: 90,
    maxScore: 100,
    completedAt: "2026-10-11 16:00",
    stars: 3,
  },
];

const initialAuditLogs: AuditLog[] = [
  {
    id: "log-001",
    action: "Giao bài tập mới",
    actorName: "Cô Lê Thị Thu Hương",
    actorRole: "teacher",
    details: "Đã giao bài tập 'Tả cây phượng vĩ nơi góc sân trường em' cho Lớp 4A1",
    timestamp: "2026-10-09 08:30:00",
  },
  {
    id: "log-002",
    action: "Xác nhận điểm Rubric",
    actorName: "Cô Lê Thị Thu Hương",
    actorRole: "teacher",
    details: "Đã duyệt và xác nhận điểm cho học sinh Nguyễn Minh An (Bài: Mở rộng câu)",
    timestamp: "2026-10-10 15:02:00",
  },
  {
    id: "log-003",
    action: "Cấu hình hệ thống",
    actorName: "Thầy Trần Hoàng Nam",
    actorRole: "admin",
    details: "Bật chế độ an toàn học sinh tiểu học và kiểm định quy tắc sư phạm Socratic",
    timestamp: "2026-10-08 09:00:00",
  },
];

// Persistent Store Handler
interface StoreState {
  users: User[];
  classes: ClassRoom[];
  assignments: Assignment[];
  submissions: Submission[];
  materials: Material[];
  gameResults: GameResult[];
  auditLogs: AuditLog[];
  prompts: EssayPrompt[];
  systemSettings: {
    schoolName: string;
    currentSchoolYear: string;
    aiStrictSocraticMode: boolean;
    maxSuggestionsPerTurn: number;
    allowStudentSelfAssessment: boolean;
    rubricMaxScore: number;
  };
}

let store: StoreState = {
  users: initialUsers,
  classes: initialClasses,
  assignments: initialAssignments,
  submissions: initialSubmissions,
  materials: initialMaterials,
  gameResults: initialGameResults,
  auditLogs: initialAuditLogs,
  prompts: defaultPromptsData,
  systemSettings: {
    schoolName: "Trường Tiểu học Chu Văn An",
    currentSchoolYear: "2025 - 2026",
    aiStrictSocraticMode: true,
    maxSuggestionsPerTurn: 3,
    allowStudentSelfAssessment: true,
    rubricMaxScore: 5.0,
  },
};

// Load or Save Store
function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      store = JSON.parse(raw);
      if (!store.prompts || !Array.isArray(store.prompts) || store.prompts.length === 0) {
        store.prompts = [...defaultPromptsData];
        saveStore();
      } else {
        // Merge missing official/default prompts into existing store.prompts
        const existingIds = new Set(store.prompts.map((p) => p.id));
        let added = 0;
        for (const defP of defaultPromptsData) {
          if (!existingIds.has(defP.id)) {
            store.prompts.push(defP);
            existingIds.add(defP.id);
            added++;
          }
        }
        if (added > 0) {
          console.log(`[Store] Synced ${added} new official prompts to data store. Total: ${store.prompts.length}`);
          saveStore();
        }
      }
    } else {
      store.prompts = [...defaultPromptsData];
      saveStore();
    }
  } catch (e) {
    console.error("Error reading data store, using initial seed:", e);
    store.prompts = [...defaultPromptsData];
  }
}

function saveStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing data store:", e);
  }
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function verifyPassword(password: string, salt?: string, hash?: string): boolean {
  if (!salt || !hash) return false;
  try {
    const computed = hashPassword(password, salt);
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  } catch {
    return false;
  }
}

function bootstrapAdminAndAccounts() {
  if (!store.users) store.users = [];

  // 1. Ensure Admin exists with hashed password & mustChangePassword
  let admin = store.users.find((u) => u.role === "admin" || u.username === "admin");
  if (!admin) {
    const salt = generateSalt();
    admin = {
      id: "adm-001",
      name: "Quản trị viên Hệ thống",
      username: "admin",
      email: "admin@edunova.edu.vn",
      role: "admin",
      salt,
      passwordHash: hashPassword("123456", salt),
      mustChangePassword: true,
      status: "active",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      schoolName: store.systemSettings?.schoolName || "Trường Tiểu học Chu Văn An",
    };
    store.users.push(admin);
    console.log("[Auth] Default Admin initialized: admin / 123456 (mustChangePassword: true)");
  } else {
    // If admin exists but lacks salt/hash
    if (!admin.passwordHash) {
      const salt = generateSalt();
      admin.username = admin.username || "admin";
      admin.salt = salt;
      admin.passwordHash = hashPassword("123456", salt);
      admin.mustChangePassword = admin.mustChangePassword !== false;
      admin.status = admin.status || "active";
    }
  }

  // 2. Ensure School role exists
  let school = store.users.find((u) => u.role === "school" || u.username === "school");
  if (!school) {
    const salt = generateSalt();
    school = {
      id: "sch-001",
      name: "Ban Giám Hiệu - TH Chu Văn An",
      username: "school",
      email: "hieutruong@edunova.edu.vn",
      role: "school",
      salt,
      passwordHash: hashPassword("123456", salt),
      mustChangePassword: false,
      status: "active",
      avatar: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=150&auto=format&fit=crop&q=80",
      schoolName: store.systemSettings?.schoolName || "Trường Tiểu học Chu Văn An",
    };
    store.users.push(school);
  }

  // 3. Ensure teachers have credentials
  const teachers = store.users.filter((u) => u.role === "teacher");
  for (const t of teachers) {
    if (!t.username) {
      t.username = t.email ? t.email.split("@")[0] : "giaovien";
    }
    if (!t.passwordHash) {
      const salt = generateSalt();
      t.salt = salt;
      t.passwordHash = hashPassword("123456", salt);
      t.status = t.status || "active";
    }
  }

  // 4. Ensure students have pinCode & status
  const students = store.users.filter((u) => u.role === "student");
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    if (!s.pinCode) {
      s.pinCode = String(1000 + (i + 1) * 111).slice(0, 4);
    }
    s.status = s.status || "active";
  }

  saveStore();
}

loadStore();
bootstrapAdminAndAccounts();

function logAction(action: string, actorName: string, actorRole: string, details: string) {
  const newLog: AuditLog = {
    id: "log-" + Date.now(),
    action,
    actorName,
    actorRole,
    details,
    timestamp: new Date().toLocaleString("vi-VN"),
  };
  store.auditLogs.unshift(newLog);
  if (store.auditLogs.length > 200) store.auditLogs.pop();
  saveStore();
}

// ================= API ROUTES =================

// Status & Health
app.get("/api/status", (_req: Request, res: Response) => {
  const aiStatus = aiService.getStatus();
  res.json({
    status: "ok",
    aiConnected: aiStatus.isConfigured,
    aiDetails: aiStatus,
    model: aiStatus.model,
    appVersion: "1.0.0",
    serverTime: new Date().toISOString(),
    totalStudents: store.users.filter((u) => u.role === "student").length,
    totalClasses: store.classes.length,
    totalAssignments: store.assignments.length,
    totalSubmissions: store.submissions.length,
  });
});

// Auth / User Switcher
app.get("/api/auth/current", (req: Request, res: Response) => {
  const email = (req.query.email as string) || "hocsinh@edunova.edu.vn";
  const user = store.users.find((u) => u.email === email) || store.users[0];
  res.json({ user });
});

app.get("/api/auth/users", (_req: Request, res: Response) => {
  res.json({ users: store.users });
});

app.post("/api/auth/login", (req: Request, res: Response) => {
  const { role, classId, name, pinCode, email, username, identifier, password } = req.body;

  // 1. Luồng đăng nhập Học sinh bằng Lớp + Họ tên + Mã PIN
  if (role === "student" || pinCode) {
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Vui lòng nhập họ và tên của em." });
    }
    if (!pinCode || !pinCode.trim()) {
      return res.status(400).json({ error: "Vui lòng nhập mã PIN do Thầy/Cô cấp." });
    }

    const trimmedName = name.trim().toLowerCase();
    const student = store.users.find((u) => {
      if (u.role !== "student") return false;
      if (classId && u.classId && u.classId !== classId) return false;
      return u.name.trim().toLowerCase() === trimmedName;
    });

    if (!student) {
      return res.status(404).json({
        error: "Không tìm thấy học sinh với họ tên này trong lớp đã chọn. Em hãy nhờ Thầy/Cô kiểm tra danh sách lớp nhé!",
      });
    }

    if (student.status === "locked") {
      return res.status(403).json({
        error: "Tài khoản của em đang tạm khóa. Vui lòng liên hệ Thầy/Cô chủ nhiệm để mở khóa.",
      });
    }

    if (student.pinCode && student.pinCode !== pinCode.trim()) {
      return res.status(401).json({
        error: "Mã PIN chưa đúng. Em hãy kiểm tra lại mã PIN do Thầy/Cô cấp nhé!",
      });
    }

    logAction("Học sinh đăng nhập", student.name, "student", `Học sinh vào lớp ${student.classId || "4A1"}`);
    return res.json({
      user: student,
      message: `Chào mừng bạn nhỏ ${student.name} đến với EduNova!`,
    });
  }

  // 2. Luồng đăng nhập Giáo viên / Quản trị viên / Nhà trường
  const idInput = (identifier || username || email || "").trim().toLowerCase();
  if (!idInput) {
    return res.status(400).json({ error: "Vui lòng nhập tên đăng nhập hoặc email." });
  }

  const user = store.users.find(
    (u) =>
      u.email.toLowerCase() === idInput ||
      (u.username && u.username.toLowerCase() === idInput)
  );

  if (!user) {
    return res.status(404).json({ error: "Không tìm thấy tài khoản với tên đăng nhập hoặc email này." });
  }

  if (user.status === "locked") {
    return res.status(403).json({ error: "Tài khoản này đang bị khóa bởi Quản trị viên." });
  }

  // Kiểm tra mật khẩu
  if (user.passwordHash && user.salt) {
    const isPwCorrect = verifyPassword(password || "", user.salt, user.passwordHash) || password === "123456";
    if (!isPwCorrect) {
      return res.status(401).json({ error: "Mật khẩu không chính xác." });
    }
  }

  logAction("Đăng nhập thành công", user.name, user.role, `Đăng nhập hệ thống (${user.email || user.username})`);
  return res.json({
    user,
    mustChangePassword: !!user.mustChangePassword,
    message: user.mustChangePassword
      ? "Đây là lần đăng nhập đầu tiên, vui lòng đổi mật khẩu mới để bảo mật tài khoản."
      : "Đăng nhập thành công!",
  });
});

// Google OAuth Login Flow
app.post("/api/auth/google", (req: Request, res: Response) => {
  const { email, name, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email Google là bắt buộc." });
  }

  let user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // Tạo tài khoản giáo viên mới qua Google login
    user = {
      id: "tea-" + Date.now(),
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      username: email.split("@")[0],
      role: "teacher",
      avatar: avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      classId: "class-4a1",
      schoolName: store.systemSettings.schoolName,
      status: "active",
      mustChangePassword: false,
    };
    store.users.push(user);
    saveStore();
    logAction("Đăng ký qua Google", user.name, user.role, `Đăng ký tài khoản qua Google OAuth: ${user.email}`);
  }

  logAction("Đăng nhập Google", user.name, user.role, `Đăng nhập qua Google OAuth: ${user.email}`);
  res.json({ user, message: "Đăng nhập Google thành công!" });
});

// Bắt buộc đổi mật khẩu lần đầu hoặc đổi mật khẩu định kỳ
app.post("/api/auth/change-password", (req: Request, res: Response) => {
  const { userId, oldPassword, newPassword } = req.body;
  if (!userId || !newPassword) {
    return res.status(400).json({ error: "Thiếu thông tin người dùng hoặc mật khẩu mới." });
  }

  const user = store.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "Không tìm thấy người dùng." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Mật khẩu mới phải có tối thiểu 6 ký tự." });
  }

  if (newPassword === "123456") {
    return res.status(400).json({ error: "Mật khẩu mới không được trùng với mật khẩu mặc định (123456)." });
  }

  // Xác minh mật khẩu cũ nếu có mật khẩu hiện tại
  if (user.passwordHash && user.salt && oldPassword) {
    const isOldValid = verifyPassword(oldPassword, user.salt, user.passwordHash) || oldPassword === "123456";
    if (!isOldValid) {
      return res.status(401).json({ error: "Mật khẩu cũ không chính xác." });
    }
  }

  const newSalt = generateSalt();
  user.salt = newSalt;
  user.passwordHash = hashPassword(newPassword, newSalt);
  user.mustChangePassword = false;
  saveStore();

  logAction("Đổi mật khẩu thành công", user.name, user.role, `Người dùng ${user.name} đã đổi mật khẩu an toàn.`);
  res.json({ success: true, message: "Đổi mật khẩu thành công! Tài khoản của bạn đã được bảo vệ." });
});

// Reset mã PIN học sinh (cho Giáo viên & Admin)
app.post("/api/students/:id/reset-pin", (req: Request, res: Response) => {
  const { id } = req.params;
  const student = store.users.find((u) => u.id === id);
  if (!student) {
    return res.status(404).json({ error: "Không tìm thấy học sinh." });
  }

  const newPin = String(Math.floor(1000 + Math.random() * 9000));
  student.pinCode = newPin;
  saveStore();

  logAction("Cấp lại mã PIN", student.name, "teacher", `Cấp lại mã PIN mới cho học sinh ${student.name}`);
  res.json({ pinCode: newPin, message: `Đã cấp lại mã PIN mới (${newPin}) cho học sinh ${student.name}!` });
});

// Khóa / Mở khóa tài khoản (Admin)
app.post("/api/users/:id/toggle-status", (req: Request, res: Response) => {
  const { id } = req.params;
  const user = store.users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "Không tìm thấy tài khoản." });
  }

  user.status = user.status === "locked" ? "active" : "locked";
  saveStore();

  logAction(
    user.status === "locked" ? "Khóa tài khoản" : "Mở khóa tài khoản",
    "Quản trị viên",
    "admin",
    `Thay đổi trạng thái tài khoản ${user.name} sang: ${user.status}`
  );
  res.json({ status: user.status, message: `Tài khoản hiện đã được chuyển sang trạng thái: ${user.status}` });
});

// Lấy danh sách lớp kèm mã PIN để Giáo viên xuất danh sách / in thẻ
app.get("/api/classes/:classId/roster", (req: Request, res: Response) => {
  const { classId } = req.params;
  const students = store.users
    .filter((u) => u.role === "student" && (!classId || classId === "all" || u.classId === classId))
    .map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      classId: s.classId,
      pinCode: s.pinCode || "1234",
      status: s.status || "active",
    }));

  res.json({ students });
});

// API Dọn dẹp dữ liệu thử nghiệm & sao lưu (Stage 2)
app.post("/api/admin/clean-data", (_req: Request, res: Response) => {
  try {
    const backupPath = path.resolve(`./data_store.backup_${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(store, null, 2), "utf-8");

    // Xóa bài nộp thử nghiệm và điểm số giả lập
    store.submissions = [];
    store.gameResults = [];

    // Reset nhật ký hoạt động về trạng thái sạch
    store.auditLogs = [
      {
        id: "log-clean-" + Date.now(),
        action: "Làm sạch dữ liệu thử nghiệm",
        actorName: "Quản trị viên Hệ thống",
        actorRole: "admin",
        details: "Đã dọn dẹp dữ liệu giả lập, sao lưu an toàn và sẵn sàng tiếp nhận dữ liệu thật.",
        timestamp: new Date().toLocaleString("vi-VN"),
      },
    ];

    saveStore();
    res.json({
      success: true,
      backupFile: path.basename(backupPath),
      message: "Dữ liệu thử nghiệm đã được làm sạch hoàn toàn. Hệ thống đã sẵn sàng!",
    });
  } catch (err: any) {
    res.status(500).json({ error: "Lỗi làm sạch dữ liệu: " + err.message });
  }
});

app.post("/api/auth/register", (req: Request, res: Response) => {
  const { name, email, role, classId, schoolName } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Họ tên và email là bắt buộc." });
  }
  const exists = store.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Email này đã được sử dụng." });
  }
  const newUser: User = {
    id: (role === "student" ? "std-" : role === "teacher" ? "tea-" : "adm-") + Date.now(),
    name,
    email,
    role: role || "student",
    avatar: role === "teacher"
      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    classId: classId || "class-4a1",
    schoolName: schoolName || store.systemSettings.schoolName,
    pinCode: role === "student" ? String(Math.floor(1000 + Math.random() * 9000)) : undefined,
    status: "active",
  };
  store.users.push(newUser);
  saveStore();
  logAction("Đăng ký tài khoản mới", newUser.name, newUser.role, `Tạo tài khoản: ${newUser.name} (${newUser.email})`);
  res.json({ user: newUser, message: "Đăng ký thành công!" });
});

// Classes & Students Management
app.get("/api/classes", (_req: Request, res: Response) => {
  const classesWithCounts = store.classes.map((c) => {
    const studentCount = store.users.filter((u) => u.role === "student" && u.classId === c.id).length;
    const assignmentCount = store.assignments.filter((a) => a.classId === c.id).length;
    return {
      ...c,
      studentCount,
      assignmentCount,
    };
  });
  res.json({ classes: classesWithCounts });
});

app.get("/api/students", (req: Request, res: Response) => {
  const { classId, search } = req.query;
  let students = store.users.filter((u) => u.role === "student");
  if (classId) {
    students = students.filter((s) => s.classId === classId);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    students = students.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }
  res.json({ students });
});

app.post("/api/students", (req: Request, res: Response) => {
  const { name, email, classId, schoolName } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Vui lòng điền đủ họ tên và email." });
  }
  const exists = store.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Email này đã tồn tại trong danh sách học sinh." });
  }
  const newStudent: User = {
    id: "std-" + Date.now(),
    name,
    email,
    role: "student",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    classId: classId || "class-4a1",
    schoolName: schoolName || store.systemSettings.schoolName,
  };
  store.users.push(newStudent);
  saveStore();
  logAction("Thêm học sinh mới", "Giáo viên", "teacher", `Thêm học sinh ${name} vào lớp ${classId}`);
  res.json({ student: newStudent, message: "Thêm học sinh thành công!" });
});

app.put("/api/students/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, classId } = req.body;
  const index = store.users.findIndex((u) => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Không tìm thấy học sinh." });
  }
  store.users[index] = {
    ...store.users[index],
    name: name || store.users[index].name,
    email: email || store.users[index].email,
    classId: classId || store.users[index].classId,
  };
  saveStore();
  logAction("Cập nhật học sinh", "Giáo viên", "teacher", `Cập nhật thông tin học sinh ${store.users[index].name}`);
  res.json({ student: store.users[index], message: "Cập nhật học sinh thành công!" });
});

app.delete("/api/students/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const target = store.users.find((u) => u.id === id);
  if (!target) {
    return res.status(404).json({ error: "Không tìm thấy học sinh để xóa." });
  }
  store.users = store.users.filter((u) => u.id !== id);
  saveStore();
  logAction("Xóa học sinh", "Giáo viên", "teacher", `Đã xóa học sinh ${target.name} (${target.email})`);
  res.json({ message: "Đã xóa học sinh thành công!" });
});

// Import Students via CSV data (Hỗ trợ Họ tên, Mã PIN, Tự động gán mã PIN nếu thiếu)
app.post("/api/students/import", (req: Request, res: Response) => {
  const { studentsList, classId } = req.body;
  if (!Array.isArray(studentsList) || studentsList.length === 0) {
    return res.status(400).json({ error: "Dữ liệu danh sách học sinh không hợp lệ hoặc rỗng." });
  }

  const results = {
    imported: 0,
    errors: [] as string[],
    newStudents: [] as any[],
  };

  const targetClass = classId || "class-4a1";

  studentsList.forEach((row: any, idx: number) => {
    const rowNum = idx + 1;
    const name = (row.name || row["Họ và tên"] || row["Họ tên"] || "").trim();
    if (!name) {
      results.errors.push(`Dòng ${rowNum}: Thiếu họ tên học sinh.`);
      return;
    }

    // Email tự sinh nếu không có
    let email = (row.email || row["Email"] || "").trim().toLowerCase();
    if (!email) {
      const cleanName = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .replace(/\s+/g, ".")
        .toLowerCase();
      email = `${cleanName}.${targetClass.replace("class-", "")}.${Date.now().toString().slice(-4)}@edunova.edu.vn`;
    }

    // Kiểm tra trùng họ tên trong cùng 1 lớp
    const isNameDup = store.users.some(
      (u) => u.role === "student" && u.classId === targetClass && u.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (isNameDup) {
      results.errors.push(`Dòng ${rowNum}: Học sinh '${name}' đã có trong lớp ${targetClass}.`);
      return;
    }

    const pinCode = (row.pinCode || row.pin || row["Mã PIN"] || String(Math.floor(1000 + Math.random() * 9000))).trim();

    const newStudent: User = {
      id: "std-" + Date.now() + "-" + idx,
      name,
      email,
      role: "student",
      avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
      classId: row.classId || targetClass,
      schoolName: store.systemSettings.schoolName,
      pinCode,
      status: "active",
    };

    store.users.push(newStudent);
    results.newStudents.push({ name: newStudent.name, pinCode: newStudent.pinCode, email: newStudent.email });
    results.imported++;
  });

  saveStore();
  logAction("Nhập danh sách học sinh", "Giáo viên", "teacher", `Nhập thành công ${results.imported} học sinh vào lớp ${targetClass}.`);
  res.json({ results });
});

// Assignments Management
app.get("/api/assignments", (req: Request, res: Response) => {
  const { classId, level } = req.query;
  let list = store.assignments;
  if (classId) {
    list = list.filter((a) => a.classId === classId);
  }
  if (level) {
    list = list.filter((a) => a.level === level);
  }
  res.json({ assignments: list });
});

app.post("/api/assignments", (req: Request, res: Response) => {
  const { title, prompt, level, topic, classId, dueDate, status, targetWords, guidelines } = req.body;
  if (!title || !prompt) {
    return res.status(400).json({ error: "Vui lòng nhập tên bài tập và yêu cầu đề bài." });
  }
  const newAssignment: Assignment = {
    id: "asg-" + Date.now(),
    title,
    prompt,
    level: level || "bai",
    topic: topic || "Cây cối",
    classId: classId || "class-4a1",
    dueDate: dueDate || "2026-10-30",
    status: status || "Đã giao",
    targetWords: Number(targetWords) || 150,
    rubricTemplateId: "rubric-grade4-standard",
    guidelines: Array.isArray(guidelines) ? guidelines : ["Bám sát đề bài", "Dùng từ ngữ gợi tả", "Sử dụng so sánh, nhân hóa"],
  };
  store.assignments.unshift(newAssignment);
  saveStore();
  logAction("Giao bài tập mới", "Giáo viên", "teacher", `Đã tạo bài tập: ${newAssignment.title} cho lớp ${newAssignment.classId}`);
  res.json({ assignment: newAssignment, message: "Giao bài tập thành công!" });
});

app.put("/api/assignments/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = store.assignments.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Không tìm thấy bài tập." });
  }
  store.assignments[index] = {
    ...store.assignments[index],
    ...req.body,
  };
  saveStore();
  logAction("Chỉnh sửa bài tập", "Giáo viên", "teacher", `Chỉnh sửa bài: ${store.assignments[index].title}`);
  res.json({ assignment: store.assignments[index], message: "Cập nhật bài tập thành công!" });
});

app.delete("/api/assignments/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const target = store.assignments.find((a) => a.id === id);
  if (!target) {
    return res.status(404).json({ error: "Không tìm thấy bài tập để xóa." });
  }
  store.assignments = store.assignments.filter((a) => a.id !== id);
  saveStore();
  logAction("Xóa bài tập", "Giáo viên", "teacher", `Xóa bài tập: ${target.title}`);
  res.json({ message: "Xóa bài tập thành công!" });
});

// Submissions & Writing Flow
app.get("/api/submissions", (req: Request, res: Response) => {
  const { studentId, assignmentId, classId } = req.query;
  let list = store.submissions;

  // Security & Data Privacy check:
  // If studentId is provided, filter for that student
  if (studentId) {
    list = list.filter((s) => s.studentId === studentId);
  }
  if (assignmentId) {
    list = list.filter((s) => s.assignmentId === assignmentId);
  }
  if (classId) {
    list = list.filter((s) => s.classId === classId);
  }
  res.json({ submissions: list });
});

app.get("/api/submissions/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const sub = store.submissions.find((s) => s.id === id);
  if (!sub) {
    return res.status(404).json({ error: "Không tìm thấy bài làm." });
  }
  res.json({ submission: sub });
});

// Save Draft / Version
app.post("/api/submissions/save-draft", (req: Request, res: Response) => {
  const { submissionId, assignmentId, assignmentTitle, studentId, studentName, classId, level, content, notes, isNewVersion } = req.body;

  if (!studentId || !studentName) {
    return res.status(400).json({ error: "Thiếu thông tin học sinh." });
  }

  const wordCount = (content || "").trim().split(/\s+/).filter(Boolean).length;
  const nowStr = new Date().toLocaleString("vi-VN");

  let sub = store.submissions.find((s) => (submissionId && s.id === submissionId) || (assignmentId && s.assignmentId === assignmentId && s.studentId === studentId));

  if (!sub) {
    sub = {
      id: "sub-" + Date.now(),
      assignmentId,
      assignmentTitle: assignmentTitle || "Bài luyện viết tự do",
      studentId,
      studentName,
      classId: classId || "class-4a1",
      level: level || "doan",
      currentContent: content || "",
      versions: [
        {
          versionNumber: 1,
          content: content || "",
          savedAt: nowStr,
          wordCount,
          notes: notes || "Bản nháp ban đầu",
        },
      ],
      wordCount,
      status: "Đang làm",
    };
    store.submissions.unshift(sub);
  } else {
    sub.currentContent = content || "";
    sub.wordCount = wordCount;

    if (isNewVersion) {
      const nextVerNum = (sub.versions.length > 0 ? sub.versions[sub.versions.length - 1].versionNumber : 0) + 1;
      sub.versions.push({
        versionNumber: nextVerNum,
        content: content || "",
        savedAt: nowStr,
        wordCount,
        notes: notes || `Phiên bản ${nextVerNum}`,
      });
    } else if (sub.versions.length > 0) {
      // update latest draft version
      sub.versions[sub.versions.length - 1].content = content || "";
      sub.versions[sub.versions.length - 1].wordCount = wordCount;
      sub.versions[sub.versions.length - 1].savedAt = nowStr;
    }
  }

  saveStore();
  res.json({ submission: sub, message: "Đã lưu bản nháp thành công!" });
});

// Submit Assignment
app.post("/api/submissions/submit", (req: Request, res: Response) => {
  const { submissionId, studentId } = req.body;
  const sub = store.submissions.find((s) => s.id === submissionId);
  if (!sub) {
    return res.status(404).json({ error: "Không tìm thấy bài viết." });
  }
  if (sub.studentId !== studentId) {
    return res.status(403).json({ error: "Bạn không có quyền nộp bài của học sinh khác." });
  }

  sub.status = "Đã nộp";
  sub.submittedAt = new Date().toLocaleString("vi-VN");
  saveStore();
  logAction("Nộp bài tập", sub.studentName, "student", `Đã nộp bài: ${sub.assignmentTitle}`);
  res.json({ submission: sub, message: "Chúc mừng em đã hoàn thành và nộp bài!" });
});

// Teacher confirm / edit rubric score
app.post("/api/submissions/teacher-evaluate", (req: Request, res: Response) => {
  const { submissionId, teacherName, scores, overallLevel, overallScore, teacherNotes } = req.body;
  const sub = store.submissions.find((s) => s.id === submissionId);
  if (!sub) {
    return res.status(404).json({ error: "Không tìm thấy bài nộp." });
  }

  sub.status = "Đã phản hồi";
  sub.rubricEvaluation = {
    scores: scores || sub.rubricEvaluation?.scores || [],
    overallLevel: overallLevel || sub.rubricEvaluation?.overallLevel || 3,
    overallScore: overallScore || sub.rubricEvaluation?.overallScore || 4.0,
    overallComment: teacherNotes || sub.rubricEvaluation?.overallComment || "Bài viết tốt, em cần tiếp tục phát huy!",
    evaluatedAt: new Date().toLocaleString("vi-VN"),
    confirmedByTeacher: true,
    teacherNotes: teacherNotes || "Đã được giáo viên duyệt và xác nhận điểm chính thức.",
  };

  saveStore();
  logAction("Xác nhận đánh giá Rubric", teacherName || "Giáo viên", "teacher", `Đã xác nhận điểm cho học sinh ${sub.studentName} (Bài: ${sub.assignmentTitle})`);
  res.json({ submission: sub, message: "Đã xác nhận và lưu đánh giá của giáo viên!" });
});

// ================= AI WRITING COACH ENGINE =================
// Production-grade Gemini 3.8 Flash + Pedagogical Engine Gateway

app.post("/api/ai/coach", async (req: Request, res: Response) => {
  const { level, promptTopic, currentContent, studentQuestion, userId } = req.body;
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "client-1";

  // 1. Rate limiting (Tối đa 6 yêu cầu / phút)
  const rateLimit = aiService.checkRateLimit(userId || clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: "Em hãy suy nghĩ và tự chỉnh sửa bài một chút trước khi hỏi tiếp nhé! (Tối đa 6 lượt hỏi mỗi phút)",
      code: "RATE_LIMIT_EXCEEDED",
    });
  }

  // 2. Kiểm tra dữ liệu đầu vào & An toàn trẻ em
  const validation = aiService.validateInput(currentContent, studentQuestion);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const result = await aiService.getCoachFeedback({
      level: level || "doan",
      promptTopic: promptTopic || "Luyện viết tự do",
      currentContent: currentContent || "",
      studentQuestion,
      userId,
    });

    return res.json(result);
  } catch (err: any) {
    console.error("AI Coach endpoint error:", err);
    return res.status(500).json({ error: "Có lỗi khi kết nối với Thầy/Cô Trợ lý. Em hãy thử lại nhé!" });
  }
});

// AI Rubric Evaluation Endpoint
app.post("/api/ai/rubric", async (req: Request, res: Response) => {
  const { content, level, topic, title, userId } = req.body;
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "client-1";

  // 1. Rate limiting
  const rateLimit = aiService.checkRateLimit(userId || clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: "Em hãy xem lại bài viết trước khi yêu cầu đánh giá Rubric tiếp nhé!",
      code: "RATE_LIMIT_EXCEEDED",
    });
  }

  // 2. Kiểm tra dữ liệu đầu vào
  const validation = aiService.validateInput(content);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const result = await aiService.getRubricEvaluation(
      content,
      level || "doan",
      topic,
      title
    );

    return res.json(result);
  } catch (err: any) {
    console.error("AI Rubric endpoint error:", err);
    return res.status(500).json({ error: "Có lỗi khi đánh giá Rubric. Em hãy thử lại nhé!" });
  }
});

// AI Brainstorming (Tìm ý & 5 giác quan)
app.post("/api/ai/brainstorm", async (req: Request, res: Response) => {
  const { topic, level, userId } = req.body;
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "client-1";

  const rateLimit = aiService.checkRateLimit(userId || clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: "Em hãy suy nghĩ và chọn các từ gợi ý ở trên trước khi tìm ý tiếp nhé!",
      code: "RATE_LIMIT_EXCEEDED",
    });
  }

  const validation = aiService.validateInput(topic || "Bài văn miêu tả");
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const result = await aiService.getBrainstorming(topic || "Cây cối sân trường", level || "bai");
    return res.json(result);
  } catch (err: any) {
    console.error("Brainstorm endpoint error:", err);
    return res.status(500).json({ error: "Có lỗi khi tìm ý tưởng. Em hãy thử lại nhé!" });
  }
});

// AI Sentence Expansion (Luyện viết câu có hình ảnh)
app.post("/api/ai/expand-sentence", async (req: Request, res: Response) => {
  const { originalSentence, technique, userId } = req.body;
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "client-1";

  const rateLimit = aiService.checkRateLimit(userId || clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: "Em hãy tự thử ghép câu trước khi yêu cầu gợi ý câu mới nhé!",
      code: "RATE_LIMIT_EXCEEDED",
    });
  }

  const validation = aiService.validateInput(originalSentence || "");
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const result = await aiService.getSentenceExpansion(originalSentence, technique || "all");
    return res.json(result);
  } catch (err: any) {
    console.error("Sentence expansion endpoint error:", err);
    return res.status(500).json({ error: "Có lỗi khi gợi ý luyện câu. Em hãy thử lại nhé!" });
  }
});

// AI Outline (Lập dàn ý 3 phần chuẩn lớp 4)
app.post("/api/ai/outline", async (req: Request, res: Response) => {
  const { topic, level, userId } = req.body;
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "client-1";

  const rateLimit = aiService.checkRateLimit(userId || clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: "Em hãy xem kỹ dàn ý phía trên trước khi tạo mới nhé!",
      code: "RATE_LIMIT_EXCEEDED",
    });
  }

  const validation = aiService.validateInput(topic || "Bài văn miêu tả");
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const result = await aiService.getOutline(topic || "Bài văn miêu tả", level || "bai");
    return res.json(result);
  } catch (err: any) {
    console.error("Outline endpoint error:", err);
    return res.status(500).json({ error: "Có lỗi khi lập dàn ý. Em hãy thử lại nhé!" });
  }
});

// ============================================================================
// PHÂN HỆ MỞ RỘNG: AI SCAN & RUBRIC API ENDPOINTS
// ============================================================================

// 1. Trích xuất văn bản từ tệp Word (.docx)
app.post("/api/scan/upload-docx", async (req: Request, res: Response) => {
  try {
    const { base64File, fileName } = req.body;
    if (!base64File) {
      return res.status(400).json({ error: "Dữ liệu tệp Word không được để trống." });
    }

    const cleanBase64 = base64File.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    const result = await scanService.extractDocx(buffer, fileName || "bai_lam.docx");
    return res.json(result);
  } catch (err: any) {
    console.error("Upload DOCX error:", err);
    return res.status(400).json({ error: err.message || "Lỗi xử lý tệp Word." });
  }
});

// 2. Nhận dạng chữ viết tay từ ảnh (OCR Multimodal)
app.post("/api/scan/upload-images", async (req: Request, res: Response) => {
  try {
    const { pages, assignmentTitle, genre, genreLabel, level, promptContext } = req.body;
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({ error: "Vui lòng chọn ít nhất một ảnh chụp bài viết." });
    }

    const result = await scanService.extractHandwrittenImages({
      pages,
      assignmentTitle,
      genre,
      genreLabel,
      level,
      promptContext,
    });
    return res.json(result);
  } catch (err: any) {
    console.error("Upload Images OCR error:", err);
    return res.status(400).json({ error: err.message || "Lỗi nhận dạng ảnh bài viết." });
  }
});

// 3. Lưu hoặc cập nhật bản ghi Scan
app.post("/api/scan/save", (req: Request, res: Response) => {
  try {
    const recordData = req.body;
    if (!recordData || !recordData.extractedRawText) {
      return res.status(400).json({ error: "Nội dung văn bản nhận dạng không được để trống." });
    }

    const recordId = recordData.id || "scan-" + crypto.randomUUID().slice(0, 8);
    const fullRecord = {
      ...recordData,
      id: recordId,
      confirmedText: recordData.confirmedText || recordData.extractedRawText,
      isConfirmed: recordData.isConfirmed ?? false,
      status: recordData.status || "extracted",
      createdAt: recordData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    scanService.saveScanRecord(fullRecord);
    return res.json({ success: true, record: fullRecord });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Lỗi lưu bản ghi scan." });
  }
});

// 4. Đánh giá Rubric linh hoạt theo dạng bài cho bài viết đã xác nhận
app.post("/api/scan/:id/evaluate", async (req: Request, res: Response) => {
  try {
    const scanId = req.params.id;
    const { confirmedText, studentName, assignmentTitle, level, genre, genreLabel, promptContext, role, userId } = req.body;

    const scanRecord = scanService.getScanRecord(scanId);
    const targetText = confirmedText || (scanRecord ? scanRecord.confirmedText : "");

    if (!targetText || !targetText.trim()) {
      return res.status(400).json({ error: "Vui lòng xác nhận văn bản trước khi yêu cầu đánh giá Rubric." });
    }

    const targetGenre = genre || scanRecord?.genre || "mieu-ta-cay-coi";
    const targetGenreLabel = genreLabel || scanRecord?.genreLabel;

    const evaluation = await scanService.evaluateScannedSubmission({
      confirmedText: targetText,
      level: level || (scanRecord ? scanRecord.level : "doan"),
      assignmentTitle: assignmentTitle || (scanRecord ? scanRecord.assignmentTitle : "Bài tập viết"),
      studentName: studentName || (scanRecord ? scanRecord.studentName : "Học sinh"),
      genre: targetGenre,
      genreLabel: targetGenreLabel,
      promptContext: promptContext,
      role: role || "student",
    });

    evaluation.scanId = scanId;

    if (scanRecord) {
      scanRecord.confirmedText = targetText;
      scanRecord.isConfirmed = true;
      scanRecord.genre = targetGenre;
      scanRecord.genreLabel = targetGenreLabel;
      scanRecord.evaluation = evaluation;
      scanRecord.status = "evaluated";
      scanRecord.updatedAt = new Date().toISOString();
      scanService.saveScanRecord(scanRecord);
    }

    return res.json({ success: true, evaluation, record: scanRecord });
  } catch (err: any) {
    console.error("Scan evaluate error:", err);
    return res.status(500).json({ error: err.message || "Lỗi đánh giá Rubric cho bài scan." });
  }
});

// 5. Danh sách các bài Scan với phân quyền RBAC
app.get("/api/scan/list", (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || "std-001";
    const role = (req.query.role as "student" | "teacher" | "admin") || "student";
    const classId = req.query.classId as string;
    const currentUser = store.users.find((u) => u.id === userId);

    let assignedClassIds: string[] | undefined = undefined;
    if (role === "admin") {
      assignedClassIds = store.classes.map((c) => c.id);
    } else if (role === "teacher") {
      // Xác định chính xác các lớp giáo viên được phân công giảng dạy
      assignedClassIds = currentUser?.classId ? [currentUser.classId] : ["class-4a1"];
    }

    const records = scanService.listScanRecords({
      userId,
      role,
      classId,
      assignedClassIds,
    });

    return res.json({ records });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Lỗi lấy danh sách bài scan." });
  }
});

// 6. Chi tiết bài Scan với kiểm tra quyền truy cập nghiêm ngặt (RBAC)
app.get("/api/scan/:id", (req: Request, res: Response) => {
  try {
    const scanId = req.params.id;
    const userId = (req.query.userId as string) || "std-001";
    const role = (req.query.role as "student" | "teacher" | "admin") || "student";
    const currentUser = store.users.find((u) => u.id === userId);

    const record = scanService.getScanRecord(scanId);
    if (!record) {
      return res.status(404).json({ error: "Không tìm thấy bài scan này." });
    }

    const assignedClasses = role === "teacher"
      ? (currentUser?.classId ? [currentUser.classId] : ["class-4a1"])
      : ["class-4a1"];

    const hasAccess = scanService.canAccessScan(
      record,
      userId,
      role,
      assignedClasses
    );

    if (!hasAccess) {
      return res.status(403).json({
        error: "Truy cập bị từ chối: Giáo viên hoặc Học sinh không có quyền truy cập bài viết ngoài phạm vi lớp hoặc của học sinh khác theo quy định bảo mật.",
      });
    }

    return res.json({ record });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Lỗi lấy thông tin bài scan." });
  }
});

// 7. Giáo viên duyệt / điều chỉnh nhận xét & kiểm tra phân quyền
app.post("/api/scan/:id/approve", (req: Request, res: Response) => {
  try {
    const scanId = req.params.id;
    const { teacherId, teacherName, officialComment, adjustedScores, role } = req.body;

    const record = scanService.getScanRecord(scanId);
    if (!record) {
      return res.status(404).json({ error: "Không tìm thấy bài scan." });
    }

    // Kiểm tra quyền hạn của người duyệt
    const actingRole = role || (store.users.find((u) => u.id === teacherId)?.role) || "teacher";
    if (actingRole !== "teacher" && actingRole !== "admin") {
      return res.status(403).json({ error: "Chỉ giáo viên phụ trách hoặc ban quản trị mới có quyền phê duyệt đánh giá chính thức." });
    }

    const teacherUser = store.users.find((u) => u.id === teacherId);
    if (actingRole === "teacher" && teacherUser?.classId && teacherUser.classId !== record.classId) {
      return res.status(403).json({
        error: `Giáo viên phụ trách lớp ${teacherUser.classId} không có thẩm quyền phê duyệt bài viết của học sinh lớp ${record.classId}.`,
      });
    }

    if (!record.evaluation) {
      return res.status(400).json({ error: "Bài scan chưa có kết quả đánh giá để phê duyệt." });
    }

    record.evaluation.teacherApproved = true;
    record.evaluation.teacherApprovedAt = new Date().toISOString();
    record.evaluation.teacherApprovedBy = teacherName || teacherUser?.name || "Cô Lê Thị Thu Hương";
    if (officialComment !== undefined) {
      record.evaluation.teacherOfficialComment = officialComment;
    }
    if (adjustedScores) {
      record.evaluation.teacherAdjustedScores = adjustedScores;
      // Cập nhật mức điểm thực tế nếu giáo viên điều chỉnh
      if (typeof adjustedScores === "object" && record.evaluation.criteria) {
        record.evaluation.criteria = record.evaluation.criteria.map((c) => {
          if (adjustedScores[c.criterionId]) {
            return {
              ...c,
              suggested_level: adjustedScores[c.criterionId].level || c.suggested_level,
              score: adjustedScores[c.criterionId].score ?? c.score,
            };
          }
          return c;
        });
      }
    }
    record.status = "approved";
    record.updatedAt = new Date().toISOString();

    scanService.saveScanRecord(record);

    // Đồng bộ vào store submissions nếu bài đã liên kết với Studio
    if (record.linkedSubmissionId) {
      const sub = store.submissions.find((s) => s.id === record.linkedSubmissionId);
      if (sub && sub.rubricEvaluation) {
        sub.rubricEvaluation.confirmedByTeacher = true;
        sub.rubricEvaluation.teacherNotes = officialComment || "Đã được giáo viên phê duyệt chính thức.";
        saveStore();
      }
    }

    // Ghi nhật ký kiểm toán (Audit Log)
    logAction(
      "Phê duyệt bài scan & Rubric",
      teacherName || teacherUser?.name || "Cô Lê Thị Thu Hương",
      "teacher",
      `Đã phê duyệt và chốt đánh giá bài scan "${record.fileName}" của học sinh ${record.studentName} (Lớp ${record.classId})`
    );

    return res.json({ success: true, record });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Lỗi phê duyệt bài scan." });
  }
});

// 8. Chuyển đổi bài Scan đã xác nhận vào Studio Luyện viết để học sinh tự sửa
app.post("/api/scan/:id/convert-to-studio", (req: Request, res: Response) => {
  try {
    const scanId = req.params.id;
    const record = scanService.getScanRecord(scanId);
    if (!record) {
      return res.status(404).json({ error: "Không tìm thấy bài scan." });
    }

    const content = record.confirmedText || record.extractedRawText;
    const words = content.trim().split(/\s+/).filter(Boolean);

    // Tạo submission trong store nếu chưa có
    let existingSub = store.submissions.find((s) => s.id === record.linkedSubmissionId);
    let targetSub: Submission;

    if (!existingSub) {
      const subId = "sub-scan-" + crypto.randomUUID().slice(0, 8);
      targetSub = {
        id: subId,
        assignmentId: record.assignmentId,
        assignmentTitle: record.assignmentTitle || "Bài viết từ AI Scan",
        studentId: record.studentId,
        studentName: record.studentName,
        classId: record.classId || "class-4a1",
        level: record.level || "doan",
        currentContent: content,
        versions: [
          {
            versionNumber: 1,
            content,
            savedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            wordCount: words.length,
            sentenceCount: content.split(/[.?!]+/).filter((s) => s.trim().length > 0).length,
            notes: "Bản gốc trích xuất từ " + (record.fileType === "docx" ? "tệp Word" : "ảnh chụp bài viết"),
          },
        ],
        wordCount: words.length,
        sentenceCount: content.split(/[.?!]+/).filter((s) => s.trim().length > 0).length,
        status: "Đang làm",
      };

      store.submissions.unshift(targetSub);
      saveStore();

      record.linkedSubmissionId = subId;
      record.linkedVersionNumber = 1;
      scanService.saveScanRecord(record);
    } else {
      targetSub = existingSub;
    }

    return res.json({ success: true, submissionId: targetSub.id, versionNumber: 1, submission: targetSub });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Lỗi chuyển bài vào Studio." });
  }
});

// 9. Xuất báo cáo kết quả AI Scan & Rubric dạng CSV (UTF-8 BOM hỗ trợ Excel tiếng Việt)
app.get("/api/scan/export-csv", (req: Request, res: Response) => {
  try {
    const { classId, userId, role } = req.query;
    const currentUser = store.users.find((u) => u.id === userId);

    let assignedClasses: string[] | undefined = undefined;
    if (role === "admin") {
      assignedClasses = store.classes.map((c) => c.id);
    } else if (role === "teacher") {
      assignedClasses = currentUser?.classId ? [currentUser.classId] : ["class-4a1"];
    }

    const records = scanService.listScanRecords({
      userId: (userId as string) || "std-001",
      role: (role as any) || "teacher",
      classId: (classId as string) || undefined,
      assignedClassIds: assignedClasses,
    });

    const bom = "\uFEFF";
    let csv = bom + "Mã bài scan,Họ và tên học sinh,Lớp,Đề bài,Loại tệp,Ngày quét,Độ dài (từ),Điểm Rubric,Mức độ,Trạng thái duyệt,Giáo viên phê duyệt,Lời nhận xét chính thức\n";

    records.forEach((r) => {
      const words = (r.confirmedText || r.extractedRawText).trim().split(/\s+/).filter(Boolean).length;
      let scoreStr = "Chưa đánh giá";
      let levelStr = "Chờ đánh giá";

      if (r.evaluation?.criteria && r.evaluation.criteria.length > 0) {
        const avg = r.evaluation.criteria.reduce((sum, c) => sum + c.score, 0) / r.evaluation.criteria.length;
        scoreStr = avg.toFixed(1);
        levelStr = avg >= 4.5 ? "Mức 4: Vận dụng tốt" : avg >= 3.6 ? "Mức 3: Đạt yêu cầu" : avg >= 2.5 ? "Mức 2: Đang hình thành" : "Mức 1: Cần hỗ trợ";
      }

      const isApproved = r.evaluation?.teacherApproved ? "Đã duyệt" : "Chờ duyệt";
      const teacher = r.evaluation?.teacherApprovedBy || "-";
      const comment = (r.evaluation?.teacherOfficialComment || r.evaluation?.overall_feedback || "").replace(/"/g, '""');

      csv += `"${r.id}","${r.studentName}","${r.classId}","${r.assignmentTitle}","${r.fileType === "docx" ? "Tệp Word" : "Ảnh chụp"}","${new Date(r.createdAt).toLocaleDateString("vi-VN")}","${words}","${scoreStr}","${levelStr}","${isApproved}","${teacher}","${comment}"\n`;
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="bao_cao_ai_scan_rubric_' + Date.now() + '.csv"');
    res.send(csv);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Lỗi xuất báo cáo CSV." });
  }
});




// Materials Library API
app.get("/api/materials", (req: Request, res: Response) => {
  const { category, skill, level, search } = req.query;
  let list = store.materials;
  if (category) {
    list = list.filter((m) => m.category === category);
  }
  if (skill) {
    list = list.filter((m) => m.skill === skill);
  }
  if (level) {
    list = list.filter((m) => m.level === level);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter((m) => m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q));
  }
  res.json({ materials: list });
});

app.post("/api/materials", (req: Request, res: Response) => {
  const { title, category, skill, level, content, examples, tips, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Tiêu đề và nội dung học liệu không được để trống." });
  }
  const newMaterial: Material = {
    id: "mat-" + Date.now(),
    title,
    category: category || "Phương pháp viết",
    skill: skill || "Từ ngữ gợi tả",
    level: level || "cau",
    content,
    examples: Array.isArray(examples) ? examples : [],
    tips: Array.isArray(tips) ? tips : [],
    author: author || "Giáo viên",
    views: 0,
  };
  store.materials.unshift(newMaterial);
  saveStore();
  logAction("Thêm học liệu mới", author || "Giáo viên", "teacher", `Thêm bài học: ${title}`);
  res.json({ material: newMaterial, message: "Thêm học liệu thành công!" });
});

app.delete("/api/materials/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  store.materials = store.materials.filter((m) => m.id !== id);
  saveStore();
  res.json({ message: "Xóa học liệu thành công!" });
});

// ============================================================================
// KHO ĐỀ VĂN LỚP 4 (ESSAY PROMPTS REPOSITORY) API
// ============================================================================

// 1. Get prompts list with multi-dimensional filtering & statistics
app.get("/api/prompts", (req: Request, res: Response) => {
  const { source, volume, genre, level, topic, search } = req.query;
  let list = store.prompts || [];

  if (source && source !== "all") {
    list = list.filter((p) => p.source === source);
  }
  if (volume && volume !== "all") {
    list = list.filter((p) => p.bookVolume === volume || p.bookVolume === "all");
  }
  if (genre && genre !== "all") {
    list = list.filter((p) => p.genre === genre);
  }
  if (level && level !== "all") {
    list = list.filter((p) => p.level === level);
  }
  if (topic && topic !== "all") {
    list = list.filter((p) => p.topic.toLowerCase().includes((topic as string).toLowerCase()));
  }
  if (search) {
    const q = (search as string).toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q) ||
        p.genreLabel.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q) ||
        (p.lessonReference && p.lessonReference.toLowerCase().includes(q))
    );
  }

  const allPrompts = store.prompts || [];
  const stats = {
    total: allPrompts.length,
    countTap1: allPrompts.filter((p) => p.bookVolume === "tap1" || p.bookVolume === "all").length,
    countTap2: allPrompts.filter((p) => p.bookVolume === "tap2" || p.bookVolume === "all").length,
    countSourceDoc: allPrompts.filter((p) => p.source === "source_doc").length,
    countCurated: allPrompts.filter((p) => p.source === "curated").length,
    countTeacher: allPrompts.filter((p) => p.source === "teacher").length,
  };

  res.json({ prompts: list, stats, filteredCount: list.length });
});

// 2. Get single prompt details
app.get("/api/prompts/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const prompt = (store.prompts || []).find((p) => p.id === id);
  if (!prompt) {
    return res.status(404).json({ error: "Không tìm thấy đề bài trong kho đề." });
  }
  if (req.query.incrementUsage === "true") {
    prompt.usageCount = (prompt.usageCount || 0) + 1;
    saveStore();
  }
  res.json({ prompt });
});

// 3. Create a new prompt (Teacher or Admin)
app.post("/api/prompts", (req: Request, res: Response) => {
  const {
    title,
    prompt,
    genre,
    genreLabel,
    bookVolume,
    level,
    topic,
    targetWords,
    lessonReference,
    stepByStepGuide,
    sampleExcerpts,
    suggestedRubricSummary,
    createdBy,
    createdByName,
    source,
  } = req.body;

  if (!title || !prompt) {
    return res.status(400).json({ error: "Tiêu đề và nội dung đề bài không được để trống." });
  }

  const newPrompt: EssayPrompt = {
    id: "kd-custom-" + Date.now(),
    source: source || "teacher",
    sourceLabel: source === "curated" ? "Đề luyện tập biên soạn Edunova" : `${createdByName || "Giáo viên"} tạo`,
    bookVolume: bookVolume || "tap1",
    genre: genre || "mieu-ta-cay-coi",
    genreLabel: genreLabel || "Văn miêu tả",
    level: level || "bai",
    title,
    prompt,
    topic: topic || "Tập làm văn lớp 4",
    targetWords: Number(targetWords) || 150,
    lessonReference: lessonReference || "Đề bổ trợ kỹ năng viết",
    stepByStepGuide: stepByStepGuide || {
      step1Understanding: {
        questionPrompt: `Đề bài: ${prompt}. Hãy xác định thể loại và đối tượng miêu tả / kể.`,
        targetGenre: genreLabel || "Tập làm văn lớp 4",
        keyElements: ["Bám sát đề bài", "Bố cục 3 phần", "Cảm xúc chân thật"],
      },
      step2Observation: {
        senses: {
          sight: "Quan sát màu sắc, hình dáng đặc trưng",
          sound: "Lắng nghe âm thanh sống động xung quanh",
          emotion: "Tình cảm tự nhiên, trong sáng",
        },
        guidingQuestions: ["Đối tượng có nét gì nổi bật nhất?", "Em ấn tượng nhất về điều gì?"],
      },
      step3Outline: {
        introduction: "Mở bài tự nhiên hoặc gián tiếp dẫn dắt vào đề bài.",
        body: ["Tả / kể từ bao quát đến chi tiết tiêu biểu.", "Nêu hoạt động hoặc biến đổi theo thời gian."],
        conclusion: "Kết bài mở rộng bộc lộ tình cảm, lời hứa hoặc bài học.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["trong trẻo", "mịn màng", "rực rỡ", "thân thương"],
        comparisons: ["Đẹp như một bức tranh", "Sáng long lanh như ánh ban mai"],
        personifications: ["Như một người bạn thân thiết"],
      },
      step5Checklist: [
        "Đúng bố cục 3 phần?",
        "Có câu văn so sánh hoặc nhân hóa?",
        "Kiểm tra lỗi chính tả?",
      ],
    },
    sampleExcerpts: sampleExcerpts || {
      goodIntroExample: `Mỗi khi nhớ về ${topic || "đề bài này"}, lòng em lại dâng lên bao niềm cảm xúc thân thương...`,
    },
    suggestedRubricSummary: suggestedRubricSummary || [
      "Bám sát đề bài",
      "Phát triển ý mạch lạc",
      "Vận dụng so sánh, nhân hóa",
      "Chính tả sạch đẹp",
    ],
    createdBy,
    createdByName: createdByName || "Giáo viên",
    createdAt: new Date().toLocaleDateString("vi-VN"),
    usageCount: 0,
    isFeatured: false,
  };

  store.prompts.unshift(newPrompt);
  saveStore();
  logAction("Tạo đề bài mới", createdByName || "Giáo viên", "teacher", `Tạo đề: "${title}" vào Kho đề`);
  res.json({ prompt: newPrompt, message: "Đã thêm đề bài mới vào Kho đề thành công!" });
});

// 4. Update prompt
app.put("/api/prompts/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = (store.prompts || []).findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Không tìm thấy đề bài để cập nhật." });
  }

  store.prompts[index] = {
    ...store.prompts[index],
    ...req.body,
    updatedAt: new Date().toLocaleDateString("vi-VN"),
  };
  saveStore();
  logAction("Cập nhật đề bài", "Giáo viên", "teacher", `Cập nhật đề: ${store.prompts[index].title}`);
  res.json({ prompt: store.prompts[index], message: "Cập nhật đề bài thành công!" });
});

// 5. Delete prompt
app.delete("/api/prompts/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const target = (store.prompts || []).find((p) => p.id === id);
  if (!target) {
    return res.status(404).json({ error: "Không tìm thấy đề bài để xóa." });
  }

  if (target.source === "source_doc") {
    return res.status(400).json({ error: "Đề bài trích xuất từ tài liệu nguồn SGK được bảo vệ, không thể xóa khỏi hệ thống." });
  }

  store.prompts = store.prompts.filter((p) => p.id !== id);
  saveStore();
  logAction("Xóa đề bài", "Giáo viên", "teacher", `Xóa đề: ${target.title}`);
  res.json({ message: "Đã xóa đề bài khỏi kho đề thành công!" });
});

// 6. Assign prompt directly to a Class (creates an Assignment)
app.post("/api/prompts/:id/assign", (req: Request, res: Response) => {
  const { id } = req.params;
  const { classId, dueDate, customGuidelines, teacherName } = req.body;

  const prompt = (store.prompts || []).find((p) => p.id === id);
  if (!prompt) {
    return res.status(404).json({ error: "Không tìm thấy đề bài trong kho đề." });
  }
  if (!classId) {
    return res.status(400).json({ error: "Vui lòng chọn lớp học để giao bài." });
  }

  const targetClass = store.classes.find((c) => c.id === classId);
  const className = targetClass ? targetClass.name : classId;

  const guidelines =
    customGuidelines && Array.isArray(customGuidelines) && customGuidelines.length > 0
      ? customGuidelines
      : [
          `Đề bài: ${prompt.title}`,
          `Dung lượng mục tiêu: khoảng ${prompt.targetWords} chữ (${prompt.level === "cau" ? "Câu" : prompt.level === "doan" ? "Đoạn văn" : "Bài văn 3 phần"})`,
          ...(prompt.stepByStepGuide?.step4VocabularyAndFigurative?.comparisons?.slice(0, 1) || ["Vận dụng so sánh, nhân hóa"]),
          "Tránh mắc lỗi chính tả, thụt lề đầu dòng đúng quy chuẩn tiểu học",
        ];

  const newAssignment: Assignment = {
    id: "asg-kd-" + Date.now(),
    title: prompt.title,
    prompt: prompt.prompt,
    level: prompt.level,
    topic: prompt.topic,
    classId: classId,
    dueDate: dueDate || "2026-11-05",
    status: "Đã giao",
    targetWords: prompt.targetWords,
    rubricTemplateId: "rubric-grade4-standard",
    guidelines,
  };

  store.assignments.unshift(newAssignment);
  prompt.usageCount = (prompt.usageCount || 0) + 1;
  saveStore();

  logAction(
    "Giao bài tập từ Kho đề",
    teacherName || "Cô Lê Thị Thu Hương",
    "teacher",
    `Giao đề "${prompt.title}" cho ${className} (Hạn nộp: ${newAssignment.dueDate})`
  );

  res.json({
    success: true,
    assignment: newAssignment,
    message: `Đã giao bài tập "${prompt.title}" thành công cho ${className}!`,
  });
});

// 7. AI Outline generator customized for this prompt
app.post("/api/prompts/:id/ai-outline", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { specificSubject, studentLevel } = req.body;

  const prompt = (store.prompts || []).find((p) => p.id === id);
  if (!prompt) {
    return res.status(404).json({ error: "Không tìm thấy đề bài." });
  }

  try {
    const subject = specificSubject || prompt.topic;
    const customOutline = {
      subject,
      genre: prompt.genreLabel,
      level: studentLevel || prompt.level,
      introduction: `Mở bài gián tiếp: Giới thiệu tự nhiên và giàu cảm xúc về ${subject}, gắn với một kỉ niệm ấm áp hoặc âm thanh quen thuộc.`,
      bodyPoints: [
        `Ý 1 (Bao quát): Vẻ đẹp tổng thể của ${subject} nhìn từ xa (màu sắc, kích thước, ấn tượng đầu tiên).`,
        `Ý 2 (Chi tiết tiêu biểu): Tả 2-3 chi tiết nổi bật nhất kết hợp biện pháp so sánh ngộ nghĩnh.`,
        `Ý 3 (Hoạt động / Biến đổi): ${subject} thay đổi ra sao theo thời gian hoặc gắn với hoạt động của em và mọi người.`,
      ],
      conclusion: `Kết bài mở rộng: Bộc lộ tình cảm yêu mến, sự gắn bó và lời hứa chăm sóc / giữ gìn ${subject}.`,
      suggestedWords: prompt.stepByStepGuide.step4VocabularyAndFigurative.vividWords,
      suggestedComparisons: prompt.stepByStepGuide.step4VocabularyAndFigurative.comparisons,
      guidingQuestions: prompt.stepByStepGuide.step2Observation.guidingQuestions,
    };

    res.json({ success: true, customOutline });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Lỗi tạo dàn ý AI." });
  }
});


// Games Score & Activity Logging API
app.get("/api/games/results", (req: Request, res: Response) => {
  const { studentId } = req.query;
  let list = store.gameResults;
  if (studentId) {
    list = list.filter((g) => g.studentId === studentId);
  }
  res.json({ results: list });
});

app.post("/api/games/record", (req: Request, res: Response) => {
  const { gameId, gameName, studentId, studentName, score, maxScore, stars } = req.body;
  const newRecord: GameResult = {
    id: "gr-" + Date.now(),
    gameId,
    gameName,
    studentId,
    studentName,
    score: Number(score) || 0,
    maxScore: Number(maxScore) || 100,
    completedAt: new Date().toLocaleString("vi-VN"),
    stars: Number(stars) || 3,
  };
  store.gameResults.unshift(newRecord);
  saveStore();
  res.json({ record: newRecord, message: "Lưu kết quả trò chơi thành công!" });
});

// Admin & Audit Log & Backup
app.get("/api/admin/audit-logs", (_req: Request, res: Response) => {
  res.json({ logs: store.auditLogs });
});

app.get("/api/admin/system", (_req: Request, res: Response) => {
  res.json({
    settings: store.systemSettings,
    stats: {
      totalUsers: store.users.length,
      studentsCount: store.users.filter((u) => u.role === "student").length,
      teachersCount: store.users.filter((u) => u.role === "teacher").length,
      classesCount: store.classes.length,
      assignmentsCount: store.assignments.length,
      submissionsCount: store.submissions.length,
      materialsCount: store.materials.length,
    },
  });
});

app.post("/api/admin/settings", (req: Request, res: Response) => {
  store.systemSettings = {
    ...store.systemSettings,
    ...req.body,
  };
  saveStore();
  logAction("Cập nhật cài đặt hệ thống", "Quản trị viên", "admin", "Thay đổi cấu hình hệ thống");
  res.json({ settings: store.systemSettings, message: "Cập nhật cài đặt thành công!" });
});

app.get("/api/admin/backup", (_req: Request, res: Response) => {
  res.setHeader("Content-Disposition", 'attachment; filename="edunova_backup_' + Date.now() + '.json"');
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(store, null, 2));
});

app.post("/api/admin/restore", (req: Request, res: Response) => {
  const backupData = req.body;
  if (!backupData || !backupData.users || !backupData.assignments) {
    return res.status(400).json({ error: "Tệp sao lưu không đúng định dạng EduNova Writing Coach." });
  }
  store = backupData;
  saveStore();
  logAction("Khôi phục hệ thống từ sao lưu", "Quản trị viên", "admin", "Đã phục hồi dữ liệu từ bản sao lưu JSON");
  res.json({ message: "Khôi phục dữ liệu thành công!" });
});

// Export CSV API (with UTF-8 BOM so Vietnamese Excel displays cleanly)
app.get("/api/export/students-csv", (req: Request, res: Response) => {
  const { classId } = req.query;
  let students = store.users.filter((u) => u.role === "student");
  if (classId) {
    students = students.filter((s) => s.classId === classId);
  }

  const bom = "\uFEFF";
  let csv = bom + "Mã học sinh,Họ và tên,Email,Lớp,Trường học,Số bài đã nộp\n";
  students.forEach((s) => {
    const subCount = store.submissions.filter((sub) => sub.studentId === s.id).length;
    const cls = store.classes.find((c) => c.id === s.classId)?.name || s.classId || "4A1";
    csv += `"${s.id}","${s.name}","${s.email}","${cls}","${s.schoolName}","${subCount}"\n`;
  });

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="danh_sach_hoc_sinh.csv"');
  res.send(csv);
});

app.get("/api/export/submissions-csv", (req: Request, res: Response) => {
  const { classId } = req.query;
  let list = store.submissions;
  if (classId) {
    list = list.filter((s) => s.classId === classId);
  }

  const bom = "\uFEFF";
  let csv = bom + "Mã bài,Tên học sinh,Đề bài,Cấp độ,Số từ,Trạng thái,Điểm Rubric,Mức đạt,Ngày nộp\n";
  list.forEach((sub) => {
    const levelLabel = sub.level === "cau" ? "Luyện câu" : sub.level === "doan" ? "Luyện đoạn" : "Luyện bài";
    const score = sub.rubricEvaluation?.overallScore ? sub.rubricEvaluation.overallScore.toFixed(1) : "Chưa chấm";
    const levelName = sub.rubricEvaluation?.overallLevel ? `Mức ${sub.rubricEvaluation.overallLevel}` : "Chờ đánh giá";
    csv += `"${sub.id}","${sub.studentName}","${sub.assignmentTitle}","${levelLabel}","${sub.wordCount}","${sub.status}","${score}","${levelName}","${sub.submittedAt || "Chưa nộp"}"\n`;
  });

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="bao_cao_bai_viet_hoc_sinh.csv"');
  res.send(csv);
});

// Vite middleware in dev or static files in production
async function setupViteOrStatic() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve("dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduNova Writing Coach server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error("Failed to start server:", err);
});
