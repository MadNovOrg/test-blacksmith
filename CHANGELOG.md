# @teamteach/hub

## 5.5.0

### Minor Changes

- 513418f: Merge organisations logs
- a16cede: Participants' country fields on Open course booking
- 55473e0: User's agreement type filter
- 66edea3: Make sure Go1 and Connect are synchronized as needed.
- ab8208e: Only "Pass" certified trainers are permitted to lead the course.

### Patch Changes

- 830e152: Adjust access control for the delete button
- 3d3a597: Remove the unverified role after the user successfully verifies their email.
- baa6de0: Fix view individuals by levels, 'advanced trainer' tab
- 1abeba4: fix (TTHP-5236 | 5234): page not found while accepting a course invite
- 35a3212: Adjust the button alignment in the update version modal for mobile devices.

## 5.4.0

### Minor Changes

- 1e683fe: Filter users based on their country of residence
- 7f5f01b: Change default residing country for OPEN/CLOSED FT+ courses to England instead of Ireland.
- 123fd1b: TTHP-5045 remove postal address from booking on anz level 1 open virtual courses
- e69b5a7: TTHP-5160 anz | uk allow internal users to merge organisations
- d310568: Adjust AOL permission depending on the type of agreement

### Patch Changes

- c1e7d39: Mandatory country field for booking and for the organization's key contact
- a39f80b: Hide AOL sections for users who do not have permission to edit them, rather than disabling them.
- 8f97174: Fix TTHP-5169 on hold certificate update
- bea8423: Update search_fields column of the course table to be take into consideration course_trainer deletion

## 5.3.0

### Minor Changes

- 6a64c3a: feat TTHP-5139 creates and triggers an update banner whenever the current app version is different that the package.json version
- e1b3006: Add list of checkboxes to select trainer agreement type on user profile
- d2a63d1: TTHP-5053 Allow Custom pricing for UK closed courses

### Patch Changes

- 398867e: Order the resources by start title's index
- 12b36b7: Fix Indirect type course participants invite
- ab675fd: Fix assist trainers ratio for AOL and reaccreditaion Indirect courses
- 93457e6: allow internal roles to view the certifications tab after grading and before attendees evaluate the course
- bc041d0: Show uncovered modules in certificate details
- b36d8dd: New trainer role type labeled as 'Internal'

## 5.2.0

### Minor Changes

- 255ad9d: feat TTHP-5139 creates and triggers an update banner whenever the current app version is different that the package.json version

### Patch Changes

- a6683e1: Fix Indirect type course participants invite

## 5.1.0

### Minor Changes

- f140339: Apply free spaces discount on resource packs pricings on ANZ
- 27c4bb1: Org's resource packs management - course exceptions approval scenarios
- 53ac716: Add wording to suggest to users to use express delivery print workbooks when the course is less than 4 weeks away
- 776ccad: Add org resource pack pricings tab
- 61b1e80: Export Resource Packs events history
- 49671a9: Indirect course resource packs management on edit course details
- a2ba157: Org's resource packs management - participants' cancellation
- 47f4949: TTHP-5047 registration wording change
- 3639502: Org's resource packs management - course completion
- f522589: Apply Main Org RP Pricings on affiliates.
- 9fe760e: Introduce resource packs pricing for each organisation
- 4a6d474: Change the wording for the indirect resource packs checkbox
- 67fada8: Org's resource packs management - course cancellation
- dcba4c1: Org's resource packs management - after course completion
- 14d7a45: Indirect course org's resource packs management on course creation
- 029bfab: Org's resource packs management history
- 5c877cc: Rename print workbooks.
- a0bfea8: Org's resource packs management - participants' attendance
- fde7a8a: Optimizes heavy queries on the organizations/all page

### Patch Changes

- e9d55ac: Fix Users page alphabetical user sorting while maintaining performance
- c0de7f8: Hide resource packs from order details for the UK region
- 8be788e: Correct the Print Standard delivery resource pack type on the course edit form.
- 99ce1d9: Change the specialUKCondition which requires for a L2 BL Closed ICM course with less than 9 participants to have a manual price. This condition should only be applied to the UK environment.
- e0b93d0: Fix (TTHP-5107): fix historical certifications with the certification_date set as the course's start date instead of end date

## 5.0.1

### Patch Changes

- 136b3f8: Handle resource permissions for individual roles on the course materials tab.

## 5.0.0

### Major Changes

- adbbd9b: Option to select resource pack types for Indirect courses in ANZ

### Minor Changes

- 37bd341: Add workbook delivery address to indirect courses
- 04a94d2: Issue bl certificate after bl complete
- adbbd9b: Resource packs in the order review form step and during order creation
- f8f89e7: Add Indirect RP panel description
- 02fe237: Resource packs line item in connect order
- 0d49c74: Adjust trainer car expenses on ANZ
- 5d4a11e: TTHP-5036 -- course materials section redirect to Resource Area on the Course Materials folder
- adbbd9b: Resource packs order details form step
- 090079f: Require login on auto login if the current logged in user does not match the one from link's token
- c976156: Manage org's resource packs form
- 0646095: Add additional check for resource pack on Indirect course creation page
- 2e49d3c: Add resource packs tab on organisation details page
- 7bd6cf7: Db changes for resource packs

### Patch Changes

- 4e40217: Remove GST for ANZ on Blended Learning
- b1d7b57: Add start_date column on course table as well as adding a trigger on course_schedule to update this new column. start_date will only be used for sorting purposes as doing it through aggregates significantly impacts performance
- 3739edc: Fix (TTHP-4996): organisations page individuals pagination not working properly
- 1ec4439: Display trainer name with apostrophe on course trainer info
- 88909df: Make userExistsInCognito async
- 171fe99: Fix trainer icon order
- fb08656: TTHP-4945 - Fix upload avatar uploading when admin uploads avatar for another user
- 62054e0: Add logs for organisations
- 34f75c8: chore/fix --- remove unecessary fields when querying for course

## 4.21.1

### Patch Changes

- b6458ea: Fix stolen 💰🥷 TCS linkns

## 4.21.0

### Minor Changes

