import { describe, it, expect } from 'vitest'
import { formatDate, formatDateForInput, parseFrenchDate, getToday } from '@/services/dateFormatter'

describe('dateFormatter', () => {
  // ─── formatDate ────────────────────────────────────────────────
  describe('formatDate', () => {
    it('formate un objet Date avec tiret', () => {
      const date = new Date(2026, 0, 15) // 15 janvier 2026
      expect(formatDate(date)).toBe('15-01-2026')
    })

    it('formate un objet Date avec slash', () => {
      const date = new Date(2026, 11, 25) // 25 décembre 2026
      expect(formatDate(date, '/')).toBe('25/12/2026')
    })

    it('formate une date ISO string', () => {
      expect(formatDate('2026-03-05')).toBe('05-03-2026')
    })

    it('formate une date DD/MM/YYYY', () => {
      expect(formatDate('15/01/2026')).toBe('15-01-2026')
    })

    it('formate une date DD-MM-YYYY', () => {
      expect(formatDate('20-06-2026')).toBe('20-06-2026')
    })

    it('retourne vide pour une entrée vide', () => {
      expect(formatDate('')).toBe('')
    })

    it('retourne vide pour null', () => {
      expect(formatDate(null)).toBe('')
    })

    it('retourne vide pour une date invalide', () => {
      expect(formatDate('invalid')).toBe('')
    })

    it('padding du jour et mois à 2 chiffres', () => {
      const date = new Date(2026, 0, 5) // 5 janvier
      expect(formatDate(date)).toBe('05-01-2026')
    })

    it('gère le dernier jour du mois', () => {
      const date = new Date(2026, 1, 28) // 28 février
      expect(formatDate(date)).toBe('28-02-2026')
    })
  })

  // ─── formatDateForInput ────────────────────────────────────────
  describe('formatDateForInput', () => {
    it('formate un objet Date pour un input HTML', () => {
      const date = new Date(2026, 0, 15)
      expect(formatDateForInput(date)).toBe('2026-01-15')
    })

    it('formate une string ISO', () => {
      expect(formatDateForInput('2026-06-20')).toBe('2026-06-20')
    })

    it('retourne vide pour entrée vide', () => {
      expect(formatDateForInput('')).toBe('')
    })

    it('retourne vide pour null', () => {
      expect(formatDateForInput(null)).toBe('')
    })

    it('retourne vide pour date invalide', () => {
      expect(formatDateForInput('invalid')).toBe('')
    })

    it('padding correct', () => {
      const date = new Date(2026, 2, 3) // 3 mars
      expect(formatDateForInput(date)).toBe('2026-03-03')
    })
  })

  // ─── parseFrenchDate ───────────────────────────────────────────
  describe('parseFrenchDate', () => {
    it('parse une date DD-MM-YYYY', () => {
      const result = parseFrenchDate('15-01-2026')
      expect(result).toBeInstanceOf(Date)
      expect(result.getDate()).toBe(15)
      expect(result.getMonth()).toBe(0) // janvier
      expect(result.getFullYear()).toBe(2026)
    })

    it('parse une date DD/MM/YYYY', () => {
      const result = parseFrenchDate('25/12/2026')
      expect(result).toBeInstanceOf(Date)
      expect(result.getDate()).toBe(25)
      expect(result.getMonth()).toBe(11) // décembre
    })

    it('retourne null pour une entrée vide', () => {
      expect(parseFrenchDate('')).toBeNull()
    })

    it('retourne null pour null', () => {
      expect(parseFrenchDate(null)).toBeNull()
    })

    it('retourne null pour un format invalide', () => {
      expect(parseFrenchDate('2026')).toBeNull()
    })

    it('retourne null pour une date impossible (31 février)', () => {
      expect(parseFrenchDate('31-02-2026')).toBeNull()
    })

    it('retourne null pour un mois invalide (13)', () => {
      expect(parseFrenchDate('15-13-2026')).toBeNull()
    })

    it('gère une année bissextile (29 février)', () => {
      const result = parseFrenchDate('29-02-2028') // 2028 est bissextile
      expect(result).toBeInstanceOf(Date)
      expect(result.getDate()).toBe(29)
    })

    it('rejette le 29 février pour une année non-bissextile', () => {
      expect(parseFrenchDate('29-02-2026')).toBeNull()
    })
  })

  // ─── getToday ──────────────────────────────────────────────────
  describe('getToday', () => {
    it('retourne la date du jour au format DD-MM-YYYY', () => {
      const today = getToday()
      expect(today).toMatch(/^\d{2}-\d{2}-\d{4}$/)
    })

    it('retourne la date du jour avec slash', () => {
      const today = getToday('/')
      expect(today).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
    })

    it('la date correspond bien à aujourd\'hui', () => {
      const now = new Date()
      const today = getToday()
      const parsed = parseFrenchDate(today)
      expect(parsed.getDate()).toBe(now.getDate())
      expect(parsed.getMonth()).toBe(now.getMonth())
      expect(parsed.getFullYear()).toBe(now.getFullYear())
    })
  })
})
