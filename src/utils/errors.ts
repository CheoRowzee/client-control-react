import axios from "axios";

/**
 * Pull a human-readable message out of an API error.
 * Handles RFC 7807 ProblemDetails (which the .NET API returns) and falls
 * back to generic Axios / Error messages.
 */
export function extractErrorMessage(err: unknown, fallback = "Something went wrong."): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { title?: string; detail?: string; error?: string; errors?: Record<string, string[]> }
      | undefined;

    if (data?.errors) {
      const all = Object.values(data.errors).flat();
      if (all.length) return all.join(" ");
    }
    if (data?.title) return data.title;
    if (data?.detail) return data.detail;
    if (data?.error) return data.error;
    return err.message || fallback;
  }

  if (err instanceof Error) return err.message;
  return fallback;
}