- 6ea37b1: Update security headers
- 8b00847: TTHP-4845 - Adjus Tabs navigation on /organisations page for the Details, Indiviuals etc tabs
- 3ae26d3: TTHP-4750 | TTHP-4751 - moderator field on all trainer courses no matter if reaccreditation. Moderator always optional
- 2bc7ac6: TTHP-4886: migrate emails to sqs and lambda
- 9d48513: Fix update organisations statistics trigger, when profile is archived
- 934188c: Allow booking/ org key contact to resend and cancel invites

### Patch Changes

- 6154dcd: Allow org admins to invite users only in organisations where they are admin.
- f9a9bd3: Fix graphql error on org create ANZ
- 00bc40f: Fix search on Resources
- b3b9b3c: Update stripe-js and react-stripe-js versions to latest
- 455cb51: Reset selected trainers when change trainer search dependencies
- ec61192: Ensure course deletion after E2E course creation tests
- 61bcb6e: Fix UK FTP modules
- b52d955: Fix lead trainer allocation on trainer creating course

## 4.20.0

### Minor Changes

- d04ebd6: Level One Open Face to Face courses course builder update on UK
- 3e4910d: Update FTP course builder for UK
- 5b12310: Allows trainers to resend or cancel invites of of member from course hosted by their organisation or an organisation affiliated to theirs ( main organisation admin )
- fed17d2: Have only Principal, Senior and Moderator trainer type filter options on Users page on ANZ.
- 654f87f: Add specific renewal cycles for indirect course for Western Australia organisation and affiliates up until 30/04/2025

### Patch Changes

- 970d7cc: Fix loading data error on view profile page

## 4.19.1

### Patch Changes

- 160ace5: ANZ release changesets https://github.com/TeamTeach/hub/releases/tag/RC-4.19.0

## 4.19.0

### Minor Changes

- 8303816: Update certificates functionality to help with Backend changes
- a0cc621: Restrict participants from canceling their enrollment in blended learning courses once they have begun the go1 course.
- 2118633: Introduce ability to flag tender courses
- e8a9b2f: Updates sameSite policy of mo_jwt_token and tt_logout cookies to Lax in order to unblock knowledgehub
- 257fc59: Update Xero Contact organisation details when updating org in TT Connect
- 8fb0077: Main org admin access to affiliate org courses

### Patch Changes

- fcb5476: Intermediate Trainer Reaccreditation course. Special Instructions
- 86af129: Restrict access to course builder of the course's grading was confirmed
- 493d6d2: Adds zap scan to dev and staging. baseline to dev and full to staging
- 265c34a: Correct currency on bl order details
- d5f733f: Fix export summary evaluation
- 82f7a69: Remove irrelevant wording on booking Open course

## 4.18.2

### Patch Changes

- 68c4ead: Update packages for ANZ issues

## 4.18.1

### Patch Changes

- d53acb9: Fix export summary evaluation

## 4.18.0

### Minor Changes

- b3e6d49: Open course resource packs for ANZ.
- c6ad6d0: Closed type course, Foundation Trainer level
- 70983df: Add Arm waltz in L1BS Separations module on UK.
- be4e372: Remove the need to have moderator on the Intermediate Trainer ANZ.
- 0433341: Allow trainers to deliver courses within affiliated orgs
- b64de15: Closed Course ANZ Resource Packs.
- 7fbcafb: Updates the Homepage to show relevant data related to FET for UK region

### Patch Changes

- 686235e: Fix phone number input country flag on invoice details
- e1d2fea: fix (TTHP-4752): selected trainers not displayed
- f87dbcb: Fix issue on save changes after uncheck AOL with 0 course cost on edit page
- 889971b: Fixes and issue which would block merging users due to evaluations being scheduled
- 05e5a09: Fixes an issue where TOS would not be displayed on the auto register pages
- 5a49c9e: Limit attendee transfer post grading
- f12eb46: Validate country codes depending on the environment

## 4.17.1

### Patch Changes

- 85af17c: This is a dummy release in order to update the gmaps key in the latest production build

## 4.17.0

### Minor Changes

- 074ac06: Update open course booking Terms of bussiness wording

## 4.16.0

### Minor Changes

- 1d3ec8e: Change terms and conditions link on anz.
- 1d3ec8e: Add wording info under course residing country selector.
- 1d3ec8e: Allows lead trainers to select / deslect modules for OPEN / CLOSED L1 / L1BS / L1NP / L2 / Advanced modules while on grading flows and on course builder

### Patch Changes

- 1d3ec8e: Restrict editing unsupported delivery type in blended learning courses
- 1d3ec8e: Log user auth events

## 4.15.0

### Minor Changes

- 8162a81: Open course attendee evaluation starting with last day | Deletes evaluation if attendee was later set as not attended | Schedules evaluation email if attendee is marked as attended before course end date
- 1b89ba5: Allow trainers to view summary evaluation
- 498ef8d: Schedule pre training surveys to 24H before course starts and post training surveys to 7 days after the participants have passed the course.

### Patch Changes

- d2c3ef1: Knowledge Hub links for ANZ

## 4.14.0

### Minor Changes

- 70abf36: Update ANZ course modules
- 8b9fa12: Schedule pre training surveys to 24H before course starts and post training surveys to 7 days after the participants have passed the course.

## 4.13.1

### Patch Changes

- c2b78dd: ANZ workbooks order link, invite attendees wording change

## 4.13.0

### Minor Changes

- ec12315: Hides the Proceed button on indirect course creation as trainer while there are time related exceptions
- 92aeed6: Closed BL course license management and participants license management
- 7a354b7: Improve management of go1 licenses for Indirect type courses
- 5cbda89: Restrict attendance management after course completion
- 5c861f6: Hide MCM on ANZ.
- 8339945: ANZ Main and affiliate organisations go1 licenses management
- 9eb7359: Level 1 Non-Physical ANZ complete setup.
- 942f5c8: Add ANZ LEVEL 2 BL modules. Rename Seperations to Separations. Rename Preperation to Preparation.
- 1e53ad3: ANZ course modules.

### Patch Changes

- 2e63b55: adjust positions list for ANZ

## 4.12.0

### Minor Changes

