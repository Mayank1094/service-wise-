export type BackendStatus = 'idle' | 'warming' | 'ready' | 'offline';

type StatusListener = (status: BackendStatus) => void;

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://servicewise-api.onrender.com';

let currentStatus: BackendStatus = 'idle';
let warmupPromise: Promise<boolean> | null = null;
const listeners = new Set<StatusListener>();

export function getBackendStatus(): BackendStatus {
  return currentStatus;
}

function setStatus(status: BackendStatus) {
  if (currentStatus !== status) {
    currentStatus = status;
    listeners.forEach((listener) => {
      try {
        listener(status);
      } catch (err) {
        console.error('Error in status listener:', err);
      }
    });
  }
}

/**
 * Subscribe to backend warm-up status updates.
 */
export function subscribeBackendStatus(listener: StatusListener): () => void {
  listeners.add(listener);
  listener(currentStatus);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Triggers a non-blocking background ping to wake up the Render free tier backend.
 * Uses sessionStorage throttling so repeated page transitions don't flood the server.
 */
export async function warmUpBackend(force = false): Promise<boolean> {
  // If already confirmed ready and not forced, skip
  if (!force && currentStatus === 'ready') {
    return true;
  }

  // If already in flight, reuse existing promise
  if (warmupPromise) {
    return warmupPromise;
  }

  // Throttle using sessionStorage (skip if pinged within the last 5 minutes)
  const lastWarmup = sessionStorage.getItem('servicewise_last_warmup');
  const now = Date.now();
  if (!force && lastWarmup && now - parseInt(lastWarmup, 10) < 5 * 60 * 1000) {
    if (currentStatus === 'ready') return true;
  }

  setStatus('warming');

  const endpoints: string[] = [];
  if (import.meta.env.DEV) {
    endpoints.push('http://localhost:8000/health');
  }
  const cleanBase = API_BASE_URL.replace(/\/+$/, '');
  const remoteHealth = cleanBase.endsWith('/health') ? cleanBase : `${cleanBase}/health`;
  if (!endpoints.includes(remoteHealth)) {
    endpoints.push(remoteHealth);
  }

  warmupPromise = (async () => {
    try {
      for (const url of endpoints) {
        try {
          const controller = new AbortController();
          // Render free spin-up can take up to 45 seconds on cold start
          const timeoutId = setTimeout(() => controller.abort(), 45000);

          const res = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            },
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            setStatus('ready');
            sessionStorage.setItem('servicewise_last_warmup', Date.now().toString());
            return true;
          }
        } catch {
          // Endpoint timed out or unreachable, try fallback endpoint
        }
      }

      setStatus('offline');
      return false;
    } catch {
      setStatus('offline');
      return false;
    } finally {
      warmupPromise = null;
    }
  })();

  return warmupPromise;
}
