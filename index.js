const tmi = require('tmi.js');

var starts = [];
var ends = [];
var followings = {
    
};
const options = {
    options:{
        debug: true,
    },
    connection:{
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
        username: '',
        password: 'oauth:',
    },
    channels: [''],
};

const client = new tmi.client(options);

client.connect();

client.on('connected', (address, port) => {
    client.action('twitch', 'hello world!');
});


// Steps to bot learning (part 1):

// 1. have the bot parse out different words that appear in a twitch message. check for spaces. (maybe hard)

// 2. for each message, check if the word exists in the database already. if so skip to step 3. (easy)

// 2a. if word is new, add it to database, proceed to step 3. (easy)

// 3. words have a list of words following them. this list is always empty on new words. append word that appears after current word. (hard)

// 4. pick out first and last words in message, put them in their own category called start and end. (possibly easy)

// producing langugae (part 2):

// 1. pick random initial word from start list (easy)

// 2. loop through words and following lists to pick out new words to follow. (shouldnt be hard)

// 3.if the word falls within the end space, append period and exit loop. (should be easy).

client.on('chat', (channel, user, message, self) => {
    var args = message.split(" ");
    if(args[0] === '!makesen'){
        client.action('deevante', makeSen());
    }
    if(args[0] === '!join'){
        client.join(args[1]);
    }
    var sen = message.split(" ");
    var i;
    for(i = 0; i < sen.length; i++) {
        var curr = sen[i];
        if (i == 0 && starts.includes(sen[i]) == false){
            starts.push(sen[i]);
        }
        if (i == sen.length-1){
            if (ends.includes(sen[i]) == false){
                ends.push(sen[i]);
            }
        }
         else{
             if (followings[curr]){
                 followings[curr].push(sen[i+1]);
             }
             else{
                 followings[curr] = [sen[i+1]];
             }
         }
    }
});

function makeSen(){
    var roller = 1;
    var sen = "";
    var start = starts[Math.floor(Math.random()*starts.length)];
    if (!(followings[start])){
        return start;
    }
    sen += start + " ";
    curr = followings[start][Math.floor(Math.random()*followings[start].length)]
    while(followings[curr] &&  roller > .5){
        sen += curr+ " ";
        curr = followings[curr][Math.floor(Math.random()*followings[curr].length)];
        if (ends.includes(curr)){
            roller = Math.random();
        }
    }
    sen += curr +"";
    return sen;
}