// a thing to put images up there from a stream.

let twit = require('twit')
var Jimp = require('jimp');
const { exec } = require('child_process');


let flash = require('flaschenode')

flash.layer = 13;
flash.initBuffer();

let keys = require('./keys/apikeys.js')


let display_tweets = [];
keys.timeout_ms =   60*1000
var T = new twit(keys)


let tweetInfo = {
  id: 0,
  user:{name:"", screen_name: ""},
  entities:{media: []},
  text: "",
  img_link:""
}

let text_process = null;

let imglink = ''

var stream = T.stream('statuses/filter', {
  track: [ "noisebridge", "@noisebridge", "Noisebridge", 'dogs' ]})

stream.on('tweet', (tweet_stream) => {
  console.log('tweet stream tweet', tweet_stream.entities)
  let tweet_ent = tweet_stream.entities;


  if(tweet_ent.media) {

    console.log('there s media with this one')
    tweetInfo.img_link = tweet_ent.media[0].media_url
    flashImage( tweetInfo.img_link );

    let tweetTexxt = "@" + tweet_stream.user.screen_name + ": " + tweet_stream.text;


    sendCommand = "./send-text -f 4x6.bdf -o 999999 -c 011111 -g 45x35 -h \"ft.noise\" -l 15   \"" + tweetTexxt + " \" "

    if( text_process ) {
      text_process.kill();
    }

    text_process = exec(sendCommand, (err, stdout, stderr) => {
      if(err) {
        console.log(err)
      }
      console.log('stdout is , ', stdout)
    })
  }


  //flashImage(imglink)

})


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
