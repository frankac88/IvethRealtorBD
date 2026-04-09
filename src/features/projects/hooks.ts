import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createProject, deleteProject, fetchProjects, updateProject, type SaveProjectPayload } from "./api";

export const projectsQueryKeys = {
  all: ["projects"] as const,
  published: ["projects", "published"] as const,
  admin: ["projects", "admin"] as const,
};

export function usePublishedProjectsQuery() {
  return useQuery({
    queryKey: projectsQueryKeys.published,
    queryFn: () => fetchProjects(false),
    retry: false,
  });
}

export function useAdminProjectsQuery(enabled = true) {
  return useQuery({
    queryKey: projectsQueryKeys.admin,
    queryFn: () => fetchProjects(true),
    enabled,
    retry: false,
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveProjectPayload) => createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.all });
    },
  });
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: SaveProjectPayload }) =>
      updateProject(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.all });
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.all });
    },
  });
}
