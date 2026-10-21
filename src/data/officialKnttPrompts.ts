import { EssayPrompt } from "../types";

// ============================================================================
// BỘ DỮ LIỆU CHUẨN 62 BÀI / TIẾT TẬP LÀM VĂN LỚP 4 - GDPT 2018
// THEO BẢNG DỮ LIỆU CHƯƠNG TRÌNH SGK KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
// ĐẦY ĐỦ 34 TUẦN HỌC (TẬP MỘT: 32 BÀI, TẬP HAI: 30 BÀI)
// ============================================================================

export const officialKnttPrompts: EssayPrompt[] = [
  {
    "id": "kntt-hk1-t01-b01",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 1, Bài 1, tr. 10 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 1,
    "lessonNumber": 1,
    "sgkPage": 10,
    "stage": "Tìm hiểu nền tảng",
    "learningObjectives": "Nhận biết đoạn văn, câu chủ đề và mối liên hệ giữa các câu.",
    "title": "Tìm hiểu đoạn văn và câu chủ đề",
    "prompt": "Đọc đoạn văn mẫu trong SGK trang 10, xác định câu chủ đề nêu ý chính của đoạn và các câu triển khai làm rõ ý. Thực hành viết thử một đoạn văn ngắn (3 - 5 câu) có câu chủ đề đứng ở đầu đoạn.",
    "genre": "doan-van-neu-y-kien",
    "genreLabel": "Đoạn văn & Câu chủ đề",
    "level": "cau",
    "topic": "Kĩ năng đoạn văn",
    "targetWords": 60,
    "lessonReference": "Tuần 1 - Bài 1 (trang 10, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 68,
    "createdAt": "01/09/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đoạn văn gồm những câu nào? Câu nào nêu lên ý chính thâu tóm toàn đoạn?",
        "targetGenre": "Đoạn văn có câu chủ đề",
        "keyElements": [
          "Đọc đoạn mẫu; xác định câu nêu ý chính và các câu làm rõ ý",
          "Gạch chân câu chủ đề; ghi nội dung chính của đoạn",
          "Sắp xếp câu chủ đề và các câu triển khai theo quan hệ ý nghĩa"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Hình thức đoạn văn: lùi vào đầu dòng, viết hoa chữ cái đầu câu, kết thúc bằng dấu chấm xuống dòng",
          "emotion": "Hứng thú khám phá quy luật liên kết câu trong tiếng Việt"
        },
        "guidingQuestions": [
          "Câu chủ đề thường đứng ở vị trí nào trong đoạn văn?",
          "Các câu sau có nhiệm vụ gì đối với câu chủ đề?"
        ]
      },
      "step3Outline": {
        "introduction": "Câu mở đầu (Câu chủ đề): Giới thiệu khái quát nội dung chính của đoạn văn.",
        "body": [
          "Câu 2: Triển khai chi tiết khía cạnh thứ nhất làm rõ ý.",
          "Câu 3: Bổ sung dẫn chứng hoặc chi tiết cụ thể thứ hai."
        ],
        "conclusion": "Câu kết đoạn (nếu có): Khẳng định lại ý nghĩa hoặc cảm xúc tổng kết."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "gắn bó",
          "rực rỡ",
          "thân thuộc",
          "chăm chỉ",
          "mạch lạc"
        ],
        "comparisons": [
          "Mỗi câu văn như một mắt xích gắn kết chặt chẽ với nhau."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Kiểm tra đoạn văn có tập trung vào một ý duy nhất không?",
        "Các câu triển khai có liên kết chặt chẽ với câu chủ đề không?",
        "Xác định đúng câu chủ đề ở vị trí mở đầu?",
        "Trình tự các câu hợp lí, không lủng củng?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Mùa thu là mùa đẹp nhất trong năm ở quê hương em.",
      "goodBodyExcerpt": "Bầu trời mùa thu trong xanh và cao vời vợi, không một gợn mây. Nắng thu vàng dịu như rót mật lên từng vòm cây, góc phố.",
      "goodConclusionExample": "Khung cảnh thanh bình ấy luôn khiến lòng em dâng lên niềm xao xuyến khó tả."
    },
    "suggestedRubricSummary": [
      "Xác định đúng câu chủ đề nêu ý chính",
      "Các câu triển khai cùng làm rõ một ý",
      "Trình tự sắp xếp các câu hợp lí, mạch lạc"
    ]
  },
  {
    "id": "kntt-hk1-t01-b02",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 1, Bài 2, tr. 14 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 1,
    "lessonNumber": 2,
    "sgkPage": 14,
    "stage": "Tìm hiểu kiểu bài",
    "learningObjectives": "Hiểu cấu trúc đoạn văn nêu ý kiến và vai trò của lí do, dẫn chứng.",
    "title": "Tìm hiểu cách viết đoạn văn nêu ý kiến",
    "prompt": "Phân tích bài mẫu trong SGK trang 14 để nắm rõ 3 phần của đoạn văn nêu ý kiến (Mở đầu - Triển khai - Kết thúc). Nêu ý kiến của em về một nhân vật hoặc câu chuyện em yêu thích kèm theo các lí do thuyết phục.",
    "genre": "doan-van-neu-y-kien",
    "genreLabel": "Đoạn văn nêu ý kiến",
    "level": "doan",
    "topic": "Ý kiến & Cảm nghĩ",
    "targetWords": 80,
    "lessonReference": "Tuần 1 - Bài 2 (trang 14, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 85,
    "createdAt": "03/09/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đoạn văn nêu ý kiến gồm những phần nào? Làm thế nào để người đọc đồng tình với ý kiến của em?",
        "targetGenre": "Đoạn văn nêu ý kiến (bày tỏ quan điểm)",
        "keyElements": [
          "Phân tích bài mẫu; xác định mở đầu, triển khai, kết thúc",
          "Xác định ý kiến chung, lí do yêu thích và chi tiết minh họa",
          "Lập khung: giới thiệu câu chuyện/ý kiến → lí do → kết lại ý kiến"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Cảm phục đức tính tốt đẹp của nhân vật hoặc sự hấp dẫn của câu chuyện"
        },
        "guidingQuestions": [
          "Vì sao em lại yêu thích nhân vật hoặc câu chuyện đó?",
          "Chi tiết nào trong câu chuyện khiến em xúc động hoặc ấn tượng nhất?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở đầu: Giới thiệu câu chuyện/nhân vật và nêu ý kiến khái quát của em.",
        "body": [
          "Lí do 1: Nhân vật có phẩm chất tốt đẹp (dũng cảm, hiếu thảo, tốt bụng).",
          "Lí do 2: Chi tiết minh họa cụ thể cho phẩm chất đó."
        ],
        "conclusion": "Kết thúc: Khẳng định lại ý kiến và nêu bài học hoặc tình cảm của em."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "thuyết phục",
          "xúc động",
          "ấn tượng",
          "sâu sắc",
          "ngưỡng mộ"
        ],
        "comparisons": [
          "Tấm lòng của nhân vật sáng ngời như một viên ngọc quý."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Ý kiến nêu ra có rõ ràng, dứt khoát không?",
        "Lí do đưa ra có phù hợp và có dẫn chứng chi tiết hỗ trợ không?",
        "Đúng bố cục 3 phần của đoạn văn nêu ý kiến?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Trong những câu chuyện đã học, em thích nhất là nhân vật Dế Mèn trong truyện 'Dế Mèn phiêu lưu ký'.",
      "goodBodyExcerpt": "Trước hết, Dế Mèn là một chú dế có vẻ ngoài cường tráng, khỏe mạnh với đôi càng mẫm bóng. Điều khiến em yêu quý nhất là sau bài học đường đời đầu tiên, chú đã biết ăn năn hối lỗi và quyết tâm bênh vực kẻ yếu.",
      "goodConclusionExample": "Tấm lòng trượng nghĩa của Dế Mèn đã để lại trong em bài học sâu sắc về tình bạn và lòng nhân ái."
    },
    "suggestedRubricSummary": [
      "Đúng kiểu bài nêu ý kiến",
      "Ý kiến rõ ràng, khẳng định dứt khoát",
      "Lí do phù hợp kèm dẫn chứng cụ thể",
      "Bố cục 3 phần nhận diện đúng"
    ]
  },
  {
    "id": "kntt-hk1-t02-b03",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 2, Bài 3, tr. 19 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 2,
    "lessonNumber": 3,
    "sgkPage": 19,
    "stage": "Tìm ý",
    "learningObjectives": "Chọn ý kiến và tìm lí do, chi tiết hỗ trợ cho ý kiến.",
    "title": "Tìm ý cho đoạn văn nêu ý kiến",
    "prompt": "Thực hành chọn một câu chuyện hoặc bài thơ em thích trong SGK, ghi lại ý kiến chung, tìm 2 - 3 lí do giải thích vì sao em thích và chọn lọc các chi tiết cụ thể minh họa cho từng lí do.",
    "genre": "doan-van-neu-y-kien",
    "genreLabel": "Đoạn văn nêu ý kiến",
    "level": "doan",
    "topic": "Ý kiến & Lí lẽ",
    "targetWords": 75,
    "lessonReference": "Tuần 2 - Bài 3 (trang 19, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 45,
    "createdAt": "08/09/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đề bài yêu cầu tìm ý về câu chuyện nào? Phân biệt giữa ý kiến cá nhân và lí do giải thích.",
        "targetGenre": "Kĩ năng tìm ý cho đoạn văn nêu ý kiến",
        "keyElements": [
          "Đọc lại yêu cầu đề; phân biệt ý kiến, lí do và chi tiết minh họa",
          "Chọn câu chuyện; ghi lí do yêu thích và chi tiết cụ thể",
          "Xếp ý theo trình tự: nêu ý kiến → lí do/chi tiết → khẳng định"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Hào hứng chia sẻ góc nhìn và cảm nhận riêng của bản thân"
        },
        "guidingQuestions": [
          "Câu chuyện đó có tên là gì, của tác giả nào?",
          "Em ấn tượng nhất với nhân vật nào hoặc hành động nào?",
          "Có chi tiết hay hình ảnh nào làm em nhớ mãi?"
        ]
      },
      "step3Outline": {
        "introduction": "Ý kiến chung: Em rất yêu thích câu chuyện...",
        "body": [
          "Lí do 1 + Chi tiết: Nội dung truyện hấp dẫn, li kì.",
          "Lí do 2 + Chi tiết: Nhân vật có hành động dũng cảm, đáng khâm phục."
        ],
        "conclusion": "Khẳng định: Câu chuyện mang lại cho em nhiều cảm xúc và bài học hay."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "hấp dẫn",
          "li kì",
          "ý nghĩa",
          "khâm phục",
          "cảm động"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Ý kiến phù hợp với đề bài?",
        "Có ít nhất 2 lí do rõ ràng kèm chi tiết minh họa?",
        "Loại bỏ các ý trùng lặp hoặc không liên quan?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Phiếu tìm ý: Tên truyện 'Sự tích hoa cúc trắng' - Ý kiến: Câu chuyện cảm động nhất về tình mẫu tử."
    },
    "suggestedRubricSummary": [
      "Ý kiến phù hợp với yêu cầu đề",
      "Lí do thuyết phục, có chi tiết minh họa",
      "Ý được sắp xếp logic theo trình tự"
    ]
  },
  {
    "id": "kntt-hk1-t02-b04",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 2, Bài 4, tr. 21 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 2,
    "lessonNumber": 4,
    "sgkPage": 21,
    "stage": "Viết bài",
    "learningObjectives": "Viết đoạn văn nêu ý kiến có lí do và chi tiết hỗ trợ.",
    "title": "Viết đoạn văn nêu ý kiến",
    "prompt": "Dựa vào phiếu tìm ý đã hoàn thành ở Bài 3, hãy viết đoạn văn (từ 5 đến 7 câu) nêu ý kiến của em về một câu chuyện hoặc bài thơ em yêu thích, có lí do rõ ràng và chi tiết hỗ trợ.",
    "genre": "doan-van-neu-y-kien",
    "genreLabel": "Đoạn văn nêu ý kiến",
    "level": "doan",
    "topic": "Ý kiến & Cảm nghĩ",
    "targetWords": 90,
    "lessonReference": "Tuần 2 - Bài 4 (trang 21, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 92,
    "createdAt": "10/09/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Viết đoạn văn theo cấu trúc mở đầu - triển khai - kết thúc bằng lời văn của chính em.",
        "targetGenre": "Đoạn văn nêu ý kiến hoàn chỉnh",
        "keyElements": [
          "Nhắc lại yêu cầu và cấu trúc kiểu bài",
          "Dùng phiếu tìm ý đã hoàn thành làm sườn viết",
          "Theo khung mở đầu – triển khai – kết thúc"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Tự hào khi diễn đạt trọn vẹn suy nghĩ chân thực của mình"
        },
        "guidingQuestions": [
          "Câu mở đoạn đã nêu được tên tác phẩm và ý kiến khái quát chưa?",
          "Từ nối giữa các câu đã giúp đoạn văn liền mạch chưa (Trước hết, Bên cạnh đó, Đặc biệt...)?"
        ]
      },
      "step3Outline": {
        "introduction": "Câu 1: Giới thiệu tác phẩm và nêu ý kiến yêu thích.",
        "body": [
          "Câu 2 - 3: Nêu lí do thứ nhất kèm chi tiết dẫn chứng cụ thể.",
          "Câu 4 - 5: Nêu lí do thứ hai kèm cảm nhận sâu sắc."
        ],
        "conclusion": "Câu 6 - 7: Khẳng định lại tình cảm và bài học rút ra."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "đặc sắc",
          "thắm đượm",
          "bồi hồi",
          "khắc ghi",
          "xúc động"
        ],
        "comparisons": [
          "Câu chuyện như một ngọn lửa sưởi ấm tâm hồn em."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng dung lượng từ 5 - 7 câu?",
        "Ý kiến nêu rõ ràng, lí do hợp lí?",
        "Các câu liên kết chặt chẽ, không sai lỗi chính tả?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Trong những bài thơ đã đọc, em yêu thích nhất là bài thơ 'Mẹ' của nhà thơ Trần Quốc Minh.",
      "goodBodyExcerpt": "Trước hết, bài thơ đã gợi lên tình yêu thương bao la của người mẹ qua hình ảnh cánh võng chao nghiêng và tiếng hát ru êm đềm giữa đêm hè oi ả. Từng câu thơ giản dị nhưng thấm đẫm đức hi sinh thầm lặng của mẹ dành cho con.",
      "goodConclusionExample": "Bài thơ đã nhắc nhở em phải luôn ngoan ngoãn, chăm chỉ học hành để đền đáp công ơn sinh thành của mẹ."
    },
    "suggestedRubricSummary": [
      "Đúng yêu cầu kiểu bài đoạn văn nêu ý kiến",
      "Ý kiến rõ ràng, lí do hợp lí",
      "Các câu liên kết tự nhiên, có từ nối",
      "Đúng chính tả và dấu câu"
    ]
  },
  {
    "id": "kntt-hk1-t03-b05",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 3, Bài 5, tr. 25 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 3,
    "lessonNumber": 5,
    "sgkPage": 25,
    "stage": "Trả bài / chỉnh sửa",
    "learningObjectives": "Biết đọc nhận xét, xác định điểm mạnh và chỉnh sửa bài viết.",
    "title": "Trả bài viết đoạn văn nêu ý kiến",
    "prompt": "Đọc kĩ lời nhận xét của thầy cô hoặc gợi mở của AI, đối chiếu với tiêu chí bài viết để nhận ra điểm mạnh, tìm 1 - 2 chỗ cần cải thiện (về dùng từ, liên kết câu, lí do) và tự tay viết lại đoạn văn hay hơn.",
    "genre": "doan-van-neu-y-kien",
    "genreLabel": "Đoạn văn nêu ý kiến",
    "level": "doan",
    "topic": "Tự hoàn thiện bài viết",
    "targetWords": 85,
    "lessonReference": "Tuần 3 - Bài 5 (trang 25, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 39,
    "createdAt": "15/09/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Thầy cô khen điểm nào trong bài của em? Điểm nào cần bổ sung lí lẽ hoặc chi tiết?",
        "targetGenre": "Kĩ năng tự sửa và hoàn thiện bài văn",
        "keyElements": [
          "Đối chiếu bài với yêu cầu và nhận xét của giáo viên",
          "Chọn 1–2 điểm cần cải thiện trong ý kiến, lí do hoặc chi tiết",
          "Lập kế hoạch sửa theo thứ tự ưu tiên; viết lại câu/đoạn cần sửa"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Tự tin và cầu tiến khi học cách tự hoàn thiện tác phẩm của mình"
        },
        "guidingQuestions": [
          "Có câu nào bị lặp từ hoặc chưa rõ ý không?",
          "Lí do đưa ra đã đủ chi tiết chứng minh chưa?"
        ]
      },
      "step3Outline": {
        "introduction": "Xem xét câu mở đoạn: Đã nêu bật được ý kiến chưa?",
        "body": [
          "Sửa câu triển khai: Thêm từ nối và chi tiết dẫn chứng sinh động.",
          "Thay thế các từ ngữ chung chung bằng từ gợi cảm, giàu hình ảnh."
        ],
        "conclusion": "So sánh bản trước và sau khi chỉnh sửa."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "trau chuốt",
          "mạch lạc",
          "sáng tạo",
          "rõ nét",
          "thuyết phục"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Biết tự nhận xét điểm mạnh và điểm yếu?",
        "Sửa đúng trọng tâm góp ý?",
        "Bản sửa sau rõ ràng, mạch lạc và thuyết phục hơn?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Bản sửa: Em đã thay thế câu 'Em thích bài thơ' thành 'Bài thơ 'Mẹ' của nhà thơ Trần Quốc Minh đã chạm đến trái tim em bởi những vần thơ dạt dào tình mẫu tử.'"
    },
    "suggestedRubricSummary": [
      "Biết tự nhận xét và tiếp thu phản hồi",
      "Sửa đúng trọng tâm vấn đề cần cải thiện",
      "Bản viết sau rõ và mạch lạc hơn hẳn bản đầu"
    ]
  },
  {
    "id": "kntt-hk1-t03-b06",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 3, Bài 6, tr. 28 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 3,
    "lessonNumber": 6,
    "sgkPage": 28,
    "stage": "Tìm hiểu kiểu văn bản",
    "learningObjectives": "Nhận biết mục đích, bố cục và các thành phần của báo cáo thảo luận nhóm.",
    "title": "Tìm hiểu cách viết báo cáo thảo luận nhóm",
    "prompt": "Đọc văn bản báo cáo thảo luận nhóm mẫu trong SGK trang 28, nhận biết mục đích lập báo cáo, xác định 3 phần (Phần đầu, Phần chính, Phần cuối) và các thông tin quan trọng cần ghi nhận.",
    "genre": "viet-don",
    "genreLabel": "Báo cáo thảo luận nhóm",
    "level": "doan",
    "topic": "Văn bản hành chính thực hành",
    "targetWords": 100,
    "lessonReference": "Tuần 3 - Bài 6 (trang 28, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 41,
    "createdAt": "18/09/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Báo cáo thảo luận nhóm được viết ra để làm gì? Gồm có những mục nào?",
        "targetGenre": "Văn bản báo cáo thảo luận nhóm",
        "keyElements": [
          "Quan sát mẫu; xác định phần đầu, phần chính và phần cuối",
          "Thu thập chủ đề thảo luận, người tham gia, ý kiến và kết quả thống nhất",
          "Tạo khung báo cáo theo các mục trong mẫu SGK"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Bố cục chia rõ ràng thành tiêu đề, thông tin buổi họp, các ý kiến thảo luận và kết luận",
          "emotion": "Ý thức tinh thần trách nhiệm và làm việc nhóm hiệu quả"
        },
        "guidingQuestions": [
          "Ai là người chủ trì buổi thảo luận và ai là thư kí ghi biên bản?",
          "Kết quả thống nhất của cả nhóm gồm những điểm nào?"
        ]
      },
      "step3Outline": {
        "introduction": "Phần đầu: Tiêu đề báo cáo, thời gian, địa điểm, thành phần tham dự.",
        "body": [
          "Mục 1: Chủ đề và mục tiêu thảo luận.",
          "Mục 2: Tóm tắt ý kiến đóng góp của từng thành viên trong nhóm.",
          "Mục 3: Kết luận và phân công công việc đã thống nhất."
        ],
        "conclusion": "Phần cuối: Chữ kí và họ tên của người viết báo cáo (thư kí hoặc nhóm trưởng)."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "thống nhất",
          "phân công",
          "chủ trì",
          "thư kí",
          "nghiêm túc"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng cấu trúc văn bản báo cáo?",
        "Thông tin đầy đủ, rõ ràng?",
        "Kết quả phản ánh trung thực nội dung thảo luận?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "BÁO CÁO THẢO LUẬN NHÓM 1 VỀ KẾ HOẠCH LÀM BÁO TƯỜNG CHÀO MỪNG NGÀY 20-11"
    },
    "suggestedRubricSummary": [
      "Đúng cấu trúc 3 phần của báo cáo thảo luận nhóm",
      "Thông tin rõ ràng, chính xác",
      "Kết quả phản ánh trung thực buổi thảo luận"
    ]
  },
  {
    "id": "kntt-hk1-t04-b07",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 4, Bài 7, tr. 33 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 4,
    "lessonNumber": 7,
    "sgkPage": 33,
    "stage": "Lập dàn ý",
    "learningObjectives": "Biết lựa chọn và sắp xếp thông tin để chuẩn bị báo cáo.",
    "title": "Lập dàn ý cho báo cáo thảo luận nhóm",
    "prompt": "Thực hành lập dàn ý cho bản báo cáo về một buổi thảo luận của nhóm em (về kế hoạch trực nhật, chuẩn bị văn nghệ hoặc trang trí lớp học). Sắp xếp các mục theo đúng trình tự quy chuẩn.",
    "genre": "viet-don",
    "genreLabel": "Báo cáo thảo luận nhóm",
    "level": "doan",
    "topic": "Lập dàn ý báo cáo",
    "targetWords": 90,
    "lessonReference": "Tuần 4 - Bài 7 (trang 33, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 38,
    "createdAt": "22/09/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Dàn ý báo cáo cần ghi chép những thông tin cơ bản nào để khi viết không bị thiếu sót?",
        "targetGenre": "Dàn ý báo cáo thảo luận",
        "keyElements": [
          "Ôn cấu trúc báo cáo đã học",
          "Ghi chủ đề, thời gian/địa điểm, người nhận, ý kiến và kết quả",
          "Phân nhóm thông tin theo từng phần của báo cáo; hoàn thành dàn ý"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Nghiêm túc, cẩn thận khi tổng hợp ý kiến tập thể"
        },
        "guidingQuestions": [
          "Nhóm em đã thảo luận về vấn đề gì?",
          "Các bạn đã đưa ra những ý kiến cụ thể nào?"
        ]
      },
      "step3Outline": {
        "introduction": "1. Tiêu đề + Thời gian, địa điểm, thành phần (Nhóm trưởng, thư kí, các thành viên).",
        "body": [
          "2. Nội dung thảo luận: Đề xuất các ý tưởng.",
          "3. Kết quả thống nhất: Lựa chọn phương án tối ưu và bảng phân công việc."
        ],
        "conclusion": "4. Kí tên người làm báo cáo."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "chu đáo",
          "đồng thuận",
          "nhiệm vụ",
          "cụ thể",
          "trách nhiệm"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Dàn ý đủ các mục theo quy chuẩn?",
        "Thông tin có căn cứ, không bịa đặt?",
        "Kết quả phân công công việc rõ ràng cho từng bạn?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Dàn ý: Thảo luận chuẩn bị tiết mục văn nghệ chào mừng Ngày Nhà giáo Việt Nam 20/11."
    },
    "suggestedRubricSummary": [
      "Dàn ý đầy đủ các mục theo quy định",
      "Thông tin có căn cứ, rõ ràng",
      "Kết quả phân công nhiệm vụ cụ thể"
    ]
  },
  {
    "id": "kntt-hk1-t04-b08",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 4, Bài 8, tr. 36 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 4,
    "lessonNumber": 8,
    "sgkPage": 36,
    "stage": "Viết văn bản thực hành",
    "learningObjectives": "Viết được báo cáo theo dàn ý và đúng mục đích giao tiếp.",
    "title": "Viết báo cáo thảo luận nhóm",
    "prompt": "Dựa vào dàn ý đã lập ở Bài 7, hãy viết bản báo cáo thảo luận nhóm hoàn chỉnh gửi cô giáo chủ nhiệm về kế hoạch hoạt động của nhóm em, đảm bảo đúng thể thức và nội dung trung thực.",
    "genre": "viet-don",
    "genreLabel": "Báo cáo thảo luận nhóm",
    "level": "doan",
    "topic": "Thực hành viết báo cáo",
    "targetWords": 120,
    "lessonReference": "Tuần 4 - Bài 8 (trang 36, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 74,
    "createdAt": "25/09/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Viết báo cáo hoàn chỉnh dựa trên dàn ý và kết quả thảo luận có thật của nhóm em.",
        "targetGenre": "Văn bản báo cáo thảo luận hoàn chỉnh",
        "keyElements": [
          "Nhắc lại bố cục và yêu cầu trình bày báo cáo",
          "Sử dụng kết quả thảo luận đã ghi chép",
          "Theo thứ tự các phần trong mẫu báo cáo; viết hoàn chỉnh"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Trình bày trang báo cáo sạch đẹp, căn lề thẳng hàng, chữ viết rõ ràng",
          "emotion": "Tự hào khi đại diện cho nhóm gửi báo cáo lên cô giáo"
        },
        "guidingQuestions": [
          "Báo cáo gửi cho ai (Cô giáo chủ nhiệm lớp 4A...)?",
          "Các mục tên người, nhiệm vụ đã viết hoa và ghi chính xác chưa?"
        ]
      },
      "step3Outline": {
        "introduction": "BÁO CÁO THẢO LUẬN NHÓM - Kính gửi: Cô giáo chủ nhiệm Lớp 4A...",
        "body": [
          "1. Thời gian, địa điểm, thành phần tham gia.",
          "2. Nội dung thảo luận: Ý kiến của bạn An, bạn Bình, bạn Chi...",
          "3. Kết luận: Cả nhóm nhất trí chọn tiết mục múa quạt 'Bụi phấn'. Phân công bạn phụ trách đạo cụ, bạn phụ trách trang phục."
        ],
        "conclusion": "Người làm báo cáo: Thư kí kí và ghi rõ họ tên."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "kính gửi",
          "trân trọng",
          "nhất trí",
          "hoàn thành",
          "nghiêm túc"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng thể thức văn bản báo cáo?",
        "Nội dung trung thực, phản ánh đúng kết quả?",
        "Trình bày rõ ràng, không sai lỗi chính tả?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nBÁO CÁO KẾT QUẢ THẢO LUẬN NHÓM 2"
    },
    "suggestedRubricSummary": [
      "Đúng thể thức văn bản báo cáo",
      "Nội dung trung thực, đầy đủ thông tin",
      "Trình bày khoa học, sạch đẹp, ít lỗi"
    ]
  },
  {
    "id": "kntt-hk1-t05-b09",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 5, Bài 9, tr. 42 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 5,
    "lessonNumber": 9,
    "sgkPage": 42,
    "stage": "Tìm hiểu kiểu bài",
    "learningObjectives": "Nhận biết yêu cầu thuật lại một sự việc theo trình tự rõ ràng.",
    "title": "Tìm hiểu cách viết bài văn thuật lại một sự việc",
    "prompt": "Đọc bài văn mẫu trong SGK trang 42 thuật lại một sự việc. Nhận diện 3 phần (Mở bài - Thân bài - Kết bài), phân tích thời gian, địa điểm, những người tham gia và trình tự các hành động diễn ra.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Thuật lại sự việc",
    "level": "bai",
    "topic": "Thuật lại sự việc",
    "targetWords": 180,
    "lessonReference": "Tuần 5 - Bài 9 (trang 42, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 88,
    "createdAt": "01/10/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Bài văn thuật lại sự việc gì? Sự việc diễn ra theo trình tự thời gian hay trình tự nào?",
        "targetGenre": "Bài văn thuật lại một sự việc",
        "keyElements": [
          "Phân tích bài mẫu; xác định sự việc và cách trình bày diễn biến",
          "Xác định thời gian, địa điểm, người tham gia và các diễn biến chính",
          "Lập sơ đồ mở bài – diễn biến – kết thúc sự việc"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Hình ảnh các hoạt động diễn ra sôi nổi, tuần tự trước - sau",
          "sound": "Âm thanh tiếng reo hò, tiếng bước chân, tiếng nói cười",
          "emotion": "Hồi hộp theo dõi từng diễn biến, xúc động hoặc vui sướng khi kết thúc"
        },
        "guidingQuestions": [
          "Sự việc bắt đầu như thế nào?",
          "Đỉnh điểm của sự việc là khoảnh khắc nào?",
          "Kết quả sự việc đem lại điều gì?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài: Giới thiệu sự việc (tên, thời gian, địa điểm, ý nghĩa).",
        "body": [
          "Bắt đầu: Khâu chuẩn bị, không khí trước khi sự việc diễn ra.",
          "Diễn biến chính: Kể lần lượt các hành động, hoạt động tiêu biểu.",
          "Kết thúc sự việc: Kết quả đạt được và niềm vui của mọi người."
        ],
        "conclusion": "Kết bài: Nêu cảm nghĩ, bài học hoặc kỉ niệm sâu sắc của bản thân."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "náo nức",
          "sôi nổi",
          "hồi hộp",
          "rộn rã",
          "vỡ òa"
        ],
        "comparisons": [
          "Tiếng reo hò rộn rã như sấm dậy."
        ],
        "personifications": [
          "Ánh nắng sớm nhảy nhót theo từng bước chân của các vận động viên nhí."
        ]
      },
      "step5Checklist": [
        "Xác định đúng sự việc và kiểu bài?",
        "Nhận ra đúng trình tự diễn biến trước - sau?",
        "Kiểm tra sự việc có được thuật lại rõ ràng, mạch lạc không?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Sáng thứ Hai đầu tuần, trường em tổ chức Lễ Khai mạc Hội khỏe Phù Đổng trong không khí vô cùng tưng bừng, náo nhiệt."
    },
    "suggestedRubricSummary": [
      "Đúng kiểu bài thuật lại sự việc",
      "Xác định rõ ràng thời gian, địa điểm, sự việc",
      "Trình tự diễn biến mạch lạc, dễ theo dõi"
    ]
  },
  {
    "id": "kntt-hk1-t06-b10",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 6, Bài 10, tr. 46 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 6,
    "lessonNumber": 10,
    "sgkPage": 46,
    "stage": "Lập dàn ý",
    "learningObjectives": "Chọn lọc và sắp xếp các chi tiết quan trọng của sự việc.",
    "title": "Lập dàn ý cho bài văn thuật lại một sự việc",
    "prompt": "Thực hành lập dàn ý chi tiết cho bài văn thuật lại một sự việc đáng nhớ (như một buổi lễ kỉ niệm, một buổi sinh hoạt lớp hoặc một trận thi đấu thể thao sôi nổi ở trường em).",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Thuật lại sự việc",
    "level": "bai",
    "topic": "Lập dàn ý thuật lại sự việc",
    "targetWords": 150,
    "lessonReference": "Tuần 6 - Bài 10 (trang 46, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 46,
    "createdAt": "06/10/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Em chọn sự việc nào để lập dàn ý? Các mốc thời gian diễn ra sự việc gồm những gì?",
        "targetGenre": "Dàn ý bài văn thuật lại sự việc",
        "keyElements": [
          "Xem lại đề bài và sơ đồ kiểu bài đã học",
          "Ghi các mốc diễn biến, người tham gia, chi tiết đáng nhớ",
          "Sắp xếp diễn biến theo trình tự thời gian hoặc logic phù hợp"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Cờ hoa rực rỡ, trang phục chỉnh tề của thầy cô và các bạn",
          "sound": "Tiếng trống giòn giã, tiếng vỗ tay râm ran",
          "emotion": "Hào hứng, tự hào, hồi hộp"
        },
        "guidingQuestions": [
          "Mở bài em sẽ giới thiệu sự việc trực tiếp hay gián tiếp?",
          "Trong phần thân bài, đâu là chi tiết gay cấn hoặc hào hứng nhất?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài: Giới thiệu trận thi đấu kéo co giữa lớp 4A và lớp 4B vào chiều thứ Sáu.",
        "body": [
          "Mốc 1: Hai đội bước vào sân, tiếng trống giục giã, khán giả reo hò cổ vũ.",
          "Mốc 2: Tiếng còi vang lên, hai đội gồng mình kéo sợi dây thừng, dải khăn đỏ nhích qua nhích lại.",
          "Mốc 3: Tiếng hô 'Cố lên!' vang dội, lớp 4A dồn hết sức kéo mạnh và giành chiến thắng."
        ],
        "conclusion": "Kết bài: Niềm vui sướng vỡ òa, bài học về tinh thần đoàn kết của tập thể lớp."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "giục giã",
          "gồng mình",
          "dồn sức",
          "vỡ òa",
          "đoàn kết"
        ],
        "comparisons": [
          "Sợi dây thừng căng ra như một chiếc dây cung."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Dàn ý có bám sát đề bài đã chọn?",
        "Đủ các sự việc chính, không bỏ sót mốc quan trọng?",
        "Trình tự diễn biến logic, hợp lí?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Dàn ý: Thuật lại trận chung kết kéo co giải thể thao trường Tiểu học Chu Văn An."
    },
    "suggestedRubricSummary": [
      "Dàn ý đúng đề tài, bố cục 3 phần rõ ràng",
      "Đủ các sự việc và chi tiết tiêu biểu",
      "Sắp xếp theo trình tự thời gian logic"
    ]
  },
  {
    "id": "kntt-hk1-t06-b11",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 6, Bài 11, tr. 50 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 6,
    "lessonNumber": 11,
    "sgkPage": 50,
    "stage": "Viết bài",
    "learningObjectives": "Viết bài văn thuật lại sự việc có mở đầu, diễn biến và kết thúc.",
    "title": "Viết bài văn thuật lại một sự việc",
    "prompt": "Dựa vào dàn ý đã lập ở Bài 10, hãy viết bài văn hoàn chỉnh thuật lại một sự việc diễn ra ở trường hoặc ở nơi em sống, làm nổi bật diễn biến chính và cảm xúc của em.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Thuật lại sự việc",
    "level": "bai",
    "topic": "Viết bài văn thuật lại sự việc",
    "targetWords": 200,
    "lessonReference": "Tuần 6 - Bài 11 (trang 50, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 95,
    "createdAt": "09/10/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Triển khai dàn ý thành các đoạn văn hoàn chỉnh có mở đầu, diễn biến chi tiết và kết thúc sâu sắc.",
        "targetGenre": "Bài văn thuật lại một sự việc hoàn chỉnh",
        "keyElements": [
          "Nhắc lại yêu cầu và tiêu chí bài viết",
          "Dựa vào dàn ý và ghi chép của bản thân làm khung triển khai",
          "Viết bài văn bằng lời của mình, kết hợp tả hành động và cảm xúc"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Hình ảnh từng gương mặt đỏ bừng vì cố sức, ánh mắt rạng ngời niềm tin",
          "sound": "Tiếng trống trường vang lên từng hồi thúc giục, tiếng reo hò cổ vũ cuồng nhiệt",
          "touch": "Những giọt mồ hôi lăn dài trên má, bàn tay siết chặt sợi dây thừng thô ráp",
          "emotion": "Nghẹt thở từng giây phút rồi vỡ òa trong niềm vui chiến thắng"
        },
        "guidingQuestions": [
          "Từ nối nào giúp em chuyển đoạn nhịp nhàng giữa các mốc thời gian?",
          "Hình ảnh so sánh nào làm nổi bật sự gay cấn của sự việc?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài gián tiếp: Dẫn dắt từ không khí náo nức của Hội thao trường, giới thiệu trận kéo co đáng nhớ.",
        "body": [
          "Đoạn 1: Chuẩn bị vào trận, không khí sân trường sôi sục, hai đội xếp hàng chỉnh tề.",
          "Đoạn 2: Trận đấu diễn ra căng thẳng nghẹt thở, hai bên giằng co từng tấc đất.",
          "Đoạn 3: Sự bứt phá quyết định và chiến thắng chung cuộc của lớp."
        ],
        "conclusion": "Kết bài mở rộng: Ý nghĩa của chiến thắng, tình bạn bè thêm khăng khít gắn bó."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "náo nức",
          "nghẹt thở",
          "giằng co",
          "bùng nổ",
          "khăng khít"
        ],
        "comparisons": [
          "Sợi dây thừng căng như dây đàn trong tiếng reo hò vang dậy như sấm ran.",
          "Niềm vui vỡ òa như cơn mưa rào tưới mát cả sân trường."
        ],
        "personifications": [
          "Những tia nắng thu cũng nhảy múa reo vui cùng chúng em."
        ]
      },
      "step5Checklist": [
        "Bài văn đúng đề, diễn biến rõ ràng, tuần tự?",
        "Các chi tiết hành động và cảm xúc được miêu tả sinh động?",
        "Có sử dụng từ nối chuyển đoạn khéo léo?",
        "Chính tả sạch sẽ, không mắc lỗi câu?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Tiếng trống trường đã điểm, báo hiệu giờ giải lao buổi chiều nhưng sân trường hôm nay sôi động hơn thường lệ. Đó là trận chung kết kéo co đầy kịch tính giữa lớp 4A của chúng em và lớp 4B.",
      "goodBodyExcerpt": "Khi tiếng còi của thầy trọng tài vang lên, cả hai đội lập tức gồng mình kéo mạnh. Sợi dây thừng căng ra như dây cung. Chiếc nơ đỏ ở giữa lúc thì nghiêng về bên phải, lúc lại dạt về bên trái trong tiếng reo hò cổ vũ vang dội: 'Lớp 4A cố lên! Cố lên!'.",
      "goodConclusionExample": "Trận đấu khép lại trong tiếng cười rạng rỡ và những cái ôm siết chặt. Chiến thắng này không chỉ mang lại niềm tự hào mà còn giúp tập thể lớp em thêm đoàn kết, gắn bó hơn bao giờ hết."
    },
    "suggestedRubricSummary": [
      "Đúng yêu cầu đề bài, bố cục 3 phần cân đối",
      "Diễn biến sự việc rõ ràng, chi tiết tiêu biểu",
      "Liên kết câu và đoạn tốt, dùng từ ngữ gợi tả",
      "Chính tả đúng, cảm xúc chân thực"
    ]
  },
  {
    "id": "kntt-hk1-t07-b12",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 7, Bài 12, tr. 52 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 7,
    "lessonNumber": 12,
    "sgkPage": 52,
    "stage": "Tìm hiểu kiểu bài",
    "learningObjectives": "Nhận biết cấu trúc bài kể chuyện và các sự việc chính.",
    "title": "Tìm hiểu cách viết bài văn kể lại một câu chuyện",
    "prompt": "Đọc bài văn mẫu kể lại một câu chuyện trong SGK trang 52. Phân tích cấu trúc 3 phần (Mở bài - Thân bài - Kết bài), chỉ ra các nhân vật, bối cảnh, chuỗi sự việc chính và bài học đạo đức câu chuyện gửi gắm.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Kể lại một câu chuyện",
    "level": "bai",
    "topic": "Kể lại câu chuyện",
    "targetWords": 180,
    "lessonReference": "Tuần 7 - Bài 12 (trang 52, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 50,
    "createdAt": "14/10/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Câu chuyện có những nhân vật nào? Sự việc nào mở đầu, sự việc nào tạo nên bước ngoặt?",
        "targetGenre": "Bài văn kể lại một câu chuyện",
        "keyElements": [
          "Đọc bài mẫu; nhận diện mở bài, thân bài, kết bài",
          "Ghi nhân vật, bối cảnh, sự việc chính và kết thúc",
          "Sắp xếp sự việc theo trình tự kể; hoàn thành sơ đồ câu chuyện"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Hồi hộp theo dõi số phận nhân vật, đồng cảm với nỗi niềm của câu chuyện"
        },
        "guidingQuestions": [
          "Mở bài giới thiệu câu chuyện bằng cách nào?",
          "Các sự việc được kết nối với nhau như thế nào?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài: Giới thiệu tên câu chuyện, xuất xứ hoặc hoàn cảnh được nghe kể.",
        "body": [
          "Sự việc 1: Khởi đầu câu chuyện, giới thiệu nhân vật và hoàn cảnh.",
          "Sự việc 2: Diễn biến gay cấn, thử thách đối với nhân vật.",
          "Sự việc 3: Cách nhân vật giải quyết thử thách và kết cục."
        ],
        "conclusion": "Kết bài: Nêu ý nghĩa câu chuyện hoặc bài học rút ra cho bản thân."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "li kì",
          "thử thách",
          "nhân ái",
          "trừng phạt",
          "xứng đáng"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Nhận diện đúng cấu trúc 3 phần?",
        "Chọn đúng các sự việc chính của câu chuyện?",
        "Trình tự kể hợp lí, giữ đúng nội dung cốt truyện?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Trong những câu chuyện cổ tích bà thường kể em nghe dưới ánh trăng, em nhớ nhất là chuyện 'Cây khế'."
    },
    "suggestedRubricSummary": [
      "Nhận diện đúng cấu trúc bài kể chuyện",
      "Chọn đúng các sự việc chính yếu",
      "Trình tự kể hợp lí, bảo đảm nội dung cốt truyện"
    ]
  },
  {
    "id": "kntt-hk1-t07-b13",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 7, Bài 13, tr. 57 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 7,
    "lessonNumber": 13,
    "sgkPage": 57,
    "stage": "Luyện viết bộ phận bài",
    "learningObjectives": "Viết mở bài và kết bài phù hợp với bài văn kể chuyện.",
    "title": "Luyện viết đoạn mở bài, kết bài cho bài văn kể lại một câu chuyện",
    "prompt": "Thực hành viết 2 cách mở bài (Mở bài trực tiếp và Mở bài gián tiếp) cùng 2 cách kết bài (Kết bài không mở rộng và Kết bài mở rộng) cho một câu chuyện em yêu thích.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Kể lại một câu chuyện",
    "level": "doan",
    "topic": "Mở bài & Kết bài kể chuyện",
    "targetWords": 100,
    "lessonReference": "Tuần 7 - Bài 13 (trang 57, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 62,
    "createdAt": "16/10/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Mở bài gián tiếp khác mở bài trực tiếp ở điểm nào? Kết bài mở rộng có thêm phần bình luận gì?",
        "targetGenre": "Kĩ năng viết mở bài và kết bài",
        "keyElements": [
          "So sánh các cách mở bài/kết bài trong mẫu",
          "Chọn cách giới thiệu câu chuyện và suy nghĩ/cảm xúc cuối bài",
          "Xác định mở bài, thân bài dự kiến và kết bài gắn kết với nhau"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Sáng tạo trong cách dẫn dắt mở bài và sâu lắng trong lời kết"
        },
        "guidingQuestions": [
          "Có thể dẫn dắt từ một câu thơ, câu hát hay kỉ niệm nào để vào câu chuyện?",
          "Kết bài mở rộng có thể liên hệ với thực tế cuộc sống như thế nào?"
        ]
      },
      "step3Outline": {
        "introduction": "Phương án 1 (Mở bài trực tiếp): Giới thiệu ngay tên truyện và nhân vật chính.\nPhương án 2 (Mở bài gián tiếp): Dẫn dắt từ một bài học đạo đức hoặc kỉ niệm tuổi thơ.",
        "body": [
          "Gắn kết với nội dung thân bài dự kiến."
        ],
        "conclusion": "Phương án 1 (Kết bài không mở rộng): Nêu kết cục của câu chuyện.\nPhương án 2 (Kết bài mở rộng): Bày tỏ suy nghĩ, tình cảm và bài học đạo đức sâu xa."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "dẫn dắt",
          "thâm thúy",
          "lắng đọng",
          "bài học",
          "triết lí"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Mở bài tự nhiên, không kể hết nội dung câu chuyện?",
        "Kết bài hợp lí, gắn chặt với nội dung vừa kể?",
        "Tránh lặp từ, cách diễn đạt mượt mà?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Mở bài gián tiếp: Tuổi thơ của ai cũng từng lớn lên bên lời ru êm đềm của mẹ và những câu chuyện cổ tích diệu kì của bà. Trong thế giới diệu kì ấy, câu chuyện 'Sự tích hoa cúc trắng' luôn để lại trong em niềm xúc động khôn nguôi."
    },
    "suggestedRubricSummary": [
      "Mở bài dẫn dắt tự nhiên, lôi cuốn",
      "Kết bài hợp lí, bộc lộ cảm xúc sâu sắc",
      "Tránh lặp nguyên văn câu chữ, hành văn mượt mà"
    ]
  },
  {
    "id": "kntt-hk1-t07-b14",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 7, Bài 14, tr. 61 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 7,
    "lessonNumber": 14,
    "sgkPage": 61,
    "stage": "Viết bài",
    "learningObjectives": "Kể lại câu chuyện mạch lạc, đủ sự việc chính và đúng trình tự.",
    "title": "Viết bài văn kể lại một câu chuyện",
    "prompt": "Hãy viết bài văn hoàn chỉnh kể lại một câu chuyện cổ tích hoặc một tấm gương người tốt việc tốt mà em đã đọc hoặc được nghe, vận dụng mở bài gián tiếp và kết bài mở rộng đã học.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Kể lại một câu chuyện",
    "level": "bai",
    "topic": "Kể lại câu chuyện",
    "targetWords": 200,
    "lessonReference": "Tuần 7 - Bài 14 (trang 61, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 91,
    "createdAt": "19/10/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Kể lại câu chuyện bằng lời văn của em nhưng vẫn bảo đảm đầy đủ các chi tiết then chốt.",
        "targetGenre": "Bài văn kể chuyện hoàn chỉnh",
        "keyElements": [
          "Nhắc lại yêu cầu kể chuyện và các phần của bài",
          "Sử dụng sơ đồ nhân vật và sự việc đã chuẩn bị",
          "Dàn ý gồm mở bài, diễn biến chính, kết bài"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Hình dung rõ nét từng hành động, biểu cảm khuôn mặt của nhân vật",
          "emotion": "Rung cảm trước cái thiện chiến thắng cái ác, lòng tốt được đền đáp"
        },
        "guidingQuestions": [
          "Nhân vật chính đã gặp phải khó khăn thử thách gì?",
          "Lời nói và cử chỉ nào làm nổi bật phẩm chất của nhân vật?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài gián tiếp: Giới thiệu câu chuyện cổ tích quen thuộc đầy ý nghĩa nhân văn.",
        "body": [
          "Đoạn 1: Hoàn cảnh xuất thân và đức tính ban đầu của nhân vật.",
          "Đoạn 2: Thử thách xảy ra và lòng dũng cảm/hiếu thảo của nhân vật.",
          "Đoạn 3: Kết cục tốt đẹp dành cho người lương thiện, kẻ tham lam bị trừng phạt."
        ],
        "conclusion": "Kết bài mở rộng: Suy ngẫm về bài học sống tử tế, biết ơn và yêu thương cha mẹ."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "lương thiện",
          "hiếu thảo",
          "kì lạ",
          "lung linh",
          "hạnh phúc"
        ],
        "comparisons": [
          "Tấm lòng cô bé thơm thảo như hương hoa mùa xuân."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Kể đủ các sự việc chính, đúng trình tự trước - sau?",
        "Giữ tính nhất quán về tính cách nhân vật?",
        "Diễn đạt mạch lạc, truyền cảm, không mắc lỗi chính tả?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Mỗi câu chuyện cổ tích như một hạt mầm thiện lành gieo vào tâm hồn trẻ thơ. Trong đó, câu chuyện 'Cây khế' với bài học sâu sắc về lòng nhân hậu và sự đền đáp xứng đáng luôn in đậm trong tâm trí em."
    },
    "suggestedRubricSummary": [
      "Đủ sự việc chính của câu chuyện",
      "Đúng trình tự diễn biến mạch lạc",
      "Diễn đạt giàu cảm xúc, có mở bài và kết bài hay"
    ]
  },
  {
    "id": "kntt-hk1-t08-b15",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 8, Bài 15, tr. 65 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 8,
    "lessonNumber": 15,
    "sgkPage": 65,
    "stage": "Luyện viết / nhiệm vụ viết tiếp",
    "learningObjectives": "Vận dụng quy trình kể chuyện vào một đề viết khác.",
    "title": "Viết bài văn kể lại một câu chuyện (Đề bài mới)",
    "prompt": "Vận dụng các kĩ năng đã học để kể lại một câu chuyện về lòng dũng cảm hoặc lòng nhân ái mà em đã đọc trong sách báo, nêu rõ cảm xúc và suy nghĩ của bản thân.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Kể lại một câu chuyện",
    "level": "bai",
    "topic": "Vận dụng kể chuyện",
    "targetWords": 190,
    "lessonReference": "Tuần 8 - Bài 15 (trang 65, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 44,
    "createdAt": "22/10/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đề bài mới này yêu cầu chủ đề gì (lòng dũng cảm hay lòng nhân ái)? Có điểm gì khác với câu chuyện trước?",
        "targetGenre": "Bài văn kể chuyện theo chủ đề mới",
        "keyElements": [
          "Đọc yêu cầu cụ thể của bài; xác định điểm khác với bài trước",
          "Chọn câu chuyện và ghi sự việc chính theo đề",
          "Lập khung kể chuyện theo mở bài – diễn biến – kết bài"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Cảm phục hành động quả cảm hoặc nghĩa cử cao đẹp của nhân vật"
        },
        "guidingQuestions": [
          "Hành động dũng cảm của nhân vật diễn ra trong hoàn cảnh hiểm nghèo nào?",
          "Kết quả hành động đó đã cứu giúp được ai?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài: Giới thiệu câu chuyện về tấm gương dũng cảm cứu bạn đuối nước.",
        "body": [
          "Hoàn cảnh: Buổi chiều hè bên khúc sông quê.",
          "Hành động: Khi nghe tiếng kêu cứu, nhân vật không ngần ngại lao mình xuống dòng nước xiết.",
          "Kết quả: Đưa được bạn vào bờ an toàn trong sự khâm phục của mọi người."
        ],
        "conclusion": "Kết bài: Bài học về lòng dũng cảm, sự bình tĩnh và tinh thần xả thân vì người khác."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "dũng cảm",
          "nguy hiểm",
          "nhanh trí",
          "cứu giúp",
          "khâm phục"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng yêu cầu đề bài mới?",
        "Các sự việc được kể rõ ràng, mạch lạc?",
        "Bố cục hợp lí, bộc lộ tình cảm chân thực?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Lòng dũng cảm không chỉ có trong những trang sử hào hùng mà còn hiện hữu ngay giữa đời thường qua những hành động xả thân cứu bạn."
    },
    "suggestedRubricSummary": [
      "Đúng yêu cầu đề bài theo chủ đề mới",
      "Các sự việc kể rõ ràng, gay cấn",
      "Bố cục chặt chẽ, lời văn mạch lạc"
    ]
  },
  {
    "id": "kntt-hk1-t08-b16",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 8, Bài 16, tr. 68 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 8,
    "lessonNumber": 16,
    "sgkPage": 68,
    "stage": "Trả bài / chỉnh sửa",
    "learningObjectives": "Sử dụng phản hồi để nâng chất lượng bài kể chuyện.",
    "title": "Trả bài văn kể lại một câu chuyện",
    "prompt": "Đọc kĩ nhận xét của thầy cô hoặc gợi mở từ AI, rà soát lại bài văn kể chuyện của em, phát hiện các đoạn thiếu sự việc, diễn đạt lủng củng hoặc chưa nêu bật được phẩm chất nhân vật để sửa chữa và nâng cao chất lượng bài viết.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Kể lại một câu chuyện",
    "level": "bai",
    "topic": "Chỉnh sửa bài kể chuyện",
    "targetWords": 180,
    "lessonReference": "Tuần 8 - Bài 16 (trang 68, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 37,
    "createdAt": "25/10/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đọc nhận xét và xác định điểm làm tốt cũng như chỗ cần sửa trong bài kể chuyện của em.",
        "targetGenre": "Kĩ năng hoàn thiện bài văn kể chuyện",
        "keyElements": [
          "Đọc nhận xét và xác định điểm làm tốt",
          "Đánh dấu chỗ thiếu sự việc, chưa rõ hoặc lặp ý",
          "Ưu tiên sửa nội dung, sau đó diễn đạt và chính tả"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Tỉ mỉ, kiên nhẫn trau chuốt từng câu chữ"
        },
        "guidingQuestions": [
          "Các tình tiết đã nối tiếp nhau mượt mà chưa?",
          "Đoạn văn kết bài đã bộc lộ cảm xúc lắng đọng chưa?"
        ]
      },
      "step3Outline": {
        "introduction": "Xem lại mở bài: Đã dẫn dắt cuốn hút chưa?",
        "body": [
          "Chỉnh sửa thân bài: Bổ sung hành động, lời nói nhân vật để tăng sức sống cho câu chuyện.",
          "Sửa lỗi câu què, câu cụt hoặc lỗi lặp từ ngữ."
        ],
        "conclusion": "Nâng cấp kết bài: Thêm lời bình sâu sắc về bài học nhân sinh."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "hoàn thiện",
          "lắng đọng",
          "truyền cảm",
          "mượt mà",
          "tinh tế"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Sửa đúng trọng tâm nhận xét?",
        "Giữ nội dung cốt truyện nhất quán?",
        "Bản sửa sau rõ ràng, cảm động hơn?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Sau khi đọc nhận xét của cô, em đã sửa lại đoạn tả lúc nhân vật lao xuống nước để làm nổi bật sự nguy hiểm và dũng cảm."
    },
    "suggestedRubricSummary": [
      "Sửa đúng trọng tâm phản hồi của giáo viên",
      "Giữ nội dung câu chuyện nhất quán",
      "Bài viết sau chỉnh sửa hoàn thiện và hay hơn"
    ]
  },
  {
    "id": "kntt-hk1-t10-b17",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 10, Bài 17, tr. 79 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 10,
    "lessonNumber": 17,
    "sgkPage": 79,
    "stage": "Tìm hiểu kiểu bài",
    "learningObjectives": "Hiểu cách tạo nội dung tưởng tượng dựa trên câu chuyện hoặc tình huống.",
    "title": "Tìm hiểu cách viết đoạn văn tưởng tượng",
    "prompt": "Đọc đoạn văn tưởng tượng mẫu trong SGK trang 79. Phân biệt giữa chi tiết có sẵn trong câu chuyện gốc và những chi tiết do tác giả sáng tạo thêm dựa trên trí tưởng tượng bay bổng.",
    "genre": "tuong-tuong",
    "genreLabel": "Đoạn văn tưởng tượng",
    "level": "doan",
    "topic": "Tưởng tượng sáng tạo",
    "targetWords": 80,
    "lessonReference": "Tuần 10 - Bài 17 (trang 79, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 81,
    "createdAt": "03/11/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đoạn văn tưởng tượng có điểm gì khác đoạn văn miêu tả thực tế? Chi tiết nào là sáng tạo của trí tưởng tượng?",
        "targetGenre": "Đoạn văn tưởng tượng",
        "keyElements": [
          "Phân tích mẫu; xác định chi tiết có sẵn và chi tiết tưởng tượng",
          "Chọn nhân vật, tình huống hoặc hướng phát triển nội dung",
          "Sắp xếp mở đầu – phần tưởng tượng – kết thúc"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Hình ảnh thế giới kì ảo trong tương lai, đôi cánh ước mơ, vùng đất lạ",
          "emotion": "Thích thú, bay bổng, tràn đầy ước mơ"
        },
        "guidingQuestions": [
          "Nếu có phép màu hoặc cỗ máy thời gian, em sẽ thấy điều gì kì diệu?",
          "Chi tiết tưởng tượng có giữ được nét tính cách của nhân vật không?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở đầu: Giới thiệu hoàn cảnh nảy sinh sự việc tưởng tượng.",
        "body": [
          "Chi tiết 1: Khám phá cảnh vật hoặc nhân vật có phép màu kì lạ.",
          "Chi tiết 2: Cuộc trò chuyện hoặc chuyến phiêu lưu bất ngờ."
        ],
        "conclusion": "Kết thúc: Trở về thực tại hoặc khẳng định ước mơ tươi đẹp."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "kì ảo",
          "lung linh",
          "bay bổng",
          "diệu kì",
          "ngỡ ngàng"
        ],
        "comparisons": [
          "Cảnh vật rực rỡ như một bức tranh thần tiên."
        ],
        "personifications": [
          "Những vì sao đêm lấp lánh như đang mỉm cười trò chuyện cùng em."
        ]
      },
      "step5Checklist": [
        "Ý tưởng gắn với đề bài?",
        "Phân biệt rõ chi tiết gốc và chi tiết sáng tạo?",
        "Chi tiết tưởng tượng có tính hợp lí và đẹp đẽ?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Đêm ấy, trong giấc mơ êm đềm, em thấy mình mọc ra một đôi cánh thiên thần trắng muốt lấp lánh ánh kim tuyến."
    },
    "suggestedRubricSummary": [
      "Ý tưởng gắn liền với đề tài",
      "Phân biệt rõ chi tiết thực và chi tiết sáng tạo",
      "Hình ảnh tưởng tượng phong phú, trong sáng"
    ]
  },
  {
    "id": "kntt-hk1-t11-b18",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 11, Bài 18, tr. 83 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 11,
    "lessonNumber": 18,
    "sgkPage": 83,
    "stage": "Tìm ý",
    "learningObjectives": "Phát triển ý tưởng phù hợp với nhân vật, tình huống và câu chuyện.",
    "title": "Tìm ý cho đoạn văn tưởng tượng",
    "prompt": "Thực hành chọn một đề tài tưởng tượng (như cuộc trò chuyện với một đồ vật, chuyến du hành đến hành tinh xanh hoặc cuộc gặp gỡ với nhân vật cổ tích). Lập phiếu tìm ý với các chi tiết sáng tạo phong phú.",
    "genre": "tuong-tuong",
    "genreLabel": "Đoạn văn tưởng tượng",
    "level": "doan",
    "topic": "Tìm ý tưởng tượng",
    "targetWords": 80,
    "lessonReference": "Tuần 11 - Bài 18 (trang 83, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 47,
    "createdAt": "06/11/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Em muốn tưởng tượng về điều gì? Tình huống nào khơi gợi điều kì thú?",
        "targetGenre": "Kĩ năng tìm ý đoạn văn tưởng tượng",
        "keyElements": [
          "Nhắc lại yêu cầu đoạn văn tưởng tượng",
          "Ghi điều muốn bổ sung, thay đổi hoặc phát triển; xác định cảm xúc/mục đích",
          "Chọn trình tự các chi tiết để đoạn văn liền mạch; hoàn thành phiếu ý tưởng"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Con tàu vũ trụ lấp lánh ánh bạc, những đám mây ngũ sắc trôi bồng bềnh",
          "sound": "Tiếng thì thầm dịu dàng của cuốn sách cũ trên giá",
          "emotion": "Kinh ngạc, say mê, ngập tràn hi vọng"
        },
        "guidingQuestions": [
          "Đồ vật hay nhân vật đó sẽ nói gì với em đầu tiên?",
          "Điều bí mật nào sẽ được bật mí trong cuộc gặp gỡ đó?"
        ]
      },
      "step3Outline": {
        "introduction": "Ý tưởng: Bất ngờ nghe thấy giọng nói của chiếc bút máy thân quen.",
        "body": [
          "Chi tiết 1: Chiếc bút than phiền vì bị viết mực lem nhem hoặc cảm ơn vì được giữ gìn sạch sẽ.",
          "Chi tiết 2: Lời hứa cùng nhau nắn nót từng trang vở sạch chữ đẹp."
        ],
        "conclusion": "Cảm xúc: Trân trọng đồ dùng học tập như một người bạn tri kỉ."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "thủ thỉ",
          "tri kỉ",
          "kì thú",
          "bất ngờ",
          "ngộ nghĩnh"
        ],
        "comparisons": [],
        "personifications": [
          "Chiếc bút máy khẽ rung rung ngòi bút mỉm cười."
        ]
      },
      "step5Checklist": [
        "Ý tưởng rõ ràng, có liên quan?",
        "Có tính hợp lí và sáng tạo trong sáng?",
        "Loại bỏ chi tiết mâu thuẫn hoặc vô lí?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Phiếu ý tưởng: Đề tài 'Cuộc trò chuyện giữa em và chiếc cặp sách sau một năm học'."
    },
    "suggestedRubricSummary": [
      "Ý tưởng rõ ràng, độc đáo",
      "Có liên quan và phù hợp lứa tuổi",
      "Tính hợp lí và sáng tạo cao"
    ]
  },
  {
    "id": "kntt-hk1-t11-b19",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 11, Bài 19, tr. 88 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 11,
    "lessonNumber": 19,
    "sgkPage": 88,
    "stage": "Viết bài",
    "learningObjectives": "Viết đoạn văn tưởng tượng có nội dung nhất quán và hấp dẫn.",
    "title": "Viết đoạn văn tưởng tượng",
    "prompt": "Dựa vào phiếu tìm ý đã lập ở Bài 18, hãy viết đoạn văn tưởng tượng (từ 5 đến 7 câu) kể về cuộc trò chuyện thú vị của em với một đồ vật hoặc cuộc gặp gỡ với một nhân vật cổ tích mà em yêu quý.",
    "genre": "tuong-tuong",
    "genreLabel": "Đoạn văn tưởng tượng",
    "level": "doan",
    "topic": "Sáng tác đoạn văn tưởng tượng",
    "targetWords": 90,
    "lessonReference": "Tuần 11 - Bài 19 (trang 88, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 96,
    "createdAt": "10/11/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Viết đoạn văn tưởng tượng bằng cách dùng biện pháp nhân hóa để đồ vật biết nói năng, suy nghĩ như con người.",
        "targetGenre": "Đoạn văn tưởng tượng hoàn chỉnh",
        "keyElements": [
          "Ôn tiêu chí của đoạn văn tưởng tượng",
          "Dùng ý tưởng đã chọn và các chi tiết gợi ý",
          "Theo trình tự đã lập; viết bằng lời văn hồn nhiên của học sinh"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Chiếc cặp sách bạc màu vì mưa nắng, những đường chỉ may chắc chắn",
          "sound": "Giọng nói ấm áp, trầm trồ của người bạn đồng hành",
          "emotion": "Thương mến, biết ơn, xúc động"
        },
        "guidingQuestions": [
          "Đồ vật đã đồng hành cùng em qua những ngày tháng nào?",
          "Em đã rút ra bài học gì về việc giữ gìn đồ dùng sau cuộc trò chuyện?"
        ]
      },
      "step3Outline": {
        "introduction": "Câu 1: Một buổi tối yên tĩnh, khi ngồi vào bàn học, em bỗng nghe thấy tiếng thở dài khe khẽ.",
        "body": [
          "Câu 2 - 3: Thì ra bác cặp sách đang trò chuyện với em về một năm học đã qua.",
          "Câu 4 - 5: Bác kể về những hôm che mưa cho từng trang sách, nhắc nhở em đừng nhét thước kẻ gãy vào ngăn phụ."
        ],
        "conclusion": "Câu 6 - 7: Em nhẹ nhàng ôm bác cặp vào lòng và thầm hứa sẽ luôn nâng niu, giữ gìn người bạn thân thiết này."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "nâng niu",
          "tri kỉ",
          "tỉ tê",
          "ngộ nghĩnh",
          "ấm áp"
        ],
        "comparisons": [
          "Bác cặp sách như một người vệ sĩ trung thành của tuổi học trò."
        ],
        "personifications": [
          "Bác cặp sách mỉm cười, ánh mắt lấp lánh niềm vui khi nghe lời hứa của em."
        ]
      },
      "step5Checklist": [
        "Đúng dung lượng 5 - 7 câu?",
        "Nội dung tưởng tượng hấp dẫn, nhất quán?",
        "Dùng từ ngữ gợi cảm, câu văn liên kết mượt mà?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Tối nay, khi góc học tập đã tắt bớt ánh đèn, em bỗng nghe thấy tiếng thì thầm phát ra từ giá sách.",
      "goodBodyExcerpt": "Bác Từ điển tiếng Việt to béo cất giọng trầm ấm: 'Cậu bé ơi, cảm ơn cậu hôm nay đã cẩn thận tra cứu từ ngữ mà không làm gập mép giấy của tôi nhé!'. Em ngỡ ngàng rồi mỉm cười đáp lời bác trong niềm vui khôn tả.",
      "goodConclusionExample": "Cuộc trò chuyện diệu kì ấy khiến em nhận ra mỗi đồ vật quanh mình đều có một tâm hồn cần được yêu thương và nâng niu."
    },
    "suggestedRubricSummary": [
      "Đúng yêu cầu đề bài tưởng tượng",
      "Nội dung nhất quán, mạch lạc, hấp dẫn",
      "Chi tiết sáng tạo, có nét hồn nhiên trong sáng",
      "Chính tả chuẩn, diễn đạt lưu loát"
    ]
  },
  {
    "id": "kntt-hk1-t12-b20",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 12, Bài 20, tr. 91 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 12,
    "lessonNumber": 20,
    "sgkPage": 91,
    "stage": "Trả bài / chỉnh sửa",
    "learningObjectives": "Biết đánh giá tính hợp lí và sáng tạo trong đoạn văn của mình.",
    "title": "Trả bài viết đoạn văn tưởng tượng",
    "prompt": "Đọc nhận xét của thầy cô và đánh giá của AI về đoạn văn tưởng tượng của em. Chọn ra một điểm sáng tạo tốt nhất và sửa lại một chi tiết còn thiếu hợp lí hoặc chưa mượt mà.",
    "genre": "tuong-tuong",
    "genreLabel": "Đoạn văn tưởng tượng",
    "level": "doan",
    "topic": "Chỉnh sửa đoạn văn tưởng tượng",
    "targetWords": 85,
    "lessonReference": "Tuần 12 - Bài 20 (trang 91, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 36,
    "createdAt": "13/11/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đoạn văn tưởng tượng của em có chi tiết nào bị vô lí hoặc mâu thuẫn không? Lời văn đã tự nhiên chưa?",
        "targetGenre": "Kĩ năng tự đánh giá và hoàn thiện",
        "keyElements": [
          "Đọc phản hồi; xác định chi tiết hiệu quả và chi tiết cần làm rõ",
          "Ghi lại một điểm mạnh và một điểm cần sửa",
          "Lập thứ tự sửa nội dung rồi đến diễn đạt; viết lại đoạn hoàn thiện"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Tự hào về trí tưởng tượng của mình, không ngừng hoàn thiện câu chữ"
        },
        "guidingQuestions": [
          "Hình ảnh nhân hóa đã thật sự sống động chưa?",
          "Có thể thêm từ gợi cảm nào để câu văn thêm thi vị?"
        ]
      },
      "step3Outline": {
        "introduction": "Xem xét mở đoạn: Đã tạo được yếu tố bất ngờ chưa?",
        "body": [
          "Chỉnh sửa lời thoại hoặc hành động của đối tượng tưởng tượng.",
          "Thêm chi tiết miêu tả cảm xúc của bản thân em."
        ],
        "conclusion": "Đối chiếu bản sửa với bản ban đầu."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "sáng tạo",
          "hợp lí",
          "uyển chuyển",
          "trong trẻo",
          "đậm đà"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Biết tiếp thu phản hồi tích cực?",
        "Nội dung hợp lí, bớt phần gượng ép?",
        "Diễn đạt rõ ràng, bay bổng hơn?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Bản sửa: Em đã điều chỉnh chi tiết chiếc cặp biết bay thành chiếc cặp phát ra ánh sáng lung linh trong giấc mơ để hợp lí hơn."
    },
    "suggestedRubricSummary": [
      "Biết tiếp thu phản hồi xác đáng",
      "Nội dung chỉnh sửa hợp lí, sáng tạo hơn",
      "Diễn đạt rõ ràng, văn phong mượt mà"
    ]
  },
  {
    "id": "kntt-hk1-t12-b21",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 12, Bài 21, tr. 95 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 12,
    "lessonNumber": 21,
    "sgkPage": 95,
    "stage": "Tìm hiểu kiểu văn bản",
    "learningObjectives": "Nhận biết mục đích, cấu trúc và cách trình bày văn bản hướng dẫn.",
    "title": "Tìm hiểu cách viết hướng dẫn thực hiện một công việc",
    "prompt": "Đọc văn bản mẫu hướng dẫn thực hiện một công việc trong SGK trang 95 (cách làm một món đồ chơi hoặc thực hiện một hoạt động). Xác định mục đích, các khâu chuẩn bị dụng cụ, trình tự các bước thực hiện và lưu ý an toàn.",
    "genre": "huong-dan-cong-viec",
    "genreLabel": "Hướng dẫn thực hiện công việc",
    "level": "doan",
    "topic": "Văn bản hướng dẫn",
    "targetWords": 100,
    "lessonReference": "Tuần 12 - Bài 21 (trang 95, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 65,
    "createdAt": "17/11/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Văn bản hướng dẫn gồm những phần nào? Động từ chỉ thao tác được dùng như thế nào?",
        "targetGenre": "Văn bản hướng dẫn quy trình",
        "keyElements": [
          "Đọc mẫu; nhận diện tên công việc, chuẩn bị và các bước",
          "Liệt kê dụng cụ/vật liệu và thao tác cần thực hiện",
          "Sắp xếp các bước theo thứ tự thao tác; hoàn thành sơ đồ quy trình"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Hình ảnh các bước thao tác tuần tự: gấp giấy, miết mép, cắt góc, gắn keo",
          "touch": "Bàn tay khéo léo tỉ mẩn từng công đoạn",
          "emotion": "Hào hứng mong chờ sản phẩm hoàn thành"
        },
        "guidingQuestions": [
          "Nếu thiếu khâu chuẩn bị thì người làm có thực hiện được không?",
          "Từ chỉ thứ tự các bước (Bước 1, Bước 2... hoặc Đầu tiên, Tiếp theo) có vai trò gì?"
        ]
      },
      "step3Outline": {
        "introduction": "Tên công việc: Hướng dẫn gấp chú ếch nhảy bằng giấy màu.",
        "body": [
          "1. Chuẩn bị: 1 tờ giấy thủ công hình vuông, bút vẽ mắt.",
          "2. Các bước thực hiện: Bước 1 (Gấp đôi tạo nếp), Bước 2 (Gấp hai mép tạo đầu ếch), Bước 3 (Gấp chân và bụng ếch).",
          "3. Lưu ý: Miết thật phẳng nếp gấp để ếch nhảy xa."
        ],
        "conclusion": "Thành phẩm: Thử nghiệm ấn nhẹ đuôi ếch để ếch nhảy về phía trước."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "miết phẳng",
          "gấp đôi",
          "dứt khoát",
          "khéo léo",
          "vuốt thẳng"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng mục đích hướng dẫn thực hành?",
        "Từng bước được diễn đạt rõ ràng, đủ ý?",
        "Trình tự thao tác hợp lí, dễ thực hiện?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "HƯỚNG DẪN CÁCH GẤP MÁY BAY GIẤY BAY XA\nChuẩn bị: Một tờ giấy trắng khổ A4 phẳng phiu."
    },
    "suggestedRubricSummary": [
      "Đúng mục đích văn bản hướng dẫn",
      "Các bước rõ ràng, mạch lạc, dễ hiểu",
      "Trình tự hợp lí, bảo đảm tính khả thi"
    ]
  },
  {
    "id": "kntt-hk1-t12-b22",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 12, Bài 22, tr. 99 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 12,
    "lessonNumber": 22,
    "sgkPage": 99,
    "stage": "Lập dàn ý",
    "learningObjectives": "Chọn và sắp xếp các đặc điểm cần miêu tả con vật.",
    "title": "Lập dàn ý cho bài văn miêu tả con vật",
    "prompt": "Thực hành lập dàn ý cho bài văn miêu tả một con vật nuôi trong nhà (chú chó con, chú mèo tam thể hoặc chú gà trống). Lựa chọn các đặc điểm ngoại hình tiêu biểu và hoạt động ngộ nghĩnh đáng yêu.",
    "genre": "mieu-ta-con-vat",
    "genreLabel": "Miêu tả con vật",
    "level": "bai",
    "topic": "Lập dàn ý tả con vật",
    "targetWords": 150,
    "lessonReference": "Tuần 12 - Bài 22 (trang 99, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 89,
    "createdAt": "20/11/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Con vật em định tả là con gì? Nó có những đặc điểm nào khác biệt với những con vật khác?",
        "targetGenre": "Dàn ý bài văn miêu tả con vật",
        "keyElements": [
          "Xem yêu cầu bài; nhận diện các phần của bài miêu tả con vật",
          "Ghi hình dáng, màu sắc, bộ phận, hoạt động, thói quen và cảm nghĩ",
          "Mở bài giới thiệu → thân bài tả đặc điểm/hoạt động → kết bài nêu tình cảm"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Bộ lông mượt mà như nhung, đôi mắt tròn xoe như hai hòn bi ve trong veo",
          "sound": "Tiếng sủa 'gâu gâu' mừng rỡ, tiếng gầm gừ ngộ nghĩnh lúc đòi ăn",
          "touch": "Vuốt ve bộ lông mềm mại ấm áp, cái mũi ươn ướt cọ vào lòng bàn tay",
          "emotion": "Yêu quý, gắn bó như một người bạn nhỏ trong gia đình"
        },
        "guidingQuestions": [
          "Đặc điểm nào ở ngoại hình của con vật làm em thích nhất (bộ lông, đôi tai, cái đuôi)?",
          "Con vật có thói quen hoặc hoạt động nào đáng yêu (bắt chuột, sưởi nắng, đón chủ)?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài: Giới thiệu chú mèo Miu mà mẹ mua cho em nhân dịp sinh nhật.",
        "body": [
          "Tả ngoại hình: Vóc dáng nhỏ nhắn, bộ lông trắng muốt xen vàng cam, đôi mắt biếc lấp lánh trong đêm.",
          "Tả hoạt động: Dáng rình mồi nhẹ nhàng uyển chuyển, động tác rửa mặt bằng hai chân trước cực kì ngộ nghĩnh.",
          "Thói quen: Thích cuộn tròn ngủ bên bậc thềm sưởi nắng ban mai."
        ],
        "conclusion": "Kết bài: Tình cảm gắn bó của em với chú mèo, xem Miu như một thành viên đáng yêu trong nhà."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "mượt mà",
          "nhỏ nhắn",
          "uyển chuyển",
          "nhanh thoăn thoắt",
          "ấm áp"
        ],
        "comparisons": [
          "Đôi mắt tròn xoe như hai viên bi ve trong vắt.",
          "Chú cuộn tròn như một cuộn len ấm áp."
        ],
        "personifications": [
          "Miu làm nũng dụi đầu vào chân em như muốn nói lời cảm ơn."
        ]
      },
      "step5Checklist": [
        "Dàn ý đủ ba phần (Mở bài, Thân bài, Kết bài)?",
        "Đặc điểm chọn lọc tiêu biểu, không liệt kê tràn lan?",
        "Trình tự miêu tả hợp lí từ bao quát đến chi tiết hoạt động?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Dàn ý chi tiết bài văn miêu tả chú mèo Miu lớp 4A1."
    },
    "suggestedRubricSummary": [
      "Dàn ý đủ ba phần hoàn chỉnh",
      "Chọn đúng các đặc điểm ngoại hình và hoạt động tiêu biểu",
      "Trình tự miêu tả hợp lí, mạch lạc"
    ]
  },
  {
    "id": "kntt-hk1-t13-b23",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 13, Bài 23, tr. 104 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 13,
    "lessonNumber": 23,
    "sgkPage": 104,
    "stage": "Tìm hiểu kiểu văn bản",
    "learningObjectives": "Nhận biết mục đích, bố cục và các thành phần cơ bản của đơn.",
    "title": "Tìm hiểu cách viết đơn",
    "prompt": "Đọc mẫu lá đơn trong SGK trang 104. Phân tích các thành phần bắt buộc: Quốc hiệu và Tiêu ngữ, Tên đơn, Nơi nhận (Kính gửi), Thông tin người làm đơn, Lí do viết đơn, Lời hứa, Lời cảm ơn, Địa điểm ngày tháng và Chữ kí.",
    "genre": "viet-don",
    "genreLabel": "Viết đơn",
    "level": "doan",
    "topic": "Thể thức viết đơn",
    "targetWords": 100,
    "lessonReference": "Tuần 13 - Bài 23 (trang 104, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 55,
    "createdAt": "24/11/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Lá đơn được viết theo thể thức trang trọng như thế nào? Những mục nào bắt buộc phải có?",
        "targetGenre": "Văn bản hành chính: Lá đơn",
        "keyElements": [
          "Đọc mẫu đơn; xác định quốc hiệu, tiêu ngữ, tên đơn, nơi nhận, nội dung, lời hứa, chữ kí",
          "Xác định lí do viết đơn, người/đơn vị nhận đơn theo yêu cầu đề",
          "Sắp xếp các mục theo đúng quy chuẩn thể thức đơn tiểu học"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Bố cục đơn chuẩn: Quốc hiệu viết hoa ở giữa, Tiêu ngữ có gạch nối, Tên đơn in hoa to rõ ràng",
          "emotion": "Lễ phép, trung thực, tôn trọng nội quy nhà trường"
        },
        "guidingQuestions": [
          "Dòng 'Kính gửi:' cần điền tên ai (Thầy/Cô Hiệu trưởng, Cô giáo chủ nhiệm...)?",
          "Lí do viết đơn cần ngắn gọn, rõ ràng và trung thực ra sao?"
        ]
      },
      "step3Outline": {
        "introduction": "1. Quốc hiệu & Tiêu ngữ\n2. Địa điểm, ngày tháng năm làm đơn\n3. Tên đơn (viết chữ in hoa ở giữa trang).",
        "body": [
          "4. Nơi nhận: Kính gửi...",
          "5. Thông tin người viết: Em tên là... Sinh ngày... Học sinh lớp...",
          "6. Lí do viết đơn: Nêu nguyện vọng chính đáng.",
          "7. Lời cam kết: Em xin hứa sẽ chấp hành tốt nội quy..."
        ],
        "conclusion": "8. Lời cảm ơn trân trọng.\n9. Góc phải: Người làm đơn (Kí và ghi rõ họ tên)."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "kính gửi",
          "nguyện vọng",
          "chấp hành",
          "cam kết",
          "chân thành"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Nhận diện đúng thể thức của lá đơn?",
        "Xác định đúng mục đích và người nhận?",
        "Hiểu rõ vai trò từng phần trong đơn?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nĐƠN XIN GIA NHẬP CÂU LẠC BỘ BƠI LỘI"
    },
    "suggestedRubricSummary": [
      "Nhận diện đúng thể thức văn bản đơn",
      "Xác định đúng mục đích và người nhận",
      "Hiểu rõ vai trò của từng thành phần trong đơn"
    ]
  },
  {
    "id": "kntt-hk1-t13-b24",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 13, Bài 24, tr. 107 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 13,
    "lessonNumber": 24,
    "sgkPage": 107,
    "stage": "Viết văn bản thực hành",
    "learningObjectives": "Viết được đơn theo mục đích và tình huống cụ thể của đề bài.",
    "title": "Viết đơn",
    "prompt": "Chọn một trong hai đề bài sau để viết lá đơn hoàn chỉnh: (1) Đơn xin tham gia Câu lạc bộ nghệ thuật / thể thao của trường; (2) Đơn xin nghỉ một buổi học vì lí do chính đáng gửi thầy cô giáo chủ nhiệm.",
    "genre": "viet-don",
    "genreLabel": "Viết đơn",
    "level": "bai",
    "topic": "Thực hành viết đơn",
    "targetWords": 120,
    "lessonReference": "Tuần 13 - Bài 24 (trang 107, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 94,
    "createdAt": "27/11/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Em chọn viết đơn xin gì? Người nhận đơn là ai và lí do em đưa ra có thuyết phục, lễ phép không?",
        "targetGenre": "Lá đơn hoàn chỉnh",
        "keyElements": [
          "Đọc yêu cầu đề; xác định đơn xin tham gia CLB hoặc đơn xin nghỉ học",
          "Ghi đầy đủ thông tin cá nhân, lí do, lời hứa và ngày tháng",
          "Trình bày đúng thể thức đơn, căn chỉnh các mục ngay ngắn"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Trang giấy trình bày sạch đẹp, chữ viết ngay ngắn, không tẩy xóa",
          "emotion": "Lễ phép, chân thành, thể hiện mong muốn được tham gia rèn luyện"
        },
        "guidingQuestions": [
          "Em có lời hứa sẽ chép bài và hoàn thành bài tập đầy đủ không?",
          "Chữ kí và họ tên đã đặt đúng góc dưới bên phải chưa?"
        ]
      },
      "step3Outline": {
        "introduction": "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM / Độc lập - Tự do - Hạnh phúc\nHà Nội, ngày 27 tháng 11 năm 2026\nĐƠN XIN THAM GIA CÂU LẠC BỘ BÓNG ĐÁ",
        "body": [
          "Kính gửi: Ban chủ nhiệm Câu lạc bộ Bóng đá trường Tiểu học Chu Văn An.",
          "Em tên là: Nguyễn Minh An. Sinh ngày: 15/05/2016. Học sinh lớp: 4A1.",
          "Lí do: Em rất đam mê môn bóng đá và muốn rèn luyện sức khỏe cùng tinh thần thể thao.",
          "Lời hứa: Em xin hứa tham gia sinh hoạt đầy đủ, chấp hành nghiêm túc nội quy của Câu lạc bộ."
        ],
        "conclusion": "Em xin chân thành cảm ơn!\nNgười làm đơn: (Kí tên) Nguyễn Minh An."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "kính gửi",
          "chân thành cảm ơn",
          "nghiêm túc",
          "nội quy",
          "nguyện vọng"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng mục đích của đề bài?",
        "Đầy đủ các phần bắt buộc của lá đơn?",
        "Thông tin cá nhân chính xác, lí do thuyết phục?",
        "Trình bày đúng thể thức, ít lỗi chính tả?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nĐƠN XIN NGHỈ HỌC"
    },
    "suggestedRubricSummary": [
      "Đúng mục đích đề bài yêu cầu",
      "Đủ thành phần quy chuẩn của lá đơn",
      "Thông tin rõ ràng, lí do chính đáng",
      "Trình bày đúng thể thức, sạch đẹp"
    ]
  },
  {
    "id": "kntt-hk1-t14-b25",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 14, Bài 25, tr. 113 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 14,
    "lessonNumber": 25,
    "sgkPage": 113,
    "stage": "Tìm hiểu kiểu bài",
    "learningObjectives": "Nhận biết bố cục và các cách triển khai bài văn miêu tả con vật.",
    "title": "Tìm hiểu cách viết bài văn miêu tả con vật",
    "prompt": "Đọc bài văn mẫu miêu tả con vật trong SGK trang 113. Phân tích bố cục 3 phần, tìm hiểu các cách mở bài, cách chọn lọc chi tiết ngoại hình, hoạt động nổi bật và cách bộc lộ tình cảm gắn bó với con vật.",
    "genre": "mieu-ta-con-vat",
    "genreLabel": "Miêu tả con vật",
    "level": "bai",
    "topic": "Miêu tả con vật",
    "targetWords": 180,
    "lessonReference": "Tuần 14 - Bài 25 (trang 113, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 63,
    "createdAt": "01/12/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Bài văn tả con vật gì? Người viết miêu tả con vật theo trình tự nào?",
        "targetGenre": "Bài văn miêu tả con vật",
        "keyElements": [
          "Phân tích bài mẫu; tìm mở bài, thân bài và kết bài",
          "Ghi các đặc điểm ngoại hình, hoạt động và chi tiết đáng nhớ",
          "Chọn trình tự miêu tả phù hợp; hoàn thành sơ đồ bài văn"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Dáng vẻ con vật lúc vui đùa, màu sắc bộ lông, dáng đi nhanh nhẹn",
          "sound": "Tiếng kêu thân quen mỗi khi chủ về",
          "emotion": "Cảm xúc yêu mến, ấm áp khi gần gũi với thú cưng"
        },
        "guidingQuestions": [
          "Thân bài được chia làm mấy đoạn (tả ngoại hình, tả hoạt động)?",
          "Có những hình ảnh so sánh hoặc nhân hóa nào đặc sắc?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài: Giới thiệu con vật định tả (hoàn cảnh có con vật hoặc tình cảm yêu mến).",
        "body": [
          "Tả ngoại hình: Bộ lông, đôi mắt, đôi tai, bốn chân, cái đuôi.",
          "Tả hoạt động & thói quen: Khi ăn uống, lúc săn mồi, khi đùa nghịch cùng em."
        ],
        "conclusion": "Kết bài: Nêu vị trí của con vật trong gia đình và tình cảm yêu thương của em."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "tinh nhanh",
          "mượt mà",
          "ngộ nghĩnh",
          "thoăn thoắt",
          "thông minh"
        ],
        "comparisons": [
          "Cái đuôi cong cong như một dấu hỏi ngộ nghĩnh."
        ],
        "personifications": [
          "Chú mèo như một đứa trẻ con thích được vuốt ve, chiều chuộng."
        ]
      },
      "step5Checklist": [
        "Bố cục 3 phần đúng quy chuẩn?",
        "Chi tiết chọn lọc tiêu biểu, tránh liệt kê dàn trải?",
        "Trình tự miêu tả dễ theo dõi, sinh động?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Nhà em nuôi nhiều con vật, nhưng thân thiết nhất với em là chú chó Vàng thông minh và trung thành."
    },
    "suggestedRubricSummary": [
      "Bố cục đúng 3 phần của bài miêu tả",
      "Chi tiết tiêu biểu, giàu sức gợi",
      "Trình tự quan sát và miêu tả hợp lí"
    ]
  },
  {
    "id": "kntt-hk1-t14-b26",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 14, Bài 26, tr. 116 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 14,
    "lessonNumber": 26,
    "sgkPage": 116,
    "stage": "Quan sát / thu thập ý",
    "learningObjectives": "Biết quan sát có mục đích và ghi chép chi tiết phục vụ bài văn.",
    "title": "Quan sát con vật",
    "prompt": "Quan sát kĩ một con vật em yêu thích bằng nhiều giác quan (nhìn, nghe, chạm). Ghi chép vào bảng quan sát các đặc điểm nổi bật về hình dáng, màu sắc, từng bộ phận và những cử chỉ, thói quen sinh hoạt đáng yêu của nó.",
    "genre": "mieu-ta-con-vat",
    "genreLabel": "Miêu tả con vật",
    "level": "doan",
    "topic": "Kĩ năng quan sát con vật",
    "targetWords": 80,
    "lessonReference": "Tuần 14 - Bài 26 (trang 116, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 48,
    "createdAt": "04/12/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Quan sát con vật cần chú ý những gì? Làm sao để không nhầm lẫn với suy đoán viển vông?",
        "targetGenre": "Kĩ năng quan sát và ghi chép",
        "keyElements": [
          "Xác định mục tiêu quan sát và các khía cạnh cần chú ý",
          "Ghi hình dáng, màu sắc, bộ phận, hoạt động, tiếng kêu, thói quen",
          "Phân nhóm ghi chép theo ngoại hình, hoạt động và cảm nghĩ"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Màu lông vàng óng như tơ, bốn chân thon dài với đệm thịt êm ái",
          "sound": "Tiếng gừ gừ nhè nhẹ trong cổ họng khi khoan khoái",
          "touch": "Lông mềm mịn mát rượi dưới lòng bàn tay",
          "emotion": "Yêu thương, vui vẻ khi ngắm nhìn bạn nhỏ"
        },
        "guidingQuestions": [
          "Điểm nổi bật nhất ở bộ phận nào khiến em thích thú?",
          "Lúc chơi đùa với em, con vật có những cử chỉ đáng yêu nào?"
        ]
      },
      "step3Outline": {
        "introduction": "Tên con vật được quan sát: Chú cún Bông trắng.",
        "body": [
          "Ngoại hình: To bằng quả dưa hấu, lông xoăn tít màu sữa, mắt đen láy như hạt nhãn.",
          "Hoạt động: Ngoáy tít đuôi chạy ra cổng đón em mỗi chiều tan học."
        ],
        "conclusion": "Cảm nhận: Bông là niềm vui nhỏ bé mỗi ngày của em."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "xoăn tít",
          "đen láy",
          "ngoáy tít",
          "mềm mịn",
          "nhí nhảnh"
        ],
        "comparisons": [
          "Đôi mắt tròn xoe như hai hạt cườm đen láy."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Ghi chép cụ thể dựa trên quan sát thực tế?",
        "Đa dạng chi tiết ngoại hình và hành động?",
        "Chi tiết chọn lọc nổi bật, phù hợp đối tượng?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Bảng quan sát: Chú gà trống thiến nhà ngoại - Mào đỏ cờ, lông tơ óng ả như dát vàng."
    },
    "suggestedRubricSummary": [
      "Ghi chép cụ thể, chân thực từ quan sát",
      "Đa dạng chi tiết từ ngoại hình đến hoạt động",
      "Lựa chọn được các đặc điểm nổi bật nhất"
    ]
  },
  {
    "id": "kntt-hk1-t15-b27",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 15, Bài 27, tr. 120 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 15,
    "lessonNumber": 27,
    "sgkPage": 120,
    "stage": "Luyện viết",
    "learningObjectives": "Viết đoạn miêu tả tập trung vào một đặc điểm hoặc hoạt động.",
    "title": "Luyện viết đoạn văn miêu tả con vật",
    "prompt": "Chọn một trong hai yêu cầu: (1) Viết đoạn văn (4 - 5 câu) miêu tả ngoại hình nổi bật của một con vật em yêu thích; (2) Viết đoạn văn miêu tả một hoạt động hoặc thói quen đáng yêu của con vật đó.",
    "genre": "mieu-ta-con-vat",
    "genreLabel": "Miêu tả con vật",
    "level": "doan",
    "topic": "Luyện viết đoạn tả con vật",
    "targetWords": 85,
    "lessonReference": "Tuần 15 - Bài 27 (trang 120, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 78,
    "createdAt": "08/12/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đoạn văn này em chọn tả ngoại hình hay hoạt động? Câu mở đoạn cần giới thiệu điều gì?",
        "targetGenre": "Đoạn văn miêu tả con vật",
        "keyElements": [
          "Ôn cách chọn từ ngữ gợi tả và trình tự quan sát",
          "Chọn các chi tiết tốt nhất từ bảng quan sát",
          "Sắp xếp chi tiết từ khái quát đến cụ thể; viết đoạn văn"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Dáng chú gà trống vỗ cánh gáy vang đón ban mai, đôi cánh cứng cáp xòe rộng",
          "sound": "Tiếng gáy 'ò ó o' vang lừng đánh thức cả xóm làng",
          "emotion": "Trầm trồ trước vẻ oai vệ, dũng mãnh"
        },
        "guidingQuestions": [
          "Từ ngữ gợi tả nào làm nổi bật dáng vẻ của con vật?",
          "Có thể so sánh tiếng gáy hay cử chỉ của nó với điều gì?"
        ]
      },
      "step3Outline": {
        "introduction": "Câu mở đoạn: Chú gà trống nhà em có dáng vẻ vô cùng oai vệ.",
        "body": [
          "Câu 2: Toàn thân chú khoác bộ lông sặc sỡ, óng ánh sắc màu như chiếc áo choàng của hiệp sĩ.",
          "Câu 3: Chiếc mào đỏ rực như vương miện kiêu hãnh trên đỉnh đầu.",
          "Câu 4: Đôi chân vàng óng, cứng cáp với chiếc cựa nhọn hoắt."
        ],
        "conclusion": "Câu kết: Mỗi buổi sớm, chú nhảy tót lên đống rơm cất tiếng gáy vang lừng chào ngày mới."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "oai vệ",
          "sặc sỡ",
          "đỏ rực",
          "kiêu hãnh",
          "nhọn hoắt"
        ],
        "comparisons": [
          "Bộ lông sặc sỡ như chiếc áo choàng của chàng hiệp sĩ.",
          "Chiếc mào đỏ rực như chiếc vương miện tí hon."
        ],
        "personifications": [
          "Chú đứng oai vệ như một người lính gác canh giữ bình yên cho xóm nhỏ."
        ]
      },
      "step5Checklist": [
        "Đoạn văn tập trung vào đối tượng miêu tả?",
        "Chi tiết rõ ràng, tránh câu liệt kê khô khan?",
        "Dùng từ ngữ gợi tả, câu văn mạch lạc, đúng chính tả?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Chú gà trống nhà em có dáng vẻ oai vệ chẳng khác nào một chàng dũng sĩ.",
      "goodBodyExcerpt": "Bộ lông chú óng mượt nhiều màu sắc xen kẽ, nổi bật nhất là chiếc đuôi uốn cong như cầu vồng rực rỡ. Đôi mắt tròn xoe, chiếc mào cờ đỏ chót lúc nào cũng rung rinh kiêu hãnh.",
      "goodConclusionExample": "Mỗi sớm mai, khi nghe tiếng gáy vang dội của chú, em lại hào hứng thức dậy chuẩn bị đến trường."
    },
    "suggestedRubricSummary": [
      "Tập trung miêu tả rõ nét đối tượng",
      "Chi tiết cụ thể, giàu hình ảnh gợi tả",
      "Dùng từ ngữ so sánh hoặc nhân hóa khéo léo",
      "Diễn đạt mạch lạc, câu văn liên kết tốt"
    ]
  },
  {
    "id": "kntt-hk1-t15-b28",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 15, Bài 28, tr. 123 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 15,
    "lessonNumber": 28,
    "sgkPage": 123,
    "stage": "Lập dàn ý",
    "learningObjectives": "Hoàn thiện dàn ý cho bài văn miêu tả con vật.",
    "title": "Lập dàn ý cho bài văn miêu tả con vật",
    "prompt": "Tổng hợp các kết quả quan sát và rèn luyện đoạn văn để hoàn chỉnh một dàn ý chi tiết 3 phần cho bài văn miêu tả con vật em yêu thích nhất, sẵn sàng cho bài viết trọn vẹn.",
    "genre": "mieu-ta-con-vat",
    "genreLabel": "Miêu tả con vật",
    "level": "bai",
    "topic": "Hoàn thiện dàn ý tả con vật",
    "targetWords": 160,
    "lessonReference": "Tuần 15 - Bài 28 (trang 123, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 53,
    "createdAt": "11/12/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Kiểm tra độ cân đối giữa các phần trong dàn ý: Mở bài - Ngoại hình - Hoạt động - Kết bài.",
        "targetGenre": "Dàn ý hoàn chỉnh bài văn tả con vật",
        "keyElements": [
          "Đối chiếu yêu cầu bài và sơ đồ bố cục chuẩn",
          "Chọn chi tiết tiêu biểu từ bảng quan sát",
          "Mở bài; thân bài theo trình tự; kết bài nêu tình cảm/suy nghĩ"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Gắn bó thân thiết, trân trọng sinh linh bé nhỏ"
        },
        "guidingQuestions": [
          "Các ý trong thân bài đã được sắp xếp cân đối giữa ngoại hình và hoạt động chưa?",
          "Hình ảnh nào làm nổi bật tính nết của con vật?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài gián tiếp: Dẫn dắt từ tình yêu động vật, giới thiệu chú chó Mực trung thành.",
        "body": [
          "1. Ngoại hình: Bộ lông đen nhánh như gỗ mun, đôi mắt sáng thông minh, bốn chân gân guốc.",
          "2. Hoạt động: Ban ngày nằm canh cổng, ban đêm tuần tra quanh nhà, tiếng sủa đanh thép xua đuổi kẻ lạ.",
          "3. Kỉ niệm: Lần Mực tìm thấy chiếc chìa khóa em đánh rơi trong vườn."
        ],
        "conclusion": "Kết bài mở rộng: Em xem Mực như một người bạn thân thiết, luôn chăm sóc Mực chu đáo."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "đen nhánh",
          "gân guốc",
          "đanh thép",
          "tinh khôn",
          "trung thành"
        ],
        "comparisons": [
          "Bộ lông đen nhánh óng ả như một tấm nhung mun."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Dàn ý đủ ba phần cân đối?",
        "Chọn đúng chi tiết tiêu biểu, không trùng lặp?",
        "Trình tự sắp xếp nhất quán, mạch lạc?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Dàn ý hoàn thiện: Bài văn miêu tả chú chó Mực thông minh giữ nhà."
    },
    "suggestedRubricSummary": [
      "Dàn ý đủ 3 phần cân đối, hoàn chỉnh",
      "Chọn đúng chi tiết ngoại hình và tính nết tiêu biểu",
      "Trình tự miêu tả nhất quán, giàu cảm xúc"
    ]
  },
  {
    "id": "kntt-hk1-t16-b29",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 16, Bài 29, tr. 128 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 16,
    "lessonNumber": 29,
    "sgkPage": 128,
    "stage": "Viết bài",
    "learningObjectives": "Viết bài văn miêu tả con vật dựa trên quan sát và dàn ý.",
    "title": "Viết bài văn miêu tả con vật",
    "prompt": "Dựa vào dàn ý đã hoàn thiện ở Bài 28, hãy viết bài văn hoàn chỉnh miêu tả con vật mà em yêu quý, làm nổi bật những đặc điểm ngoại hình đặc sắc, hoạt động ngộ nghĩnh và tình cảm gắn bó của em.",
    "genre": "mieu-ta-con-vat",
    "genreLabel": "Miêu tả con vật",
    "level": "bai",
    "topic": "Bài văn miêu tả con vật",
    "targetWords": 200,
    "lessonReference": "Tuần 16 - Bài 29 (trang 128, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 98,
    "createdAt": "15/12/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Viết bài văn hoàn chỉnh từ dàn ý, vận dụng so sánh và nhân hóa để con vật hiện lên sống động như có linh hồn.",
        "targetGenre": "Bài văn miêu tả con vật hoàn chỉnh",
        "keyElements": [
          "Nhắc lại tiêu chí bài văn miêu tả con vật",
          "Sử dụng dàn ý và bảng quan sát đã chuẩn bị",
          "Triển khai mở bài, thân bài, kết bài; kết hợp cảm xúc chân thực"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Ánh mắt thông minh, cái mũi ươn ướt, cái đuôi ngoáy tít mừng rỡ",
          "sound": "Tiếng sủa mừng rỡ, tiếng cào nhẹ vào cửa gọi chủ",
          "touch": "Bàn tay vuốt ve lớp lông mềm mượt, cảm giác ấm áp",
          "emotion": "Gắn bó tha thiết, yêu quý loài vật trung thành"
        },
        "guidingQuestions": [
          "Mở bài gián tiếp nào làm người đọc ấn tượng nhất?",
          "Chi tiết nào trong thân bài thể hiện rõ nhất tình cảm của con vật đối với em?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài gián tiếp: Dẫn dắt từ niềm vui có thú cưng, giới thiệu chú cún Mực.",
        "body": [
          "Đoạn 1: Tả ngoại hình từ bao quát (vóc dáng, màu lông) đến từng bộ phận (đôi mắt, hai tai, cái đuôi).",
          "Đoạn 2: Tả hoạt động thông minh: mừng rỡ đón chủ, canh giữ nhà cửa cẩn thận.",
          "Đoạn 3: Kỉ niệm đáng nhớ gắn bó giữa em và chú cún."
        ],
        "conclusion": "Kết bài mở rộng: Khẳng định tình cảm yêu quý, lời hứa luôn chăm sóc chú cún thật tốt."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "đen nhánh",
          "óng ả",
          "tinh khôn",
          "mừng rỡ",
          "trung thành"
        ],
        "comparisons": [
          "Bộ lông đen nhánh óng ả như một tấm thảm nhung mun mịn màng.",
          "Đôi mắt sáng lấp lánh như hai vì sao nhỏ trong đêm tối."
        ],
        "personifications": [
          "Mực vui sướng vẫy tít cái đuôi như muốn reo lên lời chào mừng em về nhà."
        ]
      },
      "step5Checklist": [
        "Bài văn đúng đề, đặc điểm con vật hiện lên rõ nét?",
        "Trình tự miêu tả hợp lí từ ngoại hình đến hoạt động?",
        "Có dùng biện pháp so sánh và nhân hóa gợi cảm?",
        "Chính tả sạch đẹp, không mắc lỗi câu?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Mỗi ngày đi học về, niềm vui lớn nhất của em là được nhìn thấy chú cún Mực chạy lon ton ra tận cổng đón chào.",
      "goodBodyExcerpt": "Mực khoác lên mình bộ lông đen tuyền óng ả như tơ mun. Đôi tai chú vểnh lên nghe ngóng từng tiếng động nhỏ. Mỗi khi em gọi 'Mực ơi!', chú liền ngoáy tít cái đuôi ngắn củn, chồm hai chân trước lên đầu gối em làm nũng như một đứa trẻ thơ.",
      "goodConclusionExample": "Mực không chỉ là người lính gác trung thành của gia đình mà còn là người bạn tuổi thơ ấm áp của em. Em tự hứa sẽ luôn chăm sóc Mực chu đáo để chú luôn khỏe mạnh và gắn bó cùng em."
    },
    "suggestedRubricSummary": [
      "Đúng yêu cầu đề bài, bố cục 3 phần rõ ràng",
      "Đặc điểm con vật hiện lên sống động, chân thực",
      "Sử dụng sáng tạo biện pháp so sánh và nhân hóa",
      "Ngôn ngữ sinh động, cảm xúc trong sáng"
    ]
  },
  {
    "id": "kntt-hk1-t16-b30",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 16, Bài 30, tr. 131 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 16,
    "lessonNumber": 30,
    "sgkPage": 131,
    "stage": "Trả bài / chỉnh sửa",
    "learningObjectives": "Cải thiện bài văn miêu tả từ phản hồi.",
    "title": "Trả bài văn miêu tả con vật",
    "prompt": "Đọc kĩ nhận xét của thầy cô hoặc gợi mở của AI về bài văn miêu tả con vật của em. Xác định các lỗi về dùng từ, lỗi câu liệt kê hoặc thiếu hình ảnh so sánh để chỉnh sửa lại từng đoạn cho sinh động hơn.",
    "genre": "mieu-ta-con-vat",
    "genreLabel": "Miêu tả con vật",
    "level": "bai",
    "topic": "Chỉnh sửa bài tả con vật",
    "targetWords": 180,
    "lessonReference": "Tuần 16 - Bài 30 (trang 131, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 40,
    "createdAt": "18/12/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Nhận xét của thầy cô chỉ ra điểm nào em làm tốt? Điểm nào cần tả chi tiết hơn?",
        "targetGenre": "Kĩ năng hoàn thiện bài văn miêu tả",
        "keyElements": [
          "Đọc nhận xét theo bố cục, nội dung và diễn đạt",
          "Xác định chi tiết còn chung chung, thiếu hoặc lặp",
          "Ưu tiên sửa nội dung, trình tự, từ ngữ rồi chính tả; viết lại phần cần cải thiện"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Tự giác sửa sai, trau chuốt câu chữ để tiến bộ"
        },
        "guidingQuestions": [
          "Đoạn tả hoạt động đã có từ ngữ gợi tả chuyển động chưa?",
          "Hình ảnh so sánh đã thật sự chính xác và tự nhiên chưa?"
        ]
      },
      "step3Outline": {
        "introduction": "Xem xét mở bài: Đã dẫn dắt tự nhiên chưa?",
        "body": [
          "Sửa đoạn ngoại hình: Bổ sung từ gợi tả màu sắc, đường nét.",
          "Sửa đoạn hoạt động: Thay các câu liệt kê bằng câu có hình ảnh so sánh sinh động."
        ],
        "conclusion": "Nâng cấp kết bài: Bộc lộ tình cảm gắn bó sâu sắc hơn."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "trau chuốt",
          "sinh động",
          "tự nhiên",
          "sâu sắc",
          "biểu cảm"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Sửa đúng vấn đề được thầy cô góp ý?",
        "Miêu tả cụ thể hơn, tránh lối viết khô khan?",
        "Diễn đạt mạch lạc, giàu cảm xúc?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Bản sửa: Em đã thay câu 'Mèo có bộ lông đẹp' bằng câu 'Miu khoác lên mình bộ lông trắng muốt xen vàng cam mềm mại như tơ'."
    },
    "suggestedRubricSummary": [
      "Sửa đúng trọng tâm vấn đề được góp ý",
      "Miêu tả cụ thể hơn, có thêm từ ngữ gợi tả",
      "Diễn đạt mạch lạc, cảm xúc sâu sắc"
    ]
  },
  {
    "id": "kntt-hk1-t17-b31",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 17, Bài 31, tr. 134 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 17,
    "lessonNumber": 31,
    "sgkPage": 134,
    "stage": "Tìm hiểu kiểu văn bản",
    "learningObjectives": "Nhận biết mục đích, cấu trúc và cách xưng hô trong thư.",
    "title": "Tìm hiểu cách viết thư",
    "prompt": "Đọc bức thư mẫu trong SGK trang 134. Nhận diện các phần của bức thư: Phần đầu (Địa điểm ngày tháng, lời xưng hô), Phần chính (Hỏi thăm sức khỏe, kể về tình hình bản thân, chia sẻ tin vui) và Phần cuối (Lời chúc, lời hứa, chữ kí và họ tên).",
    "genre": "viet-don",
    "genreLabel": "Viết thư",
    "level": "doan",
    "topic": "Cách viết thư",
    "targetWords": 100,
    "lessonReference": "Tuần 17 - Bài 31 (trang 134, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": false,
    "usageCount": 57,
    "createdAt": "22/12/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Bức thư được viết gửi cho ai? Cách xưng hô trong thư thay đổi như thế nào tùy theo đối tượng nhận thư?",
        "targetGenre": "Văn bản giao tiếp: Bức thư",
        "keyElements": [
          "Đọc mẫu; xác định địa điểm/thời gian, lời xưng hô, nội dung, lời kết",
          "Xác định người nhận, mục đích và điều muốn chia sẻ",
          "Sắp xếp nội dung theo các phần của bức thư; hoàn thành phiếu nhận diện"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Bố cục bức thư trang trọng nhưng gần gũi, ấm áp",
          "emotion": "Tình cảm chân thành, nỗi nhớ thương và sự quan tâm sâu sắc"
        },
        "guidingQuestions": [
          "Viết thư cho ông bà cần dùng từ xưng hô lễ phép như thế nào (Kính mến, Kính thương...)?",
          "Viết thư cho bạn bè thì lời xưng hô sẽ thân mật ra sao (Thân mến, Yêu quý...)?"
        ]
      },
      "step3Outline": {
        "introduction": "Phần đầu: Địa điểm và ngày tháng năm viết thư. Lời xưng hô đầu thư (Ông bà kính mến / Bạn Lan thân mến).",
        "body": [
          "Mục 1: Lời thăm hỏi sức khỏe, cuộc sống của người nhận thư.",
          "Mục 2: Báo tin về tình hình học tập, sức khỏe của bản thân và gia đình.",
          "Mục 3: Chia sẻ một kỉ niệm hoặc tin vui đáng nhớ."
        ],
        "conclusion": "Phần cuối: Lời chúc tốt đẹp, lời chào, chữ kí và họ tên người viết."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "kính mến",
          "thân mến",
          "nhớ thương",
          "ấm áp",
          "mong đợi"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng cấu trúc 3 phần của bức thư?",
        "Cách xưng hô phù hợp với người nhận thư?",
        "Nội dung thăm hỏi và báo tin rõ ràng, chân thực?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Hà Nội, ngày 22 tháng 12 năm 2026\nÔng bà kính yêu của cháu,"
    },
    "suggestedRubricSummary": [
      "Đúng cấu trúc quy chuẩn của bức thư",
      "Xưng hô phù hợp, lễ phép hoặc thân mật",
      "Nội dung tình cảm chân thực, tự nhiên"
    ]
  },
  {
    "id": "kntt-hk1-t17-b32",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập một, Tuần 17, Bài 32, tr. 137 (KNTT)",
    "bookVolume": "tap1",
    "semester": "hk1",
    "week": 17,
    "lessonNumber": 32,
    "sgkPage": 137,
    "stage": "Viết văn bản giao tiếp",
    "learningObjectives": "Viết được bức thư phù hợp với người nhận và mục đích.",
    "title": "Viết thư",
    "prompt": "Hãy viết một bức thư gửi cho người thân ở xa (ông bà, cô chú) hoặc gửi một người bạn cũ để thăm hỏi sức khỏe, kể về tình hình học tập của em trong học kì vừa qua và gửi những lời chúc tốt lành nhân dịp năm mới.",
    "genre": "viet-don",
    "genreLabel": "Viết thư",
    "level": "bai",
    "topic": "Thực hành viết thư",
    "targetWords": 150,
    "lessonReference": "Tuần 17 - Bài 32 (trang 137, SGK Tiếng Việt 4 KNTT)",
    "isFeatured": true,
    "usageCount": 93,
    "createdAt": "25/12/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Người nhận thư của em ở đâu? Em muốn chia sẻ những tin vui nào về kết quả học kì 1?",
        "targetGenre": "Bức thư hoàn chỉnh",
        "keyElements": [
          "Nhắc lại cấu trúc và yêu cầu viết thư",
          "Ghi người nhận, mục đích và các nội dung muốn trao đổi",
          "Sắp xếp lời mở đầu, nội dung chính và lời kết; viết thư hoàn chỉnh"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Hình dung gương mặt rạng rỡ của ông bà hoặc nụ cười của bạn khi mở lá thư",
          "emotion": "Ấm lòng khi gửi gắm tâm tình qua từng con chữ nắn nót"
        },
        "guidingQuestions": [
          "Lời chúc cuối thư có phù hợp với dịp lễ tết hoặc năm mới không?",
          "Em có lời hứa sẽ về thăm quê vào kì nghỉ tới không?"
        ]
      },
      "step3Outline": {
        "introduction": "Hà Nội, ngày 25 tháng 12 năm 2026\nÔng bà kính yêu của cháu,",
        "body": [
          "Dạo này sức khỏe của ông bà có tốt không ạ? Những cơn gió lạnh đầu đông đã về, ông bà nhớ mặc ấm nhé.",
          "Cháu xin báo với ông bà tin vui: Học kì 1 vừa rồi cháu đã đạt danh hiệu Học sinh Xuất sắc và được khen thưởng môn Tiếng Việt.",
          "Cả nhà cháu vẫn khỏe. Bố mẹ cháu vừa gửi biếu ông bà ít trà thơm."
        ],
        "conclusion": "Năm mới sắp đến, cháu kính chúc ông bà luôn dồi dào sức khỏe, sống lâu trăm tuổi. Cháu hứa dịp Tết Nguyên đán sẽ về quê sum vầy cùng ông bà.\nCháu ngoan của ông bà,\n(Kí tên) Nguyễn Minh An."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "kính chúc",
          "sum vầy",
          "ấm áp",
          "dồi dào",
          "tự hào"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng mục đích thăm hỏi và chia sẻ tin vui?",
        "Cấu trúc thư rõ ràng, lời xưng hô đúng mực?",
        "Mạch lạc, tình cảm chân thành, không sai lỗi chính tả?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Hà Nội, ngày 25 tháng 12 năm 2026\nÔng bà nội kính mến của cháu,\nĐã lâu rồi cháu chưa có dịp về quê thăm ông bà. Hôm nay, sau khi kết thúc kì thi học kì 1, cháu nắn nót viết lá thư này gửi về thăm ông bà ạ."
    },
    "suggestedRubricSummary": [
      "Đúng mục đích giao tiếp của bức thư",
      "Nội dung phong phú, giàu tình cảm",
      "Cấu trúc thư hoàn chỉnh, xưng hô chính xác",
      "Trình bày sạch sẽ, đúng quy cách"
    ]
  },
  {
    "id": "kntt-hk2-t19-b01",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 19, Bài 1, tr. 10 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 19,
    "lessonNumber": 1,
    "sgkPage": 10,
    "stage": "Tìm hiểu kiểu bài",
    "learningObjectives": "Nhận biết cách thể hiện tình cảm, cảm xúc qua đoạn văn có bố cục rõ.",
    "title": "Tìm hiểu cách viết đoạn văn nêu tình cảm, cảm xúc",
    "prompt": "Đọc đoạn văn mẫu trong SGK Tập hai trang 10. Phân tích cấu trúc 3 phần (Mở đầu, Triển khai, Kết thúc), nhận diện các từ ngữ biểu cảm và chỉ ra chi tiết cụ thể khiến người viết xúc động.",
    "genre": "doan-van-tinh-cam",
    "genreLabel": "Đoạn văn nêu tình cảm, cảm xúc",
    "level": "doan",
    "topic": "Tình cảm & Cảm xúc",
    "targetWords": 80,
    "lessonReference": "Tuần 19 - Bài 1 (trang 10, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": true,
    "usageCount": 75,
    "createdAt": "05/01/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đoạn văn bày tỏ tình cảm với ai hoặc điều gì? Những từ ngữ nào bộc lộ trực tiếp cảm xúc?",
        "targetGenre": "Đoạn văn nêu tình cảm, cảm xúc",
        "keyElements": [
          "Đọc mẫu; xác định mở đầu, triển khai, kết thúc và từ ngữ biểu cảm",
          "Xác định đối tượng được bày tỏ tình cảm và chi tiết gây xúc động",
          "Lập khung: giới thiệu đối tượng → chi tiết/cảm xúc → khẳng định tình cảm"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Nghẹn ngào, ấm áp, biết ơn, kính yêu người thân yêu"
        },
        "guidingQuestions": [
          "Cảm xúc có được gắn liền với một hành động hoặc kỉ niệm cụ thể không?",
          "Từ ngữ biểu cảm nào làm câu văn lay động lòng người?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở đầu: Giới thiệu đối tượng (ông bà, cha mẹ, thầy cô) và tình cảm khái quát.",
        "body": [
          "Chi tiết 1: Hành động chăm sóc, yêu thương của người đó dành cho em.",
          "Chi tiết 2: Kỉ niệm xúc động khiến em nhớ mãi."
        ],
        "conclusion": "Kết thúc: Khẳng định tình cảm bền chặt và mong ước tốt lành."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "ấm áp",
          "bao la",
          "dạt dào",
          "kính yêu",
          "khôn nguôi"
        ],
        "comparisons": [
          "Tình cảm của mẹ dành cho em bao la như biển thái bình."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng kiểu bài nêu tình cảm, cảm xúc?",
        "Cảm xúc chân thực, có gắn với chi tiết cụ thể?",
        "Bố cục 3 phần rõ ràng, mạch lạc?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Trong gia đình, bà ngoại là người luôn dành cho em tình thương yêu ấm áp và bao la nhất."
    },
    "suggestedRubricSummary": [
      "Đúng kiểu bài nêu tình cảm, cảm xúc",
      "Cảm xúc chân thực, bộc lộ rõ ràng",
      "Có chi tiết cụ thể gắn với cảm xúc",
      "Bố cục hợp lí, mạch lạc"
    ]
  },
  {
    "id": "kntt-hk2-t19-b02",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 19, Bài 2, tr. 14 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 19,
    "lessonNumber": 2,
    "sgkPage": 14,
    "stage": "Tìm ý",
    "learningObjectives": "Lựa chọn kỉ niệm, lời nói hoặc việc làm thể hiện tình cảm với một người.",
    "title": "Tìm ý cho đoạn văn nêu tình cảm, cảm xúc về một người gần gũi, thân thiết",
    "prompt": "Chọn một người thân thiết mà em luôn kính trọng, yêu quý (bố mẹ, ông bà, anh chị hoặc thầy cô). Lập phiếu tìm ý ghi lại kỉ niệm đáng nhớ, lời nói hoặc cử chỉ ân cần khiến em xúc động nhất.",
    "genre": "doan-van-tinh-cam",
    "genreLabel": "Đoạn văn nêu tình cảm, cảm xúc",
    "level": "doan",
    "topic": "Tìm ý tình cảm người thân",
    "targetWords": 80,
    "lessonReference": "Tuần 19 - Bài 2 (trang 14, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 49,
    "createdAt": "08/01/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Em muốn bày tỏ cảm xúc với ai? Kỉ niệm nào nổi bật nhất giữa em và người ấy?",
        "targetGenre": "Kĩ năng tìm ý đoạn văn tình cảm",
        "keyElements": [
          "Phân tích gợi ý trong SGK về người gần gũi, thân thiết",
          "Ghi người muốn viết, kỉ niệm, việc làm đáng nhớ và cảm xúc của em",
          "Sắp xếp ý thành mở đầu, triển khai, kết thúc; hoàn thành phiếu tìm ý"
        ]
      },
      "step2Observation": {
        "senses": {
          "touch": "Bàn tay chai sần ấm áp của bố khi dắt em qua đường, nụ hôn dịu dàng của mẹ",
          "sound": "Giọng nói trìu mến dặn dò từng bài học",
          "emotion": "Xúc động, biết ơn sâu nặng"
        },
        "guidingQuestions": [
          "Một việc làm nhỏ nhưng chứa chan tình yêu thương của người đó là gì?",
          "Lúc đó em cảm thấy như thế nào trong lòng?"
        ]
      },
      "step3Outline": {
        "introduction": "Người muốn viết: Bố của em.",
        "body": [
          "Kỉ niệm: Đêm em bị sốt cao, bố thức trắng đêm chườm trán và canh giấc ngủ cho em.",
          "Cảm xúc: Thương bố vất vả, thấy mình may mắn khi có bố chở che."
        ],
        "conclusion": "Khẳng định: Bố là điểm tựa vững chãi nhất trong cuộc đời em."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "tần tảo",
          "vững chãi",
          "chở che",
          "ấm áp",
          "thao thức"
        ],
        "comparisons": [
          "Tình thương của bố như núi cao che chở cho em từng bước trưởng thành."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Đối tượng rõ ràng, thân thiết?",
        "Chi tiết chọn lọc chân thực, tránh kể lan man việc không liên quan?",
        "Ý được sắp xếp tuần tự theo cảm xúc tăng dần?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Phiếu tìm ý: Viết về bố - Kỉ niệm đêm bố thức trắng chăm em ốm - Cảm xúc: Biết ơn vô bờ."
    },
    "suggestedRubricSummary": [
      "Đối tượng rõ ràng, tình cảm trong sáng",
      "Có chi tiết cụ thể, chân thực, xúc động",
      "Cảm xúc phù hợp, ý có trình tự logic"
    ]
  },
  {
    "id": "kntt-hk2-t20-b03",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 20, Bài 3, tr. 19 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 20,
    "lessonNumber": 3,
    "sgkPage": 19,
    "stage": "Viết bài",
    "learningObjectives": "Viết đoạn văn bày tỏ tình cảm chân thực về người gần gũi.",
    "title": "Viết đoạn văn nêu tình cảm, cảm xúc về một người gần gũi, thân thiết",
    "prompt": "Dựa vào phiếu tìm ý đã lập ở Bài 2, hãy viết đoạn văn (từ 5 đến 7 câu) bày tỏ tình cảm, cảm xúc chân thực của em đối với một người thân gần gũi, thân thiết trong gia đình hoặc trường học.",
    "genre": "doan-van-tinh-cam",
    "genreLabel": "Đoạn văn nêu tình cảm, cảm xúc",
    "level": "doan",
    "topic": "Tình cảm người thân",
    "targetWords": 90,
    "lessonReference": "Tuần 20 - Bài 3 (trang 19, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": true,
    "usageCount": 97,
    "createdAt": "12/01/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Viết bằng lời văn tha thiết của chính em, kết hợp từ ngữ biểu cảm và dẫn chứng cụ thể.",
        "targetGenre": "Đoạn văn nêu tình cảm hoàn chỉnh",
        "keyElements": [
          "Ôn yêu cầu và bố cục đoạn văn biểu cảm",
          "Dùng phiếu tìm ý và kỉ niệm đã chọn",
          "Giới thiệu người → chi tiết xúc động → khẳng định tình cảm"
        ]
      },
      "step2Observation": {
        "senses": {
          "touch": "Bàn tay gầy guộc của bà quạt mát cho em ngủ trưa",
          "sound": "Tiếng hát ru à ơi tha thiết",
          "emotion": "Bồi hồi, yêu thương, lòng tràn đầy lòng biết ơn"
        },
        "guidingQuestions": [
          "Câu mở đoạn đã làm toát lên tình cảm đặc biệt với người đó chưa?",
          "Chi tiết nào khiến người đọc cùng rung động với em?"
        ]
      },
      "step3Outline": {
        "introduction": "Câu 1: Trong gia đình, người mà em luôn dành tình cảm yêu kính nhất là bà ngoại.",
        "body": [
          "Câu 2 - 3: Bà đã ngoài bảy mươi tuổi, mái tóc bạc phơ như mây trắng và nụ cười hiền hậu.",
          "Câu 4 - 5: Em nhớ nhất những trưa hè oi ả, bà ngồi bên cánh võng, tay phe phẩy chiếc quạt nan đưa em vào giấc ngủ êm đềm."
        ],
        "conclusion": "Câu 6 - 7: Em yêu bà nhiều lắm và tự nhủ sẽ luôn chăm ngoan để bà vui lòng, sống lâu trăm tuổi."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "hiền từ",
          "bạc phơ",
          "êm đềm",
          "ấm áp",
          "thiêng liêng"
        ],
        "comparisons": [
          "Mái tóc bà trắng bồng bềnh như đám mây mùa thu.",
          "Bà hiền từ như một bà tiên bước ra từ câu chuyện cổ tích."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng dung lượng 5 - 7 câu?",
        "Cảm xúc chân thực, tránh kể chung chung?",
        "Có chi tiết minh họa và từ ngữ biểu cảm lay động?",
        "Mạch lạc, không sai chính tả?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Trong gia đình, bà ngoại là người em yêu thương và gắn bó nhất từ thuở lọt lòng.",
      "goodBodyExcerpt": "Bà có đôi mắt hiền từ và nụ cười ấm áp như ánh nắng sớm mai. Em nhớ mãi những đêm đông giá rét, bà cẩn thận kéo chăn đắp kín cho em rồi khẽ xoa lưng ru em ngủ. Bàn tay bà chai sần theo năm tháng nhưng luôn đem lại cho em cảm giác bình yên đến lạ kì.",
      "goodConclusionExample": "Tình thương của bà là dòng suối mát lành nuôi dưỡng tâm hồn em. Em thầm mong bà mãi luôn khỏe mạnh để đồng hành cùng em trên mỗi bước đường khôn lớn."
    },
    "suggestedRubricSummary": [
      "Cảm xúc chân thực, sâu sắc",
      "Có chi tiết cụ thể, sinh động minh họa",
      "Hành văn mạch lạc, giàu từ ngữ biểu cảm",
      "Đúng chính tả và quy chuẩn đoạn văn"
    ]
  },
  {
    "id": "kntt-hk2-t20-b04",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 20, Bài 4, tr. 22 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 20,
    "lessonNumber": 4,
    "sgkPage": 22,
    "stage": "Tìm ý",
    "learningObjectives": "Chọn nhân vật và dẫn chứng từ tác phẩm để bày tỏ cảm xúc.",
    "title": "Tìm ý cho đoạn văn nêu tình cảm, cảm xúc về một nhân vật trong văn học",
    "prompt": "Chọn một nhân vật trong các bài đọc em đã học (như bạn nhỏ trong 'Cây táo yêu thương', chú bé Lượm, cô bé xé cánh hoa cúc, Dế Mèn...). Lập bảng ghi lại tên nhân vật, hành động/lời nói ấn tượng và cảm xúc của em.",
    "genre": "doan-van-tinh-cam",
    "genreLabel": "Đoạn văn nêu tình cảm, cảm xúc",
    "level": "doan",
    "topic": "Tìm ý nhân vật văn học",
    "targetWords": 80,
    "lessonReference": "Tuần 20 - Bài 4 (trang 22, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 52,
    "createdAt": "15/01/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Nhân vật văn học nào để lại ấn tượng sâu đậm nhất trong lòng em? Chi tiết nào chứng minh cho phẩm chất đó?",
        "targetGenre": "Kĩ năng tìm ý cảm xúc về nhân vật",
        "keyElements": [
          "Nhắc lại nhân vật, sự việc và đặc điểm trong tác phẩm đã học",
          "Ghi tên nhân vật, hành động/lời nói/chi tiết gây ấn tượng và cảm xúc",
          "Sắp xếp: giới thiệu nhân vật → đặc điểm/chi tiết → cảm xúc"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Cảm phục lòng dũng cảm, sự hiếu thảo hay đức tính trung thực của nhân vật"
        },
        "guidingQuestions": [
          "Hành động dũng cảm hoặc cử chỉ hiếu thảo nào của nhân vật làm em rơi nước mắt?",
          "Từ ngữ nào chính xác để miêu tả phẩm chất đó?"
        ]
      },
      "step3Outline": {
        "introduction": "Nhân vật: Chú bé Lượm trong bài thơ cùng tên của Tố Hữu.",
        "body": [
          "Chi tiết: Dáng đi thoăn thoắt, cái đầu nghênh nghênh, dũng cảm vượt qua làn đạn để chuyển thư thượng khẩn.",
          "Cảm xúc: Khâm phục tinh thần yêu nước bất khuất của chú bé liên lạc nhí."
        ],
        "conclusion": "Hình ảnh Lượm sống mãi như một đóa sen ngát hương tuổi trẻ."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "thoăn thoắt",
          "nghênh nghênh",
          "quả cảm",
          "bất khuất",
          "tự hào"
        ],
        "comparisons": [
          "Chú bé nhấp nhô trên đồng lúa vàng như cánh chim én nhỏ."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Chi tiết chọn lọc chính xác từ tác phẩm?",
        "Cảm xúc phù hợp, không suy đoán nhầm lẫn?",
        "Ý kiến đưa ra có căn cứ vững chắc?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Phiếu tìm ý: Nhân vật Lượm - Chi tiết dũng cảm chuyển thư qua bom đạn - Cảm xúc: Tự hào và cảm phục."
    },
    "suggestedRubricSummary": [
      "Chi tiết chính xác từ tác phẩm văn học",
      "Cảm xúc phù hợp, có căn cứ rõ ràng",
      "Không nhầm lẫn giữa các nhân vật"
    ]
  },
  {
    "id": "kntt-hk2-t21-b05",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 21, Bài 5, tr. 27 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 21,
    "lessonNumber": 5,
    "sgkPage": 27,
    "stage": "Viết bài",
    "learningObjectives": "Viết đoạn văn nêu cảm xúc về nhân vật, có dẫn chi tiết phù hợp.",
    "title": "Viết đoạn văn nêu tình cảm, cảm xúc về một nhân vật trong văn học",
    "prompt": "Dựa vào phiếu tìm ý ở Bài 4, hãy viết đoạn văn (từ 5 đến 7 câu) nêu cảm xúc của em về một nhân vật văn học mà em ngưỡng mộ, dẫn ra chi tiết hành động hoặc lời nói tiêu biểu để làm sáng tỏ cảm xúc đó.",
    "genre": "doan-van-tinh-cam",
    "genreLabel": "Đoạn văn nêu tình cảm, cảm xúc",
    "level": "doan",
    "topic": "Cảm xúc nhân vật văn học",
    "targetWords": 90,
    "lessonReference": "Tuần 21 - Bài 5 (trang 27, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": true,
    "usageCount": 86,
    "createdAt": "20/01/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Viết đoạn văn nêu cảm xúc về nhân vật có dẫn chứng cụ thể từ bài học trong SGK.",
        "targetGenre": "Đoạn văn cảm xúc về nhân vật văn học",
        "keyElements": [
          "Ôn cấu trúc đoạn văn và yêu cầu dựa vào tác phẩm",
          "Sử dụng bảng chi tiết – đặc điểm – cảm xúc đã lập",
          "Giới thiệu nhân vật; nêu chi tiết và cảm xúc; khẳng định tình cảm"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Tự hào, ngưỡng mộ tấm gương sáng của nhân vật tuổi thơ"
        },
        "guidingQuestions": [
          "Câu mở đoạn đã nêu tên nhân vật và tác phẩm chưa?",
          "Dẫn chứng hành động có làm nổi bật phẩm chất em ca ngợi không?"
        ]
      },
      "step3Outline": {
        "introduction": "Câu 1: Đọc bài thơ 'Lượm' của nhà thơ Tố Hữu, em vô cùng khâm phục và xúc động trước hình ảnh chú bé liên lạc Lượm.",
        "body": [
          "Câu 2 - 3: Dù tuổi còn nhỏ nhưng Lượm rất dũng cảm, nhanh nhẹn với dáng đi thoăn thoắt, cái mũ ca lô đội lệch đáng yêu.",
          "Câu 4 - 5: Chi tiết Lượm không sợ hiểm nguy, vượt qua mưa bom bão đạn để chuyển lá thư 'thượng khẩn' khiến em thán phục khôn nguôi."
        ],
        "conclusion": "Câu 6 - 7: Hình ảnh chú bé Lượm dũng cảm sẽ mãi là tấm gương sáng ngời cho thế hệ thiếu nhi chúng em noi theo."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "thoăn thoắt",
          "nhanh nhẹn",
          "hiểm nguy",
          "thán phục",
          "sáng ngời"
        ],
        "comparisons": [
          "Lượm hồn nhiên như con chim chích nhảy trên đường vàng."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng nhân vật trong tác phẩm đã học?",
        "Chi tiết dẫn chứng chính xác, thuyết phục?",
        "Cảm xúc bộc lộ rõ ràng, câu văn mạch lạc?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Trong những câu chuyện đã học, hình ảnh cô bé trong 'Sự tích hoa cúc trắng' luôn làm em rưng rưng xúc động.",
      "goodBodyExcerpt": "Trước bệnh tình hiểm nghèo của mẹ, cô bé đã không quản giá rét vượt đèo lội suối tìm bông hoa thuốc quý. Chi tiết em tỉ mẩn xé từng cánh hoa thành nhiều sợi nhỏ để mẹ được sống thêm nhiều ngày đã khắc sâu vào lòng em lòng hiếu thảo vô bờ.",
      "goodConclusionExample": "Tấm lòng trong sáng của cô bé nhắc nhở em phải luôn biết yêu thương, chăm sóc cha mẹ mỗi ngày."
    },
    "suggestedRubricSummary": [
      "Đúng nhân vật, đúng tác phẩm",
      "Chi tiết dẫn chứng chính xác, đắt giá",
      "Cảm xúc bộc lộ rõ ràng, chân thực",
      "Đoạn văn mạch lạc, liên kết tốt"
    ]
  },
  {
    "id": "kntt-hk2-t21-b06",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 21, Bài 6, tr. 29 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 21,
    "lessonNumber": 6,
    "sgkPage": 29,
    "stage": "Trả bài / chỉnh sửa",
    "learningObjectives": "Dùng nhận xét để làm rõ dẫn chứng và cảm xúc trong đoạn văn.",
    "title": "Trả bài viết đoạn văn nêu tình cảm, cảm xúc về một nhân vật trong văn học",
    "prompt": "Đọc kĩ nhận xét của thầy cô hoặc gợi mở của AI, rà soát lại dẫn chứng và từ ngữ biểu cảm trong đoạn văn của em. Chỉnh sửa những câu còn chung chung, làm cho tình cảm bộc lộ sâu sắc và thuyết phục hơn.",
    "genre": "doan-van-tinh-cam",
    "genreLabel": "Đoạn văn nêu tình cảm, cảm xúc",
    "level": "doan",
    "topic": "Chỉnh sửa cảm xúc nhân vật",
    "targetWords": 85,
    "lessonReference": "Tuần 21 - Bài 6 (trang 29, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 42,
    "createdAt": "23/01/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đoạn văn của em đã nêu được dẫn chứng cụ thể chưa hay mới chỉ khen chung chung? Cần bổ sung chi tiết nào?",
        "targetGenre": "Kĩ năng hoàn thiện đoạn văn cảm thụ văn học",
        "keyElements": [
          "Đọc nhận xét của giáo viên và đối chiếu yêu cầu",
          "Đánh dấu chỗ thiếu dẫn chứng, nhận xét chưa rõ hoặc cảm xúc chung chung",
          "Chọn nội dung cần sửa trước, sau đó sửa diễn đạt; viết lại hoàn thiện"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Nâng cao năng lực cảm thụ văn học và rèn luyện câu chữ"
        },
        "guidingQuestions": [
          "Có chi tiết đắt giá nào trong tác phẩm em có thể trích dẫn thêm?",
          "Từ ngữ nào thể hiện rõ nét hơn sự khâm phục của em?"
        ]
      },
      "step3Outline": {
        "introduction": "Xem xét mở đầu: Đã khẳng định cảm xúc nổi bật chưa?",
        "body": [
          "Thay nhận xét chung chung bằng chi tiết hành động đắt giá của nhân vật.",
          "Thêm từ nối để đoạn văn liền mạch, giàu sức gợi."
        ],
        "conclusion": "Kiểm tra lại xem bản sửa có sâu sắc hơn bản đầu không."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "khắc sâu",
          "thấm thía",
          "sâu sắc",
          "cảm động",
          "ngưỡng mộ"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Dẫn chứng chính xác theo tác phẩm?",
        "Cảm xúc cụ thể, sâu sắc hơn?",
        "Diễn đạt có tiến bộ rõ rệt?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Bản sửa: Em đã bổ sung thêm chi tiết Lượm 'bỏ thư vào bao, vút qua mặt trận' để làm rõ lòng quả cảm của chú."
    },
    "suggestedRubricSummary": [
      "Dẫn chứng chính xác theo tác phẩm",
      "Cảm xúc bộc lộ cụ thể, thuyết phục",
      "Diễn đạt có bước tiến bộ rõ rệt"
    ]
  },
  {
    "id": "kntt-hk2-t22-b07",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 22, Bài 7, tr. 33 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 22,
    "lessonNumber": 7,
    "sgkPage": 33,
    "stage": "Tìm hiểu kiểu văn bản",
    "learningObjectives": "Nhận biết cấu trúc và ngôn ngữ của văn bản hướng dẫn sử dụng sản phẩm.",
    "title": "Tìm hiểu cách viết hướng dẫn sử dụng một sản phẩm",
    "prompt": "Đọc văn bản hướng dẫn sử dụng một sản phẩm trong SGK Tập hai trang 33 (như hướng dẫn sử dụng bình nước giữ nhiệt, đồ chơi lắp ráp hoặc đồng hồ đeo tay). Nhận diện tên sản phẩm, công dụng, các bước thao tác và cảnh báo an toàn.",
    "genre": "huong-dan-cong-viec",
    "genreLabel": "Hướng dẫn sử dụng sản phẩm",
    "level": "doan",
    "topic": "Hướng dẫn sử dụng sản phẩm",
    "targetWords": 100,
    "lessonReference": "Tuần 22 - Bài 7 (trang 33, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 51,
    "createdAt": "27/01/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Văn bản hướng dẫn sử dụng sản phẩm cần những thông tin kĩ thuật nào? Ngôn ngữ cần ngắn gọn, chính xác ra sao?",
        "targetGenre": "Văn bản hướng dẫn sử dụng sản phẩm",
        "keyElements": [
          "Đọc mẫu; xác định tên sản phẩm, công dụng, thao tác và lưu ý",
          "Thu thập thông tin sử dụng và cảnh báo an toàn nếu có",
          "Sắp xếp chuẩn bị → các thao tác → lưu ý an toàn; hoàn thành sơ đồ"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Các nút bấm, nắp đậy, chỉ số hiển thị rõ ràng trên sản phẩm",
          "emotion": "Ý thức giữ gìn của bền tại người và tuân thủ an toàn kĩ thuật"
        },
        "guidingQuestions": [
          "Bước nào cần lưu ý đặc biệt để tránh làm hỏng sản phẩm?",
          "Các câu hướng dẫn có sử dụng động từ chỉ hành động rõ ràng không?"
        ]
      },
      "step3Outline": {
        "introduction": "Tên sản phẩm & Công dụng chính: Hướng dẫn sử dụng Bình giữ nhiệt thông minh.",
        "body": [
          "1. Trước khi dùng: Rửa sạch bằng nước ấm, lau khô.",
          "2. Trong khi dùng: Đậy chặt nắp, không rót nước quá đầy sát miệng bình.",
          "3. Lưu ý an toàn: Không cho bình vào lò vi sóng, không dùng vật sắc nhọn chà xát ruột bình."
        ],
        "conclusion": "Bảo quản: Để nơi khô ráo, thoáng mát sau khi vệ sinh."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "vặn chặt",
          "lau khô",
          "an toàn",
          "bảo quản",
          "chính xác"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng sản phẩm thực tế, thông tin có căn cứ?",
        "Đủ các bước tuần tự, dễ hiểu?",
        "Có lưu ý cảnh báo an toàn cần thiết?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "HƯỚNG DẪN SỬ DỤNG VÀ BẢO QUẢN BÌNH NƯỚC GIỮ NHIỆT HỌC SINH"
    },
    "suggestedRubricSummary": [
      "Đúng sản phẩm, đầy đủ các bước",
      "Ngôn ngữ chính xác, dễ hiểu, dễ làm theo",
      "Thông tin có căn cứ, lưu ý an toàn rõ ràng"
    ]
  },
  {
    "id": "kntt-hk2-t22-b08",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 22, Bài 8, tr. 37 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 22,
    "lessonNumber": 8,
    "sgkPage": 37,
    "stage": "Viết văn bản hướng dẫn",
    "learningObjectives": "Viết hướng dẫn sử dụng sản phẩm rõ ràng, đúng trình tự.",
    "title": "Viết hướng dẫn sử dụng một sản phẩm",
    "prompt": "Hãy viết văn bản hướng dẫn (từ 4 đến 6 bước ngắn gọn) cách sử dụng một đồ dùng quen thuộc của học sinh (như gọt bút chì quay tay, hộp màu nước hoặc đèn bàn học), bảo đảm rõ ràng, dễ hiểu và đúng trình tự.",
    "genre": "huong-dan-cong-viec",
    "genreLabel": "Hướng dẫn sử dụng sản phẩm",
    "level": "doan",
    "topic": "Thực hành viết hướng dẫn",
    "targetWords": 110,
    "lessonReference": "Tuần 22 - Bài 8 (trang 37, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": true,
    "usageCount": 79,
    "createdAt": "30/01/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Em hướng dẫn cách sử dụng đồ dùng nào? Câu lệnh hướng dẫn cần ngắn gọn, dứt khoát như thế nào?",
        "targetGenre": "Văn bản hướng dẫn sử dụng hoàn chỉnh",
        "keyElements": [
          "Ôn yêu cầu và bố cục văn bản hướng dẫn",
          "Dùng thông tin đã kiểm chứng về sản phẩm",
          "Sắp xếp các thao tác theo trình tự sử dụng thực tế; viết hoàn chỉnh"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Hình dáng máy gọt bút chì, nút điều chỉnh ngòi chì nhọn hay tù",
          "touch": "Tay quay nhẹ nhàng, kéo khay đựng vỏ chì đổ vào thùng rác",
          "emotion": "Tự tin hướng dẫn các bạn cùng sử dụng đúng cách"
        },
        "guidingQuestions": [
          "Cần cảnh báo điều gì khi các bạn nhỏ sử dụng dụng cụ này?",
          "Từ ngữ chỉ thứ tự các bước đã rõ ràng chưa?"
        ]
      },
      "step3Outline": {
        "introduction": "HƯỚNG DẪN SỬ DỤNG MÁY GỌT BÚT CHÌ QUAY TAY",
        "body": [
          "Bước 1: Kéo nhẹ phần kẹp bút ở đầu máy gọt ra phía trước.",
          "Bước 2: Bóp hai tai kẹp và đưa đầu bút chì vào lỗ cắm cho đến khi chạm đáy.",
          "Bước 3: Một tay giữ chặt thân máy gọt, tay kia quay cần gọt theo chiều kim đồng hồ từ 3 - 5 vòng.",
          "Bước 4: Bóp tai kẹp và nhẹ nhàng rút chiếc bút chì đã được chuốt nhọn ra."
        ],
        "conclusion": "Lưu ý: Kéo hộp chứa vỏ vụn gỗ ra đổ vào thùng rác khi đầy, không chọc tay vào lưỡi dao."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "kéo nhẹ",
          "bóp chặt",
          "quay đều",
          "chiều kim đồng hồ",
          "an toàn"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Các bước rõ ràng, đúng trình tự thực tế?",
        "Câu mệnh lệnh/hướng dẫn dễ hiểu, dễ thực hiện?",
        "Có phần lưu ý an toàn, không có thông tin bịa đặt?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "HƯỚNG DẪN SỬ DỤNG ĐÈN BÀN HỌC BẢO VỆ THỊ LỰC\nBước 1: Cắm phích điện vào ổ cắm an toàn trên bàn học."
    },
    "suggestedRubricSummary": [
      "Các bước rõ ràng, đúng trình tự sử dụng",
      "Dễ thực hiện, câu văn ngắn gọn, chính xác",
      "Lưu ý an toàn đầy đủ, không có thông tin bịa đặt"
    ]
  },
  {
    "id": "kntt-hk2-t23-b09",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 23, Bài 9, tr. 43 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 23,
    "lessonNumber": 9,
    "sgkPage": 43,
    "stage": "Lập dàn ý",
    "learningObjectives": "Chọn và sắp xếp sự việc chính cho bài kể chuyện.",
    "title": "Lập dàn ý cho bài văn kể lại một câu chuyện (Tập hai)",
    "prompt": "Thực hành lập dàn ý cho bài văn kể lại một câu chuyện lịch sử hoặc truyện cổ tích về lòng nhân ái, sắp xếp các sự việc chính theo trình tự mở đầu, diễn biến và kết thúc một cách chặt chẽ.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Kể lại một câu chuyện",
    "level": "bai",
    "topic": "Lập dàn ý kể chuyện",
    "targetWords": 150,
    "lessonReference": "Tuần 23 - Bài 9 (trang 43, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 48,
    "createdAt": "03/02/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Câu chuyện lịch sử hoặc cổ tích em chọn có ý nghĩa gì? Các mốc sự việc chính diễn ra theo trình tự nào?",
        "targetGenre": "Dàn ý bài văn kể chuyện",
        "keyElements": [
          "Đọc yêu cầu đề và ôn cấu trúc bài kể chuyện",
          "Ghi nhân vật, bối cảnh, sự việc chính và kết thúc",
          "Mở bài; thân bài kể theo trình tự; kết bài nêu suy nghĩ/cảm xúc"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Tự hào trước tinh thần yêu nước, khâm phục lòng nhân ái"
        },
        "guidingQuestions": [
          "Mở bài gián tiếp có thể dẫn dắt từ điều gì?",
          "Sự việc cao trào nào làm nổi bật khí phách của nhân vật?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài: Giới thiệu câu chuyện người anh hùng nhỏ tuổi Trần Quốc Toản bóp nát quả cam.",
        "body": [
          "Mốc 1: Hoài Văn Hầu đứng trên bờ nhìn thuyền vua bàn việc nước, ấm ức vì tuổi nhỏ không được dự bàn.",
          "Mốc 2: Chàng liều mình xuống bến xin gặp vua để tâu hai tiếng 'Đánh!'. Vua ban cam quý nhưng khuyên về chăm mẹ.",
          "Mốc 3: Lòng căm thù giặc sôi sục, Quốc Toản vô tình bóp nát quả cam trong tay từ lúc nào không hay."
        ],
        "conclusion": "Kết bài: Khâm phục ý chí quật cường của vị anh hùng trẻ tuổi, bài học yêu nước cho thiếu nhi."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "khí phách",
          "quật cường",
          "sôi sục",
          "bóp nát",
          "oanh liệt"
        ],
        "comparisons": [
          "Lòng căm thù giặc ngùn ngụt như ngọn lửa thiêu đốt."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Dàn ý đủ ba phần hoàn chỉnh?",
        "Các sự việc chính được ghi nhận chính xác, không bỏ sót?",
        "Trình tự kể hợp lí, logic?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Dàn ý chi tiết: Kể lại câu chuyện 'Bóp nát quả cam' - Người anh hùng thiếu niên Trần Quốc Toản."
    },
    "suggestedRubricSummary": [
      "Đủ ba phần của bài kể chuyện",
      "Các sự việc chính chính xác, đầy đủ",
      "Trình tự sắp xếp hợp lí, chặt chẽ"
    ]
  },
  {
    "id": "kntt-hk2-t23-b10",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 23, Bài 10, tr. 45 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 23,
    "lessonNumber": 10,
    "sgkPage": 45,
    "stage": "Viết bài",
    "learningObjectives": "Viết bài kể chuyện mạch lạc dựa trên dàn ý.",
    "title": "Viết bài văn kể lại một câu chuyện (Tập hai)",
    "prompt": "Dựa vào dàn ý đã lập ở Bài 9, hãy viết bài văn hoàn chỉnh kể lại câu chuyện lịch sử về người anh hùng nhỏ tuổi Trần Quốc Toản hoặc câu chuyện cổ tích em tâm đắc, thể hiện được lời nói và hành động quả cảm của nhân vật.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Kể lại một câu chuyện",
    "level": "bai",
    "topic": "Viết bài kể chuyện",
    "targetWords": 200,
    "lessonReference": "Tuần 23 - Bài 10 (trang 45, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": true,
    "usageCount": 92,
    "createdAt": "06/02/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Viết bài văn hoàn chỉnh dựa trên dàn ý, kết hợp kể sự việc với tả thần thái và bộc lộ cảm xúc hào hùng.",
        "targetGenre": "Bài văn kể chuyện lịch sử / cổ tích hoàn chỉnh",
        "keyElements": [
          "Nhắc lại yêu cầu bài và tiêu chí kể chuyện",
          "Sử dụng dàn ý đã hoàn thiện",
          "Triển khai mở bài, các sự việc và kết bài mạch lạc"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Thuyền rồng lộng lẫy trên bến Bình Than, ánh mắt rực lửa căm thù của chàng thiếu niên",
          "sound": "Tiếng sóng vỗ mạn thuyền, tiếng hô vang 'Đánh!' rung chuyển non sông",
          "emotion": "Rạo rực niềm tự hào dân tộc, xúc động trước tấm lòng son sắt vì non sông"
        },
        "guidingQuestions": [
          "Chi tiết quả cam bị bóp nát diễn tả điều gì trong nội tâm nhân vật?",
          "Lời kết bài mở rộng đã liên hệ đến lòng yêu nước của học sinh hôm nay chưa?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài gián tiếp: Dẫn dắt từ truyền thống chống giặc ngoại xâm của dân tộc, giới thiệu tấm gương Trần Quốc Toản.",
        "body": [
          "Đoạn 1: Hoài Văn Hầu tuổi trẻ chí lớn, đứng trên bến Bình Than nôn nóng xin gặp vua.",
          "Đoạn 2: Vua Thiệu Bảo hiểu tấm lòng nhưng vì chàng còn trẻ nên ban quả cam sành quý rồi dặn về hầu mẹ.",
          "Đoạn 3: Nỗi uất hận giặc tàn bạo dâng trào, hai bàn tay chàng siết chặt, quả cam nát vụn tự bao giờ."
        ],
        "conclusion": "Kết bài mở rộng: Bài học về lòng yêu nước nồng nàn, khơi dậy tinh thần chăm học để dựng xây đất nước."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "khí phách",
          "uất ức",
          "hào hùng",
          "son sắt",
          "bất tử"
        ],
        "comparisons": [
          "Tiếng hô của chàng như tiếng sấm dội vào lòng quân giặc.",
          "Khí thế của Hoài Văn Hầu rực sáng như vầng thái dương."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Bài văn đúng nội dung lịch sử cốt truyện?",
        "Kể đủ sự việc chính theo trình tự mạch lạc?",
        "Lời văn truyền cảm, không mắc lỗi câu và chính tả?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Lịch sử bốn ngàn năm dựng nước và giữ nước của dân tộc ta sáng ngời biết bao tấm gương anh hùng kiên cường. Trong số đó, hình ảnh chàng thiếu niên Trần Quốc Toản với tinh thần quả cảm 'Bóp nát quả cam' luôn làm em vô cùng ngưỡng mộ.",
      "goodBodyExcerpt": "Bước xuống thuyền rồng, nhìn thấy các vương hầu bàn kế sách, Quốc Toản quỳ xuống dõng dạc xin đánh giặc cứu nước. Vua Thiệu Bảo khen ngợi chí khí của người em họ nhỏ tuổi nhưng vẫn khuyên chàng lui về. Bước lên bờ, hai hàm răng chàng nghiến chặt, ngực phập phồng vì uất ức. Mải nghĩ đến lũ giặc hung tàn, bàn tay chàng siết chặt lại, quả cam sành ngọt ngào đã vỡ nát từ lúc nào không hay.",
      "goodConclusionExample": "Hình tượng người anh hùng thiếu niên Trần Quốc Toản với lá cờ thêu sáu chữ vàng 'Phá cường địch, báo hoàng ân' sẽ mãi mãi là ngọn đuốc sáng soi đường cho tuổi trẻ Việt Nam."
    },
    "suggestedRubricSummary": [
      "Đúng nội dung cốt truyện, giàu cảm xúc tự hào",
      "Kể đủ các sự việc chính, trình tự hợp lí",
      "Hành văn mạch lạc, từ ngữ chọn lọc đắt giá",
      "Đúng chính tả, bố cục 3 phần cân đối"
    ]
  },
  {
    "id": "kntt-hk2-t24-b11",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 24, Bài 11, tr. 50 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 24,
    "lessonNumber": 11,
    "sgkPage": 50,
    "stage": "Trả bài / chỉnh sửa",
    "learningObjectives": "Biết đánh giá và sửa bài kể chuyện dựa trên phản hồi.",
    "title": "Trả bài văn kể lại một câu chuyện (Tập hai)",
    "prompt": "Đọc nhận xét của thầy cô hoặc phản hồi từ AI, rà soát lại bài văn kể lại câu chuyện lịch sử của em. Sửa chữa các lỗi dùng từ chưa phù hợp với không khí lịch sử và viết lại đoạn cao trào cho hào hùng hơn.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Kể lại một câu chuyện",
    "level": "bai",
    "topic": "Chỉnh sửa bài kể chuyện lịch sử",
    "targetWords": 180,
    "lessonReference": "Tuần 24 - Bài 11 (trang 50, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 35,
    "createdAt": "10/02/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Ngôn từ trong bài kể chuyện lịch sử đã thể hiện đúng không khí trang nghiêm và tinh thần quả cảm chưa?",
        "targetGenre": "Kĩ năng hoàn thiện bài kể chuyện lịch sử",
        "keyElements": [
          "Đọc nhận xét về nội dung, bố cục và diễn đạt",
          "Xác định chỗ kể thiếu, chưa rõ hoặc lặp lại",
          "Ưu tiên sửa trình tự và nội dung rồi đến câu chữ; viết lại đoạn cần sửa"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Tự hào dân tộc, say mê tìm hiểu lịch sử nước nhà"
        },
        "guidingQuestions": [
          "Đoạn tả tâm trạng nhân vật lúc bóp nát quả cam đã thực sự xúc động chưa?",
          "Có thể thay thế từ ngữ nào để câu văn thêm trang trọng?"
        ]
      },
      "step3Outline": {
        "introduction": "Xem xét mở bài gián tiếp: Đã tạo được không khí hào hùng chưa?",
        "body": [
          "Sửa đoạn thân bài: Nhấn mạnh lời thoại khí phách 'Hai tiếng xin đánh!' của nhân vật.",
          "Thay thế các từ ngữ nôm na bằng từ ngữ chuẩn xác, trang trọng."
        ],
        "conclusion": "Rút ra bài học kinh nghiệm sau khi chỉnh sửa."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "hào hùng",
          "trang nghiêm",
          "khí khái",
          "súc tích",
          "truyền cảm"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Sửa đúng trọng tâm nhận xét của thầy cô?",
        "Câu chuyện liền mạch, không khí hào hùng hơn?",
        "Rút ra kinh nghiệm bổ ích cho các bài viết sau?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Bản sửa: Em đã thay câu 'Quốc Toản tức giận' thành 'Hoài Văn Hầu nuốt giận vào trong, hai mắt rực lửa căm hờn giặc ngoại xâm'."
    },
    "suggestedRubricSummary": [
      "Sửa đúng trọng tâm phản hồi",
      "Câu chuyện rõ ràng, liền mạch hơn",
      "Văn phong hào hùng, phù hợp đề tài lịch sử"
    ]
  },
  {
    "id": "kntt-hk2-t24-b12",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 24, Bài 12, tr. 53 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 24,
    "lessonNumber": 12,
    "sgkPage": 53,
    "stage": "Trả bài / chỉnh sửa",
    "learningObjectives": "Củng cố kĩ năng nêu ý kiến và hỗ trợ ý kiến bằng lí do, chi tiết.",
    "title": "Trả bài viết đoạn văn nêu ý kiến (Tập hai)",
    "prompt": "Củng cố kĩ năng viết đoạn văn nêu ý kiến: Đối chiếu đoạn văn với yêu cầu kiểu bài, kiểm tra xem các lí lẽ đã thuyết phục chưa, sắp xếp lại các câu nếu chưa liền mạch và hoàn thiện đoạn văn thật sắc sảo.",
    "genre": "doan-van-neu-y-kien",
    "genreLabel": "Đoạn văn nêu ý kiến",
    "level": "doan",
    "topic": "Củng cố kĩ năng nêu ý kiến",
    "targetWords": 85,
    "lessonReference": "Tuần 24 - Bài 12 (trang 53, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 43,
    "createdAt": "13/02/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đoạn văn nêu ý kiến đã có đủ 3 phần: Giới thiệu ý kiến -> Lí do thuyết phục -> Khẳng định lại chưa?",
        "targetGenre": "Hoàn thiện đoạn văn nêu ý kiến",
        "keyElements": [
          "Đối chiếu đoạn văn với yêu cầu kiểu bài đã học",
          "Kiểm tra ý kiến, lí do và chi tiết minh họa",
          "Sắp xếp lại câu nếu lí do chưa rõ; sửa và hoàn thiện"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Tự tin khẳng định suy nghĩ độc lập và sắc bén"
        },
        "guidingQuestions": [
          "Giữa ý kiến và lí do đã có sự gắn kết logic chặt chẽ chưa?",
          "Từ ngữ lập luận đã đủ thuyết phục người nghe chưa?"
        ]
      },
      "step3Outline": {
        "introduction": "Khẳng định ý kiến rõ ràng ở câu mở đầu.",
        "body": [
          "Bổ sung dẫn chứng thực tế minh họa cho lí do.",
          "Dùng từ nối lập luận: 'Bởi vì', 'Hơn thế nữa', 'Thực tế cho thấy'..."
        ],
        "conclusion": "Khẳng định lại niềm tin vững chắc ở câu kết."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "thuyết phục",
          "sắc bén",
          "chặt chẽ",
          "rõ ràng",
          "đúng đắn"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Ý kiến nêu ra rõ ràng, dứt khoát?",
        "Lí do gắn kết chặt chẽ với ý kiến?",
        "Dẫn chứng xác thực, diễn đạt mạch lạc?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Bản sửa: Đoạn văn đã bổ sung thêm dẫn chứng cụ thể từ câu chuyện để chứng minh cho lòng trung thực của nhân vật."
    },
    "suggestedRubricSummary": [
      "Ý kiến rõ ràng, khẳng định dứt khoát",
      "Lí do liên quan mật thiết và thuyết phục",
      "Dẫn chứng phù hợp, diễn đạt mạch lạc"
    ]
  },
  {
    "id": "kntt-hk2-t25-b13",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 25, Bài 13, tr. 58 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 25,
    "lessonNumber": 13,
    "sgkPage": 58,
    "stage": "Trả bài / chỉnh sửa",
    "learningObjectives": "Củng cố khả năng thuật lại sự việc theo trình tự rõ ràng.",
    "title": "Trả bài văn thuật lại một sự việc (Tập hai)",
    "prompt": "Rà soát lại bài văn thuật lại một sự việc đã viết, đối chiếu với nhận xét của giáo viên để bổ sung các mốc thời gian còn thiếu, chỉnh sửa trình tự diễn biến cho logic và hoàn thiện bài văn.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Thuật lại sự việc",
    "level": "bai",
    "topic": "Chỉnh sửa bài thuật lại sự việc",
    "targetWords": 180,
    "lessonReference": "Tuần 25 - Bài 13 (trang 58, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 38,
    "createdAt": "20/02/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Sự việc được thuật lại đã đủ các mốc quan trọng chưa? Có mốc nào bị nhảy cóc hoặc đảo lộn không?",
        "targetGenre": "Củng cố kĩ năng thuật lại sự việc",
        "keyElements": [
          "Đọc phản hồi về diễn biến, thông tin và bố cục",
          "Đánh dấu các mốc chưa rõ hoặc thiếu chi tiết",
          "Sắp xếp lại diễn biến nếu cần; sửa bài theo nhận xét"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Tỉ mỉ, chu đáo trong việc tái hiện chân thực bức tranh cuộc sống"
        },
        "guidingQuestions": [
          "Từ nối thời gian (Ban đầu, Sau đó, Tiếp theo, Cuối cùng) đã dùng chính xác chưa?"
        ]
      },
      "step3Outline": {
        "introduction": "Xem lại câu mở đầu: Đã nêu rõ thời gian, địa điểm chưa?",
        "body": [
          "Bổ sung chi tiết vào mốc cao trào của sự việc.",
          "Chỉnh lại thứ tự nếu có đoạn bị lộn xộn trước - sau."
        ],
        "conclusion": "Kiểm tra tính nhất quán toàn bài."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "tuần tự",
          "chính xác",
          "nhất quán",
          "rõ ràng",
          "sống động"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Sự việc chính xác, trung thực?",
        "Diễn biến rõ ràng, không thiếu mốc quan trọng?",
        "Trình tự hợp lí, câu văn liên kết tốt?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Bản sửa: Em đã bổ sung thêm mốc thời gian 'Đúng 8 giờ sáng' để người đọc hình dung rõ hơn tiến trình buổi lễ."
    },
    "suggestedRubricSummary": [
      "Sự việc thuật lại chính xác, trung thực",
      "Diễn biến rõ ràng, không thiếu mốc quan trọng",
      "Trình tự logic, văn phong mạch lạc"
    ]
  },
  {
    "id": "kntt-hk2-t25-b14",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 25, Bài 14, tr. 61 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 25,
    "lessonNumber": 14,
    "sgkPage": 61,
    "stage": "Lập dàn ý",
    "learningObjectives": "Lựa chọn và sắp xếp các mốc của một sự việc để chuẩn bị viết bài.",
    "title": "Lập dàn ý cho bài văn thuật lại một sự việc (Mở rộng)",
    "prompt": "Thực hành lập dàn ý cho bài văn thuật lại một lễ hội truyền thống hoặc một hoạt động vì cộng đồng (như Tết trồng cây, Ngày hội đọc sách, quyên góp ủng hộ bạn nghèo) theo trình tự các mốc diễn biến cụ thể.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Thuật lại sự việc",
    "level": "bai",
    "topic": "Lập dàn ý hoạt động xã hội",
    "targetWords": 150,
    "lessonReference": "Tuần 25 - Bài 14 (trang 61, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 47,
    "createdAt": "24/02/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đề bài yêu cầu thuật lại sự việc gì? Không khí và các hoạt động nổi bật gồm những gì?",
        "targetGenre": "Dàn ý bài văn thuật lại hoạt động tập thể",
        "keyElements": [
          "Xác định đề yêu cầu thuật lại sự việc nào",
          "Ghi thời gian, địa điểm, người tham gia và diễn biến",
          "Sắp xếp mở đầu – các mốc diễn biến – kết thúc; hoàn thành dàn ý"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Sân trường ngập tràn sắc màu cờ hoa, gian sách trưng bày đẹp mắt",
          "sound": "Tiếng trống hội rộn rã, tiếng thuyết minh sôi nổi",
          "emotion": "Hân hoan, tự hào, hào hứng tham gia"
        },
        "guidingQuestions": [
          "Hoạt động nào trong ngày hội thu hút đông đảo bạn bè nhất?",
          "Em đã đóng góp việc gì vào thành công của sự việc đó?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài: Giới thiệu Ngày hội đọc sách của trường em nhân dịp 21/4.",
        "body": [
          "Mốc 1: Sáng sớm sân trường rực rỡ cờ hoa, các góc đọc sách được trang trí sinh động.",
          "Mốc 2: Thầy Hiệu trưởng phát biểu khai mạc, phát động phong trào đọc sách.",
          "Mốc 3: Hoạt động đổi sách và thi kể chuyện theo sách diễn ra sôi nổi."
        ],
        "conclusion": "Kết bài: Niềm vui khi rinh về cuốn sách hay, mong ước trường tổ chức thêm nhiều ngày hội bổ ích."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "nhộn nhịp",
          "bổ ích",
          "say sưa",
          "rực rỡ",
          "hân hoan"
        ],
        "comparisons": [
          "Mỗi cuốn sách như một ô cửa sổ mở ra chân trời mới."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Dàn ý bám sát chủ đề sự việc?",
        "Có đầy đủ các mốc diễn biến chính?",
        "Trình tự sắp xếp logic, mạch lạc?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Dàn ý chi tiết: Thuật lại Ngày hội Đọc sách tại trường Tiểu học Chu Văn An."
    },
    "suggestedRubricSummary": [
      "Dàn ý đúng đề tài hoạt động xã hội",
      "Đủ các mốc sự việc chính theo trình tự",
      "Bố cục 3 phần rõ ràng, mạch lạc"
    ]
  },
  {
    "id": "kntt-hk2-t26-b15",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 26, Bài 15, tr. 66 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 26,
    "lessonNumber": 15,
    "sgkPage": 66,
    "stage": "Viết bài",
    "learningObjectives": "Viết bài thuật lại sự việc rõ ràng, đủ diễn biến.",
    "title": "Viết bài văn thuật lại một sự việc (Mở rộng)",
    "prompt": "Dựa vào dàn ý đã lập ở Bài 14, hãy viết bài văn hoàn chỉnh thuật lại Ngày hội đọc sách hoặc Lễ phát động Tết trồng cây ở trường em, kết hợp từ nối chuyển mốc thời gian khéo léo và bộc lộ cảm xúc hào hứng.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Thuật lại sự việc",
    "level": "bai",
    "topic": "Thuật lại ngày hội",
    "targetWords": 200,
    "lessonReference": "Tuần 26 - Bài 15 (trang 66, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": true,
    "usageCount": 90,
    "createdAt": "27/02/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Viết bài văn hoàn chỉnh thuật lại một ngày hội hoặc hoạt động ý nghĩa của trường em.",
        "targetGenre": "Bài văn thuật lại sự việc hoàn chỉnh",
        "keyElements": [
          "Ôn yêu cầu kiểu bài và dàn ý đã lập",
          "Dùng ghi chép và dàn ý; triển khai các mốc diễn biến bằng từ nối",
          "Viết bài văn hoàn chỉnh, kết hợp tả cảnh không khí và cảm xúc"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Những chậu cây non xanh mướt, trang sách mới thơm mùi mực, nụ cười rạng rỡ",
          "sound": "Tiếng loa phát thanh rộn rã bài ca tuổi thơ, tiếng reo cười râm ran",
          "emotion": "Tự hào khi được góp sức nhỏ bé làm đẹp trường lớp"
        },
        "guidingQuestions": [
          "Câu mở bài gián tiếp nào dẫn dắt người đọc vào không khí ngày hội?",
          "Hình ảnh so sánh nào thể hiện được niềm say mê của các bạn học sinh?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài gián tiếp: Dẫn dắt từ câu danh ngôn về sách, giới thiệu Ngày hội Đọc sách của trường.",
        "body": [
          "Đoạn 1: Sáng sớm tinh mơ, sân trường đã đông vui như ngày hội lớn.",
          "Đoạn 2: Các hoạt động diễn ra tưng bừng: thi trưng bày sách nghệ thuật, góc đọc sách thư giãn dưới tán bàng.",
          "Đoạn 3: Hội thi giới thiệu sách hay và lễ tổng kết trao giải thưởng."
        ],
        "conclusion": "Kết bài mở rộng: Ý nghĩa của ngày hội, thói quen đọc sách mỗi ngày thêm được vun đắp."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "tưng bừng",
          "say sưa",
          "hào hứng",
          "rộn ràng",
          "ý nghĩa"
        ],
        "comparisons": [
          "Sân trường hôm nay đông vui nhộn nhịp như một hội chợ sách thu nhỏ.",
          "Từng trang sách mở ra như đôi cánh diệu kì nâng ước mơ em bay cao."
        ],
        "personifications": [
          "Những cuốn sách nằm ngay ngắn trên giá như đang vẫy chào bạn đọc nhí."
        ]
      },
      "step5Checklist": [
        "Đúng sự việc, đủ diễn biến theo trình tự trước - sau?",
        "Có kết hợp miêu tả không khí và cảm xúc của bản thân?",
        "Từ nối chuyển đoạn tự nhiên, chính tả sạch sẽ?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Nhà văn M. Gorki từng nói: 'Sách mở rộng trước mắt tôi những chân trời mới'. Sáng thứ Sáu vừa qua, trường em đã tưng bừng tổ chức 'Ngày hội Đọc sách và Văn hóa đọc' để lan tỏa tình yêu sách đến toàn thể học sinh.",
      "goodBodyExcerpt": "Dưới bóng mát của hàng cây phượng vĩ, từng gian trưng bày sách của các khối lớp hiện lên vô cùng sáng tạo. Khối lớp 4 của chúng em đã khéo léo xếp những cuốn sách thành hình con thuyền ước mơ vươn ra biển lớn. Tiếng cười nói râm ran, từng tốp bạn ngồi quây quần say sưa đọc từng trang truyện cổ tích.",
      "goodConclusionExample": "Ngày hội khép lại trong niềm hân hoan rạng rỡ của thầy và trò. Em tự hứa sẽ dành ít nhất ba mươi phút mỗi ngày để đọc sách, bồi dưỡng thêm tri thức cho tương lai."
    },
    "suggestedRubricSummary": [
      "Đúng sự việc, đủ các diễn biến then chốt",
      "Trình tự rõ ràng, diễn đạt mạch lạc, truyền cảm",
      "Có hình ảnh so sánh, nhân hóa làm nổi bật không khí",
      "Bố cục 3 phần cân đối, đúng chính tả"
    ]
  },
  {
    "id": "kntt-hk2-t26-b16",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 26, Bài 16, tr. 68 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 26,
    "lessonNumber": 16,
    "sgkPage": 68,
    "stage": "Trả bài / chỉnh sửa",
    "learningObjectives": "Sửa bài thuật lại sự việc theo nhận xét và tiêu chí.",
    "title": "Trả bài văn thuật lại một sự việc (Mở rộng)",
    "prompt": "Đọc kĩ nhận xét của thầy cô hoặc gợi mở của AI, tìm các lỗi chuyển ý đột ngột hoặc thiếu từ nối giữa các đoạn trong bài văn thuật lại ngày hội để sửa chữa và nâng cao chất lượng bài viết.",
    "genre": "thuat-lai-su-viec",
    "genreLabel": "Thuật lại sự việc",
    "level": "bai",
    "topic": "Chỉnh sửa bài thuật lại ngày hội",
    "targetWords": 180,
    "lessonReference": "Tuần 26 - Bài 16 (trang 68, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 36,
    "createdAt": "03/03/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Các đoạn văn đã có câu chuyển tiếp mượt mà chưa? Chỗ nào cần bổ sung chi tiết để người đọc cảm nhận rõ không khí?",
        "targetGenre": "Kĩ năng hoàn thiện bài văn thuật lại sự việc",
        "keyElements": [
          "Đọc phản hồi về nội dung, trình tự và diễn đạt",
          "Tìm chỗ thiếu thông tin, lặp ý hoặc chuyển ý đột ngột",
          "Xác định thứ tự sửa nội dung và hình thức; viết lại hoàn thiện"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Nghiêm túc, cẩn trọng học hỏi từ từng góp ý"
        },
        "guidingQuestions": [
          "Từ nối nào giúp gắn kết phần khai mạc với phần các hoạt động diễn ra?"
        ]
      },
      "step3Outline": {
        "introduction": "Xem xét mở bài: Đã nêu bật ý nghĩa ngày hội chưa?",
        "body": [
          "Sửa câu chuyển đoạn giữa mốc khai mạc và mốc các gian hàng sách hoạt động.",
          "Thay thế các câu văn cộc lốc bằng câu có từ ngữ gợi tả âm thanh, màu sắc."
        ],
        "conclusion": "Nâng cao chất lượng toàn bài."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "chuyển ý",
          "mượt mà",
          "sinh động",
          "liền mạch",
          "hoàn chỉnh"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Sửa được lỗi trọng tâm được chỉ ra?",
        "Diễn biến sự việc dễ theo dõi, không bị ngắt quãng?",
        "Bài viết hoàn chỉnh, câu văn trau chuốt?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Bản sửa: Em đã thêm câu chuyển tiếp 'Sau phần lễ khai mạc trang trọng, sân trường lập tức bùng nổ trong tiếng reo hò khi các góc trải nghiệm bắt đầu mở cửa'."
    },
    "suggestedRubricSummary": [
      "Sửa được lỗi trọng tâm về chuyển đoạn",
      "Diễn biến dễ theo dõi, liên kết chặt chẽ",
      "Bài văn sau chỉnh sửa hoàn thiện, truyền cảm"
    ]
  },
  {
    "id": "kntt-hk2-t28-b17",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 28, Bài 17, tr. 83 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 28,
    "lessonNumber": 17,
    "sgkPage": 83,
    "stage": "Tìm hiểu kiểu bài",
    "learningObjectives": "Nhận biết bố cục và cách triển khai bài văn miêu tả cây cối.",
    "title": "Tìm hiểu cách viết bài văn miêu tả cây cối",
    "prompt": "Đọc bài văn mẫu miêu tả cây cối trong SGK trang 83 (như bài 'Cây sầu riêng' hoặc 'Bãi ngô'). Nhận biết bố cục 3 phần, tìm hiểu hai cách triển khai thân bài: Tả từng bộ phận của cây hoặc Tả từng thời kì phát triển của cây.",
    "genre": "mieu-ta-cay-coi",
    "genreLabel": "Miêu tả cây cối",
    "level": "bai",
    "topic": "Miêu tả cây cối",
    "targetWords": 180,
    "lessonReference": "Tuần 28 - Bài 17 (trang 83, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": true,
    "usageCount": 84,
    "createdAt": "10/03/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Bài văn miêu tả cây gì? Tác giả chọn trình tự miêu tả theo từng bộ phận hay theo từng thời kì phát triển?",
        "targetGenre": "Bài văn miêu tả cây cối",
        "keyElements": [
          "Đọc mẫu; xác định mở bài, thân bài, kết bài và trình tự miêu tả",
          "Ghi các bộ phận, đặc điểm, thời điểm và ấn tượng về cây",
          "Chọn tả theo từng bộ phận hoặc theo thời gian phát triển; hoàn thành sơ đồ"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Thân cây sần sùi, tán lá xanh mướt, hoa đơm chùm rực rỡ, quả treo lủng lẳng",
          "sound": "Tiếng gió thổi qua vòm lá xào xạc, tiếng chim ríu rít chuyền cành",
          "scentOrTaste": "Hương hoa ngào ngạt, vị ngọt thanh của trái chín",
          "emotion": "Yêu quý, gắn bó với bóng mát và vẻ đẹp của cây cối quanh em"
        },
        "guidingQuestions": [
          "Cây bóng mát, cây ăn quả hay cây hoa có những nét đặc trưng nào?",
          "Biện pháp so sánh nào làm nổi bật sức sống của cây?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài: Giới thiệu cây định tả (cây bàng sân trường hoặc cây ăn quả trong vườn nhà).",
        "body": [
          "Tả bao quát: Nhìn từ xa cây như thế nào (chiếc ô khổng lồ, tháp xanh sừng sững).",
          "Tả chi tiết: Gốc, rễ, thân, vỏ cây, cành, lá, hoa, quả (theo bộ phận hoặc theo mùa).",
          "Cảnh vật và hoạt động gắn liền: Chim chóc về làm tổ, học sinh vui đùa dưới bóng mát."
        ],
        "conclusion": "Kết bài: Nêu lợi ích của cây và tình cảm gắn bó, chăm sóc của em."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "sừng sững",
          "xum xuê",
          "xào xạc",
          "xanh mướt",
          "ngọt lịm"
        ],
        "comparisons": [
          "Tán lá xòe rộng như một chiếc ô hoa khổng lồ che mát cả góc sân.",
          "Những chiếc lá bàng mùa đông đỏ rực như muôn ngàn đốm lửa bập bùng."
        ],
        "personifications": [
          "Bác bàng già đứng trầm ngâm canh giữ cho tuổi thơ chúng em."
        ]
      },
      "step5Checklist": [
        "Bố cục 3 phần rõ ràng, cân đối?",
        "Trình tự miêu tả hợp lí, nhất quán?",
        "Đặc điểm chọn lọc tiêu biểu cho loài cây đó?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Sân trường Chu Văn An thân yêu của em rợp bóng mát cây xanh, nhưng thân thương nhất đối với em là bác bàng già đứng sừng sững bên cạnh cột cờ."
    },
    "suggestedRubricSummary": [
      "Bố cục 3 phần đúng quy chuẩn",
      "Trình tự miêu tả hợp lí, khoa học",
      "Đặc điểm cây tiêu biểu, giàu sức gợi"
    ]
  },
  {
    "id": "kntt-hk2-t28-b18",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 28, Bài 18, tr. 87 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 28,
    "lessonNumber": 18,
    "sgkPage": 87,
    "stage": "Tìm hiểu mở rộng",
    "learningObjectives": "Mở rộng cách lựa chọn trình tự và chi tiết khi miêu tả cây.",
    "title": "Tìm hiểu cách viết bài văn miêu tả cây cối (tiếp theo)",
    "prompt": "Phân tích kĩ hơn các cách mở bài trực tiếp và gián tiếp, cách kết bài mở rộng và không mở rộng trong bài văn tả cây cối. Chọn một loài cây đặc trưng của quê hương em để luyện tập xây dựng các phương án mở bài, kết bài.",
    "genre": "mieu-ta-cay-coi",
    "genreLabel": "Miêu tả cây cối",
    "level": "bai",
    "topic": "Mở rộng kĩ năng tả cây cối",
    "targetWords": 150,
    "lessonReference": "Tuần 28 - Bài 18 (trang 87, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 45,
    "createdAt": "13/03/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Mở bài gián tiếp có thể bắt đầu từ một bài hát, câu đố hay một kỉ niệm nào về cây?",
        "targetGenre": "Kĩ năng mở rộng bài văn tả cây cối",
        "keyElements": [
          "Phân tích tiếp bài mẫu và cách triển khai thân bài/kết bài",
          "Xác định chi tiết nổi bật và cảm nghĩ về cây",
          "Chọn trình tự phù hợp; kiểm tra sự thống nhất giữa mở bài, thân bài và kết bài"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Sắc hoa phượng đỏ rực báo hiệu hè về, hoa sen thơm ngát giữa hồ",
          "emotion": "Bồi hồi, lưu luyến khi chia tay mái trường hoặc nhớ về quê hương"
        },
        "guidingQuestions": [
          "Cây đó gắn liền với mùa nào trong năm?",
          "Kết bài mở rộng có thể nhắn gửi thông điệp bảo vệ môi trường ra sao?"
        ]
      },
      "step3Outline": {
        "introduction": "Phương án 1 (Trực tiếp): Vườn nhà ngoại em có trồng một cây ổi xum xuê.\nPhương án 2 (Gián tiếp): Mỗi độ thu về, hương ổi chín thoang thoảng trong gió lại nhắc em nhớ về cây ổi găng đầu ngõ nhà bà.",
        "body": [
          "Gắn kết chi tiết thân bài với các mùa hoa nở, trái chín."
        ],
        "conclusion": "Phương án 1 (Không mở rộng): Em rất yêu quý cây ổi.\nPhương án 2 (Mở rộng): Cây ổi như một người bạn tri kỉ che chở cho những kỉ niệm ấu thơ ngọt ngào."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "tri kỉ",
          "ngọt ngào",
          "thoang thoảng",
          "nồng nàn",
          "gắn bó"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Chọn đúng trình tự miêu tả phù hợp?",
        "Chi tiết cụ thể, giàu hình ảnh gợi cảm?",
        "Sự thống nhất cao giữa mở bài, thân bài và kết bài?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Mở bài gián tiếp: 'Mùa hoa phượng đỏ / Tiếng ve gọi hè...'. Mỗi khi nghe câu hát ấy ngân nga, em lại nhớ về cây phượng vĩ rực rỡ góc sân trường em."
    },
    "suggestedRubricSummary": [
      "Chọn đúng trình tự miêu tả phù hợp",
      "Chi tiết cụ thể, giàu cảm xúc",
      "Kết bài mở rộng sâu sắc, ý nghĩa"
    ]
  },
  {
    "id": "kntt-hk2-t29-b19",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 29, Bài 19, tr. 91 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 29,
    "lessonNumber": 19,
    "sgkPage": 91,
    "stage": "Quan sát / thu thập ý",
    "learningObjectives": "Biết quan sát và ghi chép đặc điểm cây phục vụ bài văn.",
    "title": "Quan sát cây cối",
    "prompt": "Ra sân trường hoặc khu vườn nhà em, quan sát kĩ một cái cây (cây phượng, cây bàng, cây hoa mai, cây xoài...). Ghi chép chi tiết vào bảng quan sát: gốc, rễ, thân, vỏ cây, vòm lá, hoa, quả và sự thay đổi của cây qua các thời điểm trong ngày.",
    "genre": "mieu-ta-cay-coi",
    "genreLabel": "Miêu tả cây cối",
    "level": "doan",
    "topic": "Kĩ năng quan sát cây cối",
    "targetWords": 80,
    "lessonReference": "Tuần 29 - Bài 19 (trang 91, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 46,
    "createdAt": "17/03/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Quan sát cây cối bằng nhiều giác quan: Nhìn màu sắc hình dáng, chạm vào vỏ cây, ngửi mùi hương hoa lá.",
        "targetGenre": "Kĩ năng quan sát và lập bảng ghi chép",
        "keyElements": [
          "Xác định mục tiêu và cách quan sát cây",
          "Ghi thân, cành, lá, hoa, quả, bóng mát hoặc sự thay đổi theo thời gian",
          "Phân nhóm ghi chép theo bộ phận hoặc thời điểm; hoàn thành bảng quan sát"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Thân cây hai vòng tay ôm không xuể, lớp vỏ nâu xám nứt nẻ in hằn dấu ấn thời gian",
          "touch": "Lớp vỏ cây thô ráp, sần sùi; phiến lá non mịn màng",
          "scentOrTaste": "Mùi nhựa cây ngai ngái, hương hoa dìu dịu trong nắng sớm",
          "emotion": "Thư thái, an yên dưới vòm bóng mát"
        },
        "guidingQuestions": [
          "Rễ cây trồi lên mặt đất trông giống hình thù gì?",
          "Khi có làn gió thoảng qua, tán lá rung rinh tạo ra âm thanh ra sao?"
        ]
      },
      "step3Outline": {
        "introduction": "Tên cây quan sát: Cây phượng vĩ giữa sân trường.",
        "body": [
          "Gốc & Thân: Gốc to bè, rễ uốn lượn như đàn trăn hiền lành, thân cây khoác áo nâu xám.",
          "Cành & Lá: Tán xòe rộng như chiếc dù khổng lồ, lá nhỏ li ti xanh mướt.",
          "Hoa & Quả: Từng chùm hoa đỏ rực như đốm lửa, quả phượng dài đen nhánh như chiếc kiếm."
        ],
        "conclusion": "Cảm nhận: Bác phượng già là chứng nhân thân thương cho bao thế hệ học trò."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "sần sùi",
          "nứt nẻ",
          "li ti",
          "xum xuê",
          "đỏ rực"
        ],
        "comparisons": [
          "Rễ cây trồi lên như những con trăn khổng lồ đang trườn trên mặt đất.",
          "Tán lá dày đặc như một chiếc ô che mát cả một khoảng sân."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Ghi chép cụ thể từ thực tế quan sát?",
        "Sử dụng nhiều giác quan (thị giác, xúc giác, khứu giác)?",
        "Chọn chi tiết đặc sắc, đúng đối tượng cây?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Bảng quan sát: Cây bàng mùa đông - Lá bàng chuyển sang màu đỏ ối, rụng lả tả theo từng cơn gió lạnh."
    },
    "suggestedRubricSummary": [
      "Ghi chép cụ thể, tỉ mỉ từ quan sát thực tế",
      "Vận dụng nhiều giác quan khi quan sát",
      "Lựa chọn được các đặc điểm đặc sắc của cây"
    ]
  },
  {
    "id": "kntt-hk2-t29-b20",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 29, Bài 20, tr. 95 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 29,
    "lessonNumber": 20,
    "sgkPage": 95,
    "stage": "Luyện viết",
    "learningObjectives": "Viết đoạn miêu tả tập trung vào đặc điểm cây hoặc bộ phận cây.",
    "title": "Luyện viết đoạn văn miêu tả cây cối",
    "prompt": "Chọn một trong hai yêu cầu: (1) Viết đoạn văn (4 - 5 câu) miêu tả thân cây, gốc cây và tán lá của một cây bóng mát; (2) Viết đoạn văn miêu tả mùa hoa nở hoặc mùa quả chín của một cây ăn quả.",
    "genre": "mieu-ta-cay-coi",
    "genreLabel": "Miêu tả cây cối",
    "level": "doan",
    "topic": "Luyện viết đoạn tả cây",
    "targetWords": 85,
    "lessonReference": "Tuần 29 - Bài 20 (trang 95, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": true,
    "usageCount": 88,
    "createdAt": "20/03/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đoạn văn này tập trung miêu tả bộ phận nào (thân, lá hay hoa, quả)? Câu mở đoạn giới thiệu bộ phận đó ra sao?",
        "targetGenre": "Đoạn văn miêu tả bộ phận cây cối",
        "keyElements": [
          "Ôn từ ngữ gợi tả, so sánh và nhân hóa phù hợp",
          "Chọn một nhóm chi tiết tiêu biểu từ bảng quan sát",
          "Sắp xếp câu theo trình tự miêu tả; viết đoạn văn hoàn chỉnh"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Hoa bưởi trắng tinh khôi, từng cánh hoa uốn cong duyên dáng, nhụy vàng ươm",
          "scentOrTaste": "Hương hoa bưởi nồng nàn lan tỏa khắp khu vườn sau cơn mưa",
          "emotion": "Thanh thản, say đắm trước vẻ đẹp dịu dàng của hoa cỏ quê hương"
        },
        "guidingQuestions": [
          "Hình ảnh so sánh nào làm nổi bật vẻ đẹp tinh khôi của hoa?",
          "Hương thơm của hoa lan tỏa trong không gian như thế nào?"
        ]
      },
      "step3Outline": {
        "introduction": "Câu 1: Mỗi độ tháng Ba về, cây bưởi đầu ngõ lại bung nở những chùm hoa trắng ngần.",
        "body": [
          "Câu 2: Từng búp hoa tròn xoe hé nở, để lộ năm cánh hoa trắng muốt mịn màng như nhung.",
          "Câu 3: Ở giữa là chùm nhụy vàng tươi lấp lánh như những hạt nắng nhỏ đọng lại.",
          "Câu 4: Hương bưởi nồng nàn, ngọt ngào lan tỏa theo từng cơn gió xuân dịu nhẹ."
        ],
        "conclusion": "Câu 5: Đứng dưới gốc bưởi, hít căng lồng ngực hương hoa tinh khiết, em cảm thấy tâm hồn mình thật thư thái."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "trắng ngần",
          "mịn màng",
          "vàng tươi",
          "nồng nàn",
          "tinh khôi"
        ],
        "comparisons": [
          "Cánh hoa bưởi mịn màng như nhung trắng.",
          "Nhụy hoa vàng óng như những hạt nắng tí hon."
        ],
        "personifications": [
          "Từng chùm hoa e ấp nép mình sau vòm lá xanh biếc."
        ]
      },
      "step5Checklist": [
        "Đoạn văn tập trung đúng bộ phận cây đã chọn?",
        "Chi tiết cụ thể, trình tự miêu tả rõ ràng?",
        "Có từ ngữ gợi cảm, so sánh sinh động?",
        "Câu văn liên kết chặt chẽ, đúng chính tả?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Mùa xuân đến, cây xoài cát sau vườn nhà em bắt đầu đơm hoa kết trái.",
      "goodBodyExcerpt": "Từng chùm hoa xoài li ti màu vàng nhạt đung đưa trong gió như những chùm pháo bông tí hon. Ít tuần sau, những quả xoài non nhú ra, to bằng đầu ngón tay rồi lớn dần bằng nắm tay, trĩu nặng từng cành cong.",
      "goodConclusionExample": "Nhìn những trái xoài căng mọng dưới nắng, em háo hức mong chờ ngày quả chín thơm lừng để dâng lên ông bà cha mẹ."
    },
    "suggestedRubricSummary": [
      "Tập trung miêu tả rõ nét bộ phận của cây",
      "Chi tiết cụ thể, trình tự rõ ràng",
      "Từ ngữ gợi tả phong phú, có so sánh/nhân hóa",
      "Câu văn liên kết mạch lạc, đúng chính tả"
    ]
  },
  {
    "id": "kntt-hk2-t30-b21",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 30, Bài 21, tr. 101 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 30,
    "lessonNumber": 21,
    "sgkPage": 101,
    "stage": "Luyện viết bộ phận bài",
    "learningObjectives": "Viết mở bài và kết bài phù hợp cho bài văn miêu tả cây.",
    "title": "Luyện viết mở bài, kết bài cho bài văn miêu tả cây cối",
    "prompt": "Thực hành viết 2 phương án mở bài (trực tiếp và gián tiếp) cùng 2 phương án kết bài (không mở rộng và mở rộng) cho bài văn miêu tả một cây bóng mát hoặc cây ăn quả quen thuộc.",
    "genre": "mieu-ta-cay-coi",
    "genreLabel": "Miêu tả cây cối",
    "level": "doan",
    "topic": "Mở bài & Kết bài tả cây",
    "targetWords": 100,
    "lessonReference": "Tuần 30 - Bài 21 (trang 101, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 55,
    "createdAt": "24/03/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Mở bài gián tiếp có thể dẫn dắt từ bóng mát, kỉ niệm tuổi thơ hay câu thơ nào về cây cối?",
        "targetGenre": "Kĩ năng viết mở bài và kết bài tả cây",
        "keyElements": [
          "So sánh cách giới thiệu cây trực tiếp/gián tiếp và cách kết bài",
          "Chọn thông tin giới thiệu và cảm nghĩ muốn thể hiện",
          "Đảm bảo mở bài dẫn vào đúng cây; kết bài gắn với nội dung miêu tả"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Gắn bó thiết tha với màu xanh của thiên nhiên quê hương"
        },
        "guidingQuestions": [
          "Kết bài mở rộng có thể liên hệ đến hành động bảo vệ và chăm sóc cây xanh ra sao?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài trực tiếp: Giới thiệu ngay cây phượng vĩ đứng sừng sững giữa sân trường.\nMở bài gián tiếp: Dẫn dắt từ tiếng ve ngân báo hiệu hè về để giới thiệu cây phượng rực rỡ sắc đỏ.",
        "body": [
          "Kết nối tự nhiên với phần thân bài tả cây."
        ],
        "conclusion": "Kết bài không mở rộng: Em rất yêu quý cây phượng.\nKết bài mở rộng: Khẳng định cây phượng là người bạn chứng kiến tuổi học trò, hứa sẽ luôn chăm sóc tưới mát cho cây."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "sừng sững",
          "gắn bó",
          "rực rỡ",
          "kỉ niệm",
          "nâng niu"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Mở bài dẫn vào đúng loài cây định tả?",
        "Tránh lặp nguyên văn câu chữ, cách diễn đạt tự nhiên?",
        "Kết bài phù hợp, bộc lộ tình cảm sâu sắc?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Mở bài gián tiếp: Đã bao mùa tựu trường trôi qua, sân trường Chu Văn An của chúng em vẫn luôn rợp mát bóng xanh. Thế nhưng, đọng lại trong trái tim em nhiều kỉ niệm ngọt ngào nhất vẫn là bác bàng già đứng sừng sững bên cạnh cột cờ thân yêu."
    },
    "suggestedRubricSummary": [
      "Mở bài tự nhiên, dẫn dắt khéo léo",
      "Kết bài mở rộng sâu sắc, hợp lí",
      "Diễn đạt mạch lạc, truyền cảm"
    ]
  },
  {
    "id": "kntt-hk2-t30-b22",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 30, Bài 22, tr. 104 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 30,
    "lessonNumber": 22,
    "sgkPage": 104,
    "stage": "Lập dàn ý",
    "learningObjectives": "Lập dàn ý đủ phần, có trình tự miêu tả nhất quán.",
    "title": "Lập dàn ý cho bài văn miêu tả cây cối",
    "prompt": "Tổng hợp các kết quả quan sát để lập dàn ý chi tiết 3 phần cho bài văn miêu tả một cây bóng mát trên sân trường hoặc một cây ăn quả trong vườn nhà, lựa chọn trình tự miêu tả nhất quán (theo từng bộ phận hoặc theo thời kì).",
    "genre": "mieu-ta-cay-coi",
    "genreLabel": "Miêu tả cây cối",
    "level": "bai",
    "topic": "Lập dàn ý tả cây cối",
    "targetWords": 150,
    "lessonReference": "Tuần 30 - Bài 22 (trang 104, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 50,
    "createdAt": "27/03/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Em chọn tả cây gì? Trình tự miêu tả xuyên suốt bài là gì (từ xa đến gần, từ bao quát đến chi tiết)?",
        "targetGenre": "Dàn ý hoàn chỉnh bài văn tả cây cối",
        "keyElements": [
          "Ôn cấu trúc và các cách triển khai bài văn tả cây",
          "Dùng bảng quan sát để chọn đặc điểm nổi bật",
          "Mở bài; thân bài theo bộ phận/thời gian; kết bài nêu cảm nghĩ"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Thân cây khoác áo nâu xám, tán lá tầng tầng lớp lớp xanh mướt",
          "sound": "Tiếng chim lảnh lót hót vang trên vòm cao",
          "emotion": "Yêu mến, gắn bó thiết tha"
        },
        "guidingQuestions": [
          "Thân bài có bị liệt kê quá nhiều chi tiết vụn vặt không?",
          "Đâu là đặc điểm đắt giá nhất làm nên nét riêng của loài cây này?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài gián tiếp: Giới thiệu cây bàng già nơi góc sân trường thân thương.",
        "body": [
          "1. Tả bao quát: Nhìn từ xa như chiếc ô xanh khổng lồ che mát cả một góc sân.",
          "2. Tả chi tiết: Gốc cây to gồ ghề, rễ cây ngoằn ngoèo trồi lên mặt đất, thân cây màu nâu xám, tán lá xòe thành từng tầng.",
          "3. Sự thay đổi theo mùa: Mùa xuân đâm chồi biếc, mùa hè rợp bóng xanh, mùa thu lá vàng ươm, mùa đông lá đỏ rực.",
          "4. Cảnh sinh hoạt: Dưới gốc bàng, chúng em quây quần đọc sách, chơi nhảy dây."
        ],
        "conclusion": "Kết bài mở rộng: Bác bàng già là người bạn thân thiết của tuổi thơ, lời hứa sẽ luôn chăm sóc giữ gìn cây."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "sừng sững",
          "gồ ghề",
          "ngoằn ngoèo",
          "chồi biếc",
          "thân thương"
        ],
        "comparisons": [
          "Cây bàng như chiếc ô xanh khổng lồ che mát góc sân.",
          "Từng tầng lá xòe ra như những chiếc mâm xanh xếp lớp."
        ],
        "personifications": [
          "Bác bàng già đứng trầm ngâm lắng nghe tiếng cười giòn giã của đàn cháu nhỏ."
        ]
      },
      "step5Checklist": [
        "Dàn ý đủ 3 phần cân đối?",
        "Ý cụ thể, tránh liệt kê quá tải chi tiết?",
        "Trình tự miêu tả thống nhất từ đầu đến cuối?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Dàn ý chi tiết bài văn miêu tả bác bàng già sân trường Lớp 4A1."
    },
    "suggestedRubricSummary": [
      "Dàn ý đủ 3 phần cân đối, hoàn chỉnh",
      "Ý cụ thể, sinh động, giàu hình ảnh gợi tả",
      "Trình tự miêu tả thống nhất, mạch lạc"
    ]
  },
  {
    "id": "kntt-hk2-t31-b23",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 31, Bài 23, tr. 108 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 31,
    "lessonNumber": 23,
    "sgkPage": 108,
    "stage": "Viết bài",
    "learningObjectives": "Viết bài văn miêu tả cây cối dựa trên quan sát và dàn ý.",
    "title": "Viết bài văn miêu tả cây cối",
    "prompt": "Dựa vào dàn ý đã lập ở Bài 22, hãy viết bài văn hoàn chỉnh miêu tả một cây bóng mát hoặc một cây ăn quả mà em yêu thích, làm nổi bật vẻ đẹp, sức sống của cây và tình cảm gắn bó của em.",
    "genre": "mieu-ta-cay-coi",
    "genreLabel": "Miêu tả cây cối",
    "level": "bai",
    "topic": "Bài văn miêu tả cây cối",
    "targetWords": 200,
    "lessonReference": "Tuần 31 - Bài 23 (trang 108, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": true,
    "usageCount": 99,
    "createdAt": "31/03/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Triển khai bài văn từ dàn ý chi tiết, vận dụng linh hoạt so sánh và nhân hóa để bài văn giàu chất thơ.",
        "targetGenre": "Bài văn miêu tả cây cối hoàn chỉnh",
        "keyElements": [
          "Nhắc lại tiêu chí bài miêu tả cây cối",
          "Dùng dàn ý và bảng quan sát đã hoàn thành",
          "Triển khai ba phần; miêu tả theo trình tự đã chọn"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Thân cây sừng sững, tán lá đung đưa, chùm hoa đỏ rực hay trái ngọt sum suê",
          "sound": "Tiếng lá xào xạc trong gió mát, tiếng chim líu lo ca hát",
          "touch": "Bàn tay chạm vào lớp vỏ thô ráp in dấu năm tháng",
          "emotion": "Gắn bó, yêu thương, coi cây như người bạn tri kỉ"
        },
        "guidingQuestions": [
          "Hình ảnh nhân hóa nào làm người đọc cảm nhận cây có tâm hồn?",
          "Kết bài mở rộng đã thể hiện được hành động cụ thể của em đối với cây chưa?"
        ]
      },
      "step3Outline": {
        "introduction": "Mở bài gián tiếp: Dẫn dắt từ những kỉ niệm thân thương dưới mái trường Chu Văn An, giới thiệu bác bàng già.",
        "body": [
          "Đoạn 1: Tả bao quát dáng hình cây bàng nhìn từ xa như chiếc ô xanh khổng lồ.",
          "Đoạn 2: Tả chi tiết gốc cây, rễ cây ngoằn ngoèo, thân cây màu nâu xám sần sùi và các tầng lá xòe ngang.",
          "Đoạn 3: Tả vẻ đẹp của cây bàng qua bốn mùa: búp non mùa xuân, bóng mát mùa hè, sắc vàng mùa thu, lá đỏ mùa đông.",
          "Đoạn 4: Những kỉ niệm vui chơi của chúng em dưới gốc bàng rợp mát."
        ],
        "conclusion": "Kết bài mở rộng: Dù mai này lớn khôn xa trường, hình ảnh bác bàng già thân yêu sẽ mãi in đậm trong trái tim em."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "sừng sững",
          "khổng lồ",
          "xum xuê",
          "sần sùi",
          "in đậm"
        ],
        "comparisons": [
          "Nhìn từ xa, cây bàng như một chiếc ô xanh khổng lồ che rợp cả góc sân.",
          "Lá bàng mùa đông đỏ rực như muôn ngàn đốm lửa ấm áp giữa trời giá rét."
        ],
        "personifications": [
          "Bác bàng già dang rộng vòng tay che chở cho tuổi thơ chúng em.",
          "Cây bàng như một người bảo vệ thầm lặng, cần mẫn dõi theo từng bước chân học trò."
        ]
      },
      "step5Checklist": [
        "Bài văn đúng đối tượng cây cối đã chọn?",
        "Đặc điểm của cây hiện lên rõ nét, có điểm nhấn?",
        "Trình tự miêu tả hợp lí, ngôn ngữ sinh động?",
        "Chính tả sạch đẹp, không mắc lỗi câu?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Mỗi ngày cắp sách tới trường Chu Văn An, hình ảnh đầu tiên đón chào chúng em chính là bác bàng già đứng sừng sững bên cạnh cột cờ, dang rộng vòng tay che mát cho tuổi thơ học trò.",
      "goodBodyExcerpt": "Nhìn từ xa, cây bàng như một chiếc ô xanh khổng lồ vươn cao giữa trời thu trong trẻo. Thân cây to chừng hai vòng tay học sinh chúng em ôm không xuể, lớp vỏ màu nâu xám nứt nẻ in hằn dấu ấn của thời gian. Những chiếc rễ lớn gồ ghề trồi lên mặt đất như đàn trăn hiền lành đang say sưa tắm nắng. Cứ mỗi độ hè sang, dưới tán lá bàng xanh mướt mát rượi, chúng em lại tụ họp đọc sách, chơi ô ăn quan trong tiếng cười nói rộn rã.",
      "goodConclusionExample": "Cây bàng không chỉ mang lại bóng mát cho sân trường mà còn lưu giữ biết bao kỉ niệm buồn vui của tuổi học trò. Dù mai này khôn lớn bay xa, bóng dáng thân thương của bác bàng già sẽ mãi in đậm trong tâm trí em."
    },
    "suggestedRubricSummary": [
      "Đúng đối tượng miêu tả, bố cục 3 phần cân đối",
      "Đặc điểm cây rõ ràng, sinh động, có chất thơ",
      "Vận dụng sáng tạo nhân hóa và so sánh",
      "Ngôn ngữ giàu cảm xúc, đúng chính tả"
    ]
  },
  {
    "id": "kntt-hk2-t31-b24",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 31, Bài 24, tr. 110 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 31,
    "lessonNumber": 24,
    "sgkPage": 110,
    "stage": "Trả bài / chỉnh sửa",
    "learningObjectives": "Cải thiện bài miêu tả cây từ phản hồi.",
    "title": "Trả bài văn miêu tả cây cối",
    "prompt": "Đọc kĩ nhận xét của thầy cô hoặc gợi mở từ AI, đối chiếu bài viết với Rubric 4 mức để nhận ra những chỗ miêu tả còn chung chung, sửa lại câu văn cho giàu hình ảnh gợi cảm và tự sửa bài hoàn thiện.",
    "genre": "mieu-ta-cay-coi",
    "genreLabel": "Miêu tả cây cối",
    "level": "bai",
    "topic": "Chỉnh sửa bài tả cây cối",
    "targetWords": 180,
    "lessonReference": "Tuần 31 - Bài 24 (trang 110, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 41,
    "createdAt": "03/04/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Đọc nhận xét theo bố cục, khả năng quan sát và diễn đạt để tìm ra điểm cần trau chuốt.",
        "targetGenre": "Kĩ năng hoàn thiện bài văn miêu tả cây cối",
        "keyElements": [
          "Đọc nhận xét theo bố cục, quan sát và diễn đạt",
          "Xác định chi tiết chung chung, thiếu hoặc chưa chính xác",
          "Sửa nội dung và trình tự trước khi sửa câu chữ; đối chiếu với rubric"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Cầu tiến, rèn giũa để ngòi bút ngày càng mềm mại, tinh tế"
        },
        "guidingQuestions": [
          "Hình ảnh so sánh nào có thể thay thế để câu văn đặc sắc hơn?"
        ]
      },
      "step3Outline": {
        "introduction": "Xem xét mở bài: Đã bộc lộ cảm xúc thiết tha chưa?",
        "body": [
          "Thay các câu tả chung chung bằng câu văn có màu sắc, âm thanh, xúc giác.",
          "Sửa lỗi chính tả l/n, s/x, dấu hỏi/ngã nếu có."
        ],
        "conclusion": "Kiểm tra sự liên kết giữa các đoạn trong bài."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "trau chuốt",
          "mượt mà",
          "tinh tế",
          "gợi cảm",
          "sâu lắng"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Chi tiết miêu tả cụ thể, gợi cảm hơn?",
        "Bố cục rõ ràng, sửa đúng lỗi trọng tâm?",
        "Đối chiếu đạt mức 3 hoặc mức 4 theo Rubric?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Bản sửa: Em đã thay câu 'Lá bàng rụng nhiều' bằng câu 'Những chiếc lá bàng mùa đông đỏ ối chao liệng trong gió rồi nhẹ nhàng đậu xuống mặt đất như đàn bướm lửa'."
    },
    "suggestedRubricSummary": [
      "Chi tiết cụ thể hơn, giàu sức gợi",
      "Bố cục rõ ràng, sửa đúng lỗi",
      "Bản viết sau đạt chuẩn Rubric cao hơn"
    ]
  },
  {
    "id": "kntt-hk2-t32-b25",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 32, Bài 25, tr. 116 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 32,
    "lessonNumber": 25,
    "sgkPage": 116,
    "stage": "Viết bài",
    "learningObjectives": "Viết đoạn văn tưởng tượng dựa trên câu chuyện hoặc tình huống gợi ý.",
    "title": "Viết đoạn văn tưởng tượng (Tập hai)",
    "prompt": "Dựa trên một câu chuyện cổ tích đã học (như 'Cây khế', 'Sự tích hoa cúc trắng' hay 'Dế Mèn phiêu lưu ký'), hãy viết đoạn văn tưởng tượng (từ 5 đến 7 câu) sáng tạo thêm một kết thúc mới hoặc kể về cuộc hội ngộ bất ngờ của các nhân vật sau nhiều năm.",
    "genre": "tuong-tuong",
    "genreLabel": "Đoạn văn tưởng tượng",
    "level": "doan",
    "topic": "Sáng tạo kết thúc mới",
    "targetWords": 90,
    "lessonReference": "Tuần 32 - Bài 25 (trang 116, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": true,
    "usageCount": 89,
    "createdAt": "07/04/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Em chọn câu chuyện nào để viết tiếp? Hướng phát triển câu chuyện có gì mới mẻ, bất ngờ?",
        "targetGenre": "Đoạn văn tưởng tượng (viết tiếp câu chuyện)",
        "keyElements": [
          "Xác định yêu cầu tưởng tượng cụ thể của bài",
          "Chọn câu chuyện/nhân vật và hướng phát triển ý tưởng",
          "Sắp xếp mở đầu, nội dung tưởng tượng và kết thúc; viết hoàn chỉnh"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Cảnh tượng diệu kì mười năm sau, chim phượng hoàng quay lại hòn đảo xưa",
          "emotion": "Bất ngờ, xúc động, tràn ngập tình người"
        },
        "guidingQuestions": [
          "Nhân vật người anh trong truyện 'Cây khế' sau khi hối lỗi đã thay đổi như thế nào?",
          "Kết thúc mới gửi gắm thông điệp nhân đạo gì?"
        ]
      },
      "step3Outline": {
        "introduction": "Câu 1: Mười năm sau biến cố trên biển, người anh trong truyện 'Cây khế' may mắn trôi dạt vào một hòn đảo hoang và đã hối hận về lòng tham của mình.",
        "body": [
          "Câu 2 - 3: Anh chăm chỉ làm lụng, trồng một vườn khế sum sê và chia sẻ cho muông thú.",
          "Câu 4 - 5: Một ngày nọ, chim phượng hoàng lại bay đến, nhận ra sự thay đổi thiện lương của người anh nên đã chở anh về đoàn tụ với người em."
        ],
        "conclusion": "Câu 6 - 7: Hai anh em ôm nhau khóc trong hạnh phúc, cùng nhau sống chan hòa, yêu thương dưới bóng cây khế ngọt."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "hối hận",
          "thiện lương",
          "đoàn tụ",
          "chan hòa",
          "hạnh phúc"
        ],
        "comparisons": [
          "Lòng nhân ái bao dung như dòng nước mát lành gột rửa mọi lỗi lầm xưa cũ."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng đề bài tưởng tượng dựa trên câu chuyện có sẵn?",
        "Ý tưởng sáng tạo, hợp lí, có tính giáo dục?",
        "Mạch lạc, câu văn liên kết tự nhiên?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Trong câu chuyện 'Cây khế', em luôn mong người anh có cơ hội sửa chữa lỗi lầm để hai anh em sum họp.",
      "goodBodyExcerpt": "Thoát nạn sau cơn bão, người anh dạt vào một hòn đảo nhỏ. Nhớ lại hành động tham lam của mình, anh khóc nức nở vì ân hận. Anh bắt đầu chăm chỉ gieo trồng cây trái và hết lòng chăm sóc muông thú bị thương. Cảm động trước tấm lòng lương thiện ấy, chim phượng hoàng đã dang rộng đôi cánh đưa anh trở về quê hương.",
      "goodConclusionExample": "Kết thúc ấm áp ấy đã khẳng định rằng khi con người biết ăn năn và sống hướng thiện, hạnh phúc sẽ luôn mỉm cười đón chào."
    },
    "suggestedRubricSummary": [
      "Đúng yêu cầu đề bài tưởng tượng",
      "Ý tưởng liên quan, sáng tạo, hợp lí",
      "Mạch lạc, có giá trị nhân văn cao",
      "Đúng chính tả, hành văn trong sáng"
    ]
  },
  {
    "id": "kntt-hk2-t32-b26",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 32, Bài 26, tr. 118 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 32,
    "lessonNumber": 26,
    "sgkPage": 118,
    "stage": "Trả bài / chỉnh sửa",
    "learningObjectives": "Điều chỉnh đoạn văn để tăng tính hợp lí và hấp dẫn.",
    "title": "Trả bài viết đoạn văn tưởng tượng (Tập hai)",
    "prompt": "Đọc nhận xét của thầy cô hoặc phản hồi từ AI, rà soát lại đoạn văn tưởng tượng của em. Tìm chi tiết còn gây khó hiểu hoặc mâu thuẫn để điều chỉnh, làm cho đoạn văn thêm hợp lí và cuốn hút.",
    "genre": "tuong-tuong",
    "genreLabel": "Đoạn văn tưởng tượng",
    "level": "doan",
    "topic": "Chỉnh sửa đoạn văn tưởng tượng",
    "targetWords": 85,
    "lessonReference": "Tuần 32 - Bài 26 (trang 118, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 39,
    "createdAt": "10/04/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Chi tiết tưởng tượng có chi tiết nào bị mâu thuẫn với tính cách nhân vật hoặc logic câu chuyện không?",
        "targetGenre": "Kĩ năng hoàn thiện đoạn văn tưởng tượng",
        "keyElements": [
          "Đọc nhận xét về nội dung, sáng tạo và cách diễn đạt",
          "Xác định chi tiết gây khó hiểu hoặc mâu thuẫn",
          "Chọn chi tiết cần sửa; viết lại phần được góp ý"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Tự tin phát triển trí tưởng tượng phong phú, có định hướng"
        },
        "guidingQuestions": [
          "Sự chuyển biến tâm lí của nhân vật đã diễn ra tự nhiên chưa?"
        ]
      },
      "step3Outline": {
        "introduction": "Xem xét mở đầu: Đã kết nối tự nhiên với phần kết của truyện gốc chưa?",
        "body": [
          "Chỉnh sửa chi tiết người anh hối lỗi cho thật xúc động và thuyết phục.",
          "Thay từ ngữ thô kệch bằng từ ngữ văn học gợi cảm."
        ],
        "conclusion": "Kiểm tra sự nhất quán sau khi chỉnh sửa."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "hợp lí",
          "thuyết phục",
          "sâu sắc",
          "cảm động",
          "mượt mà"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Chi tiết chỉnh sửa hợp lí, tự nhiên?",
        "Ý tưởng rõ ràng, có bước tiến bộ?",
        "Văn phong trong sáng, đúng chính tả?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Bản sửa: Em đã bổ sung thêm lí do người anh may mắn sống sót nhờ bám vào khúc gỗ trôi dạt để câu chuyện hợp lí hơn."
    },
    "suggestedRubricSummary": [
      "Chi tiết hợp lí, thuyết phục",
      "Ý tưởng rõ ràng, văn phong mượt mà",
      "Bài viết có tiến bộ rõ rệt sau chỉnh sửa"
    ]
  },
  {
    "id": "kntt-hk2-t33-b27",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 33, Bài 27, tr. 122 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 33,
    "lessonNumber": 27,
    "sgkPage": 122,
    "stage": "Luyện viết / vận dụng",
    "learningObjectives": "Vận dụng kĩ năng tưởng tượng vào một yêu cầu viết khác.",
    "title": "Viết đoạn văn tưởng tượng (Vận dụng)",
    "prompt": "Vận dụng năng lực tưởng tượng để viết đoạn văn (từ 5 đến 7 câu) miêu tả một phát minh kì diệu trong tương lai mà em mơ ước chế tạo (như chiếc cặp sách tự bay, cây bút thông minh chữa lỗi sai, hoặc con tàu dọn sạch rác đại dương).",
    "genre": "tuong-tuong",
    "genreLabel": "Đoạn văn tưởng tượng",
    "level": "doan",
    "topic": "Ước mơ phát minh tương lai",
    "targetWords": 90,
    "lessonReference": "Tuần 33 - Bài 27 (trang 122, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": true,
    "usageCount": 91,
    "createdAt": "14/04/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Phát minh của em có hình dáng ra sao và hoạt động bằng nguồn năng lượng gì? Nó giúp ích gì cho con người và môi trường?",
        "targetGenre": "Đoạn văn tưởng tượng về phát minh tương lai",
        "keyElements": [
          "Đọc đề và xác định hình thức tưởng tượng được yêu cầu",
          "Chọn phát minh, tính năng và các chi tiết mới phù hợp",
          "Sắp xếp nội dung theo trình tự rõ ràng; viết đoạn văn hoàn chỉnh"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Con tàu ngầm hình cá heo lấp lánh năng lượng mặt trời, vươn vòi hút rác thải nhựa",
          "sound": "Động cơ chạy êm ru không một tiếng ồn",
          "emotion": "Hào hứng, tràn đầy khát khao cống hiến cho hành tinh xanh"
        },
        "guidingQuestions": [
          "Phát minh đó giải quyết vấn đề nóng bỏng nào của cuộc sống hôm nay?"
        ]
      },
      "step3Outline": {
        "introduction": "Câu 1: Em luôn ấp ủ ước mơ chế tạo ra một con tàu dọn rác đại dương mang tên 'Cá Heo Xanh'.",
        "body": [
          "Câu 2 - 3: Con tàu có hình dáng như một chú cá heo khổng lồ, vỏ bọc bằng hợp kim siêu nhẹ chạy bằng năng lượng mặt trời.",
          "Câu 4 - 5: Tàu tự động quét và thu gom rác thải nhựa trôi nổi trên biển, sau đó ép lại thành các khối vật liệu tái chế hữu ích."
        ],
        "conclusion": "Câu 6 - 7: Em sẽ nỗ lực học tập thật giỏi môn Khoa học để biến phát minh kì diệu này thành hiện thực, trả lại màu xanh trong vắt cho đại dương."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "kì diệu",
          "tái chế",
          "thân thiện",
          "đại dương",
          "khát khao"
        ],
        "comparisons": [
          "Con tàu lướt trên sóng êm ru như một chú cá heo thực thụ."
        ],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng yêu cầu đề bài tưởng tượng khoa học?",
        "Sáng tạo phù hợp, giàu ý nghĩa nhân văn?",
        "Mạch lạc, câu văn diễn đạt rõ ràng?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Em luôn mơ ước trở thành một nhà khoa học nhí để chế tạo ra chiếc balo bay thông minh dành cho học sinh vùng cao."
    },
    "suggestedRubricSummary": [
      "Đúng yêu cầu đề bài tưởng tượng",
      "Ý tưởng sáng tạo, phù hợp, giàu ý nghĩa",
      "Diễn đạt mạch lạc, câu văn trong sáng"
    ]
  },
  {
    "id": "kntt-hk2-t33-b28",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 33, Bài 28, tr. 125 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 33,
    "lessonNumber": 28,
    "sgkPage": 125,
    "stage": "Tìm hiểu / hướng dẫn kiểu bài",
    "learningObjectives": "Ôn và hệ thống hóa cách viết thư theo mục đích giao tiếp.",
    "title": "Hướng dẫn cách viết thư",
    "prompt": "Ôn tập và hệ thống hóa toàn diện kĩ năng viết thư: Phân biệt cách viết thư thăm hỏi người thân, thư gửi bạn bè làm quen và thư cảm ơn hoặc xin lỗi theo đúng mục đích giao tiếp chuẩn mực.",
    "genre": "viet-don",
    "genreLabel": "Viết thư",
    "level": "doan",
    "topic": "Ôn tập thể thức viết thư",
    "targetWords": 100,
    "lessonReference": "Tuần 33 - Bài 28 (trang 125, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": false,
    "usageCount": 46,
    "createdAt": "17/04/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Mỗi mục đích viết thư (thăm hỏi, làm quen, cảm ơn) đòi hỏi cách mở đầu và lời kết như thế nào?",
        "targetGenre": "Văn bản giao tiếp: Hệ thống hóa viết thư",
        "keyElements": [
          "Đọc hướng dẫn; nhận diện các phần và cách xưng hô",
          "Xác định người nhận, mục đích và thông tin cần trao đổi",
          "Sắp xếp nội dung theo bố cục thư; hoàn thành checklist"
        ]
      },
      "step2Observation": {
        "senses": {
          "emotion": "Lịch sự, chân thành, bày tỏ thái độ đúng mực"
        },
        "guidingQuestions": [
          "Bức thư cảm ơn cần nhấn mạnh điều gì để người nhận thấy được sự trân trọng của em?"
        ]
      },
      "step3Outline": {
        "introduction": "1. Địa điểm, ngày tháng năm viết thư.\n2. Lời chào, xưng hô phù hợp với quan hệ.",
        "body": [
          "3. Nêu lí do viết thư (thăm hỏi, cảm ơn sự giúp đỡ, kết bạn).",
          "4. Nội dung tâm sự, trao đổi thông tin cụ thể."
        ],
        "conclusion": "5. Lời chúc sức khỏe, lời chào tạm biệt.\n6. Kí và ghi rõ họ tên."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "trân trọng",
          "chân thành",
          "biết ơn",
          "thân ái",
          "kính thư"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Cấu trúc các phần rõ ràng?",
        "Cách xưng hô phù hợp đối tượng nhận thư?",
        "Nội dung thư đúng mục đích giao tiếp?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Checklist viết thư: (1) Địa điểm, ngày tháng; (2) Lời chào; (3) Thăm hỏi; (4) Báo tin; (5) Lời chúc; (6) Kí tên."
    },
    "suggestedRubricSummary": [
      "Cấu trúc bức thư rõ ràng, chuẩn mực",
      "Xưng hô phù hợp đối tượng và mục đích",
      "Nội dung chân thành, đúng mực"
    ]
  },
  {
    "id": "kntt-hk2-t34-b29",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 34, Bài 29, tr. 129 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 34,
    "lessonNumber": 29,
    "sgkPage": 129,
    "stage": "Viết văn bản giao tiếp",
    "learningObjectives": "Viết thư phù hợp với người nhận và mục đích cụ thể.",
    "title": "Viết thư (Thực hành)",
    "prompt": "Hãy viết bức thư gửi một người bạn ở trường khác để làm quen và kể về những hoạt động thú vị ở trường em trong năm học lớp 4 vừa qua, bày tỏ mong muốn được kết bạn thân thiết.",
    "genre": "viet-don",
    "genreLabel": "Viết thư",
    "level": "bai",
    "topic": "Thư làm quen bạn bè",
    "targetWords": 150,
    "lessonReference": "Tuần 34 - Bài 29 (trang 129, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": true,
    "usageCount": 88,
    "createdAt": "21/04/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Em viết thư gửi cho bạn nào? Lời xưng hô đầu thư cần thân mật, cởi mở như thế nào?",
        "targetGenre": "Bức thư làm quen bạn bè",
        "keyElements": [
          "Ôn yêu cầu của đề và cấu trúc thư",
          "Ghi các ý cần trao đổi, hỏi thăm hoặc chia sẻ",
          "Sắp xếp lời mở đầu, nội dung và lời kết; viết thư hoàn chỉnh"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Tưởng tượng bức thư sẽ vượt ngàn dặm đến tay người bạn mới quen",
          "emotion": "Hân hoan, cởi mở, háo hức chờ thư hồi âm"
        },
        "guidingQuestions": [
          "Em tự giới thiệu về mình như thế nào để bạn dễ mến?",
          "Hoạt động nào của lớp em làm bạn thấy hào hứng nhất?"
        ]
      },
      "step3Outline": {
        "introduction": "Hà Nội, ngày 21 tháng 4 năm 2026\nBạn Minh thân mến,",
        "body": [
          "Mình là Nam, học sinh lớp 4A1 trường Tiểu học Chu Văn An. Qua chuyên mục 'Kết bạn bốn phương' của báo Thiếu niên Tiền phong, mình được biết bạn cũng rất thích môn cờ vua.",
          "Năm học lớp 4 vừa qua của bạn thế nào? Trường mình vừa tổ chức Ngày hội Đọc sách rất vui.",
          "Mình viết thư này mong được làm quen và cùng bạn chia sẻ kinh nghiệm học tập."
        ],
        "conclusion": "Chúc bạn luôn học giỏi và vui vẻ. Mong sớm nhận được thư hồi âm của bạn.\nBạn mới của bạn,\n(Kí tên) Lê Hải Nam."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "thân mến",
          "hồi âm",
          "cởi mở",
          "kết bạn",
          "chia sẻ"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Đúng mục đích viết thư kết bạn?",
        "Nội dung rõ ràng, lời văn hồn nhiên, thân mật?",
        "Cấu trúc thư hoàn chỉnh, đúng chính tả?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "Đà Nẵng, ngày 21 tháng 4 năm 2026\nChào bạn Mai thân mến!\nĐược biết bạn qua bức ảnh đoạt giải vẽ tranh thiếu nhi toàn quốc, mình rất khâm phục và muốn viết thư làm quen với bạn."
    },
    "suggestedRubricSummary": [
      "Đúng mục đích viết thư làm quen",
      "Nội dung rõ ràng, cởi mở, chân thành",
      "Xưng hô phù hợp, thể thức đầy đủ"
    ]
  },
  {
    "id": "kntt-hk2-t34-b30",
    "source": "source_doc",
    "sourceLabel": "Tiếng Việt 4 – Tập hai, Tuần 34, Bài 30, tr. 132 (KNTT)",
    "bookVolume": "tap2",
    "semester": "hk2",
    "week": 34,
    "lessonNumber": 30,
    "sgkPage": 132,
    "stage": "Viết văn bản thực hành",
    "learningObjectives": "Viết giấy mời đủ thông tin và đúng mục đích.",
    "title": "Viết giấy mời",
    "prompt": "Viết giấy mời cha mẹ hoặc thầy cô đến dự buổi Lễ tổng kết năm học hoặc buổi biểu diễn văn nghệ chia tay năm học lớp 4 của chi đội em, đảm bảo đầy đủ các thông tin: người mời, người được mời, thời gian, địa điểm và nội dung sự kiện.",
    "genre": "viet-don",
    "genreLabel": "Viết giấy mời",
    "level": "doan",
    "topic": "Văn bản giấy mời",
    "targetWords": 90,
    "lessonReference": "Tuần 34 - Bài 30 (trang 132, SGK Tiếng Việt 4 KNTT Tập 2)",
    "isFeatured": true,
    "usageCount": 82,
    "createdAt": "24/04/2026",
    "stepByStepGuide": {
      "step1Understanding": {
        "questionPrompt": "Giấy mời gửi cho ai và mời đến dự sự kiện gì? Những thông tin nào bắt buộc phải thật chính xác?",
        "targetGenre": "Văn bản giấy mời",
        "keyElements": [
          "Phân tích mẫu; xác định người được mời và thông tin sự kiện",
          "Thu thập tên hoạt động, thời gian, địa điểm, người/đơn vị mời và người nhận",
          "Sắp xếp thông tin theo mẫu giấy mời; viết hoàn chỉnh"
        ]
      },
      "step2Observation": {
        "senses": {
          "sight": "Trang giấy mời trang trọng, căn giữa tiêu đề, ghi rõ giờ giấc và địa điểm",
          "emotion": "Trân trọng, háo hức đón chào người thân, thầy cô đến chung vui"
        },
        "guidingQuestions": [
          "Thời gian (mấy giờ, ngày nào) và địa điểm (phòng học, hội trường nào) đã rõ ràng chưa?",
          "Lời mời có thể hiện sự trân trọng và chào đón nồng nhiệt không?"
        ]
      },
      "step3Outline": {
        "introduction": "TRƯỜNG TIỂU HỌC CHU VĂN AN / CHI ĐỘI 4A1\n\nGIẤY MỜI",
        "body": [
          "Kính gửi: Bác Nguyễn Văn An (Phụ huynh em Nguyễn Minh Hoàng).",
          "Ban chỉ huy Chi đội 4A1 trân trọng kính mời Bác đến dự: Buổi Lễ Tổng kết năm học 2025 - 2026 của lớp chúng em.",
          "Thời gian: 8 giờ 00 phút, sáng thứ Sáu, ngày 29 tháng 5 năm 2026.",
          "Địa điểm: Phòng học lớp 4A1, tầng 2, dãy nhà A."
        ],
        "conclusion": "Sự hiện diện của Bác là niềm vinh dự và nguồn động viên to lớn cho chúng em!\nThay mặt Chi đội 4A1: Chi đội trưởng (Kí và ghi rõ họ tên)."
      },
      "step4VocabularyAndFigurative": {
        "vividWords": [
          "trân trọng",
          "kính mời",
          "vinh dự",
          "nhiệt liệt",
          "đón tiếp"
        ],
        "comparisons": [],
        "personifications": []
      },
      "step5Checklist": [
        "Thông tin đầy đủ và chính xác (thời gian, địa điểm, sự kiện)?",
        "Trình bày rõ ràng, trang trọng?",
        "Đúng mục đích, câu chữ lễ phép?"
      ]
    },
    "sampleExcerpts": {
      "goodIntroExample": "GIẤY MỜI DỰ LỄ BẾ GIẢNG VÀ CHIA TAY NĂM HỌC LỚP 4\nKính gửi: Thầy cô giáo và quý phụ huynh học sinh Lớp 4A1."
    },
    "suggestedRubricSummary": [
      "Thông tin đầy đủ, chính xác tuyệt đối",
      "Trình bày trang trọng, rõ ràng",
      "Đúng mục đích, văn phong lịch sự, lễ phép"
    ]
  }
];
