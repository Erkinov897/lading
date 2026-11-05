
// ===================================
// NOVA PREMIUM PLATFORM
// Main JavaScript
// ===================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// STORAGE
const USERS_KEY = "nova_users";
const SESSION_KEY = "nova_session";
const THEME_KEY = "nova_theme";

function getUsers() {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
        return null;
    }
}

// DEMO ADMIN ACCOUNT
const ADMIN = {
    name: "NOVA Administrator",
    email: "admin@nova.uz",
    password: "nova123",
    role: "admin",
    date: "Demo account"
};

// LOADER
window.addEventListener("load", () => {
    setTimeout(() => {
        $("#loader").classList.add("hide");
    }, 600);
});

// YEAR
$("#year").textContent = new Date().getFullYear();

// TOAST
let toastTimer;

function toast(message) {
    const element = $("#toast");
    element.textContent = message;
    element.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        element.classList.remove("show");
    }, 2800);
}

// MODAL FUNCTIONS
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("open");

        if (!$(".modal.open")) {
            document.body.style.overflow = "";
        }
    }
}

// CLOSE BUTTONS
$$("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
        closeModal(button.dataset.close);
    });
});

$$(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        $$(".modal.open").forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// AUTH TABS
$$(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        $$(".auth-tab").forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        const isLogin = tab.dataset.tab === "login";

        $("#loginForm").hidden = !isLogin;
        $("#registerForm").hidden = isLogin;
    });
});

function showAuth(mode = "login") {
    openModal("authModal");

    const tab = $(`.auth-tab[data-tab="${mode}"]`);
    if (tab) tab.click();
}

// OPEN LOGIN
$("#loginBtn").addEventListener("click", () => {
    showAuth("login");
});

// REGISTER BUTTON
$("#ctaRegister").addEventListener("click", () => {
    showAuth("register");
});

// REGISTRATION
$("#registerForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = $("#registerName").value.trim();
    const email = $("#registerEmail").value.trim().toLowerCase();
    const password = $("#registerPassword").value;

    if (name.length < 2) {
        toast("Ism kamida 2 ta belgidan iborat bo‘lsin.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast("Email manzili noto‘g‘ri.");
        return;
    }

    if (password.length < 6) {
        toast("Parol kamida 6 ta belgi bo‘lsin.");
        return;
    }

    if (email === ADMIN.email) {
        toast("Bu email demo administrator uchun ajratilgan.");
        return;
    }

    const users = getUsers();

    if (users.some(user => user.email === email)) {
        toast("Bu email avval ro‘yxatdan o‘tgan.");
        return;
    }

    const user = {
        id: Date.now(),
        name,
        email,
        password,
        role: "user",
        date: new Date().toLocaleDateString("uz-UZ")
    };

    users.push(user);
    saveUsers(users);

    localStorage.setItem(SESSION_KEY, JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        date: user.date
    }));

    $("#registerForm").reset();

    closeModal("authModal");
    updateInterface();

    toast("Hisobingiz yaratildi!");
});

// LOGIN
$("#loginForm").addEventListener("submit", event => {
    event.preventDefault();

    const email = $("#loginEmail").value.trim().toLowerCase();
    const password = $("#loginPassword").value;

    // DEMO ADMIN LOGIN
    if (email === ADMIN.email && password === ADMIN.password) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            name: ADMIN.name,
            email: ADMIN.email,
            role: "admin",
            date: ADMIN.date
        }));

        $("#loginForm").reset();
        closeModal("authModal");
        updateInterface();
        toast("Administrator sifatida kirdingiz!");
        return;
    }

    const user = getUsers().find(item =>
        item.email === email && item.password === password
    );

    if (!user) {
        toast("Email yoki parol noto‘g‘ri.");
        return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        date: user.date
    }));

    $("#loginForm").reset();
    closeModal("authModal");
    updateInterface();

    toast("Xush kelibsiz, " + user.name + "!");
});

