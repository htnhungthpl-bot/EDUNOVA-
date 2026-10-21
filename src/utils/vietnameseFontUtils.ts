// ============================================================================
// BỘ TIỆN ÍCH XỬ LÝ & CHUẨN HÓA FONT TIẾNG VIỆT - EDUNOVA WRITING COACH
// Giải quyết triệt để lỗi font khi trích xuất, gõ, hiển thị và tải bài viết
// Hỗ trợ: Unicode NFC, TCVN3 (ABC), VNI-Windows, UTF-8 Double-Encoding, UTF-8 BOM
// ============================================================================

/**
 * 1. BẢNG MÃ CHUYỂN ĐỔI TCVN3 (.VnTime, .VnArial) SANG UNICODE
 * Rất phổ biến trong các tài liệu giáo án, đề bài và tệp Word cũ của thầy cô tiểu học
 */
const TCVN3_MAP: Record<string, string> = {
  // Nguyên âm thường
  "µ": "à", "¸": "á", "¶": "ả", "·": "ã", "¹": "ạ",
  "¨": "ă", "»": "ằ", "¾": "ắ", "¼": "ẳ", "½": "ẵ", "Æ": "ặ",
  "©": "â", "Ç": "ầ", "Ê": "ấ", "È": "ẩ", "É": "ẫ", "Ë": "ậ",
  "Ì": "è", "Ð": "é", "Î": "ẻ", "Ï": "ẽ", "Ñ": "ẹ",
  "ª": "ê", "Ò": "ề", "Õ": "ế", "Ó": "ể", "Ô": "ễ", "Ö": "ệ",
  "×": "ì", "Ý": "í", "Ø": "ỉ", "Ü": "ĩ", "Þ": "ị",
  "ß": "ò", "ã": "ó", "á": "ỏ", "â": "õ", "ä": "ọ",
  "«": "ô", "å": "ồ", "è": "ố", "æ": "ổ", "ç": "ỗ", "é": "ộ",
  "¬": "ơ", "ê": "ờ", "í": "ớ", "ë": "ở", "ì": "ỡ", "î": "ợ",
  "ï": "ù", "ó": "ú", "ñ": "ủ", "ò": "ũ", "ô": "ụ",
  "­": "ư", "õ": "ừ", "ø": "ứ", "ö": "ử", "÷": "ữ", "ù": "ự",
  "ú": "ỳ", "ý": "ý", "û": "ỷ", "ü": "ỹ", "þ": "ỵ",
  "®": "đ",
  // Ký tự hoa đặc thù
  "¥": "Ă", "§": "Đ",
};

/**
 * 2. BẢNG MÃ CHUYỂN ĐỔI VNI-WINDOWS SANG UNICODE
 */
const VNI_MAP: Record<string, string> = {
  "aù": "á", "aø": "à", "aû": "ả", "aõ": "ã", "aï": "ạ",
  "aê": "ă", "aé": "ắ", "aè": "ằ", "aú": "ẳ", "aü": "ẵ", "aë": "ặ",
  "aâ": "â", "aá": "ấ", "aà": "ầ", "aå": "ẩ", "aã": "ẫ", "aä": "ậ",
  "eù": "é", "eø": "è", "eû": "ẻ", "eõ": "ẽ", "eï": "ẹ",
  "eâ": "ê", "eá": "ế", "eà": "ề", "eå": "ể", "eã": "ễ", "eä": "ệ",
  "í": "í", "ì": "ì", "ỉ": "ỉ", "ĩ": "ĩ", "ị": "ị",
  "où": "ó", "oø": "ò", "oû": "ỏ", "oõ": "õ", "oï": "ọ",
  "oâ": "ô", "oá": "ố", "oà": "ồ", "oå": "ổ", "oã": "ỗ", "oä": "ộ",
  "ôù": "ớ", "ôø": "ờ", "ôû": "ở", "ôõ": "ỡ", "ôï": "ợ",
  "uù": "ú", "uø": "ù", "uû": "ủ", "uõ": "ũ", "uï": "ụ",
  "öù": "ứ", "öø": "ừ", "öû": "ử", "öõ": "ữ", "öï": "ự",
  "yù": "ý", "yø": "ỳ", "yû": "ỷ", "yõ": "ỹ", "î": "ỵ",
  "ñ": "đ", "Ñ": "Đ",
};

