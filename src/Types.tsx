export type blankTokenValues = ["NOUN", "VERB", "ADBVERB", "ADJECTIVE"];

export type MadlibsState = {
  rawParagraph?: string;
  parsedParagraph?: Array<string | blankTokenValues>;
};

/*
parsedParagraph:
["The dog walked to the", "NOUN", "and then it", "VERB"]


[{text: "Blah blah story"}, {blank: "adjective"}]
*/
