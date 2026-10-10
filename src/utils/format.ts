/**
 * Formatting utilities for Nepali Rupee (NPR) transactions and dates
 */

export function formatNPR(amount: number): string {
  if (isNaN(amount)) return 'Rs. 0';
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}

export function formatNPRCode(amount: number): string {
  if (isNaN(amount)) return 'NPR 0';
  return `NPR ${amount.toLocaleString('en-IN')}`;
}

export function formatNepaliPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('977')) {
    return `+977 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
  }
  if (cleaned.length === 10) {
    return `+977 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}
