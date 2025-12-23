// --- 1. SAYFA YÖNETİMİ ---
// Menüdeki butonlara tıklandığında bölümler arası akıcı geçiş sağlar.
function showSection(sectionId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(s => s.classList.remove('active'));

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
        // Bölüm değiştiğinde en üste kaydırır
        window.scrollTo(0, 0);
    }

    // Harita sekmesine geçildiğinde Leaflet haritasını tazeler (boyut hatalarını önler)
    if (sectionId === 'map-section' && typeof map !== 'undefined') {
        setTimeout(() => { map.invalidateSize(); }, 300);
    }
}

// --- 2. HARİTA KURULUMU (İzmir Odaklı) ---
// Araştırma sahası olan İzmir (Bornova, Konak, Alsancak) merkezli harita.
const map = L.map('map').setView([38.4237, 27.1428], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap Katılımcıları'
}).addTo(map);

// --- 3. KATILIMCI HARİTALAMA (Participatory Mapping) ---
// Kullanıcılar haritaya tıkladığında "Görünmez Sınırları" işaretleyebilir.
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    // Geçici işaretçi (Marker) oluşturur ve açıklama baloncuğu açar
    const marker = L.marker([lat, lng]).addTo(map);
    
    // Araştırma kategorilerine göre (Güvenli/Riskli) basit bir form içeriği
    marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif;">
            <b>Konum İşaretlendi</b><br>
            <p>Bu nokta sizin için ne ifade ediyor?</p>
            <button onclick="alert('Deneyiminiz anonim olarak kaydedildi.')" 
                    style="background:#7B61FF; color:white; border:none; border-radius:10px; padding:5px 10px; cursor:pointer;">
                Veriyi Kaydet
            </button>
        </div>
    `).openPopup();
});

// --- 4. ARAŞTIRMA VERİSİ SİMÜLASYONU ---
// Gelecekte anket verilerini buraya entegre edebilirsiniz.
console.log("Kentin Görünmez Sınırları Araştırma Platformu Aktif.");
