import randomColor from 'randomcolor'
import { Octokit } from "octokit";
import chroma from 'chroma-js';
import fs from 'fs'

const octokit = new Octokit({
  auth: process.env.OPENAI_REPO_OBSIDIAN,
});


let colorPalette = [];

function generateColorPalette() {
  const fs = require('fs');
  const hexValues = fs.readFileSync('colors.txt', 'utf8').trim().split('\n').map(line => line.trim().split('#').slice(1));
  const numColors = Object.keys(uniqueDateRepresentations).length;
  colorPalette = [];
  for (let i = 0; i < Math.ceil(numColors / hexValues.length); i++) {
    colorPalette.push(...hexValues.flat());
  }
  colorPalette.length = numColors;
}

function getTagColor(tag, currentDate) {
  const paletteDuration = tag.includes('DD') ? 'day' : tag.includes('WW') ? 'week' : tag.includes('MMMM YY') ? 'month' : tag.includes('YYYY') ? 'year' : 'unknown';
  let durationStart;
  switch (paletteDuration) {
    case 'day':
      durationStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      break;
    case 'week':
      durationStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
      break;
    case 'month':
      durationStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      break;
    case 'year':
      durationStart = new Date(currentDate.getFullYear(), 0, 1);
      break;
    default:
      return 'white'; // return default color for unknown duration
  }
  if (durationStart.getTime() !== colorPalette.start.getTime()) {
    generateColorPalette();
    colorPalette.start = durationStart;
  }
  let colorIndex;
  switch (paletteDuration) {
    case 'day':
      colorIndex = currentDate.getDate() - 1;
      break;
    case 'week':
      colorIndex = Math.ceil((currentDate.getDate() + (currentDate.getMonth() + 1) * 7) / 7) - 1;
      break;
    case 'month':
      colorIndex = currentDate.getMonth();
      break;
    case 'year':
      colorIndex = 0;
      break;
    default:
      return 'white'; // return default color for unknown duration
  }
  colorIndex += tag.charCodeAt(1);
  return colorPalette[colorIndex % colorPalette.length];
}

function generateTagColors() {
  const currentDate = new Date();
  colorPalette.start = colorPalette.start || new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // initialize start date if not set
  const css = [];

  for (const tag in uniqueDateRepresentations) {
    const color = getTagColor(tag, currentDate);
    css.push(`${tag} { background-color: ${color}; color: white; }`);
  }

  const styleElement = document.createElement('style');
  styleElement.textContent = css.join('\n');
  document.head.appendChild(styleElement);
}

generateColorPalette();
generateTagColors();



// const paletteFile = './color_pallettes_handmade_chatgpt_colorhunt.txt';
// const currentDate = new Date();

// // Read color palettes from file
// const colorPalettesFile = fs.readFileSync('color_pallettes_handmade_chatgpt_colorhunt.txt', 'utf8');
// const colorPalettes = colorPalettesFile.trim().split('\n').map(line => line.split('#').filter(Boolean));
// // Randomly select a color palette
// const colorPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

// // 1: Using chroma.js library to generate gradient colors
// const gradient = chroma.scale(colorPalette).mode('lab').colors(Object.keys(uniqueDateRepresentations).length);


function ordinalSuffix(day) {
  if (day % 10 == 1 && day != 11) {
    return `${day}st`;
  } else if (day % 10 == 2 && day != 12) {
    return `${day}nd`;
  } else if (day % 10 == 3 && day != 13) {
    return `${day}rd`;
  } else {
    return `${day}th`;
  }
}

const uniqueDateRepresentations = {
  '#YYYY': `#${currentDate.getFullYear()}`,
  '#YY': `#${currentDate.getFullYear().toString().substring(2)}`,
  '#DD': `#${ordinalSuffix(currentDate.getDate())}`,
  '#MonthName': `#${currentDate.toLocaleString('default', { month: 'long' })}`,
  '#MM': `#${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`,
  '#Quarter': `#${Math.floor((currentDate.getMonth() + 3) / 3)}Q${currentDate.getFullYear().toString().substring(2)}`,
  '#WW': `#${Math.ceil((currentDate.getDate() + (currentDate.getMonth() + 1) * 7) / 7)}`,
  '#YYYY/MM': `#${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`,
  '#YYYY-MM': `#${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`,
  '#YYYY-MM-DD': `#${currentDate.toISOString().slice(0, 10)}`,
  '#MonthYY': `#${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getFullYear().toString().substring(2)}`,
  '#MonthNameYY': `#${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear().toString().substring(2)}`,
  '#WeekYY': `#Week ${Math.ceil((currentDate.getDate() + (currentDate.getMonth() + 1) * 7) / 7)} ${currentDate.getFullYear().toString().substring(2)}`,
  '#YYYY/MM/DD': `#${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`
};

