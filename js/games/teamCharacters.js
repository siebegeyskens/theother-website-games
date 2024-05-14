(function () {
  const characters = [
    {
      name: "Duane Wiegan",
      firstPower: "Can read minds",
      secondPower: "Fastest email reply",
    },
    {
      name: "Isaac Newton",
      firstPower: "Time bending",
      secondPower: "Universal understanding",
    },
    {
      name: "Elon Musk",
      firstPower: "Infinite Patience",
      secondPower: "Positive vibe generator",
    },
  ];
  let currentIndex = 0; // State
  let prevIndex, itemWidth, totalItems; // State
  let items, prevArrow, nextArrow, carousel; // DOM elements (carousel)
  let name, firstPower, secondPower; // DOM elements (info)
  let characterLink; // DOM elements (characterLink)

  // TODO: window resize

  function enableArrows() {
    prevArrow.classList.remove("disabled"); // Remove disabled class
    nextArrow.classList.remove("disabled"); // Remove disabled class
  }

  function disableArrows() {
    prevArrow.classList.add("disabled"); // Add disabled class
    nextArrow.classList.add("disabled"); // Add disabled class
  }

  function upDateInfo() {
    // TODO: couldn't I map this
    // Update text info
    name.innerText = `name: ${characters[currentIndex].name}`;
    firstPower.innerText = characters[currentIndex].firstPower;
    secondPower.innerText = characters[currentIndex].secondPower;
    // Bar loader animation
    powerBars.forEach((bar) => {
      bar.style.width = "0";
    });
    setTimeout(() => {
      powerBars.forEach((bar) => {
        bar.classList.add("fill-transition");
        bar.style.width = "100%";
      });
    }, 10);
    setTimeout(() => {
      powerBars.forEach((bar) => {
        bar.classList.remove("fill-transition");
      });
    }, 510);
    const interval = setInterval(() => {
      const width = parseInt(getComputedStyle(powerBars[0]).width) / 124;
      if (width == 1) {
        //clear
        clearInterval(interval);
      } else {
        powerPercentages.forEach((percentage) => {
          percentage.innerHTML = `${Math.ceil(width * 100)}%`;
        });
      }
    }, 50);
  }

  function upDateCharacterLink() {
    characterLink.href = "./" + characters[currentIndex].name;
  }

  function handleNextClick() {
    // Handle state
    prevIndex = currentIndex;
    currentIndex = (currentIndex + 1) % totalItems;

    powerBars.forEach((bar) => {
      bar.style.width = "0px";
      console.log(bar.style.width);
    });

    // Handle DOM - info
    upDateInfo();

    // Handle DOM - character link
    upDateCharacterLink();

    // Handle DOM - carousel
    // 0.
    disableArrows();
    // 1. Add transition animation class
    carousel.classList.add("sliding-transition");
    // 2. Move the carousel to the left by the width of one image
    carousel.style.transform = `translateX(-${itemWidth + 100}px)`; // 100px for the gap between the flex items
    // 3. After the transition is completed:
    setTimeout(() => {
      // 0.
      enableArrows();
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

    // Handle DOM - info
    upDateInfo();
    // Handle DOM - character link
    upDateCharacterLink();

    // Handle DOM - carousel
    // 0.
    disableArrows();
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

      enableArrows();
      carousel.classList.remove("sliding-transition");
    }, 500);
  }

  function initialize() {
    // initialize state (get info from DOM)
    totalItems = items.length;
    itemWidth = items[0].getBoundingClientRect().width; // 23px gap;

    // initialize carousel
    nextArrow.addEventListener("click", handleNextClick);
    prevArrow.addEventListener("click", handlePrevClick);

    upDateInfo();

    upDateCharacterLink();
  }

  window.addEventListener("load", () => {
    // Grab elements (carousel)
    items = [...document.getElementsByClassName("team-characters-carousel-item")];
    nextArrow = document.getElementById("team-characters-btn-right");
    prevArrow = document.getElementById("team-characters-btn-left");
    carousel = document.getElementById("team-characters-carousel");
    // Grab elements (info)
    name = document.getElementById("team-characters-info-name");
    firstPower = document.getElementById("team-characters-power--first");
    secondPower = document.getElementById("team-characters-power--second");
    powerBars = [...document.getElementsByClassName("team-characters-power-bar")];
    powerPercentages = [...document.getElementsByClassName("team-characters-power-bar-percentage")];
    // Grab elements (choose button)
    characterLink = document.getElementById("team-characters-link");
    initialize();
  });
})();
