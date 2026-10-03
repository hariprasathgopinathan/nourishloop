const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createDonation(donationData) {
  try {
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donationData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to create donation');
    }

    return data;
  } catch (error) {
    // Re-throw the error so the component can handle it
    throw error;
  }
}

export async function getMyDonations(donorId) {
  try {
    const response = await fetch(`${API_BASE_URL}/donations/mine?donorId=${donorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to fetch donations');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAvailableDonations() {
  try {
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to fetch available donations');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function claimDonation(donationId, ngoId) {
  try {
    const response = await fetch(`${API_BASE_URL}/donations/${donationId}/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ngoId }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Pass the status code along with the message so components can handle 409 vs 404
      const error = new Error(data.error || data.message || 'Failed to claim donation');
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}
