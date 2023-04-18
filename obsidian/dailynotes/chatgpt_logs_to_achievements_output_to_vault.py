# This script is for finding the location of Today's Scribble
# Given NL Instruction + a template, outputs:
# Generated, formatted, tranformed and classified new markdown document.

import openai
import os
import datetime
import sys

# Before running the script, be sure to have written the Log in obsidian notes.
# Otherwise this script won't run, the log won't exist.

todays_date = datetime.datetime.now().strftime("%Y-%m-%d")
timestamp_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

start_parsing_marker = '<!-- #parsing: start here, remove everything below this line #deleteme  -->\n'
start_generating_marker = '- [*] status' + ' \n' + '- [/] done' + ' \n ' + '<!-- #generated: generated data starts here, generated at: %s -->\n' % timestamp_date


with open("obsidian/dailynotes/markdown/achievements/chatgpt_dailynotes_log_to_achievements_output_%s.md" % todays_date, 'r', encoding='utf-8') as source_file:
    source_markdown = source_file.read()


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
        f.write('\n' + start_generating_marker + '\n' + "#" + source_markdown + '\n' + start_parsing_marker)
    else:
        f.seek(0, 2) # move to the end of the file
        f.write(start_generating_marker + '\n' + source_markdown)
    f.close()

print("wrote to: " + "{PERIODICAL_NOTES_ACHIEVEMENTS_PATH}{todays_date}-achievements.md")
