// ============================================================================
// DỮ LIỆU CÁC MINI GAMES BỔ TRỢ - TIẾNG VIỆT LỚP 4 (GDPT 2018)
// Bao gồm: Xây Cầu Thần Tốc, Thám Tử Chính Tả, Vua Từ Láy, Thợ Rèn Câu Văn
// ============================================================================

export interface SentenceBuilderItem {
  id: number;
  topic: string;
  topicIcon: string;
  // Các mảnh từ bị xáo trộn
  shuffledWords: string[];
  // Thứ tự đúng
  correctOrder: string[];
  grammarExplanation: string;
  pedagogicalTip: string;
}

export interface SpellingDetectiveItem {
  id: number;
  sentenceWords: string[]; // Các từ trong câu để bấm chọn
  errorWordIndex: number;  // Vị trí từ viết sai
  errorWord: string;       // Từ sai
  correctWord: string;     // Từ đúng
  options: string[];       // 3 lựa chọn sửa
  ruleExplanation: string; // Giải thích quy tắc chính tả
}

export interface WordMasterItem {
  id: number;
  prompt: string;
  context: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  tag: string;
}

export interface SentenceUpgraderItem {
  id: number;
  baseSentence: string;
  context: string;
  adverbOptions: string[];
  selectedAdverb?: string;
  vividWordOptions: string[];
  comparisonOptions: string[];
  sampleSuperSentence: string;
  explanation: string;
}

