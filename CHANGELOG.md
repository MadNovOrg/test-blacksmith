# @teamteach/hub

## 2.2.0

### Minor Changes

- 561857af: Add profile country field for user authentications form
- 7180f68e: Manage OPEN courses and OPEN course details page for booking contact
- d4c33afd: Allow searching trainer courses by arlo reference id.
- 9f484eb7: Allow Sales admin and Operations roles to remove people from organisations

### Patch Changes

- 5ba7658c: FIX: TTHP-3256 create edit org key contact for indirect courses
- 5c04bb65: Fix the issue with trainers not being able to cancel indirect courses
- c61d7aba: Fix error reportd by Sentry, unexpected end of input
- 78360612: Update course title includes reaccreditation
- 799be02b: Redirect Trainer to Courses page when trying to access a Course that has not been accepted yet
- 79acc67d: Fix: (TTHP-3228) Admin ogranisations Region column visibility.
- dcebb681: added filter by course type in manage courses page only for booking contact role
- d3c4e837: Fixes and sentry error and refactors some useSWR instances
- 8dba3869: Enable H&S consent submit button after course has begun
- 92f5d3eb: Fix (TTHP-3256) org key contact for course details indirect course
- 340daa39: filter module groups for level 1 open course
- c981a695: Fix edit profile roles, booking and org key contact case
- ad02aac3: Change wording of get started link
- 72777ea2: Update course status filter for booking contact, regarding OPEN courses
- a28c094c: [Sentry] at is not a function fix
- 78b1f4b6: variable pricing for closed course creation
- dfe5a981: Fix dietary and disabilities count on managed course's details page for booking and organisation key contact
- 70cb5df3: Changing permissions on course table
- bde6ec74: Hide Dietary and Disabilities info on user profile

## 2.1.0

### Minor Changes

- d1bb456c: When navigating back to My Courses/ Manage Courses page, reapply the filters.

### Patch Changes

- 8801760b: Remove transfer action for trainer on Open type courses
- c413f041: Fix L2 Reaccreditation duration
- b3147739: Fix: (TTHP-3267) attendee transfer participants updatate
- e53195c7: Updates the wp_schema url
- 0d4a5f9a: Search by multiple words in course's name
- 94ffda52: use correct item codes for Advanced Trainer Open course bookings
- f877cad2: Validate phone number input from Edit Profile page.

## 2.0.0

### Major Changes

- c15dd5ec: Add Certigicates tab for individual sub-roles e.g key-contact, booking contact, orgAdmin.

### Minor Changes

- 1823b917: add Knowledge Hub resources carousel to the new welcome page

### Patch Changes

- b778dfd1: Restrict course cancel request for completed or ended courses
- 5c8f2186: Update certificate requirements for course attending
- c16a29b1: use feature flag to determine whether to confirm credit card payment from the client or the server
- 55d102ac: Fix AOL field on edit course form
- ca236ff6: Switch date expired and date obtained columns, from certifications table.
- 9d2f7761: Fix course NOT found error for Sales representative and Finance
- 24ec3780: Fix courses status filter for org admin
- bd73cb38: Allow user to search by first name , last name and part of each.
- e488e06d: Add countries phone number input
- 83cdfcc6: Refresh eligible course for transfer on new course create
- e5dcc36d: Change geo coordonates validation.
- b22e7972: fix double payment intent when paying with credit card
- 19d90c28: Validate phone number input from Edit Profile page.
- 7e4d1128: Show emails after going back to booking details, in BookingDetails page.

## 1.5.1

### Patch Changes

- df4798f0: Organisation link in organisation details table on profile

## 1.5.0

### Minor Changes

- 9fe483da: integrate Posthog for feature flags
- 24039436: Adds browser tab titles to specific pages
- 812bd7fd: Allow users to add organisations or join them from the edit profile page. Allow admin to add users to organisations from those user's edit profile page.
- 130ea84a: Added a new Course Level for Open courses type

### Patch Changes

- dcee83e3: Map course statuses for individual roles, such as booking contact, org admin and org key contact
- 25c67f5d: Page not found rendered when booking or adding a new registrant onto a course
  Refactor some manually created types
