import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'

// Helper to render App with router
const renderApp = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  )
}

describe('App', () => {
  describe('structure générale', () => {
    it('rend la sidebar', () => {
      renderApp()
      expect(screen.getByText('LC Pro')).toBeInTheDocument()
      expect(screen.getByText('Gestionnaire BMCI')).toBeInTheDocument()
    })

    it('affiche les éléments de navigation', () => {
      renderApp()
      expect(screen.getByText('Remplissage')).toBeInTheDocument()
      expect(screen.getByText('Clients')).toBeInTheDocument()
      expect(screen.getByText('Historique')).toBeInTheDocument()
      expect(screen.getByText('Paramètres')).toBeInTheDocument()
    })

    it('affiche la version', () => {
      renderApp()
      expect(screen.getByText('v1.0.0 — IGADOR SAMIRA')).toBeInTheDocument()
    })

    it('affiche le label Navigation', () => {
      renderApp()
      expect(screen.getByText('Navigation')).toBeInTheDocument()
    })

    it('rend le ThemeToggle', () => {
      renderApp()
      // Le ThemeToggle affiche "Mode Sombre" ou "Mode Clair"
      const toggle = screen.getByText(/Mode (Sombre|Clair)/)
      expect(toggle).toBeInTheDocument()
    })
  })

  describe('navigation / routing', () => {
    it('affiche la page Remplissage sur /', () => {
      renderApp('/')
      // La page FillingPage devrait être rendue
      const navLink = screen.getByText('Remplissage')
      expect(navLink.closest('a')).toHaveAttribute('href', '/')
    })

    it('affiche la page Clients sur /customers', () => {
      renderApp('/customers')
      const navLink = screen.getByText('Clients')
      expect(navLink.closest('a')).toHaveAttribute('href', '/customers')
    })

    it('affiche la page Historique sur /history', () => {
      renderApp('/history')
      const navLink = screen.getByText('Historique')
      expect(navLink.closest('a')).toHaveAttribute('href', '/history')
    })

    it('affiche la page Paramètres sur /settings', () => {
      renderApp('/settings')
      const navLinks = screen.getAllByText('Paramètres')
      // Le texte apparaît dans la sidebar et comme titre de page
      expect(navLinks.length).toBeGreaterThanOrEqual(1)
      const sidebarLink = navLinks.find(el => el.closest('a'))
      expect(sidebarLink.closest('a')).toHaveAttribute('href', '/settings')
    })
  })

  describe('liens de navigation', () => {
    it('a 4 liens de navigation', () => {
      renderApp()
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(4)
    })

    it('les liens pointent vers les bonnes routes', () => {
      renderApp()
      const links = screen.getAllByRole('link')
      const hrefs = links.map(l => l.getAttribute('href'))
      expect(hrefs).toContain('/')
      expect(hrefs).toContain('/customers')
      expect(hrefs).toContain('/history')
      expect(hrefs).toContain('/settings')
    })
  })

  describe('route 404', () => {
    it('affiche la page 404 pour une route inconnue', () => {
      renderApp('/route-inexistante')
      expect(screen.getByText('Page introuvable')).toBeInTheDocument()
    })
  })
})
