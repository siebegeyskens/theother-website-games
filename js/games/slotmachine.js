(function () {
  const jsonData = `{
    "symbolsImageSource": "../../images/games/slotmachine/reel-symbols.png",
        "projects": [
          {
            "name": "Ekozarcek",
            "year": 2016,
            "service": "SERVICE"
          },
          {
            "name": "Vinakoper",
            "year": 2018,
            "service": "SERVICE"
          },
          {
            "name": "žalec",
            "year": 2019,
            "service": "SERVICE"
          },
          {
            "name": "Harvest",
            "year": 2017,
            "service": "SERVICE"
          },
          {
            "name": "Philips",
            "year": 2020,
            "service": "SERVICE"
          },
          {
            "name": "Polymetrija",
            "year": 2015,
            "service": "SERVICE"
          },
          {
            "name": "Vivalis",
            "year": 2022,
            "service": "SERVICE"
          },
          {
            "name": "Orbico",
            "year": 2014,
            "service": "SERVICE"
          },
          {
            "name": "Bg",
            "year": 2023,
            "service": "SERVICE"
          },
          {
            "name": "Supernova",
            "year": 2013,
            "service": "SERVICE"
          },
          {
            "name": "Floramare",
            "year": 2021,
            "service": "SERVICE"
          }
        ]
      }`;

  //
  // Slotmachine + reel variables
  //
  const data = JSON.parse(jsonData);
  const projects = data.projects.reverse(); // Reverse the projects array, the slotmachine counts from bottom to top.
  const numSymbols = projects.length;
  const symbolsImageSource = data.symbolsImageSource;
  let indexes = [0, 0, 0]; // Array to keep track of the winline
  let reelHeight; // Height of each reel (pixels)
  let symbolHeight; // Height of each symbol (percentage)
  let timePerSymbol = 100; // Time in milliseconds for each symbol rotation
  let guaranteedWinMode = false; // Flag for guaranteedWinMode mode
  let winningSymbolIndexes = []; // Array to keep track of the winning symbols
  let winningSymbolIndex = 0; // Current winning symbol
  let isRolling = false;
  let animationRejects = []; // To keep track of the reject methods of the promises for reel animations
  let reels, btn, lever, leverDown, projectText;
  let canvas, ctx, background;

  // Symbol class' job is to create, manage and draw individual symbols that make up the background effect.
  class Symbol {
    constructor(x, y, fontSize) {
      this.characters = `!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_{|}~`;
      this.x = x;
      this.y = y;
      this.index = Math.floor(Math.random() * this.characters.length);
      this.fontSize = fontSize;
      this.text = this.characters.charAt(this.index); // currently active symbol
    }
    // Clear the letter with the "destination-out" composite operation (clears with transparancy)
    clear(context) {
      context.globalCompositeOperation = "destination-out";
      context.fillStyle = "rgba(0, 0, 0, 1)";
      context.fillRect(this.x, this.y, this.fontSize, this.fontSize);
      context.globalCompositeOperation = "source-over";
    }
    draw(context) {
      this.clear(context);

      this.text = this.characters.charAt(this.index);
      const rand = Math.random();
      const lightness = 45 + Math.floor(rand * 40);
      const alpha = Math.floor(rand * 100);
      //       Hex	#52ba2b
      // Hsl	hsl(104, 62%, 45%)
      context.fillStyle = `hsl(104, 62%, ${lightness}% , ${alpha}%)`;
      context.fillText(this.text, this.x, this.y);

      if (this.index > this.characters.length - 1) {
        this.index = 0;
      } else {
        this.index++;
      }
    }
  }

  // Manages the entire background effect, all of the symbols at once.
  class Background {
    constructor(canvasWidth, canvasHeight, fontSize) {
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.fontSize = fontSize;
      this.colums = this.canvasWidth / this.fontSize;
      this.rows = this.canvasHeight / this.fontSize;
      this.symbols = [];
      this.deltaTime = 0;
      this.previousTimeStamp = 0;
      this.nextDraw = 200; // Amount of ms to wait before redrawing
      this.timer = 0;
      this.isAnimating = false;
      this.firstChunk;
      this.secondChunk;
      this.firstChunkDrawn = false;
      this.#initialize();
      this.startAnimation();
    }
    // The hashtag makes it a private function so it can't be called from the outside, they have resitricted acces.
    #initialize() {
      // create all symbols
      for (let i = 0; i < this.colums; i++) {
        for (let j = 0; j < this.rows; j++) {
          this.symbols.push(new Symbol(i * this.fontSize, j * this.fontSize, this.fontSize));
        }
      }
    }

    drawChunk(chunk) {
      chunk.forEach((symbol, i) => {
        // TODO:
        // if (i % 2 == 0) {
        //   symbol.draw(ctx);
        // }
        symbol.draw(ctx);
      });
    }

    drawInChunks() {
      if (!this.firstChunkDrawn) {
        this.drawChunk(this.firstChunk);
      } else {
        this.drawChunk(this.secondChunk);
      }
      this.firstChunkDrawn = !this.firstChunkDrawn;
    }

    animate(timeStamp) {
      // Calculate delta time
      this.deltaTime = timeStamp - this.previousTimeStamp;
      this.previousTimeStamp = timeStamp;

      // Draw the next chunk when the timer reaches the threshold
      if (this.timer > this.nextDraw) {
        this.drawInChunks();
        this.timer = 0;
      } else {
        this.timer += this.deltaTime;
      }

      if (this.isAnimating) {
        requestAnimationFrame((timeStamp) => {
          this.animate(timeStamp);
        });
      }
    }

    startAnimation() {
      ctx.font = this.fontSize + `px Pixelify Sans`;
      ctx.textBaseline = "top";

      this.isAnimating = true;
      shuffle(this.symbols);
      this.firstChunk = this.symbols.slice(0, this.symbols.length / 2);
      this.secondChunk = this.symbols.slice(this.symbols.length / 2, this.symbols.length);
      requestAnimationFrame((timeStamp) => {
        this.animate(timeStamp);
      });
    }

    stopAnimation() {
      this.isAnimating = false;

      // Clear the symbols one by one
      this.symbols.forEach((symbol, i) => {
        setTimeout(() => {
          symbol.clear(ctx);
        }, i * 2);
      });
    }

    resize(width, height, fontSize) {
      this.canvasWidth = width;
      this.canvasHeight = height;
      this.fontSize = fontSize;
      this.colums = this.canvasWidth / this.fontSize;
      this.rows = this.canvasHeight / this.fontSize;
      this.symbols = [];
      this.intervals = [];
      this.#initialize();
    }
  }

  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array) {
    let currentIndex = array.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  }

  // Create the array to keep track of the winning symbols
  function createWinningSymbolIndexes() {
    winningSymbolIndexes = [];
    for (let i = 0; i < numSymbols; i++) {
      winningSymbolIndexes.push(i);
    }
    // Shuffle the array so it's not in the same order every time.
    // Ex: [6, 4, 0, 1, 2, 5, 7, 3, 10, 8, 9]
    shuffle(winningSymbolIndexes);
  }

  // Function to update reel variables.
  function getReelDimensions(reels) {
    reelHeight = getComputedStyle(reels[0])["height"];
    symbolHeight = `calc((100% - ${reelHeight}) / ${numSymbols})`;
  }

  // Set initial background position for reels
  // Places the symbols in the middle of the reel, instead of at the top.
  // Uses CSS calc function with the current height of the reel (div containter) and the symbolHeight
  function setStartOffset(reels) {
    reels.forEach((reel) => {
      reel.style.backgroundPositionY = `calc((${reelHeight} - ${symbolHeight}) / 2)`;
    });
  }

  // TODO: split into two functions
  // Calculate number of symbols that come by.
  function calculateSymbolOffset(offset, guaranteedWinMode) {
    // Always two full rotations + offset. Example, if offset is 2, the reel will have 4 full rotations.
    let symbolOffset = (offset + 2) * numSymbols;
    // Based on the current backgroundposition, calculate how much the reel needs to rotate to land on the winning index.
    if (guaranteedWinMode) {
      let indexToLandOn = winningSymbolIndexes[winningSymbolIndex];
      symbolOffset += indexToLandOn - indexes[offset];
    } else {
      // Add delta with a random number between 0 and the number of icons, so they stop at different random offset
      symbolOffset += Math.round(Math.random() * numSymbols);
    }
    return symbolOffset;
  }

  function calculateTargetBackgroundPositionY(reel, symbolOffset) {
    const backgroundPositionY = getComputedStyle(reel)["background-position-y"];
    return `calc(${backgroundPositionY} - calc(${symbolOffset} * ${symbolHeight}`;
  }

  // reject all the animationPromises
  function cancelPendingAnimations() {
    animationRejects.forEach((reject) => {
      reject("Cancelled due to resize!");
    });
    animationRejects = [];
  }

  function showProject() {
    const winningProject = projects[indexes[0]];
    projectText.style.transition = "none";
    projectText.style.opacity = 1;
    projectText.innerText = `projekt ${winningProject.name} ${winningProject.year}`;
  }

  function hideProject() {
    projectText.style.transition = "opacity 1s";
    projectText.style.opacity = 0;
  }

  function animateReel(reel, symbolOffset, targetBackgroundPositionY) {
    reel.style.transition = `background-position-y ${
      symbolOffset * timePerSymbol
    }ms cubic-bezier(.45,.05,.58,1.06)`;
    reel.style.backgroundPositionY = targetBackgroundPositionY;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, symbolOffset * timePerSymbol);
      // Save the reject function
      animationRejects.push(reject);
    });
  }

  async function rollReels(reels, guaranteedWinMode) {
    isRolling = true;

    try {
      // Store the symbolOffsets to also animate the background and update the indexes
      const symbolOffsets = [];

      const animationPromises = reels.map((reel, i) => {
        const symbolOffset = calculateSymbolOffset(i, guaranteedWinMode);
        symbolOffsets.push(symbolOffset);
        const targetBackgroundPositionY = calculateTargetBackgroundPositionY(reel, symbolOffset);

        return animateReel(reel, symbolOffset, targetBackgroundPositionY);
      });

      hideProject();

      if (guaranteedWinMode) {
        await animationPromises[1];
        background.stopAnimation();
      } else if (!background.isAnimating) {
        console.log("start animation");
        background.startAnimation();
      }

      await Promise.all(animationPromises);

      // Update the indexes
      reels.forEach((reel, i) => (indexes[i] = (indexes[i] + symbolOffsets[i]) % numSymbols));
      setLeverUp();

      // check win condition
      if (indexes.every((index) => index === indexes[0])) {
        showProject();
      }

      // Toggle guaranteedWinMode mode
      toggleGuaranteedWinMode();
    } catch (err) {
      // reject message
    } finally {
      isRolling = false;
    }
  }

  function toggleGuaranteedWinMode() {
    // Update guaranteedWinMode index if guaranteedWinMode is enabled
    if (guaranteedWinMode) {
      winningSymbolIndex++;
    }

    // Toggle guaranteedWinMode mode
    guaranteedWinMode = !guaranteedWinMode;
  }

  function setLeverDown() {
    btn.classList.add("game-slotmachine-invisible");
    lever.classList.add("game-slotmachine-invisible");
    leverDown.classList.remove("game-slotmachine-invisible");
  }

  function setLeverUp() {
    btn.classList.remove("game-slotmachine-invisible");
    lever.classList.remove("game-slotmachine-invisible");
    leverDown.classList.add("game-slotmachine-invisible");
  }

  function setSymbolPositions(reels, indexes) {
    reels.forEach((reel, i) => {
      // Calculate the new background position for the reel based on the current index
      const newPosition = `calc((${reelHeight} - ${symbolHeight}) / 2 - (${indexes[i]} * ${symbolHeight}))`;
      // Set the new background position (without transition)
      reel.style.transition = "none";
      reel.style.backgroundPositionY = newPosition;
    });
  }

  function loadSymbolSourceImages() {
    return reels.map((reel) => {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = function () {
          reel.style.backgroundImage = `url(${symbolsImageSource})`;
          resolve();
        };
        img.src = symbolsImageSource;
      });
    });
  }

  function handleButtonClick() {
    // Check if all symbols were already shown, if so, reset guaranteedWinMode index
    if (guaranteedWinMode && winningSymbolIndex >= numSymbols) {
      createWinningSymbolIndexes();
      winningSymbolIndex = 0;
    }
    setLeverDown();
    rollReels(reels, guaranteedWinMode);
  }

  function handleWindowResize() {
    // Update reel dimensions
    getReelDimensions(reels);

    // Update symbol positions based on current dimensions and indexes
    // If it's rolling it will overwrite the ongoing css transition
    setSymbolPositions(reels, indexes);

    // Update canvas coordinate sizing
    canvas.setAttribute("width", canvas.offsetWidth);
    canvas.setAttribute("height", canvas.offsetHeight);
    // resize background
    background.resize(
      canvas.offsetWidth,
      canvas.offsetHeight,
      parseInt(getComputedStyle(projectText).fontSize.replace("px", ""))
    );

    if (isRolling) {
      cancelPendingAnimations();
      setLeverUp();
    }

    const won = indexes.every((index) => index === indexes[0]);
    if (won) {
      showProject();
      background.isAnimating = false;
    } else {
      background.startAnimation();
    }
  }

  // set the starting index to a randomly, but not winning
  function initIndexes() {
    let randomIndex = Math.floor(Math.random() * numSymbols);
    indexes = reels.map((_, i) => (randomIndex + i) % numSymbols);
  }

  function initializeBackground() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.setAttribute("width", canvas.offsetWidth);
    canvas.setAttribute("height", canvas.offsetHeight);
    background = new Background(
      canvas.offsetWidth,
      canvas.offsetHeight,
      parseInt(getComputedStyle(projectText).fontSize.replace("px", ""))
    );
  }

  async function initializeSlotMachine() {
    await Promise.all(loadSymbolSourceImages());

    // Update variables based on reel properties
    getReelDimensions(reels);
    initIndexes();
    setSymbolPositions(reels, indexes);
    // Create array to keep track of winning array
    createWinningSymbolIndexes();
    // Hide the project text
    projectText.style.opacity = 0;

    // Wait for the pixelify font to load before using it in the canvas background
    await document.fonts.ready;
    initializeBackground();
  }

  window.addEventListener("resize", handleWindowResize);
  window.addEventListener("load", () => {
    reels = Array.from(document.getElementsByClassName("game-slotmachine-reel"));
    btn = document.getElementById("game-slotmachine-btn");
    lever = document.getElementById("game-slotmachine-lever");
    leverDown = document.getElementById("game-slotmachine-lever-down");
    projectText = document.getElementById("game-slotmachine-text");
    containerBackground = document.getElementById("game-slotmachine");

    initializeSlotMachine();
    btn.addEventListener("click", handleButtonClick);
  });
})();
