//& Smooth Scrolling
// Initialize Lenis
const lenis = new Lenis();

lenis.on('scroll', (e) => {
    console.log(e);
  });
// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

        // Function to show the reservation form
        function showReservationForm() {
            // Hide the order form
            document.querySelector('.order-form').style.display = 'none';
            // Show the reservation form
            document.querySelector('.reservation-form').style.display = 'block';
        }

        // Function to show the order form
        function showOrderForm() {
            // Hide the reservation form
            document.querySelector('.reservation-form').style.display = 'none';
            // Show the order form
            document.querySelector('.order-form').style.display = 'block';
            // Optionally, populate the menu items here
            populateMenuItems();
        }

        // Function to populate menu items (example implementation)
        function populateMenuItems() {
            const menuItemsContainer = document.getElementById('menuItems');
            menuItemsContainer.innerHTML = ''; // Clear existing items

            // Example menu items (you can replace this with your actual menu data)
            const menuItems = [
                { name: 'Spring Rolls', price: 5.99 },
                { name: 'Buddha Bowl', price: 9.99 },
                { name: 'Miso Soup', price: 4.99 },
                { name: 'Raw Pad Thai', price: 10.99 },
                { name: 'Bruschetta', price: 6.99 },
                { name: 'Mediterranean Wrap', price: 8.99 },
                { name: 'Jackfruit Crab Cakes', price: 12.99 },
                { name: 'Cauliflower Steak', price: 11.99 },
                { name: 'Mushroom Tartare', price: 7.99 },
                { name: 'Wild Mushroom Risotto', price: 13.99 },
                { name: 'Roasted Beet Carpaccio', price: 9.99 },
                { name: 'Thai Green Curry', price: 11.99 }
            ];

            // Populate the menu items
            menuItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'menu-item';
                itemDiv.innerHTML = `
                    <div class="menu-item-details">
                        <span class="menu-item-name">${item.name}</span>
                        <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
                    </div>
                `;
                menuItemsContainer.appendChild(itemDiv);
            });
        }

        // Function to add items to the cart (example implementation)
        function addToCart(name, price) {
            // Logic to add the item to the cart
            console.log(`Added ${name} to cart at $${price}`);
            // You can implement cart logic here
        }

        // Function to show the section
        function showSection(sectionId) {
            // Get the target section
            const targetSection = document.getElementById(sectionId);

            // Update navigation underline with smooth transition
            document.querySelectorAll('.nav-links a').forEach(link => {
                if (link.getAttribute('href').substring(1) === sectionId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Update the header title immediately
            const currentTitle = document.querySelector('.current-section-title');
            currentTitle.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

            // Close menu if on mobile
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        }

        // Add scroll detection for automatic tab highlighting with smooth transitions
        // Initialize section highlighting
        function updateActiveSection() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-links a');
            const currentTitle = document.querySelector('.current-section-title');
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Check if we're near the bottom of the page
            if ((window.innerHeight + window.scrollY) >= documentHeight - 100) {
                // Activate the Contact tab
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === '#contact') {
                        link.classList.add('active');
                        currentTitle.textContent = 'Contact';
                    } else {
                        link.classList.remove('active');
                    }
                });
                return;
            }
            
            // Normal scroll behavior
            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && 
                    scrollPosition < (sectionTop + sectionHeight) &&
                    sectionId !== 'contact') { // Don't activate contact during normal scroll
                    currentSection = sectionId;
                }
            });
            
            // Update navigation
            if (currentSection) {
                navLinks.forEach(link => {
                    const linkHref = link.getAttribute('href').substring(1);
                    if (linkHref === currentSection) {
                        link.classList.add('active');
                        currentTitle.textContent = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        }

        // Add scroll event listener with throttling
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial call to set active section
        document.addEventListener('DOMContentLoaded', function() {
            updateActiveSection();
        });

        // Show home section and activate home tab by default
        document.querySelector('a[href="#home"]').classList.add('active'); // Keep underline if on home page

        function toggleMenu() {
            const navLinks = document.querySelector('.nav-links');
            const menuToggle = document.querySelector('.menu-toggle');
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        }

        // Replace the existing reservation-related JavaScript with this
        function initializeReservationSystem() {
            const dateInput = document.getElementById('reservationDate');
            const timeSelect = document.getElementById('reservationTime');
            const form = document.querySelector('.reservation-form');

            // Set date constraints
            const today = new Date();
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 1);
            
            // Format today's date as YYYY-MM-DD for the min attribute
            const todayStr = today.toISOString().split('T')[0];
            const maxDateStr = maxDate.toISOString().split('T')[0];
            
            dateInput.min = todayStr;
            dateInput.max = maxDateStr;

            function populateTimeSlots() {
                timeSelect.innerHTML = '';
                
                if (!dateInput.value) return;
                
                const selectedDate = new Date(dateInput.value + 'T00:00:00');
                const now = new Date();
                const isToday = selectedDate.toDateString() === now.toDateString();
                
                // Add 30 minutes preparation time
                const minTime = new Date(now.getTime() + 30 * 60000);
                
                timeSelect.disabled = false;

                // Function to check if a time slot is valid (at least 30 mins from now)
                const isValidTimeSlot = (hour, minute, forDate) => {
                    if (!isToday) return true;
                    
                    const slotTime = new Date(forDate);
                    slotTime.setHours(hour, minute, 0, 0);
                    
                    // Add 30 minutes to current time for minimum reservation time
                    const minReservationTime = new Date(now.getTime() + 30 * 60000);
                    
                    return slotTime > minReservationTime;
                };

                // Format time for display
                const formatTime = (hour, minute) => {
                    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                };

                // Add lunch slots (11 AM to 3 PM)
                const addLunchSlots = (forDate) => {
                    // Determine the lunch time window
                    const lunchStartHour = 11;
                    const lunchEndHour = 14;
                    const lunchEndMinute = 30;

                    for (let hour = lunchStartHour; hour <= lunchEndHour; hour++) {
                        for (let minute = 0; minute < 60; minute += 30) {
                            // Stop at 2:45 PM for last reservation
                            if (hour === lunchEndHour && minute > 45) continue;
                            
                            // Create the time slot
                            const timeString = formatTime(hour, minute);
                            const dateString = forDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                            
                            // Check if this slot is valid based on current time
                            const slotTime = new Date(forDate);
                            slotTime.setHours(hour, minute, 0, 0);
                            const currentTime = new Date(now.getTime());
                            
                            // For today's date, apply stricter time validation
                            if (forDate.toDateString() === today.toDateString()) {
                                // Only show slots that are in the future
                                if (slotTime <= currentTime) continue;
                                
                                // Ensure we're within lunch hours or just after
                                const currentHour = currentTime.getHours();
                                const currentMinute = currentTime.getMinutes();
                                
                                // If current time is past 2:30 PM, only show next day's lunch slots
                                if (currentHour > lunchEndHour || 
                                    (currentHour === lunchEndHour && currentMinute > lunchEndMinute)) {
                                    continue;
                                }
                            }
                            
                            // Add the time slot
                            timeSelect.add(new Option(`${timeString} (Lunch - ${dateString})`, `${forDate.toISOString().split('T')[0]} ${timeString}`));
                        }
                    }
                };

                // Add dinner slots (5 PM to 10:30 PM)
                const addDinnerSlots = (forDate) => {
                    for (let hour = 17; hour <= 22; hour++) {
                        for (let minute = 0; minute < 60; minute += 30) {
                            // Stop at 10:30 PM for last reservation
                            if (hour === 22 && minute > 45) continue;
                            
                            // Skip invalid time slots
                            if (!isValidTimeSlot(hour, minute, forDate)) continue;
                            
                            const timeString = formatTime(hour, minute);
                            const dateString = forDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                            timeSelect.add(new Option(`${timeString} (Dinner - ${dateString})`, `${forDate.toISOString().split('T')[0]} ${timeString}`));
                        }
                    }
                };

                // For today's slots
                if (isToday) {
                    // Only show remaining valid slots for today
                    const currentHour = now.getHours();
                    if (currentHour < 14 || (currentHour === 14 && now.getMinutes() <= 45)) {
                        // Can still make lunch reservations
                        addLunchSlots(selectedDate);
                    }
                    if (currentHour < 22 || (currentHour === 22 && now.getMinutes() <= 45)) {
                        // Can still make dinner reservations
                        addDinnerSlots(selectedDate);
                    }
                } else {
                    // Show all slots for future dates
                    addLunchSlots(selectedDate);
                    addDinnerSlots(selectedDate);
                }

                if (timeSelect.options.length === 0) {
                    timeSelect.innerHTML = '<option value="">No available slots for today</option>';
                    timeSelect.disabled = true;
                }
            }

            function validateDate() {
                const errorMessage = dateInput.nextElementSibling;
                const selectedDate = new Date(dateInput.value + 'T00:00:00');
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                
                // If selected date is today but it's past our last reservation time (9:30 PM)
                if (selectedDate.toDateString() === today.toDateString() && 
                    (now.getHours() >= 21 && now.getMinutes() > 30)) {
                    errorMessage.textContent = "No more reservations available for today";
                    errorMessage.style.display = 'block';
                    dateInput.value = '';
                    timeSelect.disabled = true;
                    return false;
                }
                
                // Removed Monday restriction
                
                errorMessage.style.display = 'none';
                populateTimeSlots();
                return true;
            }

            // Event Listeners
            dateInput.addEventListener('change', validateDate);
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!dateInput.value) {
                    alert('Please select a date');
                    return;
                }
                
                if (!timeSelect.value) {
                    alert('Please select a time slot');
                    return;
                }
                
                // Here you would typically send the reservation data to a server
                alert('Reservation submitted successfully!');
                form.reset();
                timeSelect.disabled = true;
            });
        }

        // Call this function when showing the reservation form
        function showReservationForm() {
            document.querySelector('.reservation-form').style.display = 'block';
            document.querySelector('.order-form').style.display = 'none';
            initializeReservationSystem();
        }

        // Add this to your existing JavaScript
        const menuItems = {
            lunch: [
                { 
                    name: "Spring Rolls", 
                    price: 12.99, 
                    calories: 320, 
                    allergens: "gluten, soy", 
                    description: "Fresh rice paper rolls with paneer, vermicelli, and seasonal vegetables (Vegetarian, contains paneer)",
                    category: "Starters",
                    isPopular: false,
                    rating: 3.5
                },
                { 
                    name: "Miso Soup", 
                    price: 8.99, 
                    calories: 180, 
                    allergens: "soy", 
                    description: "Traditional miso soup with tofu, wakame, and green onions",
                    category: "Starters",
                    isPopular: false,
                    rating: 3
                },
                { 
                    name: "Bruschetta", 
                    price: 10.99, 
                    calories: 280, 
                    allergens: "gluten", 
                    description: "Grilled sourdough with fresh tomatoes, basil, and garlic (Vegetarian, topped with fresh mozzarella)",
                    category: "Starters",
                    isPopular: false,
                    rating: 4
                },
                { 
                    name: "Buddha Bowl", 
                    price: 15.99, 
                    calories: 450, 
                    allergens: "nuts, soy", 
                    description: "Quinoa, roasted sweet potato, chickpeas, kale, avocado with tahini dressing",
                    category: "Main Course",
                    isPopular: true,
                    rating: 5
                },
                { 
                    name: "Raw Pad Thai", 
                    price: 14.99, 
                    calories: 380, 
                    allergens: "nuts", 
                    description: "Zucchini noodles, carrots, red pepper with spicy almond sauce",
                    category: "Main Course",
                    isPopular: false,
                    rating: 3.5
                },
                { 
                    name: "Mediterranean Wrap", 
                    price: 13.99, 
                    calories: 420, 
                    allergens: "gluten", 
                    description: "Hummus, falafel, mixed greens, tomatoes in whole grain wrap",
                    category: "Main Course",
                    isPopular: true,
                    rating: 4.5
                },
                { 
                    name: "Chocolate Avocado Mousse", 
                    price: 6.99, 
                    calories: 250, 
                    allergens: "nuts", 
                    description: "Rich and creamy mousse made with ripe avocados and cocoa powder.",
                    category: "Desserts",
                    isPopular: true,
                    rating: 4.5
                },
                { 
                    name: "Coconut Chia Pudding", 
                    price: 5.99, 
                    calories: 200, 
                    allergens: "coconut", 
                    description: "Creamy chia pudding topped with fresh fruits and coconut flakes.",
                    category: "Desserts",
                    isPopular: false,
                    rating: 4
                },
                { 
                    name: "Vegan Berry Tart", 
                    price: 7.99, 
                    calories: 300, 
                    allergens: "gluten", 
                    description: "A delicious tart filled with seasonal berries and a nut-based crust.",
                    category: "Desserts",
                    isPopular: true,
                    rating: 5
                }
            ],
            dinner: [
                { 
                    name: "Jackfruit 'Crab' Cakes", 
                    price: 18.99, 
                    calories: 440, 
                    allergens: "gluten", 
                    description: "Seasoned jackfruit cakes with remoulade sauce and microgreens",
                    category: "Starters",
                    isPopular: false,
                    rating: 3.5
                },
                { 
                    name: "Mushroom Tartare", 
                    price: 16.99, 
                    calories: 320, 
                    allergens: "none", 
                    description: "Finely chopped mushrooms with capers, shallots, and herbs",
                    category: "Starters",
                    isPopular: false,
                    rating: 3
                },
                { 
                    name: "Roasted Beet Carpaccio", 
                    price: 15.99, 
                    calories: 280, 
                    allergens: "nuts", 
                    description: "Thinly sliced golden beets with cheese and arugula (Vegetarian, contains cheese)",
                    category: "Starters",
                    isPopular: true,
                    rating: 5
                },
                { 
                    name: "Cauliflower Steak", 
                    price: 21.99, 
                    calories: 380, 
                    allergens: "none", 
                    description: "Grilled cauliflower with chimichurri sauce and roasted vegetables",
                    category: "Main Course",
                    isPopular: false,
                    rating: 4
                },
                { 
                    name: "Wild Mushroom Risotto", 
                    price: 23.99, 
                    calories: 520, 
                    allergens: "none", 
                    description: "Arborio rice with wild mushrooms and truffle oil (Vegetarian, truffle oil contains diary)",
                    category: "Main Course",
                    isPopular: true,
                    rating: 4.5
                },
                { 
                    name: "Thai Green Curry", 
                    price: 19.99, 
                    calories: 460, 
                    allergens: "nuts", 
                    description: "Coconut curry with seasonal vegetables and tofu",
                    category: "Main Course",
                    isPopular: false,
                    rating: 4
                },
                { 
                    name: "Vegan Chocolate Cake", 
                    price: 8.99, 
                    calories: 350, 
                    allergens: "gluten, nuts", 
                    description: "Decadent chocolate cake made with almond flour and topped with vegan frosting.",
                    category: "Desserts",
                    isPopular: true,
                    rating: 4.8
                },
                { 
                    name: "Mango Sorbet", 
                    price: 5.49, 
                    calories: 150, 
                    allergens: "none", 
                    description: "Refreshing mango sorbet made with real mangoes.",
                    category: "Desserts",
                    isPopular: false,
                    rating: 4.2
                },
                { 
                    name: "Raw Vegan Cheesecake", 
                    price: 9.99, 
                    calories: 400, 
                    allergens: "nuts", 
                    description: "Creamy cheesecake made with cashews and topped with a berry compote.",
                    category: "Desserts",
                    isPopular: true,
                    rating: 4.7
                }
            ]
        };

        function showOrderForm() {
            document.querySelector('.reservation-form').style.display = 'none';
            document.querySelector('.order-form').style.display = 'block';
            updateMenu();
        }

        function updateMenu() {
            const now = new Date();
            const hour = now.getHours();
            const minutes = now.getMinutes();
            const menuTitle = document.getElementById('menuTitle');
            const menuItemsContainer = document.getElementById('menuItems');
            
            // Determine menu type based on current time
            const menuType = (hour >= 15) ? 'dinner' : 'lunch';
            
            // Always allow ordering
            const orderingAllowed = true;

            // Set menu title
            menuTitle.textContent = menuType === 'lunch' ? "Lunch Menu" : "Dinner Menu";

            const currentMenu = menuItems[menuType];
            
            // Separate starters and main courses
            const starters = currentMenu.filter(item => item.category === "Starters");
            const mainCourses = currentMenu.filter(item => item.category === "Main Course");

            const menuContent = `
                <div class="menu-toggle-buttons">
                    <button onclick="displayMenu('lunch')" class="menu-toggle-btn ${menuType === 'lunch' ? 'active' : ''}">
                        Lunch
                    </button>
                    <button onclick="displayMenu('dinner')" class="menu-toggle-btn ${menuType === 'dinner' ? 'active' : ''}">
                        Dinner
                    </button>
                </div>
                <div class="menu-sections">
                    <div class="menu-section-column">
                        <div class="menu-category">
                            <h3>Starters</h3>
                            ${starters.map(item => renderMenuItem(item, orderingAllowed)).join('')}
                        </div>
                    </div>
                    <div class="menu-section-column">
                        <div class="menu-category">
                            <h3>Main Courses</h3>
                            ${mainCourses.map(item => renderMenuItem(item, orderingAllowed)).join('')}
                        </div>
                    </div>
                </div>
            `;

            menuItemsContainer.innerHTML = menuContent;
        }

        function displayMenu(menuType) {
            const menuTitle = document.getElementById('menuTitle');
            const menuItemsContainer = document.getElementById('menuItems');
            
            // Always allow ordering
            const orderingAllowed = true;

            // Set menu title
            menuTitle.textContent = menuType === 'lunch' ? "Lunch Menu" : "Dinner Menu";

            const currentMenu = menuItems[menuType];
            
            // Separate starters and main courses
            const starters = currentMenu.filter(item => item.category === "Starters");
            const mainCourses = currentMenu.filter(item => item.category === "Main Course");

            const menuContent = `
                <div class="menu-toggle-buttons">
                    <button onclick="displayMenu('lunch')" class="menu-toggle-btn ${menuType === 'lunch' ? 'active' : ''}">
                        Lunch
                    </button>
                    <button onclick="displayMenu('dinner')" class="menu-toggle-btn ${menuType === 'dinner' ? 'active' : ''}">
                        Dinner
                    </button>
                </div>
                <div class="menu-sections">
                    <div class="menu-section-column">
                        <div class="menu-category">
                            <h3>Starters</h3>
                            ${starters.map(item => renderMenuItem(item, orderingAllowed)).join('')}
                        </div>
                    </div>
                    <div class="menu-section-column">
                        <div class="menu-category">
                            <h3>Main Courses</h3>
                            ${mainCourses.map(item => renderMenuItem(item, orderingAllowed)).join('')}
                        </div>
                    </div>
                </div>
            `;

            menuItemsContainer.innerHTML = menuContent;
        }

        function renderMenuItem(item, orderingAllowed) {
            const quantity = getItemQuantityInCart(item.name);
            const popularClass = item.isPopular ? 'popular-dish' : '';
            const popularBadge = item.isPopular ? '<div class="popular-badge">Popular Choice!</div>' : '';
            
            const escapedName = item.name.replace(/'/g, "\\'");
            
            // Map item names to their corresponding images with correct path
            const imageMap = {
                'Spring Rolls': '/Images/alexandra-tran-UkudQyyeovs-unsplash.jpg',
                'Buddha Bowl': '/Images/anna-pelzer-IGfIGP5ONV0-unsplash.jpg',
                'Miso Soup': '/Images/dan-dealmeida-Qhqj0tcXkbg-unsplash.jpg',
                'Raw Pad Thai': '/Images/7518.jpg',
                'Bruschetta': '/Images/2148698659.jpg',
                'Mediterranean Wrap': '/Images/2149447816.jpg',
                'Jackfruit \'Crab\' Cakes': '/Images/jackfruitcrabcakes.jpg',
                'Cauliflower Steak': '/Images/cauliflowersteak.jpg',
                'Mushroom Tartare': '/Images/mushroomtartare.jpg',
                'Wild Mushroom Risotto': '/Images/MushRoomRisotto.jpg',
                'Roasted Beet Carpaccio': '/Images/RoastedBeetCarpaccio.jpg',
                'Thai Green Curry': '/Images/thaigreencurry.jpg'
            };
            
            const imageSrc = imageMap[item.name];
            const imageHtml = imageSrc ? 
                `<img src="${imageSrc}" alt="${item.name}">` : 
                `<div class="placeholder"><i class="fas fa-utensils fa-3x"></i></div>`;
            
            // Star Rating Logic
            let rating = item.rating || 3.0; // Use the rating from the item, or default to 3.0
            
            // Generate star HTML
            const fullStars = Math.floor(rating);
            const halfStar = rating % 1 !== 0;
            let starHtml = '';
            
            for (let i = 1; i <= fullStars; i++) {
                starHtml += '<span class="star filled">★</span>';
            }
            
            if (halfStar) {
                starHtml += '<span class="star half">½</span>';
            }
            
            return `
                <div class="menu-item ${popularClass}">
                    ${popularBadge}
                    <div class="menu-item-image">
                        ${imageHtml}
                    </div>
                    <div class="menu-item-content">
                        <div class="menu-item-info">
                            <h4>${item.name}</h4>
                            <div class="star-rating">${starHtml}</div>
                            <p>${item.description}</p>
                            <div class="menu-item-details">
                                <p class="price">$${item.price}</p>
                                <p class="calories">${item.calories} calories</p>
                                <p class="allergens">Allergens: ${item.allergens}</p>
                                <!-- Removed the info icon for regular dishes -->
                            </div>
                        </div>
                        <div class="menu-item-actions">
                            <div class="cart-quantity-control ${quantity > 0 ? 'active' : ''}" data-item-name="${escapedName}">
                                <button 
                                    class="quantity-btn decrease-btn" 
                                    onclick="removeFromCart('${escapedName}', this)"
                                    ${quantity <= 0 ? 'disabled' : ''}>
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="cart-quantity">${quantity}</span>
                                <button 
                                    class="quantity-btn increase-btn" 
                                    onclick="addToCart('${escapedName}', ${item.price}, this)"
                                    ${quantity >= 2 ? 'disabled' : ''}>
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function showLunchMenu() {
            const now = new Date();
            const hour = now.getHours();
            if (hour >= 8) {
                document.querySelectorAll('.menu-toggle-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelector('.menu-toggle-btn:first-child').classList.add('active');
                displayMenu('lunch');
            }
        }

        function showDinnerMenu() {
            const now = new Date();
            const hour = now.getHours();
            if (hour >= 15) {
                document.querySelectorAll('.menu-toggle-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelector('.menu-toggle-btn:last-child').classList.add('active');
                displayMenu('dinner');
            }
        }

        function displayMenu(menuType) {
            const menuTitle = document.getElementById('menuTitle');
            const menuItemsContainer = document.getElementById('menuItems');
            
            // Always allow ordering
            const orderingAllowed = true;

            // Set menu title
            menuTitle.textContent = menuType === 'lunch' ? "Lunch Menu" : "Dinner Menu";

            const currentMenu = menuItems[menuType];
            
            // Separate starters and main courses
            const starters = currentMenu.filter(item => item.category === "Starters");
            const mainCourses = currentMenu.filter(item => item.category === "Main Course");

            const menuContent = `
                <div class="menu-toggle-buttons">
                    <button onclick="displayMenu('lunch')" class="menu-toggle-btn ${menuType === 'lunch' ? 'active' : ''}">
                        Lunch
                    </button>
                    <button onclick="displayMenu('dinner')" class="menu-toggle-btn ${menuType === 'dinner' ? 'active' : ''}">
                        Dinner
                    </button>
                </div>
                <div class="menu-sections">
                    <div class="menu-section-column">
                        <div class="menu-category">
                            <h3>Starters</h3>
                            ${starters.map(item => renderMenuItem(item, orderingAllowed)).join('')}
                        </div>
                    </div>
                    <div class="menu-section-column">
                        <div class="menu-category">
                            <h3>Main Courses</h3>
                            ${mainCourses.map(item => renderMenuItem(item, orderingAllowed)).join('')}
                        </div>
                    </div>
                </div>
            `;

            menuItemsContainer.innerHTML = menuContent;
        }

        // Add cart functionality
        let cart = [];

        function getItemQuantityInCart(name) {
            return cart.filter(item => item.name === name).length;
        }

        // Function to show warning message
        function showWarningMessage(message) {
            // Create and style the warning container
            const warningContainer = document.createElement('div');
            warningContainer.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                z-index: 1000;
                text-align: center;
                max-width: 80%;
                width: 400px;
            `;

            // Add the message
            const messageText = document.createElement('p');
            messageText.style.cssText = `
                margin-bottom: 20px;
                color: #e63946;
                font-size: 1.1em;
            `;
            messageText.textContent = message;
            warningContainer.appendChild(messageText);

            // Add OK button
            const okButton = document.createElement('button');
            okButton.textContent = 'OK';
            okButton.style.cssText = `
                background-color: var(--primary-color);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1em;
            `;
            okButton.onclick = () => warningContainer.remove();
            warningContainer.appendChild(okButton);

            document.body.appendChild(warningContainer);
        }

        function addToCart(name, price, button) {
            // Determine if the item being added is from lunch or dinner menu
            const isLunchItem = menuItems.lunch.some(item => item.name === name);
            const isDinnerItem = menuItems.dinner.some(item => item.name === name);

            // Validate the menu type
            if (!isLunchItem && !isDinnerItem) {
                showWarningMessage(`Unable to add ${name} to cart. Menu item not found.`);
                return;
            }

            // Check if the cart is empty or the item's menu type matches the current cart
            const cartMenuType = cart.length > 0 ? 
                (menuItems.lunch.some(item => item.name === cart[0].name) ? 'lunch' : 'dinner') 
                : null;

            const currentMenuType = isLunchItem ? 'lunch' : 'dinner';

            if (cartMenuType !== null && cartMenuType !== currentMenuType) {
                showWarningMessage(`This cart is for dishes from the ${cartMenuType} menu. If you'd like to order from the other menu, please remove the items from your current order, including the free dessert.`);
                return;
            }

            // Check if the item is already in the cart twice
            const quantity = getItemQuantityInCart(name);
            if (quantity >= 2) {
                showWarningMessage(`You can only add up to 2 ${name} to the cart.`);
                return;
            }

            // Add the item to the cart
            if (quantity < 2) {
                cart.push({ name, price });
                updateCartDisplay();
                updateQuantityDisplay(name, button);

                // Show surprise dessert if at least one item is in the cart
                if (cart.length === 1) {
                    const dessert = getRandomDessert(isLunchItem); // Pass the context
                    cart.push(dessert); // Add the randomly selected dessert to the cart
                    updateCartDisplay(); // Update the cart display to reflect the new dessert
                    showSurpriseDessert(); // Show the surprise dessert pop-up
                }

                // Optional: Add a subtle animation to provide visual feedback
                const quantityControl = button.closest('.cart-quantity-control');
                if (quantityControl) {
                    quantityControl.classList.add('pulse');
                    setTimeout(() => {
                        quantityControl.classList.remove('pulse');
                    }, 300);
                }
            }
        }

        function getRandomDessert(isLunch) {
            const lunchDesserts = [
                { 
                    name: "Chocolate Avocado Mousse", 
                    price: 0, // Set price to 0 for the surprise dessert
                    calories: 250, 
                    allergens: "nuts", 
                    description: "Rich and creamy mousse made with ripe avocados and cocoa powder."
                },
                { 
                    name: "Coconut Chia Pudding", 
                    price: 0, // Set price to 0 for the surprise dessert
                    calories: 200, 
                    allergens: "coconut", 
                    description: "Creamy chia pudding topped with fresh fruits and coconut flakes."
                },
                { 
                    name: "Vegan Berry Tart", 
                    price: 0, // Set price to 0 for the surprise dessert
                    calories: 300, 
                    allergens: "gluten", 
                    description: "A delicious tart filled with seasonal berries and a nut-based crust."
                }
            ];

            const dinnerDesserts = [
                { 
                    name: "Vegan Chocolate Cake", 
                    price: 0, // Set price to 0 for the surprise dessert
                    calories: 350, 
                    allergens: "gluten", 
                    description: "Decadent chocolate cake made with rich cocoa and almond flour."
                },
                { 
                    name: "Mango Coconut Sorbet", 
                    price: 0, // Set price to 0 for the surprise dessert
                    calories: 150, 
                    allergens: "coconut", 
                    description: "Refreshing sorbet made with ripe mangoes and coconut milk."
                },
                { 
                    name: "Raw Vegan Cheesecake", 
                    price: 0, // Set price to 0 for the surprise dessert
                    calories: 400, 
                    allergens: "nuts", 
                    description: "Creamy cheesecake made with cashews and topped with berry compote."
                }
            ];

            // Randomly select one dessert based on the meal type
            const desserts = isLunch ? lunchDesserts : dinnerDesserts;
            const randomIndex = Math.floor(Math.random() * desserts.length);
            return {
                name: desserts[randomIndex].name,
                price: desserts[randomIndex].price, // This will now be 0
                calories: desserts[randomIndex].calories,
                allergens: desserts[randomIndex].allergens,
                description: desserts[randomIndex].description,
                category: "Desserts",
                isPopular: true,
                rating: 4.5 // You can adjust this as needed
            };
        }

        // New function to show the surprise dessert pop-up
        function showSurpriseDessert() {
            const dessert = cart[cart.length - 1]; // Get the last added dessert
            const dessertInfo = `
                <div class="dessert-popup">
                    <h3>Surprise! Enjoy a Free Dessert!</h3>
                    <p><strong>${dessert.name}</strong></p>
                    <p>${dessert.description}</p>
                    <p>Allergens: ${dessert.allergens}</p>
                    <p>Calories: ${dessert.calories}</p>
                    <button onclick="this.parentElement.parentElement.remove()">Close</button>
                </div>
            `;
            const popupContainer = document.createElement('div');
            popupContainer.className = 'popup-container';
            popupContainer.innerHTML = dessertInfo;
            document.body.appendChild(popupContainer);
        }

        // Function to show warning message
        function showWarningMessage(message) {
            // Create and style the warning container
            const warningContainer = document.createElement('div');
            warningContainer.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                z-index: 1000;
                text-align: center;
                max-width: 80%;
                width: 400px;
            `;

            // Add the message
            const messageText = document.createElement('p');
            messageText.style.cssText = `
                margin-bottom: 20px;
                color: #e63946;
                font-size: 1.1em;
            `;
            messageText.textContent = message;
            warningContainer.appendChild(messageText);

            // Add OK button
            const okButton = document.createElement('button');
            okButton.textContent = 'OK';
            okButton.style.cssText = `
                background-color: var(--primary-color);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1em;
            `;
            okButton.onclick = () => warningContainer.remove();
            warningContainer.appendChild(okButton);

            document.body.appendChild(warningContainer);
        }

        function removeFromCart(name, button) {
            const index = cart.findIndex(item => item.name === name);
            if (index !== -1) {
                cart.splice(index, 1);
                updateCartDisplay();
                updateQuantityDisplay(name, button);

                // Check if the removed item was the surprise dessert
                if (cart.length === 0 || (cart.length === 1 && cart[0].name === "Surprise Dessert")) {
                    // Remove the surprise dessert if it's the only item left
                    const dessertIndex = cart.findIndex(item => item.name === "Surprise Dessert");
                    if (dessertIndex !== -1) {
                        cart.splice(dessertIndex, 1);
                    }
                }

                // Optional: Add a subtle animation to provide visual feedback
                const quantityControl = button.closest('.cart-quantity-control');
                if (quantityControl) {
                    quantityControl.classList.add('shrink');
                    setTimeout(() => {
                        quantityControl.classList.remove('shrink');
                    }, 300);
                }
            }
        }

        function updateQuantityDisplay(name, button) {
            // Find the cart quantity control container
            const quantityControl = button ? 
                button.closest('.menu-item-actions').querySelector('.cart-quantity-control') : 
                document.querySelector(`.cart-quantity-control[data-item-name="${name}"]`);

            if (!quantityControl) return;

            // Get current quantity
            const quantity = getItemQuantityInCart(name);

            // Update quantity display
            const quantitySpan = quantityControl.querySelector('.cart-quantity');
            quantitySpan.textContent = quantity;

            // Update button states
            const decreaseBtn = quantityControl.querySelector('.decrease-btn');
            const increaseBtn = quantityControl.querySelector('.increase-btn');

            if (decreaseBtn) {
                decreaseBtn.disabled = quantity <= 0;
            }

            if (increaseBtn) {
                increaseBtn.disabled = quantity >= 2;
            }

            // Toggle active class
            quantityControl.classList.toggle('active', quantity > 0);

            // Update cart display
            updateCartDisplay();
        }

        function updateCartDisplay() {
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            const checkoutBtn = document.querySelector('.checkout-btn');
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
                checkoutBtn.disabled = true;
            } else {
                // Group items by name
                const groupedItems = cart.reduce((acc, item) => {
                    if (!acc[item.name]) {
                        acc[item.name] = {
                            name: item.name,
                            price: item.price,
                            quantity: 0
                        };
                    }
                    acc[item.name].quantity++;
                    return acc;
                }, {});

                cartItems.innerHTML = Object.values(groupedItems).map(item => `
                <div class="cart-item">
                        <div class="cart-item-details">
                            <span class="cart-item-name">${item.name} (x${item.quantity})</span>
                        </div>
                        <div class="cart-item-details">
                            <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                            <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                </div>
            `).join('');
                checkoutBtn.disabled = false;
            }
            
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            cartTotal.innerHTML = `
                <div class="cart-total">
                    <span>Total</span>
                    <span class="cart-total-amount">$${total.toFixed(2)}</span>
                </div>
            `;
        }

        function removeFromCartItem(name, button) {
            const index = cart.findIndex(item => item.name === name);
            if (index !== -1) {
                cart.splice(index, 1);
                updateCartDisplay();
                updateQuantityDisplay(name, button);
            }
        }

        function checkout() {
            if (cart.length === 0) {
                alert('Your cart is empty');
                return;
            }
            
            // Group cart items by name and track their quantities
            const cartWithQuantity = cart.reduce((acc, item) => {
                const existingItem = acc.find(i => i.name === item.name);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    acc.push({ 
                        name: item.name, 
                        price: item.price, 
                        quantity: 1 
                    });
                }
                return acc;
            }, []);
            
            // Create and show checkout form
            const checkoutForm = document.createElement('div');
            checkoutForm.className = 'checkout-form';
            checkoutForm.innerHTML = `
                <div class="form-header">
                    <h3>Order Details</h3>
                </div>
                <div class="form-group">
                    <label for="orderName">Name*</label>
                    <input type="text" id="orderName" required>
                </div>
                
                <div class="form-group">
                    <label for="pickupTime">Pickup Time*</label>
                    <select id="pickupTime" required>
                        <option value="">Select pickup time</option>
                    </select>
                </div>
                <button type="button" class="submit-btn" onclick="processOrder()">Place Order</button>
                <button type="button" class="cancel-btn" onclick="returnToReservation()">Cancel</button>
            `;

            // Add styles for the checkout form
            const style = document.createElement('style');
            style.textContent = `
                .checkout-form {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--card-bg);
                    padding: 2rem;
                    border-radius: 15px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    z-index: 1000;
                    width: 90%;
                    max-width: 500px;
                }

                .checkout-form .form-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .checkout-form .form-group {
                    margin-bottom: 1.5rem;
                }

                .checkout-form label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: var(--text-color);
                }

                .checkout-form input,
                .checkout-form select {
                    width: 100%;
                    padding: 0.8rem;
                    border: 2px solid var(--accent-color);
                    border-radius: 8px;
                    font-size: 1rem;
                }

                .checkout-form .submit-btn {
                    width: 100%;
                    margin-bottom: 1rem;
                }

                .checkout-form .cancel-btn {
                    width: 100%;
                    padding: 1rem;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1em;
                }

                .checkout-form .cancel-btn:hover {
                    background: #c0392b;
                }

                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                }
            `;
            document.head.appendChild(style);

            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            document.body.appendChild(overlay);
            document.body.appendChild(checkoutForm);

            // Populate pickup times
            populatePickupTimes();
        }

        function populatePickupTimes() {
            const pickupTimeSelect = document.getElementById('pickupTime');
            
            // Clear existing options
            pickupTimeSelect.innerHTML = '';
            
            // Generate time slots for today and tomorrow
            const now = new Date();
            const today = new Date(now);
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);

            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select pickup time';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            pickupTimeSelect.appendChild(defaultOption);

            // Function to format time for display
            const formatTime = (hour, minute) => {
                return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            };

            // Function to check if a time slot is valid (not in the past)
            const isValidTimeSlot = (slotDate, hour, minute) => {
                const slotTime = new Date(slotDate);
                slotTime.setHours(hour, minute, 0, 0);
                const currentTime = new Date(now.getTime() + 30 * 60000);
                return slotTime > currentTime;
            };

            // Add lunch slots (11 AM to 3 PM)
            const addLunchSlots = (forDate) => {
                // Determine the lunch time window
                const lunchStartHour = 11;
                const lunchEndHour = 14;
                const lunchEndMinute = 30;

                for (let hour = lunchStartHour; hour <= lunchEndHour; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        // Stop at 2:45 PM for last reservation
                        if (hour === lunchEndHour && minute > 45) continue;
                        
                        // Create the time slot
                        const timeString = formatTime(hour, minute);
                        const dateString = forDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                        
                        // Check if this slot is valid based on current time
                        const slotTime = new Date(forDate);
                        slotTime.setHours(hour, minute, 0, 0);
                        const currentTime = new Date(now.getTime());
                        
                        // For today's date, apply stricter time validation
                        if (forDate.toDateString() === today.toDateString()) {
                            // Only show slots that are in the future
                            if (slotTime <= currentTime) continue;
                            
                            // Ensure we're within lunch hours or just after
                            const currentHour = currentTime.getHours();
                            const currentMinute = currentTime.getMinutes();
                            
                            // If current time is past 2:30 PM, only show next day's lunch slots
                            if (currentHour > lunchEndHour || 
                                (currentHour === lunchEndHour && currentMinute > lunchEndMinute)) {
                                continue;
                            }
                        }
                        
                        // Add the time slot
                        pickupTimeSelect.add(new Option(`${timeString} (Lunch - ${dateString})`, `${forDate.toISOString().split('T')[0]} ${timeString}`));
                    }
                }
            };

            // Add dinner slots (5 PM to 10:30 PM)
            const addDinnerSlots = (forDate) => {
                for (let hour = 17; hour <= 22; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        // Stop at 10:30 PM for last reservation
                        if (hour === 22 && minute > 45) continue;
                        
                        // Skip invalid time slots
                        if (!isValidTimeSlot(forDate, hour, minute)) continue;
                        
                        const timeString = formatTime(hour, minute);
                        const dateString = forDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                        pickupTimeSelect.add(new Option(`${timeString} (Dinner - ${dateString})`, `${forDate.toISOString().split('T')[0]} ${timeString}`));
                    }
                }
            };

            // Determine if cart has lunch or dinner items
            const hasLunchItems = cart.some(item => menuItems.lunch.some(menuItem => menuItem.name === item.name));
            const hasDinnerItems = cart.some(item => menuItems.dinner.some(menuItem => menuItem.name === item.name));

            // Show pickup times based on cart items
            if (hasLunchItems) {
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();

                // For lunch menu, only show today's lunch slots before 3 PM and tomorrow's slots after 3 PM
                if (currentHour < 15) {
                    // Show today's lunch slots
                    addLunchSlots(today);
                } else {
                    // Show tomorrow's lunch slots
                    addLunchSlots(tomorrow);
                }
            } else if (hasDinnerItems) {
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();

                // For dinner menu
                const todaySlots = new Date(now);

                // If it's before 10:45 PM, show today's remaining slots
                if (currentHour < 22 || (currentHour === 22 && now.getMinutes() <= 45)) {
                    // Calculate the next 30-minute slot
                    let nextSlotMinute = Math.ceil(currentMinute / 30) * 30;
                    let nextSlotHour = currentHour;
                    if (nextSlotMinute === 60) {
                        nextSlotMinute = 0;
                        nextSlotHour++;
                    }

                    // Add today's slots
                    for (let hour = nextSlotHour; hour <= 22; hour++) {
                        for (let minute = (hour === nextSlotHour ? nextSlotMinute : 0); minute < 60; minute += 30) {
                            // Stop at 10:30 PM
                            if (hour === 22 && minute > 45) continue;
                            
                            // Skip if it's too early
                            if (hour < 17) continue;
                            
                            const timeString = formatTime(hour, minute);
                            const dateString = todaySlots.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                            pickupTimeSelect.add(new Option(`${timeString} (Dinner - ${dateString})`, `${todaySlots.toISOString().split('T')[0]} ${timeString}`));
                        }
                    }
                }

                // Show tomorrow's dinner slots if it's after 10:45 PM
                if (currentHour === 22 && currentMinute > 45 || currentHour > 22) {
                    // Add tomorrow's dinner slots
                    for (let hour = 17; hour <= 22; hour++) {
                        for (let minute = 0; minute < 60; minute += 30) {
                            // Stop at 10:45 PM
                            if (hour === 22 && minute > 45) continue;
                            
                            const timeString = formatTime(hour, minute);
                            const dateString = tomorrow.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                            pickupTimeSelect.add(new Option(`${timeString} (Dinner - ${dateString})`, `${tomorrow.toISOString().split('T')[0]} ${timeString}`));
                        }
                    }
                }
            }

            // If no valid pickup times are available, show a message
            if (pickupTimeSelect.options.length === 1) { // Only the default option
                pickupTimeSelect.innerHTML = '<option value="">No available pickup times</option>';
            }

            // If no time slots are available
            if (pickupTimeSelect.options.length === 1) {
                pickupTimeSelect.innerHTML = '<option value="">No available pickup times</option>';
                pickupTimeSelect.disabled = true;
            } else {
                pickupTimeSelect.disabled = false;
            }
        }

        function processOrder() {
            const orderName = document.getElementById('orderName').value;
            const pickupTime = document.getElementById('pickupTime').value;
            
            if (!orderName.trim()) {
                alert('Please enter your name');
                return;
            }
            
            if (!pickupTime) {
                alert('Please select a pickup time');
                return;
            }
            
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            alert(`Order placed successfully!\n\nName: ${orderName}\nPickup Time: ${pickupTime}\nTotal: $${total.toFixed(2)}\n\nThank you for your order!`);
            
            cart = [];
            updateCartDisplay();
            
            // Reset all quantity displays to 0
            const quantityDisplays = document.querySelectorAll('.quantity-display');
            quantityDisplays.forEach(display => {
                display.textContent = '0';
            });
            
            // Reset all quantity control buttons
            const quantityControls = document.querySelectorAll('.cart-quantity-control');
            quantityControls.forEach(control => {
                const decreaseBtn = control.querySelector('.decrease-btn');
                const increaseBtn = control.querySelector('.increase-btn');
                const cartQuantity = control.querySelector('.cart-quantity');
                
                cartQuantity.textContent = '0';
                control.classList.remove('active');
                decreaseBtn.disabled = true;
                increaseBtn.disabled = false;
            });
            
            returnToReservation();
        }

        // Update the processContents array with simplified content
        const processContents = [
            {
                description: "The new technology of harvesting that we are using has a remarkable 40% increase in farm efficiency compared to older models, also complemented by GPS precision cutting crop damage up to 25%. Our drip irrigation is 50% better at waste reduction and efficient compared to older sprinkler systems. The integration of robotics technology with sophisticated sensors enables location-specific management of the crops and hence enhances different aspects such as water and fertilizer applications. Such precision agriculture technologies increase our yield of greater quantities of food while minimizing the use of resources, lowering our environmental impact while, simultaneously, increasing the quality and quantity of agricultural yields."
            },
            {
                description: "Our farm-to-table approach goes beyond sustainable agriculture. We believe in celebrating the incredible work of our local farmers. Buying directly from them means we have first pick of the freshest and best of whatever they grow. This not only serves us well in serving great food but also enables livelihoods, which strengthen our community. We're proud to work hand in hand with the dedicated people who invest their heart and soul into the cultivation of land."
            },
            {
                description: "Our kitchen is designed to be highly efficient and sustainable. We use cooking techniques like sous-vide, which uses 50% less energy than traditional cooking. Our 84% efficient induction stoves mean a lot less energy is wasted. Our precision plating techniques reduce food waste by 40% compared to traditional restaurant serving methods. Each and every culinary component is apportioned and positioned to visually ensure optimum utilisation of ingredients, least amount of waste, and a presentable meal that looks appealing yet sustainable and delectable. In optimizing portion and visual presentation, we make sure every component has a purpose for being there; this results in little waste while optimizing flavor in addition to the visual appeal it creates."
            },
            {
                description: "Our restaurant employs green utensils which are a core component of our effort to mitigate environmental effects. Our kitchen has created a system that employs 100% biodegradable utensils made of plant-based material that degrade within 180 days, as opposed to the normal plastic utensils that take a maximum of 450 years to degrade. Green alternatives save an estimated 90% or more on non-renewable energy use and reduce greenhouse gas emissions by an estimated 70% or more compared to traditional disposable tableware."
            },
            {
                description: "Our restaurant is committed to the use of innovative green technology by protecting the environment. It exclusively runs on renewable energy from its sophisticated solar and wind power system that greatly offsets carbon footprint. We designed an innovative open-air dining concept while having very efficient air conditioning systems for super hot summers that minimize energy use. We estimate to have achieved more than 70% fewer emissions compared to traditional restaurants. In the end, what we want to show the world is that remarkable food and a sustainable environment can go along together."
            }
        ];

        // Update the showProcessContent function
        function showProcessContent(index) {
            const steps = document.querySelectorAll('.step');
            const buttons = document.querySelectorAll('.process-button');
            const mobileOptions = document.querySelectorAll('.process-option');
            const content = document.querySelector('.process-content');
            const contentInner = content.querySelector('.content-inner');
            
            // Update active states for desktop buttons
            buttons.forEach((button, i) => {
                if (i === index) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });

            // Update active states for mobile options
            mobileOptions.forEach((option, i) => {
                if (i === index) {
                    option.classList.add('active');
                    option.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                } else {
                    option.classList.remove('active');
                }
            });

            // Update content
            content.classList.remove('active');
            setTimeout(() => {
                const processData = processContents[index];
                contentInner.innerHTML = `
                    <p>${processData.description}</p>
                `;
                content.classList.add('active');
            }, 300);
        }

        // Initialize the first process content
        document.addEventListener('DOMContentLoaded', () => {
            showProcessContent(0);
        });

        // Update the moveCarousel function
        function moveCarousel(direction) {
            currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
            showProcessContent(currentSlide);
        }

        // Add touch support for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;

        document.querySelector('.process-steps').addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        document.querySelector('.process-steps').addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        function handleSwipe() {
            const swipeThreshold = 50;
            const difference = touchStartX - touchEndX;
            
            if (Math.abs(difference) > swipeThreshold) {
                if (difference > 0) {
                    // Swipe left
                    moveCarousel(1);
                } else {
                    // Swipe right
                    moveCarousel(-1);
                }
            }
        }

        //? Dynamic Scrolling animations

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                console.log(entry)
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
                // * Makes animations repeat
                else {
                    entry.target.classList.remove('show');
                }
            })
        })

        const hiddenElements = document.querySelectorAll('.hidden');
        hiddenElements.forEach((el) => observer.observe(el));

        document.addEventListener('DOMContentLoaded', function() {
            const homeLink = document.querySelector('.nav-links a[href="#home"]');
            
            // Check if the current page is the home page
            if (window.location.hash === '#home' || window.location.pathname === '/') {
                homeLink.classList.add('active'); // Keep underline if on home page
            } else {
                homeLink.classList.remove('active'); // Remove underline if not on home page
            }
        });

        // Menu item images
        const imageMap = {
            'Spring Rolls': '/Images/alexandra-tran-UkudQyyeovs-unsplash.jpg',
            'Buddha Bowl': '/Images/anna-pelzer-IGfIGP5ONV0-unsplash.jpg',
            'Miso Soup': '/Images/dan-dealmeida-Qhqj0tcXkbg-unsplash.jpg',
            'Raw Pad Thai': '/Images/7518.jpg',
            'Bruschetta': '/Images/2148698659.jpg',
            'Mediterranean Wrap': '/Images/2149447816.jpg',
            'Jackfruit \'Crab\' Cakes': '/Images/jackfruitcrabcakes.jpg',
            'Cauliflower Steak': '/Images/cauliflowersteak.jpg',
            'Mushroom Tartare': '/Images/mushroomtartare.jpg',
            'Wild Mushroom Risotto': '/Images/MushRoomRisotto.jpg',
            'Roasted Beet Carpaccio': '/Images/RoastedBeetCarpaccio.jpg',
            'Thai Green Curry': '/Images/thaigreencurry.jpg'
        };
        
        // Reset item quantities after checkout
        function checkout() {
            // Existing checkout code
            if (cart.length === 0) {
                alert('Your cart is empty');
                return;
            }
            
            // Group cart items by name and track their quantities
            const cartWithQuantity = cart.reduce((acc, item) => {
                const existingItem = acc.find(i => i.name === item.name);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    acc.push({ 
                        name: item.name, 
                        price: item.price, 
                        quantity: 1 
                    });
                }
                return acc;
            }, []);
            
            // Create and show checkout form
            const checkoutForm = document.createElement('div');
            checkoutForm.className = 'checkout-form';
            checkoutForm.innerHTML = `
                <div class="form-header">
                    <h3>Order Details</h3>
                </div>
                <div class="form-group">
                    <label for="orderName">Name*</label>
                    <input type="text" id="orderName" required>
                </div>
                
                <div class="form-group">
                    <label for="pickupTime">Pickup Time*</label>
                    <select id="pickupTime" required>
                        <option value="">Select pickup time</option>
                    </select>
                </div>
                <button type="button" class="submit-btn" onclick="processOrder()">Place Order</button>
                <button type="button" class="cancel-btn" onclick="returnToReservation()">Cancel</button>
            `;

            // Add styles for the checkout form
            const style = document.createElement('style');
            style.textContent = `
                .checkout-form {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--card-bg);
                    padding: 2rem;
                    border-radius: 15px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    z-index: 1000;
                    width: 90%;
                    max-width: 500px;
                }

                .checkout-form .form-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .checkout-form .form-group {
                    margin-bottom: 1.5rem;
                }

                .checkout-form label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: var(--text-color);
                }

                .checkout-form input,
                .checkout-form select {
                    width: 100%;
                    padding: 0.8rem;
                    border: 2px solid var(--accent-color);
                    border-radius: 8px;
                    font-size: 1rem;
                }

                .checkout-form .submit-btn {
                    width: 100%;
                    margin-bottom: 1rem;
                }

                .checkout-form .cancel-btn {
                    width: 100%;
                    padding: 1rem;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1em;
                }

                .checkout-form .cancel-btn:hover {
                    background: #c0392b;
                }

                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                }
            `;
            document.head.appendChild(style);

            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            document.body.appendChild(overlay);
            document.body.appendChild(checkoutForm);

            // Populate pickup times
            populatePickupTimes();
        }

        function returnToReservation() {
            const checkoutForm = document.querySelector('.checkout-form');
            const overlay = document.querySelector('.overlay');
            
            if (checkoutForm) {
                document.body.removeChild(checkoutForm);
            }
            
            if (overlay) {
                document.body.removeChild(overlay);
            }
            
            // Scroll to the reservation section without resetting the cart
            showSection('reservation');
            
            // Close hamburger menu if it's open
            const navLinks = document.querySelector('.nav-links');
            const menuToggle = document.querySelector('.menu-toggle');
            if (navLinks && menuToggle) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }

        // Services Section Functions
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize services section
            initializeServices();
            
            // Set up meal plan selection
            setupMealPlans();
            
            // Set up farm cards
            setupFarmCards();
            
            // Set up food generator
            setupFoodGenerator();
            
            // Set up notification form
            setupNotificationForm();
        });

        // Backup initialization in case DOMContentLoaded doesn't fire properly
        window.onload = function() {
            // Check if services grid is visible
            const servicesGrid = document.querySelector('.services-grid');
            if (servicesGrid && window.getComputedStyle(servicesGrid).display === 'none') {
                initializeServices();
            }
        };

        function initializeServices() {
            // Show the services grid by default
            const servicesGrid = document.querySelector('.services-grid');
            if (servicesGrid) {
                servicesGrid.style.display = 'grid';
            }
            
            // Hide the service content container by default
            const serviceContentContainer = document.querySelector('.service-content-container');
            if (serviceContentContainer) {
                serviceContentContainer.style.display = 'none';
            }
            
            // Hide all service contents
            const serviceContents = document.querySelectorAll('.service-content');
            serviceContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Add click event listeners to service cards
            const serviceCards = document.querySelectorAll('.service-card');
            serviceCards.forEach(card => {
                // The onclick attribute is already set in the HTML
                // This is just for additional functionality if needed
                card.addEventListener('click', function() {
                    const onclickAttr = this.getAttribute('onclick');
                    if (onclickAttr) {
                        // The onclick attribute is in the format: showServiceContent('service-id')
                        // We don't need to add another event listener as it's handled by the inline onclick
                    }
                });
            });
        }

        function showServiceContent(serviceId) {
            // Hide all service contents
            const serviceContents = document.querySelectorAll('.service-content');
            serviceContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show the selected service content
            const selectedContent = document.getElementById(serviceId);
            if (selectedContent) {
                selectedContent.style.display = 'block';
                
                // Hide the services grid
                document.querySelector('.services-grid').style.display = 'none';
                
                // Show the service content container
                document.querySelector('.service-content-container').style.display = 'block';
                
                // Scroll to the content
                selectedContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Update active state on service cards
            const serviceCards = document.querySelectorAll('.service-card');
            serviceCards.forEach(card => {
                card.classList.remove('active');
                if (card.getAttribute('onclick').includes(serviceId)) {
                    card.classList.add('active');
                }
            });
        }

        function hideServiceContent() {
            // Hide the service content container
            document.querySelector('.service-content-container').style.display = 'none';
            
            // Show the services grid
            document.querySelector('.services-grid').style.display = 'grid';
            
            // Scroll to the services section
            document.querySelector('.services-grid').scrollIntoView({ behavior: 'smooth' });
        }

        function setupMealPlans() {
            // Add click event listeners to meal plan buttons
            const mealPlanButtons = document.querySelectorAll('.meal-plan-btn');
            mealPlanButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const planName = this.closest('.meal-plan').querySelector('h4').textContent;
                    alert(`Thank you for selecting the ${planName} plan! We'll contact you shortly with more details.`);
                });
            });
        }

        function setupFarmCards() {
            // Add click event listeners to farm buttons
            const farmButtons = document.querySelectorAll('.farm-btn');
            farmButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const farmName = this.closest('.farm-card').querySelector('h4').textContent;
                    alert(`You'll be redirected to more information about ${farmName} soon!`);
                });
            });
        }

        function setupFoodGenerator() {
            // Add click event listener to generator button
            const generatorButton = document.querySelector('.generator-btn');
            if (generatorButton) {
                generatorButton.addEventListener('click', generateMeal);
            }
        }

        function generateMeal() {
            // Get form values
            const dietaryPreference = document.getElementById('dietary-preference')?.value || 'all';
            const mealType = document.getElementById('meal-type')?.value || 'lunch';
            const calories = document.getElementById('calories')?.value || '500-700';
            const cuisine = document.getElementById('cuisine')?.value || 'mediterranean';
            const ingredients = document.getElementById('ingredients')?.value || '';
            
            // Sample meal suggestions based on selections
            const mealSuggestions = {
                breakfast: [
                    "Avocado Toast with Microgreens",
                    "Acai Bowl with Fresh Berries",
                    "Tofu Scramble with Vegetables",
                    "Overnight Oats with Chia Seeds",
                    "Quinoa Breakfast Bowl"
                ],
                lunch: [
                    "Mediterranean Chickpea Salad",
                    "Lentil and Vegetable Soup",
                    "Buddha Bowl with Tahini Dressing",
                    "Tempeh Wrap with Avocado",
                    "Roasted Vegetable Grain Bowl"
                ],
                dinner: [
                    "Mushroom Risotto with Truffle Oil",
                    "Vegetable Curry with Basmati Rice",
                    "Lentil Bolognese with Zucchini Noodles",
                    "Stuffed Bell Peppers with Quinoa",
                    "Eggplant Parmesan with Side Salad"
                ],
                snack: [
                    "Hummus with Vegetable Sticks",
                    "Trail Mix with Dried Fruits",
                    "Roasted Chickpeas",
                    "Avocado and Tomato on Rice Cakes",
                    "Fruit Smoothie with Plant Protein"
                ],
                dessert: [
                    "Coconut Milk Chia Pudding",
                    "Vegan Chocolate Mousse",
                    "Berry Crumble with Oat Topping",
                    "Banana Nice Cream",
                    "Avocado Chocolate Truffles"
                ]
            };
            
            // Get a random meal suggestion based on meal type
            const suggestions = mealSuggestions[mealType] || mealSuggestions.lunch;
            const randomIndex = Math.floor(Math.random() * suggestions.length);
            const mealSuggestion = suggestions[randomIndex];
            
            // Create a description based on the selections
            let description = `Your personalized ${mealType} is a ${cuisine}-inspired ${dietaryPreference} dish: <strong>${mealSuggestion}</strong>. `;
            description += `This meal contains approximately ${calories.replace('-', ' to ')} calories and is prepared with seasonal, locally-sourced ingredients`;
            
            if (ingredients) {
                description += `, including your favorite ingredients: ${ingredients}`;
            }
            description += '.';
            
            // Add nutritional benefits
            description += `<br><br><strong>Nutritional Benefits:</strong><br>• Rich in plant-based proteins<br>• High in fiber<br>• Contains essential vitamins and minerals<br>• Low in saturated fat`;
            
            // Add sustainability impact
            description += `<br><br><strong>Sustainability Impact:</strong><br>• 80% lower carbon footprint than equivalent animal-based meal<br>• Supports local farmers<br>• Uses seasonal ingredients to reduce transportation emissions`;
            
            // Display the result
            const resultContainer = document.querySelector('.generator-result');
            if (resultContainer) {
                resultContainer.innerHTML = `
                    <h4>Your Custom Meal</h4>
                    <div class="meal-result">
                        <p>${description}</p>
                        <button class="order-meal-btn">Order This Meal</button>
                    </div>
                `;
                
                // Add click event listener to the order button
                const orderButton = document.querySelector('.order-meal-btn');
                if (orderButton) {
                    orderButton.addEventListener('click', function() {
                        alert(`Thank you for ordering ${mealSuggestion}! Your meal will be prepared with care using sustainable ingredients.`);
                    });
                }
            } else {
                console.error('Generator result container not found');
            }
        }

        function setupNotificationForm() {
            // Add submit event listener to notification form
            const notificationForm = document.querySelector('.notification-form');
            if (notificationForm) {
                notificationForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    const emailInput = this.querySelector('input[type="email"]');
                    if (emailInput) {
                        const email = emailInput.value;
                        alert(`Thank you! We'll notify ${email} when our virtual tour is available.`);
                        this.reset();
                    } else {
                        alert('Thank you for your interest! We\'ll notify you when our virtual tour is available.');
                    }
                });
            } else {
                console.error('Notification form not found');
            }
        }

        // ... existing code ...

        // Meal Plans Mobile Carousel
        document.addEventListener('DOMContentLoaded', function() {
            const mealPlansGrid = document.querySelector('.meal-plans-grid');
            const paginationDots = document.querySelectorAll('.pagination-dot');
            if (!mealPlansGrid) return;

            let startX;
            let scrollLeft;
            let isDown;

            // Function to check if device is mobile
            function isMobileView() {
                return window.innerWidth <= 768;
            }

            // Update active dot based on scroll position
            function updateActiveDot() {
                if (!isMobileView()) return; // Only update dots in mobile view
                
                const mealPlan = document.querySelector('.meal-plan');
                const mealPlanWidth = mealPlan.offsetWidth + 20; // Width + gap
                const scrollPosition = mealPlansGrid.scrollLeft;
                const activeIndex = Math.round(scrollPosition / mealPlanWidth);

                paginationDots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === activeIndex);
                });
            }

            // Handle dot click
            paginationDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    if (!isMobileView()) return; // Only handle clicks in mobile view
                    
                    const mealPlan = document.querySelector('.meal-plan');
                    const mealPlanWidth = mealPlan.offsetWidth + 20;
                    mealPlansGrid.scrollTo({
                        left: index * mealPlanWidth,
                        behavior: 'smooth'
                    });
                });
            });

            // Touch events - only for mobile view
            mealPlansGrid.addEventListener('touchstart', (e) => {
                if (!isMobileView()) return;
                
                isDown = true;
                startX = e.touches[0].pageX - mealPlansGrid.offsetLeft;
                scrollLeft = mealPlansGrid.scrollLeft;
            });

            mealPlansGrid.addEventListener('touchend', () => {
                if (!isMobileView()) return;
                
                isDown = false;
                // Snap to nearest meal plan
                const mealPlan = document.querySelector('.meal-plan');
                const mealPlanWidth = mealPlan.offsetWidth + 20;
                const scrollPosition = mealPlansGrid.scrollLeft;
                const nearestMealPlan = Math.round(scrollPosition / mealPlanWidth) * mealPlanWidth;
                
                mealPlansGrid.scrollTo({
                    left: nearestMealPlan,
                    behavior: 'smooth'
                });
                updateActiveDot();
            });

            mealPlansGrid.addEventListener('touchmove', (e) => {
                if (!isMobileView() || !isDown) return;
                
                e.preventDefault();
                const x = e.touches[0].pageX - mealPlansGrid.offsetLeft;
                const walk = (x - startX) * 2;
                mealPlansGrid.scrollLeft = scrollLeft - walk;
            });

            // Update active dot on scroll
            mealPlansGrid.addEventListener('scroll', () => {
                if (isMobileView()) {
                    requestAnimationFrame(updateActiveDot);
                }
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                if (!isMobileView()) {
                    // Reset scroll position when switching to tablet/desktop view
                    mealPlansGrid.scrollLeft = 0;
                }
            });
        });

        // ... existing code ...
