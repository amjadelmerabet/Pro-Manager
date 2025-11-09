export default function createPageName(name) {
  let wordsIncluded = 0;
  let length = 0;
  let words = name.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (length + words[i].length < 22) {
      length += words[i].length + 1;
      wordsIncluded++;
    } else {
      break;
    }
  }
  return (
    name.split(" ").slice(0, wordsIncluded).join(" ") +
    (wordsIncluded < name.split(" ").length ? " ..." : "")
  );
}
