// Immediately invoked function expression to not pollute the global scope.
(function () {
  let degrees = 0;
  let degreesMin = 500;
  let degreesMax = 3000;
  let timeMin = 2;
  let timeMax = 6;
  let zoneSize = 18; // deg
  let serviceZones = {
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

  function handleWin(degrees) {
    console.log(degrees);
    const winningService = Math.ceil(degrees / zoneSize);
    alert(serviceZones[winningService]);
  }

  button.addEventListener("click", () => {
    // Disable the button while spinning
    button.style.pointerEvents = "none";
    // Calculate a new rotation between degreesMin and degreesMax
    degrees = Math.floor(degreesMin + Math.random() * (degreesMax - degreesMin));
    // Calculate how long the wheels spins based on how far it spins
    //https://www.30secondsofcode.org/js/s/clamp-or-map-number-to-range/
    const mapNumRange = (num, inMin, inMax, outMin, outMax) =>
      ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    spinningTime = mapNumRange(degrees, degreesMin, degreesMax, timeMin, timeMax);
    // Set the transition on the wheel
    wheel.style.transition = `all ${spinningTime}s ease-out`;
    // button.style.transition = `all ${spinningTime}s ease-out`;
    // Rotate the wheel
    wheel.style.transform = `rotate(${degrees}deg)`;
    // button.style.transform = `rotate(${degrees}deg)`;
  });

  wheel.addEventListener("transitionend", () => {
    // Enable button events when spin is over
    button.style.pointerEvents = "auto";
    // Set to the weel to a "natural" 360 degree value
    wheel.style.transition = "none";
    // button.style.transition = "none";
    const degreesNormalized = degrees % 360;
    wheel.style.transform = `rotate(${degreesNormalized}deg)`;
    // button.style.transform = `rotate(${degreesNormalized}deg)`;
    // Calculate the winning service
    handleWin(degreesNormalized);
  });
})();
