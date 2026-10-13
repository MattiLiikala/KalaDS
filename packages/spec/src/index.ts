export * from './generated.js';
export * from './placement.js';

/** Reasons a dialog or drawer closed, as in the web components' `kds-close` event detail. */
export type CloseReason = 'close-button' | 'escape' | 'backdrop' | 'api';
