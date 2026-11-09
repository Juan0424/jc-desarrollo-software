(() => {
  document.documentElement.classList.add("js-ready");

  // Mostrar el año actual automáticamente.
  const year = document.getElementById("current-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Menú para celulares.
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const expanded =
        menuButton.getAttribute("aria-expanded") === "true";

      menuButton.setAttribute(
        "aria-expanded",
        String(!expanded)
      );

      menuButton.setAttribute(
        "aria-label",
        expanded ? "Abrir menú" : "Cerrar menú"
      );

      nav.classList.toggle("is-open", !expanded);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  // Animaciones de entrada al desplazarse por la página.
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }

  // Formulario de contacto.
  const form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = window.JC_SITE_CONFIG?.contactEmail?.trim();
      const note = document.getElementById("form-note");

      if (
        !email ||
        email === "REEMPLAZAR_POR_TU_CORREO" ||
        !email.includes("@")
      ) {
        if (note) {
          note.textContent =
            "Antes de publicar, configura tu correo en site-config.js. Así el formulario podrá preparar el mensaje.";

          note.classList.add("note-warning");
        }

        return;
      }

      const data = new FormData(form);

      const name = String(data.get("name") || "").trim();
      const sender = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();

      const subject = encodeURIComponent(
        `Consulta desde JC Desarrollo de Software — ${name}`
      );

      const body = encodeURIComponent(
        `Nombre: ${name}\nCorreo: ${sender}\n\nMensaje:\n${message}`
      );

      window.location.href =
        `mailto:${email}?subject=${subject}&body=${body}`;

      if (note) {
        note.textContent =
          "Se abrió tu aplicación de correo para que puedas revisar y enviar el mensaje.";
      }
    });
  }
})();