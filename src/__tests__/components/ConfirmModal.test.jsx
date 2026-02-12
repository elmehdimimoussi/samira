import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Confirmation',
    message: 'Êtes-vous sûr ?',
    confirmText: 'Confirmer',
  }

  beforeEach(() => {
    defaultProps.onClose = vi.fn()
    defaultProps.onConfirm = vi.fn()
  })

  it('ne rend rien quand isOpen est false', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Êtes-vous sûr ?')).not.toBeInTheDocument()
  })

  it('affiche le titre', () => {
    render(<ConfirmModal {...defaultProps} />)
    expect(screen.getByText('Confirmation')).toBeInTheDocument()
  })

  it('affiche le message', () => {
    render(<ConfirmModal {...defaultProps} />)
    expect(screen.getByText('Êtes-vous sûr ?')).toBeInTheDocument()
  })

  it('affiche le bouton Annuler', () => {
    render(<ConfirmModal {...defaultProps} />)
    expect(screen.getByText('Annuler')).toBeInTheDocument()
  })

  it('affiche le bouton Confirmer', () => {
    render(<ConfirmModal {...defaultProps} />)
    expect(screen.getByText('Confirmer')).toBeInTheDocument()
  })

  it('appelle onClose quand on clique sur Annuler', async () => {
    const user = userEvent.setup()
    render(<ConfirmModal {...defaultProps} />)

    await user.click(screen.getByText('Annuler'))
    expect(defaultProps.onClose).toHaveBeenCalledOnce()
  })

  it('appelle onConfirm et onClose quand on confirme', async () => {
    const user = userEvent.setup()
    render(<ConfirmModal {...defaultProps} />)

    await user.click(screen.getByText('Confirmer'))
    expect(defaultProps.onConfirm).toHaveBeenCalledOnce()
    expect(defaultProps.onClose).toHaveBeenCalledOnce()
  })

  it('accepte un texte de confirmation personnalisé', () => {
    render(<ConfirmModal {...defaultProps} confirmText="Supprimer" />)
    expect(screen.getByText('Supprimer')).toBeInTheDocument()
  })

  it('ferme avec Escape', async () => {
    const user = userEvent.setup()
    render(<ConfirmModal {...defaultProps} />)

    await user.keyboard('{Escape}')
    expect(defaultProps.onClose).toHaveBeenCalledOnce()
  })
})
