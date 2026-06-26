Résumé rapide
Le script 
"check_json_duplicates.py"
permet de :

scanner des fichiers JSON ;
détecter les doublons ;
supprimer les doublons en gardant la version la plus riche ;
fusionner plusieurs fichiers JSON en un seul ;
nettoyer les titres en style “Title Case” ;
écrire le résultat dans un fichier de sortie.

-----------------------------------Commandes principales---------------------------------------------

1.Analyser un dossier /> 
python check_json_duplicates.py --folder "C:\Users\opxam\Projects\v3\test-doublon"

2.Détecter les doublons sur un champ précis /> 
python check_json_duplicates.py --folder "C:\Users\opxam\Projects\v3\test-doublon" --field id

3.Supprimer les doublons dans les fichiers
python check_json_duplicates.py --folder "C:\Users\opxam\Projects\v3\test-doublon" --field id --deduplicate --write

4.Fusionner tous les JSON d’un dossier en un seul fichier
python check_json_duplicates.py --merge-folder "C:\Users\opxam\Projects\v3\test-doublon" --field id --output "C:\Users\opxam\Projects\v3\test-doublon\merged.json"

5.Fusionner des fichiers précis
python check_json_duplicates.py --merge "file1.json" "file2.json" --field id --output "merged.json"

---------------------------------------------------------------------------------------------------------------------

Ce que le script fait automatiquement
compare les objets par id si vous utilisez --field id ;
garde la version la plus complète lorsqu’il trouve un doublon ;
écrit le résultat fusionné dans le fichier indiqué par --output ;
met les titres en majuscule au début de chaque mot.

/|/|/|/||/|//|/|/|/||/|//|/|/|/||/|//|/|/|/||/|//|/|/|/||/|//|/|/|/||/|//|/|/|/||/|//|/|/|/||/|/


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
