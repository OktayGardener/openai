import datetime
import sys
import os
import re

root_directory = "C:\\Users\\oktay\\OneDrive\\Dokument\\Obsidian Vaults\\04 Periodical Notes Parts"
directories = []

def find_section_start(header_to_search, source_markdown):
    # Escape any special characters in the header
    escaped_header = re.escape(header_to_search)
    # Match the header with optional trailing whitespace
    pattern = r"# {}\s*".format(escaped_header)
    # Find the start index of the first match
    match = re.search(pattern, source_markdown, re.IGNORECASE)
    if match:
        return match.end()
    else:
        return None
# Get all directories under root_directory
for dirpath, dirnames, filenames in os.walk(root_directory):
    for dirname in dirnames:
        # Append the directory path to the list
        directories.append(os.path.join(dirpath, dirname))

todays_date = datetime.datetime.now().strftime("%Y-%m-%d")
timestamp_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


parts = [
    "\\Outline\\" + todays_date + "-outline",
    "\\Goals\\" + todays_date + "-goals",
    "\\Ideas\\" + todays_date + "-ideas",
    "\\Mental Health\\" + todays_date + "-mental-health",
    "\\Logs\\" + todays_date + "-logs",
    "\\Notes\\Regular Notes\\" + todays_date + "-notes",
    "\\Notes\\Important Notes\\" + todays_date + "-important-notes",
    "\\Notes\\Random Notes\\" + todays_date + "-random-notes",
    "\\Notes\\Lists\\" + todays_date + "-lists",
    "\\Achievements\\" + todays_date + "-achievements",
    "\\Learnings\\" + todays_date + "-learnings",
    "\\Trackers\\" + todays_date + "-trackers",
    "\\Data\\" + todays_date + "-data",
]

# Get today's date in the format YYYY-MM-DD
start_parsing_marker = '<!-- #parsing: start here, remove everything below this line #deleteme  -->\n'

def generate_marker(part):
    generated_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return '- [*] status' + ' \n' + '- [X] %s entered (Generated by ChatGPT) ⏫ \n - [ ] %s entered manually 🔼' % part + ' \n\n ' + '<!-- #generated: generated data starts here, generated at: %s -->\n' % generated_at

headers = []

parts_doc = [
        "Outline",
        "Goals",
        "Ideas",
        "Mental Health",
        "Notes",
        "Important Notes",
        "Random Notes",
        "Lists",
        "Achievements",
        "Learnings",
    ]


for i, part in enumerate(parts):
# Read in the markdown file to parse
    # with open(f"{root_directory}{part}.md", "r", encoding='utf-8') as f:
    header_to_search = parts_doc[i]

    contents_to_add = ''
    write_output = False

    with open(f"obsidian/dailynotes/markdown/chatgpt_dailynotes_output_{todays_date}.md", 'r', encoding='utf-8') as source_file:
        source_markdown = source_file.read()

    # Find the start and end indices of the section to extract
    start_index = find_section_start(header_to_search, source_markdown)

    end_index = len(source_markdown)
    next_header = re.search("# ", source_markdown[start_index + 1:])
    if next_header:
        end_index = start_index + next_header.start()

    # Extract the section as Markdown
    contents_to_add = source_markdown[start_index:end_index]

    print("trynna open: %s" % root_directory + part)

    # Write to periodical notes parts file
    with open(root_directory + part + '.md', encoding='utf-8') as f:
        data = f.readlines()

    if start_parsing_marker in data:
        start_line = data.index(start_parsing_marker)
    else:
        start_line = None

    with open(root_directory + part + '.md', 'w', encoding='utf-8') as f:
        if start_line is not None:
            f.writelines(data[:start_line])
            f.seek(0, 2) # move to the end of the file
            f.write('\n' + generate_marker(part) + '\n' + contents_to_add + '\n' + start_parsing_marker)
        else:
            f.seek(0, 2) # move to the end of the file
            f.write(generate_marker(part) + '\n' + contents_to_add)
        f.close()

    print("wrote to: " + part)
