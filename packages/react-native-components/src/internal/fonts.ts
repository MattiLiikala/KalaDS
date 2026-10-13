import { Overlock_400Regular, Overlock_700Bold, Overlock_900Black } from '@expo-google-fonts/overlock';
import {
  Parkinsans_300Light,
  Parkinsans_400Regular,
  Parkinsans_500Medium,
  Parkinsans_600SemiBold,
  Parkinsans_700Bold,
  Parkinsans_800ExtraBold,
} from '@expo-google-fonts/parkinsans';
import { useFonts } from 'expo-font';

/**
 * React Native can't pick a weight from a custom font family: each weight is its own font. Every weight
 * is registered as "<Family>-<weight>" (Overlock-700), and fontFamily() picks the nearest one.
 */
const FILES = {
  'Overlock-400': Overlock_400Regular,
  'Overlock-700': Overlock_700Bold,
  'Overlock-900': Overlock_900Black,
  'Parkinsans-300': Parkinsans_300Light,
  'Parkinsans-400': Parkinsans_400Regular,
  'Parkinsans-500': Parkinsans_500Medium,
  'Parkinsans-600': Parkinsans_600SemiBold,
  'Parkinsans-700': Parkinsans_700Bold,
  'Parkinsans-800': Parkinsans_800ExtraBold,
} as const;

const WEIGHTS: Record<string, number[]> = { Overlock: [400, 700, 900], Parkinsans: [300, 400, 500, 600, 700, 800] };

/**
 * The registered font for a token family ("Overlock") and weight (500). Overlock has no 300 or 500, so
 * those use 400, as browsers do with the web fonts.
 */
export function fontFamily(family: string, weight: number | string = 400): string {
  const available = WEIGHTS[family];
  if (!available) return family;
  const w = Number(weight);
  // Nearest available weight, preferring the lighter one on a tie (CSS font matching for weights ≤ 500).
  const nearest = available.reduce((best, x) => (Math.abs(x - w) < Math.abs(best - w) ? x : best), available[0]);
  return `${family}-${nearest}`;
}

/**
 * Loads the KalaDS fonts (Overlock and Parkinsans, every weight). Call once at the app root and render
 * KalaDS components after it returns true.
 *
 *   const [loaded] = useKalaFonts();
 *   if (!loaded) return null;
 */
export function useKalaFonts(): [loaded: boolean, error: Error | null] {
  return useFonts(FILES);
}
