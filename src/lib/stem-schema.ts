// src/lib/stem-schema.ts
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

/* -------------------------------------------------------------------------- */
/*  Enum / konstanta                                                          */
/* -------------------------------------------------------------------------- */

export const STEM_SUBJECTS = ["umum", "kuantitatif", "matematika", "custom"] as const;
export const STEM_DIFFICULTIES = ["easy", "medium", "hard", "hots"] as const;
export const STEM_MODES = ["relaxed", "exam"] as const;

export type StemSubject = (typeof STEM_SUBJECTS)[number];
export type StemDifficulty = (typeof STEM_DIFFICULTIES)[number];
export type StemMode = (typeof STEM_MODES)[number];

export const SubjectSchema = z.enum(STEM_SUBJECTS);
export const DifficultySchema = z.enum(STEM_DIFFICULTIES);
export const ModeSchema = z.enum(STEM_MODES);

/* -------------------------------------------------------------------------- */
/*  Row types (sinkron dengan migration SQL)                                  */
/* -------------------------------------------------------------------------- */

export type StemSessionRow = {
  id: string;
  user_id: string;
  subject: StemSubject;
  difficulty: StemDifficulty;
  mode: StemMode;
  topic: string | null;
  total_questions: number;
  correct_count: number;
  score: number;
  duration_sec: number;
  time_limit_sec: number | null;
  started_at: string;
  ended_at: string | null;
  metadata: Record<string, unknown>;
};

export type StemQuestionRow = {
  id: string;
  session_id: string;
  user_id: string;
  ord: number;
  question_text: string;
  type: "mc" | "num";
  options: string[];
  correct_answer: string;
  user_answer: string | null;
  is_correct: boolean | null;
  hints: string[];
  solution: string;
  topic: string;
  time_spent_sec: number;
  created_at: string;
};

export type WeaknessRow = {
  user_id: string;
  subject: StemSubject;
  topic: string;
  attempts: number;
  correct: number;
  accuracy_pct: number;
  last_seen: string;
};

/* -------------------------------------------------------------------------- */
/*  Insert payloads — hanya field yang boleh di-set CLIENT saat INSERT        */
/*  (id, user_id, started_at, ended_at di-handle DB / diisi belakangan)       */
/* -------------------------------------------------------------------------- */

export type StemSessionInsert = {
  subject: StemSubject;
  difficulty: StemDifficulty;
  mode: StemMode;
  topic: string | null;
  time_limit_sec: number | null;
  total_questions?: number;             // DEFAULT 0 di SQL
  correct_count?: number;               // DEFAULT 0 di SQL
  score?: number;                       // DEFAULT 0.00 di SQL
  duration_sec?: number;                // DEFAULT 0 di SQL
  metadata?: Record<string, unknown>;   // DEFAULT '{}' di SQL
};

export type StemQuestionInsert = {
  session_id: string;
  ord: number;
  question_text: string;
  type: "mc" | "num";
  options: string[];
  correct_answer: string;
  hints: string[];
  solution: string;
  topic: string;
  user_answer?: string | null;          // DEFAULT NULL di SQL
  is_correct?: boolean | null;          // DEFAULT NULL di SQL
  time_spent_sec?: number;              // DEFAULT 0 di SQL
};

/* -------------------------------------------------------------------------- */
/*  Update payloads — kontrak terpisah dari Insert                            */
/* -------------------------------------------------------------------------- */

export type StemSessionUpdate = {
  subject?: StemSubject;
  difficulty?: StemDifficulty;
  mode?: StemMode;
  topic?: string | null;
  total_questions?: number;
  correct_count?: number;
  score?: number;
  duration_sec?: number;
  time_limit_sec?: number | null;
  ended_at?: string | null;
  metadata?: Record<string, unknown>;
};

export type StemQuestionUpdate = {
  user_answer?: string | null;
  is_correct?: boolean | null;
  time_spent_sec?: number;
};

/* -------------------------------------------------------------------------- */
/*  Tipe Supabase client khusus tabel STEM                                    */
/*  → sampai `types.ts` di-regenerate, kita cast `supabase as StemDb`.        */
/*  Setelah regen, ganti cast dengan import `Database` langsung (1 baris).    */
/* -------------------------------------------------------------------------- */

export type StemDatabase = {
  public: {
    Tables: {
      stem_quiz_sessions: {
        Row: StemSessionRow;
        Insert: StemSessionInsert;
        Update: StemSessionUpdate;
        Relationships: [];
      };
      stem_quiz_questions: {
        Row: StemQuestionRow;
        Insert: StemQuestionInsert;
        Update: StemQuestionUpdate;
        Relationships: [];
      };
    };
    Views: {
      stem_weakness: {
        Row: WeaknessRow;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type StemDb = SupabaseClient<StemDatabase>;

/* -------------------------------------------------------------------------- */
/*  Payload runtime (dipakai UI <-> DB)                                       */
/* -------------------------------------------------------------------------- */

export type SessionStartPayload = {
  subject: StemSubject;
  difficulty: StemDifficulty;
  mode: StemMode;
  topic: string | null;
  timeLimitSec: number | null;
};

export type SessionFinishPayload = {
  sessionId: string;
  correctCount: number;
  totalQuestions: number;
  durationSec: number;
};

export const SessionStartSchema = z.object({
  subject: SubjectSchema,
  difficulty: DifficultySchema,
  mode: ModeSchema,
  topic: z.string().max(400).nullable(),
  timeLimitSec: z.number().int().positive().nullable(),
});

export const SessionFinishSchema = z.object({
  sessionId: z.string().uuid(),
  correctCount: z.number().int().min(0),
  totalQuestions: z.number().int().min(1),
  durationSec: z.number().int().min(0),
});

/** Hitung skor 0–100 dari rasio benar/total. */
export function computeScore(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 10000) / 100;
}