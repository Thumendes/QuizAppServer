function generateCode() {
  const codeNumber = Math.floor(Math.random() * (999999 - 100000) + 100000);
  const codeText = `${codeNumber}`;

  return codeText;
}

export default generateCode;
