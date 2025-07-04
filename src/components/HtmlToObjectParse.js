// function extractContent(htmlString, startTag, endTag) {
//   const startIndex = htmlString.indexOf(startTag);
//   const endIndex = htmlString.lastIndexOf(endTag);

//   if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
//     return null; // Tags not found or invalid order
//   }

//   const extractedContent = htmlString
//     .substring(startIndex + startTag.length, endIndex)
//     .trim();
//   const extractImage = extractImages(extractedContent);
//   return { extractedContent, extractImage };
// }
// function extractImages(htmlString) {
//   const imageRegex = /<img[^>]+src="([^">]+)"/g;
//   const matches = htmlString.match(imageRegex);

//   if (!matches) {
//     return []; // No image sources found
//   }

//   const imageSources = matches.map((match) => {
//     const srcMatch = /src="([^">]+)"/.exec(match);
//     return srcMatch ? srcMatch[1] : null;
//   });

//   return imageSources.filter((source) => source !== null);
// }

// export function separateContentWithoutParser() {
//   const aboutContent = extractContent(
//     htmlString,
//     "<h3>VoolayVoo</h3>",
//     "<h3>Voopons you will love</h3>"
//   );
//   const vooponsContent = extractContent(
//     htmlString,
//     "<h3>Voopons you will love</h3>",
//     "<h1>Our Mission"
//   );

//   const missionContent = extractContent(
//     htmlString,
//     "<h1>Our Mission",
//     "<h1>Our Vision"
//   );

//   const visionContent = extractContent(htmlString, "<h1>Our Vision", "</p>");

//   const separatedContent = {
//     abouts: aboutContent?.extractedContent
//       ? aboutContent?.extractedContent
//       : "",
//     aboutImage:
//       aboutContent?.extractImage.length > 0 ? aboutContent?.extractImage : [],
//     voopons: vooponsContent?.extractedContent
//       ? vooponsContent?.extractedContent
//       : "",
//     vooponsImage:
//       vooponsContent?.extractImage.length > 0
//         ? vooponsContent?.extractImage
//         : [],
//     mission: missionContent?.extractedContent
//       ? missionContent?.extractedContent
//       : "",
//     missionImage:
//       missionContent?.extractImage.length > 0
//         ? missionContent?.extractImage
//         : [],
//     vision: visionContent?.extractedContent
//       ? visionContent?.extractedContent
//       : "",
//     visionImage:
//       visionContent?.extractImage.length > 0 ? visionContent?.extractImage : [],
//   };

//   return separatedContent;
// }

///

function extractContent(htmlString, startTag, endTag) {
  const startIndex = htmlString.indexOf(startTag);
  const endIndex = htmlString.indexOf(endTag, startIndex); // Use indexOf for a correct match after startTag

  // If start or end tag not found or start index is greater than or equal to end index, return null
  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    return null; // Tags not found or invalid order
  }

  // Extract the content between the start and end tags
  const extractedContent = htmlString
    .substring(startIndex + startTag.length, endIndex)
    .trim();

  // Extract images within the extracted content
  const extractImage = extractImages(extractedContent);

  // Return both the extracted content and any images found
  return { extractedContent, extractImage };
}

function extractImages(htmlString) {
  const imageRegex = /<img[^>]+src="([^">]+)"/g; // Regex to match image src attributes
  const matches = htmlString.match(imageRegex);

  if (!matches) {
    return []; // No image sources found
  }

  // Extract the src attribute from each image tag
  const imageSources = matches.map((match) => {
    const srcMatch = /src="([^">]+)"/.exec(match);
    return srcMatch ? srcMatch[1] : null;
  });

  // Filter out any null values
  return imageSources.filter((source) => source !== null);
}

export function separateContentWithoutParser(htmlString) {
  // Extract content between specific HTML tags
  const aboutContent = extractContent(
    htmlString,
    "<h1>VoolayVoo</h1>",
    "<\/p>\r\n\r\n<p><img"
  );
  const vooponsContent = extractContent(
    htmlString,
    "<h1>Voopons you will love",
    "<h1>Our Mission"
  );

  const missionContent = extractContent(
    htmlString,
    "<h1>Our Mission",
    "<h1>Our Vision"
  );

  const visionContent = extractContent(
    htmlString,
    "<h1>Our Vision",
    "</p>" // Assuming this is the last closing tag for Vision
  );

  // Prepare the separated content as an object, handling missing content or images gracefully
  const separatedContent = {
    abouts: aboutContent?.extractedContent || "", // Fallback to an empty string if content is not found
    aboutImage:
      aboutContent?.extractImage?.length > 0 ? aboutContent.extractImage : [],
    voopons: vooponsContent?.extractedContent || "",
    vooponsImage:
      vooponsContent?.extractImage?.length > 0
        ? vooponsContent.extractImage
        : [],
    mission: missionContent?.extractedContent || "",
    missionImage:
      missionContent?.extractImage?.length > 0
        ? missionContent.extractImage
        : [],
    vision: visionContent?.extractedContent || "",
    visionImage:
      visionContent?.extractImage?.length > 0 ? visionContent.extractImage : [],
  };

  return separatedContent;
}
