
export interface TimeZoneInfo {
  name: string;
  abbrev: string;
}

export interface DisplayFormat {
  iana: string;
  standard: TimeZoneInfo;
  daylight: TimeZoneInfo;
}

/** interpret timezone names */
export default function timezoneSoft(tz:string): DisplayFormat[]