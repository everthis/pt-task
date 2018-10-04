const redis = require("redis");
const { promisify } = require("util");
const client = redis.createClient();

const hgetAsync = promisify(client.hget).bind(client);
const hsetAsync = promisify(client.hset).bind(client);

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function(err) {
  console.log("Error " + err);
});

async function hget(site) {
  return await hgetAsync("pt-cookie", site);
}

async function hset(site, val) {
  return await hsetAsync("pt-cookie", site, val);
}

module.exports = {
  hset,
  hget
};
