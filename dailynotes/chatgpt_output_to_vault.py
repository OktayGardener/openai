import datetime
import sys
import os
import re

root_directory = "C:\\Users\\oktay\\OneDrive\\Dokument\\Obsidian Vaults\\😁 Periodical Notes Parts"
directories = []

# Get all directories under root_directory
for dirpath, dirnames, filenames in os.walk(root_directory):
    for dirname in dirnames:
        # Append the directory path to the list
        directories.append(os.path.join(dirpath, dirname))

# Get all dirs 💾
# for dir_name in os.listdir(root_directory):
#     if os.path.isdir(os.path.join(root_directory, dir_name)):
#         # get the name of the file with the same name as the directory
#         file_name = os.path.join(root_directory, dir_name, dir_name[2:].lower() + ".md")
#         print(file_name)
#         if os.path.isfile(file_name):
#             print(file_name)
# # Print the matching files
# for file_path in matching_files:
#     print(file_path)

todays_date = datetime.datetime.now().strftime("%Y-%m-%d")

parts = [
    "\\⌚ Logs\\" + todays_date + "-logs",
    "\\⚪ Outline\\" + todays_date + "-outline",
    "\\🏃 Goals\\" + todays_date + "-goals",
    "\\💡 Ideas\\" + todays_date + "-ideas",
    "\\🙏 Gratitude & Reflection\\" + todays_date + "-gratitude-and-reflection",
    "\\🤓 Learnings\\" + todays_date + "-learnings",
    "\\👨‍🔬 Trackers\\" + todays_date + "-trackers",
    "\\📝 Notes\\⁉️📝Random Notes\\" + todays_date + "-random-notes",
    "\\📝 Notes\\✅ Lists\\" + todays_date + "-lists",
    "\\📝 Notes\\✍️ Scribble Notes\\" + todays_date + "-scribble",
    "\\📝 Notes\\❗ Important Notes\\" + todays_date + "-important-notes",
    "\\📝 Notes\\🗒️ Regular Notes\\" + todays_date + "-notes",
    "\\🙋‍♂️ Data\\" + todays_date + "-data",
]

# Get today's date in the format YYYY-MM-DD
start_parsing_marker = '<!-- #parsing: start here, remove everything below this line #deleteme  -->'
start_generating_marker = '<!-- #generated: generated data starts here  -->'


headers = []

for part in parts:
# Read in the markdown file to parse
    # with open(f"{root_directory}{part}.md", "r", encoding='utf-8') as f:
    header_to_search = re.findall(r'[^\\]+', part)[-2]
    
    # Move emoji to the right
    if header_to_search == "⁉️📝Random Notes": # fuck it
        header_to_search = "Random Notes ⁉️📝"
    else:
        header_to_search = header_to_search[2:] + ' ' + header_to_search[0]
    
    
    contents_to_add = ''
    write_output = False

    with open(f"markdown/output_{todays_date}_2.md", 'r', encoding='utf-8') as source_file:
        source_markdown = source_file.read()

    # Find the start and end indices of the section to extract
    start_index = re.search("# {}\n".format(header_to_search), source_markdown).end()
    end_index = len(source_markdown)
    next_header = re.search("# ", source_markdown[start_index + 1:])
    if next_header:
        end_index = start_index + next_header.start()

    # Extract the section as Markdown
    contents_to_add = source_markdown[start_index:end_index]

    print("trynna open: %s" % root_directory + part)

    # Write to periodical notes parts file
    with open(root_directory + part + '.md', 'r+', encoding='utf-8') as f:
        file_contents = f.readlines()
        start_line = None
        for i, line in enumerate(file_contents):
            if start_parsing_marker in line:
                start_line = i + 1
                break
        if start_line is not None:
            f.seek(0)
            for i, line in enumerate(file_contents):
                if i == start_line + 1:
                    f.write('\n' + start_generating_marker + '\n' + contents_to_add)   
                if not line.startswith(start_parsing_marker):
                    f.write(line)
            f.truncate()
        else:
            f.seek(0, 2) # move to the end of the file
            f.write('\n' + start_generating_marker + '\n' + contents_to_add)            
        f.close()

    print("wrote to: " + part)