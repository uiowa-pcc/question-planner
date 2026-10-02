PLAN QUESTIONS FOR A CAREER EXPERIENCE
University of Iowa-style standalone quick tool

FILES
- index.html
- styles.css
- script.js

VALUES SORTER HANDOFF
The tool looks for localStorage key:
  uiowaCareerValuesProfile_v1

Expected fields from the current Values Sorter:
- priorities
- strongest
- mustHave
- preferences
- avoid
- meanings
- meaningOther

If the profile exists on the same web origin, the student sees their saved priorities and can choose which ones to investigate. If no saved profile exists, the tool works normally with a short list of common work factors plus a custom option.

IMPORTANT HOSTING NOTE
localStorage is shared by origin (scheme + hostname + port), not by repository path. If this tool and the Values Sorter are both hosted under https://uiowa-pcc.github.io/ they can share the saved profile even when they live in different repositories/paths.

SUGGESTED ICON EMBED
<iframe src="YOUR-GITHUB-PAGES-URL/?v=20261002-2" title="Plan Questions for a Career Experience" style="width:100%;height:1250px;border:0;" loading="lazy"></iframe>

CONTENT FOUNDATION
Question categories and reminders are based on the University of Iowa Pomerantz Career Center informational interview guidance, then expanded with goal-, context-, experience-, values-, and employer-interview-specific branching. The Job or internship interview branch uses separate goals, interview-appropriate wording, fit questions, and next-step reminders rather than reusing informational-interview prompts.
