import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('rend le texte du bouton', () => {
    render(<Button>Cliquez ici</Button>)
    expect(screen.getByText('Cliquez ici')).toBeInTheDocument()
  })

  it('applique le variant primary par défaut', () => {
    render(<Button>Test</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('btn-primary')
  })

  it('applique le variant danger', () => {
    render(<Button variant="danger">Supprimer</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('btn-danger')
  })

  it('applique le variant outline', () => {
    render(<Button variant="outline">Annuler</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('btn-outline')
  })

  it('applique le variant ghost', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('btn-ghost')
  })

  it('applique la taille sm', () => {
    render(<Button size="sm">Petit</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('btn-sm')
  })

  it('applique la taille lg', () => {
    render(<Button size="lg">Grand</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('btn-lg')
  })

  it('n\'ajoute pas de classe taille pour md', () => {
    render(<Button size="md">Normal</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).not.toContain('btn-md')
  })

  it('est désactivé quand disabled=true', () => {
    render(<Button disabled>Désactivé</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('est désactivé pendant le chargement', () => {
    render(<Button isLoading>Chargement</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('affiche un spinner pendant le chargement', () => {
    render(<Button isLoading>Chargement</Button>)
    const btn = screen.getByRole('button')
    expect(btn.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('type button par défaut', () => {
    render(<Button>Test</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('type submit quand spécifié', () => {
    render(<Button type="submit">Envoyer</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('appelle onClick au clic', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Test</Button>)
    screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('n\'appelle pas onClick quand désactivé', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Test</Button>)
    screen.getByRole('button').click()
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('accepte une className personnalisée', () => {
    render(<Button className="custom-class">Test</Button>)
    expect(screen.getByRole('button').className).toContain('custom-class')
  })
})
