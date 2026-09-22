const API_URL = import.meta.env.VITE_API_URL;

export type AnalyticsEventType =
  | 'venue_view'
  | 'event_impression'
  | 'event_view'
  | 'venue_favorite'
  | 'event_favorite'
  | 'website_click'
  | 'instagram_click'
  | 'ticket_click'
  | 'directions_click';

interface TrackAnalyticsPayload {
  event_type: AnalyticsEventType;
  venue_id?: string;
  event_id?: string;
}

function getSessionId(): string {
  let sessionId = localStorage.getItem('flode_session_id');

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('flode_session_id', sessionId);
  }

  return sessionId;
}

export async function trackAnalytics(
  data: TrackAnalyticsPayload
): Promise<void> {
  try {
    await fetch(`${API_URL}/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        session_id: getSessionId(),
      }),
    });
  } catch (error) {
    // Analytics non deve mai bloccare l'utilizzo dell'app
    console.error('Analytics error:', error);
  }
}