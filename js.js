
// NOVA WEBSITE JAVASCRIPT

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
    nav.classList.toggle("active");

    menuBtn.textContent = nav.classList.contains("active")
        ? "✕"
        : "☰";
});

// Menu yopish
document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
        menuBtn.textContent = "☰";
    });
});

// Toast notification
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Tarif tanlash
document.querySelectorAll(".price-btn").forEach(button => {
    button.addEventListener("click", () => {
        const plan = button.dataset.plan;

        document.getElementById("userSubject").value = "Xizmatlar";
        document.getElementById("userMessage").value =
            "Men " + plan + " tarifiga qiziqyapman.";

        document.getElementById("contact").scrollIntoView({
            behavior: "smooth"
        });

        showToast(plan + " tarifi tanlandi!");
    });
});

// Contact form
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const subject = document.getElementById("userSubject").value;
    const message = document.getElementById("userMessage").value.trim();
    const status = document.getElementById("formStatus");

    if (!name || !email || !subject || !message) {
        status.textContent = "Iltimos, barcha maydonlarni to‘ldiring.";
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = "Email manzilini tekshiring.";
        return;
    }

    // Hozircha server ulanmagan demo rejimi
    status.textContent =
        "Forma to‘g‘ri to‘ldirildi. Xabar yuborish uchun server ulash kerak.";

    showToast("Ma'lumotlar tekshirildi!");

    contactForm.reset();
});

// Scroll animation
const revealElements = document.querySelectorAll(
    ".about-card, .service-card, .price-card, .section-label, .section h2, .section-text, .contact-form, .banner-content"
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

revealElements.forEach(element => {
    observer.observe(element);
});

// Navigation active effect
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            "active-link",
            link.getAttribute("href") === "#" + current
        );
    });
});

// Footer year
const footerText = document.querySelector(".footer p");

footerText.textContent =
    "© " + new Date().getFullYear() +
    " NOVA. Barcha huquqlar himoyalangan.";

console.log("NOVA Premium Website ishga tushdi!");
