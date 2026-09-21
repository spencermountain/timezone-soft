declare function timezoneSoft(tz: string): timezoneSoft.DisplayFormat[];

declare namespace timezoneSoft {
  const version: string;
  interface TimeZoneInfo {
    name: string;
    offset: number;
    abbr: string;
  }

  interface DaylightTimeZoneInfo extends TimeZoneInfo {
    start: string;
    end: string;
  }

  interface DisplayFormat {
    name: string;
    iana: string;
    standard: TimeZoneInfo;
    daylight: DaylightTimeZoneInfo | null;
    long: string;
  }
}

export = timezoneSoft;
