
export interface TimeZoneInfo {
  name: string;
  offset: number;
  abbr: string;
}

export interface DaylightTimeZoneInfo extends TimeZoneInfo {
  start: string;
  end: string;
}

export interface DisplayFormat {
  name: string;
  iana: string;
  standard: TimeZoneInfo;
  daylight: DaylightTimeZoneInfo | null;
  long: string;
}

/** interpret timezone names */
declare function timezoneSoft(tz:string): DisplayFormat[]
declare namespace timezoneSoft {
  const version: string;
}
export default timezoneSoft;
