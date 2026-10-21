import { EduNovaAiService } from "../server/aiService";

// ============================================================================
// EDUNOVA WRITING COACH - KIỂM THỬ TOÀN DIỆN CÁC CHẾ ĐỘ AI (GIAI ĐOẠN 4 - LƯỢT 3)
// ============================================================================

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
  durationMs?: number;
}

const results: TestResult[] = [];

function assert(condition: any, testName: string, failureDetails?: string) {
  if (Boolean(condition)) {
    results.push({ name: testName, passed: true });
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    results.push({ name: testName, passed: false, details: failureDetails });
    console.error(`  ❌ [FAIL] ${testName}: ${failureDetails || "Assertion failed"}`);
  }
}

async function runTestSuite() {
  console.log("====================================================================");
  console.log("🚀 BẮT ĐẦU CHẠY BỘ KIỂM THỬ SƯ PHẠM LỚP 4: EDUNOVA WRITING COACH AI");
  console.log("====================================================================\n");

  const aiService = new EduNovaAiService();

  // --------------------------------------------------------------------------
  // NHÓM 1: KIỂM THỬ CHẾ ĐỘ AI TÌM Ý (BRAINSTORMING - 5 GIÁC QUAN)
  // --------------------------------------------------------------------------
  console.log("📌 [NHÓM 1] Kiểm thử AI Tìm ý (Brainstorming - 5 Giác quan)");

  try {
    const start1 = Date.now();
    const treeRes = await aiService.getBrainstorming("Tả cây phượng vĩ nở hoa đỏ trên sân trường", "bai");
    const dur1 = Date.now() - start1;

    assert(!!treeRes.brainstorm, "Chủ đề Cây cối: Trả về cấu trúc brainstorm hợp lệ");
    assert(!!treeRes.brainstorm.senses?.sight?.wordPills?.length, "Chủ đề Cây cối: Có ngân hàng từ ngữ Thị giác (Mắt thấy)");
    assert(!!treeRes.brainstorm.senses?.sound?.question, "Chủ đề Cây cối: Có câu hỏi gợi mở Thính giác (Tai nghe)");
    assert(!!treeRes.brainstorm.comparisonStarters?.length, "Chủ đề Cây cối: Có gợi ý so sánh ví von cho lớp 4");
    assert(["gemini-3.8-flash", "gemini-cached", "pedagogical-engine"].includes(treeRes.source), "Nguồn xử lý an toàn (AI hoặc Sư phạm Heuristic)");
  } catch (err: any) {
    assert(false, "Chủ đề Cây cối", err.message);
  }

  try {
    const animalRes = await aiService.getBrainstorming("Tả chú mèo mướp ngoan ngoãn bắt chuột", "bai");
    assert(!!animalRes.brainstorm, "Chủ đề Con vật: Trả về cấu trúc brainstorm con vật hợp lệ");
    assert(
      animalRes.brainstorm.senses?.touchSmell?.wordPills?.length > 0,
      "Chủ đề Con vật: Có từ vựng Xúc giác / Mùi hương (vuốt ve, mềm mại...)"
    );
    assert(
      animalRes.brainstorm.senses?.heart?.wordPills?.length > 0,
      "Chủ đề Con vật: Có từ vựng Trái tim cảm nhận & Kỷ niệm"
    );
  } catch (err: any) {
    assert(false, "Chủ đề Con vật", err.message);
  }

  // --------------------------------------------------------------------------
  // NHÓM 2: KIỂM THỬ CHẾ ĐỘ AI LUYỆN VIẾT CÂU (SENTENCE EXPANSION)
  // --------------------------------------------------------------------------
  console.log("\n📌 [NHÓM 2] Kiểm thử AI Luyện viết câu có hình ảnh");

  try {
    const sentRes = await aiService.getSentenceExpansion("Dòng sông quê em chảy qua làng.", "all");
    assert(!!sentRes.expansion, "Câu đơn: Trả về phản hồi rèn câu hợp lệ");
    assert(!!sentRes.expansion.coachQuestion, "Câu đơn: Có câu hỏi Socratic gợi mở tư duy");
    assert(sentRes.expansion.options?.length >= 3, "Câu đơn: Đủ 3 hướng nâng cấp (So sánh, Nhân hóa, Trạng ngữ)");

    const types = sentRes.expansion.options.map((o) => o.type);
    assert(types.includes("comparison"), "Câu đơn: Có hướng 1 - So sánh");
    assert(types.includes("personification"), "Câu đơn: Có hướng 2 - Nhân hóa");
    assert(types.includes("adverb"), "Câu đơn: Có hướng 3 - Mở rộng trạng ngữ");

    const sampleHasPattern = sentRes.expansion.options.every((o) => !!o.samplePattern && !!o.hint);
    assert(sampleHasPattern, "Câu đơn: Mỗi hướng đều có khung mẫu và lời hướng dẫn");
  } catch (err: any) {
    assert(false, "Luyện viết câu", err.message);
  }

  // --------------------------------------------------------------------------
  // NHÓM 3: KIỂM THỬ CHẾ ĐỘ AI LẬP DÀN Ý 3 PHẦN (OUTLINE BUILDER)
  // --------------------------------------------------------------------------
  console.log("\n📌 [NHÓM 3] Kiểm thử AI Lập dàn ý 3 phần chuẩn GDPT Tiếng Việt 4");

  try {
    const outlineRes = await aiService.getOutline("Tả chiếc cặp sách thân yêu đồng hành cùng em", "bai");
    assert(!!outlineRes.outline, "Bài văn: Trả về cấu trúc dàn ý hợp lệ");
    assert(outlineRes.outline.sections?.length === 3, "Bài văn: Đúng 3 phần (Mở bài - Thân bài - Kết bài)");

    const sectionNames = outlineRes.outline.sections.map((s) => s.name);
    assert(sectionNames.some((n) => n.includes("Mở bài")), "Dàn ý: Có phần 1 - Mở bài");
    assert(sectionNames.some((n) => n.includes("Thân bài")), "Dàn ý: Có phần 2 - Thân bài");
    assert(sectionNames.some((n) => n.includes("Kết bài")), "Dàn ý: Có phần 3 - Kết bài");

    const hasGuidingAndConnectors = outlineRes.outline.sections.every(
      (s) => !!s.guidingQuestion && s.checkpoints?.length > 0 && s.suggestedConnectors?.length > 0
    );
    assert(hasGuidingAndConnectors, "Dàn ý: Từng phần đều có câu hỏi định hướng, checkpoints và từ nối");
    assert(!!outlineRes.outline.pedagogicalTip, "Dàn ý: Có lời dặn dò sư phạm ấm áp của Thầy/Cô Trợ lý");
  } catch (err: any) {
    assert(false, "Lập dàn ý bài văn", err.message);
  }

  // --------------------------------------------------------------------------
  // NHÓM 4: KIỂM THỬ AN TOÀN TRẺ EM & CHỐNG GIAN LẬN (CHILD SAFETY & ANTI-CHEAT)
  // --------------------------------------------------------------------------
  console.log("\n📌 [NHÓM 4] Kiểm thử An toàn trẻ em & Chống gian lận (Anti-Ghostwriting)");

  // 4.1. An toàn trẻ em: Phát hiện từ ngữ bạo lực, phản cảm
  const unsafeCheck = aiService.validateInput("Hai bạn học sinh đánh nhau bạo lực ở cổng trường.");
  assert(
    !unsafeCheck.isValid && unsafeCheck.error?.includes("chưa phù hợp"),
    "An toàn trẻ em: Chặn thành công từ ngữ bạo lực và nhắc nhở nhẹ nhàng"
  );

  // 4.2. Chống gian lận: Học sinh nhờ viết hộ cả bài
  const cheatText = "viết hộ em cả bài văn tả cây bàng dài 300 từ cho em nộp cô giáo.";
  const isCheat = aiService.checkAntiCheat(cheatText);
  assert(isCheat, "Chống gian lận: Nhận diện thành công yêu cầu viết hộ");

  try {
    const coachAntiCheat = await aiService.getCoachFeedback({
      level: "bai",
      promptTopic: "Tả cây bàng",
      currentContent: "Cây bàng trường em.",
      studentQuestion: cheatText,
    });
    const note = coachAntiCheat.feedback.pedagogicalNote || "";
    const imp = coachAntiCheat.feedback.improvements?.[0] || "";
    assert(
      imp.includes("không viết thay bài") || note.includes("không cung cấp bài làm sẵn"),
      "Anti-Ghostwriting: Không viết thay bài, giải thích quyền tác giả của học sinh"
    );
    assert(
      coachAntiCheat.feedback.socraticQuestions?.length >= 2,
      "Anti-Ghostwriting: Chuyển hướng sang đặt câu hỏi gợi mở từng bước"
    );
  } catch (err: any) {
    assert(false, "Anti-Ghostwriting Coach", err.message);
  }

  try {
    const sentenceAntiCheat = await aiService.getSentenceExpansion(cheatText);
    assert(
      sentenceAntiCheat.expansion.coachQuestion.includes("không viết thay cả bài"),
      "Anti-Ghostwriting Luyện câu: Từ chối viết thay cả bài và hướng dẫn rèn từng câu"
    );
  } catch (err: any) {
    assert(false, "Anti-Ghostwriting Sentence", err.message);
  }

  try {
    const outlineAntiCheat = await aiService.getOutline(cheatText);
    assert(
      outlineAntiCheat.outline.pedagogicalTip.includes("không viết thay"),
      "Anti-Ghostwriting Dàn ý: Giữ vững nguyên tắc sư phạm không viết thay bài"
    );
  } catch (err: any) {
    assert(false, "Anti-Ghostwriting Outline", err.message);
  }

  // --------------------------------------------------------------------------
  // NHÓM 5: KIỂM THỬ GIỚI HẠN TẦN SUẤT & ĐỘ DÀI (RATE LIMITING & LIMITS)
  // --------------------------------------------------------------------------
  console.log("\n📌 [NHÓM 5] Kiểm thử Giới hạn tần suất (Rate Limiting) & Độ dài");

  // 5.1. Kiểm tra độ dài trống
  const emptyCheck = aiService.validateInput("");
  assert(!emptyCheck.isValid, "Độ dài: Từ chối bài viết rỗng");

  // 5.2. Kiểm tra bài viết quá dài (>8000 ký tự)
  const hugeText = "Bài văn lớp 4 ".repeat(700);
  const lengthCheck = aiService.validateInput(hugeText);
  assert(!lengthCheck.isValid && lengthCheck.error?.includes("8.000 ký tự"), "Độ dài: Giới hạn tối đa 8.000 ký tự cho học sinh lớp 4");

  // 5.3. Rate Limiting: 6 request/phút
  const testClientId = "test-pupil-rate-limit-" + Date.now();
  let rateExceeded = false;
  for (let i = 1; i <= 7; i++) {
    const rl = aiService.checkRateLimit(testClientId);
    if (!rl.allowed) {
      rateExceeded = true;
      break;
    }
  }
  assert(rateExceeded, "Rate Limiting: Kích hoạt giới hạn 6 lượt/phút để tránh lạm dụng AI");

  // --------------------------------------------------------------------------
  // NHÓM 6: KIỂM THỬ CHẾ ĐỘ SƯ PHẠM DỰ PHÒNG KHI OFFLINE (PEDAGOGICAL FALLBACK)
  // --------------------------------------------------------------------------
  console.log("\n📌 [NHÓM 6] Kiểm thử Chế độ Sư phạm dự phòng (Offline Fallback Resilience)");

  // Mô phỏng fallback của Heuristic Engine
  try {
    const fallbackSentence = (aiService as any).generateFallbackSentenceExpansion("Con chim nhỏ bay lượn trên bầu trời xanh.");
    assert(!!fallbackSentence.coachQuestion, "Fallback Luyện câu: Có câu hỏi gợi mở hoàn chỉnh");
    assert(fallbackSentence.options?.length === 3, "Fallback Luyện câu: Đầy đủ 3 mẫu so sánh, nhân hóa, trạng ngữ");
    assert(fallbackSentence.vocabularyPills?.length > 0, "Fallback Luyện câu: Có ngân hàng từ vựng gợi cảm");

    const fallbackBrainstorm = (aiService as any).generateFallbackBrainstorm("Tả dòng sông quê em");
    assert(!!fallbackBrainstorm.senses?.sight?.wordPills?.length, "Fallback Tìm ý: Đủ ngân hàng từ ngữ 4 giác quan");
    assert(!!fallbackBrainstorm.comparisonStarters?.length, "Fallback Tìm ý: Đủ mẫu so sánh dự phòng");

    const fallbackOutline = (aiService as any).generateFallbackOutline("Tả cây ăn quả", "bai");
    assert(fallbackOutline.sections?.length === 3, "Fallback Dàn ý: Đủ 3 phần Mở bài, Thân bài, Kết bài");
  } catch (err: any) {
    assert(false, "Pedagogical Fallback Resilience", err.message);
  }

  // --------------------------------------------------------------------------
  // TỔNG KẾT BÁO CÁO KIỂM THỬ
  // --------------------------------------------------------------------------
  console.log("\n====================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(`📊 TỔNG KẾT KẾT QUẢ KIỂM THỬ AI COACH:`);
  console.log(`   - Tổng số kịch bản kiểm tra : ${total}`);
  console.log(`   - Số kịch bản THÀNH CÔNG   : ${passed} ✅`);
  console.log(`   - Số kịch bản THẤT BẠI     : ${failed} ${failed === 0 ? "🎉 (HOÀN HẢO 100%)" : "❌"}`);
  console.log("====================================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch((err) => {
  console.error("Test runner fatal error:", err);
  process.exit(1);
});
