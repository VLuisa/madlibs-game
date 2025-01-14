import { useState, useEffect } from "react";
import OpenAI from "openai";

const App = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const openai = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true,
        });

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "developer", content: "You are a helpful assistant." },
            {
              role: "user",
              content:
                "Write a madlibs style story. Limit parts of speech of blanks to nouns and verbs. Return it in the following format: [{text: 'The quick brown fox'},{blank: 'verb'},{text: 'over the lazy fence'}]. Only return the JSON of the story not formatted as a code block.",
            },
          ],
        });
        const contentResponse = completion.choices[0].message.content + "";

        console.log("message1", contentResponse);
        setContent(contentResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAsync();
  }, []);

  return <div>{content}</div>;
};

export default App;
