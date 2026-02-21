import * as amplitude from '@amplitude/analytics-browser';

let isInitialized = false;

export const initAmplitude = () => {
  if (isInitialized || typeof window === 'undefined') return;
  
  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
  if (!apiKey) {
    console.warn('Amplitude API key not configured');
    return;
  }
  
  amplitude.init(apiKey, undefined, {
    defaultTracking: {
      sessions: true,
      pageViews: true,
      formInteractions: false,
      fileDownloads: false,
    },
  });
  
  isInitialized = true;
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!isInitialized) return;
  amplitude.track(eventName, properties);
};

export const setUserId = (userId: string) => {
  if (!isInitialized) return;
  amplitude.setUserId(userId);
};

export const setUserProperties = (properties: Record<string, any>) => {
  if (!isInitialized) return;
  const identify = new amplitude.Identify();
  Object.entries(properties).forEach(([key, value]) => {
    identify.set(key, value);
  });
  amplitude.identify(identify);
};

// Event names
export const EVENTS = {
  // Auth
  SIGN_UP: 'sign_up',
  SIGN_IN: 'sign_in',
  SIGN_OUT: 'sign_out',
  
  // Features
  FLASHCARD_GENERATED: 'flashcard_generated',
  FLASHCARD_REVIEWED: 'flashcard_reviewed',
  ANSWER_ANALYZED: 'answer_analyzed',
  LESSON_CREATED: 'lesson_created',
  LESSON_COMPLETED: 'lesson_completed',
  YOUTUBE_EXTRACTED: 'youtube_extracted',
  
  // Chat
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  GIZMO_MODE_ENABLED: 'gizmo_mode_enabled',
  
  // Dashboard
  DASHBOARD_VIEWED: 'dashboard_viewed',
  PROGRESS_VIEWED: 'progress_viewed',
};
