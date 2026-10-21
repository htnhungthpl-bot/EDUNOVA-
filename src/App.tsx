import React, { useState, useEffect } from "react";
import { User, Assignment } from "./types";
import { api } from "./services/api";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";
import { HomeView } from "./views/HomeView";
import { WritingCoachView } from "./views/WritingCoachView";
import { MaterialsView } from "./views/MaterialsView";
import { AssignmentsView } from "./views/AssignmentsView";
import { GamesView } from "./views/GamesView";
import { TeacherDashboardView } from "./views/TeacherDashboardView";
import { AdminDashboardView } from "./views/AdminDashboardView";
import { ScanRubricView } from "./views/ScanRubricView";
import { PromptsLibraryView } from "./views/PromptsLibraryView";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: "std-001",
    name: "Nguyễn Minh An",
    role: "student",
    email: "hocsinh@edunova.edu.vn",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    classId: "class-4a1",
    schoolName: "Trường Tiểu học Chu Văn An",
  });

  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [aiConnected, setAiConnected] = useState<boolean>(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Extra props for WritingCoachView
  const [writingAssignment, setWritingAssignment] = useState<Assignment | null>(null);
  const [writingLevel, setWritingLevel] = useState<"cau" | "doan" | "bai">("doan");
  const [writingInitialContent, setWritingInitialContent] = useState<string>("");
  const [gamesSubTab, setGamesSubTab] = useState<"arena-100" | "mini-games">("mini-games");

  // Initial load
  useEffect(() => {
    async function init() {
      try {
        const [usersRes, statusRes, asgRes] = await Promise.all([
          api.getUsers(),
          api.getStatus(),
          api.getAssignments(),
        ]);
        if (usersRes.users && usersRes.users.length > 0) {
          setAvailableUsers(usersRes.users);
          // Set to student 1 by default
          const defaultStd = usersRes.users.find((u) => u.email === "hocsinh@edunova.edu.vn") || usersRes.users[0];
          setCurrentUser(defaultStd);
        }
        if (statusRes) {
          setAiConnected(statusRes.aiConnected);
        }
        if (asgRes.assignments) {
          setAssignments(asgRes.assignments);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      }
    }
    init();
  }, []);

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    // If student switched from teacher/admin tab, redirect to home or assignments
    if (user.role === "student" && (currentTab === "teacher" || currentTab === "admin")) {
      setCurrentTab("home");
    }
  };

  const handleLoginCustom = async (credentials: any) => {
    const res = await api.login(credentials);
    setCurrentUser(res.user);
    if (!availableUsers.some((u) => u.id === res.user.id)) {
      setAvailableUsers((prev) => [...prev, res.user]);
    }
    return res;
  };

  const handleRegisterCustom = async (data: { name: string; email: string; role: string; classId?: string }) => {
    const res = await api.register(data);
    setCurrentUser(res.user);
    setAvailableUsers((prev) => [...prev, res.user]);
  };

  const handleSelectTab = (tab: string) => {
    if (tab === "teacher" && currentUser.role === "student") {
      const teacher = availableUsers.find((u) => u.role === "teacher");
      if (teacher) {
        setCurrentUser(teacher);
      }
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (tab: string, extraData?: any) => {
    if (tab === "teacher" && currentUser.role === "student") {
      const teacher = availableUsers.find((u) => u.role === "teacher");
      if (teacher) {
        setCurrentUser(teacher);
      }
    }
    if (extraData) {
      if (extraData.content) {
        setWritingInitialContent(extraData.content);
      }
      if (extraData.gamesTab) {
        setGamesSubTab(extraData.gamesTab);
      }
      if (extraData.assignment) {
        setWritingAssignment(extraData.assignment);
        setWritingLevel(extraData.assignment.level);
      } else if (extraData.level) {
        setWritingLevel(extraData.level);
        if (!extraData.assignment) {
          setWritingAssignment(null);
        }
      }
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDoAssignment = (asg: Assignment) => {
    setWritingAssignment(asg);
    setWritingLevel(asg.level);
    setWritingInitialContent("");
    setCurrentTab("writing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      <Header
        currentUser={currentUser}
        availableUsers={availableUsers}
        onSelectUser={handleSelectUser}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        aiConnected={aiConnected}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        {currentTab === "home" && (
          <HomeView
            currentUser={currentUser}
            onNavigate={handleNavigate}
            assignments={assignments}
            availableUsers={availableUsers}
            onSelectUser={handleSelectUser}
            onLoginCustom={handleLoginCustom}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        )}

        {currentTab === "prompts" && (
          <PromptsLibraryView
            currentUser={currentUser}
            onSelectPromptForWriting={(prompt) => {
              setWritingAssignment({
                id: "prompt-" + prompt.id,
                title: prompt.title,
                prompt: prompt.prompt,
                level: prompt.level,
                topic: prompt.topic,
                classId: currentUser.classId || "class-4a1",
                status: "Đang thực hiện",
                dueDate: "Theo tiến độ tự học",
                rubricTemplateId: "rubric-grade4-standard",
                guidelines: [
                  ...prompt.stepByStepGuide.step1Understanding.keyElements,
                  ...(prompt.stepByStepGuide.step4VocabularyAndFigurative.comparisons.slice(0, 1) || []),
                ],
                targetWords: prompt.targetWords,
              });
              setWritingLevel(prompt.level);
              setWritingInitialContent("");
              setCurrentTab("writing");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onSelectPromptForScan={(prompt) => {
              setWritingAssignment({
                id: "prompt-" + prompt.id,
                title: prompt.title,
                prompt: prompt.prompt,
                level: prompt.level,
                topic: prompt.topic,
                classId: currentUser.classId || "class-4a1",
                status: "Đang thực hiện",
                dueDate: "Theo tiến độ tự học",
                rubricTemplateId: "rubric-grade4-standard",
                guidelines: prompt.stepByStepGuide.step1Understanding.keyElements,
                targetWords: prompt.targetWords,
              });
              setWritingLevel(prompt.level);
              setCurrentTab("scan");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onBackToHome={() => setCurrentTab("home")}
          />
        )}

        {currentTab === "writing" && (
          <WritingCoachView
            key={(writingAssignment?.id || writingLevel) + "-" + (writingInitialContent ? "scanned" : "fresh")}
            currentUser={currentUser}
            initialAssignment={writingAssignment}
            initialLevel={writingLevel}
            initialContent={writingInitialContent}
            onBackToHome={() => setCurrentTab("home")}
            onOpenScan={() => setCurrentTab("scan")}
            onOpenPrompts={() => setCurrentTab("prompts")}
          />
        )}

        {currentTab === "scan" && (
          <ScanRubricView
            key={writingAssignment?.id || "scan"}
            currentUser={currentUser}
            onNavigateToWriting={(content, assignmentTitle, lvl) => {
              setWritingInitialContent(content);
              setWritingLevel(lvl);
              setWritingAssignment({
                id: "scan-" + Date.now(),
                title: assignmentTitle,
                prompt: assignmentTitle,
                level: lvl,
                topic: "Tập làm văn miêu tả",
                classId: currentUser.classId || "class-4a1",
                status: "Đang thực hiện",
                dueDate: "Hôm nay",
                rubricTemplateId: "rubric-gdpt-lop4",
                guidelines: ["Quan sát sự vật", "Vận dụng so sánh, nhân hóa", "Sửa lỗi chính tả"],
                targetWords: 80,
              });
              setCurrentTab("writing");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onBackToHome={() => setCurrentTab("home")}
            initialAssignment={writingAssignment}
          />
        )}

        {currentTab === "materials" && (
          <MaterialsView
            currentUser={currentUser}
            onSelectForWriting={(mat) => {
              setWritingLevel(mat.level);
              setCurrentTab("writing");
            }}
          />
        )}

        {currentTab === "assignments" && (
          <AssignmentsView
            currentUser={currentUser}
            onDoAssignment={handleDoAssignment}
          />
        )}

        {currentTab === "games" && (
          <GamesView currentUser={currentUser} initialTab={gamesSubTab} />
        )}

        {currentTab === "teacher" && (
          <TeacherDashboardView currentUser={currentUser} />
        )}

        {currentTab === "admin" && (
          <AdminDashboardView currentUser={currentUser} />
        )}
      </main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        availableUsers={availableUsers}
        onSelectUser={handleSelectUser}
        onLoginCustom={handleLoginCustom}
        onRegisterCustom={handleRegisterCustom}
      />
    </div>
  );
}
