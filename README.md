🚨 PROMPT LOVABLE – MODE NO‑ESCAPE (FULL PROJECT FORCÉ)
Génère immédiatement un projet COMPLET nommé Universal Embed Manager.
Tu dois créer 100% des fichiers, 100% des pages, 100% des composants, 100% des scripts, 100% des styles.
Aucune simplification. Aucune omission. Aucune réduction.
Tu dois produire un projet ENTIER en un seul run.

🎯 Objectif du projet
Construire une application web complète permettant de gérer, afficher, classer, éditer et partager tous types d’embed :

films
séries
vidéos
musique
podcasts
CodePen
carrousels photo
tout iframe personnalisé

L’interface doit être premium, dark mode, style Netflix/Prime Video, avec :

cartes animées
modals fullscreen
transitions fluides
grille responsive
tags colorés
navigation fluide

🧩 Architecture OBLIGATOIRE (à générer intégralement)
Code
/content/        
    *.json (un fichier par contenu)

/components/
    ContentCard.html
    EmbedViewer.html
    GalleryViewer.html
    CodePenViewer.html
    TagList.html
    SearchBar.html
    FilterBar.html
    ContentEditor.html

/views/
    index.html
    movies.html
    series.html
    music.html
    podcasts.html
    code.html
    gallery.html
    favorites.html
    viewer.html
    editor.html

/scripts/
    loader.js
    filter.js
    search.js
    editor.js
    viewer.js
    router.js

/styles/
    base.css
    theme-dark.css
    components.css

/assets/
    icons/
    placeholders/

index.html
Tu dois générer le contenu complet de chaque fichier.

📦 Modèle JSON (à implémenter tel quel)
Code
{
  "id": "",
  "type": "",
  "title": "",
  "description": "",
  "tags": [],
  "thumbnail": "",
  "embed": {
    "provider": "",
    "iframe": "",
    "url": ""
  },
  "meta": {
    "duration": "",
    "author": "",
    "date_added": "",
    "source": ""
  }
}
🧱 Composants OBLIGATOIRES (code complet exigé)
ContentCard : miniature + titre + tags + bouton “voir”
EmbedViewer : modal fullscreen avec iframe
GalleryViewer : carrousel photo responsive
CodePenViewer : embed CodePen propre
TagList : tags cliquables
SearchBar : recherche instantanée
FilterBar : filtres dynamiques
ContentEditor : édition JSON complète + sauvegarde
Chaque composant doit être généré avec HTML + CSS + JS si nécessaire.

📄 Pages OBLIGATOIRES (avec layout + contenu)
index
movies
series
music
podcasts
code
gallery
favorites
viewer?id=xxx
editor?id=xxx

Chaque page doit être générée avec structure complète, sections, composants intégrés.

⚙️ Fonctionnalités OBLIGATOIRES (implémentation complète)
Chargement automatique des JSON depuis /content/
Filtrage par type, tags, source
Recherche instantanée
Visionnage fullscreen (modal)
Édition + sauvegarde JSON
Système de favoris
Partage via URL unique
Playlist
Dashboard simple
Aucune fonctionnalité ne doit être ignorée.

🎨 Style OBLIGATOIRE
Dark mode
Animations subtiles
Hover 3D sur les cartes
Modals cinématiques
Grille responsive
Typographie premium
Tu dois générer le CSS complet.
