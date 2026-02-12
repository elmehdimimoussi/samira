import { describe, it, expect, beforeEach, vi as viGlobal } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CustomersPage from '@/pages/CustomersPage'

const mockCustomers = [
  { id: 1, name: 'Société Alpha', address: '10 Rue Hassan II', city: 'Casablanca', additional_info: 'Client VIP' },
  { id: 2, name: 'Entreprise Beta', address: '25 Av Mohammed V', city: 'Rabat', additional_info: '' },
  { id: 3, name: 'Comptoir Gamma', address: '5 Bd Zerktouni', city: 'Casablanca', additional_info: 'Nouveau' },
]

const renderPage = () => render(
  <MemoryRouter>
    <CustomersPage />
  </MemoryRouter>
)

describe('CustomersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.electronAPI.customers.getAll.mockResolvedValue([...mockCustomers])
  })

  describe('chargement initial', () => {
    it('charge les clients au montage', async () => {
      renderPage()
      await waitFor(() => {
        expect(window.electronAPI.customers.getAll).toHaveBeenCalledOnce()
      })
    })

    it('affiche les clients dans le tableau', async () => {
      renderPage()
      await waitFor(() => {
        expect(screen.getByText('Société Alpha')).toBeInTheDocument()
        expect(screen.getByText('Entreprise Beta')).toBeInTheDocument()
        expect(screen.getByText('Comptoir Gamma')).toBeInTheDocument()
      })
    })

    it('affiche le titre de la page', async () => {
      renderPage()
      expect(screen.getByText(/base de donn[eé]es/i)).toBeInTheDocument()
    })
  })

  describe('recherche', () => {
    it('filtre par nom', async () => {
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

    it('filtre par ville', async () => {
      const user = userEvent.setup()
      renderPage()
      
      await waitFor(() => {
        expect(screen.getByText('Société Alpha')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/rechercher/i)
      await user.type(searchInput, 'Rabat')

      expect(screen.getByText('Entreprise Beta')).toBeInTheDocument()
      expect(screen.queryByText('Société Alpha')).not.toBeInTheDocument()
    })
  })

  describe('modal ajout', () => {
    it('ouvre le modal d\'ajout au clic sur Ajouter', async () => {
      const user = userEvent.setup()
      renderPage()

      await waitFor(() => {
        expect(screen.getByText('Société Alpha')).toBeInTheDocument()
      })

      const addBtn = screen.getByRole('button', { name: /ajouter/i })
      await user.click(addBtn)

      // Le modal s'ouvre avec un titre
      const modalTitle = document.querySelector('.modal-title')
      expect(modalTitle).toBeInTheDocument()
    })
  })

  describe('gestion des erreurs', () => {
    it('gère une erreur de chargement', async () => {
      window.electronAPI.customers.getAll.mockRejectedValue(new Error('DB error'))
      renderPage()

      await waitFor(() => {
        expect(window.electronAPI.customers.getAll).toHaveBeenCalled()
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
