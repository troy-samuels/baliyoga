// Server-side polyfills for browser globals
if (typeof self === 'undefined' && typeof global !== 'undefined') {
  (global as any).self = global;
}

export {};
