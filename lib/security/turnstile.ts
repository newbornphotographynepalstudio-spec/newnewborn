import "server-only";

/**
 * Cloudflare Turnstile verification — ready for the moment a real site
 * key/secret are configured, not weakened for local development. When
 * `TURNSTILE_SECRET_KEY` isn't set, there's also no widget on the form
 * yet to produce a token, so verification is a no-op everywhere (dev and
 * prod alike) until the real keys are added — at that point this starts
 * enforcing automatically, in every environment, with no code change.
 */
export async function verifyTurnstileToken(token: string | null): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: secretKey, response: token }),
      }
    );
    const result = (await response.json()) as { success: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}
