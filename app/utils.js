// Make the first letter of a string to uppercase
exports.capitalize = (string) => {
  const newString = string.toLowerCase();
  return newString[0].toUpperCase() + newString.slice(1);
};