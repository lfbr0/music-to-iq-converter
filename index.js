import { similarity } from './levenshtein.js'
import { artistSatMap } from './artist-sat-map.js'


//HTML Elements
const button = document.getElementById("button");
const textbox = document.getElementById("textbox");
const mainDiv = document.getElementById("main-div");
const result = document.getElementById("result");
const message = document.getElementById("message");
const resultImage = document.getElementById("result-image");


//Meme Images URL
const bigBrainMemeImageUrl = "https://pyxis.nymag.com/v1/imgs/3fc/bf2/ba6e24521b5a7dc0fb88343eeacd19d64e-wojak-02.w710.jpg";
const brainletMemeImageUrl = "https://www.memeatlas.com/images/brainlets/brainlet-titanic-brain.png";
const normieMemeImageUrl = "https://upload.wikimedia.org/wikipedia/en/c/cc/Wojak_cropped.jpg";


//Result header and message
result.style.display = 'none';
message.style.display = 'none';
resultImage.style.display = 'none';
message.innerText = `Don't take the results seriously. 
They're estimated based on the 'Music That Makes You Dumb' meme chart 
and Meredith C. Frey and Douglas K. Detterman's 2004 study 'Scholastic Assessment or g?' for the SAT to IQ formula
`;


//Meme function that converts SAT to IQ (see source on data)
const adjustmentVariable = 7.6;
const satToIq = sat => sat*0.074813 + 34.21399 - adjustmentVariable;


const displayResult = (prefixMessage, estimatedIq) => {
    result.innerText = prefixMessage + estimatedIq;
    result.style.display = 'block';
    result.style.color = 'blue';
    mainDiv.appendChild(result);
    //Message for feelings that may be hurt
    message.style.display = 'block';
    mainDiv.appendChild(message);
    //Meme image url
    if (estimatedIq >= 110 && estimatedIq < 130)
        resultImage.src = normieMemeImageUrl;
    else if (estimatedIq >= 130)
        resultImage.src = bigBrainMemeImageUrl;
    else
        resultImage.src = brainletMemeImageUrl;
    //Set style for image
    resultImage.style.display = 'block';
    resultImage.style.marginLeft = 'auto';
    resultImage.style.marginRight = 'auto';
    resultImage.style.width = '50%';
}



//Event listener to button that does the magic
button.addEventListener("click", () => {

    const input = textbox.value.trim();

    if (input.trim().length == 0) {
        result.innerText = "You have to give me an artist, band or genre...";
        result.style.display = 'block';
        result.style.color = 'red';
        mainDiv.appendChild(result);
    }
    else {
        
        let estimatedIq;
        let prefixMessage;

        if (!(input in artistSatMap)) {
            
            //Try to find any match >80%
            const possibleArtists = Object.keys(artistSatMap)
                .filter(artist => similarity(artist, input) > 0.8);
            
            if (possibleArtists.length == 0) {
                prefixMessage = "Couldn't find anything. Make an issue on GitHub with the input it's added later. Just click the little cat on the corner, by the way, to open GitHub repository."
                result.innerText = prefixMessage;
                result.style.display = 'block';
                result.style.color = 'red';
            }
            else {
                const possibleArtist = possibleArtists[0];
                estimatedIq = Math.ceil( satToIq( artistSatMap[possibleArtist] ) );
                prefixMessage = "I assume you can't write and meant " + possibleArtist + ". Your IQ is probably ";
                displayResult(prefixMessage, estimatedIq);
            }

        }
        else {
            estimatedIq = Math.ceil( satToIq( artistSatMap[input] ) );
            prefixMessage = "Your IQ is probably  ";
            displayResult(prefixMessage, estimatedIq);
        }

    }

})