import { Time } from "../rjztm/interfaces";

const pad2 = (n: number | string) => (('' + n).length < 2 ? '0' : '') + n;
export const timeISO = (hours: number, minutes: number | string) => `${pad2(hours)}:${pad2(minutes)}`
export const time2ISO = (t: Time) => timeISO(t.hrs, t.mins);