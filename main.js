
var config = require('./authStuff/Auth.json');
const Discord = require('discord.js');
const animefi = require('./faceDetection.js');
var fs = require('fs');
const { Console } = require('console');

const client = new Discord.Client();
client.login(config.token);
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


async function printDirectory(currentPath, callBack) {
  return new Promise(async (resolve, reject) => {
    try {
      items = fs.readdirSync(currentPath);
      //console.log(items);
      var index, len;
      len = items.length;
      for (index = 0, len = items.length; index < len; ++index) {
        item = items[index];
        //console.log("printing " + items[index]);
        //console.log(currentPath + " " + item);
        if (fs.existsSync(currentPath+item) && fs.lstatSync(currentPath+item).isDirectory()){
          printDirectory(currentPath+item+"/", callBack);
        } else {
          //console.log("before calling function");
          try {
            await callBack(currentPath+item);
          } catch (error) {
            reject("didn't print");
          }
          //console.log("after caling function"); 
        }
      
      }

    } catch {
      reject("couldn't find file");
    }
    resolve("success");
  });
  
}

async function listDirectory(currentPath, callBack) {
  message = "Here is a list of available folders:\n";
  fs.readdirSync(currentPath).forEach(async(item) => {
    message += item + "\n";
  })
  await callBack(message);

}

client.on('message', async message => {
  if (message.author.bot) return; // we don't want to react to bot messages

  if (message.content == "slep nsfw" || message.content == "Slep nsfw"){
    message.channel.send("https://youtu.be/ZZ5LpwO-An4");
    return;
  }

  //if (message.author.id != client.user.id){ // some messages sent by animefi-discord can trigger new messages, so don't react to any ones that are by this bot
    if (message.content.substr(0, 1) == config.prefix) {
      args = message.content.substr(1, message.content.length-1).split(' ');
      //console.log(args);
      switch(args[0]){
          case "price":
              console.log("dan's being stubborn about making a poor life decision at " + (new Date().toString()));
              message.channel.send("dan just use the website lmao this is more longwinded than opening a browser ");
              break;
          case "hello":
              message.channel.send("hello to yooooouuu! (✿◠‿◠)");
              break;
          case "animefi":
              var Attachment = (message.attachments).array();
              //console.log(Attachment); //outputs array
              //console.log(Attachment[0].url); //undefined
              if (Attachment.length > 0){
                try {
                  //for (attachment in Attachment){
                    var loadingMessageIds = [];
                    url = Attachment[0].url;
                    message.channel.send("Working hard. ᕙ(⇀‸↼‶)ᕗ");
                    loadingMessageIds.push(message.channel.lastMessageID);
                    var timer = setTimeout(()=>{
                      message.channel.send("Sowwy this is taking so long, have a mint. (つд｀)");
                      loadingMessageIds.push(message.channel.lastMessageID);
                    }, 20000);
                    await animefi.getFace({url});
                    clearTimeout(timer); // don't want to apologise for something we didn't do
                    //console.log("yep, then this bit is run");
                    // Send the attachment in the message channel
                    //console.log(url);
                    message.channel.send("Here you go. ♨(⋆‿⋆)♨", {
                      file: `./out/${url[url.length-1]}` // reads from disk because I'm lazy and this really won't get used whatsoever
                    }).then(()=>{
                      //console.log(`./out/${url[url.length-1]}`);
                      fs.unlink(`./out/${url[url.length-1]}`, () => {}); //permanently deletes file because I don't want none of your crap
                      
                    });
                  //}
                } catch (error) {
                  console.log(error);
                  message.channel.send("Something went wrong, I'm sowwy uwu. o(╥﹏╥)o");
                  return;
                }
              } else {
                message.channel.send("I need an image attached to the message to let me animefi(TM) you. (≧ω≦)");
              }
          break;
          case 'help':
            message.channel.send(`heyaa! ヽ(^◇^*)/
I'm a bot that can make your future anime cosplayer dreams come true.
Here is a list of my commands:
"!hello": A friendly greeting :),
"!animefi": Attach a picture of someone's face and I will try my very best to give them wonderful, vibrantly coloured hair! ❀◕ ‿ ◕❀,
"!help": Opens this dialog ツ
`
            );
          break;
          default:
              message.channel.send("That's not a valid command. Type \"!help\" for a list of commands. ლ(́◉◞౪◟◉‵ლ");
          break;
      }
    } else if (message.content.toLowerCase().indexOf("reee") != -1){
      message.channel.send("ヽ(ｏ`皿′ｏ)ﾉ RRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    }

    //console.log(message.author.id);
  //}
});