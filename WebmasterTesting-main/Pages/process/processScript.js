//? Smooth Scrolling with Lenis

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
    trigger: '.titleSection-headerContainer-trigger',
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

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".swipeRightSection",
    pin: true,
    pinSpacing: true,
    scrub: 1,
    markers: TOGGLE_MARKERS,
    snap: 1 / (sections.length - 1),
    end: () => "+=" + document.querySelector(".swipeRightSection").offsetWidth
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

