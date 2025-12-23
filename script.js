// --- 1. SAYFA GEÇİŞ MANTIĞI ---
function showSection(sectionId) {
    // Tüm bölümleri gizle
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(s => s.classList.remove('active'));

    // Tıklanan bölümü göster
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    // Harita sayfası açılıyorsa haritayı tazele (görsel kaymaları önlemek için)
    if (sectionId === 'map-section' && typeof map !== 'undefined') {
        setTimeout(() => { map.invalidateSize(); }, 300);
    }
}

// --- 2. HARİTA KURULUMU (İzmir Merkezli) ---
const map = L.map('map').setView([38.4237, 27.1428], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// --- 3. HARİTADA ETKİLEŞİM (Pin Bırakma) ---
map.on('click', function(e) {
    const lat = e.latlng.lat.toFixed(4);
    const lng = e.latlng.lng.toFixed(4);
    
    // Formu göster (Sidebar'daki gizli alanı açar)
    document.getElementById('form-container').classList.remove('hidden');
    
    // Geçici bir marker ekle
    const tempMarker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`Konum Seçildi: ${lat}, ${lng}<br>Lütfen soldaki formu doldurun.`)
        .openPopup();
});

// --- 4. VERİ KAYDETME (Simülasyon) ---
function saveData() {
    const desc = document.getElementById('description').value;
    if(desc === "") {
        alert("Lütfen bir açıklama yazın!");
        return;
    }
    alert("Deneyiminiz başarıyla kaydedildi (Yerel Hafıza)!");
    document.getElementById('form-container').classList.add('hidden');
    document.getElementById('description').value = '';
}
