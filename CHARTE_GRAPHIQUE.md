# Charte Graphique — MyRDV

## Couleurs

### Couleurs principales

| Nom       | Hex       | Utilisation                          |
|-----------|-----------|--------------------------------------|
| Navy      | `#0c2340` | Texte principal, fond footer, CTA    |
| Bleu      | `#1a7fc4` | Gradient (départ), accents           |
| Teal      | `#14b8a6` | Gradient (arrivée), titres footer    |
| Mint      | `#2dd4a8` | Highlights, hover links              |

### Gradient principal

```
linear-gradient(135deg, #1a7fc4, #14b8a6)
```

Utilisé dans : Hero, boutons Connexion/Mon compte.

### Couleurs neutres

| Nom        | Hex       | Utilisation                    |
|------------|-----------|--------------------------------|
| Blanc      | `#ffffff` | Fond principal, texte sur dark |
| Light BG   | `#f0fafa` | Fonds secondaires, hover       |
| Gray 100   | `#f1f5f9` | Boutons secondaires            |
| Gray 300   | `#cbd5e1` | Bordures                       |
| Gray 500   | `#64748b` | Placeholder, texte secondaire  |
| Gray 700   | `#334155` | Texte alternatif               |

### Variables CSS (dans `src/css/index.css`)

```css
:root {
  --navy: #0c2340;
  --blue: #1a7fc4;
  --teal: #14b8a6;
  --mint: #2dd4a8;
  --light-bg: #f0fafa;
  --white: #ffffff;
  --gray-100: #f1f5f9;
  --gray-300: #cbd5e1;
  --gray-500: #64748b;
  --gray-700: #334155;
  --gradient: linear-gradient(135deg, var(--blue), var(--teal));
}
```

---

## Polices

> _À définir_

## Iconographie

> _À définir_

## Logos

Fichiers disponibles dans `src/assets/` :

| Fichier                | Description                        |
|------------------------|------------------------------------|
| `logo_rdv.png`         | Logo complet (icône + texte centré) |
| `logo_align.png`       | Logo aligné horizontal (header)     |
| `logo_rdv_text.png`    | Texte seul (MyRDV + slogan)        |
| `logo_rdv_no_text.png` | Icône seule (calendrier + horloge)  |