// 1. NGÂN HÀNG XÂY CẦU THẦN TỐC (8 VÒNG CHƠI ĐA DẠNG)
export const SENTENCE_BUILDER_DATA: SentenceBuilderItem[] = [
  {
    id: 1,
    topic: "Cảnh đẹp dòng sông",
    topicIcon: "🌊",
    shuffledWords: [
      "dòng sông Đáy quê em",
      "như một dải lụa đào tha thướt.",
      "Vào những buổi chiều êm ả,",
      "uốn lượn quanh làng",
    ],
    correctOrder: [
      "Vào những buổi chiều êm ả,",
      "dòng sông Đáy quê em",
      "uốn lượn quanh làng",
      "như một dải lụa đào tha thướt.",
    ],
    grammarExplanation: "Trạng ngữ chỉ thời gian 'Vào những buổi chiều êm ả,' đứng đầu câu ngăn cách bằng dấu phẩy; tiếp theo là Chủ ngữ 'dòng sông Đáy quê em'; sau đó là Vị ngữ 'uốn lượn quanh làng' kèm hình ảnh so sánh sinh động.",
    pedagogicalTip: "Mẹo: Đặt trạng ngữ ở đầu câu giúp câu văn có nhịp điệu êm ái và mở rộng không gian miêu tả.",
  },
  {
    id: 2,
    topic: "Cây bóng mát sân trường",
    topicIcon: "🌿",
    shuffledWords: [
      "che chở bóng mát",
      "Bác phượng già",
      "cho chúng em mỗi giờ ra chơi.",
      "dang rộng vòng tay",
    ],
    correctOrder: [
      "Bác phượng già",
      "dang rộng vòng tay",
      "che chở bóng mát",
      "cho chúng em mỗi giờ ra chơi.",
    ],
    grammarExplanation: "Chủ ngữ nhân hóa 'Bác phượng già' đứng đầu, tiếp nối chuỗi hành động 'dang rộng vòng tay', 'che chở bóng mát' tạo nên tình cảm gắn bó yêu thương.",
    pedagogicalTip: "Mẹo: Dùng từ xưng hô nhân hóa 'Bác phượng' khiến cái cây trở nên gần gũi như một người thân.",
  },
  {
    id: 3,
    topic: "Vật nuôi thân thiết",
    topicIcon: "🐱",
    shuffledWords: [
      "như một cục bông trắng muốt.",
      "Chú mèo Miu",
      "say sưa sưởi nắng",
      "nằm cuộn tròn ngoài hiên,",
    ],
    correctOrder: [
      "Chú mèo Miu",
      "nằm cuộn tròn ngoài hiên,",
      "say sưa sưởi nắng",
      "như một cục bông trắng muốt.",
    ],
    grammarExplanation: "Câu miêu tả hoạt động và hình dáng của chú mèo, kết hợp từ láy 'say sưa' và hình ảnh so sánh 'như một cục bông trắng muốt'.",
    pedagogicalTip: "Mẹo: Miêu tả con vật lúc nằm ngủ hoặc sưởi nắng tạo cảm giác bình yên, đáng yêu.",
  },
  {
    id: 4,
    topic: "Bình minh mùa thu",
    topicIcon: "🌅",
    shuffledWords: [
      "nhô lên khỏi rặng tre xanh.",
      "Mặt trời đỏ rực",
      "từ từ",
      "như một quả cầu lửa khổng lồ",
    ],
    correctOrder: [
      "Mặt trời đỏ rực",
      "như một quả cầu lửa khổng lồ",
      "từ từ",
      "nhô lên khỏi rặng tre xanh.",
    ],
    grammarExplanation: "Chủ ngữ 'Mặt trời đỏ rực' được làm nổi bật với so sánh 'như một quả cầu lửa khổng lồ', sau đó là từ láy 'từ từ' và vị ngữ 'nhô lên'.",
    pedagogicalTip: "Mẹo: Từ láy 'từ từ' gợi tả chuyển động chậm rãi, uy nghi của vầng thái dương buổi sớm.",
  },
  {
    id: 5,
    topic: "Chim chóc rừng xanh",
    topicIcon: "🦚",
    shuffledWords: [
      "như một chiếc quạt lộng lẫy.",
      "Chú công trống kiêu hãnh",
      "xòe rộng chiếc đuôi",
      "Dưới ánh nắng ban mai,",
    ],
    correctOrder: [
      "Dưới ánh nắng ban mai,",
      "Chú công trống kiêu hãnh",
      "xòe rộng chiếc đuôi",
      "như một chiếc quạt lộng lẫy.",
    ],
    grammarExplanation: "Trạng ngữ 'Dưới ánh nắng ban mai,' tạo bối cảnh ánh sáng lung linh cho điệu múa xòe đuôi của chú công.",
    pedagogicalTip: "Mẹo: Tả con vật có màu sắc rực rỡ dưới ánh nắng giúp các chi tiết thêm lấp lánh.",
  },
  {
    id: 6,
    topic: "Mùa lúa chín quê hương",
    topicIcon: "🌾",
    shuffledWords: [
      "nhấp nhô lượn sóng",
      "Cả cánh đồng lúa chín",
      "như một biển vàng mênh mông.",
      "dưới làn gió thoảng,",
    ],
    correctOrder: [
      "Cả cánh đồng lúa chín",
      "dưới làn gió thoảng,",
      "nhấp nhô lượn sóng",
      "như một biển vàng mênh mông.",
    ],
    grammarExplanation: "Trạng ngữ chêm xen 'dưới làn gió thoảng,' tạo cảm giác chuyển động mượt mà cho hình ảnh so sánh 'biển vàng mênh mông'.",
    pedagogicalTip: "Mẹo: So sánh cánh đồng lúa rộng lớn với 'biển vàng' là hình ảnh văn học rất đặc sắc của lớp 4.",
  },
];

