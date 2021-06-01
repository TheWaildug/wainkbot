function tweak (c) {
    return Math.random() < 0.5 ? c.toLowerCase() : c.toUpperCase();
}

module.exports = (text) => {
text = text.split("").map(tweak).join("");

    let m = text.match(/([^\n]+(?:\n[^\n]+)*)?(\n(?:\n[^\n]+)*)?/);
   console.log(m.input)
   return m.input
}