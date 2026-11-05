
// NOVA - Main JavaScript

// LOADER
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader").classList.add("hide");
    }, 700);
});

// MOBILE MENU
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navLinks.classList.remove("active");
    });
});

// CURRENT YEAR
document.getElementById("year").textContent =
    new Date().getFullYear();

// SCROLL ANIMATION
const revealElements = document.querySelectorAll(
    ".about-content, .service-card, .feature-item, .contact-info, .contact-form"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

revealElements.forEach(element => observer.observe(element));

// HEADER SCROLL EFFECT
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.style.background = "rgba(8, 8, 8, 0.96)";
    } else {
        header.style.background = "rgba(8, 8, 8, 0.75)";
    }
});

// TOAST NOTIFICATION
function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// CONTACT FORM
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        showToast("Iltimos, barcha maydonlarni to‘ldiring!");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Elektron pochta manzili noto‘g‘ri!");
        return;
    }

    formStatus.textContent =
        "Forma tekshirildi. Xabar yuborish uchun server ulash kerak.";

    showToast("Ma'lumotlar to‘g‘ri kiritildi!");

    contactForm.reset();
});

// NAVIGATION BUTTONS
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

console.log("NOVA platformasi ishga tushdi!");
