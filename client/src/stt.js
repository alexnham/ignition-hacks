// Install the Deepgram JS SDK
// npm install @deepgram/sdk

const { createClient } = require("@deepgram/sdk");
const fs = require("fs");

const transcribeFile = async () => {
  const deepgram = createClient("DEEPGRAM_API_KEY");
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    fs.readFileSync(fileName),
    {
      model: "nova-2",
      smart_format: true,
    }
  );

  if (error) throw error;
  if (!error) console.dir(result, { depth: null });
};

transcribeFile();