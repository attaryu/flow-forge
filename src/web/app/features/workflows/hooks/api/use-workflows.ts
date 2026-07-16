import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "~/shared/utils/http";
import { getToken } from "~/shared/utils/session";
import type { Workflow, CreateWorkflowInput, UpdateWorkflowInput } from "../../types";

export const workflowsQueryOption = queryOptions({
  queryKey: ["workflows"],
  queryFn: async () => {
    const token = getToken();
    if (!token) return [];
    try {
      const res = await http.get("workflows").json<Workflow[]>();
      return res;
    } catch {
      return [];
    }
  },
});

export const workflowQueryOption = (id: string) =>
  queryOptions({
    queryKey: ["workflows", id],
    queryFn: async () => {
      const token = getToken();
      if (!token) return null;
      try {
        const res = await http.get(`workflows/${id}`).json<Workflow>();
        return res;
      } catch {
        return null;
      }
    },
    enabled: !!id,
  });

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateWorkflowInput) => {
      return http.post("workflows", { json: data }).json<Workflow>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
}

export function useUpdateWorkflow(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateWorkflowInput) => {
      return http.patch(`workflows/${id}`, { json: data }).json<Workflow>();
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["workflows", id] });
    },
  });
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`workflows/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
}
