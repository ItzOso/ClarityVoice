import OpenAI, { toFile } from "openai";
import functions from "firebase-functions";
import dotenv from "dotenv";
import { HttpsError, onCall } from "firebase-functions/https";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const transcribeAudio = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "No authorization token was found."
      );
    }

    if (!request.data.audioBase64) {
      throw new HttpsError(
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
      throw new HttpsError(
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
    throw new HttpsError(error.code, error.message);
  }
});

export const polishTranscription = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "No authorization token was found."
      );
    }

    const transcription = request.data.transcription;

    if (!transcription) {
      throw new HttpsError(
        "invalid-argument",
        "Must send over the transcription."
      );
    }

    const prompt = `You are a helpful assistant that takes a rough voice note transcription and turns it into a polished, well-written note.

Here’s what you should do:
- Keep all the ideas and details the speaker mentioned.
- Remove filler words, false starts, repetition, and verbal clutter.
- Improve grammar, flow, and clarity.
- Write in a tone that feels natural, clear, and human — like how someone would write if they had time to organize their thoughts. Do NOT make it overly formal or robotic.
- Then, create a short, relevant title for the note that summarizes what it's about.

Do NOT shorten or summarize the message beyond cleaning up the structure.
Keep the speaker’s voice and personality intact — just help them express it better.

Return your response as **only** a JSON object in this format:
{
  "title": "Short, relevant title of the note",
  "content": "Full, cleaned-up version of the transcription with all key thoughts preserved"
}

Here is the transcription:
${transcription}
`;

    const response = await client.responses.create({
      model: "gpt-3.5-turbo",
      input: prompt,
    });

    return JSON.parse(response.output_text);
  } catch (error) {
    console.log(error);
    throw new HttpsError(error.code, error.message);
  }
});
