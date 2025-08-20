// Setup global polyfills before Next.js starts
if (typeof globalThis.self === 'undefined') {
  globalThis.self = globalThis;
}
if (typeof globalThis.window === 'undefined') {
  globalThis.window = globalThis;
}
if (typeof globalThis.document === 'undefined') {
  globalThis.document = {};
}
