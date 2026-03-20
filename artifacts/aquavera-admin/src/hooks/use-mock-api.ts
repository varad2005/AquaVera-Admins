import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_REQUESTS, MOCK_USERS, MOCK_LOGS, WaterRequest, RequestStatus } from '@/data/mock-data';

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store to allow mutations to persist during the session
let store = {
  requests: [...MOCK_REQUESTS],
  users: [...MOCK_USERS],
  logs: [...MOCK_LOGS]
};

// --- Requests ---
export function useRequests() {
  return useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      await delay(600);
      return [...store.requests].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: ['requests', id],
    queryFn: async () => {
      await delay(400);
      const req = store.requests.find(r => r.id === id);
      if (!req) throw new Error('Not found');
      return req;
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RequestStatus }) => {
      await delay(800);
      store.requests = store.requests.map(r => 
        r.id === id ? { ...r, status } : r
      );
      
      // Add audit log
      store.logs.unshift({
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'Current User',
        action: `Changed status of ${id} to ${status}`,
        ip: '192.168.1.1',
        role: 'Admin'
      });
      
      return store.requests.find(r => r.id === id);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['requests', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

// --- Users ---
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      await delay(500);
      return store.users;
    },
  });
}

// --- Logs ---
export function useLogs() {
  return useQuery({
    queryKey: ['logs'],
    queryFn: async () => {
      await delay(500);
      return store.logs;
    },
  });
}
