# LC Pro — Gestionnaire de Lettres de Change

Application de bureau pour la gestion professionnelle des lettres de change BMCI.

## Fonctionnalites

- **Remplissage de lettres de change** — Saisie des informations avec apercu en temps reel
- **Gestion des clients** — Base de donnees locale des clients (ajout, modification, suppression, recherche)
- **Historique des operations** — Consultation et suivi de toutes les operations passees avec statistiques
- **Editeur de modele** — Positionnement visuel (drag & drop) des champs sur le modele de la lettre de change
- **Export PDF** — Generation de documents PDF prets a imprimer via jsPDF et html2canvas
- **Impression directe** — Impression du texte seul sur papier pre-imprime
- **Sauvegarde / Restauration** — Export et import complet des donnees au format JSON
- **Mode sombre** — Interface adaptable avec theme clair et sombre
- **Application Windows** — Installateur NSIS ou version portable

## Prerequis

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

## Installation

```bash
git clone https://github.com/elmehdimimoussi/samira.git
cd samira
npm install
```

## Utilisation

### Mode developpement (navigateur)

```bash
npm run dev
```

Ouvre l'application dans le navigateur sur `http://localhost:5174`.

### Mode developpement (Electron)

```bash
npm run electron:dev
```

Lance l'application de bureau avec rechargement automatique.

### Construction pour Windows

```bash
# Installateur NSIS + Portable
npm run electron:build

# Installateur NSIS uniquement
npm run electron:build:installer

# Version portable uniquement
npm run electron:build:portable
```

Les fichiers generes se trouvent dans le dossier `dist-electron/`.

### Tests

```bash
# Lancer les tests
npm test

# Mode surveillance
npm run test:watch

# Avec couverture
npm run test:coverage
```

## Structure du projet

```
samira/
├── assets/templates/        # Images des modeles de lettres de change
├── build/                   # Icones et configuration de l'installateur
├── electron/
│   ├── main.cjs             # Processus principal Electron
│   ├── preload.cjs          # Script preload (API bridge)
│   └── splash.html          # Ecran de demarrage
├── scripts/                 # Scripts de generation d'icones
├── src/
│   ├── components/          # Composants UI reutilisables
│   │   └── ui/              # Button, Card, Input, Modal, Accordion, etc.
│   ├── pages/
│   │   ├── FillingPage.jsx      # Remplissage des lettres de change
│   │   ├── CustomersPage.jsx    # Gestion des clients
│   │   ├── HistoryPage.jsx      # Historique des operations
│   │   └── SettingsPage.jsx     # Parametres et editeur de modele
│   ├── services/            # Logique metier
│   │   ├── amountFormatter.js       # Formatage des montants
│   │   ├── dateFormatter.js         # Formatage des dates
│   │   └── frenchTextConverter.js   # Conversion chiffres → lettres
│   ├── __tests__/           # Tests unitaires (vitest)
│   ├── App.jsx              # Composant racine avec navigation
│   └── main.jsx             # Point d'entree React
├── package.json
├── vite.config.js
└── vitest.config.js
```

## Technologies

| Technologie | Usage |
|---|---|
| [React](https://react.dev/) 19 | Interface utilisateur |
| [Vite](https://vite.dev/) 7 | Bundler et serveur de developpement |
| [Electron](https://www.electronjs.org/) 30 | Application de bureau |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Styles |
| [React Router](https://reactrouter.com/) 7 | Navigation |
| [jsPDF](https://github.com/parallax/jsPDF) | Generation de PDF |
| [html2canvas](https://html2canvas.hertzen.com/) | Capture d'ecran pour PDF |
| [Lucide React](https://lucide.dev/) | Icones |
| [Sonner](https://sonner.emilkowal.dev/) | Notifications toast |
| [Zod](https://zod.dev/) | Validation de donnees |
| [Vitest](https://vitest.dev/) | Tests unitaires |

## Donnees

Toutes les donnees sont stockees **localement** sur l'ordinateur de l'utilisateur dans un fichier JSON (`lc-bmci-data.json` dans le dossier AppData). Aucune donnee n'est envoyee a des serveurs externes.

## Licence

Copyright 2026 IGADOR SAMIRA. Tous droits reserves.

Voir [LICENSE.txt](LICENSE.txt) pour les details.
