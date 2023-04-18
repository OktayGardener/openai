# This script is for finding the location of Today's Scribble
# Given NL Instruction + a template, outputs:
# Generated, formatted, tranformed and classified new markdown document.

import openai
import os
import datetime
import sys

# Before running the script, be sure to have written the Log in obsidian notes.
# Otherwise this script won't run, the log won't exist.

# Load OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

# Define the GPT-3.5 model
# model_engine = "text-davinci-002"

todays_date = datetime.datetime.now().strftime("%Y-%m-%d")
timestamp_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

PERIODICAL_NOTES_LOGS_PATH = "C:\\Users\\oktay\\OneDrive\\Dokument\\Obsidian Vaults\\😁 Periodical Notes Parts\\⌚ Logs\\"
start_parsing_marker = '<!-- #parsing: start here, read everything below this line #deleteme  -->\n'
start_generating_marker = '- [*] status' + ' \n' + '- [/] done' + ' \n ' + '<!-- #generated: generated data starts here, generated at: %s -->\n' % timestamp_date


# Read inputs from files
# Open the log file

# In case there exist more than one log per day

with open(f"{PERIODICAL_NOTES_LOGS_PATH}{todays_date}-logs.md", "r", encoding="utf-8") as f:
    contents = f.readlines()

# Find the index of the line that starts the parsing section
start_index = contents.index("<!-- #parsing: start here, read everything below this line #deleteme  -->\n")

# Instruction for the model defined in natural language
with open(f"templates/chatgpt_dailynotes_instruction_log_to_achievements.md", "r", encoding="utf-8") as f:
    instruction_contents = f.readlines()

# +1 to get the next line and not the parsing line
contents = "".join(contents[start_index + 1:])

# Concatenate the three lists of strings
instruction_contents = "".join(instruction_contents)
final_contents = "".join([instruction_contents] + ['\n'] + [contents])


model_engine = "gpt-3.5-turbo"
# This specifies which GPT model to use, as there are several models available, each with different capabilities and performance characteristics.

response = openai.ChatCompletion.create(
    model='gpt-3.5-turbo',
    messages=[
        {"role": "user", "content": final_contents},
    ])

print(response)

message = response.choices[0]['message']


with open("markdown/achievements/chatgpt_dailynotes_log_to_achievements_output_%s.md" % todays_date, "w", encoding="utf-8") as f:
    f.write(message['content'])

PERIODICAL_NOTES_ACHIEVEMENTS_PATH = "C:\\Users\\oktay\\OneDrive\\Dokument\\Obsidian Vaults\\Periodical Notes Parts\\Achievements\\"

with open(f"{PERIODICAL_NOTES_ACHIEVEMENTS_PATH}{todays_date}-achievements.md", encoding='utf-8') as f:
    data = f.readlines()

if start_parsing_marker in data:
    start_line = data.index(start_parsing_marker)
else:
    start_line = None

with open(f"{PERIODICAL_NOTES_ACHIEVEMENTS_PATH}{todays_date}-achievements.md", 'w', encoding='utf-8') as f:
    if start_line is not None:
        f.writelines(data[:start_line])
        f.seek(0, 2) # move to the end of the file
        f.write('\n' + start_generating_marker + '\n' + message + '\n' + start_parsing_marker)
    else:
        f.seek(0, 2) # move to the end of the file
        f.write(start_generating_marker + '\n' + message)
    f.close()

print("wrote to: " + "{PERIODICAL_NOTES_ACHIEVEMENTS_PATH}{todays_date}-achievements.md")
