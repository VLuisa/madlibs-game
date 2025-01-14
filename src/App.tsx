import { useState, useEffect } from "react";
import OpenAI from "openai";

function countInstances(arr: Array<any>, key: string): number {
  const result = arr.filter((item) => "blank" in item && item.blank === key);
  return result.length;
}

function getRandomInt(max: number) {
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * maxFloored); // The maximum is exclusive and the minimum is inclusive
}

const getFieldsFromLine = (line, rawVerbs: string, rawNouns: string) => {
  const verbs = rawVerbs.split(" ");
  const nouns = rawNouns.split(" ");

  if (line.text) {
    return line.text;
  }
  const isVerb = line.blank === "verb";
  if (isVerb) {
    const verbIndex = getRandomInt(verbs.length);
    return <b>{verbs[verbIndex]}</b>;
  }
  const nounIndex = getRandomInt(nouns.length);
  return <b>{nouns[nounIndex]}</b>;
};

const App = () => {
  const [content, setContent] = useState([]);
  const [verbCount, setVerbCount] = useState(0);
  const [nounCount, setNounCount] = useState(0);
  const [renderStory, setRenderStory] = useState(false);
  const [verbs, setVerbs] = useState("");
  const [nouns, setNouns] = useState("");

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
                "Write a geeky madlibs style story. Limit parts of speech of blanks to nouns and verbs. Limit to no more than 4 verbs or nouns. Return it in the following format: [{text: 'The quick brown fox'},{blank: 'verb'},{text: 'over the lazy fence'}]. Only return the JSON of the story not formatted as a code block.",
            },
          ],
        });
        const contentResponse = completion.choices[0].message.content;
        const jsonResponse = JSON.parse(contentResponse!);

        console.log("message1", typeof JSON.parse(contentResponse!));
        console.log("object", jsonResponse);
        setContent(jsonResponse);
        setNounCount(countInstances(jsonResponse, "noun"));
        setVerbCount(countInstances(jsonResponse, "verb"));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAsync();
  }, []);

  const submitUserContent = (event) => {
    event.preventDefault();
    setRenderStory(true);
    // alert(`The verbs you entered: ${verbs}. The nouns you entered: ${nouns}`);
  };

  return (
    <div className="card">
      {renderStory ? (
        <div>
          {content.map((line) => getFieldsFromLine(line, verbs, nouns))}
        </div>
      ) : content.length > 0 ? (
        <>
          <form onSubmit={submitUserContent}>
            <label>
              Enter {verbCount} verbs:
              <input
                type="text"
                value={verbs}
                onChange={(e) => setVerbs(e.target.value)}
              />
            </label>
            <br />
            <label>
              Enter {nounCount} nouns:
              <input
                type="text"
                value={nouns}
                onChange={(e) => setNouns(e.target.value)}
              />
            </label>
            <br />
            <input type="submit" />
          </form>
        </>
      ) : (
        <>Generating story...</>
      )}
    </div>
  );
};

export default App;
