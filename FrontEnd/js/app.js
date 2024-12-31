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
figureClone.id = `work-${data.id}`; // Ajout de l'ID unique
figureClone.innerHTML = `<div class="image-container">
  <img src="${data.imageUrl}" alt="${data.title}">
  <i class="fa-solid fa-trash-can overlay-icon" data-work-id="${data.id}"></i>
</div>`;


  // Ajoute la figure clone à la galerie modale
  galleryModal.appendChild(figureClone);

  // Retourner les deux éléments pour des modifications indépendantes
  return { figure, figureClone };

}

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
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log(`Work avec ID ${workId} supprimé avec succès`);

      // Supprimer l'élément du DOM
      const workElement = document.querySelector(`#work-${workId}`);
      if (workElement) {
        workElement.remove();
      }
    } else {
      console.error("Erreur lors de la suppression :", response.statusText);
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
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

    if (sessionStorage.authToken) {
      throw new Error(`Erreur lors de la récupération des catégories : ${response.status}`);
    }

    const categories = await response.json();
    // console.log("Catégories récupérées :", categories);

    // Conteneur pour les filtres
    const filterContainer = document.querySelector(".div-container");

    // Supprimer les filtres existants (optionnel, pour éviter les doublons)
    filterContainer.innerHTML = "";

    // Vérifiez si l'utilisateur est connecté
    const isLoggedIn = Boolean(localStorage.getItem("token")); // Exemple avec un token de connexion

    if (!isLoggedIn) {
      // Ajouter le filtre "Tous"
      const allFilter = document.createElement("div");
      allFilter.classList.add("filter");
      allFilter.textContent = "Tous";
      allFilter.addEventListener("click", () => {
        getWorks(); // Affiche tous les projets
        setActiveFilter(allFilter); // Ajoute la classe active au filtre sélectionné
      });
      filterContainer.append(allFilter);

      // Ajouter les autres catégories dynamiquement
      categories.forEach((category) => {
        const filter = document.createElement("div");
        filter.classList.add("filter");
        filter.textContent = category.name; // Nom de la catégorie
        filter.addEventListener("click", () => {
          getWorks(category.id); // Filtrer par catégorie
          setActiveFilter(filter); // Pour changer l'apparence du filtre sélectionné
        });
        filterContainer.append(filter);
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error.message);
  }
}

function isUserLoggedIn() {
  return Boolean(sessionStorage.getItem("authToken")); // Vérifie si un token d'authentification existe
}

function displayAdminMode() {
  const editButton = document.querySelector(".js-modal-trigger"); // Bouton "modifier"
  const loginButton = document.querySelector(".login"); // Bouton "login/logout"

  if (isUserLoggedIn()) {
    // Mode admin : utilisateur connecté
    editButton.style.display = "inline-block"; // Afficher le bouton "Modifier"

    // Ajouter une bannière "Mode édition"
    const editBanner = document.createElement("div");
    editBanner.className = "edit-banner";
    editBanner.style.cssText =
      "position: fixed; top: 0; left: 0; width: 100%; background: black; color: white; text-align: center; padding: 10px; z-index: 1000;";
    editBanner.innerHTML =
      '<p><i class="fa-regular fa-pen-to-square"></i> Mode édition</p>';
    document.body.prepend(editBanner);

    // Modifier le bouton en "Logout"
    loginButton.textContent = "Logout";

    // Gestionnaire pour la déconnexion
    loginButton.addEventListener("click", () => {
      sessionStorage.removeItem("authToken"); // Supprime le token
      window.location.reload(); // Recharge la page
    });
  } else {
    // Mode visiteur : utilisateur non connecté
    editButton.style.display = "none"; // Masquer le bouton "Modifier"
    loginButton.textContent = "Login";

    // Gestionnaire pour la connexion
    loginButton.addEventListener("click", () => {
      window.location.href = "login.html"; // Redirige vers la page de login
    });
  }
}

// Gérer les actions nécessitant une connexion
function protectAdminActions() {
  const editButton = document.querySelector(".js-modal-trigger"); // Bouton "modifier"
  editButton.addEventListener("click", (e) => {
    if (!isUserLoggedIn()) {
      e.preventDefault(); // Bloque l'action si non connecté
      alert("Vous devez être connecté pour modifier.");
      window.location.href = "login.html"; // Redirige vers la page de login
    }
  });
}

// Appel des fonctions au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  displayAdminMode();
  protectAdminActions();
});

// Appel de la fonction
displayAdminMode();


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
  const galleryModal = document.querySelector(".gallery-modal");

  // Écouter les clics dans la galerie modale
  galleryModal.addEventListener("click", (event) => {
    const icon = event.target;

    // Vérifiez si l'élément cliqué est une icône de poubelle
    if (icon.classList.contains("overlay-icon") && icon.dataset.workId) {
      const workId = icon.dataset.workId; // Récupérer l'ID du travail

      if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
        deleteWork(workId); // Appeler la fonction de suppression
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Sélection des éléments HTML
  const modal1 = document.getElementById("modal1");
  const modal2 = document.getElementById("modal2");
  const addPhotoButton = document.querySelector(".add-photo");
  const returnButton = document.querySelector(".js-modal-return");
  const closeModalButtons = document.querySelectorAll(".js-modal-close");

  // Fonction pour ouvrir une modale
  function openModal(modal) {
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
  }

  // Fonction pour fermer une modale
  function closeModal(modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }

  // Ouvrir la seconde modale au clic sur "Ajouter une photo"
  addPhotoButton.addEventListener("click", () => {
    closeModal(modal1); // Fermer la première modale
    openModal(modal2);  // Ouvrir la seconde modale
  });

  // Revenir à la première modale au clic sur le bouton de retour
  returnButton.addEventListener("click", () => {
    closeModal(modal2); // Fermer la seconde modale
    openModal(modal1);  // Ouvrir la première modale
  });

  // Fermer les modales au clic sur les boutons de fermeture
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(modal1);
      closeModal(modal2);
    });
  });

  // Fermer les modales au clic en dehors de leur contenu
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (!event.target.closest(".js-modal-stop")) {
        closeModal(modal);
      }
    });
  });
});


