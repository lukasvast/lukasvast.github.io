// Apartment Gallery Data - Auto-detected
const apartmentGalleries = {};
const imageExtensions = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG'];
const maxImagesPerApartment = 50; // Maximum images to check per apartment

// Function to check if an image exists
async function imageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Auto-detect images for all apartments
async function loadApartmentGalleries() {
    const totalApartments = 9; // Total number of apartments

    for (let apartmentNum = 1; apartmentNum <= totalApartments; apartmentNum++) {
        apartmentGalleries[apartmentNum] = [];

        // Try to load images sequentially
        for (let imageNum = 1; imageNum <= maxImagesPerApartment; imageNum++) {
            let foundImage = false;

            // Try different extensions
            for (const ext of imageExtensions) {
                const imagePath = `./img/A${apartmentNum}/${imageNum}.${ext}`;

                if (await imageExists(imagePath)) {
                    apartmentGalleries[apartmentNum].push(imagePath);
                    foundImage = true;
                    break; // Found the image, no need to check other extensions
                }
            }

            // If no image found with any extension, assume no more images
            if (!foundImage) {
                break;
            }
        }

        console.log(`Loaded ${apartmentGalleries[apartmentNum].length} images for Apartment ${apartmentNum}`);
    }
}

// Initialize galleries on page load
let galleriesLoaded = false;

// Current gallery state
let currentApartment = 1;
let currentImageIndex = 0;

// ===== Navigation Functionality =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Active navigation on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    // Navbar background on scroll
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Gallery Modal Functionality =====
const galleryModal = document.getElementById('galleryModal');
const galleryImage = document.getElementById('galleryImage');
const galleryThumbnails = document.getElementById('galleryThumbnails');
const modalClose = document.querySelector('.modal-close');
const prevBtn = document.querySelector('.gallery-nav.prev');
const nextBtn = document.querySelector('.gallery-nav.next');
const viewGalleryBtns = document.querySelectorAll('.view-gallery');

// Open gallery modal
viewGalleryBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const apartmentNum = parseInt(btn.getAttribute('data-apartment'));
        await ensureGalleriesLoaded();
        openGallery(apartmentNum);
    });
});

// Also open gallery when clicking on apartment card
document.querySelectorAll('.apartment-card').forEach(card => {
    card.addEventListener('click', async () => {
        const apartmentNum = parseInt(card.getAttribute('data-apartment'));
        await ensureGalleriesLoaded();
        openGallery(apartmentNum);
    });
});

// Ensure galleries are loaded before opening
async function ensureGalleriesLoaded() {
    if (!galleriesLoaded) {
        await loadApartmentGalleries();
        galleriesLoaded = true;
    }
}

function openGallery(apartmentNum) {
    currentApartment = apartmentNum;
    currentImageIndex = 0;
    const images = apartmentGalleries[apartmentNum];

    if (!images || images.length === 0) return;

    // Show modal
    galleryModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Display first image
    displayImage(currentImageIndex);

    // Create thumbnails
    createThumbnails(images);
}

function displayImage(index) {
    const images = apartmentGalleries[currentApartment];
    galleryImage.src = images[index];

    // Update active thumbnail
    const thumbnails = galleryThumbnails.querySelectorAll('img');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function createThumbnails(images) {
    galleryThumbnails.innerHTML = '';
    images.forEach((src, index) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.classList.toggle('active', index === 0);
        thumb.addEventListener('click', () => {
            currentImageIndex = index;
            displayImage(currentImageIndex);
        });
        galleryThumbnails.appendChild(thumb);
    });
}

// Close modal
modalClose.addEventListener('click', closeModal);
galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
        closeModal();
    }
});

function closeModal() {
    galleryModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navigation buttons
prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const images = apartmentGalleries[currentApartment];
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    displayImage(currentImageIndex);
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const images = apartmentGalleries[currentApartment];
    currentImageIndex = (currentImageIndex + 1) % images.length;
    displayImage(currentImageIndex);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!galleryModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        prevBtn.click();
    } else if (e.key === 'ArrowRight') {
        nextBtn.click();
    }
});

// ===== Leaflet Map Initialization =====
function initMap() {
    const location = [45.183672, 14.6810937];

    // Initialize the map
    const map = L.map('map', {
        center: location,
        zoom: 16,
        scrollWheelZoom: false,
        dragging: true
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Create custom marker icon
    const customIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Add marker
    const marker = L.marker(location, { icon: customIcon }).addTo(map);

    // Add popup to marker
    marker.bindPopup(`
        <div style="padding: 10px;">
            <h3 style="margin: 0 0 10px 0; color: #2c5f8d;">Apartments Julija</h3>
            <p style="margin: 0;">Brace dr. Sobol 16B<br>Crikvenica, Croatia</p>
        </div>
    `);
}

// Initialize map when Leaflet is loaded
window.addEventListener('load', () => {
    if (typeof L !== 'undefined') {
        initMap();
    }
});

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.apartment-card, .amenity-card, .stat, .contact-card');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===== Preload Critical Images =====
window.addEventListener('load', async () => {
    // Load all apartment galleries on page load for better performance
    await loadApartmentGalleries();
    galleriesLoaded = true;

    // Preload first image of each apartment
    Object.keys(apartmentGalleries).forEach(key => {
        if (apartmentGalleries[key].length > 0) {
            const img = new Image();
            img.src = apartmentGalleries[key][0];
        }
    });
});
