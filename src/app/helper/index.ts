export const formatText = (text: string) => {
  return text.split("")[0].toUpperCase() + text.toLowerCase().slice(1);
};
