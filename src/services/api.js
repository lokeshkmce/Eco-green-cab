/**
 * EcoGreenCab — Central API Service Layer
 * Base URL: http://affecting-tingling-duke.ngrok-free.dev/ecogreencab/
 *
 * Endpoints:
 *  POST   /user/create/                  → Create user (register/login)
 *  GET    /users/                         → List all users (admin)
 *  DELETE /user/<id>/delete/              → Delete a user (admin)
 *  POST   /rental-car/create/             → Submit an EV listing (owner)
 *  GET    /rental-cars/                   → List all rental cars
 *  PATCH  /rental-car/<id>/status/        → Update car status (admin)
 *  GET    /bookings/                      → List all bookings (admin)
 *  POST   /bookings/                      → Create a booking (renter)
 *  GET    /contact/message/               → List messages (admin)
 *  POST   /contact/message/               → Submit contact message
 *  POST   /contact/message/<id>/reply/    → Reply to a message (admin)
 */

import { API_BASE_URL } from '../config';

// ─── Shared fetch helper ────────────────────────────────────────────────────

const BASE = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;

async function apiFetch(path, options = {}) {
  const url = `${BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    // Handle no-content responses (e.g., DELETE 204)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return { ok: true, status: response.status, data: null };
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return { ok: false, status: response.status, error: data || `HTTP ${response.status}` };
    }

    return { ok: true, status: response.status, data };
  } catch (err) {
    console.error(`[API] Network error on ${url}:`, err);
    return { ok: false, status: 0, error: err.message || 'Network error' };
  }
}

// ─── User API ───────────────────────────────────────────────────────────────

/**
 * Create / register a user with the backend.
 * Called after OTP verification in AuthModal when a role is selected.
 *
 * @param {{ name: string, phone: string, role: 'renter' | 'owner' }} userData
 * @returns {Promise<{ ok: boolean, data: { id, name, phone, role, roles } | null, error: any }>}
 */
export async function createUser(userData) {
  return apiFetch('user/create/', {
    method: 'POST',
    body: JSON.stringify({
      name: userData.name,
      phone: userData.phone,
      role: userData.role,
    }),
  });
}

/**
 * Fetch all registered users (Admin only).
 * Response is either a single object or an array — normalised to always return an array.
 *
 * @returns {Promise<{ ok: boolean, data: Array<{ id, name, phone, role, roles }> | null, error: any }>}
 */
export async function fetchUsers() {
  const result = await apiFetch('users/');
  if (result.ok && result.data) {
    // Backend currently returns a single object when there is 1 user — normalise it
    result.data = Array.isArray(result.data) ? result.data : [result.data];
  }
  return result;
}

/**
 * Delete a user by ID (Admin only).
 *
 * @param {number} userId
 * @returns {Promise<{ ok: boolean, data: null, error: any }>}
 */
export async function deleteUser(userId) {
  return apiFetch(`user/${userId}/delete/`, { method: 'DELETE' });
}

// ─── Rental Car API ─────────────────────────────────────────────────────────

/**
 * Submit a new EV listing (Owner).
 *
 * @param {{
 *   rental_person: number,   // User ID of the owner
 *   car_brand: string,
 *   car_model: string,
 *   car_year: string | number,
 *   car_type: string,
 *   description: string,
 *   daily_rate: string | number,
 *   city: string,
 *   location: string
 * }} carData
 * @returns {Promise<{ ok: boolean, data: object | null, error: any }>}
 */
export async function createRentalCar(carData) {
  return apiFetch('rental-car/create/', {
    method: 'POST',
    body: JSON.stringify({
      rental_person: carData.rental_person,
      car_brand: carData.car_brand,
      car_model: carData.car_model,
      car_year: carData.car_year,
      car_type: carData.car_type,
      description: carData.description,
      daily_rate: carData.daily_rate,
      city: carData.city,
      location: carData.location,
    }),
  });
}

/**
 * Fetch all rental cars.
 * Response is normalised to always return an array.
 *
 * @returns {Promise<{ ok: boolean, data: Array<object> | null, error: any }>}
 */
export async function fetchRentalCars() {
  const result = await apiFetch('rental-cars/');
  if (result.ok && result.data) {
    result.data = Array.isArray(result.data) ? result.data : [result.data];
  }
  return result;
}

/**
 * Update the status of a rental car listing (Admin).
 *
 * @param {number} carId
 * @param {{ status: 'APPROVED' | 'REJECTED' | 'PENDING' | 'COUNTERED', price?: number }} payload
 * @returns {Promise<{ ok: boolean, data: object | null, error: any }>}
 */
export async function updateCarStatus(carId, payload) {
  return apiFetch(`rental-car/${carId}/status/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// ─── Booking API ─────────────────────────────────────────────────────────────

/**
 * Create a new booking (Renter).
 *
 * @param {{
 *   booking_id: string,
 *   carId: string | number,
 *   carName: string,
 *   renterName: string,
 *   renterEmail: string,
 *   startDate: string,    // ISO date: YYYY-MM-DD
 *   endDate: string,      // ISO date: YYYY-MM-DD
 *   total: string | number,
 *   drivingLicenseUploaded: boolean,
 *   status?: string       // Defaults to 'CONFIRMED'
 * }} bookingData
 * @returns {Promise<{ ok: boolean, data: object | null, error: any }>}
 */
export async function createBooking(bookingData) {
  return apiFetch('bookings/', {
    method: 'POST',
    body: JSON.stringify({
      booking_id: bookingData.booking_id,
      carId: String(bookingData.carId),
      carName: bookingData.carName,
      renterName: bookingData.renterName,
      renterEmail: bookingData.renterEmail,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      total: String(bookingData.total),
      drivingLicenseUploaded: bookingData.drivingLicenseUploaded,
      status: bookingData.status || 'CONFIRMED',
    }),
  });
}

/**
 * Fetch all bookings (Admin).
 * Response is normalised to always return an array.
 *
 * @returns {Promise<{ ok: boolean, data: Array<object> | null, error: any }>}
 */
export async function fetchBookings() {
  const result = await apiFetch('bookings/');
  if (result.ok && result.data) {
    result.data = Array.isArray(result.data) ? result.data : [result.data];
  }
  return result;
}

// ─── Contact / Support API ───────────────────────────────────────────────────

/**
 * Submit a contact / support message.
 *
 * @param {{
 *   name: string,
 *   email: string,
 *   subject: string,
 *   message: string
 * }} messageData
 * @returns {Promise<{ ok: boolean, data: object | null, error: any }>}
 */
export async function createContactMessage(messageData) {
  return apiFetch('contact/message/', {
    method: 'POST',
    body: JSON.stringify({
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject,
      message: messageData.message,
    }),
  });
}

/**
 * Fetch all contact / support messages (Admin).
 * Response is normalised to always return an array.
 *
 * @returns {Promise<{ ok: boolean, data: Array<object> | null, error: any }>}
 */
export async function fetchContactMessages() {
  const result = await apiFetch('contact/message/');
  if (result.ok && result.data) {
    result.data = Array.isArray(result.data) ? result.data : [result.data];
  }
  return result;
}

/**
 * Reply to a support message (Admin).
 *
 * @param {number} messageId
 * @param {string} replyText
 * @returns {Promise<{ ok: boolean, data: object | null, error: any }>}
 */
export async function replyToContactMessage(messageId, replyText) {
  return apiFetch(`contact/message/${messageId}/reply/`, {
    method: 'PATCH',
    body: JSON.stringify({ reply: replyText }),
  });
}
