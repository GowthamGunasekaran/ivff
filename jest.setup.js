require('@testing-library/jest-dom');

// Filter harmless deprecation warnings between React 19 and Testing Library 13.4
const originalError = console.error;
console.error = (...args) => {
  const fullText = args.map((a) => String(a || '')).join(' ');
  if (fullText.includes('ReactDOMTestUtils.act') || fullText.includes('react-dom-test-utils')) {
    return;
  }
  originalError.apply(console, args);
};

// Mock window.matchMedia
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock scrollTo
  window.scrollTo = jest.fn();
}
