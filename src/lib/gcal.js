/**
 * Fetch and parse a public Google Calendar iCal feed.
 * No external dependencies — manual VEVENT parser.
 */

const SPRINT_START = new Date('2026-04-01')
const SPRINT_END = new Date('2026-07-05') // day after sprint end to include Jul 4

/**
 * Parse an iCal date string (YYYYMMDD or YYYYMMDDTHHmmssZ) to a Date object.
 */
function parseIcalDate(str) {
  if (!str) return null
  // All-day: 20260415
  if (/^\d{8}$/.test(str)) {
    return new Date(`${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`)
  }
  // DateTime: 20260415T120000Z or 20260415T120000
  if (/^\d{8}T\d{6}/.test(str)) {
    return new Date(
      `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}T${str.slice(9, 11)}:${str.slice(11, 13)}:${str.slice(13, 15)}${str.endsWith('Z') ? 'Z' : ''}`
    )
  }
  return null
}

/**
 * Format a Date to local YYYY-MM-DD string.
 */
function toLocalDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Format a Date to HH:MM string (local time).
 */
function toTimeStr(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

/**
 * Unfold iCal lines (lines ending in \r\n followed by whitespace are continuations).
 */
function unfold(text) {
  return text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '')
}

/**
 * Parse raw iCal text into an array of event objects.
 * Only returns events that overlap with the sprint window Apr 1 – Jul 4 2026.
 */
function parseIcal(text) {
  const unfolded = unfold(text)
  const events = []
  const veventBlocks = unfolded.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || []

  for (const block of veventBlocks) {
    const get = (key) => {
      // Match KEY or KEY;PARAM=VALUE: VALUE
      const match = block.match(new RegExp(`^${key}(?:;[^:]*)?:(.*)$`, 'm'))
      return match ? match[1].trim() : ''
    }

    const dtstart = get('DTSTART')
    const dtend = get('DTEND')
    const start = parseIcalDate(dtstart)
    const end = parseIcalDate(dtend)

    if (!start) continue

    // Filter to sprint window
    const endOrStart = end || start
    if (endOrStart < SPRINT_START || start > SPRINT_END) continue

    const isAllDay = /^\d{8}$/.test(dtstart)
    const uid = get('UID')
    const summary = get('SUMMARY').replace(/\\,/g, ',').replace(/\\n/g, ' ')
    const description = get('DESCRIPTION').replace(/\\,/g, ',').replace(/\\n/g, '\n')
    const location = get('LOCATION').replace(/\\,/g, ',')
    const url = get('URL')

    events.push({
      id: uid || `${summary}-${dtstart}`,
      title: summary,
      date: toLocalDate(start),
      startTime: isAllDay ? null : toTimeStr(start),
      endTime: end && !isAllDay ? toTimeStr(end) : null,
      isAllDay,
      description,
      location,
      url,
    })
  }

  return events
}

/**
 * Fetch the public iCal URL and return parsed events.
 * Returns [] if no URL configured or fetch fails.
 */
async function getCalendarEvents(icalUrl) {
  if (!icalUrl) return []
  try {
    const res = await fetch(icalUrl, { headers: { 'User-Agent': 'yomi.work-static-builder/1.0' } })
    if (!res.ok) {
      console.warn(`[gcal] Fetch failed: ${res.status} ${res.statusText}`)
      return []
    }
    const text = await res.text()
    return parseIcal(text)
  } catch (err) {
    console.warn('[gcal] Error fetching calendar:', err.message)
    return []
  }
}

module.exports = { getCalendarEvents }
