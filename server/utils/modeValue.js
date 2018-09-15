const mode = words => (
  words.sort((a, b) => words.filter(v => v === a).length
  - words.filter(v => v === b).length).pop()
);

export default mode;
