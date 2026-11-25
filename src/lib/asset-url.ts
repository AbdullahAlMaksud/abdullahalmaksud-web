const RAW_ASSET_BASE_URL = process.env.NEXT_PUBLIC_ASSET_BASE_URL || "";

export const ASSET_BASE_URL = RAW_ASSET_BASE_URL.replace(/\/+$/, "");

/**
 * Resolves a stored asset value into a displayable URL.
 * - Local public files starting with "/" (e.g. "/images/portrait.png") are returned as-is.
 * - Relative repository paths (e.g. "images/books/cover.webp") are prefixed with NEXT_PUBLIC_ASSET_BASE_URL.
 * - Full URLs / data URIs are returned unchanged.
 */
export function resolveAssetUrl(path?: string | null): string {
  if (!path) return "";
  const trimmed = path.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("/") || /^(?:https?:|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  const cleanPath = trimmed.replace(/^(?:\.\/)+/, "").replace(/^\/+/, "");
  return ASSET_BASE_URL ? `${ASSET_BASE_URL}/${cleanPath}` : `/${cleanPath}`;
}
