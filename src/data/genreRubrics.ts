import { PromptGenre, WritingLevel } from "../types";
import { ScanRubricCriterion } from "../types/scan";

// ============================================================================
// HỆ THỐNG RUBRIC ĐÁNH GIÁ LINH HOẠT THEO DẠNG BÀI LỚP 4
// TIẾNG VIỆT 4 - BỘ KẾT NỐI TRI THỨC VỚI CUỘC SỐNG (CHƯƠNG TRÌNH GDPT 2018)
// ============================================================================

export interface GenreRubricDefinition {
  genre: PromptGenre;
  genreLabel: string;
  icon: string;
  description: string;
  defaultLevel: WritingLevel;
  // 6 tiêu chí chuẩn chuyên biệt cho thể loại
  criteriaTemplates: Array<{
    criterionId: string;
    name: string;
    description: string;
    guidingQuestions: string[];
    suggestedActions: string[];
  }>;
}

export const GENRE_RUBRICS_MAP: Record<PromptGenre, GenreRubricDefinition> = {
  // 1. THUẬT LẠI MỘT SỰ VIỆC (KỂ CHUYỆN, CHUYẾN ĐI, HOẠT ĐỘNG, LỄ HỘI)
  "thuat-lai-su-viec": {
    genre: "thuat-lai-su-viec",
    genreLabel: "Thuật lại một sự việc (Kể chuyện)",
    icon: "📖",
    description: "Kể lại một chuyến đi, một việc tốt, một buổi lao động hoặc một hoạt động lễ hội theo trình tự thời gian.",
    defaultLevel: "bai",
    criteriaTemplates: [
      {
        criterionId: "c1_su_viec_thoi_gian",
        name: "1. Giới thiệu sự việc & Thời gian, địa điểm",
        description: "Mở đầu nêu rõ tên sự việc được thuật lại, thời gian, địa điểm và những người cùng tham gia (mở bài trực tiếp hoặc gián tiếp).",
        guidingQuestions: [
          "Em đã nêu rõ sự việc đó diễn ra khi nào và ở đâu chưa?",
          "Ai là những người cùng tham gia với em?",
        ],
        suggestedActions: [
          "Bổ sung câu mở đầu giới thiệu thời gian (Một buổi sáng mùa thu, nhân dịp nghỉ hè...) và địa điểm cụ thể.",
        ],
      },
      {
        criterionId: "c2_dien_bien_hanh_dong",
        name: "2. Diễn biến sự việc & Chi tiết hành động",
        description: "Thuật lại các hành động, hoạt động chính theo trình tự diễn biến rõ ràng, có điểm nhấn hoặc chi tiết bất ngờ, thú vị.",
        guidingQuestions: [
          "Sự việc bắt đầu, tiếp diễn và kết thúc như thế nào?",
          "Có chi tiết hay hành động nào làm em nhớ nhất không?",
        ],
        suggestedActions: [
          "Tập trung kể kỹ hơn vào lúc sự việc sôi nổi nhất thay vì chỉ liệt kê chung chung.",
        ],
      },
      {
        criterionId: "c3_nhan_vat_loi_noi",
        name: "3. Nhân vật & Lời nói, cử chỉ",
        description: "Miêu tả nét mặt, cử chỉ, tiếng cười nói hoặc lời đối thoại tự nhiên giữa các nhân vật.",
        guidingQuestions: [
          "Các bạn hoặc người thân đã nói câu gì đáng nhớ trong lúc đó?",
          "Cử chỉ, nụ cười của mọi người ra sao?",
        ],
        suggestedActions: [
          "Thêm 1-2 câu thoại ngắn hoặc miêu tả tiếng reo hò, tiếng vỗ tay của mọi người.",
        ],
      },
      {
        criterionId: "c4_tu_ngu_chuyen_tiep",
        name: "4. Từ ngữ liên kết & Chuyển tiếp thời gian",
        description: "Sử dụng các từ nối thời gian mạch lạc như: 'Trước hết', 'Đầu tiên', 'Tiếp đó', 'Sau đó', 'Bỗng nhiên', 'Cuối cùng'.",
        guidingQuestions: [
          "Các đoạn văn của em đã có từ nối để chuyển ý giữa các giai đoạn chưa?",
        ],
        suggestedActions: [
          "Đặt từ chuyển tiếp (Ví dụ: 'Sau khi hoàn thành phần việc thứ nhất,...') ở đầu đoạn thân bài.",
        ],
      },
      {
        criterionId: "c5_cam_xuc_bai_hoc",
        name: "5. Cảm xúc & Ý nghĩa / Bài học rút ra",
        description: "Bộc lộ niềm vui, niềm tự hào, sự gắn bó hoặc bài học sâu sắc mà em nhận được sau sự việc (kết bài mở rộng).",
        guidingQuestions: [
          "Sau chuyến đi hoặc sự việc đó, em cảm thấy thế nào và học được điều gì mới?",
        ],
        suggestedActions: [
          "Viết thêm 1-2 câu kết bài mở rộng chia sẻ mong ước hoặc bài học tự rèn luyện của bản thân.",
        ],
      },
      {
        criterionId: "c6_chinh_ta_trinh_bay",
        name: "6. Chính tả, ngắt câu & Bố cục 3 phần",
        description: "Đoạn văn thụt đầu dòng, dấu câu ngắt nghỉ nhịp nhàng, viết đúng chính tả các phụ âm đầu dễ lẫn (l/n, s/x, tr/ch, d/gi).",
        guidingQuestions: [
          "Em đã chấm câu đầy đủ sau mỗi ý trọn vẹn chưa?",
          "Có từ nào viết nhầm dấu hỏi/ngã không?",
        ],
        suggestedActions: [
          "Đọc to bài viết để phát hiện những câu quá dài cần tách thành 2 câu ngắn.",
        ],
      },
    ],
  },

  // 2. MIÊU TẢ CÂY CỐI
  "mieu-ta-cay-coi": {
    genre: "mieu-ta-cay-coi",
    genreLabel: "Bài văn miêu tả cây cối",
    icon: "🌳",
    description: "Miêu tả cây bóng mát, cây hoa hoặc cây ăn quả quen thuộc (bao quát, từng bộ phận, đa giác quan, biện pháp tu từ).",
    defaultLevel: "bai",
    criteriaTemplates: [
      {
        criterionId: "c1_gioi_thieu_cay_bo_cuc",
        name: "1. Giới thiệu cây & Bố cục 3 phần",
        description: "Giới thiệu rõ ràng loài cây được miêu tả, cây trồng ở đâu, do ai trồng (mở bài gián tiếp cuốn hút; bố cục rõ Mở - Thân - Kết).",
        guidingQuestions: [
          "Em đã chọn cách mở bài trực tiếp hay gián tiếp để dẫn dắt vào hình ảnh cây chưa?",
          "Bài văn có đủ 3 phần rõ rệt không?",
        ],
        suggestedActions: [
          "Thử mở bài gián tiếp bằng một kỷ niệm mùa hè hoặc một câu thơ về loài cây này.",
        ],
      },
      {
        criterionId: "c2_trinh_tu_quan_sat",
        name: "2. Trình tự quan sát (Bao quát & Từng thời kỳ)",
        description: "Quan sát từ xa đến lại gần (tổng thể dáng cây đến gốc, rễ, thân, cành, lá, hoa, quả) hoặc quan sát theo từng mùa / thời kỳ sinh trưởng.",
        guidingQuestions: [
          "Nhìn từ xa, dáng cây trông giống như vật gì khổng lồ?",
          "Khi lại gần, thân cây và gốc rễ có những nét đặc biệt nào?",
        ],
        suggestedActions: [
          "Thêm một câu tả dáng đứng sừng sững của cây khi nhìn từ xa trước khi đi vào tả chi tiết gốc cây.",
        ],
      },
      {
        criterionId: "c3_da_giac_quan",
        name: "3. Vận dụng đa giác quan (Thị giác, Thính giác, Xúc giác...)",
        description: "Miêu tả màu sắc, ánh sáng, tiếng xào xạc của vòm lá trong gió, hương thơm thoang thoảng của hoa hoặc cảm giác chạm vào vỏ cây.",
        guidingQuestions: [
          "Khi đứng dưới gốc cây, em nghe thấy âm thanh gì (gió reo, tiếng chim hót...)?",
          "Mùi hương của hoa hoặc quả chín thoang thoảng thế nào?",
        ],
        suggestedActions: [
          "Bổ sung chi tiết về thính giác (tiếng lá rung rinh) hoặc khứu giác (hương thơm dìu dịu).",
        ],
      },
      {
        criterionId: "c4_so_sanh_nhan_hoa",
        name: "4. Biện pháp so sánh & Nhân hóa sinh động",
        description: "Sử dụng từ ngữ so sánh độc đáo ('như', 'tựa như', 'tựa hồ') và nhân hóa cây cối như một người bạn thân thiết ('bác bàng', 'chị phượng').",
        guidingQuestions: [
          "Những chiếc lá hoặc tán cây trông giống như thứ gì quen thuộc gần gũi?",
          "Em đã gọi hoặc tả cây cối như con người ở những hành động nào?",
        ],
        suggestedActions: [
          "Ví cành lá đan xen như những cánh tay dang rộng che mát cho đàn em thơ.",
        ],
      },
      {
        criterionId: "c5_tinh_cam_loi_ich",
        name: "5. Lợi ích của cây & Tình cảm gắn bó",
        description: "Nêu bật lợi ích của cây (cho bóng mát, quả ngọt, làm đẹp cảnh quan) và tình cảm yêu mến, chăm sóc của em (kết bài mở rộng).",
        guidingQuestions: [
          "Cây đã mang lại cho em và các bạn những kỷ niệm đẹp đẽ nào?",
          "Em có lời hứa hoặc mong ước gì cho sự phát triển của cây?",
        ],
        suggestedActions: [
          "Nêu lời hứa sẽ cùng các bạn tưới nước, giữ gìn không bẻ cành hái lá.",
        ],
      },
      {
        criterionId: "c6_chinh_ta_ngu_phap",
        name: "6. Chính tả, ngắt đoạn & Diễn đạt trong sáng",
        description: "Viết câu đủ chủ ngữ - vị ngữ, thụt đầu dòng các đoạn thân bài, không mắc lỗi lặp từ hay sai chính tả phụ âm đầu.",
        guidingQuestions: [
          "Em có bị lặp lại quá nhiều lần từ 'cây' ở đầu mỗi câu không?",
        ],
        suggestedActions: [
          "Thay thế bớt bằng các đại từ như: 'bác phượng già', 'tán lá xanh biếc', 'cây bóng mát thân thương'.",
        ],
      },
    ],
  },

  // 3. MIÊU TẢ CON VẬT
  "mieu-ta-con-vat": {
    genre: "mieu-ta-con-vat",
    genreLabel: "Bài văn miêu tả con vật",
    icon: "🐾",
    description: "Miêu tả con vật nuôi trong nhà hoặc con vật hoang dã quen thuộc (ngoại hình, hoạt động, tính nết, tình cảm chăm sóc).",
    defaultLevel: "bai",
    criteriaTemplates: [
      {
        criterionId: "c1_gioi_thieu_con_vat",
        name: "1. Giới thiệu con vật & Bố cục bài văn",
        description: "Mở bài giới thiệu con vật được miêu tả (con vật nuôi từ khi nào, do ai tặng hay nhìn thấy ở đâu); bố cục 3 phần rõ ràng.",
        guidingQuestions: [
          "Con vật này tên là gì, thuộc giống nào và gắn bó với gia đình em bao lâu rồi?",
        ],
        suggestedActions: [
          "Mở bài bằng tiếng sủa mừng rỡ hoặc tiếng kêu meo meo quen thuộc mỗi khi em đi học về.",
        ],
      },
      {
        criterionId: "c2_dac_diem_ngoai_hinh",
        name: "2. Đặc điểm ngoại hình & Nét đáng yêu",
        description: "Miêu tả hình dáng, vóc dáng, bộ lông, đôi mắt tinh nhanh, đôi tai vểnh, cái mũi ươn ướt, móng vuốt hoặc chiếc đuôi ngoe nguẩy.",
        guidingQuestions: [
          "Bộ lông của chú có màu gì và sờ vào có cảm giác mềm mượt ra sao?",
          "Đôi mắt chú trong veo như hai hòn bi ve thế nào?",
        ],
        suggestedActions: [
          "Dùng từ láy gợi hình (mũm mĩm, mượt mà, đen láy, thoăn thoắt) để làm nổi bật ngoại hình.",
        ],
      },
      {
        criterionId: "c3_hoat_dong_thoi_quen",
        name: "3. Hoạt động & Thói quen sinh hoạt",
        description: "Tả chi tiết các hoạt động đặc trưng: cách rình mồi, ăn uống, ngủ nghỉ sưởi nắng, đón chủ về hoặc chơi đùa cùng đồ vật.",
        guidingQuestions: [
          "Khi mừng chủ về, con vật có những cử chỉ đáng yêu nào?",
          "Lúc chú săn mồi hoặc gặm thức ăn diễn ra khéo léo ra sao?",
        ],
        suggestedActions: [
          "Chọn một khoảnh khắc ngộ nghĩnh nhất để tả sâu, ví dụ như lúc chú mèo cuộn tròn sưởi nắng.",
        ],
      },
      {
        criterionId: "c4_bien_phap_tu_tu",
        name: "4. So sánh & Nhân hóa con vật ngộ nghĩnh",
        description: "Gọi con vật bằng đại từ xưng hô thân mật ('anh bạn nhỏ', 'chú nhóc'), so sánh hành động hoặc đôi mắt với hình ảnh sinh động.",
        guidingQuestions: [
          "Em có ví đôi mắt hoặc chiếc mũi của chú với vật gì quen thuộc không?",
          "Chú có những nét tính cách gì giống như một đứa trẻ nhỏ?",
        ],
        suggestedActions: [
          "Ví chiếc đuôi chú ngoe nguẩy như chiếc chổi lông nhỏ đang quét qua quét lại vui sướng.",
        ],
      },
      {
        criterionId: "c5_tinh_cam_cham_soc",
        name: "5. Tình cảm của em & Kỷ niệm gắn bó",
        description: "Bộc lộ tình cảm yêu quý, hành động chăm sóc (cho ăn, tắm rửa, vuốt ve) và coi con vật như một thành viên thân yêu trong gia đình.",
        guidingQuestions: [
          "Em thường chăm sóc và trò chuyện với chú như thế nào?",
          "Có kỷ niệm đáng nhớ nào giữa em và chú không?",
        ],
        suggestedActions: [
          "Bổ sung kỷ niệm lúc chú bị ốm hoặc lúc chú mừng rỡ quấn quýt bên chân em.",
        ],
      },
      {
        criterionId: "c6_chinh_ta_ngu_phap",
        name: "6. Chính tả, ngắt đoạn & Diễn đạt trôi chảy",
        description: "Trình bày các đoạn thân bài rành mạch (tách riêng đoạn ngoại hình và đoạn hoạt động), câu văn mạch lạc, không sai chính tả.",
        guidingQuestions: [
          "Em đã tách riêng đoạn tả ngoại hình và đoạn tả thói quen hoạt động chưa?",
        ],
        suggestedActions: [
          "Xuống dòng và lùi ô để bắt đầu đoạn văn mới khi chuyển từ tả ngoại hình sang tả hoạt động.",
        ],
      },
    ],
  },

  // 4. ĐOẠN VĂN NÊU Ý KIẾN (VỀ BÀI ĐỌC, CÂU CHUYỆN, NHÂN VẬT)
  "doan-van-neu-y-kien": {
    genre: "doan-van-neu-y-kien",
    genreLabel: "Đoạn văn nêu ý kiến (Cảm nghĩ về bài đọc)",
    icon: "💡",
    description: "Bày tỏ ý kiến tán thành/yêu thích hoặc không tán thành về một câu chuyện, bài thơ, nhân vật hoặc hành động.",
    defaultLevel: "doan",
    criteriaTemplates: [
      {
        criterionId: "c1_cau_mo_doan_y_kien",
        name: "1. Câu mở đoạn nêu rõ ý kiến / Nhận xét chung",
        description: "Nêu rõ tên câu chuyện/bài thơ/nhân vật và khẳng định ý kiến yêu thích, khâm phục hoặc đồng tình của em ngay ở câu đầu tiên.",
        guidingQuestions: [
          "Câu đầu tiên của em đã nêu được tên nhân vật/câu chuyện và thái độ của em chưa?",
        ],
        suggestedActions: [
          "Bắt đầu đoạn văn bằng câu: 'Trong câu chuyện..., nhân vật... đã để lại cho em ấn tượng sâu sắc nhất bởi...'",
        ],
      },
      {
        criterionId: "c2_li_le_giai_thich",
        name: "2. Lí lẽ giải thích thuyết phục (Vì sao?)",
        description: "Đưa ra 1-2 lí lẽ rõ ràng giải thích nguyên nhân vì sao em yêu thích hoặc đồng tình (phẩm chất dũng cảm, lòng nhân hậu, sự chăm chỉ...).",
        guidingQuestions: [
          "Vì sao em lại khâm phục hoặc yêu quý nhân vật đó?",
          "Phẩm chất nổi bật nhất của nhân vật là gì?",
        ],
        suggestedActions: [
          "Sử dụng các từ lập luận như: 'Trước hết, em khâm phục nhân vật bởi vì...', 'Không những thế,...'",
        ],
      },
      {
        criterionId: "c3_dan_chung_cu_the",
        name: "3. Dẫn chứng cụ thể từ câu chuyện",
        description: "Trích dẫn được hành động, lời nói hoặc chi tiết cụ thể trong văn bản để làm sáng tỏ lí lẽ đã nêu.",
        guidingQuestions: [
          "Chi tiết hoặc hành động nào trong câu chuyện chứng minh cho phẩm chất đó?",
        ],
        suggestedActions: [
          "Kể lại ngắn gọn chi tiết tiêu biểu nhất (Ví dụ: 'Điều đó được thể hiện rõ qua chi tiết khi...').",
        ],
      },
      {
        criterionId: "c4_cau_ket_doan_khang_dinh",
        name: "4. Câu kết đoạn khẳng định & Bài học liên hệ",
        description: "Câu cuối đoạn khẳng định lại ý kiến, nêu tình cảm trân trọng hoặc bài học liên hệ bản thân em rút ra được.",
        guidingQuestions: [
          "Câu kết đoạn đã khẳng định lại tình cảm của em và bài học cho bản thân chưa?",
        ],
        suggestedActions: [
          "Kết thúc bằng câu: 'Hình ảnh nhân vật nhắc nhở em phải luôn... trong học tập và cuộc sống.'",
        ],
      },
      {
        criterionId: "c5_tu_ngu_lap_luan_bieu_cam",
        name: "5. Từ ngữ lập luận & Biểu cảm",
        description: "Dùng từ ngữ thể hiện quan điểm và cảm xúc trong sáng: 'theo em', 'em nhận thấy', 'chi tiết làm em xúc động nhất', 'thật đáng khâm phục'.",
        guidingQuestions: [
          "Đoạn văn của em đã có những từ ngữ biểu lộ cảm xúc chân thành chưa?",
        ],
        suggestedActions: [
          "Thêm từ ngữ biểu cảm để lời văn không bị khô khan.",
        ],
      },
      {
        criterionId: "c6_quy_chuan_doan_van",
        name: "6. Quy chuẩn hình thức đoạn văn & Chính tả",
        description: "Đúng hình thức 1 đoạn văn: lùi đầu dòng viết hoa, các câu viết nối tiếp nhau không xuống dòng tùy tiện, chấm câu chuẩn xác.",
        guidingQuestions: [
          "Em có lỡ tay xuống dòng ở giữa đoạn văn không?",
        ],
        suggestedActions: [
          "Đoạn văn cần viết liền mạch từ đầu đến câu kết, chỉ xuống dòng khi kết thúc toàn bộ đoạn.",
        ],
      },
    ],
  },

  // 5. ĐOẠN VĂN NÊU TÌNH CẢM, CẢM XÚC
  "doan-van-tinh-cam": {
    genre: "doan-van-tinh-cam",
    genreLabel: "Đoạn văn nêu tình cảm, cảm xúc (Người thân, quê hương)",
    icon: "❤️",
    description: "Bày tỏ tình cảm yêu thương, lòng biết ơn với cha mẹ, ông bà, thầy cô hoặc tình yêu quê hương, đất nước.",
    defaultLevel: "doan",
    criteriaTemplates: [
      {
        criterionId: "c1_doi_tuong_cam_xuc",
        name: "1. Xác định đối tượng & Câu chủ đề",
        description: "Câu mở đoạn giới thiệu rõ ràng người thân hoặc cảnh đẹp quê hương khơi nguồn cảm xúc yêu thương thiết tha trong lòng em.",
        guidingQuestions: [
          "Ai là người em muốn gửi gắm tình cảm yêu thương nhất trong đoạn văn này?",
        ],
        suggestedActions: [
          "Nêu ngay tình cảm bao la, kính yêu đối với người thân ngay ở câu mở đoạn.",
        ],
      },
      {
        criterionId: "c2_hinh_anh_chi_tiet_goi_nho",
        name: "2. Chi tiết, hình ảnh khơi gợi cảm xúc",
        description: "Chọn được những hình ảnh thân thương: đôi bàn tay chai sần của mẹ, mái tóc pha sương của bà, ánh mắt ấm áp của thầy cô hoặc cánh đồng lúa chín.",
        guidingQuestions: [
          "Chi tiết nào ở người thân khiến em xúc động nhất mỗi khi nhớ về?",
        ],
        suggestedActions: [
          "Miêu tả cụ thể một hành động chăm sóc ân cần mà người thân dành cho em hàng ngày.",
        ],
      },
      {
        criterionId: "c3_tu_ngu_bieu_cam",
        name: "3. Từ ngữ bộc lộ cảm xúc chân thành",
        description: "Sử dụng các từ ngữ chỉ rung động trái tim: 'kính yêu', 'xúc động', 'ấm áp', 'biết ơn vô hạn', 'thắt lòng', 'tự hào'.",
        guidingQuestions: [
          "Những từ ngữ nào thể hiện lòng biết ơn sâu nặng của em?",
        ],
        suggestedActions: [
          "Thay thế những từ ngữ chung chung bằng các từ ngữ biểu cảm tinh tế và ấm áp hơn.",
        ],
      },
      {
        criterionId: "c4_hinh_anh_so_sanh_am_ap",
        name: "4. Hình ảnh so sánh giàu ý nghĩa",
        description: "Vận dụng biện pháp so sánh ngọt ngào để khắc họa tình cảm thiêng liêng (Ví dụ: bàn tay mẹ ấm như ánh nắng ban mai).",
        guidingQuestions: [
          "Em có thể so sánh giọng nói hoặc nụ cười của mẹ với thứ gì êm dịu nhất không?",
        ],
        suggestedActions: [
          "Thêm hình ảnh so sánh: 'Nụ cười của bà hiền từ như bà tiên trong truyện cổ tích'.",
        ],
      },
      {
        criterionId: "c5_loi_hua_uoc_nguyen",
        name: "5. Lời hứa & Mong ước tương lai",
        description: "Bày tỏ mong ước người thân luôn mạnh khỏe, bình an và lời hứa ngoan ngoãn, học giỏi để đền đáp công ơn sinh thành, dạy dỗ.",
        guidingQuestions: [
          "Em hứa sẽ làm gì để cha mẹ hoặc thầy cô vui lòng?",
        ],
        suggestedActions: [
          "Kết thúc đoạn bằng lời hứa chân thành và mong ước người thân luôn mãi ở bên em.",
        ],
      },
      {
        criterionId: "c6_chinh_ta_ngu_phap",
        name: "6. Diễn đạt truyền cảm & Quy cách đoạn văn",
        description: "Câu văn giàu nhạc điệu, ngắt nhịp nhẹ nhàng, giữ đúng thể thức 1 đoạn văn, không mắc lỗi chính tả.",
        guidingQuestions: [
          "Giọng văn đã toát lên được sự ấm áp, truyền cảm chưa?",
        ],
        suggestedActions: [
          "Đọc diễn cảm lại đoạn văn để cảm nhận nhịp điệu của từng câu chữ.",
        ],
      },
    ],
  },

  // 6. ĐOẠN VĂN / BÀI VĂN TƯỞNG TƯỢNG
  "tuong-tuong": {
    genre: "tuong-tuong",
    genreLabel: "Đoạn văn / Bài văn tưởng tượng",
    icon: "🚀",
    description: "Sáng tạo thế giới kì ảo: đồ vật/con vật biết nói chuyện, du hành tương lai, hoặc viết đoạn kết mới cho câu chuyện cổ tích.",
    defaultLevel: "doan",
    criteriaTemplates: [
      {
        criterionId: "c1_tinh_huong_tuong_tuong",
        name: "1. Tình huống bất ngờ & Ý tưởng sáng tạo",
        description: "Xây dựng tình huống gặp gỡ bất ngờ, lý do tưởng tượng hấp dẫn, mở ra một thế giới diệu kỳ thú vị.",
        guidingQuestions: [
          "Cuộc gặp gỡ kì lạ hoặc chuyến du hành bắt đầu như thế nào?",
        ],
        suggestedActions: [
          "Tạo bối cảnh thú vị: Một buổi tối khi mọi người đã ngủ say, bỗng chiếc cặp sách cất tiếng thì thầm...",
        ],
      },
      {
        criterionId: "c2_yeu_to_ki_ao_sinh_dong",
        name: "2. Chi tiết kì ảo & Độc đáo",
        description: "Miêu tả các chi tiết tưởng tượng kì thú (phép thuật, cỗ máy thời gian, thành phố trên mây) nhưng hợp logic nội tại câu chuyện.",
        guidingQuestions: [
          "Có chi tiết thần kỳ hoặc thú vị nào khiến người đọc bất ngờ?",
        ],
        suggestedActions: [
          "Thêm chi tiết miêu tả màu sắc lấp lánh hoặc âm thanh huyền ảo của thế giới tưởng tượng.",
        ],
      },
      {
        criterionId: "c3_loi_thoai_doi_dap",
        name: "3. Lời thoại & Nhân hóa đồ vật/con vật",
        description: "Đối thoại dí dỏm, tự nhiên; đồ vật bộc lộ tâm tư, tình cảm và nỗi niềm như một con người thực sự.",
        guidingQuestions: [
          "Đồ vật hoặc người bạn tương lai đã tâm sự điều gì với em?",
        ],
        suggestedActions: [
          "Dùng dấu gạch ngang đầu dòng cho các lời thoại để đoạn đối thoại rõ ràng, sống động.",
        ],
      },
      {
        criterionId: "c4_bien_phap_tu_tu_tuong_tuong",
        name: "4. Biện pháp so sánh & Nhân hóa tài tình",
        description: "Thổi sức sống vào sự vật xung quanh, dùng hình ảnh ví von ngộ nghĩnh phù hợp với lứa tuổi tiểu học.",
        guidingQuestions: [
          "Em đã dùng những từ ngữ nhân hóa nào để đồ vật biết cười, biết thở dài?",
        ],
        suggestedActions: [
          "Tả cây bút mực mỉm cười hãnh diện khi cùng em viết nên những trang vở sạch đẹp.",
        ],
      },
      {
        criterionId: "c5_thong_diep_y_nghia",
        name: "5. Ý nghĩa nhân văn & Bài học thực tế",
        description: "Câu chuyện tưởng tượng gửi gắm thông điệp đẹp: trân trọng đồ dùng học tập, bảo vệ môi trường hoặc giữ gìn tình bạn.",
        guidingQuestions: [
          "Sau giấc mơ hoặc cuộc trò chuyện kỳ lạ đó, em hiểu ra điều gì?",
        ],
        suggestedActions: [
          "Khép lại bằng hành động cụ thể ở hiện thực: Lau chùi sạch sẽ chiếc cặp, sắp xếp sách vở ngay ngắn.",
        ],
      },
      {
        criterionId: "c6_chinh_ta_trinh_bay",
        name: "6. Trình bày lời thoại & Quy chuẩn chính tả",
        description: "Đặt dấu câu chuẩn xác (dấu hai chấm, mở ngoặc kép hoặc gạch đầu dòng), không sai lỗi chính tả phụ âm hay dấu thanh.",
        guidingQuestions: [
          "Các câu đối thoại đã có dấu hai chấm và gạch ngang đầu dòng đúng quy tắc chưa?",
        ],
        suggestedActions: [
          "Kiểm tra lại quy tắc ngắt câu và dẫn lời thoại của nhân vật.",
        ],
      },
    ],
  },

  // 7. HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN CÔNG VIỆC
  "huong-dan-cong-viec": {
    genre: "huong-dan-cong-viec",
    genreLabel: "Viết hướng dẫn các bước thực hiện công việc",
    icon: "🛠️",
    description: "Hướng dẫn cách làm một món đồ chơi (gấp máy bay, làm hoa giấy), nấu một món đơn giản hoặc các bước trồng cây.",
    defaultLevel: "doan",
    criteriaTemplates: [
      {
        criterionId: "c1_ten_cong_viec_muc_tieu",
        name: "1. Tên công việc & Mục tiêu hoàn thành",
        description: "Nêu rõ tên công việc cần hướng dẫn và giới thiệu ngắn gọn sản phẩm đạt được sau khi hoàn thành.",
        guidingQuestions: [
          "Bài viết đã nêu rõ là hướng dẫn làm việc gì chưa?",
        ],
        suggestedActions: [
          "Mở đầu bằng câu giới thiệu ngắn: 'Hôm nay, em xin hướng dẫn các bạn cách gấp một chú ếch bằng giấy rất đơn giản.'",
        ],
      },
      {
        criterionId: "c2_chuan_bi_dung_cu",
        name: "2. Khâu chuẩn bị dụng cụ & Nguyên liệu",
        description: "Liệt kê đầy đủ, chính xác các vật dụng cần chuẩn bị (kéo, giấy màu, thước kẻ, hồ dán, đất trồng...).",
        guidingQuestions: [
          "Người làm cần chuẩn bị những vật dụng cụ thể nào trước khi bắt tay vào làm?",
        ],
        suggestedActions: [
          "Ghi rõ số lượng hoặc kích thước nguyên liệu cần chuẩn bị.",
        ],
      },
      {
        criterionId: "c3_trinh_tu_cac_buoc",
        name: "3. Trình tự các bước thực hiện rõ ràng",
        description: "Phân chia rõ ràng: Bước 1, Bước 2, Bước 3... hoặc sử dụng từ chỉ thứ tự: 'Trước hết', 'Tiếp theo', 'Sau đó', 'Cuối cùng'.",
        guidingQuestions: [
          "Các bước có được sắp xếp đúng thứ tự từ trước đến sau không?",
        ],
        suggestedActions: [
          "Đánh số thứ tự các bước để người đọc dễ làm theo từng thao tác.",
        ],
      },
      {
        criterionId: "c4_dong_tu_hanh_dong",
        name: "4. Động từ hành động chuẩn xác, dễ hiểu",
        description: "Sử dụng câu ngắn gọn, chứa các động từ chỉ thao tác dứt khoát: gấp đôi, miết phẳng, cắt theo đường kẻ, dán chặt...",
        guidingQuestions: [
          "Câu văn hướng dẫn có đủ ngắn gọn và dễ hiểu đối với các bạn nhỏ không?",
        ],
        suggestedActions: [
          "Lược bớt các từ ngữ rườm rà, tập trung vào mô tả động tác tay chính xác.",
        ],
      },
      {
        criterionId: "c5_luu_y_va_thanh_pham",
        name: "5. Lưu ý an toàn & Mẹo để sản phẩm đẹp",
        description: "Nêu mẹo nhỏ để sản phẩm hoàn hảo hơn hoặc nhắc nhở an toàn khi dùng kéo, lửa hay nước nóng.",
        guidingQuestions: [
          "Có mẹo nhỏ nào giúp sản phẩm đẹp hơn hoặc tránh bị rách, hỏng không?",
        ],
        suggestedActions: [
          "Bổ sung câu lưu ý: 'Chú ý miết thật phẳng các nếp gấp để chú ếch nhảy được xa hơn.'",
        ],
      },
      {
        criterionId: "c6_trinh_bay_khoa_hoc",
        name: "6. Trình bày khoa học, danh sách & Chính tả",
        description: "Trình bày trực quan, sử dụng dấu gạch đầu dòng hoặc số thứ tự, viết đúng chính tả tiếng Việt.",
        guidingQuestions: [
          "Bản hướng dẫn đã được trình bày sạch sẽ, trực quan chưa?",
        ],
        suggestedActions: [
          "Dùng gạch đầu dòng cho danh sách đồ dùng chuẩn bị và số thứ tự cho các bước thực hiện.",
        ],
      },
    ],
  },

  // 8. VIẾT ĐƠN (ĐƠN XIN NGHỈ HỌC, ĐƠN VÀO ĐỘI, THAM GIA CLB)
  "viet-don": {
    genre: "viet-don",
    genreLabel: "Viết đơn (Văn bản hành chính tiểu học)",
    icon: "📝",
    description: "Viết lá đơn đúng thể thức: Đơn xin nghỉ học, Đơn xin vào Đội TNTP Hồ Chí Minh, Đơn xin tham gia Câu lạc bộ năng khiếu.",
    defaultLevel: "bai",
    criteriaTemplates: [
      {
        criterionId: "c1_quoc_hieu_tieu_ngu",
        name: "1. Quốc hiệu, tiêu ngữ & Địa điểm, ngày tháng",
        description: "Ghi đúng: CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM / Độc lập - Tự do - Hạnh phúc (ở giữa) và địa điểm ngày tháng (bên phải).",
        guidingQuestions: [
          "Em đã viết hoa Quốc hiệu và có dấu gạch nối giữa Tiêu ngữ chưa?",
          "Địa điểm và ngày tháng viết đơn đã đúng thể thức chưa?",
        ],
        suggestedActions: [
          "Căn giữa Quốc hiệu tiêu ngữ và viết hoa in hoa chuẩn xác toàn bộ Quốc hiệu.",
        ],
      },
      {
        criterionId: "c2_ten_don_va_noi_nhan",
        name: "2. Tên đơn & Nơi nhận (Kính gửi)",
        description: "Tên lá đơn viết chữ in hoa ở giữa (ĐƠN XIN NGHỈ HỌC) và dòng 'Kính gửi:' gửi đúng người có thẩm quyền tiếp nhận.",
        guidingQuestions: [
          "Tên đơn đã được viết chữ in hoa to rõ ràng ở giữa trang chưa?",
          "Em gửi đơn này cho ai (Cô giáo chủ nhiệm, Ban chỉ huy Đội...)?",
        ],
        suggestedActions: [
          "Viết hoa toàn bộ tên đơn: ĐƠN XIN VÀO ĐỘI THIẾU NIÊN TIỀN PHONG HỒ CHÍ MINH.",
        ],
      },
      {
        criterionId: "c3_thong_tin_nguoi_lam_don",
        name: "3. Thông tin người làm đơn đầy đủ",
        description: "Ghi rõ ràng: Em tên là, sinh ngày, học sinh lớp, trường tiểu học đang theo học.",
        guidingQuestions: [
          "Các thông tin họ tên, ngày sinh, lớp học của em đã chính xác chưa?",
        ],
        suggestedActions: [
          "Ghi đầy đủ họ và tên, ngày tháng năm sinh theo đúng giấy khai sinh.",
        ],
      },
      {
        criterionId: "c4_li_do_viet_don",
        name: "4. Lí do viết đơn rõ ràng, chính đáng",
        description: "Trình bày lý do trung thực, rõ ràng và lễ phép (bị sốt cần nghỉ dưỡng, có nguyện vọng rèn luyện theo gương Bác...).",
        guidingQuestions: [
          "Lí do viết đơn đã được trình bày chân thật, rõ ràng và lễ phép chưa?",
        ],
        suggestedActions: [
          "Nêu thời gian xin nghỉ cụ thể từ ngày nào đến ngày nào (nếu là đơn xin nghỉ).",
        ],
      },
      {
        criterionId: "c5_loi_hua_va_cam_on",
        name: "5. Lời hứa & Lời cảm ơn chân thành",
        description: "Cam kết chấp hành tốt điều lệ/nội quy, hứa chép bài và làm bài tập đầy đủ, gửi lời cảm ơn trân trọng.",
        guidingQuestions: [
          "Em đã có lời hứa sẽ chép bài và thực hiện tốt nội quy lớp học chưa?",
        ],
        suggestedActions: [
          "Thêm câu: 'Em xin hứa sẽ chép bài và hoàn thành bài tập đầy đủ khi đi học lại. Em xin chân thành cảm ơn!'",
        ],
      },
      {
        criterionId: "c6_chu_ky_nguoi_lam_don",
        name: "6. Chữ ký, họ tên & Trình bày trang đơn",
        description: "Góc dưới bên phải có chữ ký và ghi rõ họ tên người làm đơn; góc dưới bên trái có ý kiến phụ huynh (nếu cần).",
        guidingQuestions: [
          "Em đã để trống chỗ ký tên và ghi rõ họ và tên ở góc dưới bên phải chưa?",
        ],
        suggestedActions: [
          "Đặt phần 'Người làm đơn' cùng chữ ký ngay ngắn ở góc dưới bên phải trang giấy.",
        ],
      },
    ],
  },
};

