// Apartment Gallery Data
const apartmentGalleries = {
    1: [
        '../ApartmentsJulija/img/A1/1.JPG',
        '../ApartmentsJulija/img/A1/2.JPG',
        '../ApartmentsJulija/img/A1/3.JPG',
        '../ApartmentsJulija/img/A1/4.JPG',
        '../ApartmentsJulija/img/A1/5.jpg',
        '../ApartmentsJulija/img/A1/6.jpg',
        '../ApartmentsJulija/img/A1/7.JPG',
        '../ApartmentsJulija/img/A1/8.JPG',
        '../ApartmentsJulija/img/A1/9.JPG'
    ],
    2: [
        '../ApartmentsJulija/img/A2/1.JPG',
        '../ApartmentsJulija/img/A2/2.JPG',
        '../ApartmentsJulija/img/A2/3.jpg',
        '../ApartmentsJulija/img/A2/4.jpg',
        '../ApartmentsJulija/img/A2/5.jpg',
        '../ApartmentsJulija/img/A2/6.JPG',
        '../ApartmentsJulija/img/A2/7.JPG',
        '../ApartmentsJulija/img/A2/8.JPG'
    ],
    3: [
        '../ApartmentsJulija/img/A3/1.jpg',
        '../ApartmentsJulija/img/A3/2.jpg',
        '../ApartmentsJulija/img/A3/3.jpg',
        '../ApartmentsJulija/img/A3/4.jpg',
        '../ApartmentsJulija/img/A3/5.jpg',
        '../ApartmentsJulija/img/A3/6.jpg',
        '../ApartmentsJulija/img/A3/7.jpg',
        '../ApartmentsJulija/img/A3/8.jpg'
    ],
    4: [
        '../ApartmentsJulija/img/A4/1.jpg',
        '../ApartmentsJulija/img/A4/2.jpg',
        '../ApartmentsJulija/img/A4/3.jpg',
        '../ApartmentsJulija/img/A4/4.jpg',
        '../ApartmentsJulija/img/A4/5.jpg',
        '../ApartmentsJulija/img/A4/6.jpg',
        '../ApartmentsJulija/img/A4/7.jpg',
        '../ApartmentsJulija/img/A4/8.JPG'
    ],
    5: [
        '../ApartmentsJulija/img/A5/1.JPG',
        '../ApartmentsJulija/img/A5/2.JPG',
        '../ApartmentsJulija/img/A5/3.jpg',
        '../ApartmentsJulija/img/A5/4.jpg',
        '../ApartmentsJulija/img/A5/5.jpg',
        '../ApartmentsJulija/img/A5/6.jpg',
        '../ApartmentsJulija/img/A5/7.JPG'
    ],
    6: [
        '../ApartmentsJulija/img/A6/1.JPG',
        '../ApartmentsJulija/img/A6/2.JPG',
        '../ApartmentsJulija/img/A6/3.JPG',
        '../ApartmentsJulija/img/A6/4.JPG',
        '../ApartmentsJulija/img/A6/5.JPG',
        '../ApartmentsJulija/img/A6/6.jpg',
        '../ApartmentsJulija/img/A6/7.JPG',
        '../ApartmentsJulija/img/A6/8.JPG',
        '../ApartmentsJulija/img/A6/9.JPG'
    ],
    7: [
        '../ApartmentsJulija/img/A7/1.jpg',
        '../ApartmentsJulija/img/A7/2.jpg',
        '../ApartmentsJulija/img/A7/3.jpg',
        '../ApartmentsJulija/img/A7/4.jpg',
        '../ApartmentsJulija/img/A7/5.jpg',
        '../ApartmentsJulija/img/A7/6.jpg',
        '../ApartmentsJulija/img/A7/7.jpg',
        '../ApartmentsJulija/img/A7/8.jpg',
        '../ApartmentsJulija/img/A7/9.jpg',
        '../ApartmentsJulija/img/A7/10.jpg',
        '../ApartmentsJulija/img/A7/11.JPG'
    ],
    8: [
        '../ApartmentsJulija/img/A8/1.JPG',
        '../ApartmentsJulija/img/A8/2.JPG',
        '../ApartmentsJulija/img/A8/3.jpg',
        '../ApartmentsJulija/img/A8/4.jpg',
        '../ApartmentsJulija/img/A8/5.jpg',
        '../ApartmentsJulija/img/A8/6.jpg',
        '../ApartmentsJulija/img/A8/7.JPG'
    ]
};

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
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const apartmentNum = parseInt(btn.getAttribute('data-apartment'));
        openGallery(apartmentNum);
    });
});

// Also open gallery when clicking on apartment card
document.querySelectorAll('.apartment-card').forEach(card => {
    card.addEventListener('click', () => {
        const apartmentNum = parseInt(card.getAttribute('data-apartment'));
        openGallery(apartmentNum);
    });
});

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

// ===== Google Maps Initialization =====
function initMap() {
    const location = { lat: 45.183672, lng: 14.6810937 };

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: location,
        scrollwheel: false,
        draggable: true,
        styles: [
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#89c4f4" }]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{ "color": "#f8f9fa" }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{ "color": "#ffffff" }]
            }
        ]
    });

    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Apartments Julija',
        animation: google.maps.Animation.DROP
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px;">
                <h3 style="margin: 0 0 10px 0; color: #2c5f8d;">Apartments Julija</h3>
                <p style="margin: 0;">Brace dr. Sobol 16B<br>Crikvenica, Croatia</p>
            </div>
        `
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

// Initialize map when Google Maps API is loaded
window.addEventListener('load', () => {
    if (typeof google !== 'undefined') {
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
window.addEventListener('load', () => {
    // Preload first image of each apartment for better performance
    Object.keys(apartmentGalleries).forEach(key => {
        const img = new Image();
        img.src = apartmentGalleries[key][0];
    });
});
