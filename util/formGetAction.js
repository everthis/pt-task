function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return "%" + c.charCodeAt(0).toString(16);
  });
}
function formGetAction(str) {
  return str
    .trim()
    .split(" ")
    .map(el => fixedEncodeURIComponent(el))
    .join("+");
}

module.exports = formGetAction;
