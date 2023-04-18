import fs from 'fs';
import randomColor from 'randomcolor'

const tags = [
  '#DD',
  '#YYYY-MM-DD',
  '#YYYY-MM',
  '#YYYY/MM/DD',
  '#YY/MM/DD',
  '#YY/MM',
  '#YYYY/MM'
];


const fullFormatColor = randomColor({
  luminosity: 'bright'
})
const monthlyFormatColor = randomColor({
  luminosity: 'bright'
})
const dailyFormatColor = randomColor({
  luminosity: 'bright'
})

const currentDate = new Date();

const formattedColors = {
  // Evaluates to the current date's day of the month in two-digit format (e.g. "01", "02", etc.) mapped to dailyFormatColor
  [currentDate.getDate().toString().padStart(2, '0')]: dailyFormatColor,
  // Evaluates to the current date in ISO format (e.g. "2023-04-18") mapped to fullFormatColor
  [currentDate.toISOString().slice(0, 10)]: fullFormatColor,
  // Evaluates to the current date in format "YYYY-MM-DD" (e.g. "2023-04-18") mapped to fullFormatColor
  [`${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`]: fullFormatColor,
  // Evaluates to the current date in format "YYYY-MM" (e.g. "2023-04") mapped to monthlyFormatColor
  [`${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`]: monthlyFormatColor,
  // Evaluates to the current date in format "YYYY/MM/DD" (e.g. "2023/04/18") mapped to fullFormatColor
  [`${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`]: fullFormatColor,
  // Evaluates to the current date in format "YY/MM/DD" (e.g. "23/04/18") mapped to dailyFormatColor
  [`${currentDate.getFullYear().toString().substr(-2)}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`]: monthlyFormatColor,
  // Evaluates to the current date in format "YYYY/MM" (e.g. "2023/04") mapped to monthlyFormatColor
  [`${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`]: monthlyFormatColor,
  // Evaluates to the current date in format "YY/MM" (e.g. "23/04") mapped to monthlyFormatColor
  [`${currentDate.getFullYear().toString().substring(2)}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`]: monthlyFormatColor
};


let css = '';
let current_date = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

console.log(css);


const cssFilePath = '.obsidian/snippets/tag-pills.css';
const existingCss = fs.readFileSync(cssFilePath, 'utf8');
const existingDateIndex = css.indexOf(`${current_date}:`);

console.log("existingDateIndex: ${existingDateIndex}")

if (existingDateIndex !== -1) {
  console.log(`Tags for ${current_date} already exist in tag-pills.css. Skipping...`);
} else {
  css += `/*${current_date}: New tags for date: ${current_date} added by Github Action process pipeline. Time: ${currentDate.toISOString().slice(0, 10)} */ \n\n`;
  Object.entries(formattedColors).forEach(([dateTag, color]) => {
    css += `.tag[href^="${dateTag}"] {\n`;
    css += `  background-color: ${color};\n`;
    css += `  color: #ffffff;\n`;
    css += `}\n`;
  });
  fs.appendFileSync(cssFilePath, css);
  console.log('${current_date}: New tags have been added to tag-pills.css for time: ${currentDate.toISOString().slice(0, 10)} ');
}
