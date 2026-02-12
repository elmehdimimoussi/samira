import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'

describe('Card', () => {
  it('rend le contenu', () => {
    render(<Card>Contenu</Card>)
    expect(screen.getByText('Contenu')).toBeInTheDocument()
  })

  it('applique la classe card', () => {
    const { container } = render(<Card>Test</Card>)
    expect(container.firstChild.className).toContain('card')
  })

  it('accepte une className personnalisée', () => {
    const { container } = render(<Card className="ma-classe">Test</Card>)
    expect(container.firstChild.className).toContain('ma-classe')
  })
})

describe('CardHeader', () => {
  it('rend le contenu', () => {
    render(<CardHeader>En-tête</CardHeader>)
    expect(screen.getByText('En-tête')).toBeInTheDocument()
  })

  it('applique la classe card-header', () => {
    const { container } = render(<CardHeader>Test</CardHeader>)
    expect(container.firstChild.className).toContain('card-header')
  })
})

describe('CardTitle', () => {
  it('rend un h3', () => {
    render(<CardTitle>Titre</CardTitle>)
    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveTextContent('Titre')
  })

  it('applique la classe card-title', () => {
    render(<CardTitle>Titre</CardTitle>)
    const heading = screen.getByRole('heading')
    expect(heading.className).toContain('card-title')
  })
})

describe('CardBody', () => {
  it('rend le contenu', () => {
    render(<CardBody>Corps</CardBody>)
    expect(screen.getByText('Corps')).toBeInTheDocument()
  })

  it('applique la classe card-body', () => {
    const { container } = render(<CardBody>Test</CardBody>)
    expect(container.firstChild.className).toContain('card-body')
  })
})

describe('Card composé', () => {
  it('rend une carte complète', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Mon Titre</CardTitle>
        </CardHeader>
        <CardBody>Mon Contenu</CardBody>
      </Card>
    )
    expect(screen.getByText('Mon Titre')).toBeInTheDocument()
    expect(screen.getByText('Mon Contenu')).toBeInTheDocument()
  })
})
