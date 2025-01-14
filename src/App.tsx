import { useState, useEffect } from "react";
import OpenAI from "openai";

const verbs = ["run", "code", "eat", "sleep", "knit", "dance"];
const nouns = ["dog", "cup", "computer", "beanie", "train", "apple"];

function countInstances(arr: Array<any>, key: string): number {
  const result = arr.filter((item) => 'blank' in item && item.blank === key);
  return result.length
}

function getRandomInt(max: number) {
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * maxFloored); // The maximum is exclusive and the minimum is inclusive
}

const getFieldsFromLine = (line) => {
  if (line.text) {
    return line.text;
  }
  const isVerb = line.blank === "verb";
  if (isVerb) {
    const verbIndex = getRandomInt(verbs.length);
    return <b>{verbs[verbIndex]}</b>;
  }
  const nounIndex = getRandomInt(verbs.length);
  return <b>{nouns[nounIndex]}</b>;
};

const App = () => {
  const [content, setContent] = useState([]);
  const [verbCount, setVerbCount] = useState(0);
  const [nounCount, setNounCount] = useState(0);

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
                "Write a geeky madlibs style story. Limit parts of speech of blanks to nouns and verbs. Return it in the following format: [{text: 'The quick brown fox'},{blank: 'verb'},{text: 'over the lazy fence'}]. Only return the JSON of the story not formatted as a code block.",
            },
          ],
        });
        const contentResponse = completion.choices[0].message.content;
        const jsonResponse = JSON.parse(contentResponse!);

        console.log("message1", typeof JSON.parse(contentResponse!));
        console.log("object", jsonResponse);
        setContent(jsonResponse);
        setNounCount(countInstances(jsonResponse, 'noun'))
        setVerbCount(countInstances(jsonResponse, 'verb'))
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAsync();
  }, []);

  return <div>
    <p>verb count: {verbCount}</p>
    <p>noun count: {nounCount}</p>
    {content.map((line, index) => getFieldsFromLine(line))}</div>;
};

export default App;
