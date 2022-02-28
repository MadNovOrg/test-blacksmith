import { useLocation, matchPath } from 'react-router-dom'

type Route = {
  id: string
  title: string
}

export function useRouteMatch(routes: Route[]) {
  const { pathname } = useLocation()

  for (let i = 0; i < routes.length; i += 1) {
    const pattern = routes[i].id
    const possibleMatch = matchPath(pattern, pathname)
    if (possibleMatch !== null) {
      return possibleMatch
    }
  }

  return null
}
