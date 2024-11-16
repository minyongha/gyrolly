import {
    uniqueNamesGenerator,
    adjectives,
    animals,
  } from "unique-names-generator";
  
  const useGenerateNickname = () => {
    return () =>
      uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: " ",
        style: "capital",
        length: 2
      });
  };
  
  export default useGenerateNickname;
  