- e225da4: Adjust trainer ratios for indirect ANZ courses.
- e225da4: Remove certificate requirements for attendees on non-UK courses.
- e225da4: Remove trainer ratios for open and closed courses on ANZ.
- e225da4: Allow main org admin to manage affiliate org invites
- e225da4: Redirect all unverified users to the "Verify" page, except when booking onto an open course.
- e225da4: Use Australia default phone number prefix on ANZ
- e225da4: Adds blended learning toggle under feature flag for ANZ
- e225da4: Hide payment by CC on australia.
- e225da4: Update internal emails.
- e225da4: Restrict ANZ users to create organisations on registration / onborading / auto-register

### Patch Changes

- e225da4: remove welcome email trigger
- e225da4: Fix DfE Organisations dupes
- e225da4: Don't allow course creation without scheduled price in Australia, for ANZ
- e225da4: adjust discount page
- e225da4: adjust discount levels for ANZ
- e225da4: Display correct currency for applied discounts
- e225da4: allow setting certificate duration for foundation trainer

## 4.11.0

### Minor Changes

- a719423: Add British Oversease Territories as countries in the country selector.

## 4.10.0

### Minor Changes

- 56003fa: Rename Positive Behaviour Training to Behaviour Support Training.
- ae5575a: Adds a hasura REST endpoint to be accesed by KnowledgeHub in order to read profile knowledge hub access
- 4a662f6: Adjust certificate import tool for ANZ.
- 90d1d0d: ANZ Edit price table
- 754fa34: Course residing country filter ANZ
- cd04be9: Add Open Foundation Trainer course level on ANZ
- 7c64fb4: Add course pricing for FT anz
- 5e620ce: Closed Level 2 BL Reacc modules setting
- cd7e8b6: Adjust onboarding flow for ANZ.
- 64c3811: Move Course Residing Country selector at the top of the General Details Section.
- a0de8d7: feat (TTHP-4262) ANZ indirect courses blended learning currencies and prices updates
- c7a9e8e: Add missing course pricings for ANZ
- dc428c7: Add Edit org affiliation link for ANZ
- a0f2e7d: Foundation Trainer course management adjustments
- 0677637: Add Foundation Trainer course modules.
- 0a0da4e: Auth pages heading for ANZ
- 893f85a: Allow main org admin to remove and edit individuals on affiliated orgs
- f33b239: feat (TTHP-4120): ANZ bulk organisations import
- bd01f65: Updates Google Tag Manager to trigger page view events on each page switch
- 2a98bc8: LinkedIn link on footer for ANZ
- 606a16b: ANZ course certificates
- 5e52bca: Add Foundation Trainer in the "Individuals By Level" section on Organisations Page.
- 3e281a6: FT attendee management adjustments
- cad60dd: Adjus default currencies to work with both ANZ and UK ||| Split Course creation into two separate forms
- 9a67266: Update to 2 years L1 BS certificates validity

### Patch Changes

- d7841ba: Only one promo code can be applied, and promo code discounts are not applicable to mandatory course materials.
- f6151d7: Do not allow decrease of course's max participants less than sum of current participants count and pending invites
- 99ec4c2: Adjust the wording related to ARLO
- c4740e1: Remove BILD AOL and Arlo references for ANZ
- 1a33d98: adjust creatable indirect course levels for ANZ
- 757e218: adjust creatable open course levels for ANZ
- 42fb7a4: Don't reset residing country when course level changes.
- 6ceac0c: Don't allow course creation without scheduled price in Australia, for ANZ
- 7df2db4: Trim email input before validating.
- d9f1ff5: "Do not re-rise approved exceptions"
- 13f561a: adjust alert wording related to ARLO for ANZ
- 6923929: Show all individuals in org summary table.
- cc8faca: adjust creatable closed course levels for ANZ
- 4c0b189: add hint message for residing country inputs
- 3c97e2e: Fix organization invite query not allowing authenticated users to accept invitations

## 4.9.0

### Minor Changes

- 50134ad: Allow only UK countries in postal address.
- b2a3c70: Add DFE urn column to organization table
- ff0a5ed: Invite individual to organisations ANZ adjsutments. Change managedOrgIds array from auth to include affiliated org ids.
- 7202547: Validate email addresses in accordance with the RFC2822 standard
- f8ab157: Adjust invite individual to org from profile for ANZ
- 6eb256b: Registration form adjustments for ANZ.
- 3926a5a: Adjust onboarding flow for ANZ.
- a9bec89: Organisations page ANZ adjustments.
- ef5107b: Add phone number input on DfE Organisation form
- 0a47c03: Affiliated organisation dashboard adjustments.
- fd41fa9: Adds region specific permission
- 086a84a: Edit organisation ANZ adjustments.
- 395f11b: Unlink affiliated organisations
- ea19200: Delete organisations adjustments
- 831231d: Edit Profile page adjustments
- 86100b3: Update trainer course creation workflow, submit course after course builder step completion
- ded539b: Allow org admin of main organisation to view statistics about affiliated orgs.
- 059d40a: Create main/affiliated organisations relationships.
- 0037eb9: Create organisation as internal user
- a2a9027: Allow internal users to add affiliated organisations
- ed12301: Allow org key contact to view participants' attendance
- 9ac35a4: Adjust main organisation dashboard for ANZ.
- 1d30579: Create organisation as external user

### Patch Changes

- 774b0d9: Fix more info link on booking review page
- c707ab6: Increase retry times and interval for go1 link endpoint
- 1535c7e: Do not require onboarding on invite accept
- 62ca31a: Replace Pass grade with Non Physical grade on Level 1 Virtual courses
- 9430b8f: Remove right to withdrawal on footer
- d3a7789: Assign by default 'user' role
- 7a6c937: Filter orders by course residing country
- 8d841e0: Do not re-throw course exception when trainer edit foreign course
- f79621d: Fix orders filter by country
- 54885df: Restrict creation of Closed L1 Virtual blended learning & reaccreditation course
- 25b7f77: Fix negative VAT
- a7eae8f: Allow create venue without postcode for admin role
- e1432f1: Trim Promo Code on duplicate validation

## 4.8.0

### Minor Changes

