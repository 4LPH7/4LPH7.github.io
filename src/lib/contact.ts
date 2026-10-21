export interface Contact { name: string; email: string; message: string }

export const buildMailto = (to: string, c: Contact) =>
  `mailto:${to}?subject=${encodeURIComponent(`Portfolio message from ${c.name}`)}&body=${encodeURIComponent(`${c.message}\n\nFrom: ${c.name}\nEmail: ${c.email}`)}`;

/** Where to POST. web3forms (public access key) wins, then a custom endpoint; null means use mailto. */
export function resolveTarget(env: { web3formsKey?: string; endpoint?: string }) {
  const key = env.web3formsKey?.trim();
  if (key) return { url: "https://api.web3forms.com/submit", fields: { access_key: key } as Record<string, string> };
  const url = env.endpoint?.trim();
  return url ? { url, fields: {} as Record<string, string> } : null;
}

export function validate(c: Contact): Partial<Record<keyof Contact, string>> {
  const errors: Partial<Record<keyof Contact, string>> = {};
  if (!c.name.trim()) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) errors.email = "Enter a valid email address.";
  if (!c.message.trim()) errors.message = "Write a short message.";
  return errors;
}
