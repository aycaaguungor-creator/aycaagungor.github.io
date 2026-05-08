const CATEGORY_META = {
  "Güvenli": { color: "#16A34A" },
  "Orta Güvenli": { color: "#D97706" },
  "Güvensiz": { color: "#DC2626" }
};

let currentCategory = "";
let experiences = JSON.parse(localStorage.getItem("kgs_experiences") || "[]");

const map = L.map("map", { scrollWheelZoom: false }).setView([38.4237, 27.1428], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function saveExperiences() {
  localStorage.setItem("kgs_experiences", JSON.stringify(experiences));
}

function setCategory(category) {
  currentCategory = category;
  document.querySelectorAll(".btn-cat").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === category);
  });
  const status = document.getElementById("status-text");
  status.textContent = `Seçili kategori: ${category}. Şimdi haritada bir noktaya dokun.`;
}

function addMarker(experience, openPopup = false) {
  const marker = L.circleMarker([experience.lat, experience.lng], {
    radius: 12,
    fillColor: CATEGORY_META[experience.category].color,
    color: "#fff",
    weight: 3,
    fillOpacity: 0.92
  }).addTo(map);

  marker.bindPopup(`
    <div style="font-family:'Plus Jakarta Sans',sans-serif;max-width:220px;">
      <b style="color:${CATEGORY_META[experience.category].color}">${escapeHTML(experience.category)}</b>
      <p style="margin:6px 0 0;line-height:1.45;">${escapeHTML(experience.note || "Not bırakılmadı.")}</p>
    </div>
  `);

  if (openPopup) marker.openPopup();
}

function renderExperiences() {
  const list = document.getElementById("experience-list");
  if (!list) return;

  if (experiences.length === 0) {
    list.innerHTML = `<div class="empty-state">Henüz deneyim eklenmedi. Haritaya ilk anonim notu sen bırakabilirsin.</div>`;
    return;
  }

  list.innerHTML = experiences
    .slice()
    .reverse()
    .map((item) => `
      <article class="experience-card">
        <b style="color:${CATEGORY_META[item.category].color}">${escapeHTML(item.category)}</b>
        <p>${escapeHTML(item.note || "Not bırakılmadı.")}</p>
      </article>
    `)
    .join("");
}

function renderBlogs() {
  const blogList = document.getElementById("blog-list");
  if (!blogList || !window.BLOG_POSTS) return;

  blogList.innerHTML = window.BLOG_POSTS.map((post, index) => {
    const paragraphs = post.content
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const clean = escapeHTML(line);
        const isHeading = !clean.endsWith(".") && clean.length < 95 && !clean.startsWith("“") && !clean.startsWith("Call to Action");
        return isHeading ? `<h4>${clean}</h4>` : `<p>${clean}</p>`;
      })
      .join("");

    return `
      <article class="blog-card" data-blog-card>
        <p class="eyebrow">Blog ${index + 1}</p>
        <h3>${escapeHTML(post.title)}</h3>
        <p>${escapeHTML(post.snippet)}</p>
        <div class="blog-full">${paragraphs}</div>
        <button class="read-more" type="button" data-read-more>Devamını oku</button>
      </article>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn-cat").forEach((button) => {
    button.addEventListener("click", () => setCategory(button.dataset.category));
  });

  experiences.forEach((experience) => addMarker(experience));
  renderExperiences();
  renderBlogs();

  map.on("click", (event) => {
    if (!currentCategory) {
      alert("Lütfen önce bir kategori seçin.");
      return;
    }

    const textarea = document.getElementById("user-note");
    const note = textarea.value.trim();

    const experience = {
      category: currentCategory,
      note,
      lat: event.latlng.lat,
      lng: event.latlng.lng,
      createdAt: new Date().toISOString()
    };

    experiences.push(experience);
    saveExperiences();
    addMarker(experience, true);
    renderExperiences();
    textarea.value = "";
    document.getElementById("status-text").textContent = "Deneyimin anonim olarak eklendi.";
  });

  document.getElementById("clear-experiences")?.addEventListener("click", () => {
    if (!confirm("Bu cihazdaki anonim deneyimleri temizlemek istiyor musun?")) return;
    localStorage.removeItem("kgs_experiences");
    location.reload();
  });

  document.addEventListener("click", (event) => {
    const readButton = event.target.closest("[data-read-more]");
    if (readButton) {
      const card = readButton.closest("[data-blog-card]");
      card.classList.toggle("open");
      readButton.textContent = card.classList.contains("open") ? "Daha az göster" : "Devamını oku";
    }

    const menuToggle = event.target.closest(".menu-toggle");
    if (menuToggle) {
      const links = document.querySelector(".nav-links");
      const isOpen = links.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    }

    if (event.target.closest(".nav-links a")) {
      document.querySelector(".nav-links")?.classList.remove("open");
      document.querySelector(".menu-toggle")?.setAttribute("aria-expanded", "false");
    }
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
});
