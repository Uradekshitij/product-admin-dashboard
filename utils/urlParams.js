// Helpers for safely reading pagination values out of the URL.
// Anything unexpected (?page=abc, ?page=-4, ?pageSize=999) quietly falls
// back to a sane default instead of throwing or breaking the page.

const ALLOWED_PAGE_SIZES = [10, 20, 50];

export function parsePage(rawPage) {
  const page = parseInt(rawPage, 10);
  if (!Number.isFinite(page) || page < 1) return 1;
  return page;
}

export function parsePageSize(rawPageSize) {
  const size = parseInt(rawPageSize, 10);
  if (!ALLOWED_PAGE_SIZES.includes(size)) return 10;
  return size;
}

/**
 * Clamp a requested page number so it can never point past the last
 * available page once we know the total item count (handles ?page=999).
 */
export function clampPage(page, pageSize, total) {
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  return Math.min(page, lastPage);
}

export const PAGE_SIZE_OPTIONS = ALLOWED_PAGE_SIZES;
