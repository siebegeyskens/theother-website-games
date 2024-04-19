(function () {
  let boxes, boxesWrapper, container, hammer, containerGhost;
  let currentBox = 0;

  function endGame() {
    dropHammer();

    // Remove all event listeners
    containerGhost.removeEventListener("mouseenter", grabHammer);
    containerGhost.removeEventListener("mouseleave", dropHammer);
    containerGhost.removeEventListener("click", breakGlass);

    // Show cursor again

    container.classList.remove("game-emergencybox-hidden-cursor");
  }

  function showContacts() {
    window.alert("Show contact information!");
  }

  function animateHammerDown() {
    return new Promise((resolve, reject) => {
      const duration = 20; //ms
      hammer.style.transition = `transform ${duration}ms`;
      hammer.style.transform = `scale(0.7) rotate(-10deg) translate(-50%, -50%)`;
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }

  function animateHammerUp() {
    return new Promise((resolve, reject) => {
      const duration = 300; //ms
      const delay = 100; // ms
      hammer.style.transition = `transform ${duration}ms ${delay}ms`;
      hammer.style.transform = `scale(1) rotate(0) translate(-50%, -50%)`;
      setTimeout(() => {
        resolve();
      }, duration + delay);
    });
  }

  async function breakGlass() {
    await animateHammerDown();
    boxes[currentBox + 1].classList.add("game-emergencybox-visible");
    boxes[currentBox].classList.remove("game-emergencybox-visible");
    await animateHammerUp();
    currentBox++;
    if (currentBox === boxes.length - 1) {
      endGame();
      setTimeout(showContacts, 500);
    }
  }

  function grabHammer() {
    container.addEventListener("mousemove", cursor);
    hammer.classList.remove("game-emergencybox-hidden");
  }

  function dropHammer() {
    container.removeEventListener("mousemove", cursor);
    hammer.classList.add("game-emergencybox-hidden");
  }

  function cursor(e) {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top; //y position within the element.
    hammer.style.top = y + "px";
    hammer.style.left = x + "px";
  }

  window.addEventListener("load", () => {
    boxes = Array.from(document.getElementsByClassName("game-emergencybox-box"));
    boxesWrapper = document.getElementById("game-emergencybox-wrapper");
    container = document.getElementById("game-emergencybox-container");
    hammer = document.getElementById("game-emergencybox-hammer");
    containerGhost = document.getElementById("game-emergencybox-container-ghost");

    containerGhost.addEventListener("click", breakGlass);

    const canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover) {
      containerGhost.addEventListener("mouseenter", grabHammer);
      window.addEventListener("mousemove", (e) => {
        if ((e.target = containerGhost)) grabHammer;
      });
      containerGhost.addEventListener("mouseleave", dropHammer);
    }
  });
})();
