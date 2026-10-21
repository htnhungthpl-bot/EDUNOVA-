import assert from "assert";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

async function runTests() {
  console.log("🚀 Bắt đầu bộ kiểm thử toàn diện module KHO ĐỀ VĂN LỚP 4 (Bộ sách Kết nối tri thức)...\n");

  let totalTests = 0;
  let passedTests = 0;

  async function test(name: string, fn: () => Promise<void>) {
    totalTests++;
    process.stdout.write(`[Test ${totalTests}] ${name} ... `);
    try {
      await fn();
      passedTests++;
      console.log("✅ ĐẠT");
    } catch (err: any) {
      console.log("❌ THẤT BẠI:", err.message);
      throw err;
    }
  }

  // Nhóm 1: Kiểm thử lấy danh sách đề bài & Thống kê
  await test("GET /api/prompts trả về danh sách đề bài và thống kê tổng hợp", async () => {
    const res = await fetch(`${BASE_URL}/api/prompts`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(Array.isArray(data.prompts), "prompts phải là mảng");
    assert(data.prompts.length >= 18, "Phải có ít nhất 18 đề bài trong kho đề");
    assert(data.stats, "Phải có đối tượng stats");
    assert(data.stats.total >= 18, "Tổng số đề >= 18");
    assert(data.stats.countSourceDoc > 0, "Phải có đề trích xuất từ tài liệu nguồn SGK");
    assert(data.stats.countTap1 > 0, "Phải có đề Tập Một");
    assert(data.stats.countTap2 > 0, "Phải có đề Tập Hai");
  });

  // Nhóm 2: Kiểm thử lọc theo Học kì (Tập 1 & Tập 2)
  await test("Lọc đề theo Tập Một (Học kì 1)", async () => {
    const res = await fetch(`${BASE_URL}/api/prompts?volume=tap1`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.prompts.length > 0);
    data.prompts.forEach((p: any) => {
      assert(p.bookVolume === "tap1" || p.bookVolume === "all", "Mỗi đề phải thuộc Tập 1 hoặc cả năm");
    });
  });

  await test("Lọc đề theo Tập Hai (Học kì 2)", async () => {
    const res = await fetch(`${BASE_URL}/api/prompts?volume=tap2`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.prompts.length > 0);
    data.prompts.forEach((p: any) => {
      assert(p.bookVolume === "tap2" || p.bookVolume === "all", "Mỗi đề phải thuộc Tập 2 hoặc cả năm");
    });
  });

  // Nhóm 3: Kiểm thử lọc theo Nguồn gốc (source_doc, curated, teacher)
  await test("Lọc đề theo nguồn Tài liệu nguồn SGK (source_doc)", async () => {
    const res = await fetch(`${BASE_URL}/api/prompts?source=source_doc`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.prompts.length >= 12, "Tài liệu nguồn SGK phải có ít nhất 12 bài");
    data.prompts.forEach((p: any) => {
      assert.strictEqual(p.source, "source_doc");
      assert(p.sourceLabel.includes("KNTT") || p.sourceLabel.includes("SGK") || p.sourceLabel.includes("Vở BT"));
    });
  });

  await test("Lọc đề theo nguồn Biên soạn chuyên sâu (curated)", async () => {
    const res = await fetch(`${BASE_URL}/api/prompts?source=curated`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.prompts.length > 0);
    data.prompts.forEach((p: any) => {
      assert.strictEqual(p.source, "curated");
    });
  });

  // Nhóm 4: Kiểm thử bao phủ đủ 8 thể loại chuẩn GDPT 2018 Lớp 4
  await test("Bao phủ đầy đủ 8 thể loại Tập làm văn lớp 4 Kết nối tri thức", async () => {
    const genres = [
      "thuat-lai-su-viec",
      "viet-don",
      "doan-van-neu-y-kien",
      "mieu-ta-con-vat",
      "doan-van-tinh-cam",
      "mieu-ta-cay-coi",
      "huong-dan-cong-viec",
      "tuong-tuong",
    ];

    for (const g of genres) {
      const res = await fetch(`${BASE_URL}/api/prompts?genre=${g}`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert(data.prompts.length > 0, `Thể loại ${g} phải có ít nhất 1 đề bài`);
    }
  });

  // Nhóm 5: Kiểm thử cấu trúc 5 bước sư phạm trong từng đề bài
  await test("Kiểm tra chi tiết đề bài chứa đủ quy trình 5 bước và đoạn văn mẫu", async () => {
    const res = await fetch(`${BASE_URL}/api/prompts/kd-kntt-t2-12?incrementUsage=true`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    const p = data.prompt;
    assert.strictEqual(p.id, "kd-kntt-t2-12");
    assert(p.stepByStepGuide, "Phải có stepByStepGuide");
    assert(p.stepByStepGuide.step1Understanding, "Phải có Bước 1: Hiểu đề");
    assert(p.stepByStepGuide.step2Observation, "Phải có Bước 2: Quan sát");
    assert(p.stepByStepGuide.step2Observation.senses, "Phải có 5 giác quan");
    assert(p.stepByStepGuide.step3Outline, "Phải có Bước 3: Dàn ý 3 phần");
    assert(p.stepByStepGuide.step4VocabularyAndFigurative, "Phải có Bước 4: Vốn từ và So sánh/Nhân hóa");
    assert(p.stepByStepGuide.step5Checklist.length > 0, "Phải có Bước 5: Checklist");
    assert(p.sampleExcerpts, "Phải có đoạn văn mẫu");
    assert(p.usageCount > 0, "Lượt sử dụng phải tăng khi incrementUsage=true");
  });

  // Nhóm 6: Kiểm thử tìm kiếm từ khóa
  await test("Tìm kiếm đề bài theo từ khóa 'cây bàng' hoặc 'phượng vĩ'", async () => {
    const res = await fetch(`${BASE_URL}/api/prompts?search=b%C3%A0ng`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.prompts.length > 0, "Phải tìm thấy đề có từ bàng");
    assert(data.prompts.some((p: any) => p.title.toLowerCase().includes("bàng")));
  });

  // Nhóm 7: Kiểm thử Tạo mới đề bài (dành cho Giáo viên)
  let createdPromptId = "";
  await test("POST /api/prompts cho phép giáo viên tạo đề bài mới", async () => {
    const newPromptData = {
      title: "Tả cây ổi chín vàng thơm lừng sau hè nhà em",
      prompt: "Em hãy miêu tả cây ổi trong vườn nhà từ lúc hoa trắng nở đến khi quả chín thơm lừng.",
      genre: "mieu-ta-cay-coi",
      genreLabel: "Văn miêu tả cây cối",
      bookVolume: "tap2",
      level: "bai",
      topic: "Cây ăn quả",
      targetWords: 180,
      lessonReference: "Đề thi thử học kì 2 - Lớp 4A1",
      createdBy: "tea-001",
      createdByName: "Cô Lê Thị Thu Hương",
      source: "teacher",
    };

    const res = await fetch(`${BASE_URL}/api/prompts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPromptData),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.prompt, "Phải trả về đề bài vừa tạo");
    assert.strictEqual(data.prompt.title, newPromptData.title);
    assert.strictEqual(data.prompt.source, "teacher");
    createdPromptId = data.prompt.id;
  });

  // Nhóm 8: Kiểm thử Cập nhật và Xóa đề bài
  await test("PUT /api/prompts/:id cập nhật nội dung đề bài", async () => {
    assert(createdPromptId, "Cần ID đề bài vừa tạo");
    const res = await fetch(`${BASE_URL}/api/prompts/${createdPromptId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetWords: 210 }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.prompt.targetWords, 210);
  });

  await test("Bảo vệ đề tài liệu nguồn SGK không bị xóa nhầm", async () => {
    const res = await fetch(`${BASE_URL}/api/prompts/kd-kntt-t1-01`, {
      method: "DELETE",
    });
    assert.strictEqual(res.status, 400, "Phải chặn xóa đề tài liệu nguồn");
    const data = await res.json();
    assert(data.error.includes("bảo vệ"), "Cần thông báo lỗi bảo vệ đề nguồn");
  });

  await test("DELETE /api/prompts/:id cho phép xóa đề do giáo viên tạo", async () => {
    assert(createdPromptId);
    const res = await fetch(`${BASE_URL}/api/prompts/${createdPromptId}`, {
      method: "DELETE",
    });
    assert.strictEqual(res.status, 200);
  });

  // Nhóm 9: Kiểm thử Giao đề bài cho lớp học (Tạo Assignment tự động)
  await test("POST /api/prompts/:id/assign giao đề cho lớp 4A1", async () => {
    const res = await fetch(`${BASE_URL}/api/prompts/kd-kntt-t2-12/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classId: "class-4a1",
        dueDate: "2026-11-10",
        customGuidelines: [
          "Tả cây bàng theo trình tự 4 mùa",
          "Dùng ít nhất 2 câu so sánh",
          "Không mắc lỗi chính tả l/n",
        ],
        teacherName: "Cô Lê Thị Thu Hương",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.success);
    assert(data.assignment, "Phải tạo bài tập mới");
    assert.strictEqual(data.assignment.classId, "class-4a1");
    assert(data.assignment.title.includes("cây bàng"));

    // Kiểm tra trong danh sách assignments của lớp
    const asgRes = await fetch(`${BASE_URL}/api/assignments?classId=class-4a1`);
    const asgData = await asgRes.json();
    const created = asgData.assignments.find((a: any) => a.id === data.assignment.id);
    assert(created, "Bài tập phải xuất hiện trong danh sách bài tập lớp 4A1");
  });

  // Nhóm 10: Kiểm thử Sinh dàn ý AI cá nhân hóa theo đề bài
  await test("POST /api/prompts/:id/ai-outline tạo dàn ý cá nhân hóa", async () => {
    const res = await fetch(`${BASE_URL}/api/prompts/kd-kntt-t1-08/ai-outline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        specificSubject: "Chú mèo tam thể Miu Miu",
        studentLevel: "bai",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.success);
    assert(data.customOutline, "Phải có customOutline");
    assert(data.customOutline.subject.includes("Miu Miu"));
    assert(data.customOutline.bodyPoints.length >= 3, "Dàn ý phải có ít nhất 3 ý chính");
    assert(data.customOutline.suggestedWords.length > 0, "Phải có từ ngữ gợi ý");
  });

  // Nhóm 11: Kiểm tra tính toàn vẹn hệ thống & Không ảnh hưởng module cũ
  await test("Kiểm tra trạng thái hệ thống và bảo toàn các phân hệ hiện có", async () => {
    const statusRes = await fetch(`${BASE_URL}/api/status`);
    assert.strictEqual(statusRes.status, 200);
    const status = await statusRes.json();
    assert.strictEqual(status.status, "ok");
    assert(status.totalStudents > 0);
    assert(status.totalAssignments > 0);

    // Kiểm tra API Scan & Rubric
    const scanRecRes = await fetch(`${BASE_URL}/api/scan/list`);
    assert.strictEqual(scanRecRes.status, 200);

    // Kiểm tra API Submissions
    const subRes = await fetch(`${BASE_URL}/api/submissions`);
    assert.strictEqual(subRes.status, 200);
  });

  console.log(`\n🎉 HOÀN THÀNH: Đã vượt qua toàn bộ ${passedTests}/${totalTests} kịch bản kiểm thử (100% SUCCESS)!`);
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