- 3c500f0: Organizations filter by country
- 3c500f0: Display the replaced user on order details
- 3c500f0: Application improvements: Course search field as table column (no more computed field calculation at every search), removed alphabetical ordering on users page, organization statistics (individuals count, certifications counts by their status, org members upcoming enrollments, etc.) as table values, with neccesary triggers on tables and cron job trigger every day at 12:10 AM.
- 3c500f0: Mark cancelled attendee line item as Cancelled

### Patch Changes

- 3c500f0: Display Vietnam instead of Viet Nam
- 3c500f0: Zip code is not required on venue form
- 3c500f0: Fix org count on organizations page
- 3c500f0: Change Organisation filter placeholder spelling to UK version on course details.
- 3c500f0: Handle old version modules for course participants
- 3c500f0: Allocate trainer role after grade is PASS and evaluation is submitted.
- 3c500f0: Do NOT include not attended participants in grading functionalities
- 3c500f0: Fix All courses back button on course's builder page
- 3c500f0: Org selection bar on manage courses page for booking contact in case of Open courses

## 4.7.0

### Minor Changes

- cfc71f5: Schedule price changelogs
- 61bf294: Add view for international hubspot reporting
- 412f5d4: Add Senior trainer and ETA trainer WordPress reources permissions
- 0420a39: Allow only trainers with Foundation Trainer Plus certificates to create a L1 BS course
- 31d60c1: Add search and filters on course details tabs.
- 45d3f2f: Manage user's access to Knowledge Hub from update profile
- ade0a69: Add Hong Kong to the countries list across the app
- d7b70ad: Add Cayman Islands to the countries list across the app
- 53cb016: Course pricing updates, pricing removal changes
- eea21d2: Add arrow dropdown icon next to phone number input country selector
- d9b7e70: Restrict access to Knowledge Hub
- aa62e06: Scheduled pricing section updates

### Patch Changes

- d3d8e61: Display quantity on Indirect BL course order
- b8a7d76: Remove BILD levels and Indirect course type from course pricings filters
- 713129e: Map Connect country names to HubSpot valid ones
- 7a63b5d: Remove L1BS, Advanced Modules and BILD Certified from discounts list.
- 45ffa1e: Fix error on order details page for Sales Admin role
- cfe4d03: Move related functionality into modules
- 775a81b: Redirect internal user to course wailist page when there are no spaces left.
- e553f4a: Set Delivery type to F2F when changing the level from L1 Virtual.

## 4.6.1

### Patch Changes

- 2450a14: Fix legacy certificates view not being available
  Fix Organization heavy query

## 4.6.0

### Minor Changes

- 38ad7fc: Set discount amount to free course materials and subtract it from total cost.
- 76fa5eb: Update and refactor the structure of the waitlist functionality
- 55801b8: Display Resources when a user has a course in progress

### Patch Changes

- 9af3ab3: Improve search by user's name on certifications page and trainer search
- afc85f2: Fix organizations toolbar on manage courses page for booking and org key contact
- 75aae01: Redirect trainer to My Courses page from snackbar link.
- 82ea051: Case insensitive search by local org on org selector
- c8d068d: Capitalise Knowledge Hub
- b4ee3b3: Do not allow Dfe orgs duplicates
- c1480cb: Get rid off new-modules-data-model feature flag
- 1344571: Validate user's email and countries for hubspot sync

## 4.5.0

### Minor Changes

- cf8a74e: Create SQL views for Hubspot Dashboard
- 3b44469: L1BS CLOSED | INDIRECT BUILDER UPDATES
- 18d4aca: Assist trainer ratio for Indirect international courses
- bead050: Display MCM cost info depending on the course currency
- edd2a6f: Profile name and surname special characters
- 93090d8: SRT | MVA -> FTP | BS certificates mapping
- c51ec5c: Remove VAT from MCM closed course
- 3b44469: L1BS course builder adjustments

### Patch Changes

- 720ea00: Check AOL course cost to be greater equal to 0.
- a5f227e: Don't display checkbox error for Connect Fee if it is not displayed in form.

### Patch Changes

- 260d615: Fix auto register flow

## 4.4.1

### Patch Changes

- 5acf3b1: Hotfix: Fix registration flow failing due to missing org id

## 4.4.0

### Minor Changes

- 82781f9: Allow creating new Org as international user
- 82781f9: Add mandatory course materials for closed courses
- 82781f9: Add Indirect L1 BS course codes
- 82781f9: Add profile's country field for HubSpot users sync
- 82781f9: Updates the Create Organization flows to allow for international organization creation
- 82781f9: Add Mandatory Course Materials cost on Open Course.
- 82781f9: Don't display Connect Fee condition on international indirect courses.
- 82781f9: Handle historical UK organisation on edit organisation form
- 82781f9: Edit number of mandatory course materials on closed course.
- 82781f9: International organisation create

### Patch Changes

- 82781f9: Display course order xero invoice number link
- 82781f9: Upcoming enrollments are courses in present or in the future.
- 82781f9: Fix organization form fields' error messages
- 82781f9: Restrict organization search only to trainer's organizations on Indirect non AOL course creation
- 82781f9: Display subtotal minus allowance on go1 order licenses review
- 82781f9: Apply international organisation create changes on add organisation form on create course and user sign up
- 82781f9: Display org country as default on org edit form. Display org details fields based on org's country
- 82781f9: Fix Sales Admin can't invite attendees
- 82781f9: Display default rows per page for licenses table

## 4.3.1

### Patch Changes

- 1c8c8e9: Hotfix test

## 4.3.0

### Minor Changes

- 3e59e94: Update assist trainer ratio for Indirect Advanced Modules course
- 9fa3c86: add pre-crouse materials tab to coure details
- 1581dcb: Display Review changes dialog on edit closed course
- a0f3608: Add wording changes requested in ticket 3795
- 7f87ccf: Adjust created date on courses table
- 6b16ed9: preselect grading modules
- dd0788a: Add comment box for Additional comments for the attendee course evaluation page.
- 3e73e32: Sort by date on profile tables
- c1580de: Add new countries
- 9541227: add Level 1 Behaviour Support to indirect courses
- 9c98b97: Add E2E smoke tests for course creation, levels Intermendate Trainer and Advanced Trainer.
- 1ea9c51: Update trainer ratios for ICM/BILD Closed Advanced Trainer.
- 4c2d12d: Enable Course residing country on indirect courses
- 1e656be: Add L1BS rescheduling terms
- e7b0b4b: Postal address fields on UK L1 Virtual course attendee transfer and replace
- 8fea268: Enhacement on course invitation
- 329e73a: Remove postal address fields for Open Level 1 non UK course

