import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import FillingPage from '@/pages/FillingPage'

const renderPage = () => render(
  <MemoryRouter>
    <FillingPage />
  </MemoryRouter>
)

// Sample frames that simulate saved settings from the designer
const mockFrames = [
  { id: 1, frame_type: 'date_due', label: "Date d'échéance", x: 650, y: 30, width: 120, height: 20, font_size: 11, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'center', enabled: true },
  { id: 2, frame_type: 'amount_numeric', label: 'Montant (chiffres)', x: 650, y: 60, width: 120, height: 20, font_size: 12, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'right', enabled: true },
  { id: 3, frame_type: 'tireur_name', label: 'Tireur - Nom', x: 20, y: 40, width: 250, height: 20, font_size: 11, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
  { id: 4, frame_type: 'tireur_address', label: 'Tireur - Adresse', x: 20, y: 60, width: 250, height: 20, font_size: 10, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
  { id: 5, frame_type: 'beneficiary_name', label: 'Bénéficiaire', x: 300, y: 110, width: 300, height: 20, font_size: 11, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
  { id: 6, frame_type: 'drawer_name', label: 'Tiré - Nom', x: 300, y: 240, width: 250, height: 20, font_size: 11, font_family: 'Courier New', font_weight: 'normal', font_style: 'italic', color: '#FF0000', text_align: 'left', enabled: true },
  { id: 7, frame_type: 'city', label: 'Ville', x: 460, y: 320, width: 100, height: 20, font_size: 10, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: false },
]

describe('FillingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.electronAPI.customers.getAll.mockResolvedValue([])
    window.electronAPI.settings.get.mockResolvedValue(null)
    window.electronAPI.templates.getActive.mockResolvedValue(null)
    window.electronAPI.frames.getAll.mockResolvedValue([])
    window.sessionStorage.clear()
  })

  describe('rendu initial', () => {
    it('affiche le titre Remplissage', () => {
      renderPage()
      expect(screen.getByText(/remplissage/i)).toBeInTheDocument()
    })

    it('affiche les sections du formulaire', async () => {
      renderPage()
      await waitFor(() => {
        const matches = screen.getAllByText(/g[eé]n[eé]ral/i)
        expect(matches.length).toBeGreaterThanOrEqual(1)
      })
    })

    it('affiche la zone d\'aperçu', () => {
      renderPage()
      expect(screen.getByText(/aper[cç]u/i)).toBeInTheDocument()
    })

    it('n\'affiche pas de contrôle de zoom', () => {
      renderPage()
      expect(screen.queryByText('100%')).not.toBeInTheDocument()
    })
  })

  describe('chargement des frames depuis les paramètres', () => {
    it('charge les frames depuis electronAPI.frames.getAll', async () => {
      window.electronAPI.frames.getAll.mockResolvedValue(mockFrames)
      renderPage()

      await waitFor(() => {
        expect(window.electronAPI.frames.getAll).toHaveBeenCalledTimes(1)
      })
    })

    it('applique les positions x/y des frames sur les éléments de prévisualisation', async () => {
      window.electronAPI.frames.getAll.mockResolvedValue(mockFrames)
      const { container } = render(
        <MemoryRouter>
          <FillingPage />
        </MemoryRouter>
      )

      // Simulate image load to trigger preview rendering
      await waitFor(() => {
        const hiddenImg = container.querySelector('img[style*="display: none"]')
        if (hiddenImg) {
          Object.defineProperty(hiddenImg, 'naturalWidth', { value: 1000 })
          Object.defineProperty(hiddenImg, 'naturalHeight', { value: 513 })
          hiddenImg.dispatchEvent(new Event('load'))
        }
      })

      await waitFor(() => {
        const previewFrames = container.querySelectorAll('.preview-frame')
        expect(previewFrames.length).toBeGreaterThan(0)
      })

      const previewFrames = container.querySelectorAll('.preview-frame')

      // Verify each enabled frame has correct position and dimensions
      const enabledFrames = mockFrames.filter(f => f.enabled)
      expect(previewFrames.length).toBe(enabledFrames.length)

      previewFrames.forEach((el, index) => {
        const frame = enabledFrames[index]
        expect(el.style.left).toBe(`${frame.x}px`)
        expect(el.style.top).toBe(`${frame.y}px`)
        expect(el.style.width).toBe(`${frame.width}px`)
        expect(el.style.height).toBe(`${frame.height}px`)
      })
    })

    it('applique la taille de police des frames', async () => {
      window.electronAPI.frames.getAll.mockResolvedValue(mockFrames)
      const { container } = render(
        <MemoryRouter>
          <FillingPage />
        </MemoryRouter>
      )

      await waitFor(() => {
        const hiddenImg = container.querySelector('img[style*="display: none"]')
        if (hiddenImg) {
          Object.defineProperty(hiddenImg, 'naturalWidth', { value: 1000 })
          Object.defineProperty(hiddenImg, 'naturalHeight', { value: 513 })
          hiddenImg.dispatchEvent(new Event('load'))
        }
      })

      await waitFor(() => {
        const previewFrames = container.querySelectorAll('.preview-frame')
        expect(previewFrames.length).toBeGreaterThan(0)
      })

      const previewFrames = container.querySelectorAll('.preview-frame')
      const enabledFrames = mockFrames.filter(f => f.enabled)

      previewFrames.forEach((el, index) => {
        const frame = enabledFrames[index]
        expect(el.style.fontSize).toBe(`${frame.font_size}px`)
      })
    })

    it('applique les propriétés de police personnalisées (famille, poids, style, couleur)', async () => {
      window.electronAPI.frames.getAll.mockResolvedValue(mockFrames)
      const { container } = render(
        <MemoryRouter>
          <FillingPage />
        </MemoryRouter>
      )

      await waitFor(() => {
        const hiddenImg = container.querySelector('img[style*="display: none"]')
        if (hiddenImg) {
          Object.defineProperty(hiddenImg, 'naturalWidth', { value: 1000 })
          Object.defineProperty(hiddenImg, 'naturalHeight', { value: 513 })
          hiddenImg.dispatchEvent(new Event('load'))
        }
      })

      await waitFor(() => {
        const previewFrames = container.querySelectorAll('.preview-frame')
        expect(previewFrames.length).toBeGreaterThan(0)
      })

      const previewFrames = container.querySelectorAll('.preview-frame')
      const enabledFrames = mockFrames.filter(f => f.enabled)

      // Check the drawer_name frame specifically (id: 6) which has custom font settings
      const drawerFrame = enabledFrames.find(f => f.frame_type === 'drawer_name')
      const drawerIndex = enabledFrames.indexOf(drawerFrame)
      const drawerEl = previewFrames[drawerIndex]

      expect(drawerEl.style.fontFamily).toBe('"Courier New"')
      expect(drawerEl.style.fontWeight).toBe('normal')
      expect(drawerEl.style.fontStyle).toBe('italic')
      expect(drawerEl.style.color).toBe('rgb(255, 0, 0)')
    })

    it('ne rend pas les frames désactivées (enabled: false)', async () => {
      window.electronAPI.frames.getAll.mockResolvedValue(mockFrames)
      const { container } = render(
        <MemoryRouter>
          <FillingPage />
        </MemoryRouter>
      )

      await waitFor(() => {
        const hiddenImg = container.querySelector('img[style*="display: none"]')
        if (hiddenImg) {
          Object.defineProperty(hiddenImg, 'naturalWidth', { value: 1000 })
          Object.defineProperty(hiddenImg, 'naturalHeight', { value: 513 })
          hiddenImg.dispatchEvent(new Event('load'))
        }
      })

      await waitFor(() => {
        const previewFrames = container.querySelectorAll('.preview-frame')
        expect(previewFrames.length).toBeGreaterThan(0)
      })

      const previewFrames = container.querySelectorAll('.preview-frame')
      const enabledCount = mockFrames.filter(f => f.enabled).length
      const disabledCount = mockFrames.filter(f => !f.enabled).length

      // Only enabled frames should be rendered
      expect(previewFrames.length).toBe(enabledCount)
      // Make sure we actually had disabled frames in our test data
      expect(disabledCount).toBeGreaterThan(0)

      // Verify that the disabled frame's position is not found among rendered frames
      const disabledFrame = mockFrames.find(f => !f.enabled)
      const renderedPositions = Array.from(previewFrames).map(el => ({
        left: el.style.left,
        top: el.style.top,
      }))
      expect(renderedPositions).not.toContainEqual({
        left: `${disabledFrame.x}px`,
        top: `${disabledFrame.y}px`,
      })
    })

    it('utilise des valeurs par défaut pour les propriétés de police manquantes', async () => {
      // Frames without font properties to test defaults
      const framesWithoutFontProps = [
        { id: 1, frame_type: 'tireur_name', label: 'Tireur - Nom', x: 20, y: 40, width: 250, height: 20, font_size: 11, enabled: true },
      ]
      window.electronAPI.frames.getAll.mockResolvedValue(framesWithoutFontProps)

      const { container } = render(
        <MemoryRouter>
          <FillingPage />
        </MemoryRouter>
      )

      await waitFor(() => {
        const hiddenImg = container.querySelector('img[style*="display: none"]')
        if (hiddenImg) {
          Object.defineProperty(hiddenImg, 'naturalWidth', { value: 1000 })
          Object.defineProperty(hiddenImg, 'naturalHeight', { value: 513 })
          hiddenImg.dispatchEvent(new Event('load'))
        }
      })

      await waitFor(() => {
        const previewFrames = container.querySelectorAll('.preview-frame')
        expect(previewFrames.length).toBe(1)
      })

      const el = container.querySelector('.preview-frame')
      expect(el.style.fontFamily).toBe('Arial')
      expect(el.style.fontWeight).toBe('bold')
      expect(el.style.fontStyle).toBe('normal')
      expect(el.style.color).toBe('rgb(0, 0, 0)')
    })
  })

  describe('positions modifiées dans les paramètres', () => {
    it('affiche les frames aux nouvelles positions après modification', async () => {
      // Simulate frames that were repositioned by the user in Settings
      const repositionedFrames = [
        { id: 1, frame_type: 'date_due', label: "Date d'échéance", x: 100, y: 200, width: 180, height: 30, font_size: 14, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'center', enabled: true },
        { id: 2, frame_type: 'amount_numeric', label: 'Montant', x: 500, y: 400, width: 200, height: 25, font_size: 16, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'right', enabled: true },
      ]
      window.electronAPI.frames.getAll.mockResolvedValue(repositionedFrames)

      const { container } = render(
        <MemoryRouter>
          <FillingPage />
        </MemoryRouter>
      )

      await waitFor(() => {
        const hiddenImg = container.querySelector('img[style*="display: none"]')
        if (hiddenImg) {
          Object.defineProperty(hiddenImg, 'naturalWidth', { value: 1000 })
          Object.defineProperty(hiddenImg, 'naturalHeight', { value: 513 })
          hiddenImg.dispatchEvent(new Event('load'))
        }
      })

      await waitFor(() => {
        const previewFrames = container.querySelectorAll('.preview-frame')
        expect(previewFrames.length).toBe(2)
      })

      const previewFrames = container.querySelectorAll('.preview-frame')

      // First frame: date_due at (100, 200) 180x30
      expect(previewFrames[0].style.left).toBe('100px')
      expect(previewFrames[0].style.top).toBe('200px')
      expect(previewFrames[0].style.width).toBe('180px')
      expect(previewFrames[0].style.height).toBe('30px')
      expect(previewFrames[0].style.fontSize).toBe('14px')

      // Second frame: amount_numeric at (500, 400) 200x25
      expect(previewFrames[1].style.left).toBe('500px')
      expect(previewFrames[1].style.top).toBe('400px')
      expect(previewFrames[1].style.width).toBe('200px')
      expect(previewFrames[1].style.height).toBe('25px')
      expect(previewFrames[1].style.fontSize).toBe('16px')
    })
  })

  describe('contenu des frames dans l\'aperçu', () => {
    it('affiche les valeurs du formulaire dans les frames correspondantes', async () => {
      const user = userEvent.setup()
      const frames = [
        { id: 1, frame_type: 'tireur_name', label: 'Tireur', x: 20, y: 40, width: 250, height: 20, font_size: 11, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
      ]
      window.electronAPI.frames.getAll.mockResolvedValue(frames)

      const { container } = render(
        <MemoryRouter>
          <FillingPage />
        </MemoryRouter>
      )

      // Trigger image load
      await waitFor(() => {
        const hiddenImg = container.querySelector('img[style*="display: none"]')
        if (hiddenImg) {
          Object.defineProperty(hiddenImg, 'naturalWidth', { value: 1000 })
          Object.defineProperty(hiddenImg, 'naturalHeight', { value: 513 })
          hiddenImg.dispatchEvent(new Event('load'))
        }
      })

      await waitFor(() => {
        expect(container.querySelectorAll('.preview-frame').length).toBe(1)
      })

      // Type in the tireur name field
      const nameInput = screen.getByPlaceholderText('Votre nom ou société')
      await user.type(nameInput, 'Ahmed Benali')

      // The preview frame should show the value in uppercase
      await waitFor(() => {
        const frameText = container.querySelector('.preview-frame-text')
        expect(frameText.textContent).toBe('AHMED BENALI')
      })
    })
  })

  describe('autocomplétion client du tiré', () => {
    it('remplit nom, adresse, compte, agence et ville en une sélection', async () => {
      const user = userEvent.setup()
      window.electronAPI.customers.getAll.mockResolvedValue([
        {
          id: 10,
          name: 'Société Atlas',
          address: '12 Rue Atlas, Agadir',
          account_number: 'AT-3321',
          agency: 'Agadir Centre',
          city: 'Agadir',
        },
      ])

      renderPage()

      const drawerInput = await screen.findByPlaceholderText('Rechercher un client...')
      await user.type(drawerInput, 'Atlas')

      const option = await screen.findByRole('option', { name: /Société Atlas/i })
      await user.click(option)

      expect(drawerInput).toHaveValue('Société Atlas')

      const addressInputs = screen.getAllByLabelText('Adresse ou siège')
      expect(addressInputs.some((input) => input.value === '12 Rue Atlas, Agadir')).toBe(true)

      expect(screen.getByLabelText('Compte N°')).toHaveValue('AT-3321')
      expect(screen.getByLabelText('Agence')).toHaveValue('Agadir Centre')
      expect(screen.getByLabelText('Ville')).toHaveValue('Agadir')
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
})
