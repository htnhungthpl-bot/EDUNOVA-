import {
  User,
  ClassRoom,
  Assignment,
  Submission,
  Material,
  GameResult,
  AuditLog,
  AppNotification,
  AppSettings,
  RubricCriterionDefinition,
} from "../types";

import {
  defaultUsers,
  defaultClasses,
  defaultAssignments,
  defaultSubmissions,
  defaultMaterials,
  defaultGameResults,
  defaultAuditLogs,
  defaultNotifications,
  defaultSettings,
  defaultRubricDefinitions,
} from "../data/demoData";

const STORAGE_KEYS = {
  USERS: "edunova_demo_users_v2",
  CLASSES: "edunova_demo_classes_v2",
  ASSIGNMENTS: "edunova_demo_assignments_v2",
  SUBMISSIONS: "edunova_demo_submissions_v2",
  MATERIALS: "edunova_demo_materials_v2",
  GAME_RESULTS: "edunova_demo_games_v2",
  AUDIT_LOGS: "edunova_demo_audit_v2",
  NOTIFICATIONS: "edunova_demo_notifs_v2",
  SETTINGS: "edunova_demo_settings_v2",
  RUBRICS: "edunova_demo_rubrics_v2",
};

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}:`, e);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage for ${key}:`, e);
  }
}

export const demoStorage = {
  // Users
  getUsers(): User[] {
    return safeGet<User[]>(STORAGE_KEYS.USERS, defaultUsers);
  },
  saveUser(user: User): User[] {
    const list = this.getUsers();
    const idx = list.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      list[idx] = user;
    } else {
      list.push(user);
    }
    safeSet(STORAGE_KEYS.USERS, list);
    return list;
  },
  deleteUser(userId: string): User[] {
    const list = this.getUsers().filter((u) => u.id !== userId);
    safeSet(STORAGE_KEYS.USERS, list);
    return list;
  },

  // Classes
  getClasses(): ClassRoom[] {
    return safeGet<ClassRoom[]>(STORAGE_KEYS.CLASSES, defaultClasses);
  },
  saveClass(classroom: ClassRoom): ClassRoom[] {
    const list = this.getClasses();
    const idx = list.findIndex((c) => c.id === classroom.id);
    if (idx >= 0) {
      list[idx] = classroom;
    } else {
      list.push(classroom);
    }
    safeSet(STORAGE_KEYS.CLASSES, list);
    return list;
  },

  // Assignments
  getAssignments(): Assignment[] {
    return safeGet<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, defaultAssignments);
  },
  saveAssignment(asg: Assignment): Assignment[] {
    const list = this.getAssignments();
    const idx = list.findIndex((a) => a.id === asg.id);
    if (idx >= 0) {
      list[idx] = asg;
    } else {
      list.unshift(asg);
    }
    safeSet(STORAGE_KEYS.ASSIGNMENTS, list);
    return list;
  },
  deleteAssignment(asgId: string): Assignment[] {
    const list = this.getAssignments().filter((a) => a.id !== asgId);
    safeSet(STORAGE_KEYS.ASSIGNMENTS, list);
    return list;
  },

  // Submissions
  getSubmissions(): Submission[] {
    return safeGet<Submission[]>(STORAGE_KEYS.SUBMISSIONS, defaultSubmissions);
  },
  saveSubmission(sub: Submission): Submission[] {
    const list = this.getSubmissions();
    const idx = list.findIndex((s) => s.id === sub.id);
    if (idx >= 0) {
      list[idx] = sub;
    } else {
      list.unshift(sub);
    }
    safeSet(STORAGE_KEYS.SUBMISSIONS, list);
    return list;
  },

  // Materials
  getMaterials(): Material[] {
    return safeGet<Material[]>(STORAGE_KEYS.MATERIALS, defaultMaterials);
  },
  saveMaterial(mat: Material): Material[] {
    const list = this.getMaterials();
    const idx = list.findIndex((m) => m.id === mat.id);
    if (idx >= 0) {
      list[idx] = mat;
    } else {
      list.unshift(mat);
    }
    safeSet(STORAGE_KEYS.MATERIALS, list);
    return list;
  },
  deleteMaterial(matId: string): Material[] {
    const list = this.getMaterials().filter((m) => m.id !== matId);
    safeSet(STORAGE_KEYS.MATERIALS, list);
    return list;
  },

  // Games
  getGameResults(): GameResult[] {
    return safeGet<GameResult[]>(STORAGE_KEYS.GAME_RESULTS, defaultGameResults);
  },
  recordGameResult(record: GameResult): GameResult[] {
    const list = this.getGameResults();
    list.unshift(record);
    safeSet(STORAGE_KEYS.GAME_RESULTS, list);
    return list;
  },

  // Rubrics
  getRubricDefinitions(): RubricCriterionDefinition[] {
    return safeGet<RubricCriterionDefinition[]>(STORAGE_KEYS.RUBRICS, defaultRubricDefinitions);
  },
  saveRubricDefinitions(rubrics: RubricCriterionDefinition[]): RubricCriterionDefinition[] {
    safeSet(STORAGE_KEYS.RUBRICS, rubrics);
    return rubrics;
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return safeGet<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, defaultAuditLogs);
  },
  addAuditLog(action: string, actorName: string, actorRole: any, details: string): void {
    const list = this.getAuditLogs();
    const newLog: AuditLog = {
      id: "log-" + Date.now(),
      action,
      actorName,
      actorRole,
      details,
      timestamp: new Date().toLocaleString("vi-VN"),
    };
    list.unshift(newLog);
    if (list.length > 100) list.pop();
    safeSet(STORAGE_KEYS.AUDIT_LOGS, list);
  },

  // Notifications
  getNotifications(): AppNotification[] {
    return safeGet<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, defaultNotifications);
  },
  markNotificationRead(id: string): AppNotification[] {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    safeSet(STORAGE_KEYS.NOTIFICATIONS, list);
    return list;
  },
  markAllNotificationsRead(): AppNotification[] {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    safeSet(STORAGE_KEYS.NOTIFICATIONS, list);
    return list;
  },

  // Settings
  getSettings(): AppSettings {
    return safeGet<AppSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
  },
  saveSettings(settings: AppSettings): AppSettings {
    safeSet(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  },

  // Reset to original clean seed data
  resetAllToDefaults(): void {
    safeSet(STORAGE_KEYS.USERS, defaultUsers);
    safeSet(STORAGE_KEYS.CLASSES, defaultClasses);
    safeSet(STORAGE_KEYS.ASSIGNMENTS, defaultAssignments);
    safeSet(STORAGE_KEYS.SUBMISSIONS, defaultSubmissions);
    safeSet(STORAGE_KEYS.MATERIALS, defaultMaterials);
    safeSet(STORAGE_KEYS.GAME_RESULTS, defaultGameResults);
    safeSet(STORAGE_KEYS.AUDIT_LOGS, defaultAuditLogs);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, defaultNotifications);
    safeSet(STORAGE_KEYS.SETTINGS, defaultSettings);
    safeSet(STORAGE_KEYS.RUBRICS, defaultRubricDefinitions);
  },
};
