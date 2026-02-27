import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'

describe('Accordion', () => {
  describe('mode single (défaut)', () => {
    it('rend tous les items', () => {
      render(
        <Accordion>
          <AccordionItem value="a" title="Section A">Contenu A</AccordionItem>
          <AccordionItem value="b" title="Section B">Contenu B</AccordionItem>
        </Accordion>
      )
      expect(screen.getByText('Section A')).toBeInTheDocument()
      expect(screen.getByText('Section B')).toBeInTheDocument()
    })

    it('tous les items sont fermés par défaut', () => {
      render(
        <Accordion>
          <AccordionItem value="a" title="Section A">Contenu A</AccordionItem>
        </Accordion>
      )
      // Le contenu est dans le DOM mais caché (height: 0)
      expect(screen.getByText('Contenu A')).toBeInTheDocument()
    })

    it('ouvre un item au clic', async () => {
      const user = userEvent.setup()
      render(
        <Accordion>
          <AccordionItem value="a" title="Section A">Contenu A</AccordionItem>
          <AccordionItem value="b" title="Section B">Contenu B</AccordionItem>
        </Accordion>
      )

      await user.click(screen.getByText('Section A'))
      // L'item A est maintenant ouvert
      expect(screen.getByText('Contenu A')).toBeVisible()
    })

    it('ferme l\'item ouvert en recliquant dessus', async () => {
      const user = userEvent.setup()
      render(
        <Accordion>
          <AccordionItem value="a" title="Section A">Contenu A</AccordionItem>
        </Accordion>
      )

      // Ouvrir
      await user.click(screen.getByText('Section A'))
      // Fermer
      await user.click(screen.getByText('Section A'))
      // Le contenu est toujours dans le DOM
      expect(screen.getByText('Contenu A')).toBeInTheDocument()
    })

    it('accepte une valeur par défaut', () => {
      render(
        <Accordion defaultValue="a">
          <AccordionItem value="a" title="Section A">Contenu A</AccordionItem>
          <AccordionItem value="b" title="Section B">Contenu B</AccordionItem>
        </Accordion>
      )
      expect(screen.getByText('Contenu A')).toBeInTheDocument()
    })
  })

  describe('mode contrôlé', () => {
    it('appelle onValueChange au clic', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()

      render(
        <Accordion value="" onValueChange={handleChange}>
          <AccordionItem value="a" title="Section A">Contenu A</AccordionItem>
        </Accordion>
      )

      await user.click(screen.getByText('Section A'))
      expect(handleChange).toHaveBeenCalledWith('a')
    })
  })

  describe('mode multiple', () => {
    it('permet d\'ouvrir plusieurs items', async () => {
      const user = userEvent.setup()

      render(
        <Accordion type="multiple">
          <AccordionItem value="a" title="Section A">Contenu A</AccordionItem>
          <AccordionItem value="b" title="Section B">Contenu B</AccordionItem>
        </Accordion>
      )

      await user.click(screen.getByText('Section A'))
      await user.click(screen.getByText('Section B'))

      expect(screen.getByText('Contenu A')).toBeInTheDocument()
      expect(screen.getByText('Contenu B')).toBeInTheDocument()
    })
  })
})
