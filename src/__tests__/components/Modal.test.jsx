import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/ui/Modal'

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Titre du Modal',
    children: <p>Contenu du modal</p>,
  }

  beforeEach(() => {
    defaultProps.onClose = vi.fn()
  })

  it('ne rend rien quand isOpen est false', () => {
    render(<Modal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Titre du Modal')).not.toBeInTheDocument()
  })

  it('rend le modal quand isOpen est true', () => {
    render(<Modal {...defaultProps} />)
    expect(screen.getByText('Titre du Modal')).toBeInTheDocument()
  })

  it('affiche le titre', () => {
    render(<Modal {...defaultProps} />)
    expect(screen.getByText('Titre du Modal')).toBeInTheDocument()
  })

  it('affiche le contenu', () => {
    render(<Modal {...defaultProps} />)
    expect(screen.getByText('Contenu du modal')).toBeInTheDocument()
  })

  it('affiche le footer quand fourni', () => {
    render(
      <Modal {...defaultProps} footer={<button>Sauvegarder</button>} />
    )
    expect(screen.getByText('Sauvegarder')).toBeInTheDocument()
  })

  it('n\'affiche pas de footer quand non fourni', () => {
    render(<Modal {...defaultProps} />)
    // The modal-footer div should not be rendered
    const portal = document.querySelector('.modal-footer')
    expect(portal).not.toBeInTheDocument()
  })

  it('a un bouton de fermeture', () => {
    render(<Modal {...defaultProps} />)
    const closeButton = document.querySelector('.modal-close')
    expect(closeButton).toBeInTheDocument()
  })

  it('appelle onClose quand on clique sur le bouton X', async () => {
    const user = userEvent.setup()
    render(<Modal {...defaultProps} />)
    
    const closeButton = document.querySelector('.modal-close')
    await user.click(closeButton)
    expect(defaultProps.onClose).toHaveBeenCalledOnce()
  })

  it('appelle onClose quand on clique sur l\'overlay', async () => {
    const user = userEvent.setup()
    render(<Modal {...defaultProps} />)

    const overlay = document.querySelector('.modal-overlay')
    await user.click(overlay)
    // Le clic sur l'overlay (pas le modal) appelle onClose
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('ne ferme pas quand on clique dans le modal', async () => {
    const user = userEvent.setup()
    render(<Modal {...defaultProps} />)

    const modalBody = screen.getByText('Contenu du modal')
    await user.click(modalBody)
    // Le stopPropagation empêche la fermeture
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('ferme avec Escape', async () => {
    const user = userEvent.setup()
    render(<Modal {...defaultProps} />)
    
    await user.keyboard('{Escape}')
    expect(defaultProps.onClose).toHaveBeenCalledOnce()
  })

  it('bloque le scroll du body quand ouvert', () => {
    render(<Modal {...defaultProps} />)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restaure le scroll du body quand fermé', () => {
    const { rerender } = render(<Modal {...defaultProps} />)
    rerender(<Modal {...defaultProps} isOpen={false} />)
    expect(document.body.style.overflow).toBe('')
  })
})
