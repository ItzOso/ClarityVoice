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

    const prompt = `You are a helpful assistant that takes a rough voice note transcription and turns it into a polished, well-written note — but without losing the speaker’s personality.

Here’s what you should do:
- Keep every idea, detail, and nuance the speaker shared.
- Clean up filler words, false starts, repetition, and verbal clutter — but only when they don’t add meaning or tone.
- Improve grammar, flow, and readability while preserving the speaker’s natural rhythm, voice, and style.
- The final result should feel like something the speaker would’ve written if they had time to organize their thoughts — casual, human, clear. Not robotic, generic, or overly formal.
- Keep casual phrases, and personality quirks when they add to the speaker’s expression.

After polishing, generate a short, relevant title for the note that reflects its main topic or update.

Do NOT summarize or overly compress the message — this is about clarity, not brevity.

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
      temperature: 0.7,
    });

    return JSON.parse(response.output_text);
  } catch (error) {
    console.log(error);
    throw new HttpsError(error.code, error.message);
  }
});

export const smartStructure = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "No authorization token was found."
      );
    }

    const content = request.data.content;
    const chosenOption = request.data.chosenOption;

    if (!content) {
      throw new HttpsError("invalid-argument", "Must send over the content");
    }

    if (!chosenOption) {
      throw new HttpsError(
        "invalid-argument",
        "Must send over the chosen structuring option"
      );
    }

    const structuringOptions = {
      summarize: `You are an AI assistant. The user provides their current note text below. This text might be an initial polished thought, manually edited, or the result of a previous structuring attempt (e.g., an email or list).
Your task is to generate a concise summary (aim for 20-30% of the original length) that extracts the core message and key takeaways from the *underlying informational content*.
It's important to preserve the user's inherent writing style and tone as much as possible within the summary.
The summary should be clear, easy to understand, and flow naturally, reflecting the essence of the original ideas rather than just summarizing any pre-existing structure. Avoid making the summary sound overly robotic or generic.
Text: ${content}`, // Replace ${content} with the actual note content variable

      bullet_points: `You are an AI assistant. The user provides their current note text below. This text might be an initial polished thought, manually edited, or the result of a previous structuring attempt.
Convert the *underlying informational content* of this text into a structured bullet point list.
Focus on identifying distinct key points, actionable items, or main topics. Combine related ideas where it enhances clarity and conciseness.
When phrasing the bullet points, try to maintain the user's inherent style and tone where appropriate, while ensuring each point is clear and easy to scan. If action items are implied, phrase them actively.
Ignore or adapt any pre-existing formatting (like email salutations) if it's not part of the core message to be bulleted.
Text: ${content}`,

      email_draft: `You are an AI assistant. The user provides their current note text below. This text might be an initial polished thought, manually edited, or even a differently formatted document.
Transform the *core message* of this text into a well-drafted email. If the input already resembles an email, refine it for clarity and effectiveness; otherwise, create the email structure from the main ideas.
Begin with a concise and relevant subject line. Then, structure the email body clearly.
Crucially, aim to write the email body in a way that reflects the user's inherent style and tone (as discernible from the input text), while still ensuring the email is effective and appropriate for its likely purpose. 
Try to match the emails tone and style as close to the note as possible.
Assume the email is being sent to someone generally familiar with the topic unless context strongly suggests a introduction is needed.
Text: ${content}`,

      formal_tone: `You are an AI assistant. The user provides their current note text below. This text might be an initial polished thought, manually edited, or the result of a previous structuring attempt. Do the following regardless of its current formatting or style.
Your task is to rewrite it in a professional, precise, and polished tone that would be suitable for formal communication — such as a business update, academic context, or professional email — depending on the content.
Keep vocabulary elevated and grammar impeccable, but do not overcomplicate the language or make it sound robotic or excessively formal. Aim for clarity, conciseness, and tone appropriate to the subject matter.
If needed, restructure the content for better logical flow. Break it into clear paragraphs or sections when appropriate.
Text:
${content}`,

      casual_clear: `You are an AI assistant. The user provides their current note text below. This text might be an initial polished thought, manually edited, or the result of a previous structuring attempt.
Rewrite the *entire informational content* of this text in a casual, friendly, and exceptionally clear style, regardless of its current formatting or style.
Use simple, everyday language, and ensure sentences are short, easy to read, and flow naturally.
The goal is a warm, approachable, and easily digestible tone. The original tone should be intentionally transformed to be more relaxed and accessible.
Text: ${content}`,
      blog_post_draft: `You are an AI assistant. The user provides their current note text below. This text might be an initial polished thought, manually edited, or the result of a previous structuring attempt.
Your task is to transform this text into a draft for a blog post.
Suggest a compelling title for the blog post.
Create an engaging introduction to grab the reader's attention.
Structure the main content with clear paragraphs, and use subheadings if the content warrants it for better readability.
Provide a concluding thought or call to action if appropriate.
Aim for a readable and engaging style suitable for a blog, while trying to maintain the user's inherent style and tone from the input text.
Text: ${content}`,
      action_items: `You are an AI assistant. The user provides their current note text below. This text might be an initial polished thought, manually edited, or the result of a previous structuring attempt (often from a meeting or lecture).
Your specific task is to scan this text thoroughly and extract only the clear, actionable tasks, to-do items, or explicit action points assigned to someone or implied as needing to be done.
Present these as a concise bullet point list. Each bullet point should represent a distinct action.
Phrase each action item clearly and directly, starting with an action verb if possible (e.g., "Send email to...", "Research options for...", "Finalize report on...").
If no specific action items are found, please indicate that clearly (e.g., "No specific action items found.").
Do not include general discussion points unless they are explicitly framed as tasks.
Text: ${content}`,
    };

    const response = await client.responses.create({
      model: "gpt-3.5-turbo",
      input: structuringOptions[chosenOption],
      temperature: 0.65,
    });

    return response.output_text;
  } catch (error) {
    console.log(error);
    throw new HttpsError(error.code, error.message);
  }
});
