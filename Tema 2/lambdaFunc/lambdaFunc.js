const lambdaFunc = async (event) => {
  const textElements = event.text;
  let newTextElements = "";
  const punctuationMarks = ",-;:\"";

  for(let i = 0; i < textElements.length - 1;) {
    newTextElements += textElements[i];

    if(textElements[i] === textElements[i + 1] && punctuationMarks.includes(textElements[i])) {
      let repetitionIndex = i + 1;

      for(let y = i + 1; y < textElements.length && textElements[y] === textElements[i]; y++) {
        repetitionIndex++;
      }

      i = repetitionIndex;
    } else i++;
  }

  return newTextElements;
};

lambdaFunc({ text: "Test text. This is a correct text..." });
lambdaFunc({ text: "Test text. This\"\"\"\" is an,,, in--correct text!!" });

exports.handler = lambdaFunc;