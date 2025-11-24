/**
 * Timezone utility functions for handling date storage and display
 * 
 * Storage: UTC ISO strings (e.g., "2025-01-15T05:00:00.000Z")
 * Edit Modal: ET timezone display (e.g., "2025-01-15" for date inputs)
 * Frontend Display: User's browser locale
 */

const ET_TIMEZONE = 'America/New_York';

/**
 * Convert a date input value (YYYY-MM-DD) from ET timezone to UTC ISO string for storage
 */
export function dateInputToUTC(dateString: string): string {
  if (!dateString) return '';
  
  // Parse the date string as if it's in ET timezone
  const etDate = new Date(dateString + 'T00:00:00');
  
  // Convert to ET timezone explicitly
  const utcTime = new Date(etDate.toLocaleString('en-US', { timeZone: 'UTC' }));
  const etTime = new Date(etDate.toLocaleString('en-US', { timeZone: ET_TIMEZONE }));
  
  // Calculate the offset and adjust
  const offset = utcTime.getTime() - etTime.getTime();
  const adjustedDate = new Date(etDate.getTime() + offset);
  
  return adjustedDate.toISOString();
}

/**
 * Convert UTC ISO string from storage to date input value (YYYY-MM-DD) in ET timezone for editing
 */
export function utcToDateInput(isoString: string): string {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  
  // Convert to ET timezone for editing
  const etDateString = date.toLocaleDateString('en-CA', { // en-CA gives YYYY-MM-DD format
    timeZone: ET_TIMEZONE
  });
  
  return etDateString;
}

/**
 * Format UTC ISO string for display in user's browser locale
 * This preserves the existing display logic but ensures consistent timezone handling
 */
export function formatDateForDisplay(isoString: string, options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: ET_TIMEZONE
}): string {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get program start month name from UTC ISO string
 */
export function getProgramStartMonth(isoString: string): string {
  if (!isoString) return 'Winter';
  
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { 
    month: 'long',
    timeZone: ET_TIMEZONE
  });
}

/**
 * Convert legacy date string (YYYY-MM-DD) to UTC ISO string
 * Used for migrating existing data
 */
export function legacyDateToUTC(dateString: string): string {
  if (!dateString) return '';
  
  // If it's already an ISO string, return as is
  if (dateString.includes('T') || dateString.includes('Z')) {
    return dateString;
  }
  
  // Convert legacy YYYY-MM-DD to UTC assuming it was meant to be in ET
  return dateInputToUTC(dateString);
}

/**
 * Check if a date string is in the old format (YYYY-MM-DD)
 */
export function isLegacyDateFormat(dateString: string): boolean {
  if (!dateString) return false;
  
  // Legacy format: YYYY-MM-DD (10 characters, no T or Z)
  return dateString.length === 10 && !dateString.includes('T') && !dateString.includes('Z');
}