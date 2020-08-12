'use strict';
//Initialize libraries
const { dialogflow }  = require('actions-on-google');
const functions = require('firebase-functions');

//Initialize contants
const  images  = require('./images');
const  constants  = require('./constant');
const {
  BasicCard,
  Image,
  Suggestions,
} = require('actions-on-google');

const app = dialogflow({debug: true});
  
  app.intent('learn.quit_app', (conv) => {
    conv.close(`Have a good day! come back again. Bye!`);
  });

  app.intent('learn.fallback', (conv) => {
    conv.close(`Sorry Couldn't get that, can you say it again. Say Something from A to Z Alphabets!`);
  });
 
  app.intent('learn.start', (conv) => {
      // [START asdk_js_basic_card]
      if (!conv.screen) {
        conv.ask('Sorry, try this on a screen device or select the ' +
          'phone surface in the simulator.');
        return;
      }
  
    conv.ask(`Welcome to ABC Learner!!Lets start learning the Alphabets, see the screen for Alphabet`);
    conv.ask(new Suggestions(`A`));
  });

  app.intent('learn.alphabet',(conv,params) => {
    // [START asdk_js_basic_card]
    if (!conv.screen) {
      conv.ask('Sorry, try this on a screen device or select the ' +
        'phone surface in the simulator.');
      return;
    }
    if((params.alphabet.charCodeAt(0) >= 65 && (params.alphabet.charCodeAt(0)) <= 90) || (params.alphabet.charCodeAt(0) >=97 && params.alphabet.charCodeAt(0) <= 122)){
      var index = constants.ALPHABETS.indexOf(String.fromCharCode(params.alphabet.charCodeAt(0)));
        if(params.alphabet.charCodeAt(0) == 90 || params.alphabet.charCodeAt(0) == 122){
          conv.ask(` This is `+images.IMAGES[index].alphabet);
          conv.ask(new BasicCard({
            title: images.IMAGES[index].alphabet,
            image: new Image({
              url: constants.BASE_IMG_URL+images.IMAGES[index].img,
              alt: images.IMAGES[index].alphabet,
            }),
            display: 'CROPPED',
          }));
        conv.close(`Great You Reached the Last Alphabet,You Remeber it all! Well Done. Bye for now, See you later`);
        }else{
          conv.ask(` This is `+images.IMAGES[index].alphabet);
          conv.ask(new BasicCard({
            title: images.IMAGES[index].alphabet,
            image: new Image({
              url: constants.BASE_IMG_URL+images.IMAGES[index].img,
              alt: images.IMAGES[index].alphabet,
            }),
            display: 'CROPPED',
          }));
        conv.ask(`Lets say the next Alphabet Dear!`);
        conv.ask(new Suggestions(String.fromCharCode((params.alphabet.charCodeAt(0)+1))));
        }  
    
   }else{
    conv.ask(`Sorry, Let's start again, I coudln't get that.You can say any word from A to Z`);      
   }
  });


// HTTP Cloud Function for Firebase handler
exports.InspireMe = functions.https.onRequest(app);