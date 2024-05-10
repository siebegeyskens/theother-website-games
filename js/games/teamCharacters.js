(function () {
  let currentIndex = 0;
  let prevIndex, itemWidth, totalItems; // State
  let items, prevArrow, nextArrow, carousel; // DOM elements

  /* TODO: 
    - cancel buttonclick 
    - 
  */

  function handleNextClick() {
    // Handle state
    prevIndex = currentIndex;
    currentIndex = (currentIndex + 1) % totalItems;

    // Handle DOM
    // 1. Add transition animation class
    carousel.classList.add("sliding-transition");
    // 2. Move the carousel to the left by the width of one image
    carousel.style.transform = `translateX(-${itemWidth + 100}px)`; // 100px for the gap between the flex items
    // 3. After the transition is completed:
    setTimeout(() => {
      // 1. Move the prevIndex image to the end of `carousel` DOM.
      carousel.appendChild(items[prevIndex]);
      // 2. Remove the class `sliding-transition` from carousel.
      carousel.classList.remove("sliding-transition");
      // 3. Remove the transform property as well, since we re-ordered the DOM.
      carousel.style.transform = "";
    }, 500);
  }

  function handlePrevClick() {
    // Handle state
    prevIndex = currentIndex;
    currentIndex = (currentIndex + totalItems - 1) % totalItems;

    // Handle DOM
    // 1. Move the currentIndex image to the beginning of `carousel` DOM.
    carousel.prepend(items[currentIndex]);
    // 2. Move the carousel to the left by the width of one image
    carousel.style.transform = `translateX(-${itemWidth + 100}px)`; // 100px for the gap between the flex items
    // 3. Set a timeout to avoid the browser batching
    setTimeout(() => {
      // 4. Add transition animation class
      carousel.classList.add("sliding-transition");
      // 5. Move the carousel to the right by the width of one image (slide in the appended image)
      carousel.style.transform = "";
      //carousel.style.transform = `translateX(${itemWidth}px)`;
    }, 10);
    setTimeout(() => {
      // By removing the transition class, we ensure that the transition only occurs when we want it to and that we have full control over the carousel's movement.
      carousel.classList.remove("sliding-transition");
    }, 500);
  }

  function initialize() {
    totalItems = items.length;
    itemWidth = items[0].getBoundingClientRect().width; // 23px gap;
    nextArrow.addEventListener("click", handleNextClick);
    prevArrow.addEventListener("click", handlePrevClick);
  }

  window.addEventListener("load", () => {
    items = [...document.getElementsByClassName("team-characters-carousel-item")];
    nextArrow = document.getElementById("team-characters-btn-right");
    prevArrow = document.getElementById("team-characters-btn-left");
    carousel = document.getElementById("team-characters-carousel");
    initialize();
  });
})();
