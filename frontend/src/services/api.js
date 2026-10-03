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
