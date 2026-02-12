import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input, Textarea } from '@/components/ui/Input'

describe('Input', () => {
  it('rend un input', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('affiche le label', () => {
    render(<Input label="Nom" />)
    expect(screen.getByText('Nom')).toBeInTheDocument()
  })

  it('le label est associé à l\'input', () => {
    render(<Input label="Nom" />)
    const input = screen.getByLabelText('Nom')
    expect(input).toBeInTheDocument()
  })

  it('affiche un message d\'erreur', () => {
    render(<Input error="Ce champ est requis" />)
    expect(screen.getByText('Ce champ est requis')).toBeInTheDocument()
  })

  it('applique la classe d\'erreur', () => {
    render(<Input error="Erreur" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('border-danger')
  })

  it('passe le type au input', () => {
    render(<Input type="email" label="Email" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
  })

  it('accepte un placeholder', () => {
    render(<Input placeholder="Entrez votre nom" />)
    expect(screen.getByPlaceholderText('Entrez votre nom')).toBeInTheDocument()
  })

  it('accepte les props supplémentaires', () => {
    render(<Input data-testid="custom-input" />)
    expect(screen.getByTestId('custom-input')).toBeInTheDocument()
  })

  it('gère la saisie utilisateur', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'Hello')
    expect(handleChange).toHaveBeenCalled()
  })

  it('utilise un id personnalisé si fourni', () => {
    render(<Input id="my-id" label="Test" />)
    expect(screen.getByLabelText('Test')).toHaveAttribute('id', 'my-id')
  })
})

describe('Textarea', () => {
  it('rend un textarea', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('affiche le label', () => {
    render(<Textarea label="Description" />)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('le label est associé au textarea', () => {
    render(<Textarea label="Description" />)
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
  })

  it('affiche un message d\'erreur', () => {
    render(<Textarea error="Trop court" />)
    expect(screen.getByText('Trop court')).toBeInTheDocument()
  })

  it('utilise 3 lignes par défaut', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3')
  })

  it('accepte un nombre de lignes personnalisé', () => {
    render(<Textarea rows={5} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5')
  })
})
