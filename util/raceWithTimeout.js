function raceWithTimeout(source, p) {
  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ _type: "timeout", source });
      }, 10000);
    }),
    p
  ]);
}

module.exports = raceWithTimeout;
