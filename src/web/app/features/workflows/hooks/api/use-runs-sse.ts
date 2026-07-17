import { useEffect, useState } from "react";
import { getToken } from "~/shared/utils/session";
import { getActiveOrgId } from "~/shared/utils/active-org";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export interface SSEEvent {
  type: "step_started" | "step_completed" | "step_failed" | "workflow_done";
  nodeId?: string;
  stepType?: string;
  status?: "success" | "failed";
  output?: any;
  error?: string;
  durationMs?: number;
  retryCount?: number;
  runId?: string;
  totalDurationMs?: number;
  timestamp?: string;
}

/**
 * Custom React hook untuk berlangganan ke live events (SSE) dari workflow run tertentu.
 * Token JWT dikirim melalui query parameter 'token' karena EventSource bawaan tidak mendukung custom headers.
 * Memastikan koneksi ditutup secara otomatis saat komponen unmount.
 */
export function useWorkflowRunSSE(runId: string | null) {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [workflowStatus, setWorkflowStatus] = useState<"pending" | "running" | "success" | "failed">("pending");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state setiap kali runId berganti untuk menghindari kebocoran log antar run
    setEvents([]);
    setWorkflowStatus("pending");
    setError(null);

    if (!runId) return;

    const token = getToken();
    const orgId = getActiveOrgId();
    
    // Siapkan URL koneksi dengan token auth di query param
    let sseUrl = `${API_URL}/runs/${runId}/events?token=${encodeURIComponent(token || "")}`;
    if (orgId) {
      sseUrl += `&orgId=${encodeURIComponent(orgId)}`;
    }

    const eventSource = new EventSource(sseUrl);

    eventSource.onopen = () => {
      setWorkflowStatus("running");
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const payload: SSEEvent = JSON.parse(event.data);
        setEvents((prev) => [...prev, payload]);

        if (payload.type === "workflow_done") {
          setWorkflowStatus(payload.status || "success");
          eventSource.close();
        }
      } catch (err: any) {
        console.error("Failed to parse SSE event data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection error:", err);
      setError("SSE connection closed or failed. Polling fallback should be used.");
      setWorkflowStatus("failed");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [runId]);

  return { events, workflowStatus, error };
}
