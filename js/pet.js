/* eslint-disable indent */
/* eslint-disable no-console */
/**
 * pet.js
 *
 * This file should contain your Pet constructor function and prototype methods.
 * Export your Pet constructor and any necessary constants to be used in app.js.
 */

// Create a PetTypes object with different pet type options
const PetTypes = {
  CAT: 'cat',
  DOG: 'dog',
  COW: 'cow',
};
// Create a States object with different mood states
const States = {
  ECSTATIC: 'ecstatic',
  HAPPY: 'happy',
  CONTENT: 'content',
  NEUTRAL: 'neutral',
  BORED: 'bored',
  SAD: 'sad',
  MISERABLE: 'miserable',
  HUNGRY: 'hungry'
};
// random speech phrases
const SpeechPhrases = {
  [States.ECSTATIC]: ['I\'m bursting with joy!', 'This is amazing!', 'I can\'t stop smiling!'],
  [States.HAPPY]: ['Feeling great!', 'Yay!', 'Thanks for taking care of me!'],
  [States.CONTENT]: ['All good here.', 'Nice and comfy.', 'Just vibing.'],
  [States.NEUTRAL]: ['Meh.', 'It\'s an okay day.', 'Nothing much going on.'],
  [States.BORED]: ['So bored...', 'Let\'s do something fun!', 'Zzz...'],
  [States.SAD]: ['I\'m feeling blue.', 'I need a hug.', 'Why am I so sad?'],
  [States.MISERABLE]: ['Please feed me...', 'I\'m not okay.', 'Life is hard.'],
  neutral: ['Hello.', 'Hi there.', 'Beep boop.']
};
// ASCIII Pet art
const petArt = {
  [PetTypes.COW]: {
    [States.ECSTATIC]: '(^‿^)\n Moo!',
    [States.HAPPY]: '(◕‿◕)\n Moo!',
    [States.CONTENT]: '(-‿-)\n Moo.',
    [States.NEUTRAL]: '(•‿•)\n Moo...',
    [States.BORED]: '(¬_¬)\n Moo...',
    [States.SAD]: '(︶︹︶)\n Moo...',
    [States.MISERABLE]: '(ಥ﹏ಥ)\n Moo...',
  },
  [PetTypes.CAT]: {
    [States.ECSTATIC]: 'ฅ^•ﻌ•^ฅ\n Purr!',
    [States.HAPPY]: 'ฅ^•ω•^ฅ\n Meow!',
    [States.CONTENT]: 'ฅ^•_•^ฅ\n Purr.',
    [States.NEUTRAL]: '(=^･^=)\n ...',
    [States.BORED]: '(= -ᆺ- =)\n Hmph.',
    [States.SAD]: '(=；ェ；=)\n Meow...',
    [States.MISERABLE]: '(=ＴェＴ=)\n :( ',
  },
  [PetTypes.DOG]: {
    [States.ECSTATIC]: 'ᕙ(⇀‸↼‶)ᕗ\n Woof!',
    [States.HAPPY]: '(⌒▽⌒)\n Bark!',
    [States.CONTENT]: 'ʕ•ᴥ•ʔ\n Sniff.',
    [States.NEUTRAL]: '(◕︵◕)\n ...',
    [States.BORED]: '(ಠ_ಠ)\n Rrr...',
    [States.SAD]: '(╥﹏╥)\n Whine...',
    [States.MISERABLE]: '(ಥ﹏ಥ)\n Howl...',
  }
};
/**
 * Pet constructor function
 *
 *  Implement this constructor function that creates a virtual pet
 * Parameters should include type and name
 * Initialize properties for tracking mood, state, and timestamps
 */
function Pet(type, name) {
  // Initialize basic properties (name, type)
  this.type = type || PetTypes.COW;
  this.name = name || 'Pet';

  //Initialize state properties (mood level, state)
  this.moodLevel = 80;               // 0-100 scale
  this.state = States.HAPPY;         // Default state

  // Initialize timestamps (created, last fed)
  this.lastFed = new Date();         // Track when the pet was last fed
  this.created = new Date();         // Track when the pet was created

  //Initialize speech-related properties
  this.isSpeaking = false;
  this.speechText = '';
  this.speechTimeout = null;

  // Call updateAppearance() to set initial appearance
  this.updateAppearance();
}

/**
 * Feed the pet
 *
 * Implement this method to feed the pet, which should:
 * - Increase the pet's mood level
 * - Update the last fed timestamp
 * - Update the pet's state
 * - Return a message about the feeding
 */
Pet.prototype.feed = function () {
  // Implement feed functionality
  //increase mood level when fed--capped at 100
  this.moodLevel = Math.min(100, this.moodLevel + 20);

  //update timestamp to now when fed
  this.lastFed = new Date();

  //update state based on new mood
  this.updateState();
  this.speak('Yum! That was delicious!');

  //feedback message
  return `${this.name} has been fed and is ${this.state}!`;
};

/**
 * Check if the pet is hungry
 *
 *  Implement this method to determine if the pet is hungry based on
 * how much time has passed since it was last fed
 */
Pet.prototype.isHungry = function () {
  // Implement hunger check

  //get current time
  const now = new Date();
  //calculte time since last fed
  const timeSinceLastFed = now - this.lastFed;

  //define hunger threshold
  const hungerTime = 60 * 1000;

  //returns true if pet hasnt been fed for longer than threshold
  return timeSinceLastFed > hungerTime;
};

/**
 * Update the pet's state based on mood level
 *
 * Implement this method to:
 * - Update the pet's mood based on time passed
 * - Set the appropriate state based on mood level
 * - Occasionally trigger random thoughts
 * - Update the pet's appearance
 */
Pet.prototype.updateState = function () {

  //reduce mood level when pet is hungry
  if (this.isHungry()) {
    this.moodLevel = Math.max(0, this.moodLevel - 2);
  }

  // detetermines state based on mood level ranges
  if (this.moodLevel >= 90) {
    this.state = States.ECSTATIC;
  } else if (this.moodLevel >= 75) {
    this.state = States.HAPPY;
  } else if (this.moodLevel >= 60) {
    this.state = States.CONTENT;
  } else if (this.moodLevel >= 45) {
    this.state = States.NEUTRAL;
  } else if (this.moodLevel >= 30) {
    this.state = States.BORED;
  } else if (this.moodLevel >= 15) {
    this.state = States.SAD;
  } else {
    this.state = States.MISERABLE;
  }

  if (Math.random() < 0.15 && !this.isSpeaking) { // 15% chance to speak when mood changes
    this.speakRandomThought();
  }
  //update pet art appearance
  this.updateAppearance();

  //return current state
  return this.state;
};

/**
 * Make the pet speak a random thought based on its mood
 *
 * Implement this method to have the pet express a random thought
 * appropriate to its current mood
 */
Pet.prototype.speakRandomThought = function () {
  // Implement random thought generation

  //get phrase for current state
  const phrases = SpeechPhrases[this.state] || SpeechPhrases.neutral;

  //pick random phrase for current mood
  const randomIndex = Math.floor(Math.random() * phrases.length);
  const phrase = phrases[randomIndex];

  //pet speaks selected phrase
  this.speak(phrase);
};

/**
 * Make the pet say something
 *
 *  Implement this method to display a speech bubble with text
 * and clear it after a few seconds
 */
Pet.prototype.speak = function (text) {
  //  Implement speech functionality

  //clear exisiting speech timeout
  if (this.speechTimeout) {
    clearTimeout(this.speechTimeout);
  }

  //set speaking state and speech text
  this.isSpeaking = true;
  this.speechText = text;

  // Clear speech bubble after 4 seconds
  this.speechTimeout = setTimeout(() => {
    this.isSpeaking = false;
    this.speechText = '';
    this.updateAppearance();
  }, 4000);

  this.updateAppearance(); //updates to show speech bubble
};

/**
 * Get a status message based on the pet's current state
 *
 *  Implement this method to return an appropriate message
 * describing the pet's current mood state
 */
Pet.prototype.getStatusMessage = function () {
  // Implement status message generation

  //return messages for each mood state
  switch (this.state) {
    case States.ECSTATIC:
      return `${this.name} is absolutely ecstatic!`;
    case States.HAPPY:
      return `${this.name} is very happy!`;
    case States.CONTENT:
      return `${this.name} is content.`;
    case States.NEUTRAL:
      return `${this.name} is doing okay.`;
    case States.BORED:
      return `${this.name} seems a bit bored.`;
    case States.SAD:
      return `${this.name} is feeling sad.`;
    case States.MISERABLE:
      return `${this.name} is miserable and very hungry!`;
    default:
      return `${this.name} is here.`;
  }

};

/**
 * Update the pet's appearance based on its type and state
 *
 * Implement this method to set the pet's appearance property
 * based on its current type and state
 * Include speech bubble if the pet is speaking
 */
Pet.prototype.updateAppearance = function () {

  //get art for the pet's type
  const typeArt = petArt[this.type] || petArt[PetTypes.COW];

  //get art for pet's current state
  const art = typeArt[this.state] || typeArt[States.NEUTRAL];

  // create speech bubble
  if (this.isSpeaking && this.speechText) {
    const bubbleWidth = Math.min(40, Math.max(this.speechText.length + 4, 10));
    const top = ' ' + '_'.repeat(bubbleWidth);
    const bottom = ' ' + '-'.repeat(bubbleWidth);
    const text = '| ' + this.speechText.padEnd(bubbleWidth - 2, ' ') + ' |';

    this.appearance = `${top}\n${text}\n${bottom}\n \\  ${art}`;
  } else {
    this.appearance = art;
  }
  //log for appearance update
  console.log('updateAppearance called for', this.name);
};

// Export the Pet constructor and any necessary constants
export { Pet, PetTypes, States };