### Patch Changes

- 40c6fae: fixing incorrect calculation of free spaces discount type
- 8a17b47: Do not go to review and confirm order page if there are duplicated registrants
- 1b57a53: Fix no special instructions display
- 0ea06bd: Time zone format on course reschedule audit
- 19e90b3: Do not allow trainers to accept Cancelled or Declined courses
- 110bc2e: Increase number of retries for license purchase action
- 2275c4c: Fix Bite Responses module duration
- 4483768: Change course residing country validation error.
- c9f65d7: Save initial data on back btn click from transfer review
- 06780d9: dont query ORG BY ID on AutoRegister page
- 70fb7c6: Fix purchase go1 licenses
- 045045f: Update stripe-js version to fix Sentry "Failed to load Stripe.js" error
- 1acffb9: fix sales admin not being able to use custom cancelation fees
- db0c824: Display booking and organisation key invite data on course details page
- 00d2705: Do not send email notification about duplicates users email on user profile update
- 205d470: Fix resources nav link for trainers
- 31b66bd: Fix data displayed in 'Individuals by training level' table
- 4140243: Fix trainer cannot create BILD course
- 5f7c357: Display Organization name on Auto Register form
- a0dba1f: change booking checkbox text for international
- 9fbfcb0: Fix trainer expenses button
- 1961aea: fix edit course details default AOL value
- cf43a56: Fix draft course creation
- 43f5356: adjust transfer participant paths for sales admin
- 296db96: fix condition for showing country selector
- fae3e99: fix re-inviting user bugging out
- c542953: Small fixes for postal address form on attendee transfer and replace forms

## 4.2.0

### Minor Changes

- 17f81b0: Rename 3 Day SRT course level into Foundation Trainer Plus
- 027fcc0: additional unit tests for course creation and course edit
- 6e1ef9c: Filter "individuals by training level" by MVA level
- ed4112a: Closed Level 1 MVA course builder
- 3d59565: add translations & enum for L1 MVA
- 7294b11: Rename Level 1 MVA to Level 1 BS

### Patch Changes

- 19cab4a: Handle historical 3 Day SRT courses
- 3e209c4: Add E2E tests for org admin, book open course from organisation page.
- 7556dce: HOTFIX: Fix Organisation admins being able to see other course attendees data
- c2e77c3: Change negative position for split_part function
- f711f06: Enhancing course creation form schema
- 7b2a419: fix creating discount codes for level 1 Behaviour Support
- b20d187: Apply Trainer Fees for Foundation Trainer Plus when transfering attendee.
- 1547bc0: Fix Organisation Sector Filter
- 3d0bd9f: allow creating CLOSED ICM Level 2 course with UK country, non blended or non reaccreditation and less than 8 participants
- 4cb8a42: change course crtificate number function
- a2dccc6: Fix organisation form not null ofsted rating restriction

## 4.1.0

### Minor Changes

- d7ef54e: Remove price hint when creating ICM Closed course Level 2, Blended Learning with less than 8 participants

### Patch Changes

- e923baf: fix query invalidation after merging users
- 8f6b381: Handle legacy certificates when displaying them on profiles
- 6e6b50f: Restrict course builder edit after grading confirm

## 4.0.0

### Major Changes

- 229bd68: prepare order details section of CLOSED courses for international

### Minor Changes

- eaff25b: Unit tests for course creation scenarios
- 897505c: store email notifications to Hasura
- 216a58d: Delete organisation modal message display changes
- 04d5a5f: Closed 3day srt course management.
- 6f35791: Add filter for 3day srt level on organization page.
- 04d5a5f: add modules for closed course 3 day SRT
- 1e4ac37: Level One MVA course creation
- 5568fdf: Renaming next button label for create Indirect course as Admin
- 4c3f7e3: When creating a course of booking someone to a course, display error banner if there's no price set for the course
- 1f8b52a: Residing org in register page to search by name and postcode
- d431bda: Delete organisation without any entity linked
- 1236ec7: add filter courses by reaccreditation
- e75df75: Delete Indirect non blended learning courses
- 1000d83: Add timezones to various places where hours are being displayed
- cf003a0: Level 1 MVA course codes
- cffeee9: Limit the venues to the selected residing country
- b067f3e: Display course timezone when transfering participant.
- 303195c: Enumerate all order references on orders page table
- f0f2ec9: Do not allow editing a course without scheduled price
- 3416741: Allow org admin to view cancellation requests made by booking contact.
- e120faa: Add XeroInvoiceNumber column on course_audit and course_participant_audit tables. Create computed field for searching by query.
- 646a5d4: Bring create course form to a standard.

### Patch Changes

- cc17e94: No price needed when creating INDIRECT course, therefore always allow creation
- 48dfa48: Fix org enquiry on registration forms
- b3e40f7: Add pricing for Closed 3 Day SRT courses
- fd54828: Attempt to fix 'Failed to load Stripe.js' sentry error.
- a14c2b3: Change venue selector required condition.
- 69f5e3c: Display ' as it is, not as character entity reference.
- 03dae06: Time zone on cancel attendee pop up
- efacc2d: Refetch course prices with "network-only" policy.
- 39c7c93: Fix Small Child and One Person Holds module
- 01aaee0: Frontend clean up after monorepo migration tentative
- 3df41d5: Fix data caching on delete org modal
- b311e39: Fix curriculum is not iterable error
- 022abac: fix race condition in approve/reject course exceptions
- a730a25: Improve Postgress max connections on e2e tests
- ca077cd: Send leader and moderator when checking for trainer ratios exceptions.
- 06a9d3d: Fix User selector showing duplicate emails while replacing participants
- 054f8db: If there are disabilities or dietary requirements, display them in text field on edit profile.
- 39f5d24: fixing issues found during testing
- 173e5fa: Display 'No' if user confirms that it doesn't have Disabilities or Dietary Requirements.
- cb96a94: Fix not save course builder
- e4d29dd: Attempts at fixing unexpected end of input error
- 192b78c: UK date format on profile certifications
- 04d5a5f: Fix Orders being saved with eronate names
- 1235159: Disable blended learning switch for Closed courses
- daeab88: Convert course pricing schedule effectiveFrom and effectiveTo dates to UTC.
- 750b0f2: Allow only org admins of hosting organisations to request cancellation.
- 2dbd27f: disable evaluation if H&S form is not submitted
- 7c027fc: Stabilise unit tests
- 16de251: Display certificates on user's profile only after it submits the course evaluation.
- 04d5a5f: feat(TTHP-3636): amend 3 day SRT modules
- fc9b7c5: show time zone in the replace attendee modal
- 8dc0d16: extract all data when exporting audit logs
- 04535f4: Only show UK countries when creating a BILD course
- 12c2e03: No price needed for creating BILD Indirect course
- 90e9714: Update Refresh of Intermediate Techniques module lessons
- f55d75e: Add missing permissions for tt-ops, sales-admin and trainer to insert vat.
- 2a154ef: Add validation for inserting and updating course pricing.

