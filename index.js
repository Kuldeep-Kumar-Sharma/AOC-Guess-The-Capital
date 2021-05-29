"use strict";
//Initialize libraries
const { dialogflow } = require("actions-on-google");
const express = require("express");
const bodyParser = require("body-parser");

//Initialize contants
const COUNTRY_CAPITAL = require("./country-by-capital-city");
const app = dialogflow({ debug: true });
var answer = "";
var answer_count = 4;
var score = 0;

/**
 * @function initConversations()
 * reset the score,answer and answer_count
 */
function initConversations() {
  answer = "";
  answer_count = 4;
  score = 0;
}

/**
 *Quiting the app Intent.
 *INTENT NAME: guess.quit_app
 *Conversation Output: shows score,cloing conversation.
 */
app.intent("guess.quit", (conv) => {
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
      `Sorry, I Couldn't  get that, you have ${answer_count} more chances to say the right answer or in order to pass the question please say Pass and to exit just say cancel or stop!`
    );
  } else {
    conv.close(
      showScore() + `Thanks for Playing, Have a good day! come back again. Bye!`
    );
  }
});

/**
 * @function getRndInteger()
 * @param {INT} min
 * @param {INT} max
 * Generates the random number from minumum and maximum range
 */
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @function genreateRandomConuntryQuestion()
 * Generates a random question based on Random Number on Country's capital.
 */
function generateRandomCountryQuestion() {
  let randomCountry = getRndInteger(0, 244);
  let country = COUNTRY_CAPITAL[randomCountry].country;
  answer = COUNTRY_CAPITAL[randomCountry].city;
  return `What is the Capital of ` + country;
}

/**
 * @function showScore()
 * returns the score.
 */
function showScore() {
  let capturingTheLastScore = ` Your Score is ${score}`;
  initConversations();
  return capturingTheLastScore;
}

/**
 *start Intent.
 *INTENT NAME: guess.start
 *Conversation Output: welcome message,first question.
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

/**
 *skip Intent.
 *INTENT NAME: guess.skip
 *Conversation Output: passing message and question again.
 */
app.intent("guess.skip", (conv) => {
  // [START asdk_js_basic_card]
  if (!conv.screen) {
    conv.ask(
      "Sorry, try this on a screen device or select the " +
        "phone surface in the simulator."
    );
    return;
  }
  conv.ask(
    `Alright I get that. I am passing this question for you, here is the next question`
  );
  conv.ask(generateRandomCountryQuestion());
});

/**
 *checking Intent.
 *INTENT NAME: guess.capital
 *Conversation Output: checking the capital,and another question.
 */
app.intent("guess.capital", (conv, params) => {
  // [START asdk_js_basic_card]
  if (!conv.screen) {
    conv.ask(
      "Sorry, try this on a screen device or select the " +
        "phone surface in the simulator."
    );
    return;
  }
  if (params.capital_name && params.capital_name.trim() == answer.trim()) {
    conv.ask(`Congratulation's you gave the right answer!`);
    conv.ask(`Here is the next Question` + generateRandomCountryQuestion());
  } else {
    answer_count = answer_count - 1;
    if (answer_count > 0) {
      conv.ask(
        `Sorry, I Couldn't  get that, you have ${answer_count} more chances to say the right answer or in order to pass the question please say Pass and to exit just say cancel or stop!`
      );
    } else {
      conv.close(
        showScore() +
          `Thanks for Playing, Have a good day! come back again. Bye!`
      );
    }
  }
});

const port = process.env.PORT || 3000;
express().use(bodyParser.json(), app).listen(port);
