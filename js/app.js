/**
 * app.js
 *
 * Main application file that handles UI interactions and updates.
 * Import your Pet constructor and related constants from pet.js
 */
//Import the Pet constructor and related constants
import { Pet, PetTypes, States } from './pet.js';

// Application state variables
let currentPet = null;
let updateInterval = null;

/**
 * Initialize the application
 *
 * Implement this function to:
 * - Select and store DOM elements
 * - Populate the pet selector dropdown
 * - Set up event listeners
 * - Show the pet creation UI
 */
let elements = {};
function initApp() {
  //  Select DOM elements
  elements = {
    petSelector: document.getElementById('pet-selector'),
    nameInput: document.getElementById('pet-name'),
    createButton: document.getElementById('create-pet'),
    feedButton: document.getElementById('feed-pet'),
    resetButton: document.getElementById('reset-pet'),
    petDisplay: document.getElementById('pet-display'),
    statusDisplay: document.getElementById('status-display'),
    moodBar: document.getElementById('mood-bar'),
    infoDisplay: document.getElementById('info-display'),
    creationUI: document.getElementById('pet-creation'),
    interactionUI: document.getElementById('pet-interaction')
  };

  //  Populate pet selector dropdown
  populatePetSelector();

  //  Set up event listeners
  setupEventListeners();

  // Show the pet creation UI
  showCreationUI();
}

/**
 * Populate the pet selector dropdown
 *
 *  Implement this function to:
 * - Add an option for each pet type
 * - Set a default selected type
 */
function populatePetSelector() {
  Object.values(PetTypes).forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1); //capitalize displayed text
    elements.petSelector.appendChild(option);
  });
  elements.petSelector.value = PetTypes.COW; //set default pet type to 'COW'
}

/**
 * Set up event listeners for buttons and interactions
 *
 *  Implement this function to:
 * - Add event listeners for the create, feed, and reset buttons
 */
function setupEventListeners() {
  // Implement event listeners setup
  elements.createButton.addEventListener('click', createNewPet);
  elements.feedButton.addEventListener('click', feedPet);
  elements.resetButton.addEventListener('click', resetPet);
}

/**
 * Create a new pet based on form selections
 *
 *  Implement this function to:
 * - Get the selected pet type and name
 * - Create a new Pet instance
 * - Update the UI to show the pet
 * - Start the update cycle
 */
function createNewPet() {
  // Implement pet creation
  const type = elements.petSelector?.value || PetTypes.COW;
  let name = elements.nameInput?.value.trim() || '';

  if (!name) {
    //if no name selected, set name to pet type and capitalize it
    name = type.charAt(0).toUpperCase() + type.slice(1);
  }

  currentPet = new Pet(type, name);
  hideCreationUI();
  updatePetDisplay();
  startUpdateCycle();
}

/**
 * Hide the pet creation UI and show the pet interaction UI
 */
function hideCreationUI() {
  //Implement UI transition
  elements.creationUI.style.display = 'none';
  elements.interactionUI.style.display = 'block';
}

/**
 * Show the pet creation UI and hide the pet interaction UI
 */
function showCreationUI() {
  // Implement UI transition
  elements.creationUI.style.display = 'block';
  elements.interactionUI.style.display = 'none';
}

/**
 * Update the pet display and status elements
 *
 * Implement this function to:
 * - Update the pet's visual representation
 * - Update the status message
 * - Update the mood indicator
 * - Update the information display
 */
function updatePetDisplay() {
  // Implement display updates
  if (!currentPet) {
    return;
  }
  //updates appearance, mood and creation & feeding timestamps
  elements.petDisplay.textContent = currentPet.appearance;
  elements.petDisplay.className = `pet-display pet-${currentPet.state}`;
  elements.statusDisplay.textContent = currentPet.getStatusMessage();

  updateMoodBar();
  updateInfoDisplay();
}

/**
 * Update the mood level display bar
 *
 * Implement this function to:
 * - Set the width of the mood bar based on the pet's mood level
 * - Change the color based on the mood level
 */
function updateMoodBar() {
  //  Implement mood bar updates
  if (!currentPet) {
    return;
  }
  const bar = document.getElementById('mood-bar');
  if (!bar) {
    return;
  }
  //sets moodbar level
  const level = currentPet.moodLevel;
  bar.style.width = `${level}%`;

  //changes moodbar color to match mood state
  const stateColors = {
    [States.ECSTATIC]: 'var(--primary-color)',   // green
    [States.HAPPY]: '#9ccc65',                  // light green
    [States.CONTENT]: 'var(--accent-color)',       // orange
    [States.NEUTRAL]: '#ffc107',                  // amber
    [States.BORED]: '#ff9800',                    // orange
    [States.SAD]: '#ff5722',                      // deep orange/red
    [States.MISERABLE]: 'var(--danger-color)'    // red
  };

  bar.style.backgroundColor = stateColors[currentPet.state] || 'var(--accent-color)';
}

/**
 * Update the information display panel
 *
 *  Implement this function to:
 * - Show the pet's name, type, state, etc.
 * - Display the mood level bar
 * - Show timestamps for creation and last feeding
 */
function updateInfoDisplay() {
  // Implement info display updates
  if (!currentPet || !elements.infoDisplay) {
    return;
  }

  // show pet name, type and current state
  // display timestamps for creation and feeding
  let infoText = elements.infoDisplay.querySelector('.info-text');
  if (!infoText) {
    infoText = document.createElement('div');
    infoText.className = 'info-text';
    elements.infoDisplay.appendChild(infoText);
  }

  infoText.innerHTML = `
    <strong>Name:</strong> ${currentPet.name}<br>
    <strong>Type:</strong> ${currentPet.type}<br>
    <strong>State:</strong> ${currentPet.state}<br>
    <strong>Created:</strong> ${currentPet.created.toLocaleTimeString()}<br>
    <strong>Last Fed:</strong> ${currentPet.lastFed.toLocaleTimeString()}
  `;

}

/**
 * Feed the current pet
 *
 *  Implement this function to:
 * - Call the pet's feed method
 * - Update the display with the new state
 */
function feedPet() {
  // Implement feeding interaction
  if (!currentPet) {
    return;
  }
  //refreshes pet display and moodbar
  currentPet.feed();
  updatePetDisplay();
}

/**
 * Reset the pet simulator
 *
 * Implement this function to:
 * - Clear the update interval
 * - Reset the current pet
 * - Clear the displays
 * - Show the creation UI
 */
function resetPet() {
  // Implement reset functionality
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  currentPet = null;
  //resets pet display
  elements.petDisplay.textContent = '';
  elements.petDisplay.className = 'pet-display';
  elements.statusDisplay.textContent = 'Create a pet to get started!';
  elements.infoDisplay.innerHTML = '';

  showCreationUI();
}

/**
 * Start the regular update cycle
 *
 * Implement this function to:
 * - Clear any existing update interval
 * - Set up a new interval that:
 *   - Updates the pet's state
 *   - Updates the display
 */
function startUpdateCycle() {
  // Implement update cycle
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  updateInterval = setInterval(() => {
    if (currentPet) {
      currentPet.updateState();
      updatePetDisplay();
    }
  }, 1000);
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