/**
 * 3. BẢNG MÃ SỬA LỖI UTF-8 DOUBLE ENCODING (MOJIBAKE)
 * Xảy ra khi văn bản UTF-8 bị đọc nhầm theo bảng mã ISO-8859-1 hoặc Windows-1252
 */
const MOJIBAKE_MAP: Record<string, string> = {
  "Ã¡": "á", "Ã ": "à", "Ã£": "ã", "Ã¢": "â", "Ã©": "é", "Ã¨": "è",
  "Ãª": "ê", "Ã­": "í", "Ã¬": "ì", "Ã³": "ó", "Ã²": "ò", "Ã´": "ô",
  "Ãº": "ú", "Ã¹": "ù", "Ã½": "ý", "Ä": "đ", "Ä": "Đ",
  "áº¡": "ạ", "áº£": "ả", "áº¯": "ắ", "áº±": "ằ", "áº³": "ẳ", "áºµ": "ẵ", "áº·": "ặ",
  "áº¥": "ấ", "áº§": "ầ", "áº©": "ẩ", "áº«": "ẫ", "áº­": "ậ", "áº»": "ẻ", "áº½": "ẽ",
  "áº¹": "ẹ", "áº¿": "ế", "á»": "ề", "á»": "ể", "á»": "ễ", "á»": "ệ", "á»": "ỉ",
  "á»": "ị", "á»": "ỏ", "á»": "ố", "á»": "ồ", "á»": "ổ", "á»": "ỗ", "á»": "ộ",
  "á»": "ớ", "á»": "ờ", "á»": "ở", "á»¡": "ỡ", "á»£": "ợ", "á»¥": "ụ", "á»§": "ủ",
  "á»©": "ứ", "á»«": "ừ", "á»­": "ử", "á»¯": "ữ", "á»±": "ự", "á»³": "ỳ", "á»·": "ỷ",
  "á»¹": "ỹ", "á»µ": "ỵ",
};

/**
 * Kiểm tra xem chuỗi có dấu hiệu mã hóa TCVN3 hay không
 */
export function isLikelyTcvn3(str: string): boolean {
  if (!str) return false;
  // Các ký tự đặc trưng của TCVN3: µ, ¸, ¶, ·, ¹, ¨, », ¾, ¼, ½, Æ, ©, Ç, Ê, È...
  const tcvn3Indicators = /[µ¸¶·¹¨»¾¼½Æ©ÇÊÈÉËÌÐÎÏÑªÒÕÓÔÖ×ÝØÜÞßãáâä«åèæçé¬êíëìîïóñòô­õøö÷ùúýûüþ®]/;
  const matches = str.match(new RegExp(tcvn3Indicators.source, "g")) || [];
  return matches.length >= 3;
}

/**
 * Chuyển đổi chuỗi TCVN3 sang Unicode chuẩn
 */
export function tcvn3ToUnicode(str: string): string {
  if (!str) return "";
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    result += TCVN3_MAP[ch] !== undefined ? TCVN3_MAP[ch] : ch;
  }
  return result.normalize("NFC");
}

/**
 * Chuyển đổi VNI sang Unicode
 */
export function vniToUnicode(str: string): string {
  if (!str) return "";
  let result = str;
  for (const [vni, uni] of Object.entries(VNI_MAP)) {
    result = result.split(vni).join(uni);
  }
  return result.normalize("NFC");
}

/**
 * Sửa lỗi double-encoding UTF-8 (Mojibake)
 */
export function repairDoubleUtf8(str: string): string {
  if (!str) return "";
  let result = str;
  for (const [moji, uni] of Object.entries(MOJIBAKE_MAP)) {
    result = result.split(moji).join(uni);
  }
  return result.normalize("NFC");
}

/**
 * Chuẩn hóa Unicode dạng Dựng Sẵn (NFC)
 * Xóa bỏ ký tự dấu rời rạc (NFD), hợp nhất các dấu thanh về ký tự duy nhất
 */
