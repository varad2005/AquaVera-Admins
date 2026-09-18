import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WaterRequest, RequestStatus, Log, User } from '@/data/mock-data';
import { API_BASE_URL } from '@/lib/api-config';
import { apiFetch } from '@/lib/api-fetch';

// ── Requests ──────────────────────────────────────────────────────────────────

export function useRequests(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['requests', page, limit],
    queryFn: async () => {
      const res = await apiFetch(`/api/requests?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch requests');
      const json = await res.json();
      // Support both paginated { data, pagination } and legacy flat array
      const data: WaterRequest[] = Array.isArray(json) ? json : (json.data ?? []);
      return data.sort(
        (a: WaterRequest, b: WaterRequest) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: ['requests', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/requests/${id}`);
      if (!res.ok) throw new Error('Not found');
      return res.json();
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RequestStatus }) => {
      const res = await apiFetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update request');
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['requests', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

export function useAddRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: any) => {
      const res = await apiFetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create request');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

// ── Users ─────────────────────────────────────────────────────────────────────

export function useUsers(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: async () => {
      const res = await apiFetch(`/api/users?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const json = await res.json();
      // Support both paginated { data, pagination } and legacy flat array
      return Array.isArray(json) ? json : (json.data ?? []);
    },
  });
}

export function useAddUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: Omit<User, 'id' | 'lastLogin'>) => {
      const res = await apiFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error('Failed to add user');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...user }: Partial<User> & { id: string }) => {
      const res = await apiFetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error('Failed to update user');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete user');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

// ── Logs ──────────────────────────────────────────────────────────────────────

export function useLogs(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['logs', page, limit],
    queryFn: async () => {
      const res = await apiFetch(`${API_BASE_URL}/logs?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      const json = await res.json();
      return Array.isArray(json) ? json : (json.data ?? []);
    },
  });
}

// ── Farmers ───────────────────────────────────────────────────────────────────

export function useFarmers(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['farmers', page, limit],
    queryFn: async () => {
      const res = await apiFetch(`${API_BASE_URL}/farmers?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch farmers');
      const json = await res.json();
      return Array.isArray(json) ? json : (json.data ?? []);
    },
  });
}

// ── Upload ────────────────────────────────────────────────────────────────────

export function useUploadEvidence() {
  return useMutation({
    mutationFn: async ({ file, requestId }: { file: File; requestId: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('requestId', requestId);
      const res = await apiFetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }
      return res.json() as Promise<{
        path: string;
        mime: string;
        size: number;
        originalName: string;
      }>;
    },
  });
}
