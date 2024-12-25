document.getElementById("loginForm").addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();
    

    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("motDePasse").value,
    };

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    if (response.status != 200) {
        const errorBox = document.createElement("div");
        errorBox.className = "error-login";
        errorBox.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
        document.querySelector("form").prepend(errorBox);
    } else {
    let result = await response.json();
    const token = result.token;
    sessionStorage.setItem("authToken", token);
    window.location.href = "index.html";
    }
}
