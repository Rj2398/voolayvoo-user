function extractContent(htmlString, startTag, endTag) {
  const startIndex = htmlString.indexOf(startTag);
  const endIndex = htmlString.lastIndexOf(endTag);

  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    return null; // Tags not found or invalid order
  }

  const extractedContent = htmlString
    .substring(startIndex + startTag.length, endIndex)
    .trim();
  const extractImage = extractImages(extractedContent);
  return { extractedContent, extractImage };
}
function extractImages(htmlString) {
  const imageRegex = /<img[^>]+src="([^">]+)"/g;
  const matches = htmlString.match(imageRegex);

  if (!matches) {
    return []; // No image sources found
  }

  const imageSources = matches.map((match) => {
    const srcMatch = /src="([^">]+)"/.exec(match);
    return srcMatch ? srcMatch[1] : null;
  });

  return imageSources.filter((source) => source !== null);
}

export function separateContentWithoutParser() {
  const aboutContent = extractContent(
    htmlString,
    "<h3>VoolayVoo</h3>",
    "<h3>Voopons you will love</h3>"
  );
  const vooponsContent = extractContent(
    htmlString,
    "<h3>Voopons you will love</h3>",
    "<h1>Our Mission"
  );

  const missionContent = extractContent(
    htmlString,
    "<h1>Our Mission",
    "<h1>Our Vision"
  );

  const visionContent = extractContent(htmlString, "<h1>Our Vision", "</p>");

  const separatedContent = {
    abouts: aboutContent?.extractedContent
      ? aboutContent?.extractedContent
      : "",
    aboutImage:
      aboutContent?.extractImage.length > 0 ? aboutContent?.extractImage : [],
    voopons: vooponsContent?.extractedContent
      ? vooponsContent?.extractedContent
      : "",
    vooponsImage:
      vooponsContent?.extractImage.length > 0
        ? vooponsContent?.extractImage
        : [],
    mission: missionContent?.extractedContent
      ? missionContent?.extractedContent
      : "",
    missionImage:
      missionContent?.extractImage.length > 0
        ? missionContent?.extractImage
        : [],
    vision: visionContent?.extractedContent
      ? visionContent?.extractedContent
      : "",
    visionImage:
      visionContent?.extractImage.length > 0 ? visionContent?.extractImage : [],
  };

  return separatedContent;
}
