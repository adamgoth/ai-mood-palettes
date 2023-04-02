import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const text = req.body.text || '';
  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter text to generate a palette',
      },
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful design assistant and an expert with color schemes.',
        },
        { role: 'user', content: generatePrompt(text) },
      ],
      temperature: 0.6,
    });
    res
      .status(200)
      .json({ result: completion.data.choices[0].message.content });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}

function generatePrompt(text) {
  return `I'm going to give you a passage of text. I want you to analyze the mood of the text and then generate 5 palettes, each containing 5 colors in hex format. Each palette should be unique. Do not repeat exact colors within the same palette. Do not repeat palettes. Output the palettes a single array of 5 arrays like this:

  Sample output: 
  [["#8B4513", "#708238", "#BDB76B", "#A9A9A9", "#F5DEB3"],["#8B4513", "#708238", "#BDB76B", "#A9A9A9", "#F5DEB3"]]
  
  Here are some additional instructions: Only output the array and nothing else. Do not add any text to your reply.
  
  The text:
  ${text}`;
}
