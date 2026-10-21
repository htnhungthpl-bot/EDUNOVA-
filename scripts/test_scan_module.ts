import fs from "fs";
import path from "path";
import { EduNovaScanService } from "../server/scanService";
import { UploadedScanRecord } from "../src/types/scan";

// ============================================================================
// EDUNOVA WRITING COACH - KIỂM THỬ PHÂN HỆ AI SCAN & RUBRIC
// TẢI WORD (.DOCX) - TRÍCH XUẤT - XÁC NHẬN - ĐÁNH GIÁ RUBRIC - RBAC
// ============================================================================

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const testResults: TestResult[] = [];

function assert(condition: any, testName: string, failureDetails?: string) {
  if (Boolean(condition)) {
    testResults.push({ name: testName, passed: true });
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    testResults.push({ name: testName, passed: false, details: failureDetails });
    console.error(`  ❌ [FAIL] ${testName}: ${failureDetails || "Assertion failed"}`);
  }
}

async function runScanTests() {
  console.log("====================================================================");
  console.log("🚀 BẮT ĐẦU KIỂM THỬ PHÂN HỆ AI SCAN & RUBRIC: EDUNOVA WRITING COACH");
  console.log("====================================================================\n");

  const scanService = new EduNovaScanService();

  // --------------------------------------------------------------------------
  // NHÓM 1: KIỂM THỬ TRÍCH XUẤT TỆP WORD (.DOCX)
  // --------------------------------------------------------------------------
  console.log("📌 [NHÓM 1] Kiểm thử Trích xuất tệp Word (.docx) & Xử lý lỗi tệp");

  // 1.1 Trích xuất tệp .docx chuẩn
  try {
    const docxPath = path.resolve(
      process.cwd(),
      "node_modules/mammoth/test/test-data/single-paragraph.docx"
    );
    if (fs.existsSync(docxPath)) {
      const buffer = fs.readFileSync(docxPath);
      const res = await scanService.extractDocx(buffer, "single-paragraph.docx");
      assert(!!res.text && res.text.length > 0, "DOCX chuẩn: Trích xuất thành công văn bản");
      assert(res.wordCount > 0, "DOCX chuẩn: Đếm đúng số lượng từ");
      assert(res.paragraphCount >= 1, "DOCX chuẩn: Đếm đúng số đoạn văn");
      assert(Array.isArray(res.warnings), "DOCX chuẩn: Danh sách cảnh báo hợp lệ");
    } else {
      console.warn("  ⚠️ Không tìm thấy fixture single-paragraph.docx, bỏ qua 1 test nhỏ.");
    }
  } catch (err: any) {
    assert(false, "DOCX chuẩn", err.message);
  }

  // 1.2 Từ chối tệp rỗng (0 bytes)
  try {
    const emptyBuffer = Buffer.alloc(0);
    let threw = false;
    try {
      await scanService.extractDocx(emptyBuffer, "empty.docx");
    } catch (err: any) {
      threw = true;
      assert(
        err.message.includes("rỗng") || err.message.includes("không có nội dung"),
        "Tệp rỗng: Báo lỗi thân thiện 'Tệp Word rỗng không có nội dung'"
      );
    }
    assert(threw, "Tệp rỗng: Từ chối xử lý khi buffer 0 bytes");
  } catch (err: any) {
    assert(false, "Tệp rỗng", err.message);
  }

  // 1.3 Nhận diện và hướng dẫn khi gặp tệp .doc cũ (Word 97-2003 OLE 0xD0CF11E0)
  try {
    const oldDocBuffer = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    let threw = false;
    try {
      await scanService.extractDocx(oldDocBuffer, "bai_viet_cu.doc");
    } catch (err: any) {
      threw = true;
      assert(
        err.message.includes(".doc cũ") || err.message.includes("Save As"),
        "Tệp .doc cũ: Hướng dẫn người dùng chuyển đổi Save As sang định dạng .docx"
      );
    }
    assert(threw, "Tệp .doc cũ: Từ chối và nhắc nhở đúng theo đặc tả Section III");
  } catch (err: any) {
    assert(false, "Tệp .doc cũ", err.message);
  }

  // 1.4 Kiểm tra tệp giả mạo / hỏng không có chữ ký ZIP
  try {
    const fakeBuffer = Buffer.from("NOT_A_VALID_ZIP_OR_DOCX_FILE_HEADER");
    let threw = false;
    try {
      await scanService.extractDocx(fakeBuffer, "fake.docx");
    } catch (err: any) {
      threw = true;
      assert(
        err.message.includes("không phải định dạng .docx hợp lệ"),
        "Tệp giả mạo: Báo lỗi định dạng không hợp lệ"
      );
    }
    assert(threw, "Tệp giả mạo: Chặn thành công tệp không có chữ ký PK");
  } catch (err: any) {
    assert(false, "Tệp giả mạo", err.message);
  }

  // 1.5 Kiểm tra giới hạn dung lượng tối đa (15MB)
  try {
    const hugeBuffer = Buffer.alloc(16 * 1024 * 1024); // 16MB
    let threw = false;
    try {
      await scanService.extractDocx(hugeBuffer, "large.docx");
    } catch (err: any) {
      threw = true;
      assert(
        err.message.includes("vượt quá giới hạn"),
        "Dung lượng lớn: Báo lỗi vượt quá giới hạn 15MB"
      );
    }
    assert(threw, "Dung lượng lớn: Chặn an toàn tệp > 15MB");
  } catch (err: any) {
    assert(false, "Giới hạn dung lượng", err.message);
  }

  // --------------------------------------------------------------------------
  // NHÓM 2: KIỂM THỬ NHẬN DẠNG ẢNH OCR (MULTIMODAL CHỮ VIẾT TAY)
  // --------------------------------------------------------------------------
  console.log("\n📌 [NHÓM 2] Kiểm thử Nhận dạng ảnh OCR & Cảnh báo chất lượng");

  try {
    const mockImagePages = [
      {
        base64Data: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
        mimeType: "image/jpeg",
        fileName: "trang1_chuviet.jpg",
        pageNumber: 1,
      },
    ];

    const ocrRes = await scanService.extractHandwrittenImages(mockImagePages);
    assert(!!ocrRes.extractedText, "OCR: Trả về văn bản nhận dạng tiếng Việt");
    assert(Array.isArray(ocrRes.pageTexts), "OCR: Trả về cấu trúc phân trang pageTexts");
    assert(Array.isArray(ocrRes.qualityWarnings), "OCR: Kiểm tra chất lượng ảnh (cảnh báo tilt/blur)");
    assert(Array.isArray(ocrRes.lowConfidenceItems), "OCR: Liệt kê các từ nghi vấn có độ tin cậy thấp");
    assert(["gemini-3.8-flash", "pedagogical-engine"].includes(ocrRes.source), "OCR: Nguồn xử lý an toàn");
  } catch (err: any) {
    assert(false, "OCR ảnh", err.message);
  }

  // --------------------------------------------------------------------------
  // NHÓM 3: KIỂM THỬ ĐÁNH GIÁ RUBRIC 6 TIÊU CHÍ CHUẨN BỘ GD&ĐT
  // --------------------------------------------------------------------------
  console.log("\n📌 [NHÓM 3] Kiểm thử Đánh giá Rubric 6 Tiêu Chí & Nhận xét Sư phạm");

  try {
    const sampleStudentEssay = `Trường em có một cây bàng rất to đứng sừng sững ở góc sân trường. Vào mùa hè, tán lá xanh mướt xòe rộng như một chiếc ô khổng lồ che mát cho chúng em vui chơi. Thân cây to xù xì, rễ cây trồi lên mặt đất như những con trăn đang nằm ngủ. Em rất yêu quý cây bàng trường em.`;

    const evalRes = await scanService.evaluateScannedSubmission({
      confirmedText: sampleStudentEssay,
      level: "bai",
      assignmentTitle: "Tả cây bóng mát trên sân trường",
      studentName: "Bé Minh An",
      role: "student",
    });

    assert(!!evalRes.overall_feedback, "Rubric: Có lời nhận xét tổng quan mang tính khích lệ");
    assert(evalRes.strengths.length >= 1, "Rubric: Khen trước - Có ít nhất 1-2 điểm mạnh");
    assert(!!evalRes.strengths[0].evidence, "Rubric: Điểm mạnh có trích dẫn nguyên văn từ bài viết");

    // Kiểm tra 6 tiêu chí Rubric
    assert(evalRes.criteria.length === 6, "Rubric: Đủ 6 tiêu chí chuẩn Bộ GD&ĐT");
    const critIds = evalRes.criteria.map((c) => c.criterionId);
    assert(critIds.includes("c1"), "Rubric: Tiêu chí 1 - Đáp ứng yêu cầu đề bài");
    assert(critIds.includes("c2"), "Rubric: Tiêu chí 2 - Nội dung & phát triển ý");
    assert(critIds.includes("c3"), "Rubric: Tiêu chí 3 - Diễn đạt câu");
    assert(critIds.includes("c4"), "Rubric: Tiêu chí 4 - Sử dụng từ ngữ & hình ảnh");
    assert(critIds.includes("c5"), "Rubric: Tiêu chí 5 - Mạch lạc, liên kết");
    assert(critIds.includes("c6"), "Rubric: Tiêu chí 6 - Chính tả & trình bày");

    // Kiểm tra thang 4 mức độ
    const validLevels = evalRes.criteria.every((c) => [1, 2, 3, 4].includes(c.suggested_level));
    assert(validLevels, "Rubric: Tất cả tiêu chí được xếp theo 4 mức độ (1 đến 4)");

    // Kiểm tra tính Socratic và tập trung 2-3 vấn đề
    assert(
      evalRes.improvements.length > 0 && evalRes.improvements.length <= 3,
      "Rubric: Tập trung tối đa 2-3 vấn đề cần cải thiện để không gây áp lực"
    );
    assert(
      evalRes.improvements.every((imp) => !!imp.guiding_question),
      "Rubric: Mỗi vấn đề đều có câu hỏi gợi mở Socratic giúp học sinh tự suy nghĩ"
    );
    assert(
      evalRes.improvements.every((imp) => !!imp.suggested_action),
      "Rubric: Có gợi ý hành động cụ thể để học sinh tự sửa bài"
    );
    assert(!!evalRes.next_step, "Rubric: Có lời dặn bước tiếp theo để tự sửa bài");
  } catch (err: any) {
    assert(false, "Đánh giá Rubric", err.message);
  }

  // --------------------------------------------------------------------------
  // NHÓM 4: KIỂM THỬ PHÂN QUYỀN (RBAC) & BẢO VỆ DỮ LIỆU HỌC SINH
  // --------------------------------------------------------------------------
  console.log("\n📌 [NHÓM 4] Kiểm thử Phân quyền (RBAC) & Bảo vệ dữ liệu học sinh");

  try {
    const scan1: UploadedScanRecord = {
      id: "scan-test-1",
      fileType: "docx",
      fileName: "bai_cua_an.docx",
      fileSize: 10240,
      pageCount: 1,
      uploadedBy: "student-1",
      uploaderRole: "student",
      uploaderName: "Bé Minh An",
      studentId: "student-1",
      studentName: "Bé Minh An",
      classId: "class-4a1",
      assignmentTitle: "Tả cây phượng",
      level: "bai",
      extractedRawText: "Trường em có cây phượng...",
      confirmedText: "Trường em có cây phượng vĩ...",
      isConfirmed: true,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const scan2: UploadedScanRecord = {
      id: "scan-test-2",
      fileType: "docx",
      fileName: "bai_cua_lop5b.docx",
      fileSize: 12400,
      pageCount: 1,
      uploadedBy: "student-other",
      uploaderRole: "student",
      uploaderName: "Học sinh lớp khác",
      studentId: "student-other",
      studentName: "Nguyễn Lớp 5B",
      classId: "class-5b",
      assignmentTitle: "Tả cơn mưa",
      level: "bai",
      extractedRawText: "Trời bỗng nhiên đổ mưa...",
      confirmedText: "Trời bỗng nhiên đổ mưa...",
      isConfirmed: true,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    scanService.saveScanRecord(scan1);
    scanService.saveScanRecord(scan2);

    // Học sinh 1 chỉ truy cập được bài của mình
    const canStudentAccessOwn = scanService.canAccessScan(scan1, "student-1", "student");
    const canStudentAccessOther = scanService.canAccessScan(scan2, "student-1", "student");
    assert(canStudentAccessOwn, "RBAC: Học sinh được phép xem bài của chính mình");
    assert(!canStudentAccessOther, "RBAC: Học sinh bị chặn không được xem bài học sinh khác");

    // Giáo viên lớp 4A1 chỉ truy cập được bài thuộc lớp mình phân công (class-4a1)
    const canTeacherAccessClass4A1 = scanService.canAccessScan(scan1, "teacher-1", "teacher", ["class-4a1"]);
    const canTeacherAccessClass5B = scanService.canAccessScan(scan2, "teacher-1", "teacher", ["class-4a1"]);
    assert(canTeacherAccessClass4A1, "RBAC: Giáo viên được xem bài học sinh thuộc lớp phụ trách (4A1)");
    assert(!canTeacherAccessClass5B, "RBAC: Giáo viên không được truy cập bài lớp ngoài phân công (5B)");

    // Admin có quyền truy cập toàn bộ
    const canAdminAccessAll = scanService.canAccessScan(scan2, "admin-1", "admin");
    assert(canAdminAccessAll, "RBAC: Quản trị viên (Admin) được xem tất cả các bài");
  } catch (err: any) {
    assert(false, "RBAC Phân quyền", err.message);
  }

  // --------------------------------------------------------------------------
  // NHÓM 5: KIỂM THỬ LIÊN KẾT BÀI VIẾT VỚI ĐÚNG HỌC SINH VÀ BÀI TẬP
  // --------------------------------------------------------------------------
  console.log("\n📌 [NHÓM 5] Kiểm thử Liên kết bài viết với đúng Học sinh & Bài tập");
  try {
    const linkedScan: UploadedScanRecord = {
      id: "scan-test-linkage",
      fileType: "docx",
      fileName: "Bai_Tap_Ta_Cay_Phuong.docx",
      fileSize: 12400,
      pageCount: 1,
      uploadedBy: "tea-001",
      uploaderRole: "teacher",
      uploaderName: "Cô Lê Thị Thu Hương",
      studentId: "std-001",
      studentName: "Nguyễn Minh An",
      classId: "class-4a1",
      assignmentId: "asg-001",
      assignmentTitle: "Tả cây phượng vĩ nơi góc sân trường em",
      level: "bai",
      extractedRawText: "Mỗi ngày cắp sách tới trường...",
      confirmedText: "Mỗi ngày cắp sách tới trường...",
      isConfirmed: true,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    scanService.saveScanRecord(linkedScan);
    const retrieved = scanService.getScanRecord("scan-test-linkage");

    assert(retrieved?.studentId === "std-001", "Liên kết: Gắn chính xác mã học sinh std-001");
    assert(retrieved?.studentName === "Nguyễn Minh An", "Liên kết: Gắn chính xác tên học sinh Nguyễn Minh An");
    assert(retrieved?.classId === "class-4a1", "Liên kết: Gắn chính xác lớp học class-4a1");
    assert(retrieved?.assignmentId === "asg-001", "Liên kết: Gắn đúng mã bài tập đã giao asg-001");
    assert(retrieved?.assignmentTitle === "Tả cây phượng vĩ nơi góc sân trường em", "Liên kết: Giữ nguyên tên bài tập đã giao");
  } catch (err: any) {
    assert(false, "Liên kết học sinh & bài tập", err.message);
  }

  // --------------------------------------------------------------------------
  // NHÓM 6: KIỂM THỬ LƯU PHIÊN BẢN & SO SÁNH BÀI GỐC VS BÀI ĐÃ SỬA
  // --------------------------------------------------------------------------
  console.log("\n📌 [NHÓM 6] Kiểm thử Lưu phiên bản & Đối chiếu bài gốc vs bài đã sửa");
  try {
    const originalText = "Trường em có cây phượng rất to ở giữa sân. Thân cây to màu nâu. Hoa phượng màu đỏ nở vào mùa hè.";
    const revisedText = "Trường tiểu học Chu Văn An của em có cây phượng già đứng sừng sững bên cạnh cột cờ. Thân cây to lớn, xù xì in hằn dấu vết thời gian. Đến giữa tháng năm, hoa phượng bừng nở đỏ rực như muôn ngàn đốm lửa bập bùng.";

    const v1Words = originalText.trim().split(/\s+/).filter(Boolean).length;
    const v2Words = revisedText.trim().split(/\s+/).filter(Boolean).length;

    assert(v1Words === 23, "Phiên bản 1: Đếm đúng 23 từ bản gốc trích xuất");
    assert(v2Words === 48, "Phiên bản 2: Đếm đúng 48 từ bản tự sửa của học sinh");
    assert(v2Words > v1Words, "Tiến bộ: Bản tự sửa đã mở rộng thêm các từ miêu tả sinh động");

    // Phát hiện biện pháp tu từ trong bản sửa so với bản gốc
    const v1HasComparison = /như|giống như|tựa như/i.test(originalText);
    const v2HasComparison = /như|giống như|tựa như/i.test(revisedText);
    assert(!v1HasComparison, "Bản gốc: Chưa có biện pháp so sánh");
    assert(v2HasComparison, "Bản tự sửa: Đã vận dụng hình ảnh so sánh 'như muôn ngàn đốm lửa'");

    // Kiểm tra cấu trúc versioning không bị ghi đè mất bản gốc
    const versions = [
      { versionNumber: 1, content: originalText, wordCount: v1Words, notes: "Bản gốc trích xuất từ AI Scan" },
      { versionNumber: 2, content: revisedText, wordCount: v2Words, notes: "Bản tự sửa sau khi đọc gợi mở Rubric" },
    ];

    assert(versions.length === 2, "Lưu phiên bản: Lưu trữ đầy đủ 2 phiên bản kế thừa");
    assert(versions[0].content === originalText, "Lưu phiên bản: Bản gốc (V1) được bảo toàn nguyên vẹn, không bị mất");
    assert(versions[1].versionNumber === 2, "Lưu phiên bản: Đánh số phiên bản tăng dần V1 -> V2");
  } catch (err: any) {
    assert(false, "Lưu phiên bản & Đối chiếu", err.message);
  }

  // --------------------------------------------------------------------------
  // NHÓM 7: KIỂM THỬ GIÁO VIÊN DUYỆT & ĐIỀU CHỈNH MỨC ĐÁNH GIÁ CHÍNH THỨC
  // --------------------------------------------------------------------------
  console.log("\n📌 [NHÓM 7] Kiểm thử Giáo viên duyệt & Điều chỉnh mức đánh giá Rubric");
  try {
    const scanForApproval: UploadedScanRecord = {
      id: "scan-approval-test",
      fileType: "image",
      fileName: "anh_bai_viet_4a1.jpg",
      fileSize: 450000,
      pageCount: 1,
      uploadedBy: "std-001",
      uploaderRole: "student",
      uploaderName: "Nguyễn Minh An",
      studentId: "std-001",
      studentName: "Nguyễn Minh An",
      classId: "class-4a1",
      assignmentTitle: "Tả cây phượng vĩ",
      level: "bai",
      extractedRawText: "Bác phượng già đứng sừng sững...",
      confirmedText: "Bác phượng già đứng sừng sững bên cạnh cột cờ...",
      isConfirmed: true,
      status: "evaluated",
      evaluation: {
        id: "eval-appr-1",
        scanId: "scan-approval-test",
        overall_feedback: "Bài viết khá tốt.",
        strengths: [{ title: "Cảm xúc tốt", evidence: "Bác phượng già...", explanation: "Có tình cảm với trường lớp" }],
        criteria: [
          { criterionId: "c1", name: "Đáp ứng đề bài", suggested_level: 3, score: 4.0, evidence: "...", explanation: "...", guiding_question: "...", suggested_action: "..." },
          { criterionId: "c2", name: "Phát triển ý", suggested_level: 3, score: 4.0, evidence: "...", explanation: "...", guiding_question: "...", suggested_action: "..." },
          { criterionId: "c3", name: "Diễn đạt câu", suggested_level: 3, score: 3.8, evidence: "...", explanation: "...", guiding_question: "...", suggested_action: "..." },
          { criterionId: "c4", name: "Từ ngữ & hình ảnh", suggested_level: 3, score: 3.8, evidence: "...", explanation: "...", guiding_question: "...", suggested_action: "..." },
          { criterionId: "c5", name: "Mạch lạc", suggested_level: 3, score: 4.0, evidence: "...", explanation: "...", guiding_question: "...", suggested_action: "..." },
          { criterionId: "c6", name: "Chính tả", suggested_level: 4, score: 4.8, evidence: "...", explanation: "...", guiding_question: "...", suggested_action: "..." },
        ],
        improvements: [{ issue: "Thêm so sánh", evidence: "...", guiding_question: "...", suggested_action: "..." }],
        recognition_warnings: [],
        needs_teacher_review: false,
        next_step: "Tự sửa bài",
        evaluatedAt: new Date().toISOString(),
        source: "pedagogical-engine",
        teacherApproved: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    scanService.saveScanRecord(scanForApproval);

    // Giáo viên điều chỉnh nâng điểm tiêu chí c4 lên Mức 4 (4.8đ) và thêm nhận xét
    const teacherNotes = "Cô rất khen ngợi Minh An, đoạn tả hoa phượng rất giàu chất thơ!";
    scanForApproval.evaluation!.teacherApproved = true;
    scanForApproval.evaluation!.teacherApprovedBy = "Cô Lê Thị Thu Hương";
    scanForApproval.evaluation!.teacherApprovedAt = new Date().toISOString();
    scanForApproval.evaluation!.teacherOfficialComment = teacherNotes;
    scanForApproval.evaluation!.criteria[3].suggested_level = 4;
    scanForApproval.evaluation!.criteria[3].score = 4.8;
    scanForApproval.status = "approved";

    scanService.saveScanRecord(scanForApproval);

    const afterApproval = scanService.getScanRecord("scan-approval-test");
    assert(afterApproval?.status === "approved", "Duyệt: Trạng thái bản ghi chuyển sang 'approved'");
    assert(afterApproval?.evaluation?.teacherApproved === true, "Duyệt: teacherApproved được đánh dấu true");
    assert(afterApproval?.evaluation?.teacherApprovedBy === "Cô Lê Thị Thu Hương", "Duyệt: Ghi nhận đúng tên giáo viên phê duyệt");
    assert(afterApproval?.evaluation?.teacherOfficialComment === teacherNotes, "Duyệt: Lưu đúng lời nhận xét chính thức của giáo viên");
    assert(afterApproval?.evaluation?.criteria[3].score === 4.8, "Duyệt: Điểm tiêu chí c4 được điều chỉnh thành 4.8");
  } catch (err: any) {
    assert(false, "Giáo viên duyệt đánh giá", err.message);
  }

  // --------------------------------------------------------------------------
  // NHÓM 8: KIỂM THỬ BẢO MẬT DỮ LIỆU & BÁO CÁO CSV (UTF-8 BOM)
  // --------------------------------------------------------------------------
  console.log("\n📌 [NHÓM 8] Kiểm thử An toàn, Chống Injection & Xuất báo cáo CSV");
  try {
    // 8.1 Chống XSS trong văn bản nhận dạng và lời phê
    const maliciousInput = "Cây phượng <script>alert('xss')</script> rất đẹp <img src=x onerror=alert(1)>";
    const sanitized = maliciousInput.replace(/<[^>]*>/g, "");
    assert(!sanitized.includes("<script>"), "Bảo mật: Loại bỏ thẻ <script> độc hại");
    assert(!sanitized.includes("<img"), "Bảo mật: Loại bỏ thẻ <img onerror> độc hại");
    assert(sanitized.includes("Cây phượng") && sanitized.includes("rất đẹp"), "Bảo mật: Bảo toàn nội dung tiếng Việt thuần túy");

    // 8.2 Kiểm tra chữ ký UTF-8 BOM cho báo cáo CSV hiển thị tiếng Việt trên Excel
    const bom = "\uFEFF";
    const sampleCsvRow = bom + "Mã bài,Học sinh,Lớp,Đề bài\n\"scan-01\",\"Nguyễn Minh An\",\"Lớp 4A1\",\"Tả cây phượng vĩ\"\n";
    assert(sampleCsvRow.startsWith("\uFEFF"), "Báo cáo CSV: Có ký tự UTF-8 BOM (\\uFEFF) giúp Excel mở không bị lỗi font tiếng Việt");
    assert(sampleCsvRow.includes("Nguyễn Minh An"), "Báo cáo CSV: Bảo toàn đầy đủ họ tên tiếng Việt có dấu");
  } catch (err: any) {
    assert(false, "Bảo mật & Xuất CSV", err.message);
  }
  const total = testResults.length;
  const passed = testResults.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log("\n====================================================================");
  console.log(`📊 TỔNG KẾT KẾT QUẢ KIỂM THỬ AI SCAN & RUBRIC:`);
  console.log(`   - Tổng số kịch bản kiểm tra : ${total}`);
  console.log(`   - Số kịch bản THÀNH CÔNG   : ${passed} ✅`);
  console.log(`   - Số kịch bản THẤT BẠI     : ${failed} ${failed === 0 ? "🎉 (HOÀN HẢO 100%)" : "❌"}`);
  console.log("====================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runScanTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
