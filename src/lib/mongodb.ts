async function callFunction<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/.netlify/functions/${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  let result: any = null;
  try {
    result = await response.json();
  } catch {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || 'Request failed');
  }

  return result as T;
}

export async function insertRegistration(registrationData: any) {
  return callFunction<{ success: boolean; registrationId: string; message: string }>('register', {
    method: 'POST',
    body: JSON.stringify(registrationData)
  });
}

export async function getAllRegistrations() {
  const result = await callFunction<{ success: boolean; data: any[] }>('registrations');
  return Array.isArray(result.data) ? result.data : [];
}

export async function getRegistrationStats() {
  const result = await callFunction<{
    success: boolean;
    stats: {
      totalRegistrations: number;
      day1Count: number;
      day2Count: number;
      totalRevenue: number;
    };
  }>('stats');
  return result.stats;
}

export async function adminLogin(password: string) {
  return callFunction<{ success: boolean }>('admin-login', {
    method: 'POST',
    body: JSON.stringify({ password })
  });
}