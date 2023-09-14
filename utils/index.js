const flattenObject = (obj) => {
  let flattendData = {};
  for (let key in obj) {
    if (typeof obj[key] === "object") {
      for (var subKey in obj[key]) {
        flattendData[subKey] = obj[key][subKey];
      }
    } else {
      flattendData[key] = obj[key];
    }
  }
  return flattendData;
};

module.exports = { flattenObject };
