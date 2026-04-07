import type { Tables, TablesInsert } from "@/integrations/supabase/types";

import { supabase } from "@/integrations/supabase/client";

export type Lead = Tables<"leads">;
export type LeadInsert = TablesInsert<"leads">;

export async function fetchLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function createLead(leadData: LeadInsert) {
  const { data, error } = await supabase.from("leads").insert(leadData).select().single();

  if (error) throw error;

  try {
    await supabase.functions.invoke("notify-lead", { body: leadData });
  } catch (notifyError) {
    console.error("notify-lead failed:", notifyError);
  }

  return data;
}