// 2. NGÂN HÀNG THÁM TỬ CHÍNH TẢ (8 VỤ ÁN BẮT LỖI)
export const SPELLING_DETECTIVE_DATA: SpellingDetectiveItem[] = [
  {
    id: 1,
    sentenceWords: ["Mỗi", "giờ", "ra", "chơi,", "sân", "trường", "lại", "gộn gã", "tiếng", "cười", "đùa."],
    errorWordIndex: 7,
    errorWord: "gộn gã",
    correctWord: "rộn rã",
    options: ["rộn rã", "rộn dã", "gộn rã"],
    ruleExplanation: "Quy tắc chính tả: Tiếng Việt dùng phụ âm đầu 'r' trong từ láy 'rộn rã' gợi tả âm thanh tiếng cười nói rộn ràng, vui tươi. Không có từ 'gộn gã'.",
  },
  {
    id: 2,
    sentenceWords: ["Dòng", "sông", "quê", "em", "uốn lượng", "quanh", "những", "cánh", "đồng", "xanh", "ngát."],
    errorWordIndex: 4,
    errorWord: "uốn lượng",
    correctWord: "uốn lượn",
    options: ["uốn lượn", "uốn lựng", "uống lượn"],
    ruleExplanation: "Quy tắc chính tả: Vần 'ươn' (uốn lượn, lượn lờ) gợi tả đường cong mềm mại. Vần 'ương' dùng trong số lượng, trọng lượng, chất lượng.",
  },
  {
    id: 3,
    sentenceWords: ["Từng", "chùm", "hoa", "phượng", "nở", "đỏ gực", "giữa", "vòm", "trời", "mùa", "hạ."],
    errorWordIndex: 5,
    errorWord: "đỏ gực",
    correctWord: "đỏ rực",
    options: ["đỏ rực", "đỏ dực", "đỏ rực rỡ"],
    ruleExplanation: "Quy tắc chính tả: Màu đỏ đậm chói chang viết là 'đỏ rực' (phụ âm 'r' như trong rực rỡ, bừng sáng).",
  },
  {
    id: 4,
    sentenceWords: ["Em", "luôn", "lắn lót", "viết", "từng", "dòng", "chữ", "ngay", "ngắn", "vào", "vở."],
    errorWordIndex: 2,
    errorWord: "lắn lót",
    correctWord: "nắn nót",
    options: ["nắn nót", "nắn lót", "lắn nót"],
    ruleExplanation: "Quy tắc chính tả: Từ láy chuẩn chỉ sự cẩn thận tỉ mỉ khi viết chữ là 'nắn nót' (bắt đầu bằng âm 'n').",
  },
  {
    id: 5,
    sentenceWords: ["Mặt", "hồ", "phẳng", "lặng", "như", "tấm", "gương", "phãn chiếu", "bầu", "trời", "xanh."],
    errorWordIndex: 7,
    errorWord: "phãn chiếu",
    correctWord: "phản chiếu",
    options: ["phản chiếu", "phãng chiếu", "phẳng chiếu"],
    ruleExplanation: "Quy tắc chính tả dấu hỏi/ngã: 'Phản chiếu', 'phản xạ' viết bằng dấu hỏi (?), không dùng dấu ngã (~).",
  },
  {
    id: 6,
    sentenceWords: ["Cây", "bàng", "nơi", "góc", "sân", "tỏa", "tán", "lá", "sum xê", "mát", "rượi."],
    errorWordIndex: 8,
    errorWord: "sum xê",
    correctWord: "sum sê",
    options: ["sum sê", "xum xê", "sum xê"],
    ruleExplanation: "Quy tắc chính tả s/x: Từ láy tả cành lá tốt tươi rậm rạp viết đúng chính tả SGK là 'sum sê' (hoặc 'xum xuê'). Không ghép lẫn lộn 'sum xê'.",
  },
  {
    id: 7,
    sentenceWords: ["Bác", "phượng", "già", "khoác", "chiếc", "áo", "hoa", "gực gỡ", "chào", "đón", "mùa", "thi."],
    errorWordIndex: 7,
    errorWord: "gực gỡ",
    correctWord: "rực rỡ",
    options: ["rực rỡ", "dực dỡ", "rực dỡ"],
    ruleExplanation: "Quy tắc chính tả: Từ láy 'rực rỡ' bắt đầu bằng âm 'r', diễn tả vẻ đẹp chói lọi, tươi thắm.",
  },
  {
    id: 8,
    sentenceWords: ["Chú", "cún", "con", "chậy lăng xăng", "đón", "em", "mỗi", "khi", "tan", "học", "về."],
    errorWordIndex: 3,
    errorWord: "chậy lăng xăng",
    correctWord: "chạy lăng xăng",
    options: ["chạy lăng xăng", "chạy năng xăng", "chậy năng xăng"],
    ruleExplanation: "Quy tắc vần ay/ây: Hành động di chuyển nhanh của chân viết là 'chạy' (vần 'ay'), phân biệt với 'thức dậy' (vần 'ây').",
  },
];

