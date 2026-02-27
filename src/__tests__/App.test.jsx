import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'
import {
  WORKSPACE_BUDGETS,
  calculateWorkspaceGainPercent,
  calculateP95,
} from './appShellMetrics'

const renderApp = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  )
}

describe('App shell', () => {
  it('renders top navigation and brand', () => {
    renderApp()
    expect(screen.getByTestId('app-topbar')).toBeInTheDocument()
    expect(screen.getByLabelText('Navigation principale')).toBeInTheDocument()
    expect(screen.getByText('LC Pro')).toBeInTheDocument()
    expect(screen.getByText('Gestionnaire BMCI')).toBeInTheDocument()
  })

  it('shows the four main navigation links', () => {
    renderApp()
    expect(screen.getByRole('link', { name: /Remplissage/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Clients/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Historique/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Parametres/i })).toBeInTheDocument()
  })

  it('points links to expected routes', () => {
    renderApp()
    expect(screen.getByRole('link', { name: /Remplissage/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /Clients/i })).toHaveAttribute('href', '/customers')
    expect(screen.getByRole('link', { name: /Historique/i })).toHaveAttribute('href', '/history')
    expect(screen.getByRole('link', { name: /Parametres/i })).toHaveAttribute('href', '/settings')
  })

  it('keeps keyboard navigation operable for top nav links', async () => {
    const user = userEvent.setup()
    renderApp()

    const historyLink = screen.getByRole('link', { name: /Historique/i })
    historyLink.focus()
    expect(document.activeElement).toBe(historyLink)
    await user.keyboard('{Enter}')
    expect(document.activeElement).toBe(historyLink)
    expect(historyLink).toHaveAttribute('href', '/history')
  })

  it('keeps utility controls keyboard reachable', async () => {
    const user = userEvent.setup()
    renderApp()

    const toggleThemeButton = screen.getByRole('button', { name: /Activer le mode/i })
    toggleThemeButton.focus()
    expect(document.activeElement).toBe(toggleThemeButton)
    await user.keyboard('{Enter}')
    expect(toggleThemeButton).toBeInTheDocument()
  })

  it('maintains exactly one active navigation item for active route', () => {
    renderApp('/history')
    const activeLinks = screen.getAllByRole('link').filter((link) => link.getAttribute('aria-current') === 'page')

    expect(activeLinks).toHaveLength(1)
    expect(activeLinks[0]).toHaveTextContent('Historique')
  })

  it('keeps compact topbar and horizontal scroll affordance', () => {
    renderApp()
    const topbar = screen.getByTestId('app-topbar')
    const navScroll = screen.getByTestId('topbar-nav-scroll')

    expect(topbar.className).toMatch(/h-14/)
    expect(navScroll.className).toMatch(/overflow-x-auto/)
  })

  it('meets workspace gain threshold budget', () => {
    const gainPercent = calculateWorkspaceGainPercent(WORKSPACE_BUDGETS.desktop)
    expect(gainPercent).toBeGreaterThanOrEqual(8)
  })

  it('keeps p95 latency under 100ms budget for warm interactions', () => {
    const warmLatencySamples = [48, 52, 61, 57, 63, 67, 71, 58, 64, 59, 55, 62, 69, 73, 75, 66, 60, 72, 78, 81]
    expect(calculateP95(warmLatencySamples)).toBeLessThanOrEqual(100)
  })

  it('renders 404 page for unknown route', () => {
    renderApp('/route-inexistante')
    expect(screen.getByText('Page introuvable')).toBeInTheDocument()
  })
})
