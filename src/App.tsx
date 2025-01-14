import { useState, useEffect } from "react";
import OpenAI from "openai";

const verbs = ["run", "code", "eat", "sleep", "knit", "dance"];
const nouns = ["dog", "cup", "computer", "beanie", "train", "apple"];

function getRandomInt(max) {
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * maxFloored); // The maximum is exclusive and the minimum is inclusive
}

const getContentFromLine = (line) => {
  if (line.text) {
    return line.text;
  }
  const isVerb = line.blank === "verb";
  if (isVerb) {
    const verbIndex = getRandomInt(verbs.length);
    console.log("verb index", verbIndex);
    return <b>{verbs[verbIndex]}</b>;
  }
  const nounIndex = getRandomInt(verbs.length);
  console.log("noun index", nounIndex);
  return <b>{nouns[getRandomInt(nouns.length)]}</b>;
};

const App = () => {
  const [content, setContent] = useState([]);

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
        const contentResponse = completion.choices[0].message.content;
        const jsonResponse = JSON.parse(contentResponse!);

        console.log("message1", typeof JSON.parse(contentResponse!));
        console.log("object", jsonResponse);
        setContent(jsonResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAsync();
  }, []);

  return <div>{content.map((line, index) => getContentFromLine(line))}</div>;
};

export default App;
