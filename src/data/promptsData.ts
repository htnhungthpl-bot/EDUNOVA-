import { EssayPrompt } from "../types";
import { officialKnttPrompts } from "./officialKnttPrompts";

export const curatedPromptsData: EssayPrompt[] = [
  // =========================================================================
  // TẬP MỘT — THỂ LOẠI: THUẬT LẠI MỘT SỰ VIỆC
  // =========================================================================
  {
    id: "kd-kntt-t1-01",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 1 - Bài 3)",
    bookVolume: "tap1",
    genre: "thuat-lai-su-viec",
    genreLabel: "Thuật lại sự việc",
    level: "bai",
    title: "Thuật lại một hoạt động trải nghiệm hoặc chuyến tham quan bổ ích",
    prompt: "Viết bài văn thuật lại một hoạt động trải nghiệm hoặc một chuyến tham quan mà em đã được tham gia cùng các bạn hoặc người thân, để lại cho em nhiều kỉ niệm sâu sắc.",
    topic: "Trường học & Trải nghiệm",
    targetWords: 200,
    lessonReference: "Tuần 2 - Bài 3: Tìm hiểu cách viết bài văn thuật lại một sự việc",
    isFeatured: true,
    usageCount: 42,
    createdAt: "01/09/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Đề bài yêu cầu em kể lại sự việc gì? Sự việc đó diễn ra ở đâu, vào lúc nào và cùng với những ai?",
        targetGenre: "Văn thuật lại sự việc (theo trình tự thời gian)",
        keyElements: [
          "Xác định rõ sự việc (chuyến tham quan bảo tàng, trang trại, dã ngoại)",
          "Trình tự diễn biến: Bắt đầu -> Diễn biến chính -> Kết thúc",
          "Nêu cảm xúc, bài học hoặc điều bổ ích em nhận được",
        ],
      },
      step2Observation: {
        senses: {
          sight: "Cảnh sắc nơi tham quan (cây cối xanh tươi, hiện vật cổ kính, nụ cười của thầy cô và bè bạn)",
          sound: "Tiếng cười đùa ríu rít, tiếng chim hót, tiếng thuyết minh viên truyền cảm, tiếng còi xe rộn rã",
          touch: "Gió sớm mát rượi lùa qua mái tóc, bàn tay nắm chặt tay bạn cùng tiến bước",
          scentOrTaste: "Hương hoa cỏ đồng quê thoang thoảng, vị ngọt mát của ngụm nước suối sau chuyến đi",
          emotion: "Hào hứng trước giờ khởi hành, ngỡ ngàng khi khám phá điều mới mẻ, lưu luyến khi chia tay",
        },
        guidingQuestions: [
          "Chuyến đi đó bắt đầu vào thời gian nào, em chuẩn bị những gì?",
          "Hoạt động nào trong chuyến đi làm em cảm thấy thích thú nhất?",
          "Em đã học thêm được điều gì mới mẻ sau chuyến trải nghiệm?",
        ],
      },
      step3Outline: {
        introduction: "Mở bài gián tiếp: Dẫn dắt từ niềm vui mong ước được đi trải nghiệm, giới thiệu chuyến tham quan trang trại giáo dục vào một ngày thu đẹp trời.",
        body: [
          "Buổi sáng: Tập trung tại sân trường, niềm háo hức trên từng khuôn mặt, tiếng cười nói rộn ràng trên xe.",
          "Khi đến nơi: Khám phá không gian rộng lớn, tham gia trải nghiệm làm bác nông dân tí hon (trồng rau, bắt cá, nặn gốm).",
          "Buổi trưa & chiều: Cùng các bạn ăn trưa vui vẻ dưới bóng cây, tổng kết các trò chơi đồng đội bổ ích.",
        ],
        conclusion: "Kết bài mở rộng: Chuyến xe lăn bánh đưa chúng em trở về trong sự nuối tiếc, lời hứa sẽ chăm chỉ học tập để có thêm nhiều chuyến đi ý nghĩa.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["rộn rã", "rực rỡ", "thênh thang", "bổ ích", "náo nức", "líu lo", "bạt ngàn"],
        comparisons: [
          "Tiếng reo hò của chúng em vang lên như bầy chim non vừa rời tổ.",
          "Đồng lúa vàng rực trải dài như một tấm thảm lụa khổng lồ chạm đến chân trời.",
        ],
        personifications: [
          "Những hàng cây bên đường như đang vẫy tay chào đón đoàn xe học trò.",
          "Làn gió thu nhẹ nhàng thì thầm bên tai những lời chúc tốt lành.",
        ],
      },
      step5Checklist: [
        "Kể đúng trình tự thời gian (trước - sau)?",
        "Có kết hợp kể sự việc với bộc lộ cảm xúc không?",
        "Sử dụng từ nối chuyển đoạn tự nhiên (Sáng sớm, Đến trưa, Khi ánh hoàng hôn buông xuống...)?",
        "Đã rà soát lỗi chính tả ch/tr, s/x và viết hoa tên riêng?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Mỗi chuyến đi đều là một trang sách mới mở ra bao điều kì diệu. Trong muôn vàn chuyến đi của tuổi thơ, em nhớ nhất là chuyến tham quan Trang trại Giáo dục vào một buổi sáng mùa thu trong trẻo cùng thầy cô và bè bạn lớp 4A1.",
      goodBodyExcerpt: "Bước chân vào trang trại, trước mắt chúng em là một không gian xanh mướt trải dài tít tắp. Chúng em hào hứng hóa thân thành những bác nông dân nhí, tự tay gieo từng hạt mầm xuống luống đất nâu xốp. Lấm lem bùn đất trên đôi bàn tay nhưng nụ cười ai nấy đều rạng rỡ như ánh ban mai.",
      goodConclusionExample: "Chuyến tham quan khép lại nhưng những kỉ niệm ấm áp và bài học về nỗi vất vả của người nông dân vẫn còn vẹn nguyên trong em. Em tự nhủ sẽ luôn trân quý từng hạt cơm và không ngừng nỗ lực học tập để mai này vươn xa.",
    },
    suggestedRubricSummary: [
      "Bố cục 3 phần rõ ràng, thuật lại đúng trình tự thời gian",
      "Chọn lọc được chi tiết hoạt động tiêu biểu, không liệt kê dàn trải",
      "Có từ ngữ gợi cảm, ít nhất 1 so sánh và 1 nhân hóa",
      "Bộc lộ cảm xúc chân thật, trình bày sạch đẹp",
    ],
  },
  {
    id: "kd-kntt-t1-02",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 1 - Bài 6)",
    bookVolume: "tap1",
    genre: "thuat-lai-su-viec",
    genreLabel: "Thuật lại sự việc",
    level: "doan",
    title: "Thuật lại một buổi lao động vệ sinh trường lớp",
    prompt: "Viết đoạn văn (từ 5 đến 7 câu) thuật lại các hoạt động của lớp em trong buổi tổng vệ sinh chiều thứ Sáu để giữ gìn trường lớp luôn xanh - sạch - đẹp.",
    topic: "Lao động & Vệ sinh",
    targetWords: 90,
    lessonReference: "Tuần 3 - Bài 6: Luyện viết đoạn văn cho bài văn thuật lại một sự việc",
    isFeatured: false,
    usageCount: 35,
    createdAt: "05/09/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Đoạn văn cần thuật lại hoạt động gì? Diễn ra lúc nào và ai tham gia?",
        targetGenre: "Đoạn văn thuật lại sự việc (dung lượng 5-7 câu)",
        keyElements: ["Giới thiệu thời điểm bắt đầu", "Các công việc cụ thể được phân công", "Kết quả sạch đẹp và cảm xúc"],
      },
      step2Observation: {
        senses: {
          sight: "Bảng đen được lau sạch bóng, bàn ghế thẳng tắp, sân trường rợp bóng mát không còn cọng rác",
          sound: "Tiếng chổi tre xoèn xoẹt, tiếng xô chậu lách cách, tiếng cười động viên nhau",
          touch: "Giọt mồ hôi lấm tấm trên trán, làn nước mát lạnh khi giặt khăn lau bảng",
          emotion: "Hăng say, vui vẻ vì cùng nhau làm cho lớp học thêm khang trang",
        },
        guidingQuestions: [
          "Mỗi tổ được cô giáo phân công công việc gì?",
          "Em và các bạn đã phối hợp như thế nào?",
          "Khi nhìn ngắm lớp học sạch bong, em cảm thấy ra sao?",
        ],
      },
      step3Outline: {
        introduction: "Câu mở đoạn: Nêu thời gian và mục đích của buổi lao động tổng vệ sinh chiều thứ Sáu.",
        body: [
          "Tổ một lau chùi bàn ghế, quét mạng nhện trên trần nhà.",
          "Tổ hai và tổ ba tưới cây cảnh, quét sạch lá khô nơi hành lang và sân trước.",
          "Mỗi người một tay, không ai lười biếng, tiếng chổi tre rộn ràng khắp nơi.",
        ],
        conclusion: "Câu kết đoạn: Nhìn lớp học sạch bóng tinh tươm, mệt mỏi tan biến, ai nấy đều nở nụ cười tự hào.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["xoèn xoẹt", "thoăn thoắt", "sạch bong", "tinh tươm", "hăng say", "nhộn nhịp"],
        comparisons: [
          "Bàn ghế được sắp xếp ngay ngắn như những chú lính đứng nghiêm chào cờ.",
          "Mặt bảng đen bóng loáng như một tấm gương soi.",
        ],
        personifications: ["Những chậu cây xanh dường như tươi tỉnh hẳn lên sau khi được uống dòng nước mát."],
      },
      step5Checklist: [
        "Đủ số lượng câu (5-7 câu)?",
        "Có từ ngữ nối: Trước tiên, Sau đó, Cuối cùng?",
        "Chính tả chuẩn, dấu câu ngắt nghỉ chính xác?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Chiều thứ Sáu vừa qua, lớp 4A1 chúng em đã có một buổi tổng vệ sinh thật sôi nổi và ý nghĩa.",
      goodBodyExcerpt: "Dưới sự phân công của cô chủ nhiệm, mỗi bạn đều bắt tay vào việc với đôi bàn tay thoăn thoắt. Bạn Nam lau bảng thật cẩn thận cho đến khi mặt bảng đen nhánh, các bạn nữ tỉ mẩn nhặt từng chiếc lá sâu trên bồn hoa trước cửa lớp.",
      goodConclusionExample: "Ngắm nhìn phòng học sạch bong tinh tươm, chúng em ai nấy đều cảm thấy tự hào vì đã góp phần giữ gìn mái trường luôn sáng đẹp.",
    },
    suggestedRubricSummary: [
      "Đoạn văn đúng cấu trúc, nêu đủ trình tự công việc",
      "Dùng động từ và từ gợi tả linh hoạt",
      "Không mắc lỗi câu cụt hoặc câu què",
    ],
  },
  {
    id: "kd-kntt-t1-03",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 1 - Bài 10)",
    bookVolume: "tap1",
    genre: "thuat-lai-su-viec",
    genreLabel: "Thuật lại sự việc",
    level: "doan",
    title: "Thuật lại một việc tốt em đã làm giúp đỡ người khác",
    prompt: "Viết đoạn văn thuật lại một việc tốt em đã làm (nhặt được của rơi trả người đánh mất, giúp bà cụ qua đường, giúp bạn học bài khó...) và cảm xúc của em khi làm được việc tốt đó.",
    topic: "Gia đình & Xã hội",
    targetWords: 100,
    lessonReference: "Tuần 5 - Bài 10: Viết bài văn thuật lại một sự việc (luyện tập)",
    isFeatured: true,
    usageCount: 50,
    createdAt: "10/09/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Việc tốt em đã làm là việc gì? Hoàn cảnh nào đã thúc đẩy em hành động?",
        targetGenre: "Đoạn văn kể chuyện / thuật sự việc",
        keyElements: ["Thời gian, địa điểm", "Diễn biến hành động giúp đỡ", "Phản ứng của người được giúp và niềm vui của bản thân"],
      },
      step2Observation: {
        senses: {
          sight: "Mái tóc bạc phơ của bà cụ, ánh mắt bối rối của người đánh rơi ví tiền, dòng xe cộ tấp nập",
          sound: "Tiếng còi xe inh ỏi trên phố, lời cảm ơn nghẹn ngào ấm áp",
          touch: "Bàn tay gầy guộc run run nắm lấy tay em đầy tin cậy",
          emotion: "Lúc đầu thoáng chút ngập ngừng, sau đó là niềm vui ngập tràn trong lòng",
        },
        guidingQuestions: [
          "Lúc đó tình huống khó khăn của người đó ra sao?",
          "Em đã suy nghĩ và hành động ngay lập tức như thế nào?",
          "Khi nghe lời cảm ơn, em cảm thấy trái tim mình như thế nào?",
        ],
      },
      step3Outline: {
        introduction: "Giới thiệu hoàn cảnh: Chiều tan học, em bắt gặp một bà cụ đang ngập ngừng muốn sang đường giữa dòng xe đông đúc.",
        body: [
          "Em nhanh chóng bước lại gần, lễ phép ngỏ lời: 'Bà ơi, để cháu dắt bà sang đường ạ!'.",
          "Bà cụ mỉm cười gật đầu, em cẩn thận giơ tay xin đường và từng bước dìu bà qua vạch kẻ đường an toàn.",
        ],
        conclusion: "Bà cụ xoa đầu khen em ngoan ngoãn. Trên đường về nhà, lòng em cảm thấy ấm áp lạ kì.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["ấp áp", "gầy guộc", "tấp nập", "ân cần", "rạng rỡ", "ngập tràn"],
        comparisons: ["Nụ cười của bà hiền từ như nụ cười của bà tiên trong truyện cổ tích."],
        personifications: ["Tia nắng cuối ngày như đang nhảy múa mừng vui cùng bước chân của em."],
      },
      step5Checklist: [
        "Kể chân thật, tự nhiên, không cường điệu?",
        "Lời nói của nhân vật đặt trong dấu ngoặc kép hoặc gạch đầu dòng?",
        "Chính tả và chấm phẩy chuẩn xác?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Mỗi việc tốt trao đi như một hạt mầm gieo vào cuộc sống niềm vui và sự tử tế.",
      goodBodyExcerpt: "Thấy bà cụ đứng run run bên mép đường nhìn dòng xe lao vun vút, em liền chạy tới: 'Bà ơi, cháu dắt bà sang đường nhé!'. Bàn tay bà ấm áp nắm lấy tay em. Từng bước một, em giơ cao tay xin đường, giúp bà sang bên kia phố an toàn.",
      goodConclusionExample: "Nghe bà khen: 'Cháu ngoan quá, bà cảm ơn cháu nhé!', bước chân em trở về nhà bỗng thấy nhẹ tênh và rộn rã niềm vui.",
    },
    suggestedRubricSummary: [
      "Câu chuyện có ý nghĩa giáo dục, chi tiết chân thật",
      "Dùng từ ngữ biểu cảm, thể hiện được tình cảm nhân ái",
      "Cấu trúc đoạn văn chặt chẽ",
    ],
  },

  // =========================================================================
  // TẬP MỘT — THỂ LOẠI: VIẾT ĐƠN
  // =========================================================================
  {
    id: "kd-kntt-t1-04",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 1 - Bài 7)",
    bookVolume: "tap1",
    genre: "viet-don",
    genreLabel: "Viết đơn",
    level: "bai",
    title: "Viết đơn xin nghỉ học đúng quy chuẩn",
    prompt: "Em hãy viết một lá đơn xin nghỉ học gửi thầy cô giáo chủ nhiệm vì lí do bị cảm sốt hoặc gia đình có việc bận đột xuất.",
    topic: "Trường học & Quy tắc",
    targetWords: 120,
    lessonReference: "Tuần 4 - Bài 7: Tìm hiểu cách viết đơn",
    isFeatured: false,
    usageCount: 60,
    createdAt: "12/09/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Đơn gửi cho ai? Lí do xin nghỉ học là gì? Thời gian nghỉ trong bao lâu?",
        targetGenre: "Văn bản hành chính thông thường (Viết đơn)",
        keyElements: [
          "Quốc hiệu, tiêu ngữ (CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM)",
          "Địa điểm, ngày tháng năm làm đơn",
          "Tên đơn (ĐƠN XIN NGHỈ HỌC)",
          "Nơi nhận (Kính gửi...)",
          "Thông tin người viết đơn (Họ tên, học sinh lớp nào)",
          "Lí do xin nghỉ và thời gian nghỉ cụ thể",
          "Lời cam đoan (chép bài, làm bài đầy đủ)",
          "Chữ kí của học sinh và chữ kí phụ huynh xác nhận",
        ],
      },
      step2Observation: {
        senses: {
          emotion: "Thái độ tôn trọng thầy cô, nghiêm túc, có trách nhiệm với việc học tập",
        },
        guidingQuestions: [
          "Lá đơn cần có những mục cố định nào theo thứ tự từ trên xuống dưới?",
          "Em viết lời cam đoan ra sao để thầy cô yên tâm?",
        ],
      },
      step3Outline: {
        introduction: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM / Độc lập - Tự do - Hạnh phúc / Hà Nội, ngày... tháng... năm...",
        body: [
          "Kính gửi: Thầy (Cô) giáo chủ nhiệm lớp 4A1 Trường Tiểu học Chu Văn An.",
          "Em tên là: Nguyễn Minh An, học sinh lớp 4A1.",
          "Em làm đơn này xin phép được nghỉ học 01 ngày (ngày.../...) vì lí do bị sốt xuất huyết cần theo dõi.",
        ],
        conclusion: "Em xin hứa sẽ chép bài và làm bài tập đầy đủ. Kính mong thầy (cô) chấp thuận. / Kính đơn (Kí và ghi rõ họ tên).",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["kính gửi", "chấp thuận", "cam đoan", "lễ phép", "trân trọng"],
        comparisons: [],
        personifications: [],
      },
      step5Checklist: [
        "Đúng bố cục chuẩn của một lá đơn chưa?",
        "Viết hoa đúng các danh từ riêng và quốc hiệu?",
        "Chữ viết rõ ràng, không gạch xóa lem luốc?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nĐƠN XIN NGHỈ HỌC",
      goodBodyExcerpt: "Kính gửi: Cô giáo chủ nhiệm Lớp 4A1 Trường Tiểu học Chu Văn An.\nEm tên là: Mai Phương Thảo, học sinh lớp 4A1.\nEm viết đơn này xin phép cô cho em được nghỉ học 01 ngày, thứ Sáu ngày 16/10/2026.\nLí do: Đêm qua em bị sốt cao, bác sĩ chỉ định cần nằm nghỉ ngơi và theo dõi tại nhà.",
      goodConclusionExample: "Em xin cam đoan sẽ nhờ bạn chép bài và hoàn thành bài tập đầy đủ trước khi trở lại lớp.\nEm xin chân thành cảm ơn cô!\n\nÝ kiến của phụ huynh           Người làm đơn\n(Kí và ghi họ tên)            Mai Phương Thảo",
    },
    suggestedRubricSummary: [
      "Đúng cấu trúc hành chính của thể loại đơn",
      "Thông tin rõ ràng, lí do chính đáng",
      "Lời lẽ lễ phép, chuẩn mực học sinh",
    ],
  },
  {
    id: "kd-kntt-t1-05",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 1 - Bài 11)",
    bookVolume: "tap1",
    genre: "viet-don",
    genreLabel: "Viết đơn",
    level: "bai",
    title: "Viết đơn xin tham gia Câu lạc bộ em yêu thích",
    prompt: "Em hãy viết một lá đơn gửi Ban Giám hiệu hoặc Ban Chủ nhiệm để xin tham gia một Câu lạc bộ ngoại khóa của trường (CLB Mĩ thuật, Âm nhạc, Cờ vua hoặc Tiếng Anh).",
    topic: "Sở thích & Năng khiếu",
    targetWords: 130,
    lessonReference: "Tuần 6 - Bài 11: Luyện tập viết đơn",
    isFeatured: true,
    usageCount: 48,
    createdAt: "15/09/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Đơn gửi cho ai? Em muốn xin vào câu lạc bộ nào? Năng khiếu hoặc niềm đam mê của em là gì?",
        targetGenre: "Văn bản viết đơn xin gia nhập",
        keyElements: ["Quốc hiệu tiêu ngữ", "Nơi nhận đơn", "Nguyện vọng và sở thích cá nhân", "Lời hứa chấp hành nội quy"],
      },
      step2Observation: {
        senses: {
          emotion: "Nhiệt huyết, tự tin, mong muốn học hỏi và giao lưu cùng bạn bè",
        },
        guidingQuestions: [
          "Tại sao em lại muốn tham gia câu lạc bộ này?",
          "Em sẽ đóng góp gì hoặc rèn luyện như thế nào khi được tham gia?",
        ],
      },
      step3Outline: {
        introduction: "Quốc hiệu, Tiêu ngữ, Tên đơn: ĐƠN XIN GIA NHẬP CÂU LẠC BỘ MĨ THUẬT.",
        body: [
          "Kính gửi: Ban Chủ nhiệm Câu lạc bộ Mĩ thuật Trường Tiểu học Chu Văn An.",
          "Thông tin bản thân: Tên, lớp, ngày tháng năm sinh.",
          "Lí do: Em rất đam mê hội họa, có thể vẽ tranh phong cảnh và mong muốn được thầy cô hướng dẫn nâng cao kĩ năng pha màu.",
        ],
        conclusion: "Lời hứa: Chấp hành nghiêm chỉnh nội quy, tham gia sinh hoạt đều đặn. Kí tên.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["đam mê", "nhiệt tình", "nội quy", "sáng tạo", "gắn kết"],
        comparisons: [],
        personifications: [],
      },
      step5Checklist: [
        "Có đầy đủ các phần bắt buộc của lá đơn?",
        "Thể hiện rõ niềm say mê và sự cam kết?",
        "Chính tả chỉn chu, sạch đẹp?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "ĐƠN XIN GIA NHẬP CÂU LẠC BỘ HỘI HỌA TÍ HON\nKính gửi: Ban Chủ nhiệm Câu lạc bộ Nghệ thuật Trường Tiểu học Chu Văn An",
      goodBodyExcerpt: "Từ nhỏ, em đã say mê những sắc màu và ước mơ vẽ nên những bức tranh quê hương tươi đẹp. Được biết Câu lạc bộ Mĩ thuật của trường sắp khai giảng khóa sinh hoạt mới, em rất mong muốn được trở thành một thành viên tích cực của câu lạc bộ.",
      goodConclusionExample: "Nếu được tham gia, em xin hứa sẽ đi sinh hoạt đúng giờ, giữ gìn phòng học sạch đẹp và tích cực tham gia các phong trào thi đua. Em xin chân thành cảm ơn!",
    },
    suggestedRubricSummary: [
      "Đầy đủ thủ tục thể thức văn bản",
      "Lí do thuyết phục, chân thành",
      "Trình bày chuẩn mẫu quy định",
    ],
  },

  // =========================================================================
  // TẬP MỘT — THỂ LOẠI: ĐOẠN VĂN NÊU Ý KIẾN / CẢM NGHĨ
  // =========================================================================
  {
    id: "kd-kntt-t1-06",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 1 - Bài 8)",
    bookVolume: "tap1",
    genre: "doan-van-neu-y-kien",
    genreLabel: "Đoạn văn nêu ý kiến",
    level: "doan",
    title: "Nêu lí do em yêu thích một câu chuyện đã đọc hoặc đã nghe",
    prompt: "Viết đoạn văn (từ 4 đến 6 câu) nêu lí do em yêu thích một câu chuyện cổ tích (như Cây khế, Tấm Cám, Thạch Sanh...) hoặc một câu chuyện ca ngợi lòng dũng cảm.",
    topic: "Văn học & Bài học cuộc sống",
    targetWords: 80,
    lessonReference: "Tuần 4 - Bài 8: Viết đoạn văn nêu ý kiến",
    isFeatured: true,
    usageCount: 55,
    createdAt: "18/09/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Câu chuyện em chọn là chuyện gì? Nhân vật nào để lại ấn tượng mạnh mẽ nhất? Bài học em nhận được là gì?",
        targetGenre: "Đoạn văn nghị luận / nêu ý kiến lớp 4",
        keyElements: ["Câu mở đoạn nêu tên truyện và sự yêu thích", "2-3 câu nêu lí do cụ thể kèm dẫn chứng", "Câu kết đoạn khẳng định lại giá trị"],
      },
      step2Observation: {
        senses: {
          emotion: "Cảm phục lòng dũng cảm, xúc động trước tình thương người, căm ghét cái xấu",
        },
        guidingQuestions: [
          "Chi tiết nào trong truyện làm em xúc động nhất?",
          "Nhân vật đó dạy em bài học gì trong cách cư xử với mọi người xung quanh?",
        ],
      },
      step3Outline: {
        introduction: "Câu mở đoạn: Giới thiệu câu chuyện 'Thạch Sanh' là truyện cổ tích em yêu thích nhất.",
        body: [
          "Em khâm phục Thạch Sanh vì chàng vừa dũng cảm diệt chằn tinh cứu dân lành, vừa có lòng bao dung tha mạng cho kẻ hại mình.",
          "Tiếng đàn của Thạch Sanh thần kì đã cảm hóa quân giặc mà không cần dùng gươm giáo.",
        ],
        conclusion: "Câu kết đoạn: Câu chuyện dạy em bài học sâu sắc rằng ở hiền sẽ gặp lành và lòng nhân ái có sức mạnh lớn hơn bạo lực.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["dũng cảm", "bao dung", "nghĩa hiệp", "cảm hóa", "ở hiền gặp lành"],
        comparisons: ["Tiếng đàn thần vang lên êm ái như dòng suối xoa dịu mọi oán hờn."],
        personifications: [],
      },
      step5Checklist: [
        "Nêu rõ lí do yêu thích chưa?",
        "Có dẫn chứng cụ thể từ câu chuyện?",
        "Câu văn mạch lạc, không lặp từ?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Trong những câu chuyện cổ tích bà thường kể, em say mê và trân trọng nhất là câu chuyện 'Thạch Sanh'.",
      goodBodyExcerpt: "Em yêu thích câu chuyện trước hết bởi hình tượng chàng Thạch Sanh dũng cảm, thật thà và giàu lòng vị tha. Khi đất nước nguy nan, chàng không chỉ dùng sức mạnh diệt trừ quái vật mà còn dùng tiếng đàn nhân ái để đẩy lùi quân giặc.",
      goodConclusionExample: "Hình ảnh Thạch Sanh mãi là tấm gương sáng ngời về lòng chính nghĩa và sự thiện lương để em noi theo.",
    },
    suggestedRubricSummary: [
      "Nêu ý kiến rõ ràng, lập luận chặt chẽ",
      "Dẫn chứng xác thực từ tác phẩm",
      "Bộc lộ cảm xúc sâu sắc và bài học nhân văn",
    ],
  },
  {
    id: "kd-kntt-t1-07",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 1 - Bài 16)",
    bookVolume: "tap1",
    genre: "doan-van-neu-y-kien",
    genreLabel: "Đoạn văn nêu cảm nghĩ",
    level: "doan",
    title: "Nêu cảm nghĩ về một bài thơ ca ngợi vẻ đẹp quê hương",
    prompt: "Viết đoạn văn bày tỏ cảm xúc của em sau khi đọc một bài thơ về cảnh đẹp non sông đất nước (như 'Hạt gạo làng ta', 'Quê hương', 'Bến Tre'...).",
    topic: "Quê hương & Đất nước",
    targetWords: 85,
    lessonReference: "Tuần 8 - Bài 16: Viết đoạn văn nêu tình cảm, cảm xúc về bài thơ",
    isFeatured: false,
    usageCount: 29,
    createdAt: "22/09/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Tên bài thơ là gì? Tác giả là ai? Hình ảnh thơ nào gợi cho em nhiều rung cảm nhất?",
        targetGenre: "Đoạn văn biểu cảm về tác phẩm thơ",
        keyElements: ["Giới thiệu tên bài thơ và tác giả", "Chỉ ra hình ảnh hoặc câu thơ ấn tượng", "Bộc lộ niềm tự hào, tình yêu quê hương"],
      },
      step2Observation: {
        senses: {
          sight: "Cánh đồng lúa trĩu hạt, dòng sông xanh biếc, giọt mồ hôi của người mẹ trên cánh đồng",
          sound: "Tiếng hát ru ngọt ngào, tiếng sáo diều vi vu trong chiều gió",
          emotion: "Biết ơn, tự hào, trân trọng từng hạt cơm thơm dẻo",
        },
        guidingQuestions: [
          "Đọc bài thơ em cảm nhận được điều gì về công sức của người lao động?",
          "Tình yêu quê hương trong em được bồi đắp thế nào qua từng vần thơ?",
        ],
      },
      step3Outline: {
        introduction: "Giới thiệu bài thơ 'Hạt gạo làng ta' của nhà thơ Trần Đăng Khoa.",
        body: [
          "Bài thơ giúp em hiểu hạt gạo nhỏ bé chứa đựng cả vị phù sa ngọt ngào, hương sen thơm ngát và bao giọt mồ hôi mẹ cha đổ xuống trong những ngày mưa bão.",
          "Những câu thơ mộc mạc mà dạt dào cảm xúc khiến em rưng rưng xúc động.",
        ],
        conclusion: "Từ bài thơ, em càng thêm nâng niu từng bát cơm dẻo và tự hứa sẽ học tập tốt để xây dựng quê hương thêm giàu đẹp.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["phù sa", "dạt dào", "nâng niu", "mộc mạc", "rưng rưng"],
        comparisons: ["Từng câu thơ như dòng sữa ngọt ngào tưới mát tâm hồn em."],
        personifications: [],
      },
      step5Checklist: [
        "Có trích dẫn hoặc nhắc tên bài thơ chính xác?",
        "Thể hiện rõ cảm xúc cá nhân?",
        "Chính tả chuẩn?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Bài thơ 'Hạt gạo làng ta' của nhà thơ Trần Đăng Khoa đã để lại trong em những rung động vô cùng sâu sắc.",
      goodBodyExcerpt: "Qua từng câu thơ giản dị mà giàu nhạc điệu, em cảm nhận được rằng mỗi hạt gạo trắng trong là kết tinh của phù sa sông Kinh Thầy, của bão tháng bảy mưa tháng ba và tình thương bao la của người nông dân một nắng hai sương.",
      goodConclusionExample: "Bài thơ đã nhắc nhở em phải biết ơn những người lao động và thêm trân quý mảnh đất quê hương thân thương.",
    },
    suggestedRubricSummary: [
      "Bộc lộ cảm xúc chân thành, tự nhiên",
      "Có phân tích hình ảnh thơ tiêu biểu",
      "Diễn đạt giàu chất thơ",
    ],
  },

  // =========================================================================
  // TẬP MỘT — THỂ LOẠI: BÀI VĂN MIÊU TẢ CON VẬT
  // =========================================================================
  {
    id: "kd-kntt-t1-08",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 1 - Bài 26)",
    bookVolume: "tap1",
    genre: "mieu-ta-con-vat",
    genreLabel: "Văn miêu tả con vật",
    level: "bai",
    title: "Miêu tả con vật nuôi yêu thích trong gia đình em",
    prompt: "Em hãy viết bài văn miêu tả chú mèo con hoặc chú cún con trong gia đình em (hoặc con vật em quan sát được), làm nổi bật hình dáng ngộ nghĩnh và thói quen đáng yêu.",
    topic: "Con vật nuôi",
    targetWords: 200,
    lessonReference: "Tuần 13 - Bài 26: Viết bài văn miêu tả con vật",
    isFeatured: true,
    usageCount: 68,
    createdAt: "28/09/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Con vật em tả là con gì, tên gọi là gì? Em nuôi hay quan sát ở đâu?",
        targetGenre: "Văn miêu tả con vật (Bố cục 3 phần hoàn chỉnh)",
        keyElements: [
          "Mở bài: Giới thiệu con vật (trực tiếp hoặc gián tiếp)",
          "Thân bài: Tả bao quát (kích thước, bộ lông) -> Tả chi tiết (đầu, mắt, tai, mũi, chân, đuôi) -> Tả hoạt động & thói quen",
          "Kết bài: Tình cảm gắn bó, chăm sóc con vật",
        ],
      },
      step2Observation: {
        senses: {
          sight: "Bộ lông mềm mượt như tơ, đôi mắt tròn xoe màu hổ phách, ria mép trắng như cước, bàn chân có đệm thịt êm ái",
          sound: "Tiếng 'meo meo' nũng nịu, tiếng gừ gừ êm tai khi được xoa bụng, tiếng bước chân nhẹ tênh không tiếng động",
          touch: "Ấm áp và mềm mại khi ôm vào lòng, chiếc mũi ươn ướt cọ vào mu bàn tay",
          emotion: "Yêu thương, coi con vật như một người bạn nhỏ trong gia đình",
        },
        guidingQuestions: [
          "Mỗi khi nhìn thấy em đi học về, con vật có hành động mừng rỡ như thế nào?",
          "Khi săn mồi hoặc chơi đùa với cuộn len, con vật có những động tác ngộ nghĩnh ra sao?",
        ],
      },
      step3Outline: {
        introduction: "Mở bài gián tiếp: Giới thiệu chú mèo Miu - món quà sinh nhật bố tặng tròn một năm trước.",
        body: [
          "Tả ngoại hình: Vóc dáng thon thả, khoác áo lông ba màu trắng - vàng - xám mịn như nhung. Đôi tai vểnh lên nghe ngóng. Đôi mắt long lanh như hai hòn bi ve trong suốt.",
          "Tả hoạt động: Buổi sáng thích nằm sưởi nắng trên bậc thềm. Buổi tối hóa thân thành dũng sĩ bắt chuột tài ba với bước chân thoăn thoắt và móng vuốt sắc nhọn.",
          "Tả thói quen giao tiếp: Thích cọ đầu vào chân em đòi nũng nịu, ríu rít mỗi khi nghe tiếng mở nắp hộp thức ăn.",
        ],
        conclusion: "Kết bài mở rộng: Khẳng định tình cảm thân thiết, lời hứa luôn chăm sóc và cho Miu ăn uống đầy đủ.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["mềm mượt", "nhung mịn", "thoăn thoắt", "óng ả", "long lanh", "nũng nịu", "rón rén"],
        comparisons: [
          "Đôi mắt chú tròn xoe và sáng ngời như hai hòn bi ve lấp lánh trong bóng đêm.",
          "Cái đuôi dài ngoe nguẩy nhịp nhàng như chiếc cần ăng-ten tí hon.",
        ],
        personifications: [
          "Chú mèo Miu là một người gác đêm vô cùng mẫn cán và trung thành của gia đình em.",
          "Mỗi sớm mai, Miu lại ngồi làm điệu, dùng chân trước rửa mặt như một đứa trẻ ngoan.",
        ],
      },
      step5Checklist: [
        "Có kết hợp miêu tả ngoại hình với hoạt động không?",
        "Có ít nhất 2 hình ảnh so sánh và 1 câu nhân hóa?",
        "Chuyển đoạn mượt mà, không lặp từ?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Nếu có ai hỏi em về người bạn bốn chân đáng yêu nhất trong nhà, em sẽ không ngần ngại giới thiệu ngay chú mèo Miu - cục cưng tinh nghịch đã gắn bó với em suốt hai năm qua.",
      goodBodyExcerpt: "Miu khoác lên mình bộ lông trắng tinh xen vài đốm vàng óng ả, sờ vào mềm mượt như nhung. Đôi mắt chú tròn xoe, trong veo như hai viên ngọc bích. Dưới bốn bàn chân là những chiếc đệm thịt hồng hào, giúp chú di chuyển nhẹ tênh tựa như một làn khói lướt trên sàn nhà.",
      goodConclusionExample: "Miu không chỉ là chú mèo bắt chuột cừ khôi mà còn là người bạn nhỏ chia sẻ bao buồn vui tuổi thơ. Em luôn tự nhắc mình phải yêu thương và chăm sóc chú thật chu đáo mỗi ngày.",
    },
    suggestedRubricSummary: [
      "Bố cục 3 phần cân đối, miêu tả sinh động",
      "Vận dụng xuất sắc so sánh và nhân hóa",
      "Cảm xúc chân thật, từ ngữ gợi hình phong phú",
    ],
  },
  {
    id: "kd-kntt-t1-09",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 1 - Bài 28)",
    bookVolume: "tap1",
    genre: "mieu-ta-con-vat",
    genreLabel: "Văn miêu tả con vật",
    level: "bai",
    title: "Miêu tả chú gà trống dũng mãnh báo thức sớm mai",
    prompt: "Em hãy miêu tả chú gà trống nhà em (hoặc ở quê): vẻ oai phong lẫm liệt của chiếc mào đỏ, bộ lông rực rỡ và tiếng gáy vang dội xua tan màn đêm.",
    topic: "Con vật quê hương",
    targetWords: 180,
    lessonReference: "Tuần 14 - Bài 28: Viết bài văn miêu tả con vật (tiếp theo)",
    isFeatured: false,
    usageCount: 38,
    createdAt: "02/10/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Chú gà trống có đặc điểm gì nổi bật? Tiếng gáy của chú có ý nghĩa gì đối với buổi sáng làng quê?",
        targetGenre: "Văn miêu tả con vật",
        keyElements: ["Tả vẻ đẹp oai phong (mào, lông, cựa, đuôi)", "Tả tư thế cất tiếng gáy báo thức", "Tình cảm gắn bó với làng quê"],
      },
      step2Observation: {
        senses: {
          sight: "Mào đỏ chót như vương miện, lông cổ tía ánh kim, đuôi cong vút như cầu vồng, đôi chân vàng có cựa sắc",
          sound: "Tiếng 'Ò... ó... o...' dõng dạc, vang ngân khắp xóm làng",
          touch: "Bộ lông mượt mà, cứng cáp đầy sức mạnh",
          emotion: "Khâm phục tinh thần cần mẫn, tràn đầy năng lượng mỗi sớm mai",
        },
        guidingQuestions: [
          "Chú gà trống chuẩn bị tư thế vỗ cánh và cất tiếng gáy như thế nào?",
          "Khi chú cất tiếng gáy, vạn vật xung quanh thức giấc ra sao?",
        ],
      },
      step3Outline: {
        introduction: "Giới thiệu chú gà trống cồ oai vệ - chiếc đồng hồ báo thức chính xác nhất của xóm nhỏ.",
        body: [
          "Tả ngoại hình: Dáng đứng bệ vệ, ngực ưỡn về phía trước. Trên đầu đội chiếc mào đỏ rực như vương miện của một vị vua. Bộ lông rực rỡ như chiếc áo choàng nhung đủ sắc màu óng ánh.",
          "Tả hoạt động gáy sáng: Chú bay vụt lên đống rơm cao, vỗ cánh phành phạch giòn giã rồi vươn dài cổ cất tiếng gáy dõng dạc xua tan bóng tối mờ ảo.",
        ],
        conclusion: "Nêu ích lợi của chú gà trống, tình cảm yêu mến của cả nhà dành cho chú.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["oai vệ", "lẫm liệt", "chót vót", "rực rỡ", "dõng dạc", "phành phạch"],
        comparisons: [
          "Chiếc mào đỏ chót như một vương miện kiêu hãnh của vị chúa tể chuồng gà.",
          "Tiếng gáy vang xa như tiếng tù và giục giã vạn vật bừng tỉnh đón bình minh.",
        ],
        personifications: [
          "Chú gà trống như một người chiến sĩ dũng cảm đứng gác trên đài quan sát rơm vàng.",
        ],
      },
      step5Checklist: [
        "Làm nổi bật nét oai phong của chú gà?",
        "Tả sinh động âm thanh tiếng gáy?",
        "Không có lỗi chính tả l/n?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Khi những hạt sương đêm còn đọng long lanh trên cành lá, chú gà trống cồ nhà em đã cất lên khúc ca rộn rã đánh thức cả xóm làng bừng tỉnh.",
      goodBodyExcerpt: "Chú đứng hiên ngang trên bờ tường hoa, ngực nở nang, chiếc mào đỏ chót rung rinh kiêu hãnh. Bất ngờ, chú đập cánh 'phành phạch' ba hồi mạnh mẽ rồi vươn cao cổ, dõng dạc cất tiếng gáy 'Ò... ó... o... o!'. Tiếng gáy trong trẻo xé toang màn sương sớm, gọi ông mặt trời thức giấc tỏa ánh nắng chan hòa.",
      goodConclusionExample: "Chú gà trống là người bạn cần mẫn, không bao giờ trễ hẹn. Em yêu quý chú vô cùng và luôn dành cho chú những hạt thóc vàng ươm mỗi sớm mai.",
    },
    suggestedRubricSummary: [
      "Miêu tả sinh động dáng vẻ oai phong và động tác gáy",
      "Vận dụng so sánh và nhân hóa gợi cảm",
      "Câu văn dứt khoát, giàu âm điệu",
    ],
  },

  // =========================================================================
  // TẬP HAI — THỂ LOẠI: ĐOẠN VĂN NÊU TÌNH CẢM, CẢM XÚC
  // =========================================================================
  {
    id: "kd-kntt-t2-10",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 2 - Bài 3)",
    bookVolume: "tap2",
    genre: "doan-van-tinh-cam",
    genreLabel: "Đoạn văn nêu tình cảm, cảm xúc",
    level: "doan",
    title: "Nêu tình cảm, cảm xúc đối với người mẹ kính yêu",
    prompt: "Viết đoạn văn (từ 5 đến 7 câu) bày tỏ tình cảm yêu thương, lòng biết ơn sâu sắc đối với mẹ của em qua một kỉ niệm hoặc việc làm chăm sóc hằng ngày.",
    topic: "Gia đình & Tình mẫu tử",
    targetWords: 100,
    lessonReference: "Tuần 19 - Bài 3: Viết đoạn văn nêu tình cảm, cảm xúc",
    isFeatured: true,
    usageCount: 72,
    createdAt: "05/01/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Đối tượng bộc lộ cảm xúc là ai? Hành động chăm sóc nào của mẹ làm em xúc động nhất?",
        targetGenre: "Đoạn văn biểu cảm / nêu tình cảm cảm xúc",
        keyElements: [
          "Mở đoạn: Nêu tình cảm yêu quý nhất dành cho mẹ",
          "Thân đoạn: Nhớ lại một kỉ niệm cụ thể (khi em bị ốm, đêm khuya mẹ quạt mát, đôi bàn tay mẹ lam lũ)",
          "Kết đoạn: Lời hứa ngoan ngoãn, chăm học để mẹ vui lòng",
        ],
      },
      step2Observation: {
        senses: {
          sight: "Vết chân chim nơi đuôi mắt mẹ, bàn tay ram ráp vì vất vả, nụ cười hiền dịu ấm áp",
          sound: "Giọng nói êm ái dỗ dành khi em đau ốm, tiếng thở dài nhẹ nhõm khi em hạ sốt",
          touch: "Bàn tay mẹ xoa trán mát rượi, chiếc khăn ấm áp lau mồ hôi cho em",
          emotion: "Biết ơn vô bờ, thương mẹ nghẹn ngào, mong muốn được lớn nhanh để chở che cho mẹ",
        },
        guidingQuestions: [
          "Có kỉ niệm nào làm em không bao giờ quên về tình yêu thương của mẹ?",
          "Em muốn nói với mẹ điều gì nhất từ tận đáy lòng?",
        ],
      },
      step3Outline: {
        introduction: "Câu mở đoạn: Trong cuộc đời này, người em yêu thương và kính trọng nhất chính là mẹ.",
        body: [
          "Em nhớ mãi đêm em bị sốt cao, mẹ thức trắng đêm bên giường bệnh để chườm khăn mát và quạt cho em ngủ say giấc.",
          "Đôi mắt mẹ thâm quầng vì lo lắng nhưng vẫn luôn dịu dàng mỉm cười xoa dịu nỗi đau của em.",
        ],
        conclusion: "Câu kết đoạn: Em tự hứa sẽ luôn chăm chỉ học tập và ngoan ngoãn để mẹ không phải bận lòng vì em.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["bao la", "thao thức", "dịu dàng", "ấm áp", "thâm quầng", "vô bờ bến"],
        comparisons: [
          "Tình yêu thương của mẹ dành cho em như dòng suối ngọt ngào tưới mát suốt đời em.",
          "Ánh mắt mẹ hiền từ như vầng trăng rằm soi tỏ đêm đen.",
        ],
        personifications: [],
      },
      step5Checklist: [
        "Đoạn văn giàu cảm xúc, chân thành?",
        "Có kết hợp kể kỉ niệm làm điểm tựa cho cảm xúc?",
        "Dấu câu chấm phẩy đúng vị trí?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Trong trái tim em, mẹ là người phụ nữ tuyệt vời nhất, người đã dành trọn cả cuộc đời để chở che cho em khôn lớn.",
      goodBodyExcerpt: "Em nhớ mãi những đêm đông buốt giá, mẹ lặng lẽ thức dậy kéo lại chăn ấm cho em, rồi lại cặm cụi bên bàn làm việc đến tận khuya. Đôi bàn tay mẹ tuy ram ráp vì lam lũ nhưng mỗi khi xoa lên vầng trán em lại êm ái lạ kì.",
      goodConclusionExample: "Mỗi ngày trôi qua, nhìn tóc mẹ điểm bạc, em càng thương mẹ nhiều hơn và tự hứa sẽ học thật giỏi để mang lại nụ cười rạng rỡ cho mẹ.",
    },
    suggestedRubricSummary: [
      "Cảm xúc chân thật, lay động lòng người",
      "Kỉ niệm ngắn gọn, làm nổi bật lòng biết ơn",
      "Ngôn từ ấm áp, giàu sức gợi",
    ],
  },
  {
    id: "kd-kntt-t2-11",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 2 - Bài 7)",
    bookVolume: "tap2",
    genre: "doan-van-tinh-cam",
    genreLabel: "Đoạn văn nêu tình cảm, cảm xúc",
    level: "doan",
    title: "Nêu tình cảm, lòng biết ơn sâu sắc đối với thầy cô giáo",
    prompt: "Viết đoạn văn nêu tình cảm và lòng biết ơn của em đối với thầy giáo hoặc cô giáo đã dìu dắt, dạy dỗ em từng nét chữ, bài toán hay.",
    topic: "Thầy cô & Mái trường",
    targetWords: 95,
    lessonReference: "Tuần 21 - Bài 7: Luyện viết đoạn văn nêu tình cảm với thầy cô",
    isFeatured: false,
    usageCount: 41,
    createdAt: "10/01/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Người thầy, cô giáo em muốn viết là ai? Kỉ niệm ân cần nào của thầy cô làm em nhớ nhất?",
        targetGenre: "Đoạn văn nêu tình cảm kính trọng",
        keyElements: ["Giới thiệu tên thầy/cô", "Kỉ niệm được thầy cô uốn nắn từng nét chữ hay động viên", "Lòng biết ơn và mong ước"],
      },
      step2Observation: {
        senses: {
          sight: "Bụi phấn trắng bay vương trên mái tóc cô, nụ cười động viên ấm áp",
          sound: "Giọng giảng bài ấm áp, truyền cảm, từng lời khuyên ân cần",
          touch: "Bàn tay ấm của cô cầm tay em nắn nót từng nét chữ đầu đời",
          emotion: "Kính trọng, biết ơn, tự hào khi được làm học trò của cô",
        },
        guidingQuestions: [
          "Cô giáo đã giúp em vượt qua một bài toán khó hoặc sửa một tật xấu thế nào?",
          "Hình ảnh bụi phấn vương trên tóc cô gợi cho em cảm xúc gì?",
        ],
      },
      step3Outline: {
        introduction: "Giới thiệu cô Hương - cô giáo chủ nhiệm tận tâm của lớp em.",
        body: [
          "Cô luôn kiên nhẫn giảng lại từng bài toán khó cho đến khi cả lớp đều hiểu rõ.",
          "Mỗi khi nhìn bụi phấn vương trên mái tóc cô, em lại dâng lên niềm cảm phục trước sự hy sinh thầm lặng của người lái đò.",
        ],
        conclusion: "Em kính chúc cô luôn mạnh khỏe và xin hứa sẽ cố gắng đạt danh hiệu học sinh xuất sắc để đền đáp công ơn của cô.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["tận tụy", "ân cần", "bao dung", "thầm lặng", "bụi phấn", "ấm áp"],
        comparisons: ["Lời cô dạy như ngọn hải đăng soi sáng con đường tri thức cho chúng em."],
        personifications: [],
      },
      step5Checklist: [
        "Xưng hô kính cẩn, lễ phép?",
        "Từ ngữ biểu cảm đắt giá?",
        "Bố cục câu đoạn gãy gọn?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Nếu cha mẹ cho em hình hài thì thầy cô chính là người mở ra cho em cánh cửa tri thức bao la.",
      goodBodyExcerpt: "Em yêu quý nhất là nụ cười hiền hậu của cô Hương mỗi sớm đón chúng em vào lớp. Giọng cô giảng bài ấm áp như dòng suối mát lành, kiên nhẫn chỉ bảo cho em từng cách đặt câu, từng phép tính khó.",
      goodConclusionExample: "Hình bóng cô bên trang giáo án dưới ánh đèn khuya sẽ mãi là nguồn động lực thôi thúc em vươn lên trong học tập.",
    },
    suggestedRubricSummary: [
      "Bộc lộ tình cảm biết ơn chân thành",
      "Hình ảnh người thầy cô xúc động, đẹp đẽ",
      "Diễn đạt mạch lạc, không sai chính tả",
    ],
  },

  // =========================================================================
  // TẬP HAI — THỂ LOẠI: BÀI VĂN MIÊU TẢ CÂY CỐI
  // =========================================================================
  {
    id: "kd-kntt-t2-12",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 2 - Bài 18)",
    bookVolume: "tap2",
    genre: "mieu-ta-cay-coi",
    genreLabel: "Văn miêu tả cây cối",
    level: "bai",
    title: "Miêu tả cây bàng thân thương trên sân trường em",
    prompt: "Em hãy viết bài văn miêu tả cây bàng nơi góc sân trường theo sự biến đổi kì diệu qua bốn mùa (xuân, hạ, thu, đông) hoặc vẻ đẹp che mát trong những giờ ra chơi.",
    topic: "Cây bóng mát",
    targetWords: 220,
    lessonReference: "Tuần 24 - Bài 18: Viết bài văn miêu tả cây cối",
    isFeatured: true,
    usageCount: 85,
    createdAt: "15/01/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Cây bàng trồng ở đâu trên sân trường? Cây bàng biến đổi như thế nào qua các mùa trong năm?",
        targetGenre: "Văn miêu tả cây cối (tả theo trình tự thời gian / mùa hoặc tả từng bộ phận)",
        keyElements: [
          "Mở bài gián tiếp: Tiếng trống trường, bóng mát sân trường dẫn đến cây bàng",
          "Thân bài: Tả bao quát -> Tả chi tiết gốc, rễ, thân vỏ, tán lá nhiều tầng -> Tả cây bàng qua 4 mùa hoặc hoạt động học trò",
          "Kết bài mở rộng: Tình cảm gắn bó với cây bàng suốt những năm tiểu học",
        ],
      },
      step2Observation: {
        senses: {
          sight: "Tán bàng xòe rộng thành nhiều tầng như những chiếc ô xanh xếp chồng lên nhau. Mùa xuân lộc non nhú lên như những ngọn nến xanh, mùa thu lá chuyển màu đồng thau, mùa đông lá đỏ rực như đồng hun",
          sound: "Tiếng gió xào xạc luồn qua kẽ lá, tiếng chim sẻ ríu rít gọi bầy, tiếng cười đùa vang dội dưới bóng râm",
          touch: "Lớp vỏ cây xù xì, ram ráp rêu phong, lá bàng nhẵn bóng mát rượi",
          emotion: "Gắn bó thân thương như một người bạn tri kỉ che chở cho tuổi thơ",
        },
        guidingQuestions: [
          "Cây bàng mùa đông rụng lá trông như thế nào, rồi sang xuân bừng tỉnh ra sao?",
          "Dưới bóng mát của cây bàng, em và các bạn thường chơi những trò chơi gì?",
        ],
      },
      step3Outline: {
        introduction: "Mở bài gián tiếp: Dẫn dắt từ góc sân trường Chu Văn An rợp bóng mát, nơi sừng sững bác bàng già thân quen.",
        body: [
          "Tả bao quát: Cây bàng nhìn từ xa như một tòa tháp xanh nhiều tầng hiên ngang giữa trời xanh.",
          "Tả chi tiết: Gốc cây to hai bạn ôm, rễ trồi lên như những con rắn nằm nghỉ. Thân cây xù xì màu nâu sẫm mang dấu vết thời gian. Cành cây xòe tròn đều thành từng tầng lớp che mát.",
          "Cây bàng bốn mùa: Mùa đông trơ trụi khẳng khiu như đang tích lũy sức sống; sang xuân cựa mình đâm chồi búp non óng ánh; mùa hè lá xanh thẫm che mát rượi đón tiếng ve ca.",
          "Kỉ niệm: Giờ ra chơi chúng em tụ tập dưới gốc bàng đọc truyện, nhặt quả bàng chín vàng thơm lừng.",
        ],
        conclusion: "Kết bài mở rộng: Dù mai này lên cấp hai xa mái trường, hình bóng bác bàng già che mát tuổi thơ vẫn mãi đọng lại trong tim em.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["khẳng khiu", "mỡ màng", "xào xạc", "xù xì", "tinh nghịch", "tươi tốt", "rợp bóng"],
        comparisons: [
          "Cây bàng như một chiếc ô khổng lồ màu xanh thẫm che mát cả một khoảng sân.",
          "Những búp lá non nhú lên như muôn ngàn ngọn nến xanh lung linh trong nắng sớm.",
          "Lá bàng mùa đông đỏ rực như những miếng đồng hun nhuộm màu thời gian.",
        ],
        personifications: [
          "Bác bàng già đứng trầm ngâm như một người lính gác trung thành của sân trường.",
          "Cây bàng dang rộng cánh tay ôm ấp và chở che bao tiếng cười trong trẻo của học trò.",
        ],
      },
      step5Checklist: [
        "Có miêu tả được nét đặc trưng phân tầng của cây bàng?",
        "Có kết hợp miêu tả cảnh vật với hoạt động của học sinh?",
        "Đầy đủ 3 phần: Mở bài gián tiếp, thân bài, kết bài mở rộng?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Giữa sân trường Chu Văn An thân yêu, nơi lưu giữ bao kỉ niệm đẹp của tuổi học trò, em yêu nhất là bác bàng già đứng sừng sững nơi góc sân, dang rộng vòng tay che mát cho chúng em qua từng mùa nắng mưa.",
      goodBodyExcerpt: "Nhìn từ xa, cây bàng như một chiếc tháp xanh kì vĩ với nhiều tầng lá xòe tròn đều tăm tắp. Thân cây to lớn, lớp vỏ nâu xám nứt nẻ in hằn dấu vết thời gian. Sang xuân, cây bàng như bừng tỉnh sau giấc ngủ đông dài, hàng ngàn búp non nhú ra xanh biếc như những ngọn nến ngọc bích lung linh dưới ánh ban mai rực rỡ.",
      goodConclusionExample: "Cây bàng không chỉ là một cái cây tỏa bóng mát mà đã trở thành người bạn tri kỉ chứng kiến từng bước trưởng thành của chúng em. Dù thời gian có trôi đi, bóng hình cây bàng thân thương sẽ mãi khắc sâu trong kí ức tuổi học trò.",
    },
    suggestedRubricSummary: [
      "Bố cục hoàn hảo, miêu tả trình tự bốn mùa hoặc từng bộ phận xuất sắc",
      "Vận dụng so sánh và nhân hóa tài tình, từ ngữ giàu chất thơ",
      "Gắn kết sinh động với hoạt động học trò",
    ],
  },
  {
    id: "kd-kntt-t2-13",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 2 - Bài 22)",
    bookVolume: "tap2",
    genre: "mieu-ta-cay-coi",
    genreLabel: "Văn miêu tả cây cối",
    level: "bai",
    title: "Miêu tả một cây ăn quả trĩu cành trong vườn nhà",
    prompt: "Em hãy viết bài văn miêu tả một cây ăn quả mà em yêu thích (cây xoài, cây ổi, cây chuối, cây bưởi...) từ lúc ra hoa đến khi quả chín thơm lừng.",
    topic: "Cây ăn quả",
    targetWords: 200,
    lessonReference: "Tuần 26 - Bài 22: Lập dàn ý và viết bài văn miêu tả cây ăn quả",
    isFeatured: true,
    usageCount: 64,
    createdAt: "20/01/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Cây ăn quả em tả là cây gì? Được trồng ở đâu và do ai chăm sóc? Quả có hương vị đặc trưng ra sao?",
        targetGenre: "Văn miêu tả cây cối (tập trung vào thời kì ra hoa, kết trái và hương vị quả)",
        keyElements: [
          "Mở bài: Giới thiệu cây ăn quả trong vườn ông bà hoặc vườn nhà",
          "Thân bài: Tả gốc, thân, cành lá -> Tả mùa hoa nở ngát hương -> Tả từng chùm quả từ non đến chín mọng",
          "Kết bài: Ích lợi của quả và tình cảm gắn bó chăm sóc cây",
        ],
      },
      step2Observation: {
        senses: {
          sight: "Những chùm quả lúc lỉu chen chúc nhau trên cành, vỏ quả từ xanh chuyển sang vàng ươm óng ả",
          sound: "Tiếng chim sâu lách chách chuyền cành, tiếng ong bay vù vù tìm mật hoa",
          touch: "Vỏ quả mịn màng mát rượi, giọt nhựa thơm dính nơi cuống quả",
          scentOrTaste: "Hương thơm ngào ngạt lan tỏa khắp khu vườn, vị ngọt lịm tan chảy trên đầu lưỡi",
          emotion: "Hân hoan mong chờ ngày hái quả, nhớ công ơn người trồng cây",
        },
        guidingQuestions: [
          "Khi hoa nở, ong bướm kéo đến như thế nào?",
          "Khi thưởng thức trái chín ngọt lành, em nhớ đến công lao chăm bón của ai?",
        ],
      },
      step3Outline: {
        introduction: "Mở bài gián tiếp: Câu ca dao 'Ăn quả nhớ kẻ trồng cây' dẫn dắt vào cây xoài cát do chính tay ông nội trồng.",
        body: [
          "Tả thân và tán cây: Thân cây xoài to bằng bắp đùi người lớn, cành lá xum xuê che mát cả một góc vườn.",
          "Mùa hoa nở: Hoa xoài li ti màu vàng ngà kết thành từng chùm như những hạt ngọc, hương thơm dịu nhẹ quyến rũ ong bướm.",
          "Mùa kết quả: Những quả xoài con ban đầu như chú cá bơi lội, rồi lớn dần tròn lẳn trĩu cành. Khi chín, vỏ chuyển màu vàng tươi mịn màng.",
          "Hương vị: Cắt từng miếng xoài vàng ruộm, vị ngọt thanh mát lịm lòng người.",
        ],
        conclusion: "Kết bài mở rộng: Em cùng ông tưới nước, bắt sâu mỗi chiều để cây mãi tươi tốt cho mùa sau trĩu quả.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["lúc lỉu", "vàng ruộm", "ngọt lịm", "xum xuê", "thoang thoảng", "trĩu trịt"],
        comparisons: [
          "Những chùm xoài chín lủng lẳng trên cành như những chú gà con đang nép mình dưới cánh mẹ.",
          "Thịt quả vàng ươm, ngọt ngào như giọt mật ong rừng nguyên chất.",
        ],
        personifications: [
          "Những quả xoài trĩu cành như đang cúi đầu mời gọi mọi người đến thưởng thức.",
        ],
      },
      step5Checklist: [
        "Có miêu tả đủ các giác quan: mắt nhìn, mũi ngửi, lưỡi nếm?",
        "Có biện pháp so sánh quả lúc non và lúc chín?",
        "Chính tả chính xác, chữ viết rõ ràng?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "'Ăn quả nhớ kẻ trồng cây' - Mỗi lần đứng dưới bóng mát râm ran của cây xoài cát nơi góc vườn, em lại bồi hồi nhớ đến công lao chăm bón của ông nội từ những ngày em còn thơ bé.",
      goodBodyExcerpt: "Đến đầu mùa hè, cây xoài như trút bỏ chiếc áo xanh trầm mặc để khoác lên mình tấm áo quả trĩu trịt. Từng chùm xoài lúc lỉu chen chúc nhau, quả nào quả nấy đẫy đà, tròn lẳn. Khi chín, hương xoài thơm ngào ngạt lan khắp khu vườn, đánh thức bầy chim sâu rủ nhau về hót vang.",
      goodConclusionExample: "Được thưởng thức miếng xoài chín ngọt lịm do chính bàn tay ông chăm sóc, em càng thêm biết ơn và tự nhủ sẽ luôn phụ giúp ông tưới tắm cho cây mỗi ngày.",
    },
    suggestedRubricSummary: [
      "Miêu tả sinh động quá trình đơm hoa kết trái",
      "Huy động khéo léo nhiều giác quan",
      "Thể hiện tình cảm gia đình ấm áp",
    ],
  },
  {
    id: "kd-kntt-t2-14",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 2 - Bài 24)",
    bookVolume: "tap2",
    genre: "mieu-ta-cay-coi",
    genreLabel: "Văn miêu tả cây cối",
    level: "bai",
    title: "Miêu tả cây hoa đào ngày Tết khoe sắc rực rỡ",
    prompt: "Em hãy viết bài văn miêu tả cây hoa đào (hoặc cây hoa mai) đón Tết, làm nổi bật sắc hồng thắm của cánh hoa, những búp nụ e ấp và không khí ấm áp sum vầy của mùa xuân.",
    topic: "Cây hoa ngày Tết",
    targetWords: 190,
    lessonReference: "Tuần 27 - Bài 24: Viết bài văn miêu tả cây hoa",
    isFeatured: false,
    usageCount: 47,
    createdAt: "25/01/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Cây hoa đào xuất hiện vào dịp nào? Cây đào mang lại ý nghĩa gì cho không khí ngày Tết đoàn viên?",
        targetGenre: "Văn miêu tả cây hoa",
        keyElements: ["Tả dáng cây đào (thế uốn lượn)", "Tả cành, lá non, nụ hoa e ấp và cánh hoa bung nở", "Gắn với niềm vui sum họp gia đình ngày Tết"],
      },
      step2Observation: {
        senses: {
          sight: "Cánh hoa phớt hồng mỏng manh như cánh bướm, nhụy vàng óng ả, cành cây nâu xám gân guốc điểm xuyết những chiếc bao lì xì đỏ thắm",
          sound: "Tiếng cười rộn rã đón xuân, giai điệu nhạc Tết rộn ràng bên mâm cỗ",
          touch: "Cánh hoa mịn màng như nhung, giọt mưa xuân lất phất đọng trên nụ hoa mát lạnh",
          emotion: "Rạo rực, tươi vui, tràn ngập hy vọng một năm mới an khang thịnh vượng",
        },
        guidingQuestions: [
          "Những búp nụ đào hé nở dưới làn mưa xuân ấm áp như thế nào?",
          "Cây đào đặt ở phòng khách làm bừng sáng không gian ngôi nhà ra sao?",
        ],
      },
      step3Outline: {
        introduction: "Giới thiệu cây hoa đào phai bố mua về chưng Tết nơi phòng khách.",
        body: [
          "Tả dáng cây: Dáng rồng bay uốn lượn kiêu hãnh trong chậu sứ trắng.",
          "Tả cành và hoa: Cành khẳng khiu nhưng chi chít những nụ hoa chúm chím. Đêm giao thừa, từng cánh hoa đào màu hồng thắm bừng nở rạng rỡ khoe nhụy vàng tươi tắn.",
          "Trang trí: Cả nhà cùng treo những dây kim tuyến óng ánh và những phong bao lì xì may mắn lên cành đào.",
        ],
        conclusion: "Khẳng định hoa đào là sứ giả của mùa xuân, mang may mắn và hạnh phúc đến cho mọi nhà.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["chúm chím", "e ấp", "hồng thắm", "mỏng manh", "ấm áp", "sum vầy"],
        comparisons: [
          "Cánh đào mỏng manh như cánh bướm chao nghiêng trong gió xuân.",
          "Những giọt mưa xuân đọng trên nụ đào như những hạt ngọc lấp lánh.",
        ],
        personifications: [
          "Cây hoa đào như một nàng tiên mùa xuân kiều diễm khoác áo hồng rực rỡ.",
        ],
      },
      step5Checklist: [
        "Làm nổi bật nét đẹp đặc trưng của hoa đào ngày Tết?",
        "Vận dụng so sánh sinh động?",
        "Chính tả chỉn chu?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Khi những cơn mưa phùn đầu xuân lất phất bay mang theo hơi thở ấm áp của đất trời, cũng là lúc cây hoa đào phai trước hiên nhà em bừng tỉnh khoe sắc đón Tết sang.",
      goodBodyExcerpt: "Cây đào được uốn theo thế 'long thăng' vươn cao đầy sức sống. Trên những nhánh cây nâu sẫm, gân guốc, hàng trăm nụ hoa chúm chím e ấp đang cựa mình. Chỉ sau một đêm giao thừa ấm áp, những cánh hoa hồng phớt mỏng như cánh bướm đồng loạt bung nở, khoe nhụy hoa vàng tươi như ánh nắng ban mai.",
      goodConclusionExample: "Cây đào không chỉ làm rạng rỡ không gian phòng khách mà còn thắp sáng niềm vui sum vầy của gia đình em trong những ngày đầu năm mới.",
    },
    suggestedRubricSummary: [
      "Tả sắc thái hoa đào tinh tế",
      "Gợi tả không khí xuân rộn ràng, ấm áp",
      "Từ ngữ mềm mại, giàu cảm xúc",
    ],
  },

  // =========================================================================
  // TẬP HAI — THỂ LOẠI: VIẾT HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN CÔNG VIỆC
  // =========================================================================
  {
    id: "kd-kntt-t2-15",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 2 - Bài 27)",
    bookVolume: "tap2",
    genre: "huong-dan-cong-viec",
    genreLabel: "Hướng dẫn thực hiện công việc",
    level: "doan",
    title: "Hướng dẫn các bước gấp một món đồ chơi bằng giấy",
    prompt: "Em hãy viết đoạn văn (từ 5 đến 7 câu) hướng dẫn các bước gấp một món đồ chơi bằng giấy đơn giản mà em thuần thục (gấp chiếc máy bay giấy, chú ếch nhảy hoặc chiếc thuyền buồm).",
    topic: "Đồ chơi & Khéo tay",
    targetWords: 110,
    lessonReference: "Tuần 29 - Bài 27: Viết hướng dẫn các bước thực hiện một công việc",
    isFeatured: true,
    usageCount: 53,
    createdAt: "01/02/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Món đồ chơi em muốn hướng dẫn là gì? Cần chuẩn bị những dụng cụ gì và các bước gấp theo trình tự ra sao?",
        targetGenre: "Đoạn văn hướng dẫn thực hiện công việc (ngôn ngữ chính xác, thứ tự rõ ràng)",
        keyElements: [
          "Chuẩn bị nguyên liệu (tờ giấy hình vuông hoặc hình chữ nhật, bút màu)",
          "Từ ngữ chỉ thứ tự: Đầu tiên, Bước một, Tiếp theo, Sau đó, Cuối cùng",
          "Mẹo nhỏ để món đồ chơi đẹp và hoạt động tốt (miết phẳng nếp gấp)",
        ],
      },
      step2Observation: {
        senses: {
          sight: "Màu sắc tờ giấy thủ công, các đường nếp gấp sắc sảo, sản phẩm hoàn thiện ngộ nghĩnh",
          touch: "Miết ngón tay dọc nếp gấp phẳng lì",
          sound: "Tiếng xào xạc của giấy khi gấp",
          emotion: "Khéo léo, kiên nhẫn, vui mừng khi sản phẩm hoàn thành",
        },
        guidingQuestions: [
          "Để chiếc máy bay bay xa hoặc chú ếch nhảy cao, bước nào là quan trọng nhất?",
          "Em miêu tả các bước thế nào để bạn đọc có thể làm theo dễ dàng nhất?",
        ],
      },
      step3Outline: {
        introduction: "Câu mở đoạn: Gấp một chiếc thuyền giấy xinh xắn thả trôi trên dòng nước là trò chơi vô cùng thú vị và dễ làm.",
        body: [
          "Đầu tiên, chuẩn bị một tờ giấy hình chữ nhật sạch sẽ, gấp đôi tờ giấy lại theo chiều ngang.",
          "Bước tiếp theo, gập hai góc trên vào giữa tạo thành một hình tam giác nhọn cân đối.",
          "Sau đó, gấp phần mép giấy thừa ở dưới lên trên ở cả hai mặt trước và sau.",
          "Tiếp tục mở rộng đáy và ép hai góc lại với nhau thành hình thoi, kéo nhẹ hai đỉnh sang hai bên.",
        ],
        conclusion: "Cuối cùng, chiếc thuyền buồm kiêu hãnh đã hoàn thành, sẵn sàng căng buồm ra khơi trong chậu nước mát.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["miết phẳng", "cân đối", "khéo léo", "vuốt nhẹ", "thẳng thớm"],
        comparisons: ["Chiếc thuyền giấy xinh xắn như một chú thiên nga trắng bồng bềnh trên mặt nước."],
        personifications: [],
      },
      step5Checklist: [
        "Có đầy đủ từ chỉ thứ tự các bước không?",
        "Lời chỉ dẫn rõ ràng, người đọc làm theo được?",
        "Không viết câu lủng củng?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Gấp một chú ếch giấy biết nhảy tanh tách là một trò chơi thủ công đơn giản nhưng đem lại niềm vui bất tận cho chúng em.",
      goodBodyExcerpt: "Đầu tiên, em chuẩn bị một tờ giấy màu hình vuông, gấp chéo hai đường để tạo giao điểm ở chính giữa. Tiếp theo, khéo léo gập các cạnh vào trong để tạo thành hình tam giác hai lớp. Sau đó, lần lượt gập hai góc dưới lên làm hai chân trước và gấp zic-zac phần đuôi làm bàn đạp cho chân sau.",
      goodConclusionExample: "Chỉ cần dùng ngón tay ấn nhẹ vào lưng rồi thả ra, chú ếch sẽ bật nhảy tanh tách về phía trước trong tiếng vỗ tay giòn giã của cả bọn.",
    },
    suggestedRubricSummary: [
      "Trình tự các bước khoa học, chính xác",
      "Sử dụng từ nối chỉ thời gian nhuần nhuyễn",
      "Câu văn gãy gọn, dễ hiểu",
    ],
  },
  {
    id: "kd-kntt-t2-16",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 2 - Bài 29)",
    bookVolume: "tap2",
    genre: "huong-dan-cong-viec",
    genreLabel: "Hướng dẫn thực hiện công việc",
    level: "doan",
    title: "Hướng dẫn các bước chăm sóc một chậu cây cảnh hoặc hoa trong nhà",
    prompt: "Em hãy viết đoạn văn hướng dẫn các bạn cách tưới nước và chăm sóc một chậu hoa nhỏ đặt ở góc bàn học hoặc ban công để cây luôn xanh tốt.",
    topic: "Chăm sóc cây xanh",
    targetWords: 100,
    lessonReference: "Tuần 30 - Bài 29: Luyện tập viết hướng dẫn công việc",
    isFeatured: false,
    usageCount: 36,
    createdAt: "05/02/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Công việc chăm sóc gồm những thao tác nào? Thời điểm tưới nước thích hợp là lúc nào?",
        targetGenre: "Đoạn văn hướng dẫn quy trình",
        keyElements: ["Chuẩn bị bình xịt nước hoặc ô doa nhỏ", "Thời gian tưới (sáng sớm hoặc chiều mát)", "Nhặt lá úa, phơi nắng định kì"],
      },
      step2Observation: {
        senses: {
          sight: "Màu đất nâu ẩm ướt, những giọt nước đọng trên tán lá xanh mướt",
          sound: "Tiếng xịt nước êm ái xè xè, tiếng lá cây đung đưa đón nước",
          touch: "Đất tơi xốp, lá cây mơn mởn mát lành",
          emotion: "Tỉ mỉ, yêu mến thiên nhiên, niềm vui nhìn cây lớn mỗi ngày",
        },
        guidingQuestions: [
          "Tại sao không nên tưới nước vào buổi trưa nắng gắt?",
          "Chăm sóc cây hoa đem lại niềm vui gì cho góc học tập của em?",
        ],
      },
      step3Outline: {
        introduction: "Câu mở đoạn: Để chậu hoa cúc bướm nơi bàn học luôn tươi tắn, việc chăm sóc hằng ngày là vô cùng cần thiết.",
        body: [
          "Trước hết, mỗi sáng sớm em dùng bình xịt phun sương tưới nhẹ quanh gốc cây, tránh tưới đẫm làm ngập rễ.",
          "Tiếp theo, cẩn thận dùng tay ngắt bỏ những chiếc lá vàng úa và bắt những con sâu nhỏ ẩn nấp dưới phiến lá.",
          "Cuối cùng, định kì hai ngày một lần đem chậu cây ra đón ánh nắng ban mai khoảng một giờ đồng hồ.",
        ],
        conclusion: "Nhờ được chăm sóc đúng cách, chậu cây luôn xanh tốt, tỏa hương thơm ngát tiếp thêm năng lượng học tập cho em.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["phun sương", "tơi xốp", "mơn mởn", "tỉ mẩn", "xanh tốt"],
        comparisons: ["Những giọt sương đọng trên cánh hoa lấp lánh như những hạt kim cương nhỏ."],
        personifications: ["Cây hoa như nhoẻn cười cảm ơn bàn tay chăm sóc cần mẫn của em."],
      },
      step5Checklist: [
        "Có cảnh báo lưu ý an toàn hoặc mẹo hữu ích?",
        "Các bước logic theo đúng quy luật sinh học?",
        "Chính tả chuẩn xác?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Chăm sóc một chậu cây nhỏ không chỉ làm đẹp góc bàn học mà còn giúp chúng em rèn luyện tính kiên nhẫn và tình yêu thiên nhiên.",
      goodBodyExcerpt: "Trước hết, vào mỗi sáng sớm, hãy dùng bình xịt phun sương đều đặn quanh gốc cây, lưu ý không tưới quá nhiều khiến rễ bị úng nước. Tiếp theo, dùng kéo nhỏ tỉ mẩn bấm bỏ những cành lá khô vàng để cây tập trung nuôi chồi non. Sau đó, lau sạch bụi bám trên chậu sứ và đặt cây nơi có ánh sáng chan hòa.",
      goodConclusionExample: "Chỉ với vài thao tác đơn giản mỗi ngày, chậu cây sẽ luôn căng tràn sức sống, mỉm cười đón chào em mỗi buổi sáng thức giấc.",
    },
    suggestedRubricSummary: [
      "Các bước rõ ràng, khoa học và thực tế",
      "Ngôn ngữ mạch lạc, đúng thể loại hướng dẫn",
      "Có giá trị giáo dục ý thức bảo vệ môi trường",
    ],
  },

  // =========================================================================
  // TẬP HAI — THỂ LOẠI: ĐOẠN VĂN / BÀI VĂN TƯỞNG TƯỢNG
  // =========================================================================
  {
    id: "kd-kntt-t2-17",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 2 - Bài 31)",
    bookVolume: "tap2",
    genre: "tuong-tuong",
    genreLabel: "Văn tưởng tượng",
    level: "doan",
    title: "Tưởng tượng cuộc trò chuyện ngộ nghĩnh giữa em và chiếc bút mực",
    prompt: "Em hãy viết đoạn văn tưởng tượng một đêm nọ, chiếc bút mực thân yêu bỗng cất tiếng trò chuyện tâm sự cùng em về những trang vở sạch đẹp và lời nhắc nhở giữ gìn đồ dùng học tập.",
    topic: "Đồ dùng học tập & Trí tưởng tượng",
    targetWords: 110,
    lessonReference: "Tuần 32 - Bài 31: Viết đoạn văn tưởng tượng",
    isFeatured: true,
    usageCount: 61,
    createdAt: "10/02/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Cuộc gặp gỡ diễn ra trong hoàn cảnh nào? Chiếc bút nói gì với em và em đáp lại ra sao?",
        targetGenre: "Đoạn văn tưởng tượng (sử dụng nhân hóa cao độ)",
        keyElements: [
          "Hoàn cảnh kì diệu (đêm khuya thanh vắng, khi ngồi vào bàn học)",
          "Lời tâm sự của chiếc bút về niềm vui khi giúp em viết chữ đẹp, nỗi buồn khi bị làm rơi rớt",
          "Lời hứa của em về việc giữ gìn nâng niu đồ dùng học tập",
        ],
      },
      step2Observation: {
        senses: {
          sight: "Chiếc ngòi bút sáng bóng như nụ cười, dòng mực tím chảy đều đặn trên trang giấy trắng tinh",
          sound: "Tiếng thì thầm khe khẽ trong đêm thanh vắng, tiếng sột soạt lướt trên mặt giấy",
          emotion: "Bất ngờ, thú vị, trân quý và biết ơn người bạn đồng hành thầm lặng",
        },
        guidingQuestions: [
          "Bút mực khen ngợi hoặc nhắc nhở em điều gì?",
          "Sau cuộc trò chuyện kì lạ đó, em có thay đổi thói quen dùng bút không?",
        ],
      },
      step3Outline: {
        introduction: "Câu mở đoạn: Trong giấc mơ đêm qua, em đã có một cuộc trò chuyện vô cùng kì diệu với bạn bút mực nắp vàng.",
        body: [
          "Bút khẽ rung rinh ngòi thép rồi mỉm cười nói: 'Minh An ơi, tớ rất vui vì được cùng cậu nắn nót từng điểm mười môn Chính tả!'.",
          "Thế nhưng giọng bạn chợt chùng xuống: 'Nhưng mỗi lần cậu sơ ý làm tớ rơi xuống đất, ngòi tớ đau nhói và mực bị tắc đấy!'.",
          "Em ngượng ngùng xin lỗi bạn và cẩn thận dùng khăn mềm lau sạch vết mực lem trên thân bút.",
        ],
        conclusion: "Câu kết đoạn: Tỉnh dậy, em đặt bút vào hộp cẩn thận và thầm hứa sẽ luôn nâng niu bạn như một tri kỉ thân thiết.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["kì diệu", "rung rinh", "ngượng ngùng", "nắn nót", "nâng niu", "sột soạt"],
        comparisons: ["Ngòi bút lướt trên trang giấy như một nghệ sĩ múa ba lê điêu luyện."],
        personifications: [
          "Bạn bút mực nắp vàng cất giọng nói trong trẻo như tiếng chuông ngân.",
          "Trang vở trắng tinh như đang lắng tai nghe lời tâm tình của đôi bạn nhỏ.",
        ],
      },
      step5Checklist: [
        "Có yếu tố tưởng tượng độc đáo, hấp dẫn?",
        "Lời thoại đặt trong ngoặc kép hoặc gạch đầu dòng chuẩn?",
        "Giữ được ý nghĩa giáo dục ý thức giữ gìn sách vở?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Đêm khuya thanh vắng, khi ánh trăng trườn qua khung cửa sổ chiếu lên bàn học, một điều kì diệu bất ngờ đã xảy ra.",
      goodBodyExcerpt: "Chiếc bút mực nắp vàng bỗng rung rinh rồi cất giọng thỏ thẻ: 'Cậu chủ nhỏ ơi! Tớ rất tự hào khi được cùng cậu viết nên những trang vở sạch chữ đẹp. Nhưng mỗi lần cậu làm tớ rơi từ trên bàn xuống sàn, ngòi tớ đau buốt và chảy cả dòng mực tím đấy!'. Nghe bạn nói, em ngượng chín mặt, vội ôm bút vào lòng xin lỗi.",
      goodConclusionExample: "Từ hôm đó, sau mỗi buổi học, em đều cẩn thận đậy nắp và cất bạn bút vào hộp bút êm ái như một lời cảm ơn chân thành nhất.",
    },
    suggestedRubricSummary: [
      "Trí tưởng tượng phong phú, ngộ nghĩnh",
      "Vận dụng nhân hóa tài tình",
      "Mang thông điệp giáo dục nhẹ nhàng, sâu sắc",
    ],
  },
  {
    id: "kd-kntt-t2-18",
    source: "source_doc",
    sourceLabel: "Vở BT Tập làm văn 4 (KNTT Tập 2 - Bài 32)",
    bookVolume: "tap2",
    genre: "tuong-tuong",
    genreLabel: "Văn tưởng tượng",
    level: "doan",
    title: "Tưởng tượng chuyến du hành đến hành tinh xanh tương lai",
    prompt: "Em hãy viết đoạn văn tưởng tượng em được ngồi trên một con tàu vũ trụ hiện đại, bay đến khám phá một hành tinh xanh tươi đẹp trong năm 2050.",
    topic: "Khoa học & Vũ trụ",
    targetWords: 120,
    lessonReference: "Tuần 33 - Bài 32: Luyện tập viết đoạn văn tưởng tượng",
    isFeatured: false,
    usageCount: 44,
    createdAt: "15/02/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Phương tiện du hành là gì? Hành tinh tương lai có gì đặc biệt (cây cối, công nghệ xanh, sinh vật thân thiện)?",
        targetGenre: "Đoạn văn tưởng tượng viễn tưởng",
        keyElements: ["Cảm giác khi con tàu bay vào không gian", "Cảnh tượng tráng lệ của hành tinh xanh", "Thông điệp bảo vệ Trái Đất"],
      },
      step2Observation: {
        senses: {
          sight: "Dải Ngân hà lấp lánh như triệu hạt kim cương, những thành phố lơ lửng trên mây, xe bay không khói",
          sound: "Tiếng động cơ phản lực êm ru, bản nhạc du dương phát ra từ các đóa hoa phát sáng",
          emotion: "Kinh ngạc, choáng ngợp, tự hào về trí tuệ của con người",
        },
        guidingQuestions: [
          "Hành tinh xanh giải quyết vấn đề rác thải và ô nhiễm môi trường ra sao?",
          "Chuyến đi tưởng tượng thôi thúc em ước mơ gì cho tương lai?",
        ],
      },
      step3Outline: {
        introduction: "Câu mở đoạn: Năm 2050, em vinh dự trở thành phi hành gia nhí trên con tàu vũ trụ mang tên 'Khát Vọng Xanh'.",
        body: [
          "Sau cú phóng lướt qua màn đêm vũ trụ, trước mắt em hiện ra một hành tinh rực rỡ được bao bọc bởi thảm thực vật xanh biếc.",
          "Nơi đây không có khói bụi hay tiếng còi xe inh ỏi, mọi người di chuyển bằng những chiếc xe bong bóng năng lượng mặt trời.",
          "Những tòa nhà được xây bằng pha lê quang hợp tạo ra nguồn dưỡng khí trong lành tuyệt đối.",
        ],
        conclusion: "Câu kết đoạn: Chuyến du hành thôi thúc em học tập thật giỏi để mai này biến Trái Đất thân yêu trở thành một hành tinh xanh tươi đẹp như thế.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["lấp lánh", "kì vĩ", "êm ru", "pha lê", "trong lành", "bạt ngàn"],
        comparisons: [
          "Con tàu vũ trụ lướt đi nhẹ nhàng như một mũi tên ánh sáng xé toang màn đêm.",
          "Hành tinh hiện ra lộng lẫy như một viên ngọc lục bảo giữa dải Ngân hà.",
        ],
        personifications: [],
      },
      step5Checklist: [
        "Ý tưởng sáng tạo, mang tính nhân văn?",
        "Câu văn giàu hình ảnh viễn tưởng?",
        "Chính tả chuẩn xác?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Vào một ngày của năm 2050, em bước lên con tàu vũ trụ mang tên 'Hy Vọng' để bắt đầu chuyến thám hiểm tới Hành Tinh Xanh.",
      goodBodyExcerpt: "Nhìn qua ô cửa sổ con tàu, vũ trụ bao la hiện ra huyền ảo với muôn ngàn vì tinh tú lấp lánh như kim cương. Khi đáp xuống hành tinh mới, em ngỡ ngàng trước những dòng sông nước trong vắt thấy đáy và những khu rừng nhân tạo tự lọc sạch không khí. Con người và muông thú nơi đây cùng chung sống hòa thuận trong những ngôi nhà năng lượng mặt trời thông minh.",
      goodConclusionExample: "Chuyến bay kết thúc nhưng đã thắp sáng trong em ngọn lửa đam mê khoa học và ước mơ chung tay gìn giữ màu xanh cho Trái Đất thân yêu.",
    },
    suggestedRubricSummary: [
      "Ý tưởng viễn tưởng phong phú, tích cực",
      "Gợi tả không gian vũ trụ sinh động",
      "Truyền tải thông điệp bảo vệ môi trường",
    ],
  },

  // =========================================================================
  // NGUỒN 2: ĐỀ LUYỆN TẬP BIÊN SOẠN (CURATED PRACTICE PROMPTS)
  // =========================================================================
  {
    id: "kd-bs-01",
    source: "curated",
    sourceLabel: "Đề luyện tập biên soạn chuyên sâu Edunova",
    bookVolume: "tap1",
    genre: "mieu-ta-con-vat",
    genreLabel: "Văn miêu tả con vật",
    level: "cau",
    title: "Mở rộng câu văn có hình ảnh so sánh miêu tả đôi mắt chú cún",
    prompt: "Từ câu đơn 'Đôi mắt chú cún con nhìn em.', em hãy mở rộng câu bằng cách thêm từ ngữ gợi tả màu sắc, cảm xúc và một hình ảnh so sánh độc đáo.",
    topic: "Con vật nuôi",
    targetWords: 35,
    lessonReference: "Chuyên đề rèn kỹ năng viết câu giàu hình ảnh",
    isFeatured: true,
    usageCount: 88,
    createdAt: "12/09/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Câu gốc là gì? Cần thêm thành phần nào để câu văn trở nên sinh động gấp nhiều lần?",
        targetGenre: "Luyện viết câu đơn mở rộng",
        keyElements: ["Thêm từ gợi tả đôi mắt (tròn xoe, đen láy, long lanh)", "Thêm hình ảnh so sánh (như hai hạt nhãn, như hai hòn bi ve)", "Thêm trạng ngữ hoặc cảm xúc"],
      },
      step2Observation: {
        senses: {
          sight: "Màu mắt đen láy, ươn ướt, ánh nhìn ngây thơ",
          emotion: "Quấn quýt, trung thành, tin cậy",
        },
        guidingQuestions: [
          "Mắt chú cún giống như đồ vật nào quen thuộc với em?",
          "Khi nhìn em, đôi mắt ấy biểu lộ tình cảm gì?",
        ],
      },
      step3Outline: {
        introduction: "Phân tích câu gốc: [Chủ ngữ: Đôi mắt chú cún con] + [Vị ngữ: nhìn em].",
        body: [
          "Bước 1: Thêm từ chỉ đặc điểm: 'Đôi mắt tròn xoe, đen láy...'",
          "Bước 2: Thêm so sánh: '...sáng long lanh như hai hòn bi ve trong suốt...'",
          "Bước 3: Thêm trạng ngữ chỉ tình cảm: 'Mỗi khi em đi học về, đôi mắt...'",
        ],
        conclusion: "Câu hoàn chỉnh đạt chuẩn xuất sắc.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["đen láy", "long lanh", "tròn xoe", "ngây thơ", "ấm áp"],
        comparisons: [
          "như hai hạt nhãn đen nhánh",
          "như hai giọt sương mai đọng trên lá",
        ],
        personifications: [],
      },
      step5Checklist: [
        "Đủ chủ ngữ và vị ngữ?",
        "Có từ ngữ so sánh (như, tựa như)?",
        "Dấu chấm câu ở cuối câu?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Câu mở rộng mẫu 1: Đôi mắt tròn xoe, đen láy của chú cún Bông ngước nhìn em tha thiết như hai hạt nhãn ươn ướt long lanh ánh cười.",
      goodBodyExcerpt: "Câu mở rộng mẫu 2: Mỗi khi nghe tiếng bước chân em đi học về, chú cún Mực lại ngước đôi mắt sáng ngời như hai hòn bi ve đen nhánh nhìn em đầy vẻ âu yếm.",
    },
    suggestedRubricSummary: [
      "Câu đúng ngữ pháp lớp 4, mở rộng thành phần khéo léo",
      "Hình ảnh so sánh chuẩn xác, đẹp đẽ",
    ],
  },
  {
    id: "kd-bs-02",
    source: "curated",
    sourceLabel: "Đề luyện tập biên soạn chuyên sâu Edunova",
    bookVolume: "tap2",
    genre: "mieu-ta-cay-coi",
    genreLabel: "Văn miêu tả cây cối",
    level: "doan",
    title: "Viết đoạn mở bài gián tiếp tả cây hoa hồng nhung",
    prompt: "Em hãy viết một đoạn mở bài gián tiếp (từ 3 đến 5 câu) dẫn dắt từ tình yêu thiên nhiên hoặc một buổi sớm mai tinh khôi vào hình ảnh khóm hoa hồng nhung kiêu hãnh trước hiên nhà.",
    topic: "Cây hoa",
    targetWords: 60,
    lessonReference: "Chuyên đề rèn kỹ năng viết Mở bài gián tiếp",
    isFeatured: true,
    usageCount: 75,
    createdAt: "20/01/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Mở bài gián tiếp khác mở bài trực tiếp ở điểm nào? Làm sao để câu dẫn dắt tự nhiên nhất?",
        targetGenre: "Đoạn văn mở bài gián tiếp",
        keyElements: [
          "Không vào đề đột ngột ('Nhà em có cây hoa hồng')",
          "Nói chuyện khác trước: buổi sáng mùa xuân, giọt sương, tiếng chim hót",
          "Dẫn dắt tự nhiên vào cây hoa hồng nhung",
        ],
      },
      step2Observation: {
        senses: {
          sight: "Cánh hoa đỏ thắm mịn màng, giọt sương mai lấp lánh",
          scentOrTaste: "Hương thơm nồng nàn dịu ngọt",
          emotion: "Say mê, ngỡ ngàng trước vẻ đẹp kiêu sa",
        },
        guidingQuestions: [
          "Mỗi sớm mai thức dậy, điều gì níu giữ bước chân em trước hiên nhà?",
        ],
      },
      step3Outline: {
        introduction: "Nói về vẻ đẹp của sớm mai khi sương chưa tan.",
        body: ["Khu vườn thức giấc cùng muôn sắc hoa tươi tắn.", "Nổi bật nhất giữa không gian ấy chính là nàng hoa hồng nhung kiêu sa."],
        conclusion: "Khẳng định vẻ đẹp thu hút lòng người của khóm hoa.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["kiêu sa", "đỏ thắm", "nhung mịn", "ngào ngạt", "long lanh"],
        comparisons: ["Cánh hoa mịn màng như tấm thảm nhung đỏ của hoàng cung."],
        personifications: ["Nàng hoa hồng nhung kiêu hãnh vươn mình đón ánh nắng sớm."],
      },
      step5Checklist: [
        "Lời dẫn dắt từ 2-4 câu ngắn gọn?",
        "Nêu đúng đối tượng cần tả?",
        "Liên kết câu mượt mà?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Mỗi sớm mai khi sương đêm còn đọng long lanh trên từng phiến lá, góc vườn nhỏ trước sân nhà em lại bừng lên sức sống diệu kì. Giữa muôn vàn sắc hoa tươi tắn, em say đắm nhất là dáng vẻ kiêu hãnh của nàng hoa hồng nhung đỏ thắm đang e ấp đón bình minh.",
    },
    suggestedRubricSummary: [
      "Mở bài gián tiếp tự nhiên, lôi cuốn",
      "Văn phong trong sáng, giàu nhạc điệu",
    ],
  },
  {
    id: "kd-bs-03",
    source: "curated",
    sourceLabel: "Đề luyện tập biên soạn chuyên sâu Edunova",
    bookVolume: "tap1",
    genre: "thuat-lai-su-viec",
    genreLabel: "Thuật lại sự việc",
    level: "bai",
    title: "Thuật lại một lễ hội truyền thống náo nức ở quê hương em",
    prompt: "Viết bài văn thuật lại một lễ hội truyền thống (hội làng, hội rước đèn Trung thu, lễ hội đua thuyền, hội chọi trâu...) mà em đã được chứng kiến, hòa mình trong không khí tưng bừng.",
    topic: "Lễ hội & Văn hóa dân tộc",
    targetWords: 210,
    lessonReference: "Chuyên đề Thuật lại hoạt động tập thể đông vui",
    isFeatured: false,
    usageCount: 40,
    createdAt: "22/09/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Tên lễ hội là gì? Diễn ra ở đâu và vào thời gian nào trong năm?",
        targetGenre: "Văn thuật lại sự việc quy mô lễ hội",
        keyElements: ["Phần lễ trang nghiêm", "Phần hội tưng bừng náo nhiệt với các trò chơi dân gian", "Cảm xúc tự hào về truyền thống quê hương"],
      },
      step2Observation: {
        senses: {
          sight: "Cờ ngũ sắc rợp trời, trang phục truyền thống rực rỡ, dòng người nườm nượp",
          sound: "Tiếng trống hội 'Tùng! Tùng! Tùng!' rộn rã, tiếng hò reo cổ vũ vang dội sông nước",
          emotion: "Náo nức, tự hào, gắn kết cộng đồng",
        },
        guidingQuestions: [
          "Trò chơi dân gian nào trong phần hội làm em ấn tượng và hồi hộp nhất?",
        ],
      },
      step3Outline: {
        introduction: "Giới thiệu Hội Đua thuyền truyền thống trên dòng sông quê em vào mùng bốn Tết.",
        body: [
          "Khâu chuẩn bị: Bờ sông rực rỡ cờ hoa, người dân từ khắp nơi đổ về nườm nượp.",
          "Diễn biến thi đấu: Hiệu lệnh trống giục giã, các tay chèo khỏe khoắn vung dầm nhịp nhàng xé nước lao đi.",
          "Không khí cổ vũ: Tiếng reo hò vang dậy cả khúc sông tiếp thêm sức mạnh cho các đội đua.",
        ],
        conclusion: "Hội tan nhưng dư âm rộn rã vẫn đọng lại, niềm tự hào về nét đẹp văn hóa quê hương.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["nườm nượp", "rộn rã", "giục giã", "khỏe khoắn", "náo nhiệt", "tưng bừng"],
        comparisons: ["Những con thuyền lướt đi vun vút như những mũi tên xé toang làn nước bạc."],
        personifications: ["Dòng sông quê hương như bừng tỉnh, reo vui cùng bước chân trẩy hội."],
      },
      step5Checklist: [
        "Kể phân biệt rõ phần lễ và phần hội?",
        "Tả được cả quang cảnh chung lẫn chi tiết tiêu biểu?",
        "Chính tả hoàn hảo?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "'Trống hội rộn ràng thúc giục xuân / Cờ hoa phấp phới đón người thân' - Cứ mỗi độ xuân về, dòng sông Đáy quê em lại tưng bừng mở hội đua thuyền truyền thống náo nức cả một vùng quê.",
    },
    suggestedRubricSummary: [
      "Tái hiện không khí lễ hội sống động, chân thực",
      "Trình tự thuật việc mạch lạc",
      "Ngôn từ giàu cảm xúc và bản sắc văn hóa",
    ],
  },

  // =========================================================================
  // NGUỒN 3: ĐỀ DO GIÁO VIÊN TẠO (TEACHER CREATED PROMPTS)
  // =========================================================================
  {
    id: "kd-gv-01",
    source: "teacher",
    sourceLabel: "Cô Lê Thị Thu Hương biên soạn cho Lớp 4A1",
    bookVolume: "tap1",
    genre: "mieu-ta-cay-coi",
    genreLabel: "Văn miêu tả cây cối",
    level: "bai",
    title: "Tả cây phượng vĩ nơi góc sân trường em vào mùa hoa nở",
    prompt: "Em hãy quan sát và viết bài văn miêu tả cây phượng vĩ trên sân trường Chu Văn An vào một buổi sáng mùa hè khi từng chùm hoa đỏ rực bắt đầu bung nở báo hiệu mùa thi.",
    topic: "Cây cối sân trường",
    targetWords: 200,
    lessonReference: "Bài tập rèn luyện trọng tâm tháng 10 - Lớp 4A1",
    createdBy: "tea-001",
    createdByName: "Cô Lê Thị Thu Hương",
    isFeatured: true,
    usageCount: 94,
    createdAt: "08/10/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Cây phượng nằm ở vị trí nào của trường ta? Hoa nở vào thời điểm nào và gợi cảm xúc gì đối với tuổi học trò?",
        targetGenre: "Văn miêu tả cây cối",
        keyElements: [
          "Mở bài gián tiếp: Tiếng ve kêu báo hiệu hè về, dẫn đến cây phượng",
          "Thân bài: Tả gốc, thân cây xù xì, tán lá xòe như đuôi chim phượng, chùm hoa đỏ rực như muôn ngàn đốm lửa",
          "Kết bài mở rộng: Kỉ niệm nhặt cánh hoa ép vào trang vở bướm",
        ],
      },
      step2Observation: {
        senses: {
          sight: "Thân cây hai vòng tay ôm không xuể, chùm hoa đỏ rực như đốm lửa bập bùng giữa nền trời biếc",
          sound: "Tiếng ve sầu râm ran trong vòm lá xanh",
          touch: "Cánh hoa phượng mỏng manh, mịn màng như nhung",
          emotion: "Bồi hồi, lưu luyến khi mùa hè đến",
        },
        guidingQuestions: [
          "Rễ cây phượng bò trên mặt đất giống như những con vật gì?",
          "Cánh hoa phượng rơi lả tả xuống sân trường tạo thành cảnh tượng ra sao?",
        ],
      },
      step3Outline: {
        introduction: "Giới thiệu bác phượng già đứng sừng sững bên cạnh cột cờ thân yêu.",
        body: [
          "Tả bao quát: Nhìn từ xa như một chiếc ô hoa đỏ khổng lồ che rợp một góc sân.",
          "Tả chi tiết: Vỏ cây màu nâu xám, nứt nẻ in dấu thời gian. Rễ cây trồi lên uốn lượn như đàn trăn hiền lành. Tán lá xanh non mịn màng.",
          "Mùa hoa nở: Từng chùm hoa bung nở đỏ rực. Cánh hoa mỏng manh mịn màng rơi xuống tạo tấm thảm đỏ rực rỡ.",
        ],
        conclusion: "Dù mai này lớn khôn xa trường, hình bóng cây phượng vĩ vẫn in sâu trong tâm trí em.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["sừng sững", "nứt nẻ", "đỏ rực", "lả tả", "râm ran", "mịn màng"],
        comparisons: [
          "Cây phượng như một chiếc ô hoa khổng lồ che mát cả góc sân.",
          "Từng chùm hoa đỏ rực như muôn ngàn đốm lửa bập bùng giữa nền trời biếc.",
        ],
        personifications: [
          "Bác phượng già đứng trang nghiêm như người bảo vệ thầm lặng của trường ta.",
        ],
      },
      step5Checklist: [
        "Có dùng biện pháp nhân hóa gọi 'bác phượng già'?",
        "Tả kết hợp âm thanh tiếng ve sầu?",
        "Không sai chính tả l/n?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Mỗi ngày cắp sách tới trường Chu Văn An, hình ảnh đầu tiên đón chào em chính là bác phượng già đứng sừng sững bên cạnh cột cờ, dang rộng vòng tay che chở cho tuổi thơ chúng em.",
    },
    suggestedRubricSummary: [
      "Bám sát hình ảnh thực tế cây phượng sân trường",
      "Vận dụng sáng tạo nhân hóa và so sánh",
      "Cảm xúc trong sáng, đẹp đẽ",
    ],
  },
  {
    id: "kd-gv-02",
    source: "teacher",
    sourceLabel: "Thầy Nguyễn Đăng Khoa biên soạn cho Lớp 4A2",
    bookVolume: "tap1",
    genre: "doan-van-neu-y-kien",
    genreLabel: "Đoạn văn nêu ý kiến",
    level: "doan",
    title: "Nêu cảm nghĩ về tấm gương hiếu thảo trong câu chuyện 'Bông hoa cúc trắng'",
    prompt: "Em hãy viết đoạn văn (từ 5 đến 7 câu) nêu cảm nghĩ về tấm lòng hiếu thảo của cô bé trong câu chuyện 'Sự tích hoa cúc trắng' khi vượt mọi khó khăn để chữa bệnh cho mẹ.",
    topic: "Lòng hiếu thảo",
    targetWords: 90,
    lessonReference: "Chủ điểm Gia đình yêu thương - Lớp 4A2",
    createdBy: "tea-002",
    createdByName: "Thầy Nguyễn Đăng Khoa",
    isFeatured: false,
    usageCount: 52,
    createdAt: "10/10/2026",
    stepByStepGuide: {
      step1Understanding: {
        questionPrompt: "Cô bé đã làm gì khi biết mẹ bị bệnh nặng? Chi tiết xé từng cánh hoa cúc nói lên điều gì?",
        targetGenre: "Đoạn văn nêu cảm nghĩ về nhân vật",
        keyElements: ["Nêu tên câu chuyện và nhân vật cô bé", "Phân tích hành động xé cánh hoa cúc để mẹ sống thêm nhiều năm", "Bài học về chữ hiếu"],
      },
      step2Observation: {
        senses: {
          emotion: "Xúc động trước tình cảm thiêng liêng, lòng kính yêu cha mẹ",
        },
        guidingQuestions: [
          "Nếu là cô bé trong câu chuyện, em có sẵn sàng chịu rét mướt đi tìm hoa quý chữa bệnh cho mẹ không?",
        ],
      },
      step3Outline: {
        introduction: "Giới thiệu nhân vật cô bé trong 'Sự tích hoa cúc trắng' là tấm gương sáng về lòng hiếu thảo.",
        body: [
          "Em vô cùng xúc động trước hình ảnh cô bé không quản gió rét đi tìm bông hoa quý.",
          "Chi tiết cô bé tỉ mẩn xé từng cánh hoa thành nhiều sợi nhỏ để kéo dài tuổi thọ cho mẹ làm em rơi nước mắt vì cảm phục.",
        ],
        conclusion: "Câu chuyện nhắc nhở em phải luôn yêu thương, vâng lời và chăm sóc cha mẹ khi còn có thể.",
      },
      step4VocabularyAndFigurative: {
        vividWords: ["hiếu thảo", "tỉ mẩn", "xúc động", "thiêng liêng", "ấm áp"],
        comparisons: ["Tấm lòng của cô bé trong sáng và thơm ngát như chính đóa cúc trắng ngần."],
        personifications: [],
      },
      step5Checklist: [
        "Đoạn văn mạch lạc, nêu đúng trọng tâm?",
        "Rút ra bài học sâu sắc?",
        "Chính tả chuẩn?",
      ],
    },
    sampleExcerpts: {
      goodIntroExample: "Trong kho tàng truyện cổ tích Việt Nam, hình tượng cô bé trong câu chuyện 'Sự tích hoa cúc trắng' luôn làm em nghẹn ngào xúc động bởi tấm lòng hiếu thảo vô bờ bến.",
    },
    suggestedRubricSummary: [
      "Bộc lộ cảm xúc sâu sắc về nhân vật",
      "Lập luận rõ ràng, giàu tính thuyết phục",
    ],
  },
];

// ============================================================================
// TOÀN BỘ KHO ĐỀ VĂN LỚP 4: 62 BÀI SGK CHÍNH THỐNG + 23 ĐỀ LUYỆN TẬP CHUYÊN SÂU
// ============================================================================
export const defaultPromptsData: EssayPrompt[] = [
  ...officialKnttPrompts,
  ...curatedPromptsData,
];
