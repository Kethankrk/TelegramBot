// Importing things
const { Telegraf } = require("telegraf");
const axios = require("axios");
require('dotenv').config();


const teleApiToken = process.env.TELEGRAM_API_KEY;
const omdbApiToken = process.env.OMDB_API_KEY;

// Assignig the api key 
const bot = new Telegraf(teleApiToken);

// A condition to prevent user from using the bot before starting (IDK why. but people usually does this)
let Started = true;

// The start command
bot.start((ctx) => {
    Started = true;
    ctx.reply("Welcome!");
});

// The stop command
bot.command("stop", (ctx) => {
    Started = false;
    ctx.reply("Succesfuly Disactivated the Bot.");
});

// A route to get all the input form user
bot.on("message", (ctx) => {
    if (Started) { // Checking if the user has started the Bot
        const userInput = ctx.message.text.toLowerCase(); // Making user input lowercase to prevent unexpected errors (But the api will eventually make it lowercase)
        if (userInput == "hi" || userInput == "hello" || userInput == "hey") { // To greet the user
            ctx.reply("Hello how can i help you.");
        }    
        else {
            
            const movieFetch = async (movieName) => { // An aync function to fetch the movie details from OMDB api
                try {
                    const fetchData = await axios.get(
                        `http://www.omdbapi.com/?apikey=${omdbApiToken}=${movieName}`
                    );
                    const movieData = fetchData.data // For the sake of simplicity
                    
                    try{
                        if(movieData.Poster){ // Checking whether the result have a poster or not
                            let captionText = `*Title*:  ${movieData.Title} \n*Year*:  ${movieData.Year} \n*Rated*:  ${movieData.Rated} \n*Released Year*:  ${movieData.Released} \n*Genre*:  ${movieData.Genre} \n*Director*:  ${movieData.Director} \n\n*IMDB Rating*: ${movieData.imdbRating}` 
                            ctx.replyWithPhoto( // to make the image and text come in a single message reply
                                movieData.Poster, // The image url obtained from the api
                                {
                                    caption: captionText, parse_mode: "Markdown", // the text detailes obtainde from the api( formatted )
                                }
                            );
                        }
                        else if(movieData.Title != undefined){ // checking if the requested title is avilable or not
                            ctx.replyWithMarkdownV2(`*Title*:  ${movieData.Title} \n*Year*:  ${movieData.Year} \n*Rated*:  ${movieData.Rated} \n*Released Year*:  ${movieData.Released} \n*Genre*:  ${movieData.Genre} \n*Director*:  ${movieData.Director} \n\n*IMDB Rating*: ${movieData.imdbRating}`)
                        }
                        else{ // Else the requested movie is not found
                            ctx.reply(`No fillim name ${userInput} found`)
                        }
                    }
                    catch(error){ // Error handling
                        console.log("Something went wrong")
                    }
                } catch (error) { // Error handling
                    console.log("Something went wrong");
                    ctx.reply("Something went wrong");
                }
            };

            movieFetch(userInput); // Calling the movieFetch function
        }
    }
});

bot.launch();
