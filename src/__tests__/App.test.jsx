import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'

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
    expect(screen.getByLabelText('Navigation principale')).toBeInTheDocument()
    expect(screen.getByText('LC Pro')).toBeInTheDocument()
    expect(screen.getByText('Gestionnaire BMCI')).toBeInTheDocument()
  })

  it('shows the four main navigation links', () => {
    renderApp()
    expect(screen.getByRole('link', { name: /Remplissage/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Clients/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Historique/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Paramètres/i })).toBeInTheDocument()
  })

  it('points links to expected routes', () => {
    renderApp()
    expect(screen.getByRole('link', { name: /Remplissage/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /Clients/i })).toHaveAttribute('href', '/customers')
    expect(screen.getByRole('link', { name: /Historique/i })).toHaveAttribute('href', '/history')
    expect(screen.getByRole('link', { name: /Paramètres/i })).toHaveAttribute('href', '/settings')
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

  it('renders 404 page for unknown route', () => {
    renderApp('/route-inexistante')
    expect(screen.getByText('Page introuvable')).toBeInTheDocument()
  })
})
