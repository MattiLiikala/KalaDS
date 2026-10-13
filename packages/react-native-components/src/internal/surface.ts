import { createContext, useContext } from 'react';

/**
 * React Native has no colour inheritance. Surfaces that change the text colour (Box bg="inverse", the
 * inverse Backdrop) say so here, and Typography uses the matching default colour.
 */
export const SurfaceContext = createContext<'default' | 'inverse'>('default');
export const useSurface = () => useContext(SurfaceContext);
