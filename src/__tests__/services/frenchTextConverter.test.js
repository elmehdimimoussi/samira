import { describe, it, expect } from 'vitest'
import { convertAmountToFrench } from '@/services/frenchTextConverter'

describe('frenchTextConverter', () => {
  // ─── Cas de base ───────────────────────────────────────────────
  describe('cas de base', () => {
    it('convertit zéro', () => {
      expect(convertAmountToFrench(0)).toBe('Zéro dirham')
    })

    it('convertit un dirham', () => {
      expect(convertAmountToFrench(1)).toBe('Un dirham')
    })

    it('convertit deux dirhams', () => {
      expect(convertAmountToFrench(2)).toBe('Deux dirhams')
    })

    it('convertit dix dirhams', () => {
      expect(convertAmountToFrench(10)).toBe('Dix dirhams')
    })

    it('convertit quinze dirhams', () => {
      expect(convertAmountToFrench(15)).toBe('Quinze dirhams')
    })

    it('convertit dix-neuf dirhams', () => {
      expect(convertAmountToFrench(19)).toBe('Dix-neuf dirhams')
    })
  })

  // ─── Dizaines ──────────────────────────────────────────────────
  describe('dizaines', () => {
    it('convertit vingt', () => {
      expect(convertAmountToFrench(20)).toBe('Vingt dirhams')
    })

    it('convertit vingt et un', () => {
      expect(convertAmountToFrench(21)).toBe('Vingt et un dirhams')
    })

    it('convertit trente-cinq', () => {
      expect(convertAmountToFrench(35)).toBe('Trente-cinq dirhams')
    })

    it('convertit quarante et un', () => {
      expect(convertAmountToFrench(41)).toBe('Quarante et un dirhams')
    })

    it('convertit cinquante', () => {
      expect(convertAmountToFrench(50)).toBe('Cinquante dirhams')
    })

    it('convertit soixante', () => {
      expect(convertAmountToFrench(60)).toBe('Soixante dirhams')
    })
  })

  // ─── Nombres spéciaux français (70-99) ─────────────────────────
  describe('nombres spéciaux français (70-99)', () => {
    it('convertit soixante-dix', () => {
      expect(convertAmountToFrench(70)).toBe('Soixante-dix dirhams')
    })

    it('convertit soixante et onze', () => {
      expect(convertAmountToFrench(71)).toBe('Soixante et onze dirhams')
    })

    it('convertit soixante-douze', () => {
      expect(convertAmountToFrench(72)).toBe('Soixante-douze dirhams')
    })

    it('convertit soixante-dix-neuf', () => {
      expect(convertAmountToFrench(79)).toBe('Soixante-dix-neuf dirhams')
    })

    it('convertit quatre-vingts (avec s)', () => {
      expect(convertAmountToFrench(80)).toBe('Quatre-vingts dirhams')
    })

    it('convertit quatre-vingt-un (sans s)', () => {
      expect(convertAmountToFrench(81)).toBe('Quatre-vingt-un dirhams')
    })

    it('convertit quatre-vingt-dix', () => {
      expect(convertAmountToFrench(90)).toBe('Quatre-vingt-dix dirhams')
    })

    it('convertit quatre-vingt-onze', () => {
      expect(convertAmountToFrench(91)).toBe('Quatre-vingt-onze dirhams')
    })

    it('convertit quatre-vingt-dix-neuf', () => {
      expect(convertAmountToFrench(99)).toBe('Quatre-vingt-dix-neuf dirhams')
    })
  })

  // ─── Centaines ─────────────────────────────────────────────────
  describe('centaines', () => {
    it('convertit cent', () => {
      expect(convertAmountToFrench(100)).toBe('Cent dirhams')
    })

    it('convertit deux cents (avec s)', () => {
      expect(convertAmountToFrench(200)).toBe('Deux cents dirhams')
    })

    it('convertit deux cent un (sans s)', () => {
      expect(convertAmountToFrench(201)).toBe('Deux cent un dirhams')
    })

    it('convertit trois cents', () => {
      expect(convertAmountToFrench(300)).toBe('Trois cents dirhams')
    })

    it('convertit cinq cent cinquante', () => {
      expect(convertAmountToFrench(550)).toBe('Cinq cent cinquante dirhams')
    })

    it('convertit neuf cent quatre-vingt-dix-neuf', () => {
      expect(convertAmountToFrench(999)).toBe('Neuf cent quatre-vingt-dix-neuf dirhams')
    })
  })

  // ─── Milliers ──────────────────────────────────────────────────
  describe('milliers', () => {
    it('convertit mille (invariable)', () => {
      expect(convertAmountToFrench(1000)).toBe('Mille dirhams')
    })

    it('convertit mille un', () => {
      expect(convertAmountToFrench(1001)).toBe('Mille un dirhams')
    })

    it('convertit deux mille (sans s à mille)', () => {
      expect(convertAmountToFrench(2000)).toBe('Deux mille dirhams')
    })

    it('convertit dix mille', () => {
      expect(convertAmountToFrench(10000)).toBe('Dix mille dirhams')
    })

    it('convertit dix mille cinq cents', () => {
      expect(convertAmountToFrench(10500)).toBe('Dix mille cinq cents dirhams')
    })

    it('convertit cent mille', () => {
      expect(convertAmountToFrench(100000)).toBe('Cent mille dirhams')
    })

    it('convertit 999 999', () => {
      expect(convertAmountToFrench(999999)).toBe('Neuf cent quatre-vingt-dix-neuf mille neuf cent quatre-vingt-dix-neuf dirhams')
    })
  })

  // ─── Millions ──────────────────────────────────────────────────
  describe('millions', () => {
    it('convertit un million', () => {
      expect(convertAmountToFrench(1000000)).toBe('Un million de dirhams')
    })

    it('convertit deux millions', () => {
      expect(convertAmountToFrench(2000000)).toBe('Deux millions de dirhams')
    })

    it('convertit un million cinq cent mille (sans "de")', () => {
      // Quand un nombre suit le million, pas de "de" devant dirhams
      expect(convertAmountToFrench(1500000)).toBe('Un million cinq cents mille dirhams')
    })
  })

  // ─── Centimes ──────────────────────────────────────────────────
  describe('centimes', () => {
    it('convertit un centime', () => {
      expect(convertAmountToFrench(0.01)).toBe('Zéro dirham et un centime')
    })

    it('convertit cinquante centimes', () => {
      expect(convertAmountToFrench(0.50)).toBe('Zéro dirham et cinquante centimes')
    })

    it('convertit un montant avec centimes', () => {
      expect(convertAmountToFrench(10500.50)).toBe('Dix mille cinq cents dirhams et cinquante centimes')
    })

    it('convertit 99 centimes', () => {
      expect(convertAmountToFrench(0.99)).toBe('Zéro dirham et quatre-vingt-dix-neuf centimes')
    })

    it('convertit 1234.56', () => {
      expect(convertAmountToFrench(1234.56)).toBe('Mille deux cent trente-quatre dirhams et cinquante-six centimes')
    })
  })

  // ─── Entrées string ────────────────────────────────────────────
  describe('entrées string', () => {
    it('gère une string avec virgule', () => {
      expect(convertAmountToFrench('10 500,50')).toBe('Dix mille cinq cents dirhams et cinquante centimes')
    })

    it('gère une string avec point', () => {
      expect(convertAmountToFrench('1234.56')).toBe('Mille deux cent trente-quatre dirhams et cinquante-six centimes')
    })
  })

  // ─── Cas limites ───────────────────────────────────────────────
  describe('cas limites', () => {
    it('retourne vide pour NaN', () => {
      expect(convertAmountToFrench(NaN)).toBe('')
    })

    it('retourne vide pour une string invalide', () => {
      expect(convertAmountToFrench('abc')).toBe('')
    })

    it('retourne vide pour un nombre négatif', () => {
      expect(convertAmountToFrench(-100)).toBe('')
    })
  })
})
