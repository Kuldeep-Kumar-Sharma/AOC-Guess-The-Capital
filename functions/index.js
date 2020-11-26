"use strict";
//Initialize libraries
const { dialogflow } = require("actions-on-google");
const functions = require("firebase-functions");

//Initialize contants
const COUNTRY_CAPITAL = require("./country-by-capital");
const { BasicCard, Image, Suggestions } = require("actions-on-google");

const app = dialogflow({ debug: true });

app.intent("guess.quit_app", (conv) => {
  conv.close(`Have a good day! come back again. Bye!`);
});

app.intent("guess.fallback", (conv) => {
  conv.close(
    `Sorry Couldn't get that, can you say it again. In order to exit just say cancel or stop!`
  );
});

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function genreateRandomCountryQuestion() {
  let randomCountry = getRndInteger(0, 244);
  let country = COUNTRY_CAPITAL[randomCountry].country;
  return `What is the Capital of ` + capital;
}

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
  if (params.alphabet.charCodeAt(0) == 122) {
    conv.ask(` This is ` + images.IMAGES[index].alphabet);
    conv.ask(
      new BasicCard({
        title: images.IMAGES[index].alphabet,
        image: new Image({
          url: constants.BASE_IMG_URL + images.IMAGES[index].img,
          alt: images.IMAGES[index].alphabet,
        }),
        display: "CROPPED",
      })
    );
    conv.close(
      `Great You Reached the Last Alphabet,You Remeber it all! Well Done. Bye for now, See you later`
    );
  } else {
    conv.ask(
      `Sorry, Let's start again, I coudln't get that.You can say any word from A to Z`
    );
  }
});

// HTTP Cloud Function for Firebase handler
exports.InspireMe = functions.https.onRequest(app);
