//? Smooth Scrolling with Lenis

// Initialize Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
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

// Set initial opacity to 0 for all images
shuffledEntries.forEach(image => {
    gsap.set(image, { opacity: INVISIBLE });
});

// Animate each image to fade in as user scrolls
shuffledEntries.forEach((imageCollageEntry, index) => {
    gsap.fromTo(imageCollageEntry, 
        {
            opacity: INVISIBLE,
        },
        {
            opacity: OPAQUE,
            duration: 0.5,
            scrollTrigger: {
                trigger: '.titleSection',
                start: `top ${-1 - index * 0.5}%`, // Adjust start position for each image
                end: `top ${50 - index * 5}%`, // Adjust end position for each image
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
    end: () => `+=${imageCollageEntries.length * 2}`, // Increased for longer animation
    pin: '.titleSection',
    pinSpacing: true,
    markers: TOGGLE_MARKERS,
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

// Count the number of sections up to the Achievements section
const achievementSectionIndex = sections.findIndex(section => 
    section.querySelector('h1') && section.querySelector('h1').textContent === 'Achievements'
);

// Create a timeline for the horizontal scroll
const scrollTween = gsap.to(sections, {
  x: -totalWidth + window.innerWidth,
  ease: "none",
  scrollTrigger: {
    trigger: ".swipeRightSection",
    pin: true,
    pinSpacing: true,
    scrub: 1, // Smoother scrubbing for better progress bar animation
    markers: TOGGLE_MARKERS,
    end: () => "+=" + (totalWidth - window.innerWidth),
    onUpdate: (self) => {
      // Update progress bar width based on scroll progress
      // Calculate progress relative to the Achievements section
      const progressBar = document.getElementById('progressBar');
      if (progressBar) {
        // Calculate the position of the Achievements section
        const achievementPosition = (achievementSectionIndex + 1) / sections.length;
        
        // Scale the progress to reach 100% at the Achievements section
        let scaledProgress = self.progress / achievementPosition;
        
        // Cap at 100% when we reach the Achievements section
        if (scaledProgress > 1) {
          scaledProgress = 1;
        }
        
        progressBar.style.width = `${scaledProgress * 100}%`;
      }
    }
  }
});

/*
& Heading Right Entry
& Makes anything in the heading-right-entry class move from right to left when entering
~@class: heading-right-entry
*/

const headingRightEntrys = document.querySelectorAll('.heading-right-entry');

headingRightEntrys.forEach((headingRightEntry) => {
    const textLength = headingRightEntry.innerHTML.length - 1; //* Get the length of the text
    const text = new SplitType(headingRightEntry, { types: 'chars' });
    
    gsap.fromTo(text.chars, 
        {
            x: 100 * textLength, //* Start position (right)
            
        },
        {
            x: -350 * textLength, //* End position (left)
            scrollTrigger: {
                trigger: headingRightEntry,
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