- 46323d17: Add: TTHP-3135 certificates are only visible if attendee compleated evaluation
- 22745108: Remove Group column from the Organisations table.
- b89511fe: Add re-invite trainer button
- cb33163e: Modify trainer list in course evaluation summary pdf
- 108feee9: Add new organisation type
- fb7ffee4: Make booking contact required and fix yup validation for multiple participants.
- 6811895a: Allow access to all certificate's courses of org admin courses' participants
- 39342417: Add participant transfer page for trainer
- d4a2f57e: Fix lead trainer blended learning invite emails
- 25c86146: Fixes the indirect course editing issue regarding to AOL data not being preserved / rendered
- ae58897c: Display type and registrants columns in courses table, for both organization key contact and booking contact.
- 49fb5d7a: in user management ordered user profiles alphabetically by first name
- f68c294a: Course invites are available until the course ends.
- 83209cca: Fix incorrect trainer ratio on indirect AOL courses
- 242237e0: Fix `Back` button on course details for trainer roles
- 1fe33040: Validate organisation field on the onboarding page
- 395f9f83: Changed the OrgStatsTiles RegularBreakpoints sizes and made both the individuals and organisation tables scrollable.
- 528662bc: Change co.uk urls redirects to com
- 40864fe2: Allow sales-admin role to make aggregations on organization_member table.
- 727fcf0e: Allow only admin and LD to approve or reject a course with status 'Exceptions approval pending'.
- 16f45e2f: Booking contact and organisation key contact `All courses` button navigation fix
- 395f9f83: Improved responisiveness of the organizations page for mobile devices.
- 0c7055c2: Fix table items count
- bee66775: fix cancellation checkbox for operations
- 9e579e2f: Add Organisation Administrator to the Roles filter list
- 030164cd: Display techniques for primary module and don't show duplicates.
- 7b0d4eed: Hiding Dietary and Disabilities information for trainers
- 4a4c9a90: Display custom fee VAT in transfer review form

## 1.4.0

### Minor Changes

- 49943fa6: allow internal users to import certificates for other users
- f4677d3f: welcome page v2

### Patch Changes

- 08ec29b2: Allow users with Operations role to update the booking contact invite data for a course.
- 709532c5: Allow L&D to see only courses with ExceptionsApprovalPending status , in the Action Required Table.
- 4a26b0eb: Fix Sales Representative dropdown values on Closed course creation
- 2bc6c4d8: Add auto login on view course on trainer invite
- 3691b085: Allow searching users by given name and family name, separated by whitespace.
- f08d929f: Displaying the Organization name on Course creation Review step for Indirect Course with Blended L.
- 01022866: Fix invalid time range error and fix the organisation details page error
- f08d929f: redesign indirect course checkboxes
- 5c01e582: fix min start date message for indirect courses

## 1.3.2

### Patch Changes

- 7e36881c: Custom fee cash value for course cancel and attendee transfer and cancel
- 918f0c44: Fix: (TTHP-2441) remove duplications certifications
- 79c447f9: Changed the OrgStatsTiles RegularBreakpoints sizes and made both the individuals and organisation tables scrollable.
- 47025cfa: Allow resend declined course invites
- e00ce364: not showing traners availability if you are in external role
- ff9aca84: Update `Home` link navigation url
- b4e59e6a: Fix: TTHP-2441 remove list modules on course overview accordion view

## 1.3.1

### Patch Changes

- b1c06af9: Redirect to invitation links without redirect to knowledge hub app
- f42184aa: Redirect to knowledge app on home page
- a75ea9bb: sort BILD strategies on the course builder and course overview
- 9b982865: Add password rules wording on auto register

## 1.3.0

### Minor Changes

- 0beceefb: allow org admins to invite other org admins

### Patch Changes

