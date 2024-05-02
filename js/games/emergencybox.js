(function () {
  let boxes, boxesWrapper, container, hammer, containerGhost;
  let currentBox = 0;
  let scale = 1;
  let rotation = 0; // deg

  function endGame() {
    dropHammer();

    // Remove all event listeners
    containerGhost.removeEventListener("mouseenter", grabHammer);
    containerGhost.removeEventListener("mousemove", grabHammer);
    containerGhost.removeEventListener("mouseleave", dropHammer);
    containerGhost.removeEventListener("click", breakGlass);

    // Show cursor again

    container.classList.remove("game-emergencybox-hidden-cursor");
  }

  function showContacts() {
    window.alert("Show contact information!");
  }

  function animateHammerDown() {
    return new Promise((resolve) => {
      function animate() {
        scale = scale - 0.25;
        rotation = rotation - 5;
        hammer.style.transform = `scale(${scale}) rotate(${rotation}deg) translate(-50%, -50%)`;
        if (scale > 0.5) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(animate);
    });
  }

  function animateHammerUp() {
    return new Promise((resolve) => {
      function animate() {
        scale = scale + 0.1;
        rotation = rotation + 2;
        hammer.style.transform = `scale(${scale}) rotate(${rotation}deg) translate(-50%, -50%)`;
        if (scale < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(animate);
    });
  }

  function showNextBox() {
    currentBox++;
    boxes[currentBox - 1].classList.remove("game-emergencybox-visible");
    boxes[currentBox].classList.add("game-emergencybox-visible");
  }

  async function breakGlass() {
    await animateHammerDown();
    showNextBox();
    await animateHammerUp();
    if (currentBox === boxes.length - 1) {
      endGame();
      showContacts();
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

  const canHover = window.matchMedia("(hover: hover)").matches;
  window.addEventListener("load", () => {
    boxes = Array.from(document.getElementsByClassName("game-emergencybox-box"));
    boxesWrapper = document.getElementById("game-emergencybox-wrapper");
    container = document.getElementById("game-emergencybox-container");
    hammer = document.getElementById("game-emergencybox-hammer");
    containerGhost = document.getElementById("game-emergencybox-container-ghost");

    containerGhost.addEventListener("click", breakGlass);

    if (canHover) {
      containerGhost.addEventListener("mouseenter", grabHammer);
      containerGhost.addEventListener("mousemove", grabHammer);
      containerGhost.addEventListener("mouseleave", dropHammer);
    }
  });
})();