// 3. NGÂN HÀNG VUA TỪ LÁY & TỪ GỢI CẢM (8 CÂU HỎI THÁCH ĐẤU)
export const WORD_MASTER_DATA: WordMasterItem[] = [
  {
    id: 1,
    tag: "Tả âm thanh",
    prompt: "Từ láy nào diễn tả đúng nhất âm thanh reo vui, rộn ràng của tiếng cười nói học sinh giờ ra chơi?",
    context: "Sân trường giờ ra chơi vang lên tiếng nói cười ___.",
    options: ["rộn rã", "róc rách", "thì thào", "thưa thớt"],
    correctAnswer: "rộn rã",
    explanation: "'Rộn rã' gợi tả âm thanh sôi nổi, tưng bừng và liên tục tràn ngập không gian.",
  },
  {
    id: 2,
    tag: "Tả ánh sáng",
    prompt: "Từ láy nào miêu tả đẹp nhất ánh sáng trong trẻo, lấp lánh của giọt sương mai trên búp lá non?",
    context: "Những giọt sương mai đọng ___ trên từng ngọn cỏ non.",
    options: ["long lanh", "chói chang", "nhàn nhạt", "mờ ảo"],
    correctAnswer: "long lanh",
    explanation: "'Long lanh' gợi tả vẻ sáng bóng, trong vắt và phản chiếu ánh mặt trời rực rỡ.",
  },
  {
    id: 3,
    tag: "Tả dáng hình",
    prompt: "Từ láy nào diễn tả cành lá tốt tươi, xum xuê che mát cả một khoảng sân trường?",
    context: "Tán cây bàng già tỏa bóng ___ che mát cho chúng em.",
    options: ["sum sê", "thưa thớt", "khẳng khiu", "gầy guộc"],
    correctAnswer: "sum sê",
    explanation: "'Sum sê' nhấn mạnh cành lá um tùm, xum xuê, đầy sức sống dồi dào.",
  },
  {
    id: 4,
    tag: "Tả chuyển động",
    prompt: "Từ láy nào gợi tả bước chân thoăn thoắt, nhanh nhẹn của chú sóc chuyền cành?",
    context: "Chú sóc nâu chuyền cành nhanh ___ tìm những quả sồi chín.",
    options: ["thoăn thoắt", "chậm chạp", "lững thững", "nặng nề"],
    correctAnswer: "thoăn thoắt",
    explanation: "'Thoăn thoắt' gợi tả chuyển động lặp đi lặp lại rất nhanh, dứt khoát và khéo léo.",
  },
  {
    id: 5,
    tag: "Tả màu sắc",
    prompt: "Từ gợi tả sắc đỏ rực sáng như ngọn lửa bập bùng của hoa phượng vĩ?",
    context: "Cả vòm cây phượng bừng nở hoa ___ như một đốm lửa khổng lồ.",
    options: ["đỏ rực", "đo đỏ", "đỏ ửng", "đỏ hoe"],
    correctAnswer: "đỏ rực",
    explanation: "'Đỏ rực' mang sắc thái màu đỏ đậm, chói chang và bừng sáng khắp vòm trời.",
  },
  {
    id: 6,
    tag: "Tả dòng nước",
    prompt: "Từ láy miêu tả tiếng nước suối trong trẻo luồn qua các khe đá rêu phong?",
    context: "Bên vách núi, dòng suối nhỏ chảy ___ suốt ngày đêm.",
    options: ["róc rách", "ào ào", "ầm ầm", "hun hút"],
    correctAnswer: "róc rách",
    explanation: "'Róc rách' là từ tượng thanh gợi tả tiếng nước chảy nhẹ nhàng, liên hồi và trong vắt.",
  },
];

