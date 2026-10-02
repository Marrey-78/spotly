const API_URL = import.meta.env.VITE_API_URL;

import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase';

export type AnalyticsEventType =
  | 'venue_view'
  | 'organizer_view'
  | 'event_impression'
  | 'event_view'
  | 'venue_favorite'
  | 'organizer_favorite'
  | 'event_favorite'
  | 'website_click'
  | 'instagram_click'
  | 'ticket_click'
  | 'directions_click';

interface TrackAnalyticsPayload {
  event_type: AnalyticsEventType;
  venue_id?: string;
  organizer_id?: string;
  event_id?: string;
}

function generateSessionId(): string {
  try {
    if (
      typeof crypto !== 'undefined' &&
      typeof crypto.randomUUID === 'function'
    ) {
      return crypto.randomUUID();
    }
  } catch (error) {
    console.warn('crypto.randomUUID non disponibile:', error);
  }

  // Fallback compatibile con Safari/iOS meno recenti
  return (
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).substring(2, 15)
  );
}

function getSessionId(): string {
  try {
    let sessionId = localStorage.getItem('flode_session_id');

    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('flode_session_id', sessionId);
    }

    return sessionId;
  } catch (error) {
    // Anche localStorage può essere indisponibile in alcuni contesti Safari
    console.warn('localStorage non disponibile:', error);
    return generateSessionId();
  }
}

export async function trackAnalytics(
  payload: TrackAnalyticsPayload
) {
  // =========================
  // GOOGLE ANALYTICS 4
  // =========================
  try {
    if (analytics) {
      logEvent(analytics, payload.event_type, {
        venue_id: payload.venue_id,
        organizer_id: payload.organizer_id,
        event_id: payload.event_id,
      });
    }
  } catch (error) {
    console.error(
      'Google Analytics tracking error:',
      error
    );
  }

  // =========================
  // FLODE ANALYTICS DATABASE
  // =========================
  try {
    await fetch(`${API_URL}/analytics/track`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        ...payload,
        session_id: getSessionId(),
      }),
    });

  } catch (error) {
    console.error(
      'Flode Analytics tracking error:',
      error
    );
  }
}