```mermaid
erDiagram

  "accreditors" {
    String name "🗝️"
    }
  

  "availability" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    DateTime start 
    DateTime end 
    String description "❓"
    }
  

  "availability_type" {
    String value "🗝️"
    }
  

  "bild_strategy" {
    String id "🗝️"
    String name 
    Json modules 
    String short_name 
    Int duration "❓"
    }
  

  "blended_learning_status" {
    String name "🗝️"
    }
  

  "certificate_expired_notification_jobs" {
    String id "🗝️"
    String job_id 
    }
  

  "certificate_expiry_notification_jobs" {
    String id "🗝️"
    String job_id 
    }
  

  "certificate_expiry_notification_timeframe" {
    String name "🗝️"
    }
  

  "certificate_status" {
    String name "🗝️"
    }
  

  "color" {
    String name "🗝️"
    }
  

  "course" {
    DateTime created_at 
    DateTime updated_at 
    String name 
    Boolean reaccreditation "❓"
    String description "❓"
    Int min_participants 
    Int max_participants 
    Boolean grading_confirmed 
    Boolean go1_integration 
    Decimal aol_cost_of_course "❓"
    Int id "🗝️"
    String aol_country "❓"
    String aol_region "❓"
    Int free_spaces "❓"
    String account_code "❓"
    String cancellation_reason "❓"
    Int cancellation_fee_percent "❓"
    Boolean grading_started 
    Int modules_duration 
    String special_instructions "❓"
    String parking_instructions "❓"
    Boolean conversion "❓"
    Decimal price "❓"
    String price_currency "❓"
    Json booking_contact_invite_data "❓"
    Boolean is_draft "❓"
    Boolean exceptions_pending 
    DateTime start "❓"
    DateTime end "❓"
    }
  

  "course_audit" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    Json payload 
    }
  

  "course_audit_type" {
    String name "🗝️"
    }
  

  "course_bild_module" {
    String id "🗝️"
    Json modules 
    }
  

  "course_bild_strategy" {
    String id "🗝️"
    }
  

  "course_cancellation_request" {
    String id "🗝️"
    String reason 
    DateTime created_at 
    DateTime updated_at 
    }
  

  "course_certificate" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    String number 
    DateTime expiry_date 
    String profile_id 
    String course_name 
    String course_level 
    DateTime certification_date 
    Boolean is_revoked 
    }
  

  "course_certificate_changelog" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    Json payload "❓"
    }
  

  "course_certificate_changelog_type" {
    String name "🗝️"
    }
  

  "course_certificate_hold_request" {
    String id "🗝️"
    String changelog_id 
    DateTime expiry_date 
    DateTime start_date 
    }
  

  "course_delivery_type" {
    String name "🗝️"
    }
  

  "course_delivery_type_prefix" {
    String id "🗝️"
    String prefix 
    }
  

  "course_draft" {
    String id "🗝️"
    String profile_id 
    String course_type 
    Json data "❓"
    DateTime created_at 
    DateTime updated_at 
    }
  

  "course_end_jobs" {
    String id "🗝️"
    String job_id 
    }
  

  "course_enquiry" {
    String id "🗝️"
    DateTime created_at "❓"
    String interest 
    String given_name 
    String family_name 
    String email 
    String phone 
    String org_name 
    String sector 
    String message "❓"
    String source "❓"
    }
  

  "course_evaluation_answers" {
    String id "🗝️"
    String answer "❓"
    }
  

  "course_evaluation_question_group" {
    String name "🗝️"
    }
  

  "course_evaluation_question_type" {
    String name "🗝️"
    }
  

  "course_evaluation_questions" {
    String id "🗝️"
    String question 
    Int display_order 
    String question_key "❓"
    Boolean required 
    }
  

  "course_expenses" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    Json data 
    }
  

  "course_invite_status" {
    String name "🗝️"
    }
  

  "course_invites" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    String email "❓"
    String note "❓"
    }
  

  "course_level" {
    String name "🗝️"
    }
  

  "course_level_prefix" {
    String id "🗝️"
    String name 
    String prefix 
    }
  

  "course_module" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    Boolean covered "❓"
    }
  

  "course_participant" {
    String id "🗝️"
    String registration_id "❓"
    String invoice_id "❓"
    DateTime booking_date "❓"
    Int go1_enrolment_id "❓"
    Boolean attended "❓"
    DateTime created_at "❓"
    DateTime updated_at "❓"
    String grading_feedback "❓"
    DateTime date_graded "❓"
    Boolean hs_consent 
    Boolean completed_evaluation "❓"
    }
  

  "course_participant_audit" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    Json payload 
    }
  

  "course_participant_audit_type" {
    String name "🗝️"
    }
  

  "course_participant_bild_module" {
    String id "🗝️"
    Json modules 
    }
  

  "course_participant_cancellation" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    String profile_id 
    Int course_id 
    String cancellation_reason 
    Int cancellation_fee_percent 
    }
  

  "course_participant_module" {
    String id "🗝️"
    Boolean completed 
    }
  

  "course_pricing" {
    String id "🗝️"
    Boolean blended 
    Boolean reaccreditation 
    Decimal price_amount 
    String price_currency 
    String xero_code 
    DateTime created_at "❓"
    DateTime updated_at "❓"
    }
  

  "course_pricing_changelog" {
    String id "🗝️"
    Decimal old_price 
    Decimal new_price 
    DateTime created_at 
    DateTime updated_at 
    }
  

  "course_promo_code" {
    String id "🗝️"
    }
  

  "course_schedule" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    DateTime start 
    DateTime end 
    String virtual_link "❓"
    String virtual_account_id "❓"
    }
  

  "course_source" {
    String name "🗝️"
    }
  

  "course_status" {
    String name "🗝️"
    }
  

  "course_trainer" {
    String id "🗝️"
    }
  

  "course_trainer_type" {
    String name "🗝️"
    }
  

  "course_type" {
    String name "🗝️"
    }
  

  "course_type_prefix" {
    String id "🗝️"
    String name 
    String prefix 
    }
  

  "dfe_establishment" {
    String id "🗝️"
    String urn 
    String name 
    String local_authority 
    String trust_type "❓"
    String trust_name "❓"
    String address_line_1 "❓"
    String address_line_2 "❓"
    String address_line_3 "❓"
    String town "❓"
    String county "❓"
    String postcode "❓"
    String head_title "❓"
    String head_first_name "❓"
    String head_last_name "❓"
    String head_job_title "❓"
    String ofsted_rating "❓"
    String ofsted_last_inspection "❓"
    }
  

  "expire_go1_license_jobs" {
    String id "🗝️"
    String job_id 
    }
  

  "go1_history_events" {
    String name "🗝️"
    }
  

  "go1_licenses" {
    String id "🗝️"
    DateTime expire_date 
    DateTime enrolled_on 
    }
  

  "go1_licenses_history" {
    String id "🗝️"
    DateTime captured_at 
    Int balance 
    Int change 
    Json payload "❓"
    Int reserved_balance 
    }
  

  "grade" {
    String name "🗝️"
    }
  

  "identity" {
    String id "🗝️"
    String provider_id 
    }
  

  "identity_type" {
    String value "🗝️"
    }
  

  "legacy_certificate" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    Json original_record 
    String number 
    String course_name 
    Int legacy_id 
    String email 
    String first_name 
    String last_name 
    DateTime expiry_date 
    DateTime certification_date 
    }
  

  "module" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    String name 
    String description "❓"
    }
  

  "module_category" {
    String name "🗝️"
    }
  

  "module_group" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    String name 
    Boolean mandatory 
    }
  

  "module_group_duration" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    Boolean reaccreditation 
    Int duration 
    Boolean go1_integration 
    }
  

  "order" {
    String id "🗝️"
    Int quantity 
    String billing_address 
    String billing_given_name 
    String billing_family_name 
    String billing_email 
    String billing_phone 
    Json registrants 
    DateTime created_at 
    Float price "❓"
    Float vat "❓"
    Float order_total "❓"
    String currency "❓"
    String stripePaymentId "❓"
    Json promo_codes "❓"
    Float order_due "❓"
    String xero_invoice_number "❓"
    String client_purchase_order "❓"
    Json user 
    String source "❓"
    Json booking_contact "❓"
    }
  

  "order_temp" {
    String id "🗝️"
    String profile_id "❓"
    Int quantity 
    String billing_address 
    String billing_given_name 
    String billing_family_name 
    String billing_email 
    String billing_phone 
    Json registrants 
    DateTime created_at 
    Float price "❓"
    Float vat "❓"
    Float order_total "❓"
    String organization_id 
    String currency "❓"
    String stripePaymentId "❓"
    Json promo_codes "❓"
    Float order_due "❓"
    String xero_invoice_number "❓"
    String client_purchase_order "❓"
    Json user 
    String source "❓"
    String sales_representative_id "❓"
    Json booking_contact "❓"
    }
  

  "organization" {
    String id "🗝️"
    String name 
    Json tags "❓"
    Json contact_details 
    Json attributes 
    Json address 
    Json preferences 
    Json original_record "❓"
    DateTime created_at 
    DateTime updated_at 
    String xero_contact_id "❓"
    String sector "❓"
    String region "❓"
    String trust_name "❓"
    Int go1_license "❓"
    Int reserved_go1_licenses "❓"
    }
  

  "organization_invites" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    String email 
    String status 
    Boolean is_admin 
    }
  

  "organization_member" {
    String id "🗝️"
    String member_type "❓"
    String z_source "❓"
    DateTime created_at 
    DateTime updated_at 
    Boolean is_admin "❓"
    String position "❓"
    }
  

  "payment_methods" {
    String name "🗝️"
    }
  

  "private_course_booking" {
    String id "🗝️"
    DateTime created_at "❓"
    String given_name 
    String family_name 
    String email 
    String phone 
    String org_name 
    String sector 
    String message "❓"
    String source "❓"
    Int num_participants 
    }
  

  "profile" {
    String id "🗝️"
    String title "❓"
    Json tags "❓"
    Json contact_details 
    Json attributes 
    Json addresses 
    Json preferences 
    Json original_record 
    DateTime created_at 
    DateTime updated_at 
    Int go1_id "❓"
    String stripe_customer_id "❓"
    Json go1_profile "❓"
    String job_title "❓"
    DateTime dob "❓"
    String dietary_restrictions "❓"
    String disabilities "❓"
    DateTime last_activity 
    String avatar "❓"
    String z_given_name "❓"
    String z_family_name "❓"
    String z_email "❓"
    String z_phone "❓"
    Boolean archived "❓"
    }
  

  "profile_role" {
    String id "🗝️"
    String z_source "❓"
    DateTime created_at 
    DateTime updated_at 
    }
  

  "profile_temp" {
    Int id "🗝️"
    String email 
    String given_name 
    String family_name 
    String phone "❓"
    DateTime dob "❓"
    Boolean accept_tcs 
    String sector "❓"
    String job_title "❓"
    DateTime created_at 
    String organization_id "❓"
    Int quantity "❓"
    }
  

  "profile_trainer_role_type" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    }
  

  "promo_code" {
    String id "🗝️"
    String code 
    String description "❓"
    Decimal amount 
    DateTime valid_from 
    DateTime valid_to "❓"
    Boolean booker_single_use 
    Decimal uses_max "❓"
    Json levels 
    Boolean enabled 
    DateTime created_at 
    DateTime updated_at 
    Boolean disabled 
    }
  

  "promo_code_type" {
    String name "🗝️"
    }
  

  "role" {
    String id "🗝️"
    String name 
    Json data 
    Int rank "❓"
    }
  

  "trainer_role_type" {
    String id "🗝️"
    String name 
    }
  

  "trust_type" {
    String name "🗝️"
    }
  

  "venue" {
    String id "🗝️"
    DateTime created_at 
    DateTime updated_at 
    String name 
    String city 
    String address_line_one 
    String address_line_two "❓"
    String post_code 
    String google_places_id "❓"
    }
  

  "venue_check_jobs" {
    String id "🗝️"
    String job_id 
    }
  

  "waitlist" {
    String id "🗝️"
    DateTime created_at 
    String given_name 
    String family_name 
    String email 
    String phone 
    String org_name 
    Boolean confirmed 
    String cancellation_secret 
    }
  

  "xero_contact" {
    String id "🗝️"
    String xero_id 
    String name "❓"
    String first_name 
    String last_name 
    String email_address "❓"
    Json addresses "❓"
    Json phones "❓"
    }
  

  "xero_credential" {
    String client_id "🗝️"
    String token 
    }
  

  "xero_invoice" {
    String id "🗝️"
    String xero_id 
    Json line_items 
    Decimal total 
    Decimal total_tax 
    Decimal subtotal 
    Decimal amount_due "❓"
    Decimal amount_paid "❓"
    DateTime fully_paid_on_date "❓"
    DateTime due_date 
    DateTime issued_date 
    String reference 
    String currency_code 
    String z_status 
    }
  

  "xero_invoice_status" {
    String name "🗝️"
    }
  
    "accreditors" o{--}o "course" : "course"
    "availability" o|--|| "profile" : "profile"
    "availability" o|--|| "availability_type" : "availability_type"
    "availability_type" o{--}o "availability" : "availability"
    "bild_strategy" o{--}o "course_bild_strategy" : "course_bild_strategy"
    "blended_learning_status" o{--}o "course_participant" : "course_participant"
    "certificate_expired_notification_jobs" o|--|| "course_certificate" : "course_certificate"
    "certificate_expiry_notification_jobs" o|--|| "course_certificate" : "course_certificate"
    "certificate_expiry_notification_jobs" o|--|| "certificate_expiry_notification_timeframe" : "certificate_expiry_notification_timeframe"
    "certificate_expiry_notification_timeframe" o{--}o "certificate_expiry_notification_jobs" : "certificate_expiry_notification_jobs"
    "color" o{--}o "module_group" : "module_group_module_group_colorTocolor"
    "course" o|--|| "accreditors" : "accreditors"
    "course" o|--|o "profile" : "profile_course_booking_contact_profile_idToprofile"
    "course" o|--|| "course_delivery_type" : "course_delivery_type_course_course_delivery_typeTocourse_delivery_type"
    "course" o|--|| "course_level" : "course_level_course_course_levelTocourse_level"
    "course" o|--|o "course_status" : "course_status_course_course_statusTocourse_status"
    "course" o|--|| "course_type" : "course_type_course_course_typeTocourse_type"
    "course" o|--|o "profile" : "profile_course_created_by_idToprofile"
    "course" o|--|o "organization" : "organization"
    "course" o|--|o "course_source" : "course_source"
    "course" o{--}o "course_audit" : "course_audit"
    "course" o{--}o "course_bild_module" : "course_bild_module"
    "course" o{--}o "course_bild_strategy" : "course_bild_strategy"
    "course" o{--}o "course_cancellation_request" : "course_cancellation_request"
    "course" o{--}o "course_certificate" : "course_certificate"
    "course" o{--}o "course_end_jobs" : "course_end_jobs"
    "course" o{--}o "course_enquiry" : "course_enquiry"
    "course" o{--}o "course_evaluation_answers" : "course_evaluation_answers"
    "course" o{--}o "course_expenses" : "course_expenses"
    "course" o{--}o "course_invites" : "course_invites"
    "course" o{--}o "course_module" : "course_module"
    "course" o{--}o "course_participant" : "course_participant"
    "course" o{--}o "course_participant_audit" : "course_participant_audit"
    "course" o{--}o "course_promo_code" : "course_promo_code"
    "course" o{--}o "course_schedule" : "course_schedule"
    "course" o{--}o "course_trainer" : "course_trainer"
    "course" o{--}o "order" : "order"
    "course" o{--}o "order_temp" : "order_temp"
    "course" o{--}o "private_course_booking" : "private_course_booking"
    "course" o{--}o "profile_temp" : "profile_temp"
    "course" o{--}o "venue_check_jobs" : "venue_check_jobs"
    "course" o{--}o "waitlist" : "waitlist"
    "course_audit" o|--|| "profile" : "profile"
    "course_audit" o|--|| "course" : "course"
    "course_audit" o|--|| "course_audit_type" : "course_audit_type"
    "course_audit_type" o{--}o "course_audit" : "course_audit"
    "course_bild_module" o|--|| "course" : "course"
    "course_bild_strategy" o|--|| "course" : "course"
    "course_bild_strategy" o|--|| "bild_strategy" : "bild_strategy"
    "course_cancellation_request" o|--|| "course" : "course"
    "course_cancellation_request" o|--|| "profile" : "profile"
    "course_certificate" o{--}o "certificate_expired_notification_jobs" : "certificate_expired_notification_jobs"
    "course_certificate" o{--}o "certificate_expiry_notification_jobs" : "certificate_expiry_notification_jobs"
    "course_certificate" o|--|o "course" : "course"
    "course_certificate" o{--}o "course_certificate_hold_request" : "course_certificate_hold_request"
    "course_certificate" o{--}o "course_participant" : "course_participant"
    "course_certificate" o{--}o "legacy_certificate" : "legacy_certificate"
    "course_certificate_changelog" o|--|| "profile" : "profile"
    "course_certificate_changelog" o|--|| "course_participant" : "course_participant"
    "course_certificate_changelog" o|--|| "course_certificate_changelog_type" : "course_certificate_changelog_type"
    "course_certificate_changelog_type" o{--}o "course_certificate_changelog" : "course_certificate_changelog"
    "course_certificate_hold_request" o|--|| "course_certificate" : "course_certificate"
    "course_delivery_type" o{--}o "course" : "course_course_course_delivery_typeTocourse_delivery_type"
    "course_delivery_type" o{--}o "course_delivery_type_prefix" : "course_delivery_type_prefix"
    "course_delivery_type" o{--}o "module_group_duration" : "module_group_duration_module_group_duration_course_delivery_typeTocourse_delivery_type"
    "course_delivery_type_prefix" o|--|| "course_delivery_type" : "course_delivery_type"
    "course_end_jobs" o|--|| "course" : "course"
    "course_enquiry" o|--|| "course" : "course"
    "course_evaluation_answers" o|--|| "course" : "course"
    "course_evaluation_answers" o|--|| "profile" : "profile"
    "course_evaluation_answers" o|--|| "course_evaluation_questions" : "course_evaluation_questions"
    "course_evaluation_question_group" o{--}o "course_evaluation_questions" : "course_evaluation_questions"
    "course_evaluation_question_type" o{--}o "course_evaluation_questions" : "course_evaluation_questions"
    "course_evaluation_questions" o{--}o "course_evaluation_answers" : "course_evaluation_answers"
    "course_evaluation_questions" o|--|o "course_evaluation_question_group" : "course_evaluation_question_group"
    "course_evaluation_questions" o|--|o "course_evaluation_question_type" : "course_evaluation_question_type"
    "course_expenses" o|--|| "course" : "course"
    "course_expenses" o|--|| "profile" : "profile"
    "course_invite_status" o{--}o "course_invites" : "course_invites"
    "course_invite_status" o{--}o "course_trainer" : "course_trainer"
    "course_invites" o|--|| "course" : "course"
    "course_invites" o|--|o "course_invite_status" : "course_invite_status"
    "course_invites" o{--}o "course_participant" : "course_participant"
    "course_level" o{--}o "course" : "course_course_course_levelTocourse_level"
    "course_level" o{--}o "course_pricing" : "course_pricing"
    "course_level" o{--}o "module" : "module_module_course_levelTocourse_level"
    "course_level" o{--}o "module_group" : "module_group_module_group_course_levelTocourse_level"
    "course_module" o|--|| "course" : "course"
    "course_module" o|--|| "module" : "module"
    "course_participant" o{--}o "course_certificate_changelog" : "course_certificate_changelog"
    "course_participant" o|--|o "course_certificate" : "course_certificate"
    "course_participant" o|--|| "course" : "course"
    "course_participant" o|--|o "blended_learning_status" : "blended_learning_status"
    "course_participant" o|--|o "grade" : "grade_course_participant_gradeTograde"
    "course_participant" o|--|o "course_invites" : "course_invites"
    "course_participant" o|--|o "order" : "order"
    "course_participant" o|--|| "profile" : "profile"
    "course_participant" o{--}o "course_participant_bild_module" : "course_participant_bild_module"
    "course_participant" o{--}o "course_participant_module" : "course_participant_module"
    "course_participant_audit" o|--|| "profile" : "profile_course_participant_audit_authorized_byToprofile"
    "course_participant_audit" o|--|| "course" : "course"
    "course_participant_audit" o|--|| "profile" : "profile_course_participant_audit_profile_idToprofile"
    "course_participant_audit" o|--|| "course_participant_audit_type" : "course_participant_audit_type"
    "course_participant_audit_type" o{--}o "course_participant_audit" : "course_participant_audit"
    "course_participant_bild_module" o|--|| "course_participant" : "course_participant"
    "course_participant_module" o|--|| "course_participant" : "course_participant"
    "course_participant_module" o|--|| "module" : "module"
    "course_pricing" o|--|| "course_level" : "course_level"
    "course_pricing" o|--|| "course_type" : "course_type"
    "course_pricing" o{--}o "course_pricing_changelog" : "course_pricing_changelog"
    "course_pricing_changelog" o|--|o "profile" : "profile"
    "course_pricing_changelog" o|--|| "course_pricing" : "course_pricing"
    "course_promo_code" o|--|o "course" : "course"
    "course_promo_code" o|--|o "promo_code" : "promo_code"
    "course_schedule" o|--|| "course" : "course"
    "course_schedule" o|--|o "venue" : "venue"
    "course_source" o{--}o "course" : "course"
    "course_status" o{--}o "course" : "course_course_course_statusTocourse_status"
    "course_trainer" o|--|| "profile" : "profile"
    "course_trainer" o|--|| "course_trainer_type" : "course_trainer_type"
    "course_trainer" o|--|| "course" : "course"
    "course_trainer" o|--|o "course_invite_status" : "course_invite_status"
    "course_trainer_type" o{--}o "course_trainer" : "course_trainer"
    "course_type" o{--}o "course" : "course_course_course_typeTocourse_type"
    "course_type" o{--}o "course_pricing" : "course_pricing"
    "expire_go1_license_jobs" o|--|| "go1_licenses" : "go1_licenses"
    "go1_history_events" o{--}o "go1_licenses_history" : "go1_licenses_history"
    "go1_licenses" o{--}o "expire_go1_license_jobs" : "expire_go1_license_jobs"
    "go1_licenses" o|--|| "organization" : "organization"
    "go1_licenses" o|--|| "profile" : "profile"
    "go1_licenses_history" o|--|| "go1_history_events" : "go1_history_events"
    "go1_licenses_history" o|--|| "organization" : "organization"
    "grade" o{--}o "course_participant" : "course_participant_course_participant_gradeTograde"
    "identity" o|--|| "profile" : "profile"
    "identity" o|--|| "identity_type" : "identity_type"
    "identity_type" o{--}o "identity" : "identity"
    "legacy_certificate" o|--|o "course_certificate" : "course_certificate"
    "module" o{--}o "course_module" : "course_module"
    "module" o{--}o "course_participant_module" : "course_participant_module"
    "module" o|--|| "course_level" : "course_level_module_course_levelTocourse_level"
    "module" o|--|| "module_category" : "module_category_module_module_categoryTomodule_category"
    "module" o|--|o "module_group" : "module_group"
    "module_category" o{--}o "module" : "module_module_module_categoryTomodule_category"
    "module_group" o{--}o "module" : "module"
    "module_group" o|--|| "color" : "color_module_group_colorTocolor"
    "module_group" o|--|| "course_level" : "course_level_module_group_course_levelTocourse_level"
    "module_group" o{--}o "module_group_duration" : "module_group_duration"
    "module_group_duration" o|--|| "course_delivery_type" : "course_delivery_type_module_group_duration_course_delivery_typeTocourse_delivery_type"
    "module_group_duration" o|--|| "module_group" : "module_group"
    "order" o{--}o "course_participant" : "course_participant"
    "order" o|--|| "course" : "course"
    "order" o|--|| "organization" : "organization"
    "order" o|--|| "payment_methods" : "payment_methods"
    "order" o|--|o "profile" : "profile_order_profile_idToprofile"
    "order" o|--|o "profile" : "profile_order_sales_representative_idToprofile"
    "order" o{--}o "xero_invoice" : "xero_invoice"
    "order_temp" o|--|| "course" : "course"
    "order_temp" o|--|| "payment_methods" : "payment_methods"
    "organization" o{--}o "course" : "course"
    "organization" o{--}o "go1_licenses" : "go1_licenses"
    "organization" o{--}o "go1_licenses_history" : "go1_licenses_history"
    "organization" o{--}o "order" : "order"
    "organization" o|--|o "trust_type" : "trust_type_organization_trust_typeTotrust_type"
    "organization" o{--}o "organization_invites" : "organization_invites"
    "organization" o{--}o "organization_member" : "organization_member"
    "organization_invites" o|--|| "organization" : "organization"
    "organization_invites" o|--|o "profile" : "profile"
    "organization_member" o|--|| "organization" : "organization"
    "organization_member" o|--|| "profile" : "profile"
    "payment_methods" o{--}o "order" : "order"
    "payment_methods" o{--}o "order_temp" : "order_temp"
    "private_course_booking" o|--|| "course" : "course"
    "profile" o{--}o "availability" : "availability"
    "profile" o{--}o "course" : "course_course_booking_contact_profile_idToprofile"
    "profile" o{--}o "course" : "course_course_created_by_idToprofile"
    "profile" o{--}o "course_audit" : "course_audit"
    "profile" o{--}o "course_cancellation_request" : "course_cancellation_request"
    "profile" o{--}o "course_certificate_changelog" : "course_certificate_changelog"
    "profile" o{--}o "course_evaluation_answers" : "course_evaluation_answers"
    "profile" o{--}o "course_expenses" : "course_expenses"
    "profile" o{--}o "course_participant" : "course_participant"
    "profile" o{--}o "course_participant_audit" : "course_participant_audit_course_participant_audit_authorized_byToprofile"
    "profile" o{--}o "course_participant_audit" : "course_participant_audit_course_participant_audit_profile_idToprofile"
    "profile" o{--}o "course_pricing_changelog" : "course_pricing_changelog"
    "profile" o{--}o "course_trainer" : "course_trainer"
    "profile" o{--}o "go1_licenses" : "go1_licenses"
    "profile" o{--}o "identity" : "identity"
    "profile" o{--}o "order" : "order_order_profile_idToprofile"
    "profile" o{--}o "order" : "order_order_sales_representative_idToprofile"
    "profile" o{--}o "organization_invites" : "organization_invites"
    "profile" o{--}o "organization_member" : "organization_member"
    "profile" o{--}o "profile_role" : "profile_role"
    "profile" o{--}o "profile_trainer_role_type" : "profile_trainer_role_type"
    "profile" o{--}o "promo_code" : "promo_code_promo_code_approved_byToprofile"
    "profile" o{--}o "promo_code" : "promo_code_promo_code_created_byToprofile"
    "profile" o{--}o "promo_code" : "promo_code_promo_code_denied_byToprofile"
    "profile_role" o|--|| "profile" : "profile"
    "profile_role" o|--|| "role" : "role"
    "profile_temp" o|--|o "course" : "course"
    "profile_trainer_role_type" o|--|| "profile" : "profile"
    "profile_trainer_role_type" o|--|| "trainer_role_type" : "trainer_role_type"
    "promo_code" o{--}o "course_promo_code" : "course_promo_code"
    "promo_code" o|--|o "profile" : "profile_promo_code_approved_byToprofile"
    "promo_code" o|--|| "profile" : "profile_promo_code_created_byToprofile"
    "promo_code" o|--|o "profile" : "profile_promo_code_denied_byToprofile"
    "promo_code" o|--|| "promo_code_type" : "promo_code_type"
    "promo_code_type" o{--}o "promo_code" : "promo_code"
    "role" o{--}o "profile_role" : "profile_role"
    "trainer_role_type" o{--}o "profile_trainer_role_type" : "profile_trainer_role_type"
    "trust_type" o{--}o "organization" : "organization_organization_trust_typeTotrust_type"
    "venue" o{--}o "course_schedule" : "course_schedule"
    "venue_check_jobs" o|--|| "course" : "course"
    "waitlist" o|--|| "course" : "course"
    "xero_contact" o{--}o "xero_invoice" : "xero_invoice"
    "xero_invoice" o|--|| "order" : "order"
    "xero_invoice" o|--|| "xero_invoice_status" : "xero_invoice_status"
    "xero_invoice" o|--|| "xero_contact" : "xero_contact"
    "xero_invoice_status" o{--}o "xero_invoice" : "xero_invoice"
```
