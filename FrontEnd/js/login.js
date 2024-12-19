// const loginApi = await fetch ("http://localhost:5678/api/users/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json"},

// document.getElementById("loginform").addEventListener("submit", handleSubmit);

// async function handleSubmit(event) {
//     event.preventDefault();

// let user = {
//     email: document.getElementById("email").value,
//     password: document.getElementById("motDePasse").value, // Assurez-vous que l'ID correspond
// };

// let response = await fetch(loginApi, {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     body: JSON.stringify(user),
// });

// let result = await response.json();
// console.log(result);
// console.log("E-mail:", user.email);
// console.log("Mot de passe:", user.password)
// }

// // Récupération des éléments du formulaire de login
// const email = document.getElementById("email")
// const password = document.getElementById("password")
// const seConnecter = document.getElementById("seConnecter")


// seConnecter.addEventListener("click", login)
// // Stockage des données utilisateur lors du login
// async function login(event) {
//     event.preventDefault()
//     const valeurEmail = email.value
//     const valeurPassword = password.value

//     try {
//         const response = await fetch("http://localhost:5678/api/users/login", {
//             method: "POST",
//             headers: { "content-type": "application/json" },
//             body: JSON.stringify({ email: valeurEmail, password: valeurPassword })
//         });
//         const data = await response.json();

//         if (data.token) {
//             localStorage.setItem("token", data.token);
//             window.location.href = "../../index.html";
//             console.log("Connexion réussie");
//             console.log("Token trouvé :", localStorage.getItem("token"));
//         } else {
//             afficherMessage("Erreur dans l’identifiant ou le mot de passe")
//         }
//     } catch (error) {
//         afficherMessage("Une erreur est survenue")
//         console.error("Erreur lors de la connexion:", error);
//     }
// }


// // Message d'erreur mail ou mdp
// function afficherMessage(message) {
//     const erreurPrecedente = document.querySelector(".message-erreur")
//     if (erreurPrecedente) {
//         erreurPrecedente.remove()
//     }
//     const erreurMessage = document.createElement("p");
//     erreurMessage.classList.add("message-erreur")
//     erreurMessage.textContent = message;
//     erreurMessage.style.color = "red";
//     erreurMessage.style.marginBottom = "10px";
//     seConnecter.parentNode.insertBefore(erreurMessage, seConnecter);
// }

// // Mot de passe visible ou crypté
// const togglePassword = document.getElementById('toggle-password');
// const passwordField = document.getElementById('password');

// togglePassword.addEventListener('click', function () {
//     const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
//     passwordField.setAttribute('type', type);
//     togglePassword.classList.toggle('fa-eye-slash');
//     togglePassword.classList.toggle('fa-eye');
// });

////////   Version 2 ///////////

// async function login(event) {
//     event.preventDefault();
//     const valeurEmail = email.value;
//     const valeurPassword = password.value;

//     console.log("Email :", valeurEmail, "Password :", valeurPassword);

//     try {
//         const response = await fetch("http://localhost:5678/api/users/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email: valeurEmail, password: valeurPassword })
//         });

//         console.log("Statut HTTP :", response.status);

//         const data = await response.json();
//         console.log("Réponse du serveur :", data);

//         if (data.token) {
//             localStorage.setItem("token", data.token);
//             window.location.href = "js/index.html";
//             console.log("Connexion réussie");
//             console.log("Token trouvé :", localStorage.getItem("token"));
//         } else {
//             afficherMessage(data.message || "Erreur dans l’identifiant ou le mot de passe");
//         }
//     } catch (error) {
//         afficherMessage("Une erreur est survenue");
//         console.error("Erreur lors de la connexion :", error);
//     }
// }

// document.addEventListener("DOMContentLoaded", function () {
//     // Votre code JS ici
//     console.log("La page est complètement chargée");
// });

//// Version 3 //////

// const loginApi = "http://localhost:5678/api/users/login";

document.getElementById("loginform").addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();

    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    let result = await response.json();
    console.log(result);
}

// const express = require("express");
// const app = express();

// app.use(express.json()); // Middleware pour analyser le JSON

// app.post("/api/users/login", (req, res) => {
//     const { email, password } = req.body;

//     // Exemple de logique d'authentification simple
//     if (email === "sophie.bluel@test.tld" && password === "SOphie") {
//         res.status(200).json({ token: "votre_token_jwt" });
//     } else {
//         res.status(401).json({ message: "Email ou mot de passe incorrect" });
//     }
// });

// // Démarrage du serveur
// app.listen(5678, () => {
//     console.log("Serveur démarré sur http://localhost:5678");
// });

// test ///
// async function testLogin() {
//     const url = "http://localhost:5678/api/users/login";
//     const body = JSON.stringify({
//         email: "sophie.bluel@test.tld",
//         password: "SOphie"
//     });

//     try {
//         const response = await fetch(url, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: body
//         });

//         const result = await response.json();
//         console.log("Réponse du serveur :", result);

//         if (response.ok) {
//             console.log("Connexion réussie :", result.token);
//         } else {
//             console.error("Erreur :", result.message);
//         }
//     } catch (error) {
//         console.error("Erreur réseau :", error);
//     }
// }

// testLogin();