## 3.9.0

### Minor Changes

- ef902c8: Update replacement form to give suggestions based on user's organization

### Patch Changes

- d0d5a2f: Add search only by post code also for dfe organisations
- c0ffaba: Modules for Indirect BL Reacc Level 2 course's builder

## 3.8.0

### Minor Changes

- fc00a2b: Allow org admin to view attendance status
- 83e71f0: Updates the transfer flow to include address details field on transfers from L1 F2F to L1 Virtual
- 980ac9c: Update order's address / registration section to account for transfered attendees
- 910f180: Allow request organisation create instead of organisation creation on register pages
- d03f3c6: Limit number of upcoming courses on organisations page to 5.
- 1b50fff: Org search only by post code on registration forms

### Patch Changes

- b355b02: Fix snackbar on Indirect course create
- e01fc58: Check if certificate is in grace period before displaying 'Course Certificate Required' warning.
- b606763: Fix google is not defined error
- 4fcdbd6: Trainer role courses filter wording change
- 6afd7e3: Grading - course curriculum type error fix
- 584b89e: make venue selector take country from course details
- 606a040: amend modules, order and wording for advanced trainer bild course builder
- 9e891e8: Fix resource area access for trainers
- 0621c2d: Add org selector search only by post code on onboarding form
- 6c71308: Fix next step button on Indirect course creation form for internal users
- 8bb10c0: Move create organisation option at the bottom of organisation selector
- dc0dc90: Convert schedule time for review changes modal
- e2e958b: fix exceptions alert header when there's only 1 exception

## 3.7.0

### Minor Changes

- c942ce8: Update orders transfer logic to account for multiple courses on the same order
- 033cfde: Hide the Registration section of there are no registrants on an order
- 1080e07: Add table for post training survey emails, in order to send them after 24 hours.
- e04d37e: Modify UI and email templeates to reflect course currency and VAT.
- ceb704f: Restrict AOL checkbox from non Employer AOL, Principal or Senior trainer
- fc141d1: Ask users to add residing country when they log in.
- 61a1647: Update the order details registrants section to account for users with missing bits from their address
- 92b79a1: Update Organisation search to search also by address and postal code values
- b68fcd6: Update assistants trainer ratio
- ceb704f: Allow internal users to select the lead trainer for Indirect courses
- 582aa89: Add course filter by trainer type for trainer role and internal users

### Patch Changes

- 4fd1f67: Intl on booking details
- 60999d5: Make venue fields optional only for admin.
- dff0dbc: Fix useAOL in trainer search
- 5a207b4: Fix ICM modules overview order
- 8a96565: Fix organisation edit form
- 94638e2: Make country required on auto-register form. Revalidate field after clear button was pressed.
- fe7858d: Optimize booking contact manage courses fetch
- adcfd83: Fix assist trainers ratio
- a3d3c91: Make zip code field not required on booking contact details
- 21bf61c: hide venue form info icon for non-UK countries
- 8e43532: Fix tthp-3618 fix course creation
- b776771: remove course builer time commitment dialog for Advanced Trainer Reaccreditation
- e5f43a7: Fix post/zip code field on booking details page
- 1c0ad95: Fix Orders being saved with eronate names
- 5ba08c5: Fix intermediate trainer course builder
- d2b85fe: Fix booking contact courses permissions
- 69c9796: Fix org selector options on new organisation create
- c864fda: amend bild duplicate course builder submodule
- 0bdb977: amend bild modules
- baaad6f: Properly show the importing progress of arlo certificates import functionality
- 8f45fe9: fix (TTHP-3643): Fix order "source" field retrieve
- 004f40e: Fix name field on add organisation form
- 8e43532: Fix: (TTHP-3618) unable to create inderect course
- ab62742: Revalidate date of birth on auto-register form when user changes date.
- af47540: revamp the conditions to mark attendance
- 308cba0: enable virtual & mixed delivery for build conversion courses

## 3.6.0

### Minor Changes

- 2272230: Handle day saving time for course's timezone. Replace luxon library with date-fns-tz
- a4eb109: International course, attendee cancellation adjustments.
- ed55196: Add time zone field on course create form
- ece8098: Only show UK countries on Venue when creating BILD course
- e8ec10f: remove strategies for BILD trainer conversion courses, add modules
- 675138c: International attendee transfer currency ammendments.
- 37108f3: allow submitting evaluation feedback on the last day of the course
- 1ba7a0f: Add filter for certificate type
- 240836b: Completely removes swr and use fetcher

### Patch Changes

