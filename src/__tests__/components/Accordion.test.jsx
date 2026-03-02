import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'

describe('Accordion', () => {
  describe('single mode', () => {
    it('renders item buttons with accessibility attributes', () => {
      render(
        <Accordion>
          <AccordionItem value="a" title="Section A">Contenu A</AccordionItem>
          <AccordionItem value="b" title="Section B">Contenu B</AccordionItem>
        </Accordion>
      )

      const triggerA = screen.getByRole('button', { name: 'Section A' })
      expect(triggerA).toHaveAttribute('aria-expanded', 'false')
      expect(triggerA).toHaveAttribute('aria-controls')
    })

    it('opens and closes one section at a time', async () => {
      const user = userEvent.setup()
      render(
        <Accordion>
          <AccordionItem value="a" title="Section A">Contenu A</AccordionItem>
          <AccordionItem value="b" title="Section B">Contenu B</AccordionItem>
        </Accordion>
      )

      const triggerA = screen.getByRole('button', { name: 'Section A' })
      const triggerB = screen.getByRole('button', { name: 'Section B' })

      await user.click(triggerA)
      expect(triggerA).toHaveAttribute('aria-expanded', 'true')

      await user.click(triggerB)
      expect(triggerB).toHaveAttribute('aria-expanded', 'true')
      expect(triggerA).toHaveAttribute('aria-expanded', 'false')

      await user.click(triggerB)
      expect(triggerB).toHaveAttribute('aria-expanded', 'false')
    })

    it('supports keyboard activation', async () => {
      const user = userEvent.setup()
      render(
        <Accordion>
          <AccordionItem value="a" title="Section A">Contenu A</AccordionItem>
        </Accordion>
      )

      const triggerA = screen.getByRole('button', { name: 'Section A' })
      triggerA.focus()
      await user.keyboard('[Enter]')
      expect(triggerA).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('controlled mode', () => {
    it('calls onValueChange with toggle state', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()

      render(
        <Accordion value="" onValueChange={handleChange}>
          <AccordionItem value="a" title="Section A">Contenu A</AccordionItem>
        </Accordion>
      )

      await user.click(screen.getByRole('button', { name: 'Section A' }))
      expect(handleChange).toHaveBeenCalledWith('a')

      render(
        <Accordion value="a" onValueChange={handleChange}>
          <AccordionItem value="a" title="Section A">Contenu A</AccordionItem>
        </Accordion>
      )

      await user.click(screen.getAllByRole('button', { name: 'Section A' })[1])
      expect(handleChange).toHaveBeenCalledWith('')
    })
  })

  describe('multiple mode', () => {
    it('allows multiple sections to stay open', async () => {
      const user = userEvent.setup()

      render(
        <Accordion type="multiple">
          <AccordionItem value="a" title="Section A">Contenu A</AccordionItem>
          <AccordionItem value="b" title="Section B">Contenu B</AccordionItem>
        </Accordion>
      )

      await user.click(screen.getByText('Section A'))
      await user.click(screen.getByText('Section B'))

      expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByRole('button', { name: 'Section B' })).toHaveAttribute('aria-expanded', 'true')
    })
  })
})
