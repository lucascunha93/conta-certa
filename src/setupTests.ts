import '@testing-library/jest-dom/extend-expect';

globalThis.matchMedia = globalThis.matchMedia || function() {
  return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
  };
};
