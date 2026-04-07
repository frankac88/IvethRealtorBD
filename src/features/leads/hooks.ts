import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createLead, fetchLeads, type LeadInsert } from "./api";

export const leadsQueryKeys = {
  all: ["leads"] as const,
  list: ["leads", "list"] as const,
};

export function useLeadsQuery(enabled = true) {
  return useQuery({
    queryKey: leadsQueryKeys.list,
    queryFn: fetchLeads,
    enabled,
  });
}

export function useCreateLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leadData: LeadInsert) => createLead(leadData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadsQueryKeys.all });
    },
  });
}
