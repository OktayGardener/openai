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

model_engine = "gpt-3.5-turbo"
# Read inputs from files
# Open the scribble file

# In case there exist more than one scribble per day

# with open(f"{PERIODICAL_NOTES_SCRIBBLE_PATH}{todays_date}-scribble2.md", "r", encoding="utf-8") as f:
    # contents = f.readlines()

with open(f"{PERIODICAL_NOTES_SCRIBBLE_PATH}{todays_date}-scribble.md", "r", encoding="utf-8") as f:
    scribble_contents = f.readlines()

# Find the index of the line that starts the parsing section
start_index = scribble_contents.index("<!-- #parsing: start here, remove everything below this line #deleteme  -->\n")
scribble_contents = "".join(scribble_contents[start_index + 1:])
# # Instruction for the model defined in natural language
# with open(f"obsidian/dailynotes/templates/chatgpt_dailynotes_instruction.md", "r", encoding="utf-8") as f:
#     instruction_contents = f.readlines()
#     f.close()

def generate_scribble_response(model_engine, instruction_file_path, scribble_contents, role="user"):
    # Read the contents of the instruction file and combine with scribble contents
    with open(instruction_file_path, "r", encoding="utf-8") as f:
        instruction_contents = f.readlines()
        f.close()
    instruction_contents = "".join(instruction_contents)
    instruction_contents = "".join([instruction_contents] + [scribble_contents])

    # Generate the response using the OpenAI API
    response = openai.ChatCompletion.create(
        model=model_engine,
        messages=[
            {"role": role, "content": instruction_contents},
        ])

    return response.choices[0]['message']

markers_scribble_response = generate_scribble_response(model_engine=model_engine,
                           instruction_file_path=f"obsidian/dailynotes/templates/chatgpt_dailynotes_instruction_markers.md",
                           scribble_contents=scribble_contents,
                           role='user',
                        )

tasks_scribble_response = generate_scribble_response(model_engine=model_engine,
                           instruction_file_path=f"obsidian/dailynotes/templates/chatgpt_dailynotes_instruction_tasks.md",
                           scribble_contents=scribble_contents,
                           role='user',
                        )


with open(f"obsidian/dailynotes/templates/chatgpt_dailynotes_template.md", "r", encoding="utf-8") as f:
    template_contents = f.readlines()

with open(f"obsidian/dailynotes/templates/chatgpt_dailynotes_instruction.md", "r", encoding="utf-8") as f:
    instruction_contents = f.readlines()

# +1 to get the next line and not the parsing line

# Concatenate the three lists of strings
instruction_contents = "".join(instruction_contents)
template_contents = "".join(template_contents)
final_contents = "".join([instruction_contents] + [scribble_contents] + ['\n'] + [template_contents])

scribble_response = openai.ChatCompletion.create(
    model=model_engine,
    messages=[
        {"role": "system", "content": final_contents},
    ])

scribble_response = scribble_response.choices[0]['message']

# Template for the daily note

# This specifies which GPT model to use, as there are several models available, each with different capabilities and performance characteristics.
# Write output to file
with open("obsidian/dailynotes/markdown/chatgpt_dailynotes_output_%s.md" % todays_date, "w", encoding="utf-8") as f:
    f.write(scribble_response['content'])
    f.write("\n\n#Data\n")
    f.write(markers_scribble_response['content'])
    f.write("\n\n#Lists\n")
    f.write(tasks_scribble_response['content'])
