/**
 * Masks an email address for display, e.g. "john.doe@gmail.com" -> "jo***@gmail.com".
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) {
    return email;
  }

  const visible = localPart.slice(0, Math.min(2, localPart.length));
  return `${visible}***@${domain}`;
}
