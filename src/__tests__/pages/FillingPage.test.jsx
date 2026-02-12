import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FillingPage from '@/pages/FillingPage'

const renderPage = () => render(
  <MemoryRouter>
    <FillingPage />
  </MemoryRouter>
)

describe('FillingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.electronAPI.customers.getAll.mockResolvedValue([])
    window.electronAPI.settings.get.mockResolvedValue(null)
    window.electronAPI.templates.getActive.mockResolvedValue(null)
    window.sessionStorage.clear()
  })

  describe('rendu initial', () => {
    it('affiche le titre Remplissage', () => {
      renderPage()
      expect(screen.getByText(/remplissage/i)).toBeInTheDocument()
    })

    it('affiche les sections du formulaire', async () => {
      renderPage()
      // Les sections accordéon typiques dans FillingPage
      await waitFor(() => {
        const matches = screen.getAllByText(/g[eé]n[eé]ral/i)
        expect(matches.length).toBeGreaterThanOrEqual(1)
      })
    })

    it('affiche la zone d\'aperçu', () => {
      renderPage()
      expect(screen.getByText(/aper[cç]u/i)).toBeInTheDocument()
    })
  })

  describe('sans electronAPI', () => {
    it('ne plante pas sans electronAPI', () => {
      const originalAPI = window.electronAPI
      window.electronAPI = undefined
      
      expect(() => renderPage()).not.toThrow()
      
      window.electronAPI = originalAPI
    })
  })
})
