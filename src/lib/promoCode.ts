export const PROMO_CODE = 'AOB-AI36';
export const PROMO_COURSE_PRICE = 'Rs. 35,000';

export function normalizePromoCode(code: string) {
  return code.trim().toUpperCase();
}

export function isApprovedPromoCode(code: string) {
  return normalizePromoCode(code) === PROMO_CODE;
}
