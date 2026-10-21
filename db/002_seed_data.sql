-- ============================================================================
-- EDUNOVA WRITING COACH - DỮ LIỆU KHỞI TẠO AN TOÀN (SEED DATA)
-- GIAI ĐOẠN 3: DỮ LIỆU MẪU CHUẨN MỰC, KHÔNG DÙNG DỮ LIỆU CÁ NHÂN THẬT
-- ============================================================================

-- 1. Trường học
INSERT INTO schools (id, name, code, address, phone)
VALUES ('00000000-0000-0000-0000-000000000001', 'Trường Tiểu học Chu Văn An', 'TH-CVA-01', '130 Thụy Khuê, Tây Hồ, Hà Nội', '02438472910')
ON CONFLICT (code) DO NOTHING;

-- 2. Năm học
INSERT INTO academic_years (id, school_id, name, start_date, end_date, is_current)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '2025 - 2026', '2025-09-05', '2026-05-31', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Profiles (Mật khẩu mặc định băm bcrypt an toàn: $2a$10$wK1y38mZ8qQ7Q...)
-- std-001: Nguyễn Minh An (Học sinh)
-- tea-001: Cô Lê Thị Thu Hương (Giáo viên)
-- adm-001: Thầy Trần Hoàng Nam (Quản trị viên)
INSERT INTO profiles (id, school_id, role, full_name, username, email, password_hash, avatar_url)
VALUES 
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'student', 'Nguyễn Minh An', 'minhan.cva', 'hocsinh@edunova.edu.vn', '$2a$10$7EqJtq98hPqEX7fNZaFWoOinMviG33C1d8/hE6Y9X2e90eYQkXNqO', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'student', 'Mai Phương Thảo', 'thaomai.cva', 'thao.mai@edunova.edu.vn', '$2a$10$7EqJtq98hPqEX7fNZaFWoOinMviG33C1d8/hE6Y9X2e90eYQkXNqO', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'student', 'Trần Tuấn Kiệt', 'tuankiet.cva', 'kiet.tran@edunova.edu.vn', '$2a$10$7EqJtq98hPqEX7fNZaFWoOinMviG33C1d8/hE6Y9X2e90eYQkXNqO', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'),
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'teacher', 'Cô Lê Thị Thu Hương', 'thuhuong.gv', 'giaovien@edunova.edu.vn', '$2a$10$7EqJtq98hPqEX7fNZaFWoOinMviG33C1d8/hE6Y9X2e90eYQkXNqO', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'admin', 'Thầy Trần Hoàng Nam', 'admin.cva', 'admin@edunova.edu.vn', '$2a$10$7EqJtq98hPqEX7fNZaFWoOinMviG33C1d8/hE6Y9X2e90eYQkXNqO', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (username) DO NOTHING;

-- 4. Thông tin học sinh tối thiểu
INSERT INTO student_profiles (profile_id, student_code, current_grade)
VALUES
('10000000-0000-0000-0000-000000000001', 'HS4A1-001', 4),
('10000000-0000-0000-0000-000000000002', 'HS4A1-002', 4),
('10000000-0000-0000-0000-000000000003', 'HS4A1-003', 4)
ON CONFLICT (profile_id) DO NOTHING;

-- 5. Thông tin giáo viên
INSERT INTO teacher_profiles (profile_id, teacher_code, specialization)
VALUES
('20000000-0000-0000-0000-000000000001', 'GV-TV-01', 'Tiểu học - Tiếng Việt 4')
ON CONFLICT (profile_id) DO NOTHING;

-- 6. Lớp học
INSERT INTO classes (id, school_id, academic_year_id, name, grade, room_number, lead_teacher_id)
VALUES
('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Lớp 4A1', 4, 'P.301 - Tầng 3', '20000000-0000-0000-0000-000000000001'),
('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Lớp 4A2', 4, 'P.302 - Tầng 3', NULL),
('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Lớp 4A3', 4, 'P.303 - Tầng 3', NULL)
ON CONFLICT (id) DO NOTHING;

