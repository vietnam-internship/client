import { OAUTH_STATE_KEY } from '@/constants/storage'

/**
 * CSRF protection for the Google OAuth redirect flow.
 *
 * Before sending the browser to the backend's `/oauth2/authorization/google`
 * entry point, we generate a random `state`, stash it in sessionStorage, and
 * pass it along as a query param. The backend must forward that same value to
 * Google's authorization request; Google echoes it back untouched on redirect.
 * When the browser lands back on `/auth/callback`, we compare the returned
 * `state` against the stashed one — a mismatch (or a missing value) means the
 * redirect wasn't triggered by us and the login attempt is rejected.
 *
 * sessionStorage (not localStorage) is used deliberately: the value only
 * needs to survive the single redirect round-trip within the same tab.
 */

/** Generates a fresh state value and stores it for later verification. */
export function createOAuthState(): string {
  const state =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36)

  sessionStorage.setItem(OAUTH_STATE_KEY, state)
  return state
}

/** Reads and immediately clears the stashed state so it can't be replayed. */
export function consumeStoredOAuthState(): string | null {
  const value = sessionStorage.getItem(OAUTH_STATE_KEY)
  sessionStorage.removeItem(OAUTH_STATE_KEY)
  return value
}
