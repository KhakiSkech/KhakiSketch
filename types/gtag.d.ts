// Google Analytics gtag.js 타입 선언

interface GtagEventParams {
  [key: string]: string | number | boolean | undefined;
}

interface Window {
  gtag: (
    command: 'config' | 'event' | 'js' | 'set',
    targetIdOrAction: string | Date,
    params?: GtagEventParams
  ) => void;
  dataLayer: Array<Record<string, unknown>>;
}
