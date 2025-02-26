
export interface TimeZoneInfo {
  name: string;
  offset: number;
  abbr: string;
}

export interface DisplayFormat {
  name: string;
  iana: string;
  standard: TimeZoneInfo;
  daylight: TimeZoneInfo;
  long: string;
}

/** interpret timezone names */
export default function timezoneSoft(tz:string): DisplayFormat[]
