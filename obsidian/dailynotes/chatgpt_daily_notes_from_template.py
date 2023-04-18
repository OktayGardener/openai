# This script is for finding the location of Today's Scribble
# Given NL Instruction + a template, outputs:
# Generated, formatted, tranformed and classified new markdown document.

import openai
import os
import datetime

# Before running the script, be sure to have written the Scribble in obsidian notes.
# Otherwise this script won't run, the scribble won't exist.

# Load OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

# Define the GPT-3.5 model
# model_engine = "text-davinci-002"

todays_date = datetime.datetime.now().strftime("%Y-%m-%d")

# TODO: Refactor to use with Github Actions + Octowhatever
PERIODICAL_NOTES_SCRIBBLE_PATH = "C:\\Users\\oktay\\OneDrive\\Dokument\\Obsidian Vaults\\04 Periodical Notes Parts\\Notes\\Scribble Notes\\"

# Read inputs from files
# Open the scribble file

# In case there exist more than one scribble per day

# with open(f"{PERIODICAL_NOTES_SCRIBBLE_PATH}{todays_date}-scribble2.md", "r", encoding="utf-8") as f:
    # contents = f.readlines()

with open(f"{PERIODICAL_NOTES_SCRIBBLE_PATH}{todays_date}-scribble.md", "r", encoding="utf-8") as f:
    contents = f.readlines()

# Find the index of the line that starts the parsing section
start_index = contents.index("<!-- #parsing: start here, remove everything below this line #deleteme  -->\n")

# Instruction for the model defined in natural language
with open(f"obsidian/dailynotes/templates/chatgpt_dailynotes_instruction.md", "r", encoding="utf-8") as f:
    instruction_contents = f.readlines()

# Template for the daily note
with open(f"obsidian/dailynotes/templates/chatgpt_dailynotes_template.md", "r", encoding="utf-8") as f:
    template_contents = f.readlines()

# +1 to get the next line and not the parsing line
contents = "".join(contents[start_index + 1:])

# Concatenate the three lists of strings
instruction_contents = "".join(instruction_contents)
template_contents = "".join(template_contents)

final_contents = "".join([instruction_contents] + [contents] + ['\n'] + [template_contents])

# Write the contents to a new file.
with open("obsidian/dailynotes/markdown/chatgpt_dailynotes_input_%s_test.md" % todays_date, "w", encoding="utf-8") as f:
    f.write(final_contents)


model_engine = "gpt-3.5-turbo"
# This specifies which GPT model to use, as there are several models available, each with different capabilities and performance characteristics.

response = openai.ChatCompletion.create(
    model='gpt-3.5-turbo',
    messages=[
        {"role": "user", "content": final_contents},
    ])

print(response)

message = response.choices[0]['message']

# Write output to file
with open("obsidian/dailynotes/markdown/chatgpt_dailynotes_output_%s.md" % todays_date, "w", encoding="utf-8") as f:
    f.write(message['content'])
