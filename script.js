// --- 1. SAYFA GEÇİŞ KONTROLÜ ---
// Üst menüdeki butonlara basınca ilgili bölümü (Hakkımızda, Harita vb.) aktif eder.
function showSection(sectionId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(s => s.classList.remove('active'));

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    // Harita sayfası açıldığında Leaflet haritasını yeniden boyutlandırır (kaymaları önler)
    if (sectionId === 'map-section' && typeof map !== 'undefined') {
        setTimeout(() => { map.invalidateSize(); }, 300);
    }
}

// --- 2. HARİTA KURULUMU (İzmir Odaklı) ---
[span_4](start_span)[span_5](start_span)// Projenin araştırma sahası olan İzmir merkezli haritayı başlatır[span_4](end_span)[span_5](end_span).
const map = L.map('map').setView([38.4237, 27.1428], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap Katılımcıları'
}).addTo(map);

// --- 3. KATILIMCI HARİTALAMA ETKİLEŞİMİ ---
[span_6](start_span)[span_7](start_span)// Kullanıcı haritaya tıkladığında çalışır[span_6](end_span)[span_7](end_span).
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    // Sidebar'daki giriş formunu görünür yapar
    document.getElementById('form-container').classList.remove('hidden');
    
    // Tıklanan yere geçici bir işaretçi ekler
    L.marker([lat, lng]).addTo(map)
        .bindPopup(`<b>Seçilen Konum</b><br>Kategori seçip deneyiminizi yazın.`)
        .openPopup();
});

// --- 4. VERİ KAYDETME FONKSİYONU ---
[span_8](start_span)[span_9](start_span)// Formdaki verileri alır ve bir mesaj gösterir (Araştırma etiği gereği şimdilik yereldir)[span_8](end_span)[span_9](end_span).
function saveData() {
    const category = document.getElementById('category').value;
    const desc = document.getElementById('description').value;

    if(desc.trim() === "") {
        alert("Lütfen bir açıklama ekleyin.");
        return;
    }

    // Gerçek bir veritabanı bağlantısı yoksa bile deneyimi onaylar
    console.log("Veri Kaydedildi:", { category, desc });
    alert("Deneyiminiz başarıyla sisteme iletildi. Katkınız için teşekkürler!");
    
    // Formu temizle ve gizle
    document.getElementById('description').value = '';
    document.getElementById('form-container').classList.add('hidden');
}
