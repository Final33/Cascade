export type CourseId = 'calc-ab' | 'cs-a' | 'statistics' | 'world-history' | 'cs-principles';

export function getCourseIdFromRoute(pathname: string): CourseId | undefined {
  const routeMap: Record<string, CourseId> = {
    '/dashboard/ap-calc-ab': 'calc-ab',
    '/dashboard/ap-cs-a': 'cs-a',
    '/dashboard/ap-statistics': 'statistics',
    '/dashboard/ap-world-history': 'world-history',
    '/dashboard/ap-cs-principles': 'cs-principles'
  };

  return routeMap[pathname];
} 