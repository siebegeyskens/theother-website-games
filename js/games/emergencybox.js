(function () {
  let boxes, boxesWrapper, container, hammer, containerGhost;
  let mouseOver = false;

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

    containerGhost.addEventListener("mouseenter", grabHammer);

    containerGhost.addEventListener("mouseleave", dropHammer);
  });
})();
