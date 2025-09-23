import Cookies from 'js-cookie'

export type DeleteCookieOptions = {
  secure: boolean | undefined
  path: string | undefined
  domain: string | undefined
  sameSite: 'strict' | 'lax' | 'none' | 'Strict' | 'Lax' | 'None' | undefined
}

export type SetCookieOptions = {
  expires: number | undefined
} & DeleteCookieOptions

export interface ICookies {
  setCookie(
    name: string,
    value: string,
    opts: SetCookieOptions | undefined,
  ): void

  deleteCookie(name: string, opts: DeleteCookieOptions | undefined): void
}

export const TTCookies: ICookies = {
  setCookie,
  deleteCookie,
}

function setCookie(
  name: string,
  value: string,
  opts: SetCookieOptions | undefined,
): void {
  Cookies.set(name, value, {
    secure: opts?.secure,
    expires: opts?.expires,
    path: opts?.path,
    domain: opts?.domain,
    sameSite: opts?.sameSite,
  })
}

function deleteCookie(
  name: string,
  opts: DeleteCookieOptions | undefined,
): void {
  Cookies.remove(name, {
    secure: opts?.secure,
    path: opts?.path,
    domain: opts?.domain,
    sameSite: opts?.sameSite,
  })
}
