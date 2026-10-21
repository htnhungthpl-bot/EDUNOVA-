-- ============================================================================
-- EDUNOVA WRITING COACH - HỆ THỐNG CƠ SỞ DỮ LIỆU QUAN HỆ (POSTGRESQL / SUPABASE)
-- GIAI ĐOẠN 3: SCHEMA DDL, FOREIGN KEYS, CONSTRAINTS, INDEXES VÀ ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Bật tiện ích UUID mở rộng nếu chưa có
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. SCHOOLS (Trường học)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. ACADEMIC_YEARS (Năm học)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- Ví dụ: '2025 - 2026'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. PROFILES (Hồ sơ người dùng)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE, -- Định danh đăng nhập (cho học sinh không có email)
    email VARCHAR(150) UNIQUE,            -- Bắt buộc với GV/Admin, tùy chọn với học sinh
    password_hash TEXT NOT NULL,          -- Mật khẩu băm an toàn (bcrypt / argon2)
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. STUDENT_PROFILES (Thông tin tối thiểu của học sinh lớp 4)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_profiles (
    profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    student_code VARCHAR(50) NOT NULL UNIQUE,
    current_grade INT NOT NULL DEFAULT 4,
    date_of_birth DATE,
    parent_contact VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. TEACHER_PROFILES (Hồ sơ giáo viên)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS teacher_profiles (
    profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    teacher_code VARCHAR(50) NOT NULL UNIQUE,
    specialization VARCHAR(100) NOT NULL DEFAULT 'Tiểu học - Tiếng Việt',
    phone_number VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 6. CLASSES (Lớp học)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    name VARCHAR(50) NOT NULL, -- Ví dụ: 'Lớp 4A1'
    grade INT NOT NULL DEFAULT 4,
    room_number VARCHAR(50),
    lead_teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. CLASS_MEMBERSHIPS (Quan hệ thành viên lớp học)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS class_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    enrolled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'graduated')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_class_student UNIQUE (class_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 8. WRITING_ASSIGNMENTS (Bài tập viết)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS writing_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    prompt TEXT NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('cau', 'doan', 'bai')),
    topic VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Bản nháp' 
        CHECK (status IN ('Bản nháp', 'Đã giao', 'Đang thực hiện', 'Đã nộp', 'Đã phản hồi', 'Hoàn thành')),
    target_words INT NOT NULL DEFAULT 100,
    rubric_template_id VARCHAR(50) NOT NULL DEFAULT 'rubric-grade4-standard',
    guidelines JSONB NOT NULL DEFAULT '[]'::jsonb,
    due_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 9. ASSIGNMENT_SUBMISSIONS (Bài nộp của học sinh)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES writing_assignments(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('cau', 'doan', 'bai')),
    current_content TEXT NOT NULL,
    word_count INT NOT NULL DEFAULT 0,
    sentence_count INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'Đang làm'
        CHECK (status IN ('Đang làm', 'Đã nộp', 'Đã phản hồi', 'Hoàn thành')),
    submitted_at TIMESTAMPTZ,
    ai_feedback_snapshot JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_assignment_student UNIQUE (assignment_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 10. WRITING_VERSIONS (Các phiên bản bài viết)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS writing_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES assignment_submissions(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    content TEXT NOT NULL,
    word_count INT NOT NULL DEFAULT 0,
    sentence_count INT NOT NULL DEFAULT 0,
    notes VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_submission_version UNIQUE (submission_id, version_number)
);

-- ----------------------------------------------------------------------------
-- 11. RUBRIC_TEMPLATES (Mẫu Rubric)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rubric_templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    grade_level INT NOT NULL DEFAULT 4,
    max_score NUMERIC(3, 1) NOT NULL DEFAULT 5.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 12. RUBRIC_CRITERIA (Tiêu chí Rubric chi tiết)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rubric_criteria (
    id VARCHAR(50) PRIMARY KEY,
    template_id VARCHAR(50) NOT NULL REFERENCES rubric_templates(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    weight NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
    order_index INT NOT NULL DEFAULT 0,
    level_1_desc TEXT NOT NULL, -- Cần hỗ trợ
    level_2_desc TEXT NOT NULL, -- Đang hình thành
    level_3_desc TEXT NOT NULL, -- Đạt yêu cầu
    level_4_desc TEXT NOT NULL  -- Vận dụng tốt
);

-- ----------------------------------------------------------------------------
-- 13. RUBRIC_ASSESSMENTS (Đánh giá Rubric bài viết)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rubric_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES assignment_submissions(id) ON DELETE CASCADE,
    assessed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    assessment_type VARCHAR(20) NOT NULL CHECK (assessment_type IN ('self', 'teacher')),
    overall_level INT NOT NULL CHECK (overall_level BETWEEN 1 AND 4),
    overall_score NUMERIC(3, 1) NOT NULL,
    overall_comment TEXT,
    scores_json JSONB NOT NULL,
    is_confirmed_by_teacher BOOLEAN NOT NULL DEFAULT FALSE,
    teacher_notes TEXT,
    assessed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 14. LEARNING_MATERIALS (Kho học liệu và bài văn mẫu)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS learning_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    skill VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('cau', 'doan', 'bai')),
    content TEXT NOT NULL,
    examples JSONB NOT NULL DEFAULT '[]'::jsonb,
    tips JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    views_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 15. MATERIAL_ASSIGNMENTS (Giao học liệu cho lớp)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS material_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID NOT NULL REFERENCES learning_materials(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_material_class UNIQUE (material_id, class_id)
);

-- ----------------------------------------------------------------------------
-- 16. GAMES (Danh mục trò chơi ngôn ngữ)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS games (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    min_grade INT NOT NULL DEFAULT 4,
    max_score INT NOT NULL DEFAULT 100,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ----------------------------------------------------------------------------
-- 17. GAME_ATTEMPTS (Lượt chơi và kết quả trò chơi)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS game_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id VARCHAR(50) NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    score INT NOT NULL,
    max_score INT NOT NULL,
    stars INT NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
    played_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 18. NOTIFICATIONS (Thông báo)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'alert')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 19. AUDIT_LOGS (Nhật ký kiểm toán an ninh)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_name VARCHAR(150) NOT NULL,
    actor_role VARCHAR(20) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 20. SYSTEM_SETTINGS (Cấu hình hệ thống toàn trường)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    current_school_year VARCHAR(50) NOT NULL DEFAULT '2025 - 2026',
    ai_strict_socratic_mode BOOLEAN NOT NULL DEFAULT TRUE,
    max_suggestions_per_turn INT NOT NULL DEFAULT 3,
    allow_student_self_assessment BOOLEAN NOT NULL DEFAULT TRUE,
    rubric_max_score NUMERIC(3, 1) NOT NULL DEFAULT 5.0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CHỈ MỤC B-TREE (INDEXES) TỐI ƯU TRUY VẤN
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_school_role ON profiles(school_id, role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_classes_school_year ON classes(school_id, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_class_memberships_class ON class_memberships(class_id);
CREATE INDEX IF NOT EXISTS idx_class_memberships_student ON class_memberships(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class_due ON writing_assignments(class_id, due_date);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_student ON assignment_submissions(assignment_id, student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_class_status ON assignment_submissions(class_id, status);
CREATE INDEX IF NOT EXISTS idx_versions_submission ON writing_versions(submission_id, version_number);
CREATE INDEX IF NOT EXISTS idx_assessments_submission ON rubric_assessments(submission_id);
CREATE INDEX IF NOT EXISTS idx_game_attempts_student ON game_attempts(student_id, game_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_date ON audit_logs(actor_id, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubric_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Chính sách cho Submissions:
-- Học sinh chỉ xem bài của mình
CREATE POLICY rls_submissions_student_select ON assignment_submissions
    FOR SELECT TO public
    USING (student_id = auth.uid());

-- Giáo viên xem bài của lớp mình phụ trách
CREATE POLICY rls_submissions_teacher_select ON assignment_submissions
    FOR SELECT TO public
    USING (
        EXISTS (
            SELECT 1 FROM classes c
            WHERE c.id = assignment_submissions.class_id
              AND c.lead_teacher_id = auth.uid()
        )
    );

-- Học sinh chỉ được thêm hoặc cập nhật bài của mình khi chưa nộp hoặc đang làm
CREATE POLICY rls_submissions_student_insert ON assignment_submissions
    FOR INSERT TO public
    WITH CHECK (student_id = auth.uid());

CREATE POLICY rls_submissions_student_update ON assignment_submissions
    FOR UPDATE TO public
    USING (student_id = auth.uid() AND status IN ('Đang làm', 'Bản nháp'));
