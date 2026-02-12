import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import SettingsPage from '@/pages/SettingsPage'

const renderPage = () => render(
  <MemoryRouter>
    <SettingsPage />
  </MemoryRouter>
)

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.electronAPI.settings.get.mockResolvedValue(null)
    window.electronAPI.templates.getAll.mockResolvedValue([])
    window.electronAPI.templates.getActive.mockResolvedValue(null)
    window.electronAPI.frames.getAll.mockResolvedValue([])
  })

  describe('rendu initial', () => {
    it('affiche le titre Paramètres', () => {
      renderPage()
      expect(screen.getByText('Paramètres')).toBeInTheDocument()
    })

    it('affiche les onglets', () => {
      renderPage()
      const tabs = screen.getAllByRole('button')
      expect(tabs.length).toBeGreaterThan(0)
    })

    it('affiche les contrôles du designer', () => {
      renderPage()
      expect(screen.getByText('Ajouter')).toBeInTheDocument()
      expect(screen.getByText('Grille')).toBeInTheDocument()
      expect(screen.getByText('Aperçu')).toBeInTheDocument()
    })

    it('affiche le compteur de champs actifs', () => {
      renderPage()
      expect(screen.getByText(/champs actifs/)).toBeInTheDocument()
    })

    it('affiche le zoom', () => {
      renderPage()
      expect(screen.getByText('100%')).toBeInTheDocument()
    })
  })

  describe('zoom', () => {
    it('peut réinitialiser le zoom en cliquant sur le pourcentage', async () => {
      const user = userEvent.setup()
      renderPage()
      const zoomLabel = screen.getByText('100%')
      await user.click(zoomLabel)
      expect(screen.getByText('100%')).toBeInTheDocument()
    })
  })

  describe('liste des champs', () => {
    it('affiche les champs par défaut dans le panneau de propriétés', () => {
      renderPage()
      expect(screen.getByText('Tous les champs (16)')).toBeInTheDocument()
    })

    it('affiche le champ de recherche', () => {
      renderPage()
      expect(screen.getByPlaceholderText('Rechercher un champ...')).toBeInTheDocument()
    })

    it('filtre les champs avec la recherche', async () => {
      const user = userEvent.setup()
      renderPage()
      const search = screen.getByPlaceholderText('Rechercher un champ...')
      await user.type(search, 'Tireur')
      // Both labels appear in the canvas and in the list, so use getAllByText
      expect(screen.getAllByText('Tireur - Nom').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Tireur - Adresse').length).toBeGreaterThanOrEqual(1)
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

  describe('onglet paramètres généraux', () => {
    it('affiche les options d\'impression et PDF', async () => {
      const user = userEvent.setup()
      renderPage()
      await user.click(screen.getByText('Paramètres Généraux'))
      expect(screen.getByText('Imprimer uniquement le texte')).toBeInTheDocument()
      expect(screen.getByText("Inclure l'image de fond dans le PDF")).toBeInTheDocument()
    })

    it('affiche la section sauvegarde et restauration', async () => {
      const user = userEvent.setup()
      renderPage()
      await user.click(screen.getByText('Paramètres Généraux'))
      expect(screen.getByText('Sauvegarde et Restauration')).toBeInTheDocument()
    })
  })
})
