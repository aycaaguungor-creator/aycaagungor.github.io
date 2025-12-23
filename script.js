function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(sectionId);
    if(target) target.classList.add('active');
    
    if(sectionId === 'map-section' && typeof map !== 'undefined') {
        setTimeout(() => { map.invalidateSize(); }, 300);
    }
}

const map = L.map('map').setView([38.4237, 27.1428], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.on('click', function(e) {
    L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
        .bindPopup('Kentsel Deneyim Noktası').openPopup();
});
