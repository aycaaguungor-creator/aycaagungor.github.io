// Haritayı İzmir merkezli başlat
const map = L.map('map').setView([38.4237, 27.1428], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Verileri saklamak için dizi (Normalde DB olurdu, burada LocalStorage kullanacağız)
let allData = JSON.parse(localStorage.getItem('kentVerisi')) || [];

// Çizim Araçları
const drawControl = new L.Control.Draw({
    draw: {
        polygon: true,
        polyline: true,
        marker: true,
        circle: false,
        rectangle: false
    },
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

let tempLayer = null;

// Çizim bittiğinde form aç
map.on(L.Draw.Event.CREATED, function (e) {
    tempLayer = e.layer;
    document.getElementById('form-container').classList.remove('hidden');
});

function saveData() {
    const category = document.getElementById('category').value;
    const desc = document.getElementById('description').value;
    const type = tempLayer instanceof L.Marker ? 'marker' : (tempLayer instanceof L.Polygon ? 'polygon' : 'line');
    
    // Konum hassasiyeti: yaklaşık konuma yuvarlama (Opsiyonel)
    let latlngs;
    if(type === 'marker') {
        latlngs = { lat: tempLayer.getLatLng().lat.toFixed(3), lng: tempLayer.getLatLng().lng.toFixed(3) };
    } else {
        latlngs = tempLayer.getLatLngs();
    }

    const newData = {
        id: Date.now(),
        category,
        desc,
        type,
        coords: latlngs,
        timestamp: new Date().toLocaleString()
    };

    allData.push(newData);
    localStorage.setItem('kentVerisi', JSON.stringify(allData));
    
    renderData();
    document.getElementById('form-container').classList.add('hidden');
    document.getElementById('description').value = '';
}

function renderData(filter = 'all') {
    drawnItems.clearLayers();
    allData.forEach(item => {
        if (filter !== 'all' && item.category !== filter) return;

        let layer;
        const color = item.category === 'guvenli' ? 'green' : (item.category === 'riskli' ? 'orange' : 'red');

        if (item.type === 'marker') {
            layer = L.marker([item.coords.lat, item.coords.lng]);
        } else if (item.type === 'polygon') {
            layer = L.polygon(item.coords, {color: color});
        } else {
            layer = L.polyline(item.coords, {color: color});
        }

        layer.bindPopup(`<b>${item.category.toUpperCase()}</b><br>${item.desc}<br><small>${item.timestamp}</small>`);
        drawnItems.addLayer(layer);
    });
}

function filterMarkers(cat) {
    renderData(cat);
}

function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Kategori,Aciklama,Tarih\n";
    allData.forEach(r => {
        csvContent += `${r.category},${r.desc},${r.timestamp}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kent_verileri.csv");
    document.body.appendChild(link);
    link.click();
}

// Sayfa açıldığında verileri yükle
renderData();
