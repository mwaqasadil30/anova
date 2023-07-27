/**
 * Helper class for anything time zone related.
 */
const TimeZoneHelper = {
  /**
   * Get's the current date time options.
   */
  getLocalDateTimeFormatOptions(): Intl.ResolvedDateTimeFormatOptions {
    return Intl.DateTimeFormat().resolvedOptions();
  },
};
export default TimeZoneHelper;
