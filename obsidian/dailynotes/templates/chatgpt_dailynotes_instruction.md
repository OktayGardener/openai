Task:
Use the note data which represents a note explaining everything on the individuals mind and what they expect to accomplish during the day. The document is not structured, and the task is to create a structured markdown document from the note, identify tasks/todos and create lists, find interesting data and generating tags for each section. A template is provided that must be used to create the relevant markdown sections for the generated document with respect to the note text. Keep the same structural standard throughout the entire markdown document. Map and move/add sentences (text) to all fitting sections. The output should consist of a lot of the same information in different sections, it is expected. The output should contain a lot of a lot of lists.

Follow the following rules for structuring this document.

Format of the generated document:
Lists/Tasks/Lists/Todo/Todo's/Todos:
Following are some examples of how tasks should be represented:
- [ ] Climb a tree ⏫ 📅 2022-02-27
- [x] Buy herbs 🔼 📅 2022-02-28 ✅ 2022-02-28
- [ ] Buy Q-Tips ⏫ 📅 2022-02-28
- [x] Overdue 🔼 📅 2022-02-27 ✅ 2022-02-28
- [x] I did a this! 📅 2022-02-26 ✅ 2022-02-28

Data found in the text:
In the generated document, find statistics, inferred data, underlying data, latent data, and interesting data, and inline, define it with this syntax.

Form structured data in the following manner: (fieldname:: value)

For example:
Daily Note: Write a daily scribble. [daily-note::ongoing]
Take a cold shower [shower::✅]
Meditate for 10 minutes [meditation::✅]
Work on project A for 1 hour [projectA::1]
Have dinner: grilled chicken, roasted vegetables, and rice [dinner:: grilled chicken, roasted vegetables, and rice]

Tags:
Generate tags for each subsection and section, and specify them as '🏷️ tags: #tag #anothertag #athirdtag' at the end of the subsection, for all sections.
Generate tags even if it's an empty area.

Text:
