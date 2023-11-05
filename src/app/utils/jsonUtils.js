// JSON conversion utility:
//
//   To convert the string 'code:123,value:456' to a JSON object like {code: 123, value: 456}, you can follow these steps:
//   Split the string into individual key-value pairs based on the comma (,).
//   Split each key-value pair into its key and value based on the colon (:).
//
//   TEST: Create a JSON object and assign each key-value pair to it.
//       const inputString = 'code:123,value:456';
//       const jsonObject = stringToJsonObject(inputString);
//       console.log(jsonObject); // Output: { code: 123, value: 456 }

export function stringToJsonObject(inputString) {
    const keyValuePairs = inputString.split(",");
    const jsonObject = {};

    for (const pair of keyValuePairs) {
        const [key, value] = pair.split(":");
        jsonObject[key] = value; // Assuming the values are integers, you can remove parseInt if they are not.
    }

    return jsonObject;
}
