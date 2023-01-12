export function formatCourseVenue(
  venue: { name?: string; city?: string } | undefined
): string {
  return [venue?.name, venue?.city].filter(Boolean).join(', ')
}