// 4. NGÂN HÀNG THỢ RÈN CÂU VĂN (4 THỬ THÁCH NÂNG CẤP CÂU)
export const SENTENCE_UPGRADER_DATA: SentenceUpgraderItem[] = [
  {
    id: 1,
    baseSentence: "Mặt trời mọc.",
    context: "Câu gốc rất đơn sơ (chỉ có 3 chữ). Em hãy rèn câu bằng cách thêm thời gian, màu sắc và so sánh:",
    adverbOptions: ["Vào những buổi sớm mai êm ả,", "Khi tiếng gà gáy vang rộn rã,", "Mỗi buổi sớm mùa thu,"],
    vividWordOptions: ["đỏ rực", "chói chang", "ấm áp"],
    comparisonOptions: ["như một quả cầu lửa khổng lồ", "như chiếc mâm vàng lộng lẫy", "tựa như viên hồng ngọc quý giá"],
    sampleSuperSentence: "Vào những buổi sớm mùa thu, mặt trời đỏ rực như một quả cầu lửa khổng lồ từ từ nhô lên khỏi rặng tre xanh.",
    explanation: "Câu nâng cấp đã có đầy đủ: Trạng ngữ chỉ thời gian + Từ ngữ chỉ đặc điểm màu sắc + Biện pháp so sánh gợi hình gợi cảm.",
  },
  {
    id: 2,
    baseSentence: "Cây phượng nở hoa.",
    context: "Nâng cấp câu bằng biện pháp nhân hóa coi cây như con người:",
    adverbOptions: ["Khi tiếng ve ngân rộn rã,", "Đến giữa tháng năm,", "Vào những ngày hè oi ả,"],
    vividWordOptions: ["đỏ rực rỡ", "thắm tươi", "rực cháy"],
    comparisonOptions: ["khoác lên chiếc áo hoa lộng lẫy", "dang rộng vòng tay chào đón mùa thi", "như người vệ sĩ trung thành che chở"],
    sampleSuperSentence: "Khi tiếng ve ngân rộn rã, bác phượng già khoác lên chiếc áo hoa đỏ rực rỡ, dang rộng vòng tay chào đón mùa thi.",
    explanation: "Câu văn sử dụng cách xưng hô thân mật 'bác phượng' và hành động nhân hóa 'khoác áo hoa', 'dang rộng vòng tay' rất giàu cảm xúc.",
  },
  {
    id: 3,
    baseSentence: "Dòng sông chảy qua làng.",
    context: "Nâng cấp câu bằng hình ảnh so sánh dịu dàng về dòng sông quê hương:",
    adverbOptions: ["Vào những buổi chiều tà,", "Dưới ánh hoàng hôn êm dịu,", "Bao đời nay,"],
    vividWordOptions: ["uốn lượn mềm mại", "chảy lững lờ", "trong veo"],
    comparisonOptions: ["như một dải lụa đào tha thướt", "như tấm gương khổng lồ", "tựa như dòng sữa mẹ nuôi nấng đồng quê"],
    sampleSuperSentence: "Dưới ánh hoàng hôn êm dịu, dòng sông quê em uốn lượn mềm mại quanh làng như một dải lụa đào tha thướt.",
    explanation: "Hình ảnh so sánh dòng sông với 'dải lụa đào tha thướt' thể hiện tình cảm gắn bó tha thiết với quê hương.",
  },
  {
    id: 4,
    baseSentence: "Chú mèo ngủ ngoài hiên.",
    context: "Nâng cấp câu tả vẻ ngộ nghĩnh, đáng yêu của vật nuôi trong nhà:",
    adverbOptions: ["Mỗi buổi sớm đầy nắng,", "Trong góc sân nhỏ râm mát,", "Vào những buổi trưa hè,"],
    vividWordOptions: ["nằm cuộn tròn", "say sưa", "lim dim"],
    comparisonOptions: ["như một cuộn len ấm áp", "trông như một cục bông mềm mại", "như một đứa trẻ ngoan ngoãn"],
    sampleSuperSentence: "Mỗi buổi sớm đầy nắng, chú mèo Miu nằm cuộn tròn say sưa ngủ ngoài hiên như một cục bông trắng muốt ấm áp.",
    explanation: "Câu văn kết hợp từ láy 'say sưa' và hình ảnh so sánh 'cục bông trắng muốt' làm nổi bật nét dễ thương của chú mèo.",
  },
];
