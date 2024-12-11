async function fetchWorks() {
  const apiUrl = "http://localhost:5678/api/works"; // URL de l'API

  try {
    // Appel à l'API pour récupérer les projets
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des projets : ${response.status}`);
    }

    const works = await response.json();
    console.log("Données reçues :", works); // Pour vérifier les données reçues dans la console

    // Sélection de la galerie dans le DOM
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // Pour vider la galerie avant d'ajouter les éléments

    // Ajout des projets à la galerie
    works.forEach((work) => {
      const figure = document.createElement("figure");

      const img = document.createElement("img");
      img.src = work.imageUrl; // URL de l'image
      img.alt = work.title;    // Texte alternatif pour l'image

      const caption = document.createElement("figcaption");
      caption.textContent = work.title; // Titre du projet

      figure.appendChild(img);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    });
  } catch (error) {
    console.error("Erreur :", error.message);
  }
}

// Appeler la fonction pour récupérer et afficher les projets au chargement de la page
document.addEventListener("DOMContentLoaded", fetchWorks);

async function getCategories() {
  const url = "http://localhost:5678/api/categories"; // API pour les catégories
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des catégories : ${response.status}`);
    }

    const categories = await response.json();
    console.log("Catégories récupérées :", categories);

    // Ajouter le filtre "Tous"
    const allFilter = document.createElement("div");
    allFilter.classList.add("filter");
    allFilter.textContent = "Tous";
    allFilter.addEventListener("click", () => getWorks()); // Affiche tous les projets
    document.querySelector(".div-container").append(allFilter);

    // Ajouter les autres catégories dynamiquement
    categories.forEach((category) => {
      const filter = document.createElement("div");
      filter.classList.add("filter");
      filter.textContent = category.name; // Nom de la catégorie
      filter.addEventListener("click", () => getWorks(category.id)); // Filtrer par catégorie
      document.querySelector(".div-container").append(filter);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error.message);
  }
}

// Fonction pour récupérer et afficher les projets
async function getWorks(categoryId = null) {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des projets : ${response.status}`);
    }

    const works = await response.json();
    console.log("Projets récupérés :", works);

    // Filtrer les projets si une catégorie est sélectionnée
    const filteredWorks = categoryId
      ? works.filter((work) => work.categoryId === categoryId)
      : works;

    console.log("Projets affichés :", filteredWorks);

    // Nettoyer la galerie avant d'ajouter les nouveaux éléments
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    // Ajouter les projets dans la galerie
    filteredWorks.forEach((work) => setFigure(work));
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error.message);
  }
}

// Fonction pour ajouter une figure dans la galerie
function setFigure(data) {
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  figure.innerHTML = `
    <img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>
  `;
  gallery.appendChild(figure);
}

// Charger les filtres et les projets au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  getCategories(); // Charger les catégories et les filtres
  getWorks(); // Charger tous les projets
});