function generateTagValues(startDate, endDate) {
  const tagValues = [];

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const tagValue = {};
    for (const tag in uniqueDateRepresentations) {
      const value = uniqueDateRepresentations[tag]
        .replace('#YYYY', currentDate.getFullYear())
        .replace('#YY', currentDate.getFullYear().toString().substring(2))
        .replace('#DD', ordinalSuffix(currentDate.getDate()))
        .replace('#MonthName', currentDate.toLocaleString('default', { month: 'long' }))
        .replace('#MM', (currentDate.getMonth() + 1).toString().padStart(2, '0'))
        .replace('#Quarter', `${Math.floor((currentDate.getMonth() + 3) / 3)}Q${currentDate.getFullYear().toString().substring(2)}`)
        .replace('#WW', Math.ceil((currentDate.getDate() + (currentDate.getMonth() + 1) * 7) / 7))
        .replace('#YYYY/MM', `${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`)
        .replace('#YYYY-MM', `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`)
        .replace('#YYYY-MM-DD', currentDate.toISOString().slice(0, 10))
        .replace('#MonthYY', `${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getFullYear().toString().substring(2)}`)
        .replace('#MonthNameYY', `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear().toString().substring(2)}`)
        .replace('#WeekYY', `Week ${Math.ceil((currentDate.getDate() + (currentDate.getMonth() + 1) * 7) / 7)} ${currentDate.getFullYear().toString().substring(2)}`)
        .replace('#YYYY/MM/DD', `${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`);
      tagValue[tag] = value;
    }
    tagValues.push(tagValue);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return tagValues;
}


// const formattedColors = {};
// Object.entries(uniqueDateRepresentations).forEach(([key, value]) => {
//   const color = randomColor({ luminosity: 'bright' });
//   formattedColors[value] = color;
// });


const formattedColors = {};
Object.entries(uniqueDateRepresentations).forEach(([key, value], index) => {
  const color = index < colorPalette.length ? colorPalette[index] : chroma.random().hex();
  formattedColors[value] = color;
});


let css = '';
let current_date = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

console.log("Todays date: ${current_date}.")

const owner = "OktayGardener";
const repo = "obsidian-vaults";
const path = ".obsidian/snippets/tag-pills.css";

const result = await octokit.request('GET /repos/:owner/:repo/contents/:path', {
  owner: owner,
  repo: repo,
  path: path,
});

// Read file content
const { data } = await octokit.rest.repos.getContent({
  owner,
  repo,
  path
});

// Decode file content
const decodedContent = Buffer.from(data.content, 'base64').toString();

// Check if entry exists for current date
const searchString = `\\/${current_date}`;
const foundEntry = decodedContent.split('\n').find(line => line.includes(searchString));

console.log(searchString)
console.log(foundEntry)

// If entry not found, add new tags to CSS file// ... (previous code remains the same)

// If entry not found, add new tags to CSS file
if (!foundEntry) {
  css += `/*${current_date}: New tags for date: ${current_date} added by Github Action process pipeline. Time: ${currentDate.toISOString().slice(0, 10)} */ \n\n`;
  Object.entries(formattedColors).forEach(([dateTag, color]) => {
    css += `.tag[href^="${dateTag}"] {\n`;
    css += `  background-color: ${color};\n`;
    css += `  color: #ffffff;\n`;
    css += `}\n`;
  });

  console.log(`Entering following css: \n\n${css}`);

  // Append the new CSS to the existing content
  const updatedContent = decodedContent + css;

  // Update file content
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: `Update tag-pills.css with new colors for date: ${current_date}`,
    content: Buffer.from(updatedContent).toString('base64'), // Replace 'css' with 'updatedContent'
    sha: data.sha
  });

  console.log(`${current_date}: New tags have been added to tag-pills.css for time: ${currentDate.toISOString().slice(0, 10)} `);
} else {
  console.log(`Entry found for ${current_date}. \nTags for ${current_date} already exist in tag-pills.css. Skipping...`);
}
