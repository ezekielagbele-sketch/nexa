/* ================================
   MOBILE NAVIGATION
================================ */

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-links a");

menuToggle.addEventListener("click", () => {
   const isMenuOpen = navMenu.classList.toggle("active");

   menuToggle.classList.toggle("active", isMenuOpen);

   menuToggle.setAttribute(
    "aria-expanded",
    isMenuOpen
   );
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    });
});

/* ================================
   SCROLL REVEAL
================================ */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");

                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

/* ================================
   NEXA SAMPLE DATA
================================ */

const nexaData = [
    {
        id: 1,
        title: "Home Cleaning Services",
        category: "services",
        description: "Find reliable cleaning services for homes and offices.",
        location: "Lagos",
        latitude: 6.5244,
        longitude: 3.3792,
        icon: "🧹"
    },

    {
        id: 5,
        title: "Graduate Internship Program",
        category: "opportunities",
        description: "An internship opportunity for recent graduates.",
        location: "Lagos",
        latitude: 6.5244,
        longitude: 3.3792,
        icon: "🎓"
    },

    {
        id: 6,
        title: "Small Business Grant",
        category: "opportunities",
        description: "Funding opportunity for eligible small businesses.",
        location: "Nigeria",
        latitude: 9.0820,
        longitude: 8.6753,
        icon: "💰"
    },

    {
        id: 7,
        title: "Learn Web Development",
        category: "learning",
        description: "Start learning HTML, CSS and JavaScript from the basics.",
        location: "Online",
        coordinates: null,
        icon: "💻"
    },

    {
        id: 8,
        title: "Digital Marketing Basics",
        category: "learning",
        description: "Learn the fundamentals of digital marketing.",
        location: "Online",
        coordinates: null,
        icon: "📚"
    }
]

/* ================================
   EXPLORE ELEMENTS
================================ */

const searchInput = document.querySelector("#nexa-search");
const filterButtons = document.querySelectorAll(".filter-button");
const resultsContainer = document.querySelector("#explore-results");

/* ================================
   SAVED ITEMS
================================ */

let savedItems = JSON.parse(
    localStorage.getItem("nexaSavedItems")
) || [];

const savedResults = document.querySelector("#saved-results");
const savedCount = document.querySelector("#saved-count");

/* ================================
    CREATE SAVED CARD
================================ */

function createSavedCard(item) {
    return `
        <article class="saved-card">
            <div class="saved-card-icon">
                ${item.icon}
            </div>

            <div class="saved-card-content">

                <span class="saved-card-category">
                    ${item.category}
                </span>

                <h3>
                    ${item.title}
                </h3>

                <p>
                    ${item.description}
                </p>

                <span class="saved-card-location">
                    📍 ${item.location}
                </span>

                <div class="saved-card-actions">

                    <button
                        class="saved-view-button"
                        type="button"
                        data-id="${item.id}"
                    >
                        view Details
                    </button>
                    <button
                        class="remove-save-button"
                        type="button"
                        data-id="${item.id}"
                    >
                        ♥ Remove
                    </button>

                </div>

            </div>

        </article>
    `;
}


/* ================================
   DISPLAY SAVED RESULTS
================================ */
function displaySavedResults() {
    if (!savedResults) {
        return;
    }

    const savedData = nexaData.filter((item) =>
        savedItems.includes(item.id)
    );

    if (savedCount) {
        savedCount.textContent = savedData.length;
    }

    if (savedData.length === 0) {
        savedResults.innerHTML = `
        <div class="empty-saved">
            <h3>No saved items yet.</h3>

            <p>Explore Nexa and save useful services, opportunities, and learning resources for later.</p>

            <a
              href="#explore"
              class="card-button"
            >
              Explore Nexa
            </a>
        </div>
        `;

        return;
    }

    savedResults.innerHTML = savedData
            .map(createSavedCard)
         .join("");
}

/* ================================
   CREATE NEXA CARD
================================ */

