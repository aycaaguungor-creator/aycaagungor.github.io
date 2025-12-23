// --- 1. SAYFA GEÇİŞ MANTIĞI ---
// Moodboard'daki kullanıcı dostu ve akışkan deneyimi sağlar.
function showSection(sectionId) {
    // Tüm bölümleri gizle
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(s => s.classList.remove('active'));

    // Seçilen bölümü göster
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    // Harita sayfası açılıyorsa Leaflet haritasını tazele (kaymaları önler)
    if (sectionId === 'map-section' && typeof map !== 'undefined') {
        setTimeout(() => { map.invalidateSize(); }, 300);
    }
}

// --- 2. KATILIMCI HARİTALAMA (İzmir Odaklı) ---
[span_5](start_span)[span_6](start_span)// Araştırma yönergesinde belirtilen İzmir örneklemi için harita kurulumu[span_5](end_span)[span_6](end_span).
const map = L.map('map').setView([38.4237, 27.1428], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap Katılımcıları'
}).addTo(map);

// --- 3. DENEYİM AĞI OLUŞTURMA (Pin Bırakma) ---
[span_7](start_span)[span_8](start_span)// "Participatory Mapping" tekniği: Kullanıcı haritaya tıkladığında çalışır[span_7](end_span)[span_8](end_span).
map.on('click', function(e) {
    const lat = e.latlng.lat.toFixed(4);
    const lng = e.latlng.lng.toFixed(4);
    
    // Araştırma verisi girişi için form alanını göster
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
        formContainer.classList.remove('hidden');
    }
    
    // Geçici işaretçi (Marker) ekle
    L.marker([lat, lng]).addTo(map)
        .bindPopup(`<b>Deneyim Noktası Seçildi</b><br>Koordinat: ${lat}, ${lng}`)
        .openPopup();
});

// --- 4. VERİ KAYDETME (Araştırma Kaydı) ---
[span_9](start_span)[span_10](start_span)// Girilen nitel verileri konsola ve arayüze işler[span_9](end_span)[span_10](end_span).
function saveData() {
    const desc = document.getElementById('description').value;
    
    if(desc.trim() === "") {
        alert("Lütfen kentsel deneyiminizi açıklayan kısa bir not ekleyin.");
        return;
    }

    [span_11](start_span)[span_12](start_span)// Etik standartlara uygun veri toplama simülasyonu[span_11](end_span)[span_12](end_span)
    console.log("Yeni Araştırma Verisi:", desc);
    alert("Deneyiminiz 'Kentin Görünmez Sınırları' veritabanına anonim olarak kaydedildi. Teşekkürler!");
    
    // Formu temizle ve gizle
    document.getElementById('description').value = '';
    document.getElementById('form-container').classList.add('hidden');
}
