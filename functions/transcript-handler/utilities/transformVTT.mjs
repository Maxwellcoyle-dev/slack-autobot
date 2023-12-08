const parseVTT = (vttContent) => {
  if (!vttContent.startsWith("WEBVTT")) {
    throw new Error("Invalid VTT file");
  }

  // Replace different types of newline characters with a single type
  const normalizedContent = vttContent.replace(/\r\n/g, "\n");
  const blocks = normalizedContent.split("\n\n").slice(1);
  const content = [];
  let lastSpeaker = null;

  console.log(`Found ${blocks.length} blocks`);

  blocks.forEach((block, index) => {
    const lines = block.split("\n").map((line) => line.trim());

    if (lines.length < 3) {
      console.log(`Skipping block ${index + 1} due to insufficient lines`);
      return;
    }

    const timeLine = lines[1];
    const textLines = lines.slice(2);
    const text = textLines.join(" ");

    const speakerMatch = text.match(/^(.+?):/);
    const speaker = speakerMatch ? speakerMatch[1].trim() : lastSpeaker;
    const modifiedText = speakerMatch ? text.replace(/^.+?:/, "").trim() : text;

    const timestampMatch = timeLine.match(/(\d\d:\d\d:\d\d.\d\d\d) -->/);
    if (!timestampMatch) {
      console.log(`Skipping block ${index + 1} due to missing timestamp`);
      return;
    }
    const timestamp = timestampMatch[1];

    if (speaker && speaker !== lastSpeaker) {
      content.push({ type: "speaker", text: `${speaker} ${timestamp}` });
      lastSpeaker = speaker;
    }

    content.push({ type: "text", text: modifiedText });
  });

  return content;
};

const formatDialogue = (parsedContent) => {
  let formattedString = "";
  let lastSpeaker = null;

  parsedContent.forEach((item) => {
    if (item.type === "speaker" && item.text.split(" ")[0] !== lastSpeaker) {
      lastSpeaker = item.text.split(" ")[0];
      formattedString += "\n\n" + item.text + "\n";
    } else if (item.type === "text") {
      formattedString += item.text + " ";
    }
  });

  return formattedString.trim();
};

export const transformVTT = (vttString) => {
  console.log(vttString);

  const parsedContent = parseVTT(vttString);
  const formattedContent = formatDialogue(parsedContent);

  console.log(formattedContent);
  return formattedContent;
};
