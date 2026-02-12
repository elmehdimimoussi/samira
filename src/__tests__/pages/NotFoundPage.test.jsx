import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFoundPage from '@/pages/NotFoundPage'

describe('NotFoundPage', () => {
  const renderPage = () => render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  )

  it('affiche le titre "Page introuvable"', () => {
    renderPage()
    expect(screen.getByText('Page introuvable')).toBeInTheDocument()
  })

  it('affiche un message explicatif', () => {
    renderPage()
    expect(screen.getByText(/n'existe pas/)).toBeInTheDocument()
  })

  it('a un lien de retour à l\'accueil', () => {
    renderPage()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/')
  })

  it('affiche le bouton "Retour à l\'accueil"', () => {
    renderPage()
    expect(screen.getByText(/retour/i)).toBeInTheDocument()
  })
})
