// Harita Kurulumu (İzmir Odaklı)
const map = L.map('map').setView([38.4237, 27.1428], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

let currentCategory = "Belirtilmemiş";

// Kategori Seçme Fonksiyonu (Samimi Dil)
function setCategory(cat) {
    currentCategory = cat;
    const status = document.getElementById('status-text');
    status.innerText = `Harika! ${cat} kategorisini seçtin. Şimdi deneyimini haritaya bırakabilirsin.`;
    status.style.color = "#7B61FF";
    status.style.fontWeight = "800";
}

// Haritaya Tıklama ve İşaretleme (Samimi Dil)
map.on('click', function(e) {
    if(currentCategory === "Belirtilmemiş") {
        alert("Deneyimini paylaşmadan önce lütfen yukarıdan bir kategori seçer misin?");
        return;
    }

    // Not alanındaki metni al
    const userNote = document.getElementById('user-note').value;
    const noteContent = userNote ? `<br><i style="color:#555;">"${userNote}"</i>` : "";
    const color = currentCategory === 'Güvenli' ? '#2E7D32' : (currentCategory === 'Güvensiz' ? '#C62828' : '#FBC02D');
    
    L.circleMarker([e.latlng.lat, e.latlng.lng], {
        radius: 12,
        fillColor: color,
        color: "#fff",
        weight: 3,
        fillOpacity: 0.9
    }).addTo(map)
      .bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width:150px;">
            <b style="color:${color}; font-size:1.1rem;">${currentCategory}</b>${noteContent}
            <p style="font-size:0.8rem; margin-top:5px; color:#888;">Katkın için çok teşekkürler!</p>
        </div>
      `).openPopup();

    // İşaretlemeden sonra not alanını temizle
    document.getElementById('user-note').value = "";
});