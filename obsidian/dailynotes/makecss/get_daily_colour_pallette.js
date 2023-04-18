import randomColor from 'randomcolor'
import { Octokit } from "octokit";

const tags = [
  '#DD',
  '#YYYY-MM-DD',
  '#YYYY-MM',
  '#YYYY/MM/DD',
  '#YY/MM/DD',
  '#YY/MM',
  '#YYYY/MM'
];

const octokit = new Octokit({
  auth: process.env.OPENAI_REPO_OBSIDIAN,
});

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
    css += `.tag[href^="#${dateTag}"] {\n`;
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
