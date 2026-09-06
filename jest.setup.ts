import '@testing-library/jest-dom';

// Provide the API URL the code expects during tests.
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000/api';

// jsdom does not implement matchMedia; some components/libraries expect it.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
