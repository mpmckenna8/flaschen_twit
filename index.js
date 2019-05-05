let twit = require('twit')
let sharp = require('sharp');
let getPixels = require('get-pixels')
var Jimp = require('jimp');
const { exec } = require('child_process');


// command to put text on the flaschentashen
// ./send-text -f fonts/6x9.bdf -h "ft.noise" -l 10   "what the heck"
let flash = require('flaschenode')

flash.layer = 13;
flash.initBuffer();


let keys = require('./keys/apikeys.js')
/*
Jimp.read('sfMountainBike.jpeg', (err, lenna) => {
  if (err) throw err;

  lenna
    .resize(45, 35) // resize
    .quality(20) // set JPEG quality
  //  .greyscale() // set greyscale
    //.write('lena-small-bw.jpg'); // save



    let pixi = Jimp.intToRGBA(lenna.getPixelColor(2, 2));
    console.log('pixel color ,', pixi)
});
*/
let display_tweets = [];
keys.timeout_ms =   70*1000
var T = new twit(keys)
let query_limit = 1000;
let img_links = [];
let imglink = ""

T.get('search/tweets', {q: "noisebridge Filter:images", count: query_limit }, (err, data, res) => {

  if(err) {
    console.log('err searching tweets')
  }
  else {

  console.log('data back', data)


  let tweets = data.statuses;
  let tweetIndex = 0;
  let tweet = data.statuses[tweetIndex];

//    console.log('tweet , ', tweet)
    for( i of tweets ) {

        let tweetInfo = {
          id: 0,
          user:{name:"", screen_name: ""},
          entities:{media: []},
          text: "",
          img_link:""
        }

      console.log('tweet id', i.id)
      console.log('user , ',i.user )

      tweetInfo.id = i.id;
      tweetInfo.user.name = i.user.name;
      tweetInfo.text = i.text;
      tweetInfo.user.screen_name = i.user.screen_name;

      if( i.entities.media ) {
        console.log('entities for a displayable tweet, ', i.entities.media)

        tweetInfo.entities.media = i.entities.media
        tweetInfo.img_link = i.entities.media[0].media_url
        console.log('pushing,' , tweetInfo)
        display_tweets.push(tweetInfo);

      }

    //  console.log(i.text)
    }



  console.log('display tweets', display_tweets)


let text_process = null;

setInterval( () => {

  let randIndex = Math.floor ( Math.random() * display_tweets.length )

  tweetTexxt = "@" + display_tweets[ randIndex ].user.screen_name + ": " + display_tweets[ randIndex ].text;


  sendCommand = "./send-text -f 4x6.bdf -o 999999 -c 011111 -g 45x35 -h \"ft.noise\" -l 15   \"" + tweetTexxt + " \" "

  console.log('random index,' , randIndex)
  console.log('should be displaying, ',  display_tweets[ randIndex])


  flashImage( display_tweets[ randIndex].img_link );

  if( text_process ) {
    text_process.kill();
  }

  text_process = exec(sendCommand, (err, stdout, stderr) => {
    if(err) {
      console.log(err)
    }
    console.log('stdout is , ', stdout)
  })



}, keys.timeout_ms)


  }


})



/*
var stream = T.stream('statuses/filter', {
  track: [ "noisebridge", "@noisebridge", "Noisebridge" ]})

stream.on('tweet', (tweet_stream) => {
  console.log('tweet stream tweet', tweet_stream.entities)
  let tweet_ent = tweet_stream.entities;

  if(tweet_ent.media) {
    imglink = tweet_ent.media[0].media_url
    flashImage(imglink)
  }
  //flashImage(imglink)

})

setInterval( () => {

  flashImage( img_links[ Math.floor ( Math.random() * img_links.length) ] )

}, 5000)

*/

function flashImage(img_uri) {
  flash.layer = 13

Jimp.read(img_uri, (err, img) => {
  if (err) throw err;
  let x = 45, y=35;

  img
    .resize(45, 35) // resize
    .quality(2) // set JPEG quality
  //  .greyscale() // set greyscale
    //.write('lena-small-bw.jpg'); // save

    for( let xi = 0; xi < x; xi++) {
      for( let yi = 0; yi <y ; yi++) {

        let pixi = Jimp.intToRGBA(img.getPixelColor(xi, yi));
        flash.set(xi, yi, [pixi.r, pixi.g,pixi.b])
      //  console.log('pixel color ,', pixi)

        }
    }
    flash.show()
});

}
