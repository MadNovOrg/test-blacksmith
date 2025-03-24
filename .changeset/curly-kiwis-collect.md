---
'@teamteach/hub': patch
---

Add start_date column on course table as well as adding a trigger on course_schedule to update this new column. start_date will only be used for sorting purposes as doing it through aggregates significantly impacts performance
