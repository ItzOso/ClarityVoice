import OpenAI, { toFile } from "openai";
import functions from "firebase-functions";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const transcribeAudio = functions.https.onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "No authorization token was found."
      );
    }

    if (!request.data.audioBase64) {
      throw new functions.Https.HttpsError(
        "invalid-argument",
        "Must send over the audioBase64."
      );
    }

    const audioBuffer = Buffer.from(request.data.audioBase64, "base64");
    const audioFileToUpload = await toFile(audioBuffer, "audio.webm");

    console.log(
      `Received audioBase64 length: ${request.data.audioBase64.length}`
    ); // Log input length

    // --- Audio Processing ---
    console.log(`Converted audioBuffer length: ${audioBuffer.length}`); // Log buffer length

    if (audioBuffer.length === 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Processed audio buffer is empty. Check Base64 encoding on the client."
      );
    }

    console.log("Sending buffer to OpenAI Whisper API...");

    const transcription = await client.audio.transcriptions.create({
      file: audioFileToUpload,
      model: "whisper-1",
    });

    return { text: transcription.text };
  } catch (error) {
    console.log(error);
    throw new functions.https.HttpsError(error.code, error.message);
  }
});