export function normalizeVietnameseNFC(str: string): string {
  if (!str) return "";
  // 1. Chuẩn hóa NFC
  let normalized = str.normalize("NFC");

  // 2. Sửa lỗi dấu phẩy/chấm dính liền hoặc khoảng trắng lỗi
  normalized = normalized
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Bỏ zero-width space
    .replace(/[ \t]+/g, " ") // Gộp nhiều khoảng trắng
    .replace(/\r\n/g, "\n"); // Đồng nhất xuống dòng

  return normalized;
}

/**
 * HÀM TỔNG HỢP: TỰ ĐỘNG PHÁT HIỆN VÀ SỬA TẤT CẢ LỖI FONT TIẾNG VIỆT
 * Chạy an toàn trên mọi chuỗi văn bản trích xuất từ Word, PDF, Ảnh scan hoặc bàn phím gõ
 */
export function autoRepairVietnameseText(str: string): string {
  if (!str) return "";

  let result = str;

  // 1. Nếu có dấu hiệu Mojibake (UTF-8 2 lần) -> Sửa trước
  if (result.includes("Ã") || result.includes("áº") || result.includes("á»")) {
    result = repairDoubleUtf8(result);
  }

  // 2. Nếu có dấu hiệu TCVN3 -> Chuyển sang Unicode
  if (isLikelyTcvn3(result)) {
    result = tcvn3ToUnicode(result);
  }

  // 3. Chuẩn hóa toàn diện về Unicode NFC
  result = normalizeVietnameseNFC(result);

  return result;
}

/**
 * XUẤT VĂN BẢN SANG TỆP WORD (.DOC) VỚI ĐỊNH DẠNG FONT CHUẨN TIẾNG VIỆT
 * Nhúng đầy đủ Meta UTF-8 và kiểu font Be Vietnam Pro / Times New Roman
 * Word mở lên hiển thị 100% đẹp mắt, không bao giờ bị lỗi font!
 */
