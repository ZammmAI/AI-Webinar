// ─── Promo codes ───────────────────────────────────────────────────────────────
// Each promo code maps to the course category it is valid for.
// 'all' means the code is valid for any course.

export type PromoTarget = 'all' | 'interview-mastery';

export interface PromoCodeConfig {
  target: PromoTarget;
  discountedPrices: Record<string, string>; // course id → discounted price
}

export const PROMO_CODES: Record<string, PromoCodeConfig> = {
  'AOB-AI36': {
    target: 'all',
    discountedPrices: {
      'ai-path': 'Rs. 35,000',
      'creator-path': 'Rs. 35,000',
      'youth-path': 'Rs. 35,000',
      'marketing-path': 'Rs. 35,000',
    },
  },
  'AOB-IM31': {
    target: 'interview-mastery',
    discountedPrices: {
      'interview-mastery': 'Rs. 6,800',
      'interview-mastery-pro': 'Rs. 9,800',
    },
  },
};

export function normalizePromoCode(code: string) {
  return code.trim().toUpperCase();
}

/** Returns the discounted price string if the promo code is valid for the given course, otherwise null. */
export function getPromoDiscount(code: string, courseId: string): string | null {
  const config = PROMO_CODES[normalizePromoCode(code)];
  if (!config) return null;
  return config.discountedPrices[courseId] ?? null;
}

/** Returns true if the promo code is valid for the given course. */
export function isApprovedPromoCode(code: string, courseId?: string): boolean {
  const normalized = normalizePromoCode(code);
  const config = PROMO_CODES[normalized];
  if (!config) return false;
  if (!courseId) return true; // legacy: just check code exists
  return courseId in config.discountedPrices;
}
