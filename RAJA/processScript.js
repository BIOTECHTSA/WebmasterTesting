//? Smooth Scrolling with Lenis

// Initialize Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2.5, // Better touch sensitivity
    wheelMultiplier: 1.5 // Better wheel sensitivity
});

lenis.on('scroll', (e) => {
    // console.log(e); // Commented out to reduce console spam
});

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

//? Animations for the process page using gsap and scrolltrigger

gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger plugin

const TOGGLE_MARKERS = false; //^ Toggle markers for debugging
//^ Enum for image size
const ImageSize = {
    WIDTH: 150,
    HEIGHT: 150
};

//^ Constants for opacity DONT CHANGE
const OPAQUE = 1;
const INVISIBLE = 0;

/*
& imageCollageEntries
& Makes the collage of images at the top of the page enter with scroll and pin until animation is done
~@class: titleSection-imageCollage-image
*/

const imageCollageEntries = document.querySelectorAll('.titleSection-imageCollage-image');

//* Shuffle the images to make them appear randomly
const shuffledEntries = Array.from(imageCollageEntries).sort(() => 0.5 - Math.random());

//* Gets the width and height of the collage and calculates the number of images needed

const collage = document.querySelector('.titleSection-imageCollage');
const collageWidth = collage.offsetWidth;
const collageHeight = collage.offsetHeight;

const imagesPerRow = Math.ceil(collageWidth / ImageSize.WIDTH);
const rows = Math.ceil(collageHeight / ImageSize.HEIGHT);
const totalImagesNeeded = imagesPerRow * rows;

function adjustImageCollage() {
    // Show only the required number of images
    shuffledEntries.slice(0, totalImagesNeeded).forEach(image => {
        image.style.display = 'block';
        image.style.width = `${ImageSize.WIDTH}px`;
        image.style.height = `${ImageSize.HEIGHT}px`;
    });
}

// Adjust the image collage on load and resize
window.addEventListener('load', adjustImageCollage);
window.addEventListener('resize', adjustImageCollage);

shuffledEntries.forEach((imageCollageEntry, index) => {
    gsap.fromTo(imageCollageEntry, 
        {
            opacity: INVISIBLE,
        },
        {
            opacity: OPAQUE,
            duration: 10,
            scrollTrigger: {
                trigger: '.titleSection-headerContainer-trigger',
                start: `top ${-1 - index * 1}%`, // Adjust start position for each image
                end: `top ${50 - index * 10}%`, // Adjust end position for each image
                scrub: true,
                markers: TOGGLE_MARKERS,
                toggleActions: 'play none none reverse',
            },
        },
    );
});

//* Locks the title section while scrolling
ScrollTrigger.create({
    trigger: '.titleSection',
    start: 'top top',
    end: () => `+=${imageCollageEntries.length * totalImagesNeeded}`, // Adjust end based on number of images
    pin: '.titleSection',
    pinSpacing: true,
    markers: false,
});

/*
& Swipe Right Section
& Makes the farm to table slideshow change scroll axis
~@class: swipeRightSection, swipeRightSection-pane
*/

const sections = gsap.utils.toArray('.swipeRightSection-pane');
const totalWidth = sections.reduce((acc, section) => {
    return acc + (section.classList.contains('swipeRightSection-dividerPane') ? window.innerWidth * 0.2 : window.innerWidth * 0.8);
}, 0);

// Calculate total width without any extra space
const lastFarmIndex = sections.findIndex(section => 
    section.querySelector('h1') && section.querySelector('h1').textContent === 'WinterFrost Details'
);

// Determine actual content width to limit scrolling
const actualContentWidth = sections.slice(0, lastFarmIndex + 1).reduce((acc, section) => {
    return acc + (section.classList.contains('swipeRightSection-dividerPane') ? window.innerWidth * 0.2 : window.innerWidth * 0.8);
}, 0);

// Create a timeline for the horizontal scroll
const scrollTween = gsap.to(sections, {
  x: -actualContentWidth + window.innerWidth,
  ease: "none",
  scrollTrigger: {
    trigger: ".swipeRightSection",
    pin: true,
    pinSpacing: true,
    scrub: 1, // Smoother scrubbing for better progress bar animation
    markers: TOGGLE_MARKERS,
    end: () => "+=" + (actualContentWidth - window.innerWidth),
  }
});



// Enable touch events for mobile scrolling
const swipeSection = document.querySelector('.swipeRightSection');
let startX, startScrollLeft;

// Touch start event
swipeSection.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    startScrollLeft = window.scrollY;
}, { passive: true });

// Touch move event
swipeSection.addEventListener('touchmove', (e) => {
    if (!startX) return;
    
    // Prevent default only if horizontal scroll is detected
    const touchDeltaX = startX - e.touches[0].pageX;
    if (Math.abs(touchDeltaX) > 10) {
        e.preventDefault();
    }
}, { passive: false });

// Detect mobile devices for better touch handling
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Adjust touch sensitivity for mobile devices
if (isMobileDevice()) {
    lenis.options.touchMultiplier = 3;
}

/*
& Progress Bar
& makes the progress bar fill the container as the user scrolls
~@class: progressBar
*/

const progressBar = document.querySelector('.swipeRightSection-progressBar-fill');

gsap.fromTo(progressBar, 
    {
        width: '0vw',
    },
    {
        width: '100vw',
        scrollTrigger: {
            trigger: '.swipeRightSection',
            start: 'top top',
            scrub: true,
            markers: TOGGLE_MARKERS,
            toggleActions: 'play none none reverse',
			end: () => "+=" + (totalWidth - window.innerWidth)
        },
    },
);

const progressContainer = document.querySelector('.swipeRightSection-progressBar');
gsap.fromTo(progressContainer, 
    {
        y: -100,
        opacity: INVISIBLE,
    },
    {
        y: 0,
        opacity: OPAQUE,
        duration: .2,
        scrollTrigger: {
            trigger: '.swipeRightSection',
            start: 'top top',
            scrub: false,
            markers: TOGGLE_MARKERS,
            toggleActions: 'play none none reverse',
        },
    },
);

/*
& Heading Right Entry
& Makes anything in the heading-right-entry class move from right to left when entering
~@class: heading-right-entry, journey-heading
*/

const headingElements = document.querySelectorAll('.heading-right-entry, .journey-heading');

headingElements.forEach((headingElement) => {
    const textLength = headingElement.innerHTML.length - 1;
    const text = new SplitType(headingElement, { types: 'chars' });
    
    gsap.fromTo(text.chars, 
        {
            x: 100 * textLength,
        },
        {
            x: -350 * textLength,
            scrollTrigger: {
                trigger: headingElement,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: true,
                markers: false,
                toggleActions: 'play play reverse reverse',
            },
            duration: 10000000,
            stagger: 0.1,
        }
    );
});

/*
& Journey Timeline Animation
& Makes the journey timeline items appear with scroll
~@class: journey-item
*/

const journeyItems = document.querySelectorAll('.journey-item');

const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px"
};

const journeyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

journeyItems.forEach(item => {
    journeyObserver.observe(item);
});

