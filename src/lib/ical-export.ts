import type { CommunityEvent } from "@/types/community"

/** Format date for iCal (YYYYMMDDTHHmmssZ). */
function formatICalDate(iso: string): string {
  const d = new Date(iso)
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

/** Generate .ics file content for a single event. */
export function eventToIcs(event: CommunityEvent, communityName?: string): string {
  const start = formatICalDate(event.startAt)
  const end = event.endAt ? formatICalDate(event.endAt) : formatICalDate(new Date(new Date(event.startAt).getTime() + 60 * 60 * 1000).toISOString())
  const title = (event.title || "Event").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,")
  const desc = (event.description || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")
  const location = (event.location || event.meetingUrl || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,")
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GrowthLab Community//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@community`,
    `DTSTAMP:${formatICalDate(event.createdAt)}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    ...(desc ? [`DESCRIPTION:${desc}`] : []),
    ...(location ? [`LOCATION:${location}`] : []),
    ...(event.meetingUrl ? [`URL:${event.meetingUrl}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return lines.join("\r\n")
}

/** Trigger download of .ics file for an event. */
export function downloadEventIcs(event: CommunityEvent, communityName?: string): void {
  const ics = eventToIcs(event, communityName)
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${(event.title || "event").replace(/[^a-z0-9-]/gi, "-").slice(0, 50)}.ics`
  a.click()
  URL.revokeObjectURL(url)
}
