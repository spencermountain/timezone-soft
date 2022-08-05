
export interface TimeZoneInfo {
  name: string;
  abbr: string;
}

export interface DisplayFormat {
  iana: string;
  standard: TimeZoneInfo;
  daylight: TimeZoneInfo;
}

/** interpret timezone names */
export default function timezoneSoft(tz:string): DisplayFormat[]