function createNexaCard(item) {

    const isSaved = savedItems.includes(item.id);

    return `
        <article class="nexa-card">

            <div class="card-icon">
                ${item.icon}
            </div>

            <div class="card-content">

                <span class="card-category">
                    ${item.category}
                </span>

                <h3>
                    ${item.title}
                </h3>

                <p>
                    ${item.description}
                </p>

                <span class="card-location">
                    📍 ${item.location}

                    ${
                        item.distance !== undefined &&
                        item.distance !== null
                            ? ` . ${item.distance.toFixed(1)} km away`
                            : ""
                    }
                </span>

                <div class="card-actions">

                    <button
                        class="card-button"
                        type="button"
                        data-id="${item.id}"
                    >
                        View Details
                    </button>

                    <button
                        class="save-button ${isSaved ? "saved" : ""}"
                        type="button"
                        data-id="${item.id}"
                    >
                        ${isSaved ? "♥ Saved" : "♡ Save"}
                    </button>

                </div>

            </div>

        </article>
    `;
}

/* ================================
   DISPLAY RESULTS
================================ */
function displayResults(items) {

    if (items.length === 0) {
        resultsContainer.innerHTML = `
        <div class="no-results">
            <h3>No results found</h3>

            <p>Try another search or choose a different category.</p>
        </div>
        `;
        return;
    }

    resultsContainer.innerHTML = items
        .map(createNexaCard)
        .join("");
}

/* ================================
   CATEGORY FILTERING
================================ */

let currentCategory = "all";

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        currentCategory = button.dataset.category;

        filterButtons.forEach((filterButton) => {
            filterButton.classList.remove("active");
        });

        button.classList.add("active");

        filterResults();

    });

});

let locationEnabled = false;
let userLocation = null;

