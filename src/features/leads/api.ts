import type { Tables, TablesInsert } from "@/integrations/supabase/types";

import { supabase } from "@/integrations/supabase/client";

export type Lead = Tables<"leads">;
export type LeadInsert = TablesInsert<"leads">;
export interface LeadSubmissionPayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  interest: string;
  message: string | null;
  honeypot: string;
  startedAt: number;
  guideKey?: string;
}

export async function fetchLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function createLead(leadData: LeadSubmissionPayload) {
  const { data, error } = await supabase.functions.invoke("submit-lead", {
    body: leadData,
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);

  return data ?? null;
}