- f22614ee: fix certificate bulk download on Windows with filenames
- 2c8db471: Restrict Organisation Key Contact and Booking Contacts from seeing trainer disabilities and dietary data
- 4a9a0a78: Fix Course tables sorting order [ ascending
- 37897b74: Fix Firefox and Safari wordpress homepage redirects
- fc0e3904: Profile certifications area wording updates
- 1e0649fd: Create certificate after attendee's grading
- f611d97b: Fix (TTHP-3025) permissions participans_evaluation
- 88cfc87c: Fix: (TTHP-2974) edit startDate in past error
- d50c2a6d: Add "Add new venue" button in the venue selector
- bb86c8eb: displaying add new venue btn
- d332712c: Updating base URL on staging for Health and Safety data
- 941c1b75: fix redirect issue on the courses page for BILD courses
- 38635631: Fix missing courses on discount view page

## 1.2.1

### Patch Changes

- a8da11ef: Fix redirect for unauthenticated users

## 1.2.0

### Minor Changes

- 7630cdac: add module notes when grading for BILD and ICM courses

### Patch Changes

- d1ea03cf: Sorting Resources alphabetically
- f83ccbb9: Sort Ofsted rating options
- d87023d3: Set current page the first one after applying filters on users page
- 4a00ef95: Fix certification count on get course details
- 86a789d0: finald grade wording change
- 4f3ed23f: Fix trainers unable to submit modules for Advanced trainer and Intermediate trainer courses
- bde87639: Fix incorrect VAT on booking details page
- 3b68fd48: Fix: TTHP-3033 add env production GTM id
- 95bc6bfc: Fix accept org member invite
- 7f16c63e: Fix navigation menu mobile issues
- 78437d1d: Enhancing schema validation for Course Form
- 75abc637: Fix course reschedule end date for lead trainer indirect course
- 05c14ebc: TTHP-3025 Fix: update evaluation status for course participants
- 0c5224fd: If in production, redirect trafic from hub's home page to knowledge hub's home page
- 98de613e: Disabled the moderator requirement for BILD conversions courses
- 51ddcee5: always displaying "add new venue" in open course creation

## 1.1.0

### Minor Changes

- ff0de1a2: Add support for downloading a certificate imported from Arlo

### Patch Changes

- e5938407: Restrict access to OPEN courses evaluation for org admin and booking contact
- bdb548b5: Populate Arlo reference field on course edit form
- 3b60aab7: Restrict trainer to edit course start date earlier than 2 weeks from the current date
- e5938407: Fix manage permissions for multipe organisations
- a37da3cd: update xero_code value for level ADVANCED_TRAINER type OPEN and reacreditation fase
- 34797069: Fix VAT charged at 0% on OPEN courses booking
- e5938407: altered the render conditions for course cancellation button
- d740e668: Hide trainer evaluation questions for individual user
- e5938407: Fix terms of business link on attendee cancellation modal
- 504367df: Restrict manage attendance on my courses' course details page
- e5938407: Fix "Page not found" on BILD course booking
- e5938407: Connect accesss in Edit profile page fix
- 50fa001e: Add address next to organisations on org selector for anonymous
- 6baf585d: Unset mandatory Arlo refrence id on course form
- b8c66a0c: Chip for user view/edit profile
- 3de96211: Add snackbar notification when an attendee cancelled the course
- a0ab9b98: Added VAT wording to the Terms and Conditions

## 1.0.0

### Minor Changes

- a2a6d199: Capitalizing and sorting the Course Source Values
- 4daef28f: Under course details page, two new tabs were added -> Dietary Requirements and Disabilities -> which show relevant data about each participant to that specific course
- 4bd2f9c5: Create Organisation / Edit Organisation form updates and refactor

### Patch Changes

- 98adc2cb: Changing mandatory fields on VenueForm based on user role
- 126e6ef8: https://behaviourhub.atlassian.net/browse/TTHP-2400
- 2be81069: WordPress API data return limit increase
- 0f6a7b19: display course source values based on user role
- e058760b: Organization Auto assignment -> Added the Organization Name dropdown field onto the Autoregister form on which new users land after being invited into closed / indirect courses

## 1.0.0-alpha.1.2

### Minor Changes

- 4bd2f9c5: Create Organisation / Edit Organisation form updates and refactor

### Patch Changes

- e058760b: Organization Auto assignment -> Added the Organization Name dropdown field onto the Autoregister form on which new users land after being invited into closed / indirect courses

## 1.0.0-alpha.1.0

### Patch Changes

- 126e6ef8: https://behaviourhub.atlassian.net/browse/TTHP-2400
