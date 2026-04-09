import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getSession, signInWithPassword, signOut, subscribeToAuthChanges, type SignInCredentials } from "./api";

export const authQueryKeys = {
  session: ["auth", "session"] as const,
};

export function useAuthSession() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = subscribeToAuthChanges((session) => {
      queryClient.setQueryData(authQueryKeys.session, session);
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: authQueryKeys.session,
    queryFn: getSession,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: SignInCredentials) => signInWithPassword(credentials),
    onSuccess: (session) => {
      queryClient.setQueryData(authQueryKeys.session, session);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.session, null);
      queryClient.removeQueries({ queryKey: ["leads"] });
      queryClient.removeQueries({ queryKey: ["projects"] });
    },
  });
}