// Hàm lấy mẫu Rubric theo Dạng bài và Cấp độ
export function getRubricForGenre(genre: PromptGenre = "mieu-ta-cay-coi", level: WritingLevel = "bai"): GenreRubricDefinition {
  const baseDef = GENRE_RUBRICS_MAP[genre] || GENRE_RUBRICS_MAP["mieu-ta-cay-coi"];
  return baseDef;
}

// Hàm sinh tiêu chí mặc định khi khởi tạo hoặc fallback
export function generateDefaultCriteriaForGenre(
  genre: PromptGenre,
  level: WritingLevel,
  sampleContent: string = ""
): ScanRubricCriterion[] {
  const rubricDef = getRubricForGenre(genre, level);

  return rubricDef.criteriaTemplates.map((template, idx) => {
    // Điểm số mẫu hợp lý từ 3.8 đến 4.8
    const baseScore = 4.2 + (idx % 3) * 0.3;
    const score = Math.min(5.0, Number(baseScore.toFixed(1)));
    const suggested_level: 1 | 2 | 3 | 4 = score >= 4.5 ? 4 : score >= 3.8 ? 3 : 2;

    return {
      criterionId: template.criterionId,
      name: template.name,
      suggested_level,
      score,
      evidence: sampleContent ? sampleContent.slice(idx * 30, idx * 30 + 45) + "..." : "Trích dẫn câu văn tiêu biểu của học sinh trong bài",
      explanation: `Em đã thể hiện tốt yêu cầu ở ${template.name.toLowerCase()}. Nội dung rõ ràng, tự nhiên và đúng tinh thần lứa tuổi học sinh lớp 4.`,
      guiding_question: template.guidingQuestions[0] || "Em có thể phát triển thêm ý này như thế nào?",
      suggested_action: template.suggestedActions[0] || "Giữ vững hướng đi mạch lạc và trau chuốt thêm từ ngữ gợi cảm.",
    };
  });
}