/* ================================
   FILTER RESULTS
================================ */
function filterResults() {
    const searchTerm =
        searchInput.value.toLowerCase().trim();

    let results = nexaData.filter((item) => {
        const matchesCategory =
            currentCategory === "all" ||
            item.category === currentCategory;

        const matchesSearch =
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.location.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    if (locationEnabled && userLocation) {
    results = results
        .map((item) => {
            if (item.latitude === undefined || item.longitude === undefined) {
                return {
                    ...item,
                    distance: null
                };
            }

            const distance =
                calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    item.latitude,
                    item.longitude
                );

            return {
                ...item,
                distance
            };
        })
        .filter((item) => {
            return (
                item.distance === null ||
                item.distance <= MAX_NEARBY_DISTANCE
            );
        })
        .sort((a, b) => {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;

            return a.distance - b.distance;
        });
}

    resultsContainer.innerHTML = "";

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <p>No results found.</p>
            </div>
        `;

        return;
    }

    results.forEach((item) => {
        resultsContainer.innerHTML +=
            createNexaCard(item);
    });
}

/* ================================
   SEARCH
================================ */

filterResults();

searchInput.addEventListener("input", () => {
    filterResults();
});     

/* ================================
   DETAILS MODAL
================================ */

const detailsModal = document.querySelector("#details-modal");
const modalClose = document.querySelector("#modal-close");

const modalIcon = document.querySelector("#modal-icon");
const modalCategory = document.querySelector("#modal-category");
const modalTitle = document.querySelector("#details-title");
const modalDescription = document.querySelector("#details-description");
const modalLocation = document.querySelector("#modal-location");

function openDetails(item) {
    modalIcon.textContent = item.icon;
    modalCategory.textContent = item.category;
    modalTitle.textContent = item.title;
    modalDescription.textContent = item.description;
    modalLocation.textContent = `📍 ${item.location}`;

    detailsModal.classList.add("active");
    detailsModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeDetails() {
    detailsModal.classList.remove("active");
    detailsModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

modalClose.addEventListener("click", () => {
    closeDetails();
});

detailsModal.addEventListener("click", (event) => {
    if (event.target === detailsModal) {
        closeDetails();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && detailsModal.classList.contains("active")) {
        closeDetails();
    } 
});

document.addEventListener("click", (event) => {
    const button = event.target.closest(".card-button");
    if (!button) {
        return;
    }

    const itemId = Number(button.dataset.id);
    const selectedItem = nexaData.find(
        (item) => item.id === itemId
    );

    if (selectedItem) {
        openDetails(selectedItem);
    }
});

document.addEventListener("click", (event) =>{

    const savedViewButton =
        event.target.closest(".saved-view-button");

    if(!savedViewButton) {
        return;
    }

    const itemId =
        Number(savedViewButton.dataset.id);

    const selectedItem = nexaData.find(
        (item) => item.id === itemId
    );

    if (selectedItem) {
        openDetails(selectedItem);
    }
});

/* ================================
   SAVE ITEMS
================================ */

function saveItem(itemId) {

    if (savedItems.includes(itemId)) {
        return;
    }

    savedItems.push(itemId);

    localStorage.setItem(
        "nexaSavedItems",
        JSON.stringify(savedItems)
    );

    displaySavedResults();
}

/* ================================
   UNSAVE ITEMS
================================ */

function removeSavedItem(itemId) {

    savedItems = savedItems.filter(
        (id) => id !== itemId
    );

    localStorage.setItem(
        "nexaSavedItems",
        JSON.stringify(savedItems)
    );

    displaySavedResults();
}

/* ================================ 
     MAKE SAVE BUTTON WORK
================================ */
document.addEventListener("click", (event) => {

    const saveButton = event.target.closest(".save-button");

    if (!saveButton) {
        return;
    }

    const itemId = Number(saveButton.dataset.id);

    if (savedItems.includes(itemId)) {

        removeSavedItem(itemId);

    } else {

        saveItem(itemId);

    }

    filterResults();
});

/*===================
 MAKE THE REMOVE BUTTON WORK
 =====================*/
document.addEventListener("click", (event) => {

    const removeButton =
       event.target.closest(".remove-save-button");

       if (!removeButton) {
          return;
       }

       const itemId =
            Number(removeButton.dataset.id);

        removeSavedItem(itemId);

        filterResults();
});

    displaySavedResults();

/*======================
  LOCATION
=======================*/
const MAX_NEARBY_DISTANCE = 50;

const locationButton =
    document.querySelector("#location-button");

const locationStatus =
    document.querySelector("#location-status");

/*======================
  LOCATION FUNCTION
=======================*/
function getUserLocation() {
     if (!navigator.geolocation) {
          locationStatus.textContent =
            "Location is not supported by your browser.";

        return;
     }

     locationStatus.textContent =
        "Getting your location...";

    locationButton.disabled = true;

    locationButton.textContent =
        "Finding You...";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude =
                position.coords.latitude;
            const longitude =
                position.coords.longitude;

            handleUserLocation(
                latitude,
                longitude
            );
        },

        (error) => {
            handleLocationError(error);
        }
    );
}

/*======================
  HANDLE THE LOCATION
=======================*/
function handleUserLocation(latitude, longitude) {
    locationEnabled = true;

    userLocation = {
        latitude: latitude,
        longitude: longitude
    };

    locationStatus.textContent =
        "Location enabled. Showing results near you.";

    locationButton.disabled = false;

    locationButton.textContent =
        "Location Enabled";

    locationButton.classList.add(
        "location-active"
    );

    const nearbyStatus =
        document.querySelector("#nearby-status");

    nearbyStatus.textContent =
        "Showing nearby results first.";

    nearbyStatus.classList.add("active");

    filterResults();
}

function handleLocationError(error) {
    locationButton.disabled = false;
    
    locationButton.textContent =
       "Use My Location";

    if (error.code === 1) {
        locationStatus.textContent =
            "Location permission was denied.";

        return;
    }

    if (error.code === 3) {
        locationStatus.textContent =
            "Location request timed out.";

        return;
    }

    locationStatus.textContent =
        "Unable to get your loaction."
}

/*======================
 MAKE THE BUTTON WORK
=======================*/

if (locationButton) {

    locationButton.addEventListener(
        "click",
        getUserLocation
    );

}

/* ================================
   DISTANCE CALCULATION
================================ */

function calculateDistance(
    userLatitude,
    userLongitude,
    itemLatitude,
    itemLongitude
) {
    const earthRadius = 6371;

    const latitudeDifference =
        (itemLatitude - userLatitude) *
        Math.PI / 180;

    const longitudeDifference =
        (itemLongitude - userLongitude) *
        Math.PI / 180;

    const a =
        Math.sin(latitudeDifference / 2) *
        Math.sin(latitudeDifference / 2) +
        Math.cos(userLatitude * Math.PI / 180) *
        Math.cos(itemLatitude * Math.PI / 180) *
        Math.sin(longitudeDifference / 2) *
        Math.sin(longitudeDifference / 2);

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;
}