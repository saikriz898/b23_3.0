// Initialize Map
let map = L.map('map').setView([20.5937, 78.9629], 5); // Default: India
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let marker, geoAddress = "";

// Get user location
function selectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const coords = [lat, lon];

            map.setView(coords, 15);
            placeMarker(coords);

            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const data = await res.json();
                geoAddress = data.display_name || "Location Unavailable";
                document.getElementById('address').textContent = `📍 Address: ${geoAddress}`;
            } catch (error) {
                console.error("Error fetching address:", error);
                document.getElementById('address').textContent = "Failed to get address.";
            }
        }, () => {
            alert("Failed to get location. Please enable location services.");
        });
    } else {
        alert("Geolocation not supported by your browser.");
    }
}

// Place marker
function placeMarker(coords) {
    if (marker) map.removeLayer(marker);
    marker = L.marker(coords).addTo(map).bindPopup("Reported Location").openPopup();
}

// Open camera
async function openCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('video');
        video.srcObject = stream;
        video.classList.remove('hidden');
        document.getElementById('captureButton').classList.remove('hidden');
    } catch (err) {
        alert("Failed to access camera.");
        console.error(err);
    }
}

// Capture photo
function capturePhoto() {
    const video = document.getElementById('video');
    video.srcObject.getTracks().forEach(track => track.stop());
    video.classList.add('hidden');
    document.getElementById('captureButton').classList.add('hidden');
    alert("Photo captured!");
}

// Submit report and redirect
function submitReport() {
    const description = document.getElementById('description').value;

    if (!description || !marker) {
        alert("Please provide a description and select a location.");
        return;
    }

    // Simulate form submission
    setTimeout(() => {
        window.location.href = "confirmation.html";
    }, 1000); // Added slight delay for smooth transition
}
//