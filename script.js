const map = L.map('map').setView([38.4237, 27.1428], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

let currentCategory = "Belirtilmemiş";

function setCategory(cat) {
    currentCategory = cat;
    const status = document.getElementById('status-text');
    status.innerText = `Seçili: ${cat}. Haritaya dokun.`;
    status.style.color = "#7B61FF";
    status.style.fontWeight = "800";
}

map.on('click', function(e) {
    if(currentCategory === "Belirtilmemiş") {
        alert("Lütfen önce bir kategori seçin.");
        return;
    }

    const note = document.getElementById('user-note').value;
    const color = currentCategory === 'Güvenli' ? '#16A34A' : (currentCategory === 'Güvensiz' ? '#DC2626' : '#D97706');
    
    L.circleMarker([e.latlng.lat, e.latlng.lng], {
        radius: 12,
        fillColor: color,
        color: "#fff",
        weight: 3,
        fillOpacity: 0.9
    }).addTo(map)
      .bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif;">
            <b style="color:${color}">${currentCategory}</b><br>
            <p style="margin-top:5px;">${note || "Not bırakılmadı."}</p>
        </div>
      `).openPopup();

    document.getElementById('user-note').value = "";
});

// Navbar compact mode (scroll)
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const threshold = 5;

  const updateNavbar = () => {
    if (window.scrollY > threshold) navbar.classList.add("navbar--compact");
    else navbar.classList.remove("navbar--compact");
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });
});
