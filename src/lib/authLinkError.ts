export interface AuthLinkError { code: string; description: string }

/** Parses Supabase auth error params from a URL hash or query string. */
export function parseAuthLinkError(hash: string, search = ""): AuthLinkError | null {
  for (const raw of [hash, search]) {
    const p = new URLSearchParams(raw.replace(/^[#?]/, ""));
    const err = p.get("error");
    const code = p.get("error_code");
    if (err || code) {
      return { code: code ?? err ?? "unknown", description: p.get("error_description") ?? "This link is invalid or has expired." };
    }
  }
  return null;
}

export const passwordResetRedirect = () => `${window.location.origin}/set-password`;