export function exportToWordDoc(options: {
  title: string;
  author: string;
  grade?: string;
  school?: string;
  content: string;
  genreLabel?: string;
  rubricEvaluation?: {
    overallScore?: number;
    overallLevel?: number;
    overallComment?: string;
    teacherApprovedBy?: string;
    teacherOfficialComment?: string;
  };
  fileName?: string;
}) {
  const {
    title,
    author,
    grade = "Lớp 4",
    school = "Trường Tiểu học Chu Văn An",
    content,
    genreLabel = "Tập làm văn lớp 4",
    rubricEvaluation,
    fileName,
  } = options;

  // Chuẩn hóa nội dung trước khi xuất
  const safeTitle = autoRepairVietnameseText(title);
  const safeAuthor = autoRepairVietnameseText(author);
  const safeContent = autoRepairVietnameseText(content);
  const safeGenre = autoRepairVietnameseText(genreLabel);

  // Chuyển các dòng thành thẻ <p>
  const paragraphsHtml = safeContent
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="text-indent: 1.27cm; margin-bottom: 8pt; text-align: justify; line-height: 1.6;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("\n");

  let evaluationHtml = "";
  if (rubricEvaluation) {
    evaluationHtml = `
      <div style="margin-top: 24pt; padding: 12pt; border: 1.5pt solid #059669; background-color: #f0fdf4; border-radius: 8pt;">
        <h3 style="color: #065f46; font-size: 13pt; margin-top: 0; margin-bottom: 6pt;">KẾT QUẢ ĐÁNH GIÁ RUBRIC (CHƯƠNG TRÌNH GDPT 2018)</h3>
        <p style="margin: 4pt 0; font-size: 11pt;"><strong>Điểm số:</strong> ${rubricEvaluation.overallScore ? rubricEvaluation.overallScore.toFixed(1) + "/5.0 điểm" : "Đã đạt"} - <strong>Xếp loại:</strong> Mức ${rubricEvaluation.overallLevel || 4}</p>
        ${rubricEvaluation.overallComment ? `<p style="margin: 4pt 0; font-size: 11pt; color: #1e293b;"><strong>Nhận xét từ Thầy/Cô Trợ lý:</strong> <em>"${autoRepairVietnameseText(rubricEvaluation.overallComment)}"</em></p>` : ""}
        ${rubricEvaluation.teacherOfficialComment ? `<p style="margin: 4pt 0; font-size: 11pt; color: #047857;"><strong>Lời dặn của Giáo viên (${rubricEvaluation.teacherApprovedBy || "Thầy/Cô"}):</strong> <em>"${autoRepairVietnameseText(rubricEvaluation.teacherOfficialComment)}"</em></p>` : ""}
      </div>
    `;
  }

  const wordDocumentHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <title>${safeTitle}</title>
      <style>
        @page {
          size: 21.0cm 29.7cm; /* A4 */
          margin: 2.0cm 2.0cm 2.0cm 2.5cm; /* Top, Bottom, Right, Left */
        }
        body {
          font-family: 'Be Vietnam Pro', 'Times New Roman', 'Arial', sans-serif;
          font-size: 13pt;
          line-height: 1.5;
          color: #0f172a;
        }
        .header-table {
          width: 100%;
          border-bottom: 1pt solid #cbd5e1;
          margin-bottom: 18pt;
          padding-bottom: 8pt;
        }
        .title {
          font-size: 17pt;
          font-weight: bold;
          text-align: center;
          color: #065f46;
          text-transform: uppercase;
          margin-top: 14pt;
          margin-bottom: 16pt;
        }
        .footer {
          margin-top: 30pt;
          text-align: right;
          font-style: italic;
          font-size: 11pt;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <table class="header-table" style="width: 100%;">
        <tr>
          <td style="width: 60%; font-size: 11pt; color: #475569;">
            <strong>${school}</strong><br/>
            Dự án EduNova Writing Coach - Tiếng Việt 4
          </td>
          <td style="width: 40%; text-align: right; font-size: 11pt; color: #475569;">
            Học sinh: <strong>${safeAuthor}</strong><br/>
            ${grade} • ${safeGenre}
          </td>
        </tr>
      </table>

      <div class="title">${safeTitle}</div>

      <div class="content">
        ${paragraphsHtml}
      </div>

      ${evaluationHtml}

      <div class="footer">
        Trích xuất từ EduNova Writing Coach - ${new Date().toLocaleDateString("vi-VN")}
      </div>
    </body>
    </html>
  `;

  // Thêm UTF-8 Byte Order Mark (BOM) để Microsoft Word mở trực tiếp chuẩn 100% tiếng Việt
  const blob = new Blob(["\uFEFF" + wordDocumentHtml], {
    type: "application/msword;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const cleanFileName = (fileName || `Bai_Viet_${safeAuthor}_${safeTitle}`.replace(/[\s/\\?%*:|"<>]+/g, "_")) + ".doc";
  link.href = url;
  link.download = cleanFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * XUẤT VĂN BẢN SANG TỆP VĂN BẢN THUẦN (.TXT) CHUẨN UTF-8 KÈM BOM
 * Đảm bảo Notepad, TextEdit hoặc các phần mềm gõ chữ không bị biến thành dấu hỏi (?) hay lỗi font
 */
export function exportToTextFile(options: {
  title: string;
  author: string;
  content: string;
  fileName?: string;
  notes?: string;
}) {
  const { title, author, content, fileName, notes } = options;

  const header = `================================================================================
EDUNOVA WRITING COACH - BÀI LÀM HỌC SINH LỚP 4
Đề bài: ${autoRepairVietnameseText(title)}
Học sinh: ${autoRepairVietnameseText(author)}
Ngày lưu: ${new Date().toLocaleString("vi-VN")}
================================================================================\n\n`;

  const footer = notes ? `\n\n--------------------------------------------------------------------------------\nNHẬN XÉT & GỢI Ý:\n${autoRepairVietnameseText(notes)}\n` : "";

  const fullText = header + autoRepairVietnameseText(content) + footer;

  // UTF-8 BOM (\uFEFF) giúp Windows Notepad nhận diện đúng UTF-8
  const blob = new Blob(["\uFEFF" + fullText], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const cleanFileName = (fileName || `Bai_Viet_${author}_${title}`.replace(/[\s/\\?%*:|"<>]+/g, "_")) + ".txt";
  link.href = url;
  link.download = cleanFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