// UPDATE INTERFACE
function updateInterface() {
    const session = getSession();

    $("#loginBtn").hidden = !!session;
    $("#userMenu").hidden = !session;

    if (session && session.role === "admin") {
        $("#profileBtn").textContent = "⚙ Admin panel";
    } else {
        $("#profileBtn").textContent = "👤 Profil";
    }
}

// PROFILE / ADMIN BUTTON
$("#profileBtn").addEventListener("click", () => {
    const session = getSession();

    if (!session) {
        showAuth("login");
        return;
    }

    if (session.role === "admin") {
        renderAdmin();
        openModal("adminModal");
        return;
    }

    $("#profileName").textContent = session.name;
    $("#profileEmail").textContent = session.email;
    $("#profileRole").textContent = "Foydalanuvchi";
    $("#profileDate").textContent = session.date || "—";

    openModal("profileModal");
});

$("#profileClose").addEventListener("click", () => {
    closeModal("profileModal");
});

// LOGOUT
$("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    updateInterface();
    toast("Hisobdan chiqdingiz.");
});

// ADMIN PANEL
function renderAdmin() {
    const users = getUsers();

    $("#userCount").textContent = users.length;

    const list = $("#adminUsers");
    list.innerHTML = "";

    if (users.length === 0) {
        list.textContent = "Hozircha ro‘yxatdan o‘tgan foydalanuvchilar yo‘q.";
        return;
    }

    users.forEach(user => {
        const row = document.createElement("div");
        row.className = "admin-user";

        const name = document.createElement("span");
        name.textContent = user.name + " (" + user.email + ")";

        const role = document.createElement("span");
        role.textContent = user.role === "admin" ? "Admin" : "User";

        row.append(name, role);
        list.appendChild(row);
    });
}

// SEARCH
const searchInput = $("#searchInput");
let currentCategory = "all";

function filterCards() {
    const query = searchInput.value.toLowerCase().trim();
    let visible = 0;

    $$(".platform-card").forEach(card => {
        const text = card.textContent.toLowerCase();
        const category = card.dataset.category;

        const matchesText = text.includes(query);
        const matchesCategory =
            currentCategory === "all" ||
            category === currentCategory;

        const show = matchesText && matchesCategory;

        card.hidden = !show;

        if (show) visible++;
    });

    $("#emptyState").hidden = visible !== 0;
}

searchInput.addEventListener("input", filterCards);

$("#clearSearch").addEventListener("click", () => {
    searchInput.value = "";
    filterCards();
    searchInput.focus();
});

// CATEGORY FILTER
$$(".category").forEach(button => {
    button.addEventListener("click", () => {
        $$(".category").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        currentCategory = button.dataset.category;

        filterCards();
    });
});

// CARD DETAILS
$$(".card-link").forEach(button => {
    button.addEventListener("click", () => {
        toast(button.dataset.info + " — tez orada!");
    });
});

// DARK / LIGHT MODE
function setTheme(theme) {
    document.body.classList.toggle("light", theme === "light");

    $("#themeBtn").textContent =
        theme === "light" ? "☾" : "☀";

    localStorage.setItem(THEME_KEY, theme);
}

const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
setTheme(savedTheme);

$("#themeBtn").addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light")
        ? "dark"
        : "light";

    setTheme(nextTheme);

    toast(nextTheme === "light"
        ? "Yorug‘ rejim yoqildi."
        : "Qorong‘i rejim yoqildi.");
});

// MOBILE MENU
$("#menuBtn").addEventListener("click", () => {
    $("#navLinks").classList.toggle("show");
});

$$(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        $("#navLinks").classList.remove("show");
    });
});

// SMOOTH NAVIGATION
$$('a[href^="#"]').forEach(link => {
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

// INITIALIZE
updateInterface();
filterCards();

console.log("NOVA Premium Platform ishga tushdi!");
