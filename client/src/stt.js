// index.js (node example)

const { createClient } = require("@deepgram/sdk");
const fs = require("fs");

const transcribeFile = async () => {
  // STEP 1: Create a Deepgram client using the API key
  const deepgram = createClient("d27deb12027a5ec2bb9d506957eb16789f9e1918");
  // STEP 2: Call the transcribeFile method with the audio payload and options
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    // path to the audio file
    fs.readFileSync("spacewalk.mp3"),
    // STEP 3: Configure Deepgram options for audio analysis
    {
      model: "nova-2",
      smart_format: true,
    }
  );

  if (error) throw error;
  // STEP 4: Print the results
  if (!error) console.dir(result, { depth: null });
};

module.exports = { transcribeFile }

