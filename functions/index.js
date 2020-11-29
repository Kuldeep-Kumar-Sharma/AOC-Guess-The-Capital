"use strict";
//Initialize libraries
const { dialogflow } = require("actions-on-google");
const functions = require("firebase-functions");
const { BasicCard, Image, Suggestions } = require("actions-on-google");

//Initialize contants
const COUNTRY_CAPITAL = require("./country-by-capital");
const app = dialogflow({ debug: true });
var answer = "";
var answer_count = 4;
var score = 0;

/**
 *Quiting the app Intent.
 *INTENT NAME: guess.quit_app
 *Conversation Output: shows score,cloing conversation.
 */
app.intent("guess.quit_app", (conv) => {
  conv.close(
    showScore() + `Thanks for Playing, Have a good day! come back again. Bye!`
  );
});

/**
 *fallback Intent.
 *INTENT NAME: guess.fallback
 *Conversation Output: checking the chances,cloing conversation.
 */
app.intent("guess.fallback", (conv) => {
  answer_count = answer_count - 1;
  if (answer_count > 0) {
    conv.ask(
      `Sorry, I Couldn't  get that, you have ${answer_count} more chances to say the anser right!`
    );
  } else {
    conv.close(
      `Sorry Couldn't get that, can you say it again. In order to exit just say cancel or stop!`
    );
  }
});

/**
 *getRndInteger
 * @param {INT} min
 * @param {INT} max
 * Generates the random number from minumum and maximum range
 */
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * genreateRandomConuntryQuestion()
 * Generates a random question based on Random Number on Country's capital.
 */
function generateRandomCountryQuestion() {
  let randomCountry = getRndInteger(0, 244);
  let country = COUNTRY_CAPITAL[randomCountry].country;
  return `What is the Capital of ` + country;
}

/**
 * showScore()
 * returns the score.
 */
function showScore() {
  return `Your Score is ${score}`;
}

/*
 *start Intent.
 *INTENT NAME: guess.start
 *Conversation Output: checking the chances,cloing conversation.
 */
app.intent("guess.start", (conv) => {
  // [START asdk_js_basic_card]
  if (!conv.screen) {
    conv.ask(
      "Sorry, try this on a screen device or select the " +
        "phone surface in the simulator."
    );
    return;
  }
  conv.ask(
    `Welcome to Guess The Capital Game !! Let's start by 
    guessing the capital of any country I ask from you. You can go wrong twice only.`
  );
  conv.ask(generateRandomCountryQuestion());
});

app.intent("guess.capital", (conv, params) => {
  // [START asdk_js_basic_card]
  if (!conv.screen) {
    conv.ask(
      "Sorry, try this on a screen device or select the " +
        "phone surface in the simulator."
    );
    return;
  }
  if (answer_count == 0) {
    conv.ask(
      `You have reached the maximum number of Attempts, Your Score is ` +
        showScore()
    );
  }
  if (params.capital == answer) {
    conv.ask(`Congratulation's you gave the right answer!`);
    conv.ask(`Here is the next Question` + genreateRandomCountryQuestion());
  } else {
    answer_count = answer_count - 1;
    conv.ask(
      `Sorry, I Couldn't  get that, you have ${answer_count} more chances to say the anser right!`
    );
  }
});

// HTTP Cloud Function for Firebase handler
exports.InspireMe = functions.https.onRequest(app);
