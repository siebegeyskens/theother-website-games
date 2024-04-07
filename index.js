// Immediately invoked function expression to not pollute the global scope.
(function () {
  const wheel = document.getElementById("wheel");
  let degrees = 0;
  let degreesMin = 500;
  let degreesMax = 3000;
  let timeMin = 2;
  let timeMax = 6;

  wheel.addEventListener("click", () => {
    // Disable the button while spinning
    wheel.style.pointerEvents = "none";
    // random spinning speed
    degrees = Math.floor(degreesMin + Math.random() * (degreesMax - degreesMin));
    //https://www.30secondsofcode.org/js/s/clamp-or-map-number-to-range/
    const mapNumRange = (num, inMin, inMax, outMin, outMax) =>
      ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    spinningTime = mapNumRange(degrees, degreesMin, degreesMax, timeMin, timeMax);
    console.log(degrees, spinningTime);
    wheel.style.transition = `all ${spinningTime}s ease-out`;
    wheel.style.transform = `rotate(${degrees}deg)`;
  });

  wheel.addEventListener("transitionend", () => {
    // Allow to click again
    wheel.style.pointerEvents = "auto";
    // Set to actual degrees
    wheel.style.transition = "none";
    const degreesNormalized = degrees % 360;
    wheel.style.transform = `rotate(${degreesNormalized}deg)`;
  });
})();