-- 7. Thành viên lớp học
INSERT INTO class_memberships (class_id, student_id, status)
VALUES
('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'active'),
('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'active'),
('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'active')
ON CONFLICT (class_id, student_id) DO NOTHING;

-- 8. Danh mục Trò chơi
INSERT INTO games (id, name, description, min_grade, max_score, is_active)
VALUES
('vua-tu-ngu', 'Vua từ ngữ', 'Nối từ, ghép từ láy và lựa chọn từ ngữ gợi tả thích hợp cho câu văn miêu tả', 4, 100, TRUE),
('xay-cau-than-toc', 'Xây câu thần tốc', 'Sắp xếp các cụm từ theo đúng trật tự ngữ pháp Tiếng Việt', 4, 100, TRUE),
('tham-tu-chinh-ta', 'Thợ săn lỗi câu', 'Phát hiện câu thiếu chủ ngữ, vị ngữ, lỗi lặp từ và sửa câu văn gãy gọn', 4, 100, TRUE),
('thu-thach-viet-hay', 'Thử thách câu ảnh', 'Quan sát tranh thiên nhiên và viết câu văn có hình ảnh so sánh độc đáo', 4, 100, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 9. Mẫu Rubric chuẩn Lớp 4
INSERT INTO rubric_templates (id, name, description, grade_level, max_score)
VALUES
('rubric-grade4-standard', 'Rubric Đánh giá Bài văn Miêu tả Lớp 4 (Chuẩn Bộ GD&ĐT)', 'Bộ tiêu chí 4 mức độ: Cần hỗ trợ (Mức 1), Đang hình thành (Mức 2), Đạt yêu cầu (Mức 3), Vận dụng tốt (Mức 4)', 4, 5.0)
ON CONFLICT (id) DO NOTHING;

-- 10. Tiêu chí Rubric chi tiết
INSERT INTO rubric_criteria (id, template_id, name, weight, order_index, level_1_desc, level_2_desc, level_3_desc, level_4_desc)
VALUES
('c1', 'rubric-grade4-standard', 'Mở bài & Dẫn dắt', 1.0, 1, 'Chưa có mở bài hoặc mở bài lạc đề', 'Mở bài trực tiếp ngắn, chưa tạo ấn tượng', 'Mở bài rõ ràng, đúng đối tượng miêu tả', 'Mở bài gián tiếp tự nhiên, hấp dẫn, cuốn hút'),
('c2', 'rubric-grade4-standard', 'Nội dung quan sát & Chi tiết', 1.0, 2, 'Quan sát sơ sài, ít chi tiết nổi bật', 'Nêu được đặc điểm cơ bản nhưng còn chung chung', 'Quan sát theo trình tự hợp lý, có chi tiết cụ thể', 'Quan sát tinh tế bằng nhiều giác quan, chi tiết độc đáo'),
('c3', 'rubric-grade4-standard', 'Diễn đạt câu & Ngữ pháp', 1.0, 3, 'Nhiều câu thiếu thành phần, lủng củng', 'Câu đúng ngữ pháp nhưng đơn điệu', 'Câu văn gãy gọn, có sử dụng trạng ngữ mở rộng', 'Câu văn nhịp nhàng, biến hóa linh hoạt nhiều kiểu câu'),
('c4', 'rubric-grade4-standard', 'Sử dụng từ ngữ & Biện pháp tu từ', 1.0, 4, 'Chưa có biện pháp so sánh hoặc nhân hóa', 'Có 1 câu so sánh nhưng còn khiên cưỡng', 'Vận dụng tốt từ láy gợi cảm và so sánh tự nhiên', 'Vận dụng xuất sắc so sánh và nhân hóa giàu chất thơ'),
('c5', 'rubric-grade4-standard', 'Mạch lạc & Liên kết đoạn', 1.0, 5, 'Các đoạn rời rạc, không theo thứ tự', 'Có chia đoạn nhưng từ nối chưa tự nhiên', 'Bố cục 3 phần rõ ràng, các ý liên kết tốt', 'Chuyển đoạn mượt mà, cảm xúc dẫn dắt xuyên suốt'),
('c6', 'rubric-grade4-standard', 'Chính tả & Trình bày', 1.0, 6, 'Mắc trên 5 lỗi chính tả, chữ khó đọc', 'Mắc 3-4 lỗi chính tả hoặc dùng sai dấu câu', 'Mắc dưới 2 lỗi chính tả, trình bày sạch sẽ', 'Không mắc lỗi chính tả, trình bày mẫu mực')
ON CONFLICT (id) DO NOTHING;

-- 11. Cài đặt hệ thống
INSERT INTO system_settings (id, school_id, current_school_year, ai_strict_socratic_mode, max_suggestions_per_turn, allow_student_self_assessment, rubric_max_score)
VALUES
('default', '00000000-0000-0000-0000-000000000001', '2025 - 2026', TRUE, 3, TRUE, 5.0)
ON CONFLICT (id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP;
