import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '@/components/ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    window.localStorage.clear()
    vi.clearAllMocks()
  })

  it('rend le bouton', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('affiche "Mode Sombre" en mode light', () => {
    window.localStorage.getItem.mockReturnValue('light')
    render(<ThemeToggle />)
    expect(screen.getByText('Mode Sombre')).toBeInTheDocument()
  })

  it('affiche "Mode Clair" en mode dark', () => {
    window.localStorage.getItem.mockReturnValue('dark')
    render(<ThemeToggle />)
    expect(screen.getByText('Mode Clair')).toBeInTheDocument()
  })

  it('change le thème au clic', async () => {
    const user = userEvent.setup()
    window.localStorage.getItem.mockReturnValue('light')
    render(<ThemeToggle />)
    
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Mode Clair')).toBeInTheDocument()
  })

  it('sauvegarde le thème dans localStorage', async () => {
    const user = userEvent.setup()
    window.localStorage.getItem.mockReturnValue('light')
    render(<ThemeToggle />)
    
    await user.click(screen.getByRole('button'))
    expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('ajoute la classe dark au documentElement', async () => {
    const user = userEvent.setup()
    window.localStorage.getItem.mockReturnValue('light')
    render(<ThemeToggle />)
    
    await user.click(screen.getByRole('button'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('retire la classe dark quand on repasse en light', async () => {
    const user = userEvent.setup()
    window.localStorage.getItem.mockReturnValue('dark')
    render(<ThemeToggle />)
    
    // Il est en mode dark, on clique pour passer en light
    await user.click(screen.getByRole('button'))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
