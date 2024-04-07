// Immediately invoked function expression to not pollute the global scope.
(function () {
  // wheel spinning parameters
  const options = {
    degreesMin: 500, // degrees
    degreesMax: 3000, // degrees
    timeMin: 2, // seconds
    timeMax: 6, // seconds
  };

  let degrees;
  let degreesNormalized;
  const zoneSize = 18; // deg
  const serviceZones = {
    1: "Medijski zakup",
    2: "Spletne strani in aplikacije",
    3: "Spletno oglaševanje",
    4: "Razvoj blagovnih znamk",
    5: "Foto & video produkcija",
    6: "Komunikacijska strategija",
    7: "SMART marketing",
    8: "OTHER DATA",
    9: "Družbena omrežja",
    10: "OTHER BOT",
    11: "Marketinška analitika",
    12: "Spletno oglaševanje",
    13: "Nakupovalni marketing",
    14: "Medijski zakup",
    15: "E-mail marketing",
    16: "Družbena omrežja",
    17: "Organizacija dogodkov",
    18: "Marketinška analitika",
    19: "Foto & video produkcija",
    20: "SMART marketing",
  };

  const wheel = document.getElementById("wheel");
  const button = document.getElementById("button");

  // Calculate how long the wheels spins based on how far it spins
  function calculateSpinningTime(degrees) {
    //https://www.30secondsofcode.org/js/s/clamp-or-map-number-to-range/
    return (
      ((degrees - options.degreesMin) * (options.timeMax - options.timeMin)) /
        (options.degreesMax - options.degreesMin) +
      options.timeMin
    );
  }

  function spinWheel() {
    // Disable the button while spinning
    button.style.pointerEvents = "none";
    // Calculate a new rotation between degreesMin and degreesMax
    degrees = Math.floor(
      options.degreesMin + Math.random() * (options.degreesMax - options.degreesMin)
    );
    degreesNormalized = degrees % 360;
    spinningTime = calculateSpinningTime(degrees);
    // Set the transition on the wheel
    wheel.style.transition = `all ${spinningTime}s ease-out`;
    // Rotate the wheel
    wheel.style.transform = `rotate(${degrees}deg)`;
  }

  function resetWheel(degrees) {
    // Enable button events when spin is over
    button.style.pointerEvents = "auto";
    // Set to the weel to a "natural" 360 degree value
    wheel.style.transition = "none";
    wheel.style.transform = `rotate(${degreesNormalized}deg)`;
  }

  function handleWin(degrees) {
    // RENDER WINNING SERVICE HERE
    const serviceZone = Math.ceil(degreesNormalized / zoneSize);
    const winningService = serviceZones[serviceZone];
    alert(winningService);
  }

  button.addEventListener("click", spinWheel);

  wheel.addEventListener("transitionend", () => {
    resetWheel(degrees);
    handleWin(degrees);
  });
})();