- 49cee46: don't issue a certificate to a non-graded participant
- e8d1e7d: hide VAT and currency fields instead of disabling them when international is not applicable
- af64f06: Fix pending and declined invites count and display them accordingly.
- 80f9da8: hide duration of strategies and modules for BILD trainer courses
- 85a7fec: Redirect invited user to auto-login only if it exists both in cognito and in database.
- c05efc1: remove duration from order details
- 74d87a7: Fix attendees' course evaluation view page
- 3a557f2: Fix GMT time zone value on edit course page
- 822869d: remove hip chair lesson from ground recovery safeguards module
- 728ab8d: don't display modules that don't have any covered lessons when grading
- 56fef61: Update GetPromoCodes query to apply the where condition when retrieving the aggregate count.
- 946cad9: Adjustments on edit INDIRECT BILD course related to warning banner for Trainer & Attendee ratio
- 8a066b1: add module settings for level 2 indirect F2F blended courses
- dfcc406: Fix put certification on hold
- e8d1e7d: Fix price calculation for BILD course
- af6635f: Fix (TTHP-3261) edit inderect course operations
- 3574d8d: Fix: TTHP-3214 error handling create order
- 1757ec3: Display submodules on certificate view page
- 0bb87f1: add missing modules for level 2 closed blended courses

## 3.5.1

### Patch Changes

- 71d65e6: Display correct course price when booking someone to a course
- 83cfda3: Fix booking details pricing

## 3.5.0

### Minor Changes

- 5211407: Update 3day srt course builder for new data model
- 6fc77fc: International course, attendee cancellation adjustments.
- 59c7131: Replaces useFetcher with urql (P2)
- f2522c3: Disabled fields on course edit
- ccce959: International attendee transfer currency ammendments.
- 325d076: Remove 'Cross over' technique from all course modules and techniques.
- f2522c3: disable editing the price in CLOSED courses
- 5d09ab7: add modules to BILD trainer courses
- 6c08c3e: add currencies to closed course trainer expenses

### Patch Changes

- 627051b: Fix schedule pricing
- 8d92082: fix closed course international features
- fb232bf: adjust spacing for miscelnaous costs
- 387a9e3: Fix Course Booking Review Being blank

## 3.4.0

### Minor Changes

- 4df18da: Replaces useFetcher with URQL
- 168cd26: Allow lead and assist trainer to manage course participants for closed course that has not ended.
- 87dbfb0: remove use-stripe-webhook feature flag usage
- 9d3cc11: disable Sentry session replays in dev, lower the volume in staging
- 9a0695b: Adds indexes on some commonly queried table columns
- 5ca502f: Add filter for course countries on MyCourses/ManageCourses pages.
- 17c5367: Reveal Finance section for OPEN course creation with UK country
- 3014ea0: add international for closed courses on the first page of course creation
- 3d73763: Allow search by multiple criteria.
- d1b7ecf: remove import users feature flag usage
- 438a102: Add additional fields when creating organization.
- 735cff6: Replaced useSWR with urql P2 - final
- d4c3bb4: Replace swr with urql app wide (P1)
- c29f45c: Sort course evaluations by trainers and alphabetically on Course Evaluation Tab.

### Patch Changes

- b2aa21f: Add currencies in currency filter on the orders page
- abd7382: Fix: (TTHP-3449) fix issue price Level 2 courses
- 7ffc17e: Keep TextField values
- 83273da: add a missing lesson for `NON_RESTRICTIVE_TERTIARY` strategy
- b73616a: Allow sales admin to view trainers on indirect courses
- 9f27a7d: Show course price on edit course
- 1f2e10c: Fix: (TTHP-3476) course evaluation summary
- 8a9ea15: correct course status when confirming ICM modules from draft status
- dcff8df: fix case creation exclusive options & invoice polling
- 565c172: Allow Finance and Sales Representative roles to select course evaluation answers.
- dfd4183: hide estimated duration for BILD trainer course builders

## 3.3.0

### Minor Changes

- b76b7d9: Attendee replacement after course ended
- 3a635a9: add `imported` and `account_confirmed` to the `hubspot_user_sync` view
- 11ed544: Improve the Certifications page load time
- 93975ac: Add course registrants to order details page
- 2f108cf: Wording change on edit BILD course

### Patch Changes

- e25338b: Handle and display message for invalid invite's token
- ac58e3c: Fixing condition to display the Resources are on the navbar
- 359791a: allow admin to bypass exceptions on CLOSED courses

## 3.2.0

### Minor Changes

- 0acd948: Add 'Website enquiry' sales source.
- 5eadc82: Add 3 months about training survey email shceduled event
- 2e37193: add import tracking properties to the profile table
- 13478b6: Restrict Trainer to increase participants count on BILD courses when editing
- b39958c: add search by name to organisation courses
- 5a50def: Remove 'Bite Responses' technique from BILD course strategies.
- ca49244: Updating prices for 3 Day SRT course level
- aabf159: add hyperlink to organizations from users page
- 4203e90: Confirm user accepted invitation with specific message.
- 2f1e7bd: Add 'Small child escorts' technique to the 'Small Child and One Person Holds' module.
- 4b4505d: trim and lowercase email when submitting
- babd581: Moves the organisation profiles logic to the backend server trough the getOrganizationProfiles hasura action
- 0c358fa: Remove access to Resources if user has expired certificate

### Patch Changes

- cea5edf: Show the Accept/Rekect banner when there are no exceptions, but the status is "Exceptions Approval Pending" + refactor
- 9e3d258: Display course overview for user roles
- d753d8f: Do not redirect to course builder once modules were submitted
- 20324a5: Refresh page when adding a certificate to user profile
- 615e60f: fix edit profile form refreshing when editing organizations
- f94e83a: Fix the Invite Individual To Organization search input
- 30b2508: Show trainer's evaluation banner if the course has been ended
- 5fcdab6: Update the retries on create_certificate trigger
- 44ccd6a: Update trainer ratios according to the new requirements.
- 11285ec: Fix course editing not redirecting the user after saving changes
- f4ffa16: fix editing position doing a refresh when editing one's own profile
- 229f606: Fix null default status when creating course

## 3.1.0

### Minor Changes

- 8ea3fbf: Allow invite attendees after course ended for Administrator, Operations and Sales administrator roles
- 9b6f18c: Add user import page
- 8e49614: Display course invite expires in
- 6be0c91: Change 'Country' to 'Residing Country' on View Profile page and Edit Profile page.
- 1eb8464: Configure GraphQL subscriptions

### Patch Changes

