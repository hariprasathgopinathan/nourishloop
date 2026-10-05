import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function authFetch(url, options = {}) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    const error = new Error("Authentication required.");
    error.status = 401;
    throw error;
  }

  const token = await currentUser.getIdToken();
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(url, { ...options, headers });
  
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error((data && (data.error || data.message)) || `HTTP error ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function getMe() {
  return await authFetch(`${API_BASE_URL}/auth/me`);
}

export async function createProfile(profileData) {
  return await authFetch(`${API_BASE_URL}/auth/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
}

export async function createDonation(donationData) {
  return await authFetch(`${API_BASE_URL}/donations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donationData),
  });
}

export async function getMyDonations() {
  return await authFetch(`${API_BASE_URL}/donations/mine`);
}

export async function getAvailableDonations() {
  return await authFetch(`${API_BASE_URL}/donations`);
}

export async function claimDonation(donationId) {
  return await authFetch(`${API_BASE_URL}/donations/${donationId}/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getMyClaims() {
  return await authFetch(`${API_BASE_URL}/donations/my-claims`);
}

export async function markReadyForPickup(donationId) {
  return await authFetch(`${API_BASE_URL}/donations/${donationId}/ready-for-pickup`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function markPickedUp(donationId) {
  return await authFetch(`${API_BASE_URL}/donations/${donationId}/picked-up`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function updateProfileLocation(latitude, longitude) {
  return await authFetch(`${API_BASE_URL}/auth/profile/location`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ latitude, longitude }),
  });
}

export async function getNearbyDonations(radiusKm) {
  const query = radiusKm ? `?radiusKm=${radiusKm}` : '';
  return await authFetch(`${API_BASE_URL}/donations/nearby${query}`);
}

export async function getDonationRoute(donationId) {
  return await authFetch(`${API_BASE_URL}/donations/${donationId}/route`);
}

export async function getNotifications() {
  return await authFetch(`${API_BASE_URL}/notifications`);
}

export async function markNotificationAsRead(id) {
  return await authFetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: 'PATCH'
  });
}

export async function markAllNotificationsAsRead() {
  return await authFetch(`${API_BASE_URL}/notifications/read-all`, {
    method: 'PATCH'
  });
}
