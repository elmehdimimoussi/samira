import { describe, it, expect } from 'vitest'
import { formatAmount, parseAmount, formatAmountLive } from '@/services/amountFormatter'

describe('amountFormatter', () => {
  // ─── formatAmount ──────────────────────────────────────────────
  describe('formatAmount', () => {
    it('formate un entier simple', () => {
      expect(formatAmount(1000)).toBe('1 000,00')
    })

    it('formate un nombre décimal', () => {
      expect(formatAmount(10500.50)).toBe('10 500,50')
    })

    it('formate zéro', () => {
      expect(formatAmount(0)).toBe('0,00')
    })

    it('formate un petit nombre', () => {
      expect(formatAmount(5)).toBe('5,00')
    })

    it('formate un grand nombre', () => {
      expect(formatAmount(1234567.89)).toBe('1 234 567,89')
    })

    it('arrondit à 2 décimales', () => {
      expect(formatAmount(10.555)).toBe('10,56')
    })

    it('gère une string avec virgule', () => {
      expect(formatAmount('10 500,50')).toBe('10 500,50')
    })

    it('gère une string avec point', () => {
      expect(formatAmount('10500.50')).toBe('10 500,50')
    })

    it('retourne vide pour une valeur invalide', () => {
      expect(formatAmount('abc')).toBe('')
    })

    it('retourne vide pour NaN', () => {
      expect(formatAmount(NaN)).toBe('')
    })

    it('formate un nombre négatif', () => {
      expect(formatAmount(-1500)).toBe('-1 500,00')
    })

    it('formate une centaine', () => {
      expect(formatAmount(999)).toBe('999,00')
    })

    it('formate exactement 1 million', () => {
      expect(formatAmount(1000000)).toBe('1 000 000,00')
    })

    it('gère les petits décimaux', () => {
      expect(formatAmount(0.01)).toBe('0,01')
    })

    it('gère les centimes', () => {
      expect(formatAmount(0.99)).toBe('0,99')
    })
  })

  // ─── parseAmount ───────────────────────────────────────────────
  describe('parseAmount', () => {
    it('parse un montant formaté standard', () => {
      expect(parseAmount('10 500,50')).toBe(10500.50)
    })

    it('parse un montant sans espaces', () => {
      expect(parseAmount('10500,50')).toBe(10500.50)
    })

    it('retourne 0 pour une chaine vide', () => {
      expect(parseAmount('')).toBe(0)
    })

    it('retourne 0 pour null', () => {
      expect(parseAmount(null)).toBe(0)
    })

    it('retourne 0 pour undefined', () => {
      expect(parseAmount(undefined)).toBe(0)
    })

    it('retourne 0 pour une chaine invalide', () => {
      expect(parseAmount('abc')).toBe(0)
    })

    it('parse un entier', () => {
      expect(parseAmount('1 000')).toBe(1000)
    })

    it('parse des grands montants', () => {
      expect(parseAmount('1 234 567,89')).toBe(1234567.89)
    })

    it('la conversion est réversible', () => {
      const original = 12345.67
      expect(parseAmount(formatAmount(original))).toBe(original)
    })
  })

  // ─── formatAmountLive ─────────────────────────────────────────
  describe('formatAmountLive', () => {
    it('supprime les caractères non numériques', () => {
      expect(formatAmountLive('abc123')).toBe('123')
    })

    it('remplace le point par une virgule', () => {
      expect(formatAmountLive('100.50')).toBe('100,50')
    })

    it('empêche plusieurs virgules', () => {
      // La fonction limite à 2 décimales, donc '50' est gardé et ',30' est supprimé
      expect(formatAmountLive('100,50,30')).toBe('100,50')
    })

    it('limite les décimales à 2', () => {
      expect(formatAmountLive('100,567')).toBe('100,56')
    })

    it('ajoute les séparateurs de milliers', () => {
      expect(formatAmountLive('10500')).toBe('10 500')
    })

    it('formate en temps réel un grand nombre', () => {
      expect(formatAmountLive('1234567')).toBe('1 234 567')
    })

    it('gère une entrée vide', () => {
      expect(formatAmountLive('')).toBe('')
    })

    it('gère juste une virgule', () => {
      expect(formatAmountLive(',')).toBe(',')
    })

    it('gère un nombre suivi de virgule', () => {
      expect(formatAmountLive('100,')).toBe('100,')
    })
  })
})
