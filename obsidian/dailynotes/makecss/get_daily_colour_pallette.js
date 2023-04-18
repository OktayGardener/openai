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

const cssFilePath = '.obsidian/snippets/tag-pills.css';

const owner = "OktayGardener";
const repo = "obsidian-vaults";
const path = ".obsidian/snippets/tag-pills.css";

const result = await octokit.repos.getContent({
  owner: owner,
  repo: repo,
  path: path,
});

const content = Buffer.from(result.data.content, "base64").toString("utf8");

const searchString = new RegExp(`\\/${current_date}[^\n]*`);

const foundEntry = content.split("\n").find(line => line.includes(searchString));


if (foundEntry) {
  css += `/*${current_date}: New tags for date: ${current_date} added by Github Action process pipeline. Time: ${currentDate.toISOString().slice(0, 10)} */ \n\n`;
  Object.entries(formattedColors).forEach(([dateTag, color]) => {
    css += `.tag[href^="${dateTag}"] {\n`;
    css += `  background-color: ${color};\n`;
    css += `  color: #ffffff;\n`;
    css += `}\n`;
  });

  console.log("Entering following css: \n\n")
  console.log(css);

  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path
  });

  const encodedContent = Buffer.from(css).toString("base64");

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: "Update file with new content",
    content: encodedContent,
    sha: data.sha,
  });
  console.log('${current_date}: New tags have been added to tag-pills.css for time: ${currentDate.toISOString().slice(0, 10)} ');
} else {
  console.log(`Entry found for ${current_date}. \n Tags for ${current_date} already exist in tag-pills.css. Skipping...`);
}
