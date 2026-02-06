// Web playback service - no-op since web audio handles events natively
export const initializePlayer = () => {
  // Nothing to initialize for web audio API
  return Promise.resolve();
};
