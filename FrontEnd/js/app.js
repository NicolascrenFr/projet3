async function fetchWorks() {
  const apiUrl = "http://localhost:5678/api/works"; // URL de l'API

  try {
    // Appel à l'API pour récupérer les projets
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des projets : ${response.status}`);
    }

    const works = await response.json();
    // console.log("Données reçues :", works); // Pour vérifier les données reçues dans la console

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

// Fonction pour récupérer et afficher les projets
async function getWorks(categoryId = null) {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des projets : ${response.status}`);
    }

    const works = await response.json();
    // console.log("Projets récupérés :", works);

    // Filtrer les projets si une catégorie est sélectionnée
    const filteredWorks = categoryId
      ? works.filter((work) => work.categoryId === categoryId)
      : works;

    // Nettoyer la galerie avant d'ajouter les nouveaux éléments
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    // Ajouter les projets dans la galerie
    filteredWorks.forEach((work) => setFigure(work));
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error.message);
  }
}

// Fonction pour gérer l'état actif des filtres
function setActiveFilter(selectedFilter) {
  // Retirer la classe 'active' de tous les filtres
  const filters = document.querySelectorAll(".filter");
  filters.forEach((filter) => filter.classList.remove("active"));

  // Ajouter la classe 'active' au filtre sélectionné
  selectedFilter.classList.add("active");
}

// Charger les filtres et les projets au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  getCategories(); // Charger les catégories et les filtres
  getWorks(); // Charger tous les projets
});

async function getCategories() {
  const url = "http://localhost:5678/api/categories"; // API pour les catégories
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des catégories : ${response.status}`);
    }

    const categories = await response.json();
    console.log("Catégories récupérées :", categories);

    // Conteneur pour les filtres
    const filterContainer = document.querySelector(".div-container");

    // Supprimer les filtres existants pour éviter les doublons
    filterContainer.innerHTML = "";

    // Ajouter le filtre "Tous" avec la classe active par défaut
    const allFilter = document.createElement("div");
    allFilter.classList.add("filter", "active"); // "Tous" est actif par défaut
    allFilter.textContent = "Tous";
    allFilter.addEventListener("click", () => {
      getWorks(); // Affiche tous les projets
      setActiveFilter(allFilter); // Définit "Tous" comme actif
    });
    filterContainer.append(allFilter);

    // Ajouter les autres catégories dynamiquement
    categories.forEach((category) => {
      const filter = document.createElement("div");
      filter.classList.add("filter");
      filter.textContent = category.name; // Nom de la catégorie
      filter.addEventListener("click", () => {
        getWorks(category.id); // Filtrer par catégorie
        setActiveFilter(filter); // Définit la catégorie sélectionnée comme active
      });
      filterContainer.append(filter);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error.message);
  }
}

// Fonction pour gérer l'état actif des filtres
function setActiveFilter(selectedFilter) {
  // Retirer la classe 'active' de tous les filtres
  const filters = document.querySelectorAll(".filter");
  filters.forEach((filter) => filter.classList.remove("active"));

  // Ajouter la classe 'active' au filtre sélectionné
  selectedFilter.classList.add("active");
}

// Appeler getCategories pour initialiser les filtres
getCategories();

function isUserLoggedIn() {
  return Boolean(sessionStorage.getItem("authToken")); // Vérifie si un token d'authentification existe
}

// Pour ne plus voir les catégories quand on est login
function toggleCategoriesVisibility() {
  const categoriesContainer = document.querySelector(".div-container"); // Sélectionnez le conteneur des catégories
  if (isUserLoggedIn()) {
      categoriesContainer.style.display = "none"; // Masquer les catégories
  } else {
      categoriesContainer.style.display = "flex"; // Afficher les catégories
  }
}
    toggleCategoriesVisibility();

// Fonction pour supprimer un élément à partir de son ID
async function deleteWork(workId) {
  const token = sessionStorage.getItem("authToken"); // Récupérer le token d'authentification
  if (!token) {
      console.error("Utilisateur non authentifié");
      return;
  }

  try {
      const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
          method: "DELETE",
          headers: {
              "Authorization": `Bearer ${token}`, // Ajouter le token dans le header
              "Content-Type": "application/json"
          },
      });

      if (response.ok) {
          console.log(`Work avec ID ${workId} supprimé avec succès`);
          document.querySelector(`#work-${workId}`).remove(); // Supprime l'élément du DOM
      } else {
          console.error("Erreur lors de la suppression :", response.statusText);
      }
  } catch (error) {
      console.error("Erreur réseau :", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const categoriesSelect = document.getElementById("photo-categorie");
  const apiUrl = "http://localhost:5678/api/categories";

  async function fetchCategories() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des catégories.");
      }

      const categories = await response.json(); // Lire directement au format JSON

      // Ajouter les catégories au menu déroulant
        categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id; // Ajustez selon la structure de votre API
        option.textContent = category.name; // Ajustez selon la structure de votre API
        categoriesSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erreur :", error?.message || error);
      alert("Impossible de charger les catégories. Veuillez réessayer plus tard.");
    }
  }

  fetchCategories(); // Appeler la fonction pour charger les catégories
});

document.getElementById("photo-file").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
          const previewContainer = document.querySelector(".file-upload-container");
          
          // Supprime les anciens aperçus (si nécessaire)
          const oldPreview = previewContainer.querySelector(".image-preview");
          if (oldPreview) {
              oldPreview.remove();
          }

          // Masque les autres éléments dans le conteneur
          previewContainer.querySelector(".image-bouton").style.display = "none";
          previewContainer.querySelector(".js-add-photo-file").style.display = "none";
          previewContainer.querySelector("p").style.display = "none";

          // Ajoute l'aperçu de l'image
          const imgPreview = document.createElement("img");
          imgPreview.src = e.target.result;
          imgPreview.alt = "Aperçu de la photo";
          imgPreview.classList.add("image-preview");
          previewContainer.appendChild(imgPreview);
      };
      reader.readAsDataURL(file);
  }
});
