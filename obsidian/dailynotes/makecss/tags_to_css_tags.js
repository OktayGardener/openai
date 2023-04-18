const fetch = require('node-fetch');
const fs = require('fs');

const TAG_CSS_PATH = '../../obsidian-vaults/Vaults/Main Personal Vault/.obsidian/snippets/tag-pills.css';

const generateCss = (colors) => {
  let css = '';
  colors.forEach((color, index) => {
    const tagClass = `.tag[href^="#${index}"]`;
    css += `${tagClass} { background-color: ${color} }\n`;
  });
  return css;
};

const getRandomPalette = async () => {
  const response = await fetch('https://colorhunt.co/api/palettes/random');
  const { colors } = await response.json();
  return colors;
};

const writeCssToFile = (css) => {
  fs.appendFile(TAG_CSS_PATH, css, (err) => {
    if (err) throw err;
    console.log('New tags have been added to tag-pills.css');
  });
};

(async () => {
  const colors = await getRandomPalette();
  const css = generateCss(colors);
  writeCssToFile(css);
})();
