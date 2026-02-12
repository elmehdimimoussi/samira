import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import HistoryPage from '@/pages/HistoryPage'

const mockOperations = [
  {
    id: 1,
    reference_number: 'LC-2026-001',
    beneficiary_name: 'Société Alpha',
    amount_numeric: '10 500,00',
    due_date: '2026-03-15',
    created_at: new Date().toISOString(),
    data: JSON.stringify({})
  },
  {
    id: 2,
    reference_number: 'LC-2026-002',
    beneficiary_name: 'Entreprise Beta',
    amount_numeric: '25 000,50',
    due_date: '2026-04-20',
    created_at: new Date().toISOString(),
    data: JSON.stringify({})
  },
  {
    id: 3,
    reference_number: 'LC-2025-010',
    beneficiary_name: 'Comptoir Gamma',
    amount_numeric: '5 000,00',
    due_date: '2025-12-01',
    created_at: '2025-12-01T10:00:00Z',
    data: JSON.stringify({})
  },
]

const renderPage = () => render(
  <MemoryRouter>
    <HistoryPage />
  </MemoryRouter>
)

describe('HistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.electronAPI.operations.getAll.mockResolvedValue([...mockOperations])
    window.sessionStorage.clear()
  })

  describe('chargement initial', () => {
    it('charge les opérations au montage', async () => {
      renderPage()
      await waitFor(() => {
        expect(window.electronAPI.operations.getAll).toHaveBeenCalled()
      })
    })

    it('affiche les opérations dans le tableau', async () => {
      renderPage()
      await waitFor(() => {
        expect(screen.getByText('Société Alpha')).toBeInTheDocument()
      })
    })

    it('affiche le titre Historique', () => {
      renderPage()
      expect(screen.getByText(/historique/i)).toBeInTheDocument()
    })
  })

  describe('statistiques', () => {
    it('affiche le nombre total d\'opérations', async () => {
      renderPage()
      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument()
      })
    })
  })

  describe('recherche et filtres', () => {
    it('filtre par texte de recherche', async () => {
      const user = userEvent.setup()
      renderPage()

      await waitFor(() => {
        expect(screen.getByText('Société Alpha')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/rechercher/i)
      await user.type(searchInput, 'Alpha')

      expect(screen.getByText('Société Alpha')).toBeInTheDocument()
      expect(screen.queryByText('Entreprise Beta')).not.toBeInTheDocument()
    })
  })

  describe('gestion des erreurs', () => {
    it('gère une erreur de chargement', async () => {
      window.electronAPI.operations.getAll.mockRejectedValue(new Error('DB error'))
      renderPage()

      await waitFor(() => {
        expect(window.electronAPI.operations.getAll).toHaveBeenCalled()
      })
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