- 6678e1e: Graded on modules with new module data model on certificate details
- 4499528: Update the stripe.js version that fixes "failed to load Stripe.js" error.
- cb003b6: Fix: TTHP-3368 all organisations for orgAdmins
- e840838: Make AOL course cost required, and greater than or equal to 0.
- 9046a29: Participant grade page with new module data model
- 7125ebc: TTHP-3220 fix booking redirect for orgAdmins
- d1c48eb: Fix: TTHP-3368 upcoming enrollment course
- 1d4c570: change archiving condition to allow proceeding if the trainer is in any courses with the state "Missing Evaluation"
- 922b6cd: Fix failing E2E advanced modules coures builder test
- 5ba7dc1: make new venue form added through google maps suggestions have the prefilled fields disabled
- decd5e9: Fix search on manage courses page
- e58277b: Do not display lead trainer in grace period exception for the assistant trainer
- eb72ced: Fix redirection to organisation page after an organisation is created
- 66614af: use error instances when throwing in gqlRequest
- ce264a6: TTHP-3368 fix orgAdmins course enrollments
- bd7ce30: Disable invite tools for draft courses
- b74baee: TTHP-3457 fix wording cetificate download
- 57fedf6: Add permission to select 'include_VAT' from 'course' table for finance and sales representative role.
- 16d2e57: make autocompleted venue fields optional only if they are not empty strings
- 77c466c: change tsconfig target to ES2021
- c7e48e7: Display certificate module for org key contact and booking contact

## 3.0.0

### Major Changes

- 6731045: Refactors the useOrganisation logic in order to improve performance

### Minor Changes

- e7aaf04: Adds correct navitation whenever an user selects an organisation from the More menu / See all organisations / Organistions dashboard
- 2438280: Paginate organisation/list page
- 6dfb081: Move Organisations Functionality under /modules
- 40d5908: Add internationalization on booking course
- 959ef39: Add internationalization on the order details page
- f02a024: Updates LD permissions to be able to query total orgs count
- cbb1fb8: Remove Knowledge Hub redirect on Home page in production

### Patch Changes

- 3f2457b: add spacing in certificate info subsections
- ba623b6: Add course overview tab for booking and organisation key contacts
- 3aa44b5: Add retry for course status calculation event
- d67cb72: Increase certification creation retries
- 1d4f635: Update courses search by trainers full name

## 2.5.0

### Minor Changes

- 8d441c3: grading details with new modules data model
- d62e7b6: ICM course builder to work with new modules data model
- 03187af: Ensuring new course level 3-Day Safety Response Trainer allows access to Resources

### Patch Changes

- 801a6f2: Add pagination to org summary
- 3d4bd57: Fix dietary restrictions count issue
- 9ae3b42: Fix BILD course builder missing modules issue
- eb7fd12: Fix certificate expiration dates for L1 and L2 indirect courses that start in 2024
- 64c8c2e: Fix accreditedBy property of null error
- bd9d3c3: Display a better message when error due to Xero on placing booking
- 37b5299: Course invitation wrong message fix
- 2044fe4: Increase num of retries for trainer role allocation on insert certificate event
- fa47b6e: Add dob validation on editing profile
- 01e29cd: Change course details banner to not overlap text
- 4f72ab8: Edit finance section of an international course
- 7dd4703: Fix currency select on create course form
- 92ce6a7: Remove blanks and lowercase email for Add or Edit Organisation
- 92eae54: Fix trainer role allocation adter add certificate on edit profile
- 945f237: Search by certificate number on the certifications page
- aee7205: Allow Sales Admin and Sales representative roles to see the `Courses as a trainer` table withinuser profile
- 8638539: Add grace period for 3 day srt
- 1d24a80: Add default user role on edit roles for users with only booking or organisation key contact roles stored in the database

## 2.4.0

### Minor Changes

- d6d0efee: Add grading for 3day SRT courses.

### Patch Changes

- 71ebf815: Refresh the table of attendees
- c82fa3ea: Make Country and Job Title as required fields when editing profile. Remove organizations that user left from the list in the profile.
- a3fe9d1e: Fix error on course creation for trainer role
- 91ed02c8: Add permission to country and countrycode to unverified user
- 70063b0f: Update user permission for course invite to be case insensitive by email

## 2.3.1

### Patch Changes

- 855d9de4: Fix course pricing migrations

## 2.3.0

### Minor Changes

- 51ee9539: Add residing country column to Users page
- 32528b7e: adds an event and action to sync participant's graded_on field when graded
- bc5f36d1: Update Countries selector while adding a new venue to account for the international countries
- 77e40096: Added price for 3 Day SRT course level
- 3ec9baec: Use international countries when creating new organization
- 9bd63613: new data model for course modules
- 59cee72a: add help center button to the welcome page
- 724fc052: Add course residing country in the table on the transfer participant page.
- 4fcb67f0: Amendments on 'Book a course' page for International Courses
- 03b7b33d: Update trainers ratio for Level 1 and Level 2 INDIRECT type courses for trainers
- 67eed51f: Add mandatory modules in 3 Day SRT open course.
- 69781fe0: Added feature flag for 3 Day SRT Course Level
- 767b9bc5: add curriculum sync Hasura event
- 4425a9a3: Adds Course Residing Country to while creating / editing open courses

### Patch Changes

- aa891bd6: Fix accept organisation invite request
- 7b7eb576: Fixes the failing seed job by adding booking contact details to seed orders
- 4cfaf88a: Fix typecheck
- 296af45c: Fix undefined sentry error in Course Details component
- e0e9c7d8: Allow invite to otg after invite declined
- 7a990e25: Fixing multiple AJAX calls for Organisation invitation accept
- d797e06c: Fix add Google Maps venue error, add countryCode to venue
- 5aa67ab3: Fixing headers for unauthorized requests
- c176c276: Add info box under assist trainers
- c21ffc04: Remove case and space sensitive for full name signature on H&S submit form and course evaluation
- a9b68660: Names info box under signatures
- 9ff59a1c: fix labels for info box under signatures
- 41653f52: Allow OrgAdmin accounts to retrieve course participants count
- bc82b7c5: Add search by invoice code for the audits
- 2314a124: Fix helper text for postal address fields on booking details
- a6f39b72: Fix venue selector address components issue
- 109bccdf: Make country code editable on phone

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
