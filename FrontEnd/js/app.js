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

async function getCategories() {
  const url = "http://localhost:5678/api/categories"; // API pour les catégories
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des catégories : ${response.status}`);
    }

    const categories = await response.json();
    // console.log("Catégories récupérées :", categories);

     // Conteneur pour les filtres
     const filterContainer = document.querySelector(".div-container");

    // Ajouter le filtre "Tous"
    const allFilter = document.createElement("div");
    allFilter.classList.add("filter");
    allFilter.textContent = "Tous";
    allFilter.addEventListener("click", () => {
      getWorks(); // Affiche tous les projets
      setActiveFilter(allFilter); // Ajoute la classe active au filtre seléctionné
    });
    filterContainer.append(allFilter);

    // Ajouter les autres catégories dynamiquement
    categories.forEach((category) => {
      const filter = document.createElement("div");
      filter.classList.add("filter");
      filter.textContent = category.name; // Nom de la catégorie
      filter.addEventListener("click", () => {
        getWorks(category.id); // Filtrer par catégorie
        setActiveFilter(filter); // Pour changer l'apparence du filtre seléctionné
      });
      filterContainer.append(filter);
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
    // console.log("Projets récupérés :", works);

    // Filtrer les projets si une catégorie est sélectionnée
    const filteredWorks = categoryId
      ? works.filter((work) => work.categoryId === categoryId)
      : works;

    // console.log("Projets affichés :", filteredWorks);

    // Nettoyer la galerie avant d'ajouter les nouveaux éléments
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    // Ajouter les projets dans la galerie
    filteredWorks.forEach((work) => setFigure(work));
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error.message);
  }
}

/// Fonction pour ajouter une figure dans la galerie
function setFigure(data) {
  const gallery = document.querySelector(".gallery");
  const galleryModal = document.querySelector(".gallery-modal");

  // Crée la figure principale pour la galerie
  const figure = document.createElement("figure");
  figure.innerHTML = `
    <img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>
  `;

  // Ajoute la figure principale à la galerie
  gallery.appendChild(figure);

  // Crée une figure distincte pour la galerie modale avec l'icône directement dans innerHTML
  const figureClone = document.createElement("figure");
  figureClone.innerHTML = `<div class="image-container">
    <img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>
    <i class="fa-solid fa-trash-can overlay-icon"></i>
    </div>
    `;

  // Ajoute la figure clone à la galerie modale
  galleryModal.appendChild(figureClone);

  // Retourner les deux éléments pour des modifications indépendantes
  return { figure, figureClone };
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

function displayAdminMode() {
  if (sessionStorage.authToken) {
  const editBanner = document.createElement("div");
  editBanner.className = "edit";
  editBanner.innerHTML = 
'<p><a href="#modal1" class="js-modal"><i class="fa-regular fa-pen-to-square"`></i>Mode édition</a></p>';
  document.body.prepend(editBanner);

  document.querySelector(".login").textContent = "logout";
}
}

displayAdminMode();

let modal = null;
const focusableSelector= "button, a, input, textarea";
let focusables = [];
let previouslyFocusedElement = null;

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  focusables[0].focus();
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);

}

const closeModal = function (e) {
  if (modal === null) return;
  if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
  e.preventDefault();
  // window.setTimeout(function () {
  // modal.style.display = "none";
  // modal = null;
  // }, 500)
  modal.setAttribute("aria-hidden", "true"); // l'élément sera masqué//
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
  const hideModal = function () {
    modal.style.display = "none"
    modal.removeEventListener("animationend", hideModal)
    modal = null
  }
  modal.addEventListener("animationend", hideModal)
}

const stopPropagation = function (e) {
  e.stopPropagation();
}

const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex(f => f === modal.querySelector(":focus"));
  if (e.shiftkey === true) {
    index --;
  } else {
  index++;
  }
  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1;
  }
  focusables[index].focus();
}

document.querySelectorAll(".js-modal").forEach(a => {
  a.addEventListener("click", openModal);
})

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e)
  }
})
