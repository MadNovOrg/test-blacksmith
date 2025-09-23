import { SnackbarProvider } from '@app/context/snackbar'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { _render, renderHook, screen, waitFor } from '@test/index'
import { chance } from '@test/index'

import { UpdateVersionDialog } from './UpdateVersionDialog'

describe(UpdateVersionDialog.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useScopedTranslation('components.update-version-dialog'))
  it('should _render if local version is different than app version', () => {
    localStorage.setItem('appVersion', PACKAGE_JSON_VERSION + chance.word())
    _render(
      <SnackbarProvider>
        <UpdateVersionDialog />
      </SnackbarProvider>,
    )
    expect(screen.getByText(t('title'))).toBeInTheDocument()
  })
  it('should not _render if local version is the same as app version', () => {
    localStorage.setItem('appVersion', PACKAGE_JSON_VERSION)
    _render(
      <SnackbarProvider>
        <UpdateVersionDialog />
      </SnackbarProvider>,
    )
    expect(screen.queryByText(t('title'))).not.toBeInTheDocument()
  })
  it('should set version  update button is clicked', () => {
    localStorage.setItem('appVersion', PACKAGE_JSON_VERSION + chance.word())
    _render(
      <SnackbarProvider>
        <UpdateVersionDialog />
      </SnackbarProvider>,
    )
    const button = screen.getByText(t('update'))
    expect(button).toBeInTheDocument()
    button.click()
    expect(localStorage.getItem('appVersion')).toBe(PACKAGE_JSON_VERSION)
  })
  it('should delete all caches and reload the page', async () => {
    localStorage.setItem('appVersion', PACKAGE_JSON_VERSION + chance.word())

    const mockReload = vi.fn()

    vi.stubGlobal('caches', {
      keys: vi.fn().mockResolvedValue(['cache1', 'cache2']),
      delete: vi.fn().mockResolvedValue(true),
    })

    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    })

    _render(
      <SnackbarProvider>
        <UpdateVersionDialog />
      </SnackbarProvider>,
    )
    const button = screen.getByText(t('update'))
    button.click()
    await waitFor(() => {
      expect(caches.keys).toHaveBeenCalled()
      expect(caches.delete).toHaveBeenCalledWith('cache1')
      expect(caches.delete).toHaveBeenCalledWith('cache2')
    })
  })
})
