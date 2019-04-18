let twit = require('twit')
let sharp = require('sharp');
let getPixels = require('get-pixels')
var Jimp = require('jimp');


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

keys.timeout_ms =   60*1000
var T = new twit(keys)
let query_limit = 10;
let img_links = [];
let imglink = ""

T.get('search/tweets', {q: "noisebridge Filter:images", count: query_limit }, (err, data, res) => {

  if(err) {
    console.log('err searching tweets')
  }
  else {
  console.log(data)
  let tweetIndex = 0;
  let tweet = data.statuses[tweetIndex].entities;
    console.log('tweet , ', tweet)

  while( ! tweet.media && tweetIndex < query_limit ) {

    tweetIndex = tweetIndex+1;
    tweet = data.statuses[tweetIndex].entities;
  }

  console.log('media!!!', tweet.media)

  imglink = tweet.media[0].media_url;

  img_links.push(imglink)

  flashImage(imglink)
  }

})

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



function flashImage(img_uri) {


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
