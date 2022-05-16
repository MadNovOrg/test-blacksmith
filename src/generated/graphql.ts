export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  date: any;
  float8: any;
  json: any;
  jsonb: any;
  numeric: any;
  point: any;
  timestamptz: any;
  uuid: any;
};

export type Address = {
  __typename?: 'Address';
  addressLineOne?: Maybe<Scalars['String']>;
  addressLineTwo?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postCode?: Maybe<Scalars['String']>;
};

export enum BillingInterval {
  Day = 'day',
  Month = 'month',
  Week = 'week',
  Year = 'year'
}

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type CourseInvite = {
  __typename?: 'CourseInvite';
  courseId: Scalars['String'];
  courseName: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  endDate: Scalars['String'];
  id: Scalars['String'];
  startDate: Scalars['String'];
  status: InviteStatus;
  trainerName: Scalars['String'];
  venueAddress?: Maybe<Address>;
  venueCoordinates?: Maybe<Scalars['String']>;
  venueName: Scalars['String'];
};

export enum CourseLevel {
  Advanced = 'ADVANCED',
  AdvancedTrainer = 'ADVANCED_TRAINER',
  BildAct = 'BILD_ACT',
  BildActTrainer = 'BILD_ACT_TRAINER',
  IntermediateTrainer = 'INTERMEDIATE_TRAINER',
  Level_1 = 'LEVEL_1',
  Level_2 = 'LEVEL_2'
}

export enum CourseTrainerType {
  Assistant = 'ASSISTANT',
  Leader = 'LEADER',
  Moderator = 'MODERATOR'
}

export enum Currency {
  Gbp = 'GBP'
}

export type DeclineInviteOutput = {
  __typename?: 'DeclineInviteOutput';
  status: Scalars['Boolean'];
};

export type GetTrainersLevelsInput = {
  courseEnd: Scalars['date'];
  courseLevel: CourseLevel;
  courseStart: Scalars['date'];
  ids: Array<Scalars['uuid']>;
  trainerType: CourseTrainerType;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

export enum InviteStatus {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

export type PlanObject = {
  __typename?: 'PlanObject';
  active?: Maybe<Scalars['Boolean']>;
  billingInterval?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  productName?: Maybe<Scalars['String']>;
  unitAmount?: Maybe<Scalars['Int']>;
};

export type PlansCreateInput = {
  amount: Scalars['Int'];
  currency: Scalars['String'];
  name: Scalars['String'];
  recurring_count: Scalars['Int'];
  recurring_type: BillingInterval;
  trial_count: Scalars['Int'];
  trial_type: BillingInterval;
};

export type PlansCreateResult = {
  __typename?: 'PlansCreateResult';
  id: Scalars['String'];
};

export type SearchTrainer = {
  __typename?: 'SearchTrainer';
  availability?: Maybe<SearchTrainerAvailability>;
  avatar?: Maybe<Scalars['String']>;
  fullName: Scalars['String'];
  id: Scalars['uuid'];
  levels: Array<CourseLevel>;
};

export enum SearchTrainerAvailability {
  Available = 'AVAILABLE',
  Expired = 'EXPIRED',
  Pending = 'PENDING',
  Unavailable = 'UNAVAILABLE'
}

export type SearchTrainersInput = {
  courseEnd?: InputMaybe<Scalars['date']>;
  courseLevel?: InputMaybe<CourseLevel>;
  courseStart?: InputMaybe<Scalars['date']>;
  query?: InputMaybe<Scalars['String']>;
  trainerType?: InputMaybe<CourseTrainerType>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

export type StripeCreatePaymentIntentInput = {
  orderId: Scalars['String'];
};

export type StripeCreatePaymentIntentOutput = {
  __typename?: 'StripeCreatePaymentIntentOutput';
  amount: Scalars['Float'];
  clientSecret: Scalars['String'];
  currency: Currency;
};

export type TrainerLevels = {
  __typename?: 'TrainerLevels';
  availability: SearchTrainerAvailability;
  levels: Array<CourseLevel>;
  profile_id: Scalars['uuid'];
};

export type UpsertZoomMeetingInput = {
  id?: InputMaybe<Scalars['Float']>;
  /** ISO 8601 date string, e.g. '2022-04-18T16:48:04.836Z' */
  startTime?: InputMaybe<Scalars['String']>;
  /** Timezone string, e.g. Europe/London */
  timezone?: InputMaybe<Scalars['String']>;
};

export type UpsertZoomMeetingPayload = {
  __typename?: 'UpsertZoomMeetingPayload';
  meeting?: Maybe<ZoomMeeting>;
  success: Scalars['Boolean'];
  userError?: Maybe<ZoomMeetingNotFoundError>;
};

export type ZoomMeeting = {
  __typename?: 'ZoomMeeting';
  id: Scalars['Int'];
  joinUrl: Scalars['String'];
};

export type ZoomMeetingNotFoundError = {
  __typename?: 'ZoomMeetingNotFoundError';
  id: Scalars['String'];
};

/** status enum for go1 course/module */
export type Blended_Learning_Status = {
  __typename?: 'blended_learning_status';
  name: Scalars['String'];
};

/** aggregated selection of "blended_learning_status" */
export type Blended_Learning_Status_Aggregate = {
  __typename?: 'blended_learning_status_aggregate';
  aggregate?: Maybe<Blended_Learning_Status_Aggregate_Fields>;
  nodes: Array<Blended_Learning_Status>;
};

/** aggregate fields of "blended_learning_status" */
export type Blended_Learning_Status_Aggregate_Fields = {
  __typename?: 'blended_learning_status_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Blended_Learning_Status_Max_Fields>;
  min?: Maybe<Blended_Learning_Status_Min_Fields>;
};


/** aggregate fields of "blended_learning_status" */
export type Blended_Learning_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Blended_Learning_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "blended_learning_status". All fields are combined with a logical 'AND'. */
export type Blended_Learning_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Blended_Learning_Status_Bool_Exp>>;
  _not?: InputMaybe<Blended_Learning_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Blended_Learning_Status_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "blended_learning_status" */
export enum Blended_Learning_Status_Constraint {
  /** unique or primary key constraint */
  BlendedLearningStatusPkey = 'blended_learning_status_pkey'
}

export enum Blended_Learning_Status_Enum {
  Assigned = 'ASSIGNED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  NotStarted = 'NOT_STARTED'
}

/** Boolean expression to compare columns of type "blended_learning_status_enum". All fields are combined with logical 'AND'. */
export type Blended_Learning_Status_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Blended_Learning_Status_Enum>;
  _in?: InputMaybe<Array<Blended_Learning_Status_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Blended_Learning_Status_Enum>;
  _nin?: InputMaybe<Array<Blended_Learning_Status_Enum>>;
};

/** input type for inserting data into table "blended_learning_status" */
export type Blended_Learning_Status_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Blended_Learning_Status_Max_Fields = {
  __typename?: 'blended_learning_status_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Blended_Learning_Status_Min_Fields = {
  __typename?: 'blended_learning_status_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "blended_learning_status" */
export type Blended_Learning_Status_Mutation_Response = {
  __typename?: 'blended_learning_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Blended_Learning_Status>;
};

/** on_conflict condition type for table "blended_learning_status" */
export type Blended_Learning_Status_On_Conflict = {
  constraint: Blended_Learning_Status_Constraint;
  update_columns?: Array<Blended_Learning_Status_Update_Column>;
  where?: InputMaybe<Blended_Learning_Status_Bool_Exp>;
};

/** Ordering options when selecting data from "blended_learning_status". */
export type Blended_Learning_Status_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: blended_learning_status */
export type Blended_Learning_Status_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "blended_learning_status" */
export enum Blended_Learning_Status_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "blended_learning_status" */
export type Blended_Learning_Status_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "blended_learning_status" */
export enum Blended_Learning_Status_Update_Column {
  /** column name */
  Name = 'name'
}

/** columns and relationships of "color" */
export type Color = {
  __typename?: 'color';
  name: Scalars['String'];
};

/** aggregated selection of "color" */
export type Color_Aggregate = {
  __typename?: 'color_aggregate';
  aggregate?: Maybe<Color_Aggregate_Fields>;
  nodes: Array<Color>;
};

/** aggregate fields of "color" */
export type Color_Aggregate_Fields = {
  __typename?: 'color_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Color_Max_Fields>;
  min?: Maybe<Color_Min_Fields>;
};


/** aggregate fields of "color" */
export type Color_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Color_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "color". All fields are combined with a logical 'AND'. */
export type Color_Bool_Exp = {
  _and?: InputMaybe<Array<Color_Bool_Exp>>;
  _not?: InputMaybe<Color_Bool_Exp>;
  _or?: InputMaybe<Array<Color_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "color" */
export enum Color_Constraint {
  /** unique or primary key constraint */
  ColorPkey = 'color_pkey'
}

export enum Color_Enum {
  Fuschia = 'fuschia',
  Grey = 'grey',
  Lime = 'lime',
  Navy = 'navy',
  Purple = 'purple',
  Teal = 'teal',
  Yellow = 'yellow'
}

/** Boolean expression to compare columns of type "color_enum". All fields are combined with logical 'AND'. */
export type Color_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Color_Enum>;
  _in?: InputMaybe<Array<Color_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Color_Enum>;
  _nin?: InputMaybe<Array<Color_Enum>>;
};

/** input type for inserting data into table "color" */
export type Color_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Color_Max_Fields = {
  __typename?: 'color_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Color_Min_Fields = {
  __typename?: 'color_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "color" */
export type Color_Mutation_Response = {
  __typename?: 'color_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Color>;
};

/** on_conflict condition type for table "color" */
export type Color_On_Conflict = {
  constraint: Color_Constraint;
  update_columns?: Array<Color_Update_Column>;
  where?: InputMaybe<Color_Bool_Exp>;
};

/** Ordering options when selecting data from "color". */
export type Color_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: color */
export type Color_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "color" */
export enum Color_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "color" */
export type Color_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "color" */
export enum Color_Update_Column {
  /** column name */
  Name = 'name'
}

/** columns and relationships of "course" */
export type Course = {
  __typename?: 'course';
  aolCostOfCourse?: Maybe<Scalars['numeric']>;
  /** An object relationship */
  contactProfile?: Maybe<Profile>;
  contactProfileId?: Maybe<Scalars['uuid']>;
  createdAt: Scalars['timestamptz'];
  deliveryType: Course_Delivery_Type_Enum;
  description?: Maybe<Scalars['String']>;
  go1Integration: Scalars['Boolean'];
  gradingConfirmed: Scalars['Boolean'];
  id: Scalars['Int'];
  level?: Maybe<Course_Level_Enum>;
  max_participants: Scalars['Int'];
  min_participants: Scalars['Int'];
  /** An array relationship */
  modules: Array<Course_Module>;
  /** An aggregate relationship */
  modules_aggregate: Course_Module_Aggregate;
  name: Scalars['String'];
  /** An object relationship */
  organization?: Maybe<Organization>;
  organization_id?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  participants: Array<Course_Participant>;
  /** An aggregate relationship */
  participants_aggregate: Course_Participant_Aggregate;
  reaccreditation?: Maybe<Scalars['Boolean']>;
  /** An array relationship */
  schedule: Array<Course_Schedule>;
  /** An aggregate relationship */
  schedule_aggregate: Course_Schedule_Aggregate;
  status?: Maybe<Course_Status_Enum>;
  /** An array relationship */
  trainers: Array<Course_Trainer>;
  /** An aggregate relationship */
  trainers_aggregate: Course_Trainer_Aggregate;
  type: Course_Type_Enum;
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "course" */
export type CourseModulesArgs = {
  distinct_on?: InputMaybe<Array<Course_Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Module_Order_By>>;
  where?: InputMaybe<Course_Module_Bool_Exp>;
};


/** columns and relationships of "course" */
export type CourseModules_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Module_Order_By>>;
  where?: InputMaybe<Course_Module_Bool_Exp>;
};


/** columns and relationships of "course" */
export type CourseParticipantsArgs = {
  distinct_on?: InputMaybe<Array<Course_Participant_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Participant_Order_By>>;
  where?: InputMaybe<Course_Participant_Bool_Exp>;
};


/** columns and relationships of "course" */
export type CourseParticipants_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Participant_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Participant_Order_By>>;
  where?: InputMaybe<Course_Participant_Bool_Exp>;
};


/** columns and relationships of "course" */
export type CourseScheduleArgs = {
  distinct_on?: InputMaybe<Array<Course_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Schedule_Order_By>>;
  where?: InputMaybe<Course_Schedule_Bool_Exp>;
};


/** columns and relationships of "course" */
export type CourseSchedule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Schedule_Order_By>>;
  where?: InputMaybe<Course_Schedule_Bool_Exp>;
};


/** columns and relationships of "course" */
export type CourseTrainersArgs = {
  distinct_on?: InputMaybe<Array<Course_Trainer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Trainer_Order_By>>;
  where?: InputMaybe<Course_Trainer_Bool_Exp>;
};


/** columns and relationships of "course" */
export type CourseTrainers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Trainer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Trainer_Order_By>>;
  where?: InputMaybe<Course_Trainer_Bool_Exp>;
};

/** aggregated selection of "course" */
export type Course_Aggregate = {
  __typename?: 'course_aggregate';
  aggregate?: Maybe<Course_Aggregate_Fields>;
  nodes: Array<Course>;
};

/** aggregate fields of "course" */
export type Course_Aggregate_Fields = {
  __typename?: 'course_aggregate_fields';
  avg?: Maybe<Course_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Course_Max_Fields>;
  min?: Maybe<Course_Min_Fields>;
  stddev?: Maybe<Course_Stddev_Fields>;
  stddev_pop?: Maybe<Course_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Course_Stddev_Samp_Fields>;
  sum?: Maybe<Course_Sum_Fields>;
  var_pop?: Maybe<Course_Var_Pop_Fields>;
  var_samp?: Maybe<Course_Var_Samp_Fields>;
  variance?: Maybe<Course_Variance_Fields>;
};


/** aggregate fields of "course" */
export type Course_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Course_Avg_Fields = {
  __typename?: 'course_avg_fields';
  aolCostOfCourse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  max_participants?: Maybe<Scalars['Float']>;
  min_participants?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "course". All fields are combined with a logical 'AND'. */
export type Course_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Bool_Exp>>;
  _not?: InputMaybe<Course_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Bool_Exp>>;
  aolCostOfCourse?: InputMaybe<Numeric_Comparison_Exp>;
  contactProfile?: InputMaybe<Profile_Bool_Exp>;
  contactProfileId?: InputMaybe<Uuid_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  deliveryType?: InputMaybe<Course_Delivery_Type_Enum_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  go1Integration?: InputMaybe<Boolean_Comparison_Exp>;
  gradingConfirmed?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  level?: InputMaybe<Course_Level_Enum_Comparison_Exp>;
  max_participants?: InputMaybe<Int_Comparison_Exp>;
  min_participants?: InputMaybe<Int_Comparison_Exp>;
  modules?: InputMaybe<Course_Module_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organization_id?: InputMaybe<Uuid_Comparison_Exp>;
  participants?: InputMaybe<Course_Participant_Bool_Exp>;
  reaccreditation?: InputMaybe<Boolean_Comparison_Exp>;
  schedule?: InputMaybe<Course_Schedule_Bool_Exp>;
  status?: InputMaybe<Course_Status_Enum_Comparison_Exp>;
  trainers?: InputMaybe<Course_Trainer_Bool_Exp>;
  type?: InputMaybe<Course_Type_Enum_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** columns and relationships of "course_certificate" */
export type Course_Certificate = {
  __typename?: 'course_certificate';
  certificationDate: Scalars['date'];
  /** An object relationship */
  course?: Maybe<Course>;
  courseId?: Maybe<Scalars['Int']>;
  courseLevel: Scalars['String'];
  courseName: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  expiryDate: Scalars['date'];
  id: Scalars['uuid'];
  number: Scalars['String'];
  /** An object relationship */
  participant?: Maybe<Course_Participant>;
  /** An object relationship */
  profile?: Maybe<Profile>;
  profileId: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "course_certificate" */
export type Course_Certificate_Aggregate = {
  __typename?: 'course_certificate_aggregate';
  aggregate?: Maybe<Course_Certificate_Aggregate_Fields>;
  nodes: Array<Course_Certificate>;
};

/** aggregate fields of "course_certificate" */
export type Course_Certificate_Aggregate_Fields = {
  __typename?: 'course_certificate_aggregate_fields';
  avg?: Maybe<Course_Certificate_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Course_Certificate_Max_Fields>;
  min?: Maybe<Course_Certificate_Min_Fields>;
  stddev?: Maybe<Course_Certificate_Stddev_Fields>;
  stddev_pop?: Maybe<Course_Certificate_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Course_Certificate_Stddev_Samp_Fields>;
  sum?: Maybe<Course_Certificate_Sum_Fields>;
  var_pop?: Maybe<Course_Certificate_Var_Pop_Fields>;
  var_samp?: Maybe<Course_Certificate_Var_Samp_Fields>;
  variance?: Maybe<Course_Certificate_Variance_Fields>;
};


/** aggregate fields of "course_certificate" */
export type Course_Certificate_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Certificate_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Course_Certificate_Avg_Fields = {
  __typename?: 'course_certificate_avg_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "course_certificate". All fields are combined with a logical 'AND'. */
export type Course_Certificate_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Certificate_Bool_Exp>>;
  _not?: InputMaybe<Course_Certificate_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Certificate_Bool_Exp>>;
  certificationDate?: InputMaybe<Date_Comparison_Exp>;
  course?: InputMaybe<Course_Bool_Exp>;
  courseId?: InputMaybe<Int_Comparison_Exp>;
  courseLevel?: InputMaybe<String_Comparison_Exp>;
  courseName?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  expiryDate?: InputMaybe<Date_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  number?: InputMaybe<String_Comparison_Exp>;
  participant?: InputMaybe<Course_Participant_Bool_Exp>;
  profile?: InputMaybe<Profile_Bool_Exp>;
  profileId?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** columns and relationships of "course_certificate_changelog" */
export type Course_Certificate_Changelog = {
  __typename?: 'course_certificate_changelog';
  /** An object relationship */
  author: Profile;
  authorId: Scalars['uuid'];
  createdAt: Scalars['timestamptz'];
  id: Scalars['uuid'];
  newGrade: Grade_Enum;
  notes: Scalars['String'];
  oldGrade: Grade_Enum;
  /** An object relationship */
  participant: Course_Participant;
  participantId: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "course_certificate_changelog" */
export type Course_Certificate_Changelog_Aggregate = {
  __typename?: 'course_certificate_changelog_aggregate';
  aggregate?: Maybe<Course_Certificate_Changelog_Aggregate_Fields>;
  nodes: Array<Course_Certificate_Changelog>;
};

/** aggregate fields of "course_certificate_changelog" */
export type Course_Certificate_Changelog_Aggregate_Fields = {
  __typename?: 'course_certificate_changelog_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Course_Certificate_Changelog_Max_Fields>;
  min?: Maybe<Course_Certificate_Changelog_Min_Fields>;
};


/** aggregate fields of "course_certificate_changelog" */
export type Course_Certificate_Changelog_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Certificate_Changelog_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "course_certificate_changelog" */
export type Course_Certificate_Changelog_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Course_Certificate_Changelog_Max_Order_By>;
  min?: InputMaybe<Course_Certificate_Changelog_Min_Order_By>;
};

/** input type for inserting array relation for remote table "course_certificate_changelog" */
export type Course_Certificate_Changelog_Arr_Rel_Insert_Input = {
  data: Array<Course_Certificate_Changelog_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Course_Certificate_Changelog_On_Conflict>;
};

/** Boolean expression to filter rows from the table "course_certificate_changelog". All fields are combined with a logical 'AND'. */
export type Course_Certificate_Changelog_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Certificate_Changelog_Bool_Exp>>;
  _not?: InputMaybe<Course_Certificate_Changelog_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Certificate_Changelog_Bool_Exp>>;
  author?: InputMaybe<Profile_Bool_Exp>;
  authorId?: InputMaybe<Uuid_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  newGrade?: InputMaybe<Grade_Enum_Comparison_Exp>;
  notes?: InputMaybe<String_Comparison_Exp>;
  oldGrade?: InputMaybe<Grade_Enum_Comparison_Exp>;
  participant?: InputMaybe<Course_Participant_Bool_Exp>;
  participantId?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_certificate_changelog" */
export enum Course_Certificate_Changelog_Constraint {
  /** unique or primary key constraint */
  CourseCertificateChangelogPkey = 'course_certificate_changelog_pkey'
}

/** input type for inserting data into table "course_certificate_changelog" */
export type Course_Certificate_Changelog_Insert_Input = {
  author?: InputMaybe<Profile_Obj_Rel_Insert_Input>;
  authorId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  newGrade?: InputMaybe<Grade_Enum>;
  notes?: InputMaybe<Scalars['String']>;
  oldGrade?: InputMaybe<Grade_Enum>;
  participant?: InputMaybe<Course_Participant_Obj_Rel_Insert_Input>;
  participantId?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Course_Certificate_Changelog_Max_Fields = {
  __typename?: 'course_certificate_changelog_max_fields';
  authorId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  notes?: Maybe<Scalars['String']>;
  participantId?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "course_certificate_changelog" */
export type Course_Certificate_Changelog_Max_Order_By = {
  authorId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  participantId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Course_Certificate_Changelog_Min_Fields = {
  __typename?: 'course_certificate_changelog_min_fields';
  authorId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  notes?: Maybe<Scalars['String']>;
  participantId?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "course_certificate_changelog" */
export type Course_Certificate_Changelog_Min_Order_By = {
  authorId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  participantId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "course_certificate_changelog" */
export type Course_Certificate_Changelog_Mutation_Response = {
  __typename?: 'course_certificate_changelog_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Certificate_Changelog>;
};

/** on_conflict condition type for table "course_certificate_changelog" */
export type Course_Certificate_Changelog_On_Conflict = {
  constraint: Course_Certificate_Changelog_Constraint;
  update_columns?: Array<Course_Certificate_Changelog_Update_Column>;
  where?: InputMaybe<Course_Certificate_Changelog_Bool_Exp>;
};

/** Ordering options when selecting data from "course_certificate_changelog". */
export type Course_Certificate_Changelog_Order_By = {
  author?: InputMaybe<Profile_Order_By>;
  authorId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  newGrade?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  oldGrade?: InputMaybe<Order_By>;
  participant?: InputMaybe<Course_Participant_Order_By>;
  participantId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_certificate_changelog */
export type Course_Certificate_Changelog_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "course_certificate_changelog" */
export enum Course_Certificate_Changelog_Select_Column {
  /** column name */
  AuthorId = 'authorId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  NewGrade = 'newGrade',
  /** column name */
  Notes = 'notes',
  /** column name */
  OldGrade = 'oldGrade',
  /** column name */
  ParticipantId = 'participantId',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "course_certificate_changelog" */
export type Course_Certificate_Changelog_Set_Input = {
  authorId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  newGrade?: InputMaybe<Grade_Enum>;
  notes?: InputMaybe<Scalars['String']>;
  oldGrade?: InputMaybe<Grade_Enum>;
  participantId?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "course_certificate_changelog" */
export enum Course_Certificate_Changelog_Update_Column {
  /** column name */
  AuthorId = 'authorId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  NewGrade = 'newGrade',
  /** column name */
  Notes = 'notes',
  /** column name */
  OldGrade = 'oldGrade',
  /** column name */
  ParticipantId = 'participantId',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** unique or primary key constraints on table "course_certificate" */
export enum Course_Certificate_Constraint {
  /** unique or primary key constraint */
  CourseCertificateNumberKey = 'course_certificate_number_key',
  /** unique or primary key constraint */
  CourseCertificatePkey = 'course_certificate_pkey'
}

/** input type for incrementing numeric columns in table "course_certificate" */
export type Course_Certificate_Inc_Input = {
  courseId?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "course_certificate" */
export type Course_Certificate_Insert_Input = {
  certificationDate?: InputMaybe<Scalars['date']>;
  course?: InputMaybe<Course_Obj_Rel_Insert_Input>;
  courseId?: InputMaybe<Scalars['Int']>;
  courseLevel?: InputMaybe<Scalars['String']>;
  courseName?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  expiryDate?: InputMaybe<Scalars['date']>;
  id?: InputMaybe<Scalars['uuid']>;
  number?: InputMaybe<Scalars['String']>;
  participant?: InputMaybe<Course_Participant_Obj_Rel_Insert_Input>;
  profile?: InputMaybe<Profile_Obj_Rel_Insert_Input>;
  profileId?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Course_Certificate_Max_Fields = {
  __typename?: 'course_certificate_max_fields';
  certificationDate?: Maybe<Scalars['date']>;
  courseId?: Maybe<Scalars['Int']>;
  courseLevel?: Maybe<Scalars['String']>;
  courseName?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  expiryDate?: Maybe<Scalars['date']>;
  id?: Maybe<Scalars['uuid']>;
  number?: Maybe<Scalars['String']>;
  profileId?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Course_Certificate_Min_Fields = {
  __typename?: 'course_certificate_min_fields';
  certificationDate?: Maybe<Scalars['date']>;
  courseId?: Maybe<Scalars['Int']>;
  courseLevel?: Maybe<Scalars['String']>;
  courseName?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  expiryDate?: Maybe<Scalars['date']>;
  id?: Maybe<Scalars['uuid']>;
  number?: Maybe<Scalars['String']>;
  profileId?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "course_certificate" */
export type Course_Certificate_Mutation_Response = {
  __typename?: 'course_certificate_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Certificate>;
};

/** input type for inserting object relation for remote table "course_certificate" */
export type Course_Certificate_Obj_Rel_Insert_Input = {
  data: Course_Certificate_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Course_Certificate_On_Conflict>;
};

/** on_conflict condition type for table "course_certificate" */
export type Course_Certificate_On_Conflict = {
  constraint: Course_Certificate_Constraint;
  update_columns?: Array<Course_Certificate_Update_Column>;
  where?: InputMaybe<Course_Certificate_Bool_Exp>;
};

/** Ordering options when selecting data from "course_certificate". */
export type Course_Certificate_Order_By = {
  certificationDate?: InputMaybe<Order_By>;
  course?: InputMaybe<Course_Order_By>;
  courseId?: InputMaybe<Order_By>;
  courseLevel?: InputMaybe<Order_By>;
  courseName?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  expiryDate?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  number?: InputMaybe<Order_By>;
  participant?: InputMaybe<Course_Participant_Order_By>;
  profile?: InputMaybe<Profile_Order_By>;
  profileId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_certificate */
export type Course_Certificate_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "course_certificate" */
export enum Course_Certificate_Select_Column {
  /** column name */
  CertificationDate = 'certificationDate',
  /** column name */
  CourseId = 'courseId',
  /** column name */
  CourseLevel = 'courseLevel',
  /** column name */
  CourseName = 'courseName',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExpiryDate = 'expiryDate',
  /** column name */
  Id = 'id',
  /** column name */
  Number = 'number',
  /** column name */
  ProfileId = 'profileId',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "course_certificate" */
export type Course_Certificate_Set_Input = {
  certificationDate?: InputMaybe<Scalars['date']>;
  courseId?: InputMaybe<Scalars['Int']>;
  courseLevel?: InputMaybe<Scalars['String']>;
  courseName?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  expiryDate?: InputMaybe<Scalars['date']>;
  id?: InputMaybe<Scalars['uuid']>;
  number?: InputMaybe<Scalars['String']>;
  profileId?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Course_Certificate_Stddev_Fields = {
  __typename?: 'course_certificate_stddev_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Course_Certificate_Stddev_Pop_Fields = {
  __typename?: 'course_certificate_stddev_pop_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Course_Certificate_Stddev_Samp_Fields = {
  __typename?: 'course_certificate_stddev_samp_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Course_Certificate_Sum_Fields = {
  __typename?: 'course_certificate_sum_fields';
  courseId?: Maybe<Scalars['Int']>;
};

/** update columns of table "course_certificate" */
export enum Course_Certificate_Update_Column {
  /** column name */
  CertificationDate = 'certificationDate',
  /** column name */
  CourseId = 'courseId',
  /** column name */
  CourseLevel = 'courseLevel',
  /** column name */
  CourseName = 'courseName',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExpiryDate = 'expiryDate',
  /** column name */
  Id = 'id',
  /** column name */
  Number = 'number',
  /** column name */
  ProfileId = 'profileId',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** aggregate var_pop on columns */
export type Course_Certificate_Var_Pop_Fields = {
  __typename?: 'course_certificate_var_pop_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Course_Certificate_Var_Samp_Fields = {
  __typename?: 'course_certificate_var_samp_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Course_Certificate_Variance_Fields = {
  __typename?: 'course_certificate_variance_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** unique or primary key constraints on table "course" */
export enum Course_Constraint {
  /** unique or primary key constraint */
  CourseAutoincrementalIdKey = 'course_autoincremental_id_key',
  /** unique or primary key constraint */
  CoursePkey = 'course_pkey'
}

/** columns and relationships of "course_delivery_type" */
export type Course_Delivery_Type = {
  __typename?: 'course_delivery_type';
  name: Scalars['String'];
};

/** aggregated selection of "course_delivery_type" */
export type Course_Delivery_Type_Aggregate = {
  __typename?: 'course_delivery_type_aggregate';
  aggregate?: Maybe<Course_Delivery_Type_Aggregate_Fields>;
  nodes: Array<Course_Delivery_Type>;
};

/** aggregate fields of "course_delivery_type" */
export type Course_Delivery_Type_Aggregate_Fields = {
  __typename?: 'course_delivery_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Course_Delivery_Type_Max_Fields>;
  min?: Maybe<Course_Delivery_Type_Min_Fields>;
};


/** aggregate fields of "course_delivery_type" */
export type Course_Delivery_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Delivery_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "course_delivery_type". All fields are combined with a logical 'AND'. */
export type Course_Delivery_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Delivery_Type_Bool_Exp>>;
  _not?: InputMaybe<Course_Delivery_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Delivery_Type_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_delivery_type" */
export enum Course_Delivery_Type_Constraint {
  /** unique or primary key constraint */
  CourseDeliveryTypePkey = 'course_delivery_type_pkey'
}

export enum Course_Delivery_Type_Enum {
  F2F = 'F2F',
  Mixed = 'MIXED',
  Virtual = 'VIRTUAL'
}

/** Boolean expression to compare columns of type "course_delivery_type_enum". All fields are combined with logical 'AND'. */
export type Course_Delivery_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Course_Delivery_Type_Enum>;
  _in?: InputMaybe<Array<Course_Delivery_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Course_Delivery_Type_Enum>;
  _nin?: InputMaybe<Array<Course_Delivery_Type_Enum>>;
};

/** input type for inserting data into table "course_delivery_type" */
export type Course_Delivery_Type_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Course_Delivery_Type_Max_Fields = {
  __typename?: 'course_delivery_type_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Course_Delivery_Type_Min_Fields = {
  __typename?: 'course_delivery_type_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "course_delivery_type" */
export type Course_Delivery_Type_Mutation_Response = {
  __typename?: 'course_delivery_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Delivery_Type>;
};

/** on_conflict condition type for table "course_delivery_type" */
export type Course_Delivery_Type_On_Conflict = {
  constraint: Course_Delivery_Type_Constraint;
  update_columns?: Array<Course_Delivery_Type_Update_Column>;
  where?: InputMaybe<Course_Delivery_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "course_delivery_type". */
export type Course_Delivery_Type_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_delivery_type */
export type Course_Delivery_Type_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "course_delivery_type" */
export enum Course_Delivery_Type_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "course_delivery_type" */
export type Course_Delivery_Type_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "course_delivery_type" */
export enum Course_Delivery_Type_Update_Column {
  /** column name */
  Name = 'name'
}

/** columns and relationships of "course_evaluation_answers" */
export type Course_Evaluation_Answers = {
  __typename?: 'course_evaluation_answers';
  answer?: Maybe<Scalars['String']>;
  /** An object relationship */
  course: Course;
  courseId: Scalars['Int'];
  id: Scalars['uuid'];
  /** An object relationship */
  participant?: Maybe<Course_Participant>;
  /** An object relationship */
  profile: Profile;
  profileId: Scalars['uuid'];
  /** An object relationship */
  question: Course_Evaluation_Questions;
  questionId: Scalars['uuid'];
};

/** aggregated selection of "course_evaluation_answers" */
export type Course_Evaluation_Answers_Aggregate = {
  __typename?: 'course_evaluation_answers_aggregate';
  aggregate?: Maybe<Course_Evaluation_Answers_Aggregate_Fields>;
  nodes: Array<Course_Evaluation_Answers>;
};

/** aggregate fields of "course_evaluation_answers" */
export type Course_Evaluation_Answers_Aggregate_Fields = {
  __typename?: 'course_evaluation_answers_aggregate_fields';
  avg?: Maybe<Course_Evaluation_Answers_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Course_Evaluation_Answers_Max_Fields>;
  min?: Maybe<Course_Evaluation_Answers_Min_Fields>;
  stddev?: Maybe<Course_Evaluation_Answers_Stddev_Fields>;
  stddev_pop?: Maybe<Course_Evaluation_Answers_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Course_Evaluation_Answers_Stddev_Samp_Fields>;
  sum?: Maybe<Course_Evaluation_Answers_Sum_Fields>;
  var_pop?: Maybe<Course_Evaluation_Answers_Var_Pop_Fields>;
  var_samp?: Maybe<Course_Evaluation_Answers_Var_Samp_Fields>;
  variance?: Maybe<Course_Evaluation_Answers_Variance_Fields>;
};


/** aggregate fields of "course_evaluation_answers" */
export type Course_Evaluation_Answers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Evaluation_Answers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Course_Evaluation_Answers_Avg_Fields = {
  __typename?: 'course_evaluation_answers_avg_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "course_evaluation_answers". All fields are combined with a logical 'AND'. */
export type Course_Evaluation_Answers_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Evaluation_Answers_Bool_Exp>>;
  _not?: InputMaybe<Course_Evaluation_Answers_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Evaluation_Answers_Bool_Exp>>;
  answer?: InputMaybe<String_Comparison_Exp>;
  course?: InputMaybe<Course_Bool_Exp>;
  courseId?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  participant?: InputMaybe<Course_Participant_Bool_Exp>;
  profile?: InputMaybe<Profile_Bool_Exp>;
  profileId?: InputMaybe<Uuid_Comparison_Exp>;
  question?: InputMaybe<Course_Evaluation_Questions_Bool_Exp>;
  questionId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_evaluation_answers" */
export enum Course_Evaluation_Answers_Constraint {
  /** unique or primary key constraint */
  CourseEvaluationAnswersPkey = 'course_evaluation_answers_pkey'
}

/** input type for incrementing numeric columns in table "course_evaluation_answers" */
export type Course_Evaluation_Answers_Inc_Input = {
  courseId?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "course_evaluation_answers" */
export type Course_Evaluation_Answers_Insert_Input = {
  answer?: InputMaybe<Scalars['String']>;
  course?: InputMaybe<Course_Obj_Rel_Insert_Input>;
  courseId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['uuid']>;
  participant?: InputMaybe<Course_Participant_Obj_Rel_Insert_Input>;
  profile?: InputMaybe<Profile_Obj_Rel_Insert_Input>;
  profileId?: InputMaybe<Scalars['uuid']>;
  question?: InputMaybe<Course_Evaluation_Questions_Obj_Rel_Insert_Input>;
  questionId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Course_Evaluation_Answers_Max_Fields = {
  __typename?: 'course_evaluation_answers_max_fields';
  answer?: Maybe<Scalars['String']>;
  courseId?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  profileId?: Maybe<Scalars['uuid']>;
  questionId?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type Course_Evaluation_Answers_Min_Fields = {
  __typename?: 'course_evaluation_answers_min_fields';
  answer?: Maybe<Scalars['String']>;
  courseId?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  profileId?: Maybe<Scalars['uuid']>;
  questionId?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "course_evaluation_answers" */
export type Course_Evaluation_Answers_Mutation_Response = {
  __typename?: 'course_evaluation_answers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Evaluation_Answers>;
};

/** on_conflict condition type for table "course_evaluation_answers" */
export type Course_Evaluation_Answers_On_Conflict = {
  constraint: Course_Evaluation_Answers_Constraint;
  update_columns?: Array<Course_Evaluation_Answers_Update_Column>;
  where?: InputMaybe<Course_Evaluation_Answers_Bool_Exp>;
};

/** Ordering options when selecting data from "course_evaluation_answers". */
export type Course_Evaluation_Answers_Order_By = {
  answer?: InputMaybe<Order_By>;
  course?: InputMaybe<Course_Order_By>;
  courseId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  participant?: InputMaybe<Course_Participant_Order_By>;
  profile?: InputMaybe<Profile_Order_By>;
  profileId?: InputMaybe<Order_By>;
  question?: InputMaybe<Course_Evaluation_Questions_Order_By>;
  questionId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_evaluation_answers */
export type Course_Evaluation_Answers_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "course_evaluation_answers" */
export enum Course_Evaluation_Answers_Select_Column {
  /** column name */
  Answer = 'answer',
  /** column name */
  CourseId = 'courseId',
  /** column name */
  Id = 'id',
  /** column name */
  ProfileId = 'profileId',
  /** column name */
  QuestionId = 'questionId'
}

/** input type for updating data in table "course_evaluation_answers" */
export type Course_Evaluation_Answers_Set_Input = {
  answer?: InputMaybe<Scalars['String']>;
  courseId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['uuid']>;
  profileId?: InputMaybe<Scalars['uuid']>;
  questionId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate stddev on columns */
export type Course_Evaluation_Answers_Stddev_Fields = {
  __typename?: 'course_evaluation_answers_stddev_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Course_Evaluation_Answers_Stddev_Pop_Fields = {
  __typename?: 'course_evaluation_answers_stddev_pop_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Course_Evaluation_Answers_Stddev_Samp_Fields = {
  __typename?: 'course_evaluation_answers_stddev_samp_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Course_Evaluation_Answers_Sum_Fields = {
  __typename?: 'course_evaluation_answers_sum_fields';
  courseId?: Maybe<Scalars['Int']>;
};

/** update columns of table "course_evaluation_answers" */
export enum Course_Evaluation_Answers_Update_Column {
  /** column name */
  Answer = 'answer',
  /** column name */
  CourseId = 'courseId',
  /** column name */
  Id = 'id',
  /** column name */
  ProfileId = 'profileId',
  /** column name */
  QuestionId = 'questionId'
}

/** aggregate var_pop on columns */
export type Course_Evaluation_Answers_Var_Pop_Fields = {
  __typename?: 'course_evaluation_answers_var_pop_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Course_Evaluation_Answers_Var_Samp_Fields = {
  __typename?: 'course_evaluation_answers_var_samp_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Course_Evaluation_Answers_Variance_Fields = {
  __typename?: 'course_evaluation_answers_variance_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "course_evaluation_question_group" */
export type Course_Evaluation_Question_Group = {
  __typename?: 'course_evaluation_question_group';
  name: Scalars['String'];
};

/** aggregated selection of "course_evaluation_question_group" */
export type Course_Evaluation_Question_Group_Aggregate = {
  __typename?: 'course_evaluation_question_group_aggregate';
  aggregate?: Maybe<Course_Evaluation_Question_Group_Aggregate_Fields>;
  nodes: Array<Course_Evaluation_Question_Group>;
};

/** aggregate fields of "course_evaluation_question_group" */
export type Course_Evaluation_Question_Group_Aggregate_Fields = {
  __typename?: 'course_evaluation_question_group_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Course_Evaluation_Question_Group_Max_Fields>;
  min?: Maybe<Course_Evaluation_Question_Group_Min_Fields>;
};


/** aggregate fields of "course_evaluation_question_group" */
export type Course_Evaluation_Question_Group_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Evaluation_Question_Group_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "course_evaluation_question_group". All fields are combined with a logical 'AND'. */
export type Course_Evaluation_Question_Group_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Evaluation_Question_Group_Bool_Exp>>;
  _not?: InputMaybe<Course_Evaluation_Question_Group_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Evaluation_Question_Group_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_evaluation_question_group" */
export enum Course_Evaluation_Question_Group_Constraint {
  /** unique or primary key constraint */
  CourseEvaluationQuestionGroupPkey = 'course_evaluation_question_group_pkey'
}

export enum Course_Evaluation_Question_Group_Enum {
  MaterialsAndVenue = 'MATERIALS_AND_VENUE',
  TrainerStandards = 'TRAINER_STANDARDS',
  TrainingRating = 'TRAINING_RATING',
  TrainingRelevance = 'TRAINING_RELEVANCE',
  Ungrouped = 'UNGROUPED'
}

/** Boolean expression to compare columns of type "course_evaluation_question_group_enum". All fields are combined with logical 'AND'. */
export type Course_Evaluation_Question_Group_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Course_Evaluation_Question_Group_Enum>;
  _in?: InputMaybe<Array<Course_Evaluation_Question_Group_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Course_Evaluation_Question_Group_Enum>;
  _nin?: InputMaybe<Array<Course_Evaluation_Question_Group_Enum>>;
};

/** input type for inserting data into table "course_evaluation_question_group" */
export type Course_Evaluation_Question_Group_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Course_Evaluation_Question_Group_Max_Fields = {
  __typename?: 'course_evaluation_question_group_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Course_Evaluation_Question_Group_Min_Fields = {
  __typename?: 'course_evaluation_question_group_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "course_evaluation_question_group" */
export type Course_Evaluation_Question_Group_Mutation_Response = {
  __typename?: 'course_evaluation_question_group_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Evaluation_Question_Group>;
};

/** on_conflict condition type for table "course_evaluation_question_group" */
export type Course_Evaluation_Question_Group_On_Conflict = {
  constraint: Course_Evaluation_Question_Group_Constraint;
  update_columns?: Array<Course_Evaluation_Question_Group_Update_Column>;
  where?: InputMaybe<Course_Evaluation_Question_Group_Bool_Exp>;
};

/** Ordering options when selecting data from "course_evaluation_question_group". */
export type Course_Evaluation_Question_Group_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_evaluation_question_group */
export type Course_Evaluation_Question_Group_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "course_evaluation_question_group" */
export enum Course_Evaluation_Question_Group_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "course_evaluation_question_group" */
export type Course_Evaluation_Question_Group_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "course_evaluation_question_group" */
export enum Course_Evaluation_Question_Group_Update_Column {
  /** column name */
  Name = 'name'
}

/** columns and relationships of "course_evaluation_question_type" */
export type Course_Evaluation_Question_Type = {
  __typename?: 'course_evaluation_question_type';
  name: Scalars['String'];
};

/** aggregated selection of "course_evaluation_question_type" */
export type Course_Evaluation_Question_Type_Aggregate = {
  __typename?: 'course_evaluation_question_type_aggregate';
  aggregate?: Maybe<Course_Evaluation_Question_Type_Aggregate_Fields>;
  nodes: Array<Course_Evaluation_Question_Type>;
};

/** aggregate fields of "course_evaluation_question_type" */
export type Course_Evaluation_Question_Type_Aggregate_Fields = {
  __typename?: 'course_evaluation_question_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Course_Evaluation_Question_Type_Max_Fields>;
  min?: Maybe<Course_Evaluation_Question_Type_Min_Fields>;
};


/** aggregate fields of "course_evaluation_question_type" */
export type Course_Evaluation_Question_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Evaluation_Question_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "course_evaluation_question_type". All fields are combined with a logical 'AND'. */
export type Course_Evaluation_Question_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Evaluation_Question_Type_Bool_Exp>>;
  _not?: InputMaybe<Course_Evaluation_Question_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Evaluation_Question_Type_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_evaluation_question_type" */
export enum Course_Evaluation_Question_Type_Constraint {
  /** unique or primary key constraint */
  CourseEvaluationQuestionTypePkey = 'course_evaluation_question_type_pkey'
}

export enum Course_Evaluation_Question_Type_Enum {
  Boolean = 'BOOLEAN',
  BooleanReasonN = 'BOOLEAN_REASON_N',
  BooleanReasonY = 'BOOLEAN_REASON_Y',
  Rating = 'RATING',
  Text = 'TEXT'
}

/** Boolean expression to compare columns of type "course_evaluation_question_type_enum". All fields are combined with logical 'AND'. */
export type Course_Evaluation_Question_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Course_Evaluation_Question_Type_Enum>;
  _in?: InputMaybe<Array<Course_Evaluation_Question_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Course_Evaluation_Question_Type_Enum>;
  _nin?: InputMaybe<Array<Course_Evaluation_Question_Type_Enum>>;
};

/** input type for inserting data into table "course_evaluation_question_type" */
export type Course_Evaluation_Question_Type_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Course_Evaluation_Question_Type_Max_Fields = {
  __typename?: 'course_evaluation_question_type_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Course_Evaluation_Question_Type_Min_Fields = {
  __typename?: 'course_evaluation_question_type_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "course_evaluation_question_type" */
export type Course_Evaluation_Question_Type_Mutation_Response = {
  __typename?: 'course_evaluation_question_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Evaluation_Question_Type>;
};

/** on_conflict condition type for table "course_evaluation_question_type" */
export type Course_Evaluation_Question_Type_On_Conflict = {
  constraint: Course_Evaluation_Question_Type_Constraint;
  update_columns?: Array<Course_Evaluation_Question_Type_Update_Column>;
  where?: InputMaybe<Course_Evaluation_Question_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "course_evaluation_question_type". */
export type Course_Evaluation_Question_Type_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_evaluation_question_type */
export type Course_Evaluation_Question_Type_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "course_evaluation_question_type" */
export enum Course_Evaluation_Question_Type_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "course_evaluation_question_type" */
export type Course_Evaluation_Question_Type_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "course_evaluation_question_type" */
export enum Course_Evaluation_Question_Type_Update_Column {
  /** column name */
  Name = 'name'
}

/** Table for storing text and references of course evaluation questions */
export type Course_Evaluation_Questions = {
  __typename?: 'course_evaluation_questions';
  displayOrder: Scalars['Int'];
  group?: Maybe<Course_Evaluation_Question_Group_Enum>;
  id: Scalars['uuid'];
  question: Scalars['String'];
  questionKey?: Maybe<Scalars['String']>;
  required: Scalars['Boolean'];
  type?: Maybe<Course_Evaluation_Question_Type_Enum>;
};

/** aggregated selection of "course_evaluation_questions" */
export type Course_Evaluation_Questions_Aggregate = {
  __typename?: 'course_evaluation_questions_aggregate';
  aggregate?: Maybe<Course_Evaluation_Questions_Aggregate_Fields>;
  nodes: Array<Course_Evaluation_Questions>;
};

/** aggregate fields of "course_evaluation_questions" */
export type Course_Evaluation_Questions_Aggregate_Fields = {
  __typename?: 'course_evaluation_questions_aggregate_fields';
  avg?: Maybe<Course_Evaluation_Questions_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Course_Evaluation_Questions_Max_Fields>;
  min?: Maybe<Course_Evaluation_Questions_Min_Fields>;
  stddev?: Maybe<Course_Evaluation_Questions_Stddev_Fields>;
  stddev_pop?: Maybe<Course_Evaluation_Questions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Course_Evaluation_Questions_Stddev_Samp_Fields>;
  sum?: Maybe<Course_Evaluation_Questions_Sum_Fields>;
  var_pop?: Maybe<Course_Evaluation_Questions_Var_Pop_Fields>;
  var_samp?: Maybe<Course_Evaluation_Questions_Var_Samp_Fields>;
  variance?: Maybe<Course_Evaluation_Questions_Variance_Fields>;
};


/** aggregate fields of "course_evaluation_questions" */
export type Course_Evaluation_Questions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Evaluation_Questions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Course_Evaluation_Questions_Avg_Fields = {
  __typename?: 'course_evaluation_questions_avg_fields';
  displayOrder?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "course_evaluation_questions". All fields are combined with a logical 'AND'. */
export type Course_Evaluation_Questions_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Evaluation_Questions_Bool_Exp>>;
  _not?: InputMaybe<Course_Evaluation_Questions_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Evaluation_Questions_Bool_Exp>>;
  displayOrder?: InputMaybe<Int_Comparison_Exp>;
  group?: InputMaybe<Course_Evaluation_Question_Group_Enum_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  question?: InputMaybe<String_Comparison_Exp>;
  questionKey?: InputMaybe<String_Comparison_Exp>;
  required?: InputMaybe<Boolean_Comparison_Exp>;
  type?: InputMaybe<Course_Evaluation_Question_Type_Enum_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_evaluation_questions" */
export enum Course_Evaluation_Questions_Constraint {
  /** unique or primary key constraint */
  CourseEvaluationQuestionsPkey = 'course_evaluation_questions_pkey',
  /** unique or primary key constraint */
  CourseEvaluationQuestionsQuestionKeyKey = 'course_evaluation_questions_question_key_key'
}

/** input type for incrementing numeric columns in table "course_evaluation_questions" */
export type Course_Evaluation_Questions_Inc_Input = {
  displayOrder?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "course_evaluation_questions" */
export type Course_Evaluation_Questions_Insert_Input = {
  displayOrder?: InputMaybe<Scalars['Int']>;
  group?: InputMaybe<Course_Evaluation_Question_Group_Enum>;
  id?: InputMaybe<Scalars['uuid']>;
  question?: InputMaybe<Scalars['String']>;
  questionKey?: InputMaybe<Scalars['String']>;
  required?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<Course_Evaluation_Question_Type_Enum>;
};

/** aggregate max on columns */
export type Course_Evaluation_Questions_Max_Fields = {
  __typename?: 'course_evaluation_questions_max_fields';
  displayOrder?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  question?: Maybe<Scalars['String']>;
  questionKey?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Course_Evaluation_Questions_Min_Fields = {
  __typename?: 'course_evaluation_questions_min_fields';
  displayOrder?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  question?: Maybe<Scalars['String']>;
  questionKey?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "course_evaluation_questions" */
export type Course_Evaluation_Questions_Mutation_Response = {
  __typename?: 'course_evaluation_questions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Evaluation_Questions>;
};

/** input type for inserting object relation for remote table "course_evaluation_questions" */
export type Course_Evaluation_Questions_Obj_Rel_Insert_Input = {
  data: Course_Evaluation_Questions_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Course_Evaluation_Questions_On_Conflict>;
};

/** on_conflict condition type for table "course_evaluation_questions" */
export type Course_Evaluation_Questions_On_Conflict = {
  constraint: Course_Evaluation_Questions_Constraint;
  update_columns?: Array<Course_Evaluation_Questions_Update_Column>;
  where?: InputMaybe<Course_Evaluation_Questions_Bool_Exp>;
};

/** Ordering options when selecting data from "course_evaluation_questions". */
export type Course_Evaluation_Questions_Order_By = {
  displayOrder?: InputMaybe<Order_By>;
  group?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  question?: InputMaybe<Order_By>;
  questionKey?: InputMaybe<Order_By>;
  required?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_evaluation_questions */
export type Course_Evaluation_Questions_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "course_evaluation_questions" */
export enum Course_Evaluation_Questions_Select_Column {
  /** column name */
  DisplayOrder = 'displayOrder',
  /** column name */
  Group = 'group',
  /** column name */
  Id = 'id',
  /** column name */
  Question = 'question',
  /** column name */
  QuestionKey = 'questionKey',
  /** column name */
  Required = 'required',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "course_evaluation_questions" */
export type Course_Evaluation_Questions_Set_Input = {
  displayOrder?: InputMaybe<Scalars['Int']>;
  group?: InputMaybe<Course_Evaluation_Question_Group_Enum>;
  id?: InputMaybe<Scalars['uuid']>;
  question?: InputMaybe<Scalars['String']>;
  questionKey?: InputMaybe<Scalars['String']>;
  required?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<Course_Evaluation_Question_Type_Enum>;
};

/** aggregate stddev on columns */
export type Course_Evaluation_Questions_Stddev_Fields = {
  __typename?: 'course_evaluation_questions_stddev_fields';
  displayOrder?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Course_Evaluation_Questions_Stddev_Pop_Fields = {
  __typename?: 'course_evaluation_questions_stddev_pop_fields';
  displayOrder?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Course_Evaluation_Questions_Stddev_Samp_Fields = {
  __typename?: 'course_evaluation_questions_stddev_samp_fields';
  displayOrder?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Course_Evaluation_Questions_Sum_Fields = {
  __typename?: 'course_evaluation_questions_sum_fields';
  displayOrder?: Maybe<Scalars['Int']>;
};

/** update columns of table "course_evaluation_questions" */
export enum Course_Evaluation_Questions_Update_Column {
  /** column name */
  DisplayOrder = 'displayOrder',
  /** column name */
  Group = 'group',
  /** column name */
  Id = 'id',
  /** column name */
  Question = 'question',
  /** column name */
  QuestionKey = 'questionKey',
  /** column name */
  Required = 'required',
  /** column name */
  Type = 'type'
}

/** aggregate var_pop on columns */
export type Course_Evaluation_Questions_Var_Pop_Fields = {
  __typename?: 'course_evaluation_questions_var_pop_fields';
  displayOrder?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Course_Evaluation_Questions_Var_Samp_Fields = {
  __typename?: 'course_evaluation_questions_var_samp_fields';
  displayOrder?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Course_Evaluation_Questions_Variance_Fields = {
  __typename?: 'course_evaluation_questions_variance_fields';
  displayOrder?: Maybe<Scalars['Float']>;
};

/** input type for incrementing numeric columns in table "course" */
export type Course_Inc_Input = {
  aolCostOfCourse?: InputMaybe<Scalars['numeric']>;
  id?: InputMaybe<Scalars['Int']>;
  max_participants?: InputMaybe<Scalars['Int']>;
  min_participants?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "course" */
export type Course_Insert_Input = {
  aolCostOfCourse?: InputMaybe<Scalars['numeric']>;
  contactProfile?: InputMaybe<Profile_Obj_Rel_Insert_Input>;
  contactProfileId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deliveryType?: InputMaybe<Course_Delivery_Type_Enum>;
  description?: InputMaybe<Scalars['String']>;
  go1Integration?: InputMaybe<Scalars['Boolean']>;
  gradingConfirmed?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['Int']>;
  level?: InputMaybe<Course_Level_Enum>;
  max_participants?: InputMaybe<Scalars['Int']>;
  min_participants?: InputMaybe<Scalars['Int']>;
  modules?: InputMaybe<Course_Module_Arr_Rel_Insert_Input>;
  name?: InputMaybe<Scalars['String']>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organization_id?: InputMaybe<Scalars['uuid']>;
  participants?: InputMaybe<Course_Participant_Arr_Rel_Insert_Input>;
  reaccreditation?: InputMaybe<Scalars['Boolean']>;
  schedule?: InputMaybe<Course_Schedule_Arr_Rel_Insert_Input>;
  status?: InputMaybe<Course_Status_Enum>;
  trainers?: InputMaybe<Course_Trainer_Arr_Rel_Insert_Input>;
  type?: InputMaybe<Course_Type_Enum>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Enums for status of course registration invites */
export type Course_Invite_Status = {
  __typename?: 'course_invite_status';
  name: Scalars['String'];
};

/** aggregated selection of "course_invite_status" */
export type Course_Invite_Status_Aggregate = {
  __typename?: 'course_invite_status_aggregate';
  aggregate?: Maybe<Course_Invite_Status_Aggregate_Fields>;
  nodes: Array<Course_Invite_Status>;
};

/** aggregate fields of "course_invite_status" */
export type Course_Invite_Status_Aggregate_Fields = {
  __typename?: 'course_invite_status_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Course_Invite_Status_Max_Fields>;
  min?: Maybe<Course_Invite_Status_Min_Fields>;
};


/** aggregate fields of "course_invite_status" */
export type Course_Invite_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Invite_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "course_invite_status". All fields are combined with a logical 'AND'. */
export type Course_Invite_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Invite_Status_Bool_Exp>>;
  _not?: InputMaybe<Course_Invite_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Invite_Status_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_invite_status" */
export enum Course_Invite_Status_Constraint {
  /** unique or primary key constraint */
  CourseInviteStatusPkey = 'course_invite_status_pkey'
}

export enum Course_Invite_Status_Enum {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

/** Boolean expression to compare columns of type "course_invite_status_enum". All fields are combined with logical 'AND'. */
export type Course_Invite_Status_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Course_Invite_Status_Enum>;
  _in?: InputMaybe<Array<Course_Invite_Status_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Course_Invite_Status_Enum>;
  _nin?: InputMaybe<Array<Course_Invite_Status_Enum>>;
};

/** input type for inserting data into table "course_invite_status" */
export type Course_Invite_Status_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Course_Invite_Status_Max_Fields = {
  __typename?: 'course_invite_status_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Course_Invite_Status_Min_Fields = {
  __typename?: 'course_invite_status_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "course_invite_status" */
export type Course_Invite_Status_Mutation_Response = {
  __typename?: 'course_invite_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Invite_Status>;
};

/** on_conflict condition type for table "course_invite_status" */
export type Course_Invite_Status_On_Conflict = {
  constraint: Course_Invite_Status_Constraint;
  update_columns?: Array<Course_Invite_Status_Update_Column>;
  where?: InputMaybe<Course_Invite_Status_Bool_Exp>;
};

/** Ordering options when selecting data from "course_invite_status". */
export type Course_Invite_Status_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_invite_status */
export type Course_Invite_Status_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "course_invite_status" */
export enum Course_Invite_Status_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "course_invite_status" */
export type Course_Invite_Status_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "course_invite_status" */
export enum Course_Invite_Status_Update_Column {
  /** column name */
  Name = 'name'
}

/** Represents course registration invitations */
export type Course_Invites = {
  __typename?: 'course_invites';
  /** An object relationship */
  course: Course;
  course_id: Scalars['Int'];
  createdAt: Scalars['timestamptz'];
  email?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  note?: Maybe<Scalars['String']>;
  /** An object relationship */
  participant?: Maybe<Course_Participant>;
  status?: Maybe<Course_Invite_Status_Enum>;
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "course_invites" */
export type Course_Invites_Aggregate = {
  __typename?: 'course_invites_aggregate';
  aggregate?: Maybe<Course_Invites_Aggregate_Fields>;
  nodes: Array<Course_Invites>;
};

/** aggregate fields of "course_invites" */
export type Course_Invites_Aggregate_Fields = {
  __typename?: 'course_invites_aggregate_fields';
  avg?: Maybe<Course_Invites_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Course_Invites_Max_Fields>;
  min?: Maybe<Course_Invites_Min_Fields>;
  stddev?: Maybe<Course_Invites_Stddev_Fields>;
  stddev_pop?: Maybe<Course_Invites_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Course_Invites_Stddev_Samp_Fields>;
  sum?: Maybe<Course_Invites_Sum_Fields>;
  var_pop?: Maybe<Course_Invites_Var_Pop_Fields>;
  var_samp?: Maybe<Course_Invites_Var_Samp_Fields>;
  variance?: Maybe<Course_Invites_Variance_Fields>;
};


/** aggregate fields of "course_invites" */
export type Course_Invites_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Invites_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Course_Invites_Avg_Fields = {
  __typename?: 'course_invites_avg_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "course_invites". All fields are combined with a logical 'AND'. */
export type Course_Invites_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Invites_Bool_Exp>>;
  _not?: InputMaybe<Course_Invites_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Invites_Bool_Exp>>;
  course?: InputMaybe<Course_Bool_Exp>;
  course_id?: InputMaybe<Int_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  note?: InputMaybe<String_Comparison_Exp>;
  participant?: InputMaybe<Course_Participant_Bool_Exp>;
  status?: InputMaybe<Course_Invite_Status_Enum_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_invites" */
export enum Course_Invites_Constraint {
  /** unique or primary key constraint */
  CourseInvitesPkey = 'course_invites_pkey'
}

/** input type for incrementing numeric columns in table "course_invites" */
export type Course_Invites_Inc_Input = {
  course_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "course_invites" */
export type Course_Invites_Insert_Input = {
  course?: InputMaybe<Course_Obj_Rel_Insert_Input>;
  course_id?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  email?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  note?: InputMaybe<Scalars['String']>;
  participant?: InputMaybe<Course_Participant_Obj_Rel_Insert_Input>;
  status?: InputMaybe<Course_Invite_Status_Enum>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Course_Invites_Max_Fields = {
  __typename?: 'course_invites_max_fields';
  course_id?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  note?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Course_Invites_Min_Fields = {
  __typename?: 'course_invites_min_fields';
  course_id?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  note?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "course_invites" */
export type Course_Invites_Mutation_Response = {
  __typename?: 'course_invites_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Invites>;
};

/** input type for inserting object relation for remote table "course_invites" */
export type Course_Invites_Obj_Rel_Insert_Input = {
  data: Course_Invites_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Course_Invites_On_Conflict>;
};

/** on_conflict condition type for table "course_invites" */
export type Course_Invites_On_Conflict = {
  constraint: Course_Invites_Constraint;
  update_columns?: Array<Course_Invites_Update_Column>;
  where?: InputMaybe<Course_Invites_Bool_Exp>;
};

/** Ordering options when selecting data from "course_invites". */
export type Course_Invites_Order_By = {
  course?: InputMaybe<Course_Order_By>;
  course_id?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  note?: InputMaybe<Order_By>;
  participant?: InputMaybe<Course_Participant_Order_By>;
  status?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_invites */
export type Course_Invites_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "course_invites" */
export enum Course_Invites_Select_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Note = 'note',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "course_invites" */
export type Course_Invites_Set_Input = {
  course_id?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  email?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  note?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Course_Invite_Status_Enum>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Course_Invites_Stddev_Fields = {
  __typename?: 'course_invites_stddev_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Course_Invites_Stddev_Pop_Fields = {
  __typename?: 'course_invites_stddev_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Course_Invites_Stddev_Samp_Fields = {
  __typename?: 'course_invites_stddev_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Course_Invites_Sum_Fields = {
  __typename?: 'course_invites_sum_fields';
  course_id?: Maybe<Scalars['Int']>;
};

/** update columns of table "course_invites" */
export enum Course_Invites_Update_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Note = 'note',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** aggregate var_pop on columns */
export type Course_Invites_Var_Pop_Fields = {
  __typename?: 'course_invites_var_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Course_Invites_Var_Samp_Fields = {
  __typename?: 'course_invites_var_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Course_Invites_Variance_Fields = {
  __typename?: 'course_invites_variance_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "course_level" */
export type Course_Level = {
  __typename?: 'course_level';
  name: Scalars['String'];
};

/** aggregated selection of "course_level" */
export type Course_Level_Aggregate = {
  __typename?: 'course_level_aggregate';
  aggregate?: Maybe<Course_Level_Aggregate_Fields>;
  nodes: Array<Course_Level>;
};

/** aggregate fields of "course_level" */
export type Course_Level_Aggregate_Fields = {
  __typename?: 'course_level_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Course_Level_Max_Fields>;
  min?: Maybe<Course_Level_Min_Fields>;
};


/** aggregate fields of "course_level" */
export type Course_Level_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Level_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "course_level". All fields are combined with a logical 'AND'. */
export type Course_Level_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Level_Bool_Exp>>;
  _not?: InputMaybe<Course_Level_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Level_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_level" */
export enum Course_Level_Constraint {
  /** unique or primary key constraint */
  CourseLevelPkey = 'course_level_pkey'
}

export enum Course_Level_Enum {
  Advanced = 'ADVANCED',
  AdvancedTrainer = 'ADVANCED_TRAINER',
  BildAct = 'BILD_ACT',
  BildActTrainer = 'BILD_ACT_TRAINER',
  IntermediateTrainer = 'INTERMEDIATE_TRAINER',
  Level_1 = 'LEVEL_1',
  Level_2 = 'LEVEL_2'
}

/** Boolean expression to compare columns of type "course_level_enum". All fields are combined with logical 'AND'. */
export type Course_Level_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Course_Level_Enum>;
  _in?: InputMaybe<Array<Course_Level_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Course_Level_Enum>;
  _nin?: InputMaybe<Array<Course_Level_Enum>>;
};

/** input type for inserting data into table "course_level" */
export type Course_Level_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Course_Level_Max_Fields = {
  __typename?: 'course_level_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Course_Level_Min_Fields = {
  __typename?: 'course_level_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "course_level" */
export type Course_Level_Mutation_Response = {
  __typename?: 'course_level_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Level>;
};

/** on_conflict condition type for table "course_level" */
export type Course_Level_On_Conflict = {
  constraint: Course_Level_Constraint;
  update_columns?: Array<Course_Level_Update_Column>;
  where?: InputMaybe<Course_Level_Bool_Exp>;
};

/** Ordering options when selecting data from "course_level". */
export type Course_Level_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_level */
export type Course_Level_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "course_level" */
export enum Course_Level_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "course_level" */
export type Course_Level_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "course_level" */
export enum Course_Level_Update_Column {
  /** column name */
  Name = 'name'
}

/** aggregate max on columns */
export type Course_Max_Fields = {
  __typename?: 'course_max_fields';
  aolCostOfCourse?: Maybe<Scalars['numeric']>;
  contactProfileId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  max_participants?: Maybe<Scalars['Int']>;
  min_participants?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  organization_id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Course_Min_Fields = {
  __typename?: 'course_min_fields';
  aolCostOfCourse?: Maybe<Scalars['numeric']>;
  contactProfileId?: Maybe<Scalars['uuid']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  max_participants?: Maybe<Scalars['Int']>;
  min_participants?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  organization_id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** columns and relationships of "course_module" */
export type Course_Module = {
  __typename?: 'course_module';
  /** An object relationship */
  course: Course;
  courseId: Scalars['Int'];
  covered?: Maybe<Scalars['Boolean']>;
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  /** An object relationship */
  module: Module;
  moduleId: Scalars['uuid'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "course_module" */
export type Course_Module_Aggregate = {
  __typename?: 'course_module_aggregate';
  aggregate?: Maybe<Course_Module_Aggregate_Fields>;
  nodes: Array<Course_Module>;
};

/** aggregate fields of "course_module" */
export type Course_Module_Aggregate_Fields = {
  __typename?: 'course_module_aggregate_fields';
  avg?: Maybe<Course_Module_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Course_Module_Max_Fields>;
  min?: Maybe<Course_Module_Min_Fields>;
  stddev?: Maybe<Course_Module_Stddev_Fields>;
  stddev_pop?: Maybe<Course_Module_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Course_Module_Stddev_Samp_Fields>;
  sum?: Maybe<Course_Module_Sum_Fields>;
  var_pop?: Maybe<Course_Module_Var_Pop_Fields>;
  var_samp?: Maybe<Course_Module_Var_Samp_Fields>;
  variance?: Maybe<Course_Module_Variance_Fields>;
};


/** aggregate fields of "course_module" */
export type Course_Module_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Module_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "course_module" */
export type Course_Module_Aggregate_Order_By = {
  avg?: InputMaybe<Course_Module_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Course_Module_Max_Order_By>;
  min?: InputMaybe<Course_Module_Min_Order_By>;
  stddev?: InputMaybe<Course_Module_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Course_Module_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Course_Module_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Course_Module_Sum_Order_By>;
  var_pop?: InputMaybe<Course_Module_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Course_Module_Var_Samp_Order_By>;
  variance?: InputMaybe<Course_Module_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "course_module" */
export type Course_Module_Arr_Rel_Insert_Input = {
  data: Array<Course_Module_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Course_Module_On_Conflict>;
};

/** aggregate avg on columns */
export type Course_Module_Avg_Fields = {
  __typename?: 'course_module_avg_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "course_module" */
export type Course_Module_Avg_Order_By = {
  courseId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "course_module". All fields are combined with a logical 'AND'. */
export type Course_Module_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Module_Bool_Exp>>;
  _not?: InputMaybe<Course_Module_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Module_Bool_Exp>>;
  course?: InputMaybe<Course_Bool_Exp>;
  courseId?: InputMaybe<Int_Comparison_Exp>;
  covered?: InputMaybe<Boolean_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  module?: InputMaybe<Module_Bool_Exp>;
  moduleId?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_module" */
export enum Course_Module_Constraint {
  /** unique or primary key constraint */
  CourseModulePkey = 'course_module_pkey'
}

/** input type for incrementing numeric columns in table "course_module" */
export type Course_Module_Inc_Input = {
  courseId?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "course_module" */
export type Course_Module_Insert_Input = {
  course?: InputMaybe<Course_Obj_Rel_Insert_Input>;
  courseId?: InputMaybe<Scalars['Int']>;
  covered?: InputMaybe<Scalars['Boolean']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  module?: InputMaybe<Module_Obj_Rel_Insert_Input>;
  moduleId?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Course_Module_Max_Fields = {
  __typename?: 'course_module_max_fields';
  courseId?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  moduleId?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "course_module" */
export type Course_Module_Max_Order_By = {
  courseId?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  moduleId?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Course_Module_Min_Fields = {
  __typename?: 'course_module_min_fields';
  courseId?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  moduleId?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "course_module" */
export type Course_Module_Min_Order_By = {
  courseId?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  moduleId?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "course_module" */
export type Course_Module_Mutation_Response = {
  __typename?: 'course_module_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Module>;
};

/** on_conflict condition type for table "course_module" */
export type Course_Module_On_Conflict = {
  constraint: Course_Module_Constraint;
  update_columns?: Array<Course_Module_Update_Column>;
  where?: InputMaybe<Course_Module_Bool_Exp>;
};

/** Ordering options when selecting data from "course_module". */
export type Course_Module_Order_By = {
  course?: InputMaybe<Course_Order_By>;
  courseId?: InputMaybe<Order_By>;
  covered?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  module?: InputMaybe<Module_Order_By>;
  moduleId?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_module */
export type Course_Module_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "course_module" */
export enum Course_Module_Select_Column {
  /** column name */
  CourseId = 'courseId',
  /** column name */
  Covered = 'covered',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  ModuleId = 'moduleId',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "course_module" */
export type Course_Module_Set_Input = {
  courseId?: InputMaybe<Scalars['Int']>;
  covered?: InputMaybe<Scalars['Boolean']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  moduleId?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Course_Module_Stddev_Fields = {
  __typename?: 'course_module_stddev_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "course_module" */
export type Course_Module_Stddev_Order_By = {
  courseId?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Course_Module_Stddev_Pop_Fields = {
  __typename?: 'course_module_stddev_pop_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "course_module" */
export type Course_Module_Stddev_Pop_Order_By = {
  courseId?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Course_Module_Stddev_Samp_Fields = {
  __typename?: 'course_module_stddev_samp_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "course_module" */
export type Course_Module_Stddev_Samp_Order_By = {
  courseId?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Course_Module_Sum_Fields = {
  __typename?: 'course_module_sum_fields';
  courseId?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "course_module" */
export type Course_Module_Sum_Order_By = {
  courseId?: InputMaybe<Order_By>;
};

/** update columns of table "course_module" */
export enum Course_Module_Update_Column {
  /** column name */
  CourseId = 'courseId',
  /** column name */
  Covered = 'covered',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  ModuleId = 'moduleId',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Course_Module_Var_Pop_Fields = {
  __typename?: 'course_module_var_pop_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "course_module" */
export type Course_Module_Var_Pop_Order_By = {
  courseId?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Course_Module_Var_Samp_Fields = {
  __typename?: 'course_module_var_samp_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "course_module" */
export type Course_Module_Var_Samp_Order_By = {
  courseId?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Course_Module_Variance_Fields = {
  __typename?: 'course_module_variance_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "course_module" */
export type Course_Module_Variance_Order_By = {
  courseId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "course" */
export type Course_Mutation_Response = {
  __typename?: 'course_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course>;
};

/** input type for inserting object relation for remote table "course" */
export type Course_Obj_Rel_Insert_Input = {
  data: Course_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Course_On_Conflict>;
};

/** on_conflict condition type for table "course" */
export type Course_On_Conflict = {
  constraint: Course_Constraint;
  update_columns?: Array<Course_Update_Column>;
  where?: InputMaybe<Course_Bool_Exp>;
};

/** Ordering options when selecting data from "course". */
export type Course_Order_By = {
  aolCostOfCourse?: InputMaybe<Order_By>;
  contactProfile?: InputMaybe<Profile_Order_By>;
  contactProfileId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  deliveryType?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  go1Integration?: InputMaybe<Order_By>;
  gradingConfirmed?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  level?: InputMaybe<Order_By>;
  max_participants?: InputMaybe<Order_By>;
  min_participants?: InputMaybe<Order_By>;
  modules_aggregate?: InputMaybe<Course_Module_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organization_id?: InputMaybe<Order_By>;
  participants_aggregate?: InputMaybe<Course_Participant_Aggregate_Order_By>;
  reaccreditation?: InputMaybe<Order_By>;
  schedule_aggregate?: InputMaybe<Course_Schedule_Aggregate_Order_By>;
  status?: InputMaybe<Order_By>;
  trainers_aggregate?: InputMaybe<Course_Trainer_Aggregate_Order_By>;
  type?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** columns and relationships of "course_participant" */
export type Course_Participant = {
  __typename?: 'course_participant';
  attended?: Maybe<Scalars['Boolean']>;
  bookingDate?: Maybe<Scalars['timestamptz']>;
  /** An object relationship */
  certificate?: Maybe<Course_Certificate>;
  /** An array relationship */
  certificateChanges: Array<Course_Certificate_Changelog>;
  /** An aggregate relationship */
  certificateChanges_aggregate: Course_Certificate_Changelog_Aggregate;
  certificate_id?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  course: Course;
  course_id: Scalars['Int'];
  created_at?: Maybe<Scalars['timestamptz']>;
  dateGraded?: Maybe<Scalars['timestamptz']>;
  go1EnrolmentId?: Maybe<Scalars['Int']>;
  go1EnrolmentStatus?: Maybe<Blended_Learning_Status_Enum>;
  grade?: Maybe<Grade_Enum>;
  /** An array relationship */
  gradingModules: Array<Course_Participant_Module>;
  /** An aggregate relationship */
  gradingModules_aggregate: Course_Participant_Module_Aggregate;
  grading_feedback?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  /** An object relationship */
  invite?: Maybe<Course_Invites>;
  invite_id?: Maybe<Scalars['uuid']>;
  invoiceID?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  profile: Profile;
  profile_id: Scalars['uuid'];
  registration_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};


/** columns and relationships of "course_participant" */
export type Course_ParticipantCertificateChangesArgs = {
  distinct_on?: InputMaybe<Array<Course_Certificate_Changelog_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Certificate_Changelog_Order_By>>;
  where?: InputMaybe<Course_Certificate_Changelog_Bool_Exp>;
};


/** columns and relationships of "course_participant" */
export type Course_ParticipantCertificateChanges_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Certificate_Changelog_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Certificate_Changelog_Order_By>>;
  where?: InputMaybe<Course_Certificate_Changelog_Bool_Exp>;
};


/** columns and relationships of "course_participant" */
export type Course_ParticipantGradingModulesArgs = {
  distinct_on?: InputMaybe<Array<Course_Participant_Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Participant_Module_Order_By>>;
  where?: InputMaybe<Course_Participant_Module_Bool_Exp>;
};


/** columns and relationships of "course_participant" */
export type Course_ParticipantGradingModules_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Participant_Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Participant_Module_Order_By>>;
  where?: InputMaybe<Course_Participant_Module_Bool_Exp>;
};

/** aggregated selection of "course_participant" */
export type Course_Participant_Aggregate = {
  __typename?: 'course_participant_aggregate';
  aggregate?: Maybe<Course_Participant_Aggregate_Fields>;
  nodes: Array<Course_Participant>;
};

/** aggregate fields of "course_participant" */
export type Course_Participant_Aggregate_Fields = {
  __typename?: 'course_participant_aggregate_fields';
  avg?: Maybe<Course_Participant_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Course_Participant_Max_Fields>;
  min?: Maybe<Course_Participant_Min_Fields>;
  stddev?: Maybe<Course_Participant_Stddev_Fields>;
  stddev_pop?: Maybe<Course_Participant_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Course_Participant_Stddev_Samp_Fields>;
  sum?: Maybe<Course_Participant_Sum_Fields>;
  var_pop?: Maybe<Course_Participant_Var_Pop_Fields>;
  var_samp?: Maybe<Course_Participant_Var_Samp_Fields>;
  variance?: Maybe<Course_Participant_Variance_Fields>;
};


/** aggregate fields of "course_participant" */
export type Course_Participant_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Participant_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "course_participant" */
export type Course_Participant_Aggregate_Order_By = {
  avg?: InputMaybe<Course_Participant_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Course_Participant_Max_Order_By>;
  min?: InputMaybe<Course_Participant_Min_Order_By>;
  stddev?: InputMaybe<Course_Participant_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Course_Participant_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Course_Participant_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Course_Participant_Sum_Order_By>;
  var_pop?: InputMaybe<Course_Participant_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Course_Participant_Var_Samp_Order_By>;
  variance?: InputMaybe<Course_Participant_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "course_participant" */
export type Course_Participant_Arr_Rel_Insert_Input = {
  data: Array<Course_Participant_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Course_Participant_On_Conflict>;
};

/** aggregate avg on columns */
export type Course_Participant_Avg_Fields = {
  __typename?: 'course_participant_avg_fields';
  course_id?: Maybe<Scalars['Float']>;
  go1EnrolmentId?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "course_participant" */
export type Course_Participant_Avg_Order_By = {
  course_id?: InputMaybe<Order_By>;
  go1EnrolmentId?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "course_participant". All fields are combined with a logical 'AND'. */
export type Course_Participant_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Participant_Bool_Exp>>;
  _not?: InputMaybe<Course_Participant_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Participant_Bool_Exp>>;
  attended?: InputMaybe<Boolean_Comparison_Exp>;
  bookingDate?: InputMaybe<Timestamptz_Comparison_Exp>;
  certificate?: InputMaybe<Course_Certificate_Bool_Exp>;
  certificateChanges?: InputMaybe<Course_Certificate_Changelog_Bool_Exp>;
  certificate_id?: InputMaybe<Uuid_Comparison_Exp>;
  course?: InputMaybe<Course_Bool_Exp>;
  course_id?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  dateGraded?: InputMaybe<Timestamptz_Comparison_Exp>;
  go1EnrolmentId?: InputMaybe<Int_Comparison_Exp>;
  go1EnrolmentStatus?: InputMaybe<Blended_Learning_Status_Enum_Comparison_Exp>;
  grade?: InputMaybe<Grade_Enum_Comparison_Exp>;
  gradingModules?: InputMaybe<Course_Participant_Module_Bool_Exp>;
  grading_feedback?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  invite?: InputMaybe<Course_Invites_Bool_Exp>;
  invite_id?: InputMaybe<Uuid_Comparison_Exp>;
  invoiceID?: InputMaybe<Uuid_Comparison_Exp>;
  profile?: InputMaybe<Profile_Bool_Exp>;
  profile_id?: InputMaybe<Uuid_Comparison_Exp>;
  registration_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_participant" */
export enum Course_Participant_Constraint {
  /** unique or primary key constraint */
  CourseParticipantPkey = 'course_participant_pkey'
}

/** input type for incrementing numeric columns in table "course_participant" */
export type Course_Participant_Inc_Input = {
  course_id?: InputMaybe<Scalars['Int']>;
  go1EnrolmentId?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "course_participant" */
export type Course_Participant_Insert_Input = {
  attended?: InputMaybe<Scalars['Boolean']>;
  bookingDate?: InputMaybe<Scalars['timestamptz']>;
  certificate?: InputMaybe<Course_Certificate_Obj_Rel_Insert_Input>;
  certificateChanges?: InputMaybe<Course_Certificate_Changelog_Arr_Rel_Insert_Input>;
  certificate_id?: InputMaybe<Scalars['uuid']>;
  course?: InputMaybe<Course_Obj_Rel_Insert_Input>;
  course_id?: InputMaybe<Scalars['Int']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  dateGraded?: InputMaybe<Scalars['timestamptz']>;
  go1EnrolmentId?: InputMaybe<Scalars['Int']>;
  go1EnrolmentStatus?: InputMaybe<Blended_Learning_Status_Enum>;
  grade?: InputMaybe<Grade_Enum>;
  gradingModules?: InputMaybe<Course_Participant_Module_Arr_Rel_Insert_Input>;
  grading_feedback?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  invite?: InputMaybe<Course_Invites_Obj_Rel_Insert_Input>;
  invite_id?: InputMaybe<Scalars['uuid']>;
  invoiceID?: InputMaybe<Scalars['uuid']>;
  profile?: InputMaybe<Profile_Obj_Rel_Insert_Input>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  registration_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Course_Participant_Max_Fields = {
  __typename?: 'course_participant_max_fields';
  bookingDate?: Maybe<Scalars['timestamptz']>;
  certificate_id?: Maybe<Scalars['uuid']>;
  course_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  dateGraded?: Maybe<Scalars['timestamptz']>;
  go1EnrolmentId?: Maybe<Scalars['Int']>;
  grading_feedback?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  invite_id?: Maybe<Scalars['uuid']>;
  invoiceID?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
  registration_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "course_participant" */
export type Course_Participant_Max_Order_By = {
  bookingDate?: InputMaybe<Order_By>;
  certificate_id?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  dateGraded?: InputMaybe<Order_By>;
  go1EnrolmentId?: InputMaybe<Order_By>;
  grading_feedback?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invite_id?: InputMaybe<Order_By>;
  invoiceID?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
  registration_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Course_Participant_Min_Fields = {
  __typename?: 'course_participant_min_fields';
  bookingDate?: Maybe<Scalars['timestamptz']>;
  certificate_id?: Maybe<Scalars['uuid']>;
  course_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  dateGraded?: Maybe<Scalars['timestamptz']>;
  go1EnrolmentId?: Maybe<Scalars['Int']>;
  grading_feedback?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  invite_id?: Maybe<Scalars['uuid']>;
  invoiceID?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
  registration_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "course_participant" */
export type Course_Participant_Min_Order_By = {
  bookingDate?: InputMaybe<Order_By>;
  certificate_id?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  dateGraded?: InputMaybe<Order_By>;
  go1EnrolmentId?: InputMaybe<Order_By>;
  grading_feedback?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invite_id?: InputMaybe<Order_By>;
  invoiceID?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
  registration_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Course modules that course participant completed */
export type Course_Participant_Module = {
  __typename?: 'course_participant_module';
  completed: Scalars['Boolean'];
  /** An object relationship */
  course_participant: Course_Participant;
  course_participant_id: Scalars['uuid'];
  id: Scalars['uuid'];
  /** An object relationship */
  module: Module;
  module_id: Scalars['uuid'];
};

/** aggregated selection of "course_participant_module" */
export type Course_Participant_Module_Aggregate = {
  __typename?: 'course_participant_module_aggregate';
  aggregate?: Maybe<Course_Participant_Module_Aggregate_Fields>;
  nodes: Array<Course_Participant_Module>;
};

/** aggregate fields of "course_participant_module" */
export type Course_Participant_Module_Aggregate_Fields = {
  __typename?: 'course_participant_module_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Course_Participant_Module_Max_Fields>;
  min?: Maybe<Course_Participant_Module_Min_Fields>;
};


/** aggregate fields of "course_participant_module" */
export type Course_Participant_Module_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Participant_Module_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "course_participant_module" */
export type Course_Participant_Module_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Course_Participant_Module_Max_Order_By>;
  min?: InputMaybe<Course_Participant_Module_Min_Order_By>;
};

/** input type for inserting array relation for remote table "course_participant_module" */
export type Course_Participant_Module_Arr_Rel_Insert_Input = {
  data: Array<Course_Participant_Module_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Course_Participant_Module_On_Conflict>;
};

/** Boolean expression to filter rows from the table "course_participant_module". All fields are combined with a logical 'AND'. */
export type Course_Participant_Module_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Participant_Module_Bool_Exp>>;
  _not?: InputMaybe<Course_Participant_Module_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Participant_Module_Bool_Exp>>;
  completed?: InputMaybe<Boolean_Comparison_Exp>;
  course_participant?: InputMaybe<Course_Participant_Bool_Exp>;
  course_participant_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  module?: InputMaybe<Module_Bool_Exp>;
  module_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_participant_module" */
export enum Course_Participant_Module_Constraint {
  /** unique or primary key constraint */
  CourseParticipantModuleCourseParticipantIdModuleIdKey = 'course_participant_module_course_participant_id_module_id_key',
  /** unique or primary key constraint */
  CourseParticipantModulePkey = 'course_participant_module_pkey'
}

/** input type for inserting data into table "course_participant_module" */
export type Course_Participant_Module_Insert_Input = {
  completed?: InputMaybe<Scalars['Boolean']>;
  course_participant?: InputMaybe<Course_Participant_Obj_Rel_Insert_Input>;
  course_participant_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  module?: InputMaybe<Module_Obj_Rel_Insert_Input>;
  module_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Course_Participant_Module_Max_Fields = {
  __typename?: 'course_participant_module_max_fields';
  course_participant_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  module_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "course_participant_module" */
export type Course_Participant_Module_Max_Order_By = {
  course_participant_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  module_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Course_Participant_Module_Min_Fields = {
  __typename?: 'course_participant_module_min_fields';
  course_participant_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  module_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "course_participant_module" */
export type Course_Participant_Module_Min_Order_By = {
  course_participant_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  module_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "course_participant_module" */
export type Course_Participant_Module_Mutation_Response = {
  __typename?: 'course_participant_module_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Participant_Module>;
};

/** on_conflict condition type for table "course_participant_module" */
export type Course_Participant_Module_On_Conflict = {
  constraint: Course_Participant_Module_Constraint;
  update_columns?: Array<Course_Participant_Module_Update_Column>;
  where?: InputMaybe<Course_Participant_Module_Bool_Exp>;
};

/** Ordering options when selecting data from "course_participant_module". */
export type Course_Participant_Module_Order_By = {
  completed?: InputMaybe<Order_By>;
  course_participant?: InputMaybe<Course_Participant_Order_By>;
  course_participant_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  module?: InputMaybe<Module_Order_By>;
  module_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_participant_module */
export type Course_Participant_Module_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "course_participant_module" */
export enum Course_Participant_Module_Select_Column {
  /** column name */
  Completed = 'completed',
  /** column name */
  CourseParticipantId = 'course_participant_id',
  /** column name */
  Id = 'id',
  /** column name */
  ModuleId = 'module_id'
}

/** input type for updating data in table "course_participant_module" */
export type Course_Participant_Module_Set_Input = {
  completed?: InputMaybe<Scalars['Boolean']>;
  course_participant_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  module_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "course_participant_module" */
export enum Course_Participant_Module_Update_Column {
  /** column name */
  Completed = 'completed',
  /** column name */
  CourseParticipantId = 'course_participant_id',
  /** column name */
  Id = 'id',
  /** column name */
  ModuleId = 'module_id'
}

/** response of any mutation on the table "course_participant" */
export type Course_Participant_Mutation_Response = {
  __typename?: 'course_participant_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Participant>;
};

/** input type for inserting object relation for remote table "course_participant" */
export type Course_Participant_Obj_Rel_Insert_Input = {
  data: Course_Participant_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Course_Participant_On_Conflict>;
};

/** on_conflict condition type for table "course_participant" */
export type Course_Participant_On_Conflict = {
  constraint: Course_Participant_Constraint;
  update_columns?: Array<Course_Participant_Update_Column>;
  where?: InputMaybe<Course_Participant_Bool_Exp>;
};

/** Ordering options when selecting data from "course_participant". */
export type Course_Participant_Order_By = {
  attended?: InputMaybe<Order_By>;
  bookingDate?: InputMaybe<Order_By>;
  certificate?: InputMaybe<Course_Certificate_Order_By>;
  certificateChanges_aggregate?: InputMaybe<Course_Certificate_Changelog_Aggregate_Order_By>;
  certificate_id?: InputMaybe<Order_By>;
  course?: InputMaybe<Course_Order_By>;
  course_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  dateGraded?: InputMaybe<Order_By>;
  go1EnrolmentId?: InputMaybe<Order_By>;
  go1EnrolmentStatus?: InputMaybe<Order_By>;
  grade?: InputMaybe<Order_By>;
  gradingModules_aggregate?: InputMaybe<Course_Participant_Module_Aggregate_Order_By>;
  grading_feedback?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invite?: InputMaybe<Course_Invites_Order_By>;
  invite_id?: InputMaybe<Order_By>;
  invoiceID?: InputMaybe<Order_By>;
  profile?: InputMaybe<Profile_Order_By>;
  profile_id?: InputMaybe<Order_By>;
  registration_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_participant */
export type Course_Participant_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "course_participant" */
export enum Course_Participant_Select_Column {
  /** column name */
  Attended = 'attended',
  /** column name */
  BookingDate = 'bookingDate',
  /** column name */
  CertificateId = 'certificate_id',
  /** column name */
  CourseId = 'course_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DateGraded = 'dateGraded',
  /** column name */
  Go1EnrolmentId = 'go1EnrolmentId',
  /** column name */
  Go1EnrolmentStatus = 'go1EnrolmentStatus',
  /** column name */
  Grade = 'grade',
  /** column name */
  GradingFeedback = 'grading_feedback',
  /** column name */
  Id = 'id',
  /** column name */
  InviteId = 'invite_id',
  /** column name */
  InvoiceId = 'invoiceID',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  RegistrationId = 'registration_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "course_participant" */
export type Course_Participant_Set_Input = {
  attended?: InputMaybe<Scalars['Boolean']>;
  bookingDate?: InputMaybe<Scalars['timestamptz']>;
  certificate_id?: InputMaybe<Scalars['uuid']>;
  course_id?: InputMaybe<Scalars['Int']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  dateGraded?: InputMaybe<Scalars['timestamptz']>;
  go1EnrolmentId?: InputMaybe<Scalars['Int']>;
  go1EnrolmentStatus?: InputMaybe<Blended_Learning_Status_Enum>;
  grade?: InputMaybe<Grade_Enum>;
  grading_feedback?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  invite_id?: InputMaybe<Scalars['uuid']>;
  invoiceID?: InputMaybe<Scalars['uuid']>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  registration_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Course_Participant_Stddev_Fields = {
  __typename?: 'course_participant_stddev_fields';
  course_id?: Maybe<Scalars['Float']>;
  go1EnrolmentId?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "course_participant" */
export type Course_Participant_Stddev_Order_By = {
  course_id?: InputMaybe<Order_By>;
  go1EnrolmentId?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Course_Participant_Stddev_Pop_Fields = {
  __typename?: 'course_participant_stddev_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
  go1EnrolmentId?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "course_participant" */
export type Course_Participant_Stddev_Pop_Order_By = {
  course_id?: InputMaybe<Order_By>;
  go1EnrolmentId?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Course_Participant_Stddev_Samp_Fields = {
  __typename?: 'course_participant_stddev_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
  go1EnrolmentId?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "course_participant" */
export type Course_Participant_Stddev_Samp_Order_By = {
  course_id?: InputMaybe<Order_By>;
  go1EnrolmentId?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Course_Participant_Sum_Fields = {
  __typename?: 'course_participant_sum_fields';
  course_id?: Maybe<Scalars['Int']>;
  go1EnrolmentId?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "course_participant" */
export type Course_Participant_Sum_Order_By = {
  course_id?: InputMaybe<Order_By>;
  go1EnrolmentId?: InputMaybe<Order_By>;
};

/** update columns of table "course_participant" */
export enum Course_Participant_Update_Column {
  /** column name */
  Attended = 'attended',
  /** column name */
  BookingDate = 'bookingDate',
  /** column name */
  CertificateId = 'certificate_id',
  /** column name */
  CourseId = 'course_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DateGraded = 'dateGraded',
  /** column name */
  Go1EnrolmentId = 'go1EnrolmentId',
  /** column name */
  Go1EnrolmentStatus = 'go1EnrolmentStatus',
  /** column name */
  Grade = 'grade',
  /** column name */
  GradingFeedback = 'grading_feedback',
  /** column name */
  Id = 'id',
  /** column name */
  InviteId = 'invite_id',
  /** column name */
  InvoiceId = 'invoiceID',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  RegistrationId = 'registration_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Course_Participant_Var_Pop_Fields = {
  __typename?: 'course_participant_var_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
  go1EnrolmentId?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "course_participant" */
export type Course_Participant_Var_Pop_Order_By = {
  course_id?: InputMaybe<Order_By>;
  go1EnrolmentId?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Course_Participant_Var_Samp_Fields = {
  __typename?: 'course_participant_var_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
  go1EnrolmentId?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "course_participant" */
export type Course_Participant_Var_Samp_Order_By = {
  course_id?: InputMaybe<Order_By>;
  go1EnrolmentId?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Course_Participant_Variance_Fields = {
  __typename?: 'course_participant_variance_fields';
  course_id?: Maybe<Scalars['Float']>;
  go1EnrolmentId?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "course_participant" */
export type Course_Participant_Variance_Order_By = {
  course_id?: InputMaybe<Order_By>;
  go1EnrolmentId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course */
export type Course_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** columns and relationships of "course_schedule" */
export type Course_Schedule = {
  __typename?: 'course_schedule';
  /** An object relationship */
  course: Course;
  course_id: Scalars['Int'];
  createdAt: Scalars['timestamptz'];
  end: Scalars['timestamptz'];
  id: Scalars['uuid'];
  start: Scalars['timestamptz'];
  updatedAt: Scalars['timestamptz'];
  /** An object relationship */
  venue?: Maybe<Venue>;
  venue_id?: Maybe<Scalars['uuid']>;
  virtualLink?: Maybe<Scalars['String']>;
};

/** aggregated selection of "course_schedule" */
export type Course_Schedule_Aggregate = {
  __typename?: 'course_schedule_aggregate';
  aggregate?: Maybe<Course_Schedule_Aggregate_Fields>;
  nodes: Array<Course_Schedule>;
};

/** aggregate fields of "course_schedule" */
export type Course_Schedule_Aggregate_Fields = {
  __typename?: 'course_schedule_aggregate_fields';
  avg?: Maybe<Course_Schedule_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Course_Schedule_Max_Fields>;
  min?: Maybe<Course_Schedule_Min_Fields>;
  stddev?: Maybe<Course_Schedule_Stddev_Fields>;
  stddev_pop?: Maybe<Course_Schedule_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Course_Schedule_Stddev_Samp_Fields>;
  sum?: Maybe<Course_Schedule_Sum_Fields>;
  var_pop?: Maybe<Course_Schedule_Var_Pop_Fields>;
  var_samp?: Maybe<Course_Schedule_Var_Samp_Fields>;
  variance?: Maybe<Course_Schedule_Variance_Fields>;
};


/** aggregate fields of "course_schedule" */
export type Course_Schedule_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Schedule_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "course_schedule" */
export type Course_Schedule_Aggregate_Order_By = {
  avg?: InputMaybe<Course_Schedule_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Course_Schedule_Max_Order_By>;
  min?: InputMaybe<Course_Schedule_Min_Order_By>;
  stddev?: InputMaybe<Course_Schedule_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Course_Schedule_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Course_Schedule_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Course_Schedule_Sum_Order_By>;
  var_pop?: InputMaybe<Course_Schedule_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Course_Schedule_Var_Samp_Order_By>;
  variance?: InputMaybe<Course_Schedule_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "course_schedule" */
export type Course_Schedule_Arr_Rel_Insert_Input = {
  data: Array<Course_Schedule_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Course_Schedule_On_Conflict>;
};

/** aggregate avg on columns */
export type Course_Schedule_Avg_Fields = {
  __typename?: 'course_schedule_avg_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "course_schedule" */
export type Course_Schedule_Avg_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "course_schedule". All fields are combined with a logical 'AND'. */
export type Course_Schedule_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Schedule_Bool_Exp>>;
  _not?: InputMaybe<Course_Schedule_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Schedule_Bool_Exp>>;
  course?: InputMaybe<Course_Bool_Exp>;
  course_id?: InputMaybe<Int_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  end?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  start?: InputMaybe<Timestamptz_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  venue?: InputMaybe<Venue_Bool_Exp>;
  venue_id?: InputMaybe<Uuid_Comparison_Exp>;
  virtualLink?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_schedule" */
export enum Course_Schedule_Constraint {
  /** unique or primary key constraint */
  CourseSchedulePkey = 'course_schedule_pkey'
}

/** input type for incrementing numeric columns in table "course_schedule" */
export type Course_Schedule_Inc_Input = {
  course_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "course_schedule" */
export type Course_Schedule_Insert_Input = {
  course?: InputMaybe<Course_Obj_Rel_Insert_Input>;
  course_id?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  end?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  start?: InputMaybe<Scalars['timestamptz']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  venue?: InputMaybe<Venue_Obj_Rel_Insert_Input>;
  venue_id?: InputMaybe<Scalars['uuid']>;
  virtualLink?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Course_Schedule_Max_Fields = {
  __typename?: 'course_schedule_max_fields';
  course_id?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  end?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  start?: Maybe<Scalars['timestamptz']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  venue_id?: Maybe<Scalars['uuid']>;
  virtualLink?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "course_schedule" */
export type Course_Schedule_Max_Order_By = {
  course_id?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  venue_id?: InputMaybe<Order_By>;
  virtualLink?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Course_Schedule_Min_Fields = {
  __typename?: 'course_schedule_min_fields';
  course_id?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  end?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  start?: Maybe<Scalars['timestamptz']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  venue_id?: Maybe<Scalars['uuid']>;
  virtualLink?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "course_schedule" */
export type Course_Schedule_Min_Order_By = {
  course_id?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  venue_id?: InputMaybe<Order_By>;
  virtualLink?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "course_schedule" */
export type Course_Schedule_Mutation_Response = {
  __typename?: 'course_schedule_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Schedule>;
};

/** on_conflict condition type for table "course_schedule" */
export type Course_Schedule_On_Conflict = {
  constraint: Course_Schedule_Constraint;
  update_columns?: Array<Course_Schedule_Update_Column>;
  where?: InputMaybe<Course_Schedule_Bool_Exp>;
};

/** Ordering options when selecting data from "course_schedule". */
export type Course_Schedule_Order_By = {
  course?: InputMaybe<Course_Order_By>;
  course_id?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  venue?: InputMaybe<Venue_Order_By>;
  venue_id?: InputMaybe<Order_By>;
  virtualLink?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_schedule */
export type Course_Schedule_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "course_schedule" */
export enum Course_Schedule_Select_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  End = 'end',
  /** column name */
  Id = 'id',
  /** column name */
  Start = 'start',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  VenueId = 'venue_id',
  /** column name */
  VirtualLink = 'virtualLink'
}

/** input type for updating data in table "course_schedule" */
export type Course_Schedule_Set_Input = {
  course_id?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  end?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  start?: InputMaybe<Scalars['timestamptz']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  venue_id?: InputMaybe<Scalars['uuid']>;
  virtualLink?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Course_Schedule_Stddev_Fields = {
  __typename?: 'course_schedule_stddev_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "course_schedule" */
export type Course_Schedule_Stddev_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Course_Schedule_Stddev_Pop_Fields = {
  __typename?: 'course_schedule_stddev_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "course_schedule" */
export type Course_Schedule_Stddev_Pop_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Course_Schedule_Stddev_Samp_Fields = {
  __typename?: 'course_schedule_stddev_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "course_schedule" */
export type Course_Schedule_Stddev_Samp_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Course_Schedule_Sum_Fields = {
  __typename?: 'course_schedule_sum_fields';
  course_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "course_schedule" */
export type Course_Schedule_Sum_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** update columns of table "course_schedule" */
export enum Course_Schedule_Update_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  End = 'end',
  /** column name */
  Id = 'id',
  /** column name */
  Start = 'start',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  VenueId = 'venue_id',
  /** column name */
  VirtualLink = 'virtualLink'
}

/** aggregate var_pop on columns */
export type Course_Schedule_Var_Pop_Fields = {
  __typename?: 'course_schedule_var_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "course_schedule" */
export type Course_Schedule_Var_Pop_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Course_Schedule_Var_Samp_Fields = {
  __typename?: 'course_schedule_var_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "course_schedule" */
export type Course_Schedule_Var_Samp_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Course_Schedule_Variance_Fields = {
  __typename?: 'course_schedule_variance_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "course_schedule" */
export type Course_Schedule_Variance_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** select columns of table "course" */
export enum Course_Select_Column {
  /** column name */
  AolCostOfCourse = 'aolCostOfCourse',
  /** column name */
  ContactProfileId = 'contactProfileId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeliveryType = 'deliveryType',
  /** column name */
  Description = 'description',
  /** column name */
  Go1Integration = 'go1Integration',
  /** column name */
  GradingConfirmed = 'gradingConfirmed',
  /** column name */
  Id = 'id',
  /** column name */
  Level = 'level',
  /** column name */
  MaxParticipants = 'max_participants',
  /** column name */
  MinParticipants = 'min_participants',
  /** column name */
  Name = 'name',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  Reaccreditation = 'reaccreditation',
  /** column name */
  Status = 'status',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "course" */
export type Course_Set_Input = {
  aolCostOfCourse?: InputMaybe<Scalars['numeric']>;
  contactProfileId?: InputMaybe<Scalars['uuid']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  deliveryType?: InputMaybe<Course_Delivery_Type_Enum>;
  description?: InputMaybe<Scalars['String']>;
  go1Integration?: InputMaybe<Scalars['Boolean']>;
  gradingConfirmed?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['Int']>;
  level?: InputMaybe<Course_Level_Enum>;
  max_participants?: InputMaybe<Scalars['Int']>;
  min_participants?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  organization_id?: InputMaybe<Scalars['uuid']>;
  reaccreditation?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<Course_Status_Enum>;
  type?: InputMaybe<Course_Type_Enum>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** columns and relationships of "course_status" */
export type Course_Status = {
  __typename?: 'course_status';
  name: Scalars['String'];
};

/** aggregated selection of "course_status" */
export type Course_Status_Aggregate = {
  __typename?: 'course_status_aggregate';
  aggregate?: Maybe<Course_Status_Aggregate_Fields>;
  nodes: Array<Course_Status>;
};

/** aggregate fields of "course_status" */
export type Course_Status_Aggregate_Fields = {
  __typename?: 'course_status_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Course_Status_Max_Fields>;
  min?: Maybe<Course_Status_Min_Fields>;
};


/** aggregate fields of "course_status" */
export type Course_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "course_status". All fields are combined with a logical 'AND'. */
export type Course_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Status_Bool_Exp>>;
  _not?: InputMaybe<Course_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Status_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_status" */
export enum Course_Status_Constraint {
  /** unique or primary key constraint */
  CourseStatusPkey = 'course_status_pkey'
}

export enum Course_Status_Enum {
  Draft = 'DRAFT',
  Pending = 'PENDING',
  Published = 'PUBLISHED'
}

/** Boolean expression to compare columns of type "course_status_enum". All fields are combined with logical 'AND'. */
export type Course_Status_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Course_Status_Enum>;
  _in?: InputMaybe<Array<Course_Status_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Course_Status_Enum>;
  _nin?: InputMaybe<Array<Course_Status_Enum>>;
};

/** input type for inserting data into table "course_status" */
export type Course_Status_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Course_Status_Max_Fields = {
  __typename?: 'course_status_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Course_Status_Min_Fields = {
  __typename?: 'course_status_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "course_status" */
export type Course_Status_Mutation_Response = {
  __typename?: 'course_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Status>;
};

/** on_conflict condition type for table "course_status" */
export type Course_Status_On_Conflict = {
  constraint: Course_Status_Constraint;
  update_columns?: Array<Course_Status_Update_Column>;
  where?: InputMaybe<Course_Status_Bool_Exp>;
};

/** Ordering options when selecting data from "course_status". */
export type Course_Status_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_status */
export type Course_Status_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "course_status" */
export enum Course_Status_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "course_status" */
export type Course_Status_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "course_status" */
export enum Course_Status_Update_Column {
  /** column name */
  Name = 'name'
}

/** aggregate stddev on columns */
export type Course_Stddev_Fields = {
  __typename?: 'course_stddev_fields';
  aolCostOfCourse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  max_participants?: Maybe<Scalars['Float']>;
  min_participants?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Course_Stddev_Pop_Fields = {
  __typename?: 'course_stddev_pop_fields';
  aolCostOfCourse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  max_participants?: Maybe<Scalars['Float']>;
  min_participants?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Course_Stddev_Samp_Fields = {
  __typename?: 'course_stddev_samp_fields';
  aolCostOfCourse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  max_participants?: Maybe<Scalars['Float']>;
  min_participants?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Course_Sum_Fields = {
  __typename?: 'course_sum_fields';
  aolCostOfCourse?: Maybe<Scalars['numeric']>;
  id?: Maybe<Scalars['Int']>;
  max_participants?: Maybe<Scalars['Int']>;
  min_participants?: Maybe<Scalars['Int']>;
};

/** columns and relationships of "course_trainer" */
export type Course_Trainer = {
  __typename?: 'course_trainer';
  /** An object relationship */
  course: Course;
  course_id: Scalars['Int'];
  id: Scalars['uuid'];
  /** An object relationship */
  profile: Profile;
  profile_id: Scalars['uuid'];
  status?: Maybe<Course_Invite_Status_Enum>;
  type: Course_Trainer_Type_Enum;
};

/** aggregated selection of "course_trainer" */
export type Course_Trainer_Aggregate = {
  __typename?: 'course_trainer_aggregate';
  aggregate?: Maybe<Course_Trainer_Aggregate_Fields>;
  nodes: Array<Course_Trainer>;
};

/** aggregate fields of "course_trainer" */
export type Course_Trainer_Aggregate_Fields = {
  __typename?: 'course_trainer_aggregate_fields';
  avg?: Maybe<Course_Trainer_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Course_Trainer_Max_Fields>;
  min?: Maybe<Course_Trainer_Min_Fields>;
  stddev?: Maybe<Course_Trainer_Stddev_Fields>;
  stddev_pop?: Maybe<Course_Trainer_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Course_Trainer_Stddev_Samp_Fields>;
  sum?: Maybe<Course_Trainer_Sum_Fields>;
  var_pop?: Maybe<Course_Trainer_Var_Pop_Fields>;
  var_samp?: Maybe<Course_Trainer_Var_Samp_Fields>;
  variance?: Maybe<Course_Trainer_Variance_Fields>;
};


/** aggregate fields of "course_trainer" */
export type Course_Trainer_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Trainer_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "course_trainer" */
export type Course_Trainer_Aggregate_Order_By = {
  avg?: InputMaybe<Course_Trainer_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Course_Trainer_Max_Order_By>;
  min?: InputMaybe<Course_Trainer_Min_Order_By>;
  stddev?: InputMaybe<Course_Trainer_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Course_Trainer_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Course_Trainer_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Course_Trainer_Sum_Order_By>;
  var_pop?: InputMaybe<Course_Trainer_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Course_Trainer_Var_Samp_Order_By>;
  variance?: InputMaybe<Course_Trainer_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "course_trainer" */
export type Course_Trainer_Arr_Rel_Insert_Input = {
  data: Array<Course_Trainer_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Course_Trainer_On_Conflict>;
};

/** aggregate avg on columns */
export type Course_Trainer_Avg_Fields = {
  __typename?: 'course_trainer_avg_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "course_trainer" */
export type Course_Trainer_Avg_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "course_trainer". All fields are combined with a logical 'AND'. */
export type Course_Trainer_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Trainer_Bool_Exp>>;
  _not?: InputMaybe<Course_Trainer_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Trainer_Bool_Exp>>;
  course?: InputMaybe<Course_Bool_Exp>;
  course_id?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  profile?: InputMaybe<Profile_Bool_Exp>;
  profile_id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<Course_Invite_Status_Enum_Comparison_Exp>;
  type?: InputMaybe<Course_Trainer_Type_Enum_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_trainer" */
export enum Course_Trainer_Constraint {
  /** unique or primary key constraint */
  CourseLeaderPkey = 'course_leader_pkey',
  /** unique or primary key constraint */
  CourseTrainerCourseIdProfileIdKey = 'course_trainer_course_id_profile_id_key',
  /** unique or primary key constraint */
  CourseTrainerUniqueLeader = 'course_trainer_unique_leader'
}

/** input type for incrementing numeric columns in table "course_trainer" */
export type Course_Trainer_Inc_Input = {
  course_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "course_trainer" */
export type Course_Trainer_Insert_Input = {
  course?: InputMaybe<Course_Obj_Rel_Insert_Input>;
  course_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['uuid']>;
  profile?: InputMaybe<Profile_Obj_Rel_Insert_Input>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  status?: InputMaybe<Course_Invite_Status_Enum>;
  type?: InputMaybe<Course_Trainer_Type_Enum>;
};

/** aggregate max on columns */
export type Course_Trainer_Max_Fields = {
  __typename?: 'course_trainer_max_fields';
  course_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "course_trainer" */
export type Course_Trainer_Max_Order_By = {
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Course_Trainer_Min_Fields = {
  __typename?: 'course_trainer_min_fields';
  course_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "course_trainer" */
export type Course_Trainer_Min_Order_By = {
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "course_trainer" */
export type Course_Trainer_Mutation_Response = {
  __typename?: 'course_trainer_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Trainer>;
};

/** on_conflict condition type for table "course_trainer" */
export type Course_Trainer_On_Conflict = {
  constraint: Course_Trainer_Constraint;
  update_columns?: Array<Course_Trainer_Update_Column>;
  where?: InputMaybe<Course_Trainer_Bool_Exp>;
};

/** Ordering options when selecting data from "course_trainer". */
export type Course_Trainer_Order_By = {
  course?: InputMaybe<Course_Order_By>;
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  profile?: InputMaybe<Profile_Order_By>;
  profile_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_trainer */
export type Course_Trainer_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "course_trainer" */
export enum Course_Trainer_Select_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Id = 'id',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  Status = 'status',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "course_trainer" */
export type Course_Trainer_Set_Input = {
  course_id?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['uuid']>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  status?: InputMaybe<Course_Invite_Status_Enum>;
  type?: InputMaybe<Course_Trainer_Type_Enum>;
};

/** aggregate stddev on columns */
export type Course_Trainer_Stddev_Fields = {
  __typename?: 'course_trainer_stddev_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "course_trainer" */
export type Course_Trainer_Stddev_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Course_Trainer_Stddev_Pop_Fields = {
  __typename?: 'course_trainer_stddev_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "course_trainer" */
export type Course_Trainer_Stddev_Pop_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Course_Trainer_Stddev_Samp_Fields = {
  __typename?: 'course_trainer_stddev_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "course_trainer" */
export type Course_Trainer_Stddev_Samp_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Course_Trainer_Sum_Fields = {
  __typename?: 'course_trainer_sum_fields';
  course_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "course_trainer" */
export type Course_Trainer_Sum_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "course_trainer_type" */
export type Course_Trainer_Type = {
  __typename?: 'course_trainer_type';
  name: Scalars['String'];
};

/** aggregated selection of "course_trainer_type" */
export type Course_Trainer_Type_Aggregate = {
  __typename?: 'course_trainer_type_aggregate';
  aggregate?: Maybe<Course_Trainer_Type_Aggregate_Fields>;
  nodes: Array<Course_Trainer_Type>;
};

/** aggregate fields of "course_trainer_type" */
export type Course_Trainer_Type_Aggregate_Fields = {
  __typename?: 'course_trainer_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Course_Trainer_Type_Max_Fields>;
  min?: Maybe<Course_Trainer_Type_Min_Fields>;
};


/** aggregate fields of "course_trainer_type" */
export type Course_Trainer_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Trainer_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "course_trainer_type". All fields are combined with a logical 'AND'. */
export type Course_Trainer_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Trainer_Type_Bool_Exp>>;
  _not?: InputMaybe<Course_Trainer_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Trainer_Type_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_trainer_type" */
export enum Course_Trainer_Type_Constraint {
  /** unique or primary key constraint */
  CourseTrainerTypePkey = 'course_trainer_type_pkey'
}

export enum Course_Trainer_Type_Enum {
  Assistant = 'ASSISTANT',
  Leader = 'LEADER',
  Moderator = 'MODERATOR'
}

/** Boolean expression to compare columns of type "course_trainer_type_enum". All fields are combined with logical 'AND'. */
export type Course_Trainer_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Course_Trainer_Type_Enum>;
  _in?: InputMaybe<Array<Course_Trainer_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Course_Trainer_Type_Enum>;
  _nin?: InputMaybe<Array<Course_Trainer_Type_Enum>>;
};

/** input type for inserting data into table "course_trainer_type" */
export type Course_Trainer_Type_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Course_Trainer_Type_Max_Fields = {
  __typename?: 'course_trainer_type_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Course_Trainer_Type_Min_Fields = {
  __typename?: 'course_trainer_type_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "course_trainer_type" */
export type Course_Trainer_Type_Mutation_Response = {
  __typename?: 'course_trainer_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Trainer_Type>;
};

/** on_conflict condition type for table "course_trainer_type" */
export type Course_Trainer_Type_On_Conflict = {
  constraint: Course_Trainer_Type_Constraint;
  update_columns?: Array<Course_Trainer_Type_Update_Column>;
  where?: InputMaybe<Course_Trainer_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "course_trainer_type". */
export type Course_Trainer_Type_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_trainer_type */
export type Course_Trainer_Type_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "course_trainer_type" */
export enum Course_Trainer_Type_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "course_trainer_type" */
export type Course_Trainer_Type_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "course_trainer_type" */
export enum Course_Trainer_Type_Update_Column {
  /** column name */
  Name = 'name'
}

/** update columns of table "course_trainer" */
export enum Course_Trainer_Update_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Id = 'id',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  Status = 'status',
  /** column name */
  Type = 'type'
}

/** aggregate var_pop on columns */
export type Course_Trainer_Var_Pop_Fields = {
  __typename?: 'course_trainer_var_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "course_trainer" */
export type Course_Trainer_Var_Pop_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Course_Trainer_Var_Samp_Fields = {
  __typename?: 'course_trainer_var_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "course_trainer" */
export type Course_Trainer_Var_Samp_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Course_Trainer_Variance_Fields = {
  __typename?: 'course_trainer_variance_fields';
  course_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "course_trainer" */
export type Course_Trainer_Variance_Order_By = {
  course_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "course_type" */
export type Course_Type = {
  __typename?: 'course_type';
  name: Scalars['String'];
};

/** aggregated selection of "course_type" */
export type Course_Type_Aggregate = {
  __typename?: 'course_type_aggregate';
  aggregate?: Maybe<Course_Type_Aggregate_Fields>;
  nodes: Array<Course_Type>;
};

/** aggregate fields of "course_type" */
export type Course_Type_Aggregate_Fields = {
  __typename?: 'course_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Course_Type_Max_Fields>;
  min?: Maybe<Course_Type_Min_Fields>;
};


/** aggregate fields of "course_type" */
export type Course_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Course_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "course_type". All fields are combined with a logical 'AND'. */
export type Course_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Type_Bool_Exp>>;
  _not?: InputMaybe<Course_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Type_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_type" */
export enum Course_Type_Constraint {
  /** unique or primary key constraint */
  CourseTypePkey = 'course_type_pkey'
}

export enum Course_Type_Enum {
  Closed = 'CLOSED',
  Indirect = 'INDIRECT',
  Open = 'OPEN'
}

/** Boolean expression to compare columns of type "course_type_enum". All fields are combined with logical 'AND'. */
export type Course_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Course_Type_Enum>;
  _in?: InputMaybe<Array<Course_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Course_Type_Enum>;
  _nin?: InputMaybe<Array<Course_Type_Enum>>;
};

/** input type for inserting data into table "course_type" */
export type Course_Type_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Course_Type_Max_Fields = {
  __typename?: 'course_type_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Course_Type_Min_Fields = {
  __typename?: 'course_type_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "course_type" */
export type Course_Type_Mutation_Response = {
  __typename?: 'course_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Course_Type>;
};

/** on_conflict condition type for table "course_type" */
export type Course_Type_On_Conflict = {
  constraint: Course_Type_Constraint;
  update_columns?: Array<Course_Type_Update_Column>;
  where?: InputMaybe<Course_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "course_type". */
export type Course_Type_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_type */
export type Course_Type_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "course_type" */
export enum Course_Type_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "course_type" */
export type Course_Type_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "course_type" */
export enum Course_Type_Update_Column {
  /** column name */
  Name = 'name'
}

/** update columns of table "course" */
export enum Course_Update_Column {
  /** column name */
  AolCostOfCourse = 'aolCostOfCourse',
  /** column name */
  ContactProfileId = 'contactProfileId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeliveryType = 'deliveryType',
  /** column name */
  Description = 'description',
  /** column name */
  Go1Integration = 'go1Integration',
  /** column name */
  GradingConfirmed = 'gradingConfirmed',
  /** column name */
  Id = 'id',
  /** column name */
  Level = 'level',
  /** column name */
  MaxParticipants = 'max_participants',
  /** column name */
  MinParticipants = 'min_participants',
  /** column name */
  Name = 'name',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  Reaccreditation = 'reaccreditation',
  /** column name */
  Status = 'status',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** aggregate var_pop on columns */
export type Course_Var_Pop_Fields = {
  __typename?: 'course_var_pop_fields';
  aolCostOfCourse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  max_participants?: Maybe<Scalars['Float']>;
  min_participants?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Course_Var_Samp_Fields = {
  __typename?: 'course_var_samp_fields';
  aolCostOfCourse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  max_participants?: Maybe<Scalars['Float']>;
  min_participants?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Course_Variance_Fields = {
  __typename?: 'course_variance_fields';
  aolCostOfCourse?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  max_participants?: Maybe<Scalars['Float']>;
  min_participants?: Maybe<Scalars['Float']>;
};

export type CreateSubscriptionOutput = {
  __typename?: 'createSubscriptionOutput';
  clientSecret: Scalars['String'];
  subscriptionId: Scalars['String'];
};

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['date']>;
  _gt?: InputMaybe<Scalars['date']>;
  _gte?: InputMaybe<Scalars['date']>;
  _in?: InputMaybe<Array<Scalars['date']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['date']>;
  _lte?: InputMaybe<Scalars['date']>;
  _neq?: InputMaybe<Scalars['date']>;
  _nin?: InputMaybe<Array<Scalars['date']>>;
};

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['float8']>;
  _gt?: InputMaybe<Scalars['float8']>;
  _gte?: InputMaybe<Scalars['float8']>;
  _in?: InputMaybe<Array<Scalars['float8']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['float8']>;
  _lte?: InputMaybe<Scalars['float8']>;
  _neq?: InputMaybe<Scalars['float8']>;
  _nin?: InputMaybe<Array<Scalars['float8']>>;
};

/** Enum table for possible course grades */
export type Grade = {
  __typename?: 'grade';
  name: Scalars['String'];
};

/** aggregated selection of "grade" */
export type Grade_Aggregate = {
  __typename?: 'grade_aggregate';
  aggregate?: Maybe<Grade_Aggregate_Fields>;
  nodes: Array<Grade>;
};

/** aggregate fields of "grade" */
export type Grade_Aggregate_Fields = {
  __typename?: 'grade_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Grade_Max_Fields>;
  min?: Maybe<Grade_Min_Fields>;
};


/** aggregate fields of "grade" */
export type Grade_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Grade_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "grade". All fields are combined with a logical 'AND'. */
export type Grade_Bool_Exp = {
  _and?: InputMaybe<Array<Grade_Bool_Exp>>;
  _not?: InputMaybe<Grade_Bool_Exp>;
  _or?: InputMaybe<Array<Grade_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "grade" */
export enum Grade_Constraint {
  /** unique or primary key constraint */
  GradePkey = 'grade_pkey'
}

export enum Grade_Enum {
  AssistOnly = 'ASSIST_ONLY',
  Fail = 'FAIL',
  ObserveOnly = 'OBSERVE_ONLY',
  Pass = 'PASS'
}

/** Boolean expression to compare columns of type "grade_enum". All fields are combined with logical 'AND'. */
export type Grade_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Grade_Enum>;
  _in?: InputMaybe<Array<Grade_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Grade_Enum>;
  _nin?: InputMaybe<Array<Grade_Enum>>;
};

/** input type for inserting data into table "grade" */
export type Grade_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Grade_Max_Fields = {
  __typename?: 'grade_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Grade_Min_Fields = {
  __typename?: 'grade_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "grade" */
export type Grade_Mutation_Response = {
  __typename?: 'grade_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Grade>;
};

/** on_conflict condition type for table "grade" */
export type Grade_On_Conflict = {
  constraint: Grade_Constraint;
  update_columns?: Array<Grade_Update_Column>;
  where?: InputMaybe<Grade_Bool_Exp>;
};

/** Ordering options when selecting data from "grade". */
export type Grade_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: grade */
export type Grade_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "grade" */
export enum Grade_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "grade" */
export type Grade_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "grade" */
export enum Grade_Update_Column {
  /** column name */
  Name = 'name'
}

/** columns and relationships of "identity" */
export type Identity = {
  __typename?: 'identity';
  id: Scalars['uuid'];
  /** An object relationship */
  identity_type: Identity_Type;
  /** An object relationship */
  profile: Profile;
  profile_id: Scalars['uuid'];
  provider_id: Scalars['String'];
  type: Identity_Type_Enum;
};

/** aggregated selection of "identity" */
export type Identity_Aggregate = {
  __typename?: 'identity_aggregate';
  aggregate?: Maybe<Identity_Aggregate_Fields>;
  nodes: Array<Identity>;
};

/** aggregate fields of "identity" */
export type Identity_Aggregate_Fields = {
  __typename?: 'identity_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Identity_Max_Fields>;
  min?: Maybe<Identity_Min_Fields>;
};


/** aggregate fields of "identity" */
export type Identity_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Identity_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "identity" */
export type Identity_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Identity_Max_Order_By>;
  min?: InputMaybe<Identity_Min_Order_By>;
};

/** input type for inserting array relation for remote table "identity" */
export type Identity_Arr_Rel_Insert_Input = {
  data: Array<Identity_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Identity_On_Conflict>;
};

/** Boolean expression to filter rows from the table "identity". All fields are combined with a logical 'AND'. */
export type Identity_Bool_Exp = {
  _and?: InputMaybe<Array<Identity_Bool_Exp>>;
  _not?: InputMaybe<Identity_Bool_Exp>;
  _or?: InputMaybe<Array<Identity_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  identity_type?: InputMaybe<Identity_Type_Bool_Exp>;
  profile?: InputMaybe<Profile_Bool_Exp>;
  profile_id?: InputMaybe<Uuid_Comparison_Exp>;
  provider_id?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<Identity_Type_Enum_Comparison_Exp>;
};

/** unique or primary key constraints on table "identity" */
export enum Identity_Constraint {
  /** unique or primary key constraint */
  IdentityPkey = 'identity_pkey',
  /** unique or primary key constraint */
  IdentityProviderIdKey = 'identity_provider_id_key'
}

/** input type for inserting data into table "identity" */
export type Identity_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  identity_type?: InputMaybe<Identity_Type_Obj_Rel_Insert_Input>;
  profile?: InputMaybe<Profile_Obj_Rel_Insert_Input>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  provider_id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Identity_Type_Enum>;
};

/** aggregate max on columns */
export type Identity_Max_Fields = {
  __typename?: 'identity_max_fields';
  id?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
  provider_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "identity" */
export type Identity_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
  provider_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Identity_Min_Fields = {
  __typename?: 'identity_min_fields';
  id?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
  provider_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "identity" */
export type Identity_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
  provider_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "identity" */
export type Identity_Mutation_Response = {
  __typename?: 'identity_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Identity>;
};

/** on_conflict condition type for table "identity" */
export type Identity_On_Conflict = {
  constraint: Identity_Constraint;
  update_columns?: Array<Identity_Update_Column>;
  where?: InputMaybe<Identity_Bool_Exp>;
};

/** Ordering options when selecting data from "identity". */
export type Identity_Order_By = {
  id?: InputMaybe<Order_By>;
  identity_type?: InputMaybe<Identity_Type_Order_By>;
  profile?: InputMaybe<Profile_Order_By>;
  profile_id?: InputMaybe<Order_By>;
  provider_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: identity */
export type Identity_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "identity" */
export enum Identity_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  ProviderId = 'provider_id',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "identity" */
export type Identity_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  provider_id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Identity_Type_Enum>;
};

/** columns and relationships of "identity_type" */
export type Identity_Type = {
  __typename?: 'identity_type';
  /** An array relationship */
  identities: Array<Identity>;
  /** An aggregate relationship */
  identities_aggregate: Identity_Aggregate;
  value: Scalars['String'];
};


/** columns and relationships of "identity_type" */
export type Identity_TypeIdentitiesArgs = {
  distinct_on?: InputMaybe<Array<Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identity_Order_By>>;
  where?: InputMaybe<Identity_Bool_Exp>;
};


/** columns and relationships of "identity_type" */
export type Identity_TypeIdentities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identity_Order_By>>;
  where?: InputMaybe<Identity_Bool_Exp>;
};

/** aggregated selection of "identity_type" */
export type Identity_Type_Aggregate = {
  __typename?: 'identity_type_aggregate';
  aggregate?: Maybe<Identity_Type_Aggregate_Fields>;
  nodes: Array<Identity_Type>;
};

/** aggregate fields of "identity_type" */
export type Identity_Type_Aggregate_Fields = {
  __typename?: 'identity_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Identity_Type_Max_Fields>;
  min?: Maybe<Identity_Type_Min_Fields>;
};


/** aggregate fields of "identity_type" */
export type Identity_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Identity_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "identity_type". All fields are combined with a logical 'AND'. */
export type Identity_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Identity_Type_Bool_Exp>>;
  _not?: InputMaybe<Identity_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Identity_Type_Bool_Exp>>;
  identities?: InputMaybe<Identity_Bool_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "identity_type" */
export enum Identity_Type_Constraint {
  /** unique or primary key constraint */
  IdentityTypePkey = 'identity_type_pkey'
}

export enum Identity_Type_Enum {
  Cognito = 'cognito'
}

/** Boolean expression to compare columns of type "identity_type_enum". All fields are combined with logical 'AND'. */
export type Identity_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Identity_Type_Enum>;
  _in?: InputMaybe<Array<Identity_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Identity_Type_Enum>;
  _nin?: InputMaybe<Array<Identity_Type_Enum>>;
};

/** input type for inserting data into table "identity_type" */
export type Identity_Type_Insert_Input = {
  identities?: InputMaybe<Identity_Arr_Rel_Insert_Input>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Identity_Type_Max_Fields = {
  __typename?: 'identity_type_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Identity_Type_Min_Fields = {
  __typename?: 'identity_type_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "identity_type" */
export type Identity_Type_Mutation_Response = {
  __typename?: 'identity_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Identity_Type>;
};

/** input type for inserting object relation for remote table "identity_type" */
export type Identity_Type_Obj_Rel_Insert_Input = {
  data: Identity_Type_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Identity_Type_On_Conflict>;
};

/** on_conflict condition type for table "identity_type" */
export type Identity_Type_On_Conflict = {
  constraint: Identity_Type_Constraint;
  update_columns?: Array<Identity_Type_Update_Column>;
  where?: InputMaybe<Identity_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "identity_type". */
export type Identity_Type_Order_By = {
  identities_aggregate?: InputMaybe<Identity_Aggregate_Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: identity_type */
export type Identity_Type_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "identity_type" */
export enum Identity_Type_Select_Column {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "identity_type" */
export type Identity_Type_Set_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "identity_type" */
export enum Identity_Type_Update_Column {
  /** column name */
  Value = 'value'
}

/** update columns of table "identity" */
export enum Identity_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  ProviderId = 'provider_id',
  /** column name */
  Type = 'type'
}

export type IsUserSubscribedToMembershipResponse = {
  __typename?: 'isUserSubscribedToMembershipResponse';
  isSubscribed: Scalars['Boolean'];
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['json']>;
  _gt?: InputMaybe<Scalars['json']>;
  _gte?: InputMaybe<Scalars['json']>;
  _in?: InputMaybe<Array<Scalars['json']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['json']>;
  _lte?: InputMaybe<Scalars['json']>;
  _neq?: InputMaybe<Scalars['json']>;
  _nin?: InputMaybe<Array<Scalars['json']>>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** columns and relationships of "legacy_certificate" */
export type Legacy_Certificate = {
  __typename?: 'legacy_certificate';
  certificationDate: Scalars['date'];
  /** An object relationship */
  courseCertificate?: Maybe<Course_Certificate>;
  courseCertificateId?: Maybe<Scalars['uuid']>;
  courseName: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  email: Scalars['String'];
  expiryDate: Scalars['date'];
  firstName: Scalars['String'];
  id: Scalars['uuid'];
  lastName: Scalars['String'];
  legacyId: Scalars['Int'];
  number: Scalars['String'];
  originalRecord: Scalars['jsonb'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "legacy_certificate" */
export type Legacy_CertificateOriginalRecordArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "legacy_certificate" */
export type Legacy_Certificate_Aggregate = {
  __typename?: 'legacy_certificate_aggregate';
  aggregate?: Maybe<Legacy_Certificate_Aggregate_Fields>;
  nodes: Array<Legacy_Certificate>;
};

/** aggregate fields of "legacy_certificate" */
export type Legacy_Certificate_Aggregate_Fields = {
  __typename?: 'legacy_certificate_aggregate_fields';
  avg?: Maybe<Legacy_Certificate_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Legacy_Certificate_Max_Fields>;
  min?: Maybe<Legacy_Certificate_Min_Fields>;
  stddev?: Maybe<Legacy_Certificate_Stddev_Fields>;
  stddev_pop?: Maybe<Legacy_Certificate_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Legacy_Certificate_Stddev_Samp_Fields>;
  sum?: Maybe<Legacy_Certificate_Sum_Fields>;
  var_pop?: Maybe<Legacy_Certificate_Var_Pop_Fields>;
  var_samp?: Maybe<Legacy_Certificate_Var_Samp_Fields>;
  variance?: Maybe<Legacy_Certificate_Variance_Fields>;
};


/** aggregate fields of "legacy_certificate" */
export type Legacy_Certificate_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Legacy_Certificate_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Legacy_Certificate_Append_Input = {
  originalRecord?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate avg on columns */
export type Legacy_Certificate_Avg_Fields = {
  __typename?: 'legacy_certificate_avg_fields';
  legacyId?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "legacy_certificate". All fields are combined with a logical 'AND'. */
export type Legacy_Certificate_Bool_Exp = {
  _and?: InputMaybe<Array<Legacy_Certificate_Bool_Exp>>;
  _not?: InputMaybe<Legacy_Certificate_Bool_Exp>;
  _or?: InputMaybe<Array<Legacy_Certificate_Bool_Exp>>;
  certificationDate?: InputMaybe<Date_Comparison_Exp>;
  courseCertificate?: InputMaybe<Course_Certificate_Bool_Exp>;
  courseCertificateId?: InputMaybe<Uuid_Comparison_Exp>;
  courseName?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  expiryDate?: InputMaybe<Date_Comparison_Exp>;
  firstName?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  lastName?: InputMaybe<String_Comparison_Exp>;
  legacyId?: InputMaybe<Int_Comparison_Exp>;
  number?: InputMaybe<String_Comparison_Exp>;
  originalRecord?: InputMaybe<Jsonb_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "legacy_certificate" */
export enum Legacy_Certificate_Constraint {
  /** unique or primary key constraint */
  LegacyCertificateLegacyIdKey = 'legacy_certificate_legacy_id_key',
  /** unique or primary key constraint */
  LegacyCertificateNumberKey = 'legacy_certificate_number_key',
  /** unique or primary key constraint */
  LegacyCertificatePkey = 'legacy_certificate_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Legacy_Certificate_Delete_At_Path_Input = {
  originalRecord?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Legacy_Certificate_Delete_Elem_Input = {
  originalRecord?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Legacy_Certificate_Delete_Key_Input = {
  originalRecord?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "legacy_certificate" */
export type Legacy_Certificate_Inc_Input = {
  legacyId?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "legacy_certificate" */
export type Legacy_Certificate_Insert_Input = {
  certificationDate?: InputMaybe<Scalars['date']>;
  courseCertificate?: InputMaybe<Course_Certificate_Obj_Rel_Insert_Input>;
  courseCertificateId?: InputMaybe<Scalars['uuid']>;
  courseName?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  email?: InputMaybe<Scalars['String']>;
  expiryDate?: InputMaybe<Scalars['date']>;
  firstName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  lastName?: InputMaybe<Scalars['String']>;
  legacyId?: InputMaybe<Scalars['Int']>;
  number?: InputMaybe<Scalars['String']>;
  originalRecord?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Legacy_Certificate_Max_Fields = {
  __typename?: 'legacy_certificate_max_fields';
  certificationDate?: Maybe<Scalars['date']>;
  courseCertificateId?: Maybe<Scalars['uuid']>;
  courseName?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  expiryDate?: Maybe<Scalars['date']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  lastName?: Maybe<Scalars['String']>;
  legacyId?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Legacy_Certificate_Min_Fields = {
  __typename?: 'legacy_certificate_min_fields';
  certificationDate?: Maybe<Scalars['date']>;
  courseCertificateId?: Maybe<Scalars['uuid']>;
  courseName?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  expiryDate?: Maybe<Scalars['date']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  lastName?: Maybe<Scalars['String']>;
  legacyId?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "legacy_certificate" */
export type Legacy_Certificate_Mutation_Response = {
  __typename?: 'legacy_certificate_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Legacy_Certificate>;
};

/** on_conflict condition type for table "legacy_certificate" */
export type Legacy_Certificate_On_Conflict = {
  constraint: Legacy_Certificate_Constraint;
  update_columns?: Array<Legacy_Certificate_Update_Column>;
  where?: InputMaybe<Legacy_Certificate_Bool_Exp>;
};

/** Ordering options when selecting data from "legacy_certificate". */
export type Legacy_Certificate_Order_By = {
  certificationDate?: InputMaybe<Order_By>;
  courseCertificate?: InputMaybe<Course_Certificate_Order_By>;
  courseCertificateId?: InputMaybe<Order_By>;
  courseName?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  expiryDate?: InputMaybe<Order_By>;
  firstName?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastName?: InputMaybe<Order_By>;
  legacyId?: InputMaybe<Order_By>;
  number?: InputMaybe<Order_By>;
  originalRecord?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: legacy_certificate */
export type Legacy_Certificate_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Legacy_Certificate_Prepend_Input = {
  originalRecord?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "legacy_certificate" */
export enum Legacy_Certificate_Select_Column {
  /** column name */
  CertificationDate = 'certificationDate',
  /** column name */
  CourseCertificateId = 'courseCertificateId',
  /** column name */
  CourseName = 'courseName',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Email = 'email',
  /** column name */
  ExpiryDate = 'expiryDate',
  /** column name */
  FirstName = 'firstName',
  /** column name */
  Id = 'id',
  /** column name */
  LastName = 'lastName',
  /** column name */
  LegacyId = 'legacyId',
  /** column name */
  Number = 'number',
  /** column name */
  OriginalRecord = 'originalRecord',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "legacy_certificate" */
export type Legacy_Certificate_Set_Input = {
  certificationDate?: InputMaybe<Scalars['date']>;
  courseCertificateId?: InputMaybe<Scalars['uuid']>;
  courseName?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  email?: InputMaybe<Scalars['String']>;
  expiryDate?: InputMaybe<Scalars['date']>;
  firstName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  lastName?: InputMaybe<Scalars['String']>;
  legacyId?: InputMaybe<Scalars['Int']>;
  number?: InputMaybe<Scalars['String']>;
  originalRecord?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Legacy_Certificate_Stddev_Fields = {
  __typename?: 'legacy_certificate_stddev_fields';
  legacyId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Legacy_Certificate_Stddev_Pop_Fields = {
  __typename?: 'legacy_certificate_stddev_pop_fields';
  legacyId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Legacy_Certificate_Stddev_Samp_Fields = {
  __typename?: 'legacy_certificate_stddev_samp_fields';
  legacyId?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Legacy_Certificate_Sum_Fields = {
  __typename?: 'legacy_certificate_sum_fields';
  legacyId?: Maybe<Scalars['Int']>;
};

/** update columns of table "legacy_certificate" */
export enum Legacy_Certificate_Update_Column {
  /** column name */
  CertificationDate = 'certificationDate',
  /** column name */
  CourseCertificateId = 'courseCertificateId',
  /** column name */
  CourseName = 'courseName',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Email = 'email',
  /** column name */
  ExpiryDate = 'expiryDate',
  /** column name */
  FirstName = 'firstName',
  /** column name */
  Id = 'id',
  /** column name */
  LastName = 'lastName',
  /** column name */
  LegacyId = 'legacyId',
  /** column name */
  Number = 'number',
  /** column name */
  OriginalRecord = 'originalRecord',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** aggregate var_pop on columns */
export type Legacy_Certificate_Var_Pop_Fields = {
  __typename?: 'legacy_certificate_var_pop_fields';
  legacyId?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Legacy_Certificate_Var_Samp_Fields = {
  __typename?: 'legacy_certificate_var_samp_fields';
  legacyId?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Legacy_Certificate_Variance_Fields = {
  __typename?: 'legacy_certificate_variance_fields';
  legacyId?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "module" */
export type Module = {
  __typename?: 'module';
  createdAt: Scalars['timestamptz'];
  description?: Maybe<Scalars['String']>;
  group?: Maybe<Scalars['uuid']>;
  id: Scalars['uuid'];
  level: Course_Level_Enum;
  /** An object relationship */
  moduleGroup?: Maybe<Module_Group>;
  name: Scalars['String'];
  type: Module_Category_Enum;
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "module" */
export type Module_Aggregate = {
  __typename?: 'module_aggregate';
  aggregate?: Maybe<Module_Aggregate_Fields>;
  nodes: Array<Module>;
};

/** aggregate fields of "module" */
export type Module_Aggregate_Fields = {
  __typename?: 'module_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Module_Max_Fields>;
  min?: Maybe<Module_Min_Fields>;
};


/** aggregate fields of "module" */
export type Module_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Module_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "module" */
export type Module_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Module_Max_Order_By>;
  min?: InputMaybe<Module_Min_Order_By>;
};

/** input type for inserting array relation for remote table "module" */
export type Module_Arr_Rel_Insert_Input = {
  data: Array<Module_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Module_On_Conflict>;
};

/** Boolean expression to filter rows from the table "module". All fields are combined with a logical 'AND'. */
export type Module_Bool_Exp = {
  _and?: InputMaybe<Array<Module_Bool_Exp>>;
  _not?: InputMaybe<Module_Bool_Exp>;
  _or?: InputMaybe<Array<Module_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  group?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  level?: InputMaybe<Course_Level_Enum_Comparison_Exp>;
  moduleGroup?: InputMaybe<Module_Group_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<Module_Category_Enum_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** columns and relationships of "module_category" */
export type Module_Category = {
  __typename?: 'module_category';
  name: Scalars['String'];
};

/** aggregated selection of "module_category" */
export type Module_Category_Aggregate = {
  __typename?: 'module_category_aggregate';
  aggregate?: Maybe<Module_Category_Aggregate_Fields>;
  nodes: Array<Module_Category>;
};

/** aggregate fields of "module_category" */
export type Module_Category_Aggregate_Fields = {
  __typename?: 'module_category_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Module_Category_Max_Fields>;
  min?: Maybe<Module_Category_Min_Fields>;
};


/** aggregate fields of "module_category" */
export type Module_Category_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Module_Category_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "module_category". All fields are combined with a logical 'AND'. */
export type Module_Category_Bool_Exp = {
  _and?: InputMaybe<Array<Module_Category_Bool_Exp>>;
  _not?: InputMaybe<Module_Category_Bool_Exp>;
  _or?: InputMaybe<Array<Module_Category_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "module_category" */
export enum Module_Category_Constraint {
  /** unique or primary key constraint */
  ModuleCategoryPkey = 'module_category_pkey'
}

export enum Module_Category_Enum {
  Physical = 'PHYSICAL',
  Theory = 'THEORY'
}

/** Boolean expression to compare columns of type "module_category_enum". All fields are combined with logical 'AND'. */
export type Module_Category_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Module_Category_Enum>;
  _in?: InputMaybe<Array<Module_Category_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Module_Category_Enum>;
  _nin?: InputMaybe<Array<Module_Category_Enum>>;
};

/** input type for inserting data into table "module_category" */
export type Module_Category_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Module_Category_Max_Fields = {
  __typename?: 'module_category_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Module_Category_Min_Fields = {
  __typename?: 'module_category_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "module_category" */
export type Module_Category_Mutation_Response = {
  __typename?: 'module_category_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Module_Category>;
};

/** on_conflict condition type for table "module_category" */
export type Module_Category_On_Conflict = {
  constraint: Module_Category_Constraint;
  update_columns?: Array<Module_Category_Update_Column>;
  where?: InputMaybe<Module_Category_Bool_Exp>;
};

/** Ordering options when selecting data from "module_category". */
export type Module_Category_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: module_category */
export type Module_Category_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "module_category" */
export enum Module_Category_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "module_category" */
export type Module_Category_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "module_category" */
export enum Module_Category_Update_Column {
  /** column name */
  Name = 'name'
}

/** unique or primary key constraints on table "module" */
export enum Module_Constraint {
  /** unique or primary key constraint */
  ModulePkey = 'module_pkey'
}

/** columns and relationships of "module_group" */
export type Module_Group = {
  __typename?: 'module_group';
  color: Color_Enum;
  createdAt: Scalars['timestamptz'];
  /** An array relationship */
  durations: Array<Module_Group_Duration>;
  /** An aggregate relationship */
  durations_aggregate: Module_Group_Duration_Aggregate;
  id: Scalars['uuid'];
  level: Course_Level_Enum;
  mandatory: Scalars['Boolean'];
  /** An array relationship */
  modules: Array<Module>;
  /** An aggregate relationship */
  modules_aggregate: Module_Aggregate;
  name: Scalars['String'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "module_group" */
export type Module_GroupDurationsArgs = {
  distinct_on?: InputMaybe<Array<Module_Group_Duration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Group_Duration_Order_By>>;
  where?: InputMaybe<Module_Group_Duration_Bool_Exp>;
};


/** columns and relationships of "module_group" */
export type Module_GroupDurations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Module_Group_Duration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Group_Duration_Order_By>>;
  where?: InputMaybe<Module_Group_Duration_Bool_Exp>;
};


/** columns and relationships of "module_group" */
export type Module_GroupModulesArgs = {
  distinct_on?: InputMaybe<Array<Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Order_By>>;
  where?: InputMaybe<Module_Bool_Exp>;
};


/** columns and relationships of "module_group" */
export type Module_GroupModules_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Order_By>>;
  where?: InputMaybe<Module_Bool_Exp>;
};

/** aggregated selection of "module_group" */
export type Module_Group_Aggregate = {
  __typename?: 'module_group_aggregate';
  aggregate?: Maybe<Module_Group_Aggregate_Fields>;
  nodes: Array<Module_Group>;
};

/** aggregate fields of "module_group" */
export type Module_Group_Aggregate_Fields = {
  __typename?: 'module_group_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Module_Group_Max_Fields>;
  min?: Maybe<Module_Group_Min_Fields>;
};


/** aggregate fields of "module_group" */
export type Module_Group_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Module_Group_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "module_group". All fields are combined with a logical 'AND'. */
export type Module_Group_Bool_Exp = {
  _and?: InputMaybe<Array<Module_Group_Bool_Exp>>;
  _not?: InputMaybe<Module_Group_Bool_Exp>;
  _or?: InputMaybe<Array<Module_Group_Bool_Exp>>;
  color?: InputMaybe<Color_Enum_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  durations?: InputMaybe<Module_Group_Duration_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  level?: InputMaybe<Course_Level_Enum_Comparison_Exp>;
  mandatory?: InputMaybe<Boolean_Comparison_Exp>;
  modules?: InputMaybe<Module_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "module_group" */
export enum Module_Group_Constraint {
  /** unique or primary key constraint */
  ModuleGroupPkey = 'module_group_pkey'
}

/** columns and relationships of "module_group_duration" */
export type Module_Group_Duration = {
  __typename?: 'module_group_duration';
  courseDeliveryType: Course_Delivery_Type_Enum;
  createdAt: Scalars['timestamptz'];
  duration: Scalars['Int'];
  go1Integration: Scalars['Boolean'];
  id: Scalars['uuid'];
  /** An object relationship */
  moduleGroup: Module_Group;
  module_group_id: Scalars['uuid'];
  reaccreditation: Scalars['Boolean'];
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "module_group_duration" */
export type Module_Group_Duration_Aggregate = {
  __typename?: 'module_group_duration_aggregate';
  aggregate?: Maybe<Module_Group_Duration_Aggregate_Fields>;
  nodes: Array<Module_Group_Duration>;
};

/** aggregate fields of "module_group_duration" */
export type Module_Group_Duration_Aggregate_Fields = {
  __typename?: 'module_group_duration_aggregate_fields';
  avg?: Maybe<Module_Group_Duration_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Module_Group_Duration_Max_Fields>;
  min?: Maybe<Module_Group_Duration_Min_Fields>;
  stddev?: Maybe<Module_Group_Duration_Stddev_Fields>;
  stddev_pop?: Maybe<Module_Group_Duration_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Module_Group_Duration_Stddev_Samp_Fields>;
  sum?: Maybe<Module_Group_Duration_Sum_Fields>;
  var_pop?: Maybe<Module_Group_Duration_Var_Pop_Fields>;
  var_samp?: Maybe<Module_Group_Duration_Var_Samp_Fields>;
  variance?: Maybe<Module_Group_Duration_Variance_Fields>;
};


/** aggregate fields of "module_group_duration" */
export type Module_Group_Duration_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Module_Group_Duration_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "module_group_duration" */
export type Module_Group_Duration_Aggregate_Order_By = {
  avg?: InputMaybe<Module_Group_Duration_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Module_Group_Duration_Max_Order_By>;
  min?: InputMaybe<Module_Group_Duration_Min_Order_By>;
  stddev?: InputMaybe<Module_Group_Duration_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Module_Group_Duration_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Module_Group_Duration_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Module_Group_Duration_Sum_Order_By>;
  var_pop?: InputMaybe<Module_Group_Duration_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Module_Group_Duration_Var_Samp_Order_By>;
  variance?: InputMaybe<Module_Group_Duration_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "module_group_duration" */
export type Module_Group_Duration_Arr_Rel_Insert_Input = {
  data: Array<Module_Group_Duration_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Module_Group_Duration_On_Conflict>;
};

/** aggregate avg on columns */
export type Module_Group_Duration_Avg_Fields = {
  __typename?: 'module_group_duration_avg_fields';
  duration?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "module_group_duration" */
export type Module_Group_Duration_Avg_Order_By = {
  duration?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "module_group_duration". All fields are combined with a logical 'AND'. */
export type Module_Group_Duration_Bool_Exp = {
  _and?: InputMaybe<Array<Module_Group_Duration_Bool_Exp>>;
  _not?: InputMaybe<Module_Group_Duration_Bool_Exp>;
  _or?: InputMaybe<Array<Module_Group_Duration_Bool_Exp>>;
  courseDeliveryType?: InputMaybe<Course_Delivery_Type_Enum_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  duration?: InputMaybe<Int_Comparison_Exp>;
  go1Integration?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  moduleGroup?: InputMaybe<Module_Group_Bool_Exp>;
  module_group_id?: InputMaybe<Uuid_Comparison_Exp>;
  reaccreditation?: InputMaybe<Boolean_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "module_group_duration" */
export enum Module_Group_Duration_Constraint {
  /** unique or primary key constraint */
  ModuleGroupDurationPkey = 'module_group_duration_pkey'
}

/** input type for incrementing numeric columns in table "module_group_duration" */
export type Module_Group_Duration_Inc_Input = {
  duration?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "module_group_duration" */
export type Module_Group_Duration_Insert_Input = {
  courseDeliveryType?: InputMaybe<Course_Delivery_Type_Enum>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  duration?: InputMaybe<Scalars['Int']>;
  go1Integration?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['uuid']>;
  moduleGroup?: InputMaybe<Module_Group_Obj_Rel_Insert_Input>;
  module_group_id?: InputMaybe<Scalars['uuid']>;
  reaccreditation?: InputMaybe<Scalars['Boolean']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Module_Group_Duration_Max_Fields = {
  __typename?: 'module_group_duration_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  duration?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  module_group_id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "module_group_duration" */
export type Module_Group_Duration_Max_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  module_group_id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Module_Group_Duration_Min_Fields = {
  __typename?: 'module_group_duration_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  duration?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  module_group_id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "module_group_duration" */
export type Module_Group_Duration_Min_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  module_group_id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "module_group_duration" */
export type Module_Group_Duration_Mutation_Response = {
  __typename?: 'module_group_duration_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Module_Group_Duration>;
};

/** on_conflict condition type for table "module_group_duration" */
export type Module_Group_Duration_On_Conflict = {
  constraint: Module_Group_Duration_Constraint;
  update_columns?: Array<Module_Group_Duration_Update_Column>;
  where?: InputMaybe<Module_Group_Duration_Bool_Exp>;
};

/** Ordering options when selecting data from "module_group_duration". */
export type Module_Group_Duration_Order_By = {
  courseDeliveryType?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  go1Integration?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  moduleGroup?: InputMaybe<Module_Group_Order_By>;
  module_group_id?: InputMaybe<Order_By>;
  reaccreditation?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: module_group_duration */
export type Module_Group_Duration_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "module_group_duration" */
export enum Module_Group_Duration_Select_Column {
  /** column name */
  CourseDeliveryType = 'courseDeliveryType',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Duration = 'duration',
  /** column name */
  Go1Integration = 'go1Integration',
  /** column name */
  Id = 'id',
  /** column name */
  ModuleGroupId = 'module_group_id',
  /** column name */
  Reaccreditation = 'reaccreditation',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "module_group_duration" */
export type Module_Group_Duration_Set_Input = {
  courseDeliveryType?: InputMaybe<Course_Delivery_Type_Enum>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  duration?: InputMaybe<Scalars['Int']>;
  go1Integration?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['uuid']>;
  module_group_id?: InputMaybe<Scalars['uuid']>;
  reaccreditation?: InputMaybe<Scalars['Boolean']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Module_Group_Duration_Stddev_Fields = {
  __typename?: 'module_group_duration_stddev_fields';
  duration?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "module_group_duration" */
export type Module_Group_Duration_Stddev_Order_By = {
  duration?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Module_Group_Duration_Stddev_Pop_Fields = {
  __typename?: 'module_group_duration_stddev_pop_fields';
  duration?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "module_group_duration" */
export type Module_Group_Duration_Stddev_Pop_Order_By = {
  duration?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Module_Group_Duration_Stddev_Samp_Fields = {
  __typename?: 'module_group_duration_stddev_samp_fields';
  duration?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "module_group_duration" */
export type Module_Group_Duration_Stddev_Samp_Order_By = {
  duration?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Module_Group_Duration_Sum_Fields = {
  __typename?: 'module_group_duration_sum_fields';
  duration?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "module_group_duration" */
export type Module_Group_Duration_Sum_Order_By = {
  duration?: InputMaybe<Order_By>;
};

/** update columns of table "module_group_duration" */
export enum Module_Group_Duration_Update_Column {
  /** column name */
  CourseDeliveryType = 'courseDeliveryType',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Duration = 'duration',
  /** column name */
  Go1Integration = 'go1Integration',
  /** column name */
  Id = 'id',
  /** column name */
  ModuleGroupId = 'module_group_id',
  /** column name */
  Reaccreditation = 'reaccreditation',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** aggregate var_pop on columns */
export type Module_Group_Duration_Var_Pop_Fields = {
  __typename?: 'module_group_duration_var_pop_fields';
  duration?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "module_group_duration" */
export type Module_Group_Duration_Var_Pop_Order_By = {
  duration?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Module_Group_Duration_Var_Samp_Fields = {
  __typename?: 'module_group_duration_var_samp_fields';
  duration?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "module_group_duration" */
export type Module_Group_Duration_Var_Samp_Order_By = {
  duration?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Module_Group_Duration_Variance_Fields = {
  __typename?: 'module_group_duration_variance_fields';
  duration?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "module_group_duration" */
export type Module_Group_Duration_Variance_Order_By = {
  duration?: InputMaybe<Order_By>;
};

/** input type for inserting data into table "module_group" */
export type Module_Group_Insert_Input = {
  color?: InputMaybe<Color_Enum>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  durations?: InputMaybe<Module_Group_Duration_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']>;
  level?: InputMaybe<Course_Level_Enum>;
  mandatory?: InputMaybe<Scalars['Boolean']>;
  modules?: InputMaybe<Module_Arr_Rel_Insert_Input>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Module_Group_Max_Fields = {
  __typename?: 'module_group_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Module_Group_Min_Fields = {
  __typename?: 'module_group_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "module_group" */
export type Module_Group_Mutation_Response = {
  __typename?: 'module_group_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Module_Group>;
};

/** input type for inserting object relation for remote table "module_group" */
export type Module_Group_Obj_Rel_Insert_Input = {
  data: Module_Group_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Module_Group_On_Conflict>;
};

/** on_conflict condition type for table "module_group" */
export type Module_Group_On_Conflict = {
  constraint: Module_Group_Constraint;
  update_columns?: Array<Module_Group_Update_Column>;
  where?: InputMaybe<Module_Group_Bool_Exp>;
};

/** Ordering options when selecting data from "module_group". */
export type Module_Group_Order_By = {
  color?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  durations_aggregate?: InputMaybe<Module_Group_Duration_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  level?: InputMaybe<Order_By>;
  mandatory?: InputMaybe<Order_By>;
  modules_aggregate?: InputMaybe<Module_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: module_group */
export type Module_Group_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "module_group" */
export enum Module_Group_Select_Column {
  /** column name */
  Color = 'color',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  Level = 'level',
  /** column name */
  Mandatory = 'mandatory',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "module_group" */
export type Module_Group_Set_Input = {
  color?: InputMaybe<Color_Enum>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  level?: InputMaybe<Course_Level_Enum>;
  mandatory?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "module_group" */
export enum Module_Group_Update_Column {
  /** column name */
  Color = 'color',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  Level = 'level',
  /** column name */
  Mandatory = 'mandatory',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for inserting data into table "module" */
export type Module_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  group?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  level?: InputMaybe<Course_Level_Enum>;
  moduleGroup?: InputMaybe<Module_Group_Obj_Rel_Insert_Input>;
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Module_Category_Enum>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Module_Max_Fields = {
  __typename?: 'module_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  group?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "module" */
export type Module_Max_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  group?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Module_Min_Fields = {
  __typename?: 'module_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  group?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "module" */
export type Module_Min_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  group?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "module" */
export type Module_Mutation_Response = {
  __typename?: 'module_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Module>;
};

/** input type for inserting object relation for remote table "module" */
export type Module_Obj_Rel_Insert_Input = {
  data: Module_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Module_On_Conflict>;
};

/** on_conflict condition type for table "module" */
export type Module_On_Conflict = {
  constraint: Module_Constraint;
  update_columns?: Array<Module_Update_Column>;
  where?: InputMaybe<Module_Bool_Exp>;
};

/** Ordering options when selecting data from "module". */
export type Module_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  group?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  level?: InputMaybe<Order_By>;
  moduleGroup?: InputMaybe<Module_Group_Order_By>;
  name?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: module */
export type Module_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "module" */
export enum Module_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Description = 'description',
  /** column name */
  Group = 'group',
  /** column name */
  Id = 'id',
  /** column name */
  Level = 'level',
  /** column name */
  Name = 'name',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "module" */
export type Module_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  group?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  level?: InputMaybe<Course_Level_Enum>;
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Module_Category_Enum>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "module" */
export enum Module_Update_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Description = 'description',
  /** column name */
  Group = 'group',
  /** column name */
  Id = 'id',
  /** column name */
  Level = 'level',
  /** column name */
  Name = 'name',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** Creates a membership subscription */
  createStripeSubscription?: Maybe<CreateSubscriptionOutput>;
  declineInvite?: Maybe<DeclineInviteOutput>;
  /** delete data from the table: "blended_learning_status" */
  delete_blended_learning_status?: Maybe<Blended_Learning_Status_Mutation_Response>;
  /** delete single row from the table: "blended_learning_status" */
  delete_blended_learning_status_by_pk?: Maybe<Blended_Learning_Status>;
  /** delete data from the table: "color" */
  delete_color?: Maybe<Color_Mutation_Response>;
  /** delete single row from the table: "color" */
  delete_color_by_pk?: Maybe<Color>;
  /** delete data from the table: "course" */
  delete_course?: Maybe<Course_Mutation_Response>;
  /** delete single row from the table: "course" */
  delete_course_by_pk?: Maybe<Course>;
  /** delete data from the table: "course_certificate" */
  delete_course_certificate?: Maybe<Course_Certificate_Mutation_Response>;
  /** delete single row from the table: "course_certificate" */
  delete_course_certificate_by_pk?: Maybe<Course_Certificate>;
  /** delete data from the table: "course_certificate_changelog" */
  delete_course_certificate_changelog?: Maybe<Course_Certificate_Changelog_Mutation_Response>;
  /** delete single row from the table: "course_certificate_changelog" */
  delete_course_certificate_changelog_by_pk?: Maybe<Course_Certificate_Changelog>;
  /** delete data from the table: "course_delivery_type" */
  delete_course_delivery_type?: Maybe<Course_Delivery_Type_Mutation_Response>;
  /** delete single row from the table: "course_delivery_type" */
  delete_course_delivery_type_by_pk?: Maybe<Course_Delivery_Type>;
  /** delete data from the table: "course_evaluation_answers" */
  delete_course_evaluation_answers?: Maybe<Course_Evaluation_Answers_Mutation_Response>;
  /** delete single row from the table: "course_evaluation_answers" */
  delete_course_evaluation_answers_by_pk?: Maybe<Course_Evaluation_Answers>;
  /** delete data from the table: "course_evaluation_question_group" */
  delete_course_evaluation_question_group?: Maybe<Course_Evaluation_Question_Group_Mutation_Response>;
  /** delete single row from the table: "course_evaluation_question_group" */
  delete_course_evaluation_question_group_by_pk?: Maybe<Course_Evaluation_Question_Group>;
  /** delete data from the table: "course_evaluation_question_type" */
  delete_course_evaluation_question_type?: Maybe<Course_Evaluation_Question_Type_Mutation_Response>;
  /** delete single row from the table: "course_evaluation_question_type" */
  delete_course_evaluation_question_type_by_pk?: Maybe<Course_Evaluation_Question_Type>;
  /** delete data from the table: "course_evaluation_questions" */
  delete_course_evaluation_questions?: Maybe<Course_Evaluation_Questions_Mutation_Response>;
  /** delete single row from the table: "course_evaluation_questions" */
  delete_course_evaluation_questions_by_pk?: Maybe<Course_Evaluation_Questions>;
  /** delete data from the table: "course_invite_status" */
  delete_course_invite_status?: Maybe<Course_Invite_Status_Mutation_Response>;
  /** delete single row from the table: "course_invite_status" */
  delete_course_invite_status_by_pk?: Maybe<Course_Invite_Status>;
  /** delete data from the table: "course_invites" */
  delete_course_invites?: Maybe<Course_Invites_Mutation_Response>;
  /** delete single row from the table: "course_invites" */
  delete_course_invites_by_pk?: Maybe<Course_Invites>;
  /** delete data from the table: "course_level" */
  delete_course_level?: Maybe<Course_Level_Mutation_Response>;
  /** delete single row from the table: "course_level" */
  delete_course_level_by_pk?: Maybe<Course_Level>;
  /** delete data from the table: "course_module" */
  delete_course_module?: Maybe<Course_Module_Mutation_Response>;
  /** delete single row from the table: "course_module" */
  delete_course_module_by_pk?: Maybe<Course_Module>;
  /** delete data from the table: "course_participant" */
  delete_course_participant?: Maybe<Course_Participant_Mutation_Response>;
  /** delete single row from the table: "course_participant" */
  delete_course_participant_by_pk?: Maybe<Course_Participant>;
  /** delete data from the table: "course_participant_module" */
  delete_course_participant_module?: Maybe<Course_Participant_Module_Mutation_Response>;
  /** delete single row from the table: "course_participant_module" */
  delete_course_participant_module_by_pk?: Maybe<Course_Participant_Module>;
  /** delete data from the table: "course_schedule" */
  delete_course_schedule?: Maybe<Course_Schedule_Mutation_Response>;
  /** delete single row from the table: "course_schedule" */
  delete_course_schedule_by_pk?: Maybe<Course_Schedule>;
  /** delete data from the table: "course_status" */
  delete_course_status?: Maybe<Course_Status_Mutation_Response>;
  /** delete single row from the table: "course_status" */
  delete_course_status_by_pk?: Maybe<Course_Status>;
  /** delete data from the table: "course_trainer" */
  delete_course_trainer?: Maybe<Course_Trainer_Mutation_Response>;
  /** delete single row from the table: "course_trainer" */
  delete_course_trainer_by_pk?: Maybe<Course_Trainer>;
  /** delete data from the table: "course_trainer_type" */
  delete_course_trainer_type?: Maybe<Course_Trainer_Type_Mutation_Response>;
  /** delete single row from the table: "course_trainer_type" */
  delete_course_trainer_type_by_pk?: Maybe<Course_Trainer_Type>;
  /** delete data from the table: "course_type" */
  delete_course_type?: Maybe<Course_Type_Mutation_Response>;
  /** delete single row from the table: "course_type" */
  delete_course_type_by_pk?: Maybe<Course_Type>;
  /** delete data from the table: "grade" */
  delete_grade?: Maybe<Grade_Mutation_Response>;
  /** delete single row from the table: "grade" */
  delete_grade_by_pk?: Maybe<Grade>;
  /** delete data from the table: "identity" */
  delete_identity?: Maybe<Identity_Mutation_Response>;
  /** delete single row from the table: "identity" */
  delete_identity_by_pk?: Maybe<Identity>;
  /** delete data from the table: "identity_type" */
  delete_identity_type?: Maybe<Identity_Type_Mutation_Response>;
  /** delete single row from the table: "identity_type" */
  delete_identity_type_by_pk?: Maybe<Identity_Type>;
  /** delete data from the table: "legacy_certificate" */
  delete_legacy_certificate?: Maybe<Legacy_Certificate_Mutation_Response>;
  /** delete single row from the table: "legacy_certificate" */
  delete_legacy_certificate_by_pk?: Maybe<Legacy_Certificate>;
  /** delete data from the table: "module" */
  delete_module?: Maybe<Module_Mutation_Response>;
  /** delete single row from the table: "module" */
  delete_module_by_pk?: Maybe<Module>;
  /** delete data from the table: "module_category" */
  delete_module_category?: Maybe<Module_Category_Mutation_Response>;
  /** delete single row from the table: "module_category" */
  delete_module_category_by_pk?: Maybe<Module_Category>;
  /** delete data from the table: "module_group" */
  delete_module_group?: Maybe<Module_Group_Mutation_Response>;
  /** delete single row from the table: "module_group" */
  delete_module_group_by_pk?: Maybe<Module_Group>;
  /** delete data from the table: "module_group_duration" */
  delete_module_group_duration?: Maybe<Module_Group_Duration_Mutation_Response>;
  /** delete single row from the table: "module_group_duration" */
  delete_module_group_duration_by_pk?: Maybe<Module_Group_Duration>;
  /** delete data from the table: "order" */
  delete_order?: Maybe<Order_Mutation_Response>;
  /** delete single row from the table: "order" */
  delete_order_by_pk?: Maybe<Order>;
  /** delete data from the table: "organization" */
  delete_organization?: Maybe<Organization_Mutation_Response>;
  /** delete single row from the table: "organization" */
  delete_organization_by_pk?: Maybe<Organization>;
  /** delete data from the table: "organization_group" */
  delete_organization_group?: Maybe<Organization_Group_Mutation_Response>;
  /** delete single row from the table: "organization_group" */
  delete_organization_group_by_pk?: Maybe<Organization_Group>;
  /** delete data from the table: "organization_member" */
  delete_organization_member?: Maybe<Organization_Member_Mutation_Response>;
  /** delete single row from the table: "organization_member" */
  delete_organization_member_by_pk?: Maybe<Organization_Member>;
  /** delete data from the table: "organization_member_role" */
  delete_organization_member_role?: Maybe<Organization_Member_Role_Mutation_Response>;
  /** delete single row from the table: "organization_member_role" */
  delete_organization_member_role_by_pk?: Maybe<Organization_Member_Role>;
  /** delete data from the table: "organization_role" */
  delete_organization_role?: Maybe<Organization_Role_Mutation_Response>;
  /** delete single row from the table: "organization_role" */
  delete_organization_role_by_pk?: Maybe<Organization_Role>;
  /** delete data from the table: "organization_status" */
  delete_organization_status?: Maybe<Organization_Status_Mutation_Response>;
  /** delete single row from the table: "organization_status" */
  delete_organization_status_by_pk?: Maybe<Organization_Status>;
  /** delete data from the table: "payment_methods" */
  delete_payment_methods?: Maybe<Payment_Methods_Mutation_Response>;
  /** delete single row from the table: "payment_methods" */
  delete_payment_methods_by_pk?: Maybe<Payment_Methods>;
  /** delete data from the table: "profile" */
  delete_profile?: Maybe<Profile_Mutation_Response>;
  /** delete single row from the table: "profile" */
  delete_profile_by_pk?: Maybe<Profile>;
  /** delete data from the table: "profile_role" */
  delete_profile_role?: Maybe<Profile_Role_Mutation_Response>;
  /** delete single row from the table: "profile_role" */
  delete_profile_role_by_pk?: Maybe<Profile_Role>;
  /** delete data from the table: "profile_status" */
  delete_profile_status?: Maybe<Profile_Status_Mutation_Response>;
  /** delete single row from the table: "profile_status" */
  delete_profile_status_by_pk?: Maybe<Profile_Status>;
  /** delete data from the table: "profile_temp" */
  delete_profile_temp?: Maybe<Profile_Temp_Mutation_Response>;
  /** delete single row from the table: "profile_temp" */
  delete_profile_temp_by_pk?: Maybe<Profile_Temp>;
  /** delete data from the table: "resource" */
  delete_resource?: Maybe<Resource_Mutation_Response>;
  /** delete single row from the table: "resource" */
  delete_resource_by_pk?: Maybe<Resource>;
  /** delete data from the table: "role" */
  delete_role?: Maybe<Role_Mutation_Response>;
  /** delete single row from the table: "role" */
  delete_role_by_pk?: Maybe<Role>;
  /** delete data from the table: "venue" */
  delete_venue?: Maybe<Venue_Mutation_Response>;
  /** delete single row from the table: "venue" */
  delete_venue_by_pk?: Maybe<Venue>;
  /** delete data from the table: "waitlist" */
  delete_waitlist?: Maybe<Waitlist_Mutation_Response>;
  /** delete single row from the table: "waitlist" */
  delete_waitlist_by_pk?: Maybe<Waitlist>;
  /** insert data into the table: "blended_learning_status" */
  insert_blended_learning_status?: Maybe<Blended_Learning_Status_Mutation_Response>;
  /** insert a single row into the table: "blended_learning_status" */
  insert_blended_learning_status_one?: Maybe<Blended_Learning_Status>;
  /** insert data into the table: "color" */
  insert_color?: Maybe<Color_Mutation_Response>;
  /** insert a single row into the table: "color" */
  insert_color_one?: Maybe<Color>;
  /** insert data into the table: "course" */
  insert_course?: Maybe<Course_Mutation_Response>;
  /** insert data into the table: "course_certificate" */
  insert_course_certificate?: Maybe<Course_Certificate_Mutation_Response>;
  /** insert data into the table: "course_certificate_changelog" */
  insert_course_certificate_changelog?: Maybe<Course_Certificate_Changelog_Mutation_Response>;
  /** insert a single row into the table: "course_certificate_changelog" */
  insert_course_certificate_changelog_one?: Maybe<Course_Certificate_Changelog>;
  /** insert a single row into the table: "course_certificate" */
  insert_course_certificate_one?: Maybe<Course_Certificate>;
  /** insert data into the table: "course_delivery_type" */
  insert_course_delivery_type?: Maybe<Course_Delivery_Type_Mutation_Response>;
  /** insert a single row into the table: "course_delivery_type" */
  insert_course_delivery_type_one?: Maybe<Course_Delivery_Type>;
  /** insert data into the table: "course_evaluation_answers" */
  insert_course_evaluation_answers?: Maybe<Course_Evaluation_Answers_Mutation_Response>;
  /** insert a single row into the table: "course_evaluation_answers" */
  insert_course_evaluation_answers_one?: Maybe<Course_Evaluation_Answers>;
  /** insert data into the table: "course_evaluation_question_group" */
  insert_course_evaluation_question_group?: Maybe<Course_Evaluation_Question_Group_Mutation_Response>;
  /** insert a single row into the table: "course_evaluation_question_group" */
  insert_course_evaluation_question_group_one?: Maybe<Course_Evaluation_Question_Group>;
  /** insert data into the table: "course_evaluation_question_type" */
  insert_course_evaluation_question_type?: Maybe<Course_Evaluation_Question_Type_Mutation_Response>;
  /** insert a single row into the table: "course_evaluation_question_type" */
  insert_course_evaluation_question_type_one?: Maybe<Course_Evaluation_Question_Type>;
  /** insert data into the table: "course_evaluation_questions" */
  insert_course_evaluation_questions?: Maybe<Course_Evaluation_Questions_Mutation_Response>;
  /** insert a single row into the table: "course_evaluation_questions" */
  insert_course_evaluation_questions_one?: Maybe<Course_Evaluation_Questions>;
  /** insert data into the table: "course_invite_status" */
  insert_course_invite_status?: Maybe<Course_Invite_Status_Mutation_Response>;
  /** insert a single row into the table: "course_invite_status" */
  insert_course_invite_status_one?: Maybe<Course_Invite_Status>;
  /** insert data into the table: "course_invites" */
  insert_course_invites?: Maybe<Course_Invites_Mutation_Response>;
  /** insert a single row into the table: "course_invites" */
  insert_course_invites_one?: Maybe<Course_Invites>;
  /** insert data into the table: "course_level" */
  insert_course_level?: Maybe<Course_Level_Mutation_Response>;
  /** insert a single row into the table: "course_level" */
  insert_course_level_one?: Maybe<Course_Level>;
  /** insert data into the table: "course_module" */
  insert_course_module?: Maybe<Course_Module_Mutation_Response>;
  /** insert a single row into the table: "course_module" */
  insert_course_module_one?: Maybe<Course_Module>;
  /** insert a single row into the table: "course" */
  insert_course_one?: Maybe<Course>;
  /** insert data into the table: "course_participant" */
  insert_course_participant?: Maybe<Course_Participant_Mutation_Response>;
  /** insert data into the table: "course_participant_module" */
  insert_course_participant_module?: Maybe<Course_Participant_Module_Mutation_Response>;
  /** insert a single row into the table: "course_participant_module" */
  insert_course_participant_module_one?: Maybe<Course_Participant_Module>;
  /** insert a single row into the table: "course_participant" */
  insert_course_participant_one?: Maybe<Course_Participant>;
  /** insert data into the table: "course_schedule" */
  insert_course_schedule?: Maybe<Course_Schedule_Mutation_Response>;
  /** insert a single row into the table: "course_schedule" */
  insert_course_schedule_one?: Maybe<Course_Schedule>;
  /** insert data into the table: "course_status" */
  insert_course_status?: Maybe<Course_Status_Mutation_Response>;
  /** insert a single row into the table: "course_status" */
  insert_course_status_one?: Maybe<Course_Status>;
  /** insert data into the table: "course_trainer" */
  insert_course_trainer?: Maybe<Course_Trainer_Mutation_Response>;
  /** insert a single row into the table: "course_trainer" */
  insert_course_trainer_one?: Maybe<Course_Trainer>;
  /** insert data into the table: "course_trainer_type" */
  insert_course_trainer_type?: Maybe<Course_Trainer_Type_Mutation_Response>;
  /** insert a single row into the table: "course_trainer_type" */
  insert_course_trainer_type_one?: Maybe<Course_Trainer_Type>;
  /** insert data into the table: "course_type" */
  insert_course_type?: Maybe<Course_Type_Mutation_Response>;
  /** insert a single row into the table: "course_type" */
  insert_course_type_one?: Maybe<Course_Type>;
  /** insert data into the table: "grade" */
  insert_grade?: Maybe<Grade_Mutation_Response>;
  /** insert a single row into the table: "grade" */
  insert_grade_one?: Maybe<Grade>;
  /** insert data into the table: "identity" */
  insert_identity?: Maybe<Identity_Mutation_Response>;
  /** insert a single row into the table: "identity" */
  insert_identity_one?: Maybe<Identity>;
  /** insert data into the table: "identity_type" */
  insert_identity_type?: Maybe<Identity_Type_Mutation_Response>;
  /** insert a single row into the table: "identity_type" */
  insert_identity_type_one?: Maybe<Identity_Type>;
  /** insert data into the table: "legacy_certificate" */
  insert_legacy_certificate?: Maybe<Legacy_Certificate_Mutation_Response>;
  /** insert a single row into the table: "legacy_certificate" */
  insert_legacy_certificate_one?: Maybe<Legacy_Certificate>;
  /** insert data into the table: "module" */
  insert_module?: Maybe<Module_Mutation_Response>;
  /** insert data into the table: "module_category" */
  insert_module_category?: Maybe<Module_Category_Mutation_Response>;
  /** insert a single row into the table: "module_category" */
  insert_module_category_one?: Maybe<Module_Category>;
  /** insert data into the table: "module_group" */
  insert_module_group?: Maybe<Module_Group_Mutation_Response>;
  /** insert data into the table: "module_group_duration" */
  insert_module_group_duration?: Maybe<Module_Group_Duration_Mutation_Response>;
  /** insert a single row into the table: "module_group_duration" */
  insert_module_group_duration_one?: Maybe<Module_Group_Duration>;
  /** insert a single row into the table: "module_group" */
  insert_module_group_one?: Maybe<Module_Group>;
  /** insert a single row into the table: "module" */
  insert_module_one?: Maybe<Module>;
  /** insert data into the table: "order" */
  insert_order?: Maybe<Order_Mutation_Response>;
  /** insert a single row into the table: "order" */
  insert_order_one?: Maybe<Order>;
  /** insert data into the table: "organization" */
  insert_organization?: Maybe<Organization_Mutation_Response>;
  /** insert data into the table: "organization_group" */
  insert_organization_group?: Maybe<Organization_Group_Mutation_Response>;
  /** insert a single row into the table: "organization_group" */
  insert_organization_group_one?: Maybe<Organization_Group>;
  /** insert data into the table: "organization_member" */
  insert_organization_member?: Maybe<Organization_Member_Mutation_Response>;
  /** insert a single row into the table: "organization_member" */
  insert_organization_member_one?: Maybe<Organization_Member>;
  /** insert data into the table: "organization_member_role" */
  insert_organization_member_role?: Maybe<Organization_Member_Role_Mutation_Response>;
  /** insert a single row into the table: "organization_member_role" */
  insert_organization_member_role_one?: Maybe<Organization_Member_Role>;
  /** insert a single row into the table: "organization" */
  insert_organization_one?: Maybe<Organization>;
  /** insert data into the table: "organization_role" */
  insert_organization_role?: Maybe<Organization_Role_Mutation_Response>;
  /** insert a single row into the table: "organization_role" */
  insert_organization_role_one?: Maybe<Organization_Role>;
  /** insert data into the table: "organization_status" */
  insert_organization_status?: Maybe<Organization_Status_Mutation_Response>;
  /** insert a single row into the table: "organization_status" */
  insert_organization_status_one?: Maybe<Organization_Status>;
  /** insert data into the table: "payment_methods" */
  insert_payment_methods?: Maybe<Payment_Methods_Mutation_Response>;
  /** insert a single row into the table: "payment_methods" */
  insert_payment_methods_one?: Maybe<Payment_Methods>;
  /** insert data into the table: "profile" */
  insert_profile?: Maybe<Profile_Mutation_Response>;
  /** insert a single row into the table: "profile" */
  insert_profile_one?: Maybe<Profile>;
  /** insert data into the table: "profile_role" */
  insert_profile_role?: Maybe<Profile_Role_Mutation_Response>;
  /** insert a single row into the table: "profile_role" */
  insert_profile_role_one?: Maybe<Profile_Role>;
  /** insert data into the table: "profile_status" */
  insert_profile_status?: Maybe<Profile_Status_Mutation_Response>;
  /** insert a single row into the table: "profile_status" */
  insert_profile_status_one?: Maybe<Profile_Status>;
  /** insert data into the table: "profile_temp" */
  insert_profile_temp?: Maybe<Profile_Temp_Mutation_Response>;
  /** insert a single row into the table: "profile_temp" */
  insert_profile_temp_one?: Maybe<Profile_Temp>;
  /** insert data into the table: "resource" */
  insert_resource?: Maybe<Resource_Mutation_Response>;
  /** insert a single row into the table: "resource" */
  insert_resource_one?: Maybe<Resource>;
  /** insert data into the table: "role" */
  insert_role?: Maybe<Role_Mutation_Response>;
  /** insert a single row into the table: "role" */
  insert_role_one?: Maybe<Role>;
  /** insert data into the table: "venue" */
  insert_venue?: Maybe<Venue_Mutation_Response>;
  /** insert a single row into the table: "venue" */
  insert_venue_one?: Maybe<Venue>;
  /** insert data into the table: "waitlist" */
  insert_waitlist?: Maybe<Waitlist_Mutation_Response>;
  /** insert a single row into the table: "waitlist" */
  insert_waitlist_one?: Maybe<Waitlist>;
  /** Creates a membership plan */
  plansCreate?: Maybe<PlansCreateResult>;
  stripeCreatePaymentIntent?: Maybe<StripeCreatePaymentIntentOutput>;
  /** update data of the table: "blended_learning_status" */
  update_blended_learning_status?: Maybe<Blended_Learning_Status_Mutation_Response>;
  /** update single row of the table: "blended_learning_status" */
  update_blended_learning_status_by_pk?: Maybe<Blended_Learning_Status>;
  /** update data of the table: "color" */
  update_color?: Maybe<Color_Mutation_Response>;
  /** update single row of the table: "color" */
  update_color_by_pk?: Maybe<Color>;
  /** update data of the table: "course" */
  update_course?: Maybe<Course_Mutation_Response>;
  /** update single row of the table: "course" */
  update_course_by_pk?: Maybe<Course>;
  /** update data of the table: "course_certificate" */
  update_course_certificate?: Maybe<Course_Certificate_Mutation_Response>;
  /** update single row of the table: "course_certificate" */
  update_course_certificate_by_pk?: Maybe<Course_Certificate>;
  /** update data of the table: "course_certificate_changelog" */
  update_course_certificate_changelog?: Maybe<Course_Certificate_Changelog_Mutation_Response>;
  /** update single row of the table: "course_certificate_changelog" */
  update_course_certificate_changelog_by_pk?: Maybe<Course_Certificate_Changelog>;
  /** update data of the table: "course_delivery_type" */
  update_course_delivery_type?: Maybe<Course_Delivery_Type_Mutation_Response>;
  /** update single row of the table: "course_delivery_type" */
  update_course_delivery_type_by_pk?: Maybe<Course_Delivery_Type>;
  /** update data of the table: "course_evaluation_answers" */
  update_course_evaluation_answers?: Maybe<Course_Evaluation_Answers_Mutation_Response>;
  /** update single row of the table: "course_evaluation_answers" */
  update_course_evaluation_answers_by_pk?: Maybe<Course_Evaluation_Answers>;
  /** update data of the table: "course_evaluation_question_group" */
  update_course_evaluation_question_group?: Maybe<Course_Evaluation_Question_Group_Mutation_Response>;
  /** update single row of the table: "course_evaluation_question_group" */
  update_course_evaluation_question_group_by_pk?: Maybe<Course_Evaluation_Question_Group>;
  /** update data of the table: "course_evaluation_question_type" */
  update_course_evaluation_question_type?: Maybe<Course_Evaluation_Question_Type_Mutation_Response>;
  /** update single row of the table: "course_evaluation_question_type" */
  update_course_evaluation_question_type_by_pk?: Maybe<Course_Evaluation_Question_Type>;
  /** update data of the table: "course_evaluation_questions" */
  update_course_evaluation_questions?: Maybe<Course_Evaluation_Questions_Mutation_Response>;
  /** update single row of the table: "course_evaluation_questions" */
  update_course_evaluation_questions_by_pk?: Maybe<Course_Evaluation_Questions>;
  /** update data of the table: "course_invite_status" */
  update_course_invite_status?: Maybe<Course_Invite_Status_Mutation_Response>;
  /** update single row of the table: "course_invite_status" */
  update_course_invite_status_by_pk?: Maybe<Course_Invite_Status>;
  /** update data of the table: "course_invites" */
  update_course_invites?: Maybe<Course_Invites_Mutation_Response>;
  /** update single row of the table: "course_invites" */
  update_course_invites_by_pk?: Maybe<Course_Invites>;
  /** update data of the table: "course_level" */
  update_course_level?: Maybe<Course_Level_Mutation_Response>;
  /** update single row of the table: "course_level" */
  update_course_level_by_pk?: Maybe<Course_Level>;
  /** update data of the table: "course_module" */
  update_course_module?: Maybe<Course_Module_Mutation_Response>;
  /** update single row of the table: "course_module" */
  update_course_module_by_pk?: Maybe<Course_Module>;
  /** update data of the table: "course_participant" */
  update_course_participant?: Maybe<Course_Participant_Mutation_Response>;
  /** update single row of the table: "course_participant" */
  update_course_participant_by_pk?: Maybe<Course_Participant>;
  /** update data of the table: "course_participant_module" */
  update_course_participant_module?: Maybe<Course_Participant_Module_Mutation_Response>;
  /** update single row of the table: "course_participant_module" */
  update_course_participant_module_by_pk?: Maybe<Course_Participant_Module>;
  /** update data of the table: "course_schedule" */
  update_course_schedule?: Maybe<Course_Schedule_Mutation_Response>;
  /** update single row of the table: "course_schedule" */
  update_course_schedule_by_pk?: Maybe<Course_Schedule>;
  /** update data of the table: "course_status" */
  update_course_status?: Maybe<Course_Status_Mutation_Response>;
  /** update single row of the table: "course_status" */
  update_course_status_by_pk?: Maybe<Course_Status>;
  /** update data of the table: "course_trainer" */
  update_course_trainer?: Maybe<Course_Trainer_Mutation_Response>;
  /** update single row of the table: "course_trainer" */
  update_course_trainer_by_pk?: Maybe<Course_Trainer>;
  /** update data of the table: "course_trainer_type" */
  update_course_trainer_type?: Maybe<Course_Trainer_Type_Mutation_Response>;
  /** update single row of the table: "course_trainer_type" */
  update_course_trainer_type_by_pk?: Maybe<Course_Trainer_Type>;
  /** update data of the table: "course_type" */
  update_course_type?: Maybe<Course_Type_Mutation_Response>;
  /** update single row of the table: "course_type" */
  update_course_type_by_pk?: Maybe<Course_Type>;
  /** update data of the table: "grade" */
  update_grade?: Maybe<Grade_Mutation_Response>;
  /** update single row of the table: "grade" */
  update_grade_by_pk?: Maybe<Grade>;
  /** update data of the table: "identity" */
  update_identity?: Maybe<Identity_Mutation_Response>;
  /** update single row of the table: "identity" */
  update_identity_by_pk?: Maybe<Identity>;
  /** update data of the table: "identity_type" */
  update_identity_type?: Maybe<Identity_Type_Mutation_Response>;
  /** update single row of the table: "identity_type" */
  update_identity_type_by_pk?: Maybe<Identity_Type>;
  /** update data of the table: "legacy_certificate" */
  update_legacy_certificate?: Maybe<Legacy_Certificate_Mutation_Response>;
  /** update single row of the table: "legacy_certificate" */
  update_legacy_certificate_by_pk?: Maybe<Legacy_Certificate>;
  /** update data of the table: "module" */
  update_module?: Maybe<Module_Mutation_Response>;
  /** update single row of the table: "module" */
  update_module_by_pk?: Maybe<Module>;
  /** update data of the table: "module_category" */
  update_module_category?: Maybe<Module_Category_Mutation_Response>;
  /** update single row of the table: "module_category" */
  update_module_category_by_pk?: Maybe<Module_Category>;
  /** update data of the table: "module_group" */
  update_module_group?: Maybe<Module_Group_Mutation_Response>;
  /** update single row of the table: "module_group" */
  update_module_group_by_pk?: Maybe<Module_Group>;
  /** update data of the table: "module_group_duration" */
  update_module_group_duration?: Maybe<Module_Group_Duration_Mutation_Response>;
  /** update single row of the table: "module_group_duration" */
  update_module_group_duration_by_pk?: Maybe<Module_Group_Duration>;
  /** update data of the table: "order" */
  update_order?: Maybe<Order_Mutation_Response>;
  /** update single row of the table: "order" */
  update_order_by_pk?: Maybe<Order>;
  /** update data of the table: "organization" */
  update_organization?: Maybe<Organization_Mutation_Response>;
  /** update single row of the table: "organization" */
  update_organization_by_pk?: Maybe<Organization>;
  /** update data of the table: "organization_group" */
  update_organization_group?: Maybe<Organization_Group_Mutation_Response>;
  /** update single row of the table: "organization_group" */
  update_organization_group_by_pk?: Maybe<Organization_Group>;
  /** update data of the table: "organization_member" */
  update_organization_member?: Maybe<Organization_Member_Mutation_Response>;
  /** update single row of the table: "organization_member" */
  update_organization_member_by_pk?: Maybe<Organization_Member>;
  /** update data of the table: "organization_member_role" */
  update_organization_member_role?: Maybe<Organization_Member_Role_Mutation_Response>;
  /** update single row of the table: "organization_member_role" */
  update_organization_member_role_by_pk?: Maybe<Organization_Member_Role>;
  /** update data of the table: "organization_role" */
  update_organization_role?: Maybe<Organization_Role_Mutation_Response>;
  /** update single row of the table: "organization_role" */
  update_organization_role_by_pk?: Maybe<Organization_Role>;
  /** update data of the table: "organization_status" */
  update_organization_status?: Maybe<Organization_Status_Mutation_Response>;
  /** update single row of the table: "organization_status" */
  update_organization_status_by_pk?: Maybe<Organization_Status>;
  /** update data of the table: "payment_methods" */
  update_payment_methods?: Maybe<Payment_Methods_Mutation_Response>;
  /** update single row of the table: "payment_methods" */
  update_payment_methods_by_pk?: Maybe<Payment_Methods>;
  /** update data of the table: "profile" */
  update_profile?: Maybe<Profile_Mutation_Response>;
  /** update single row of the table: "profile" */
  update_profile_by_pk?: Maybe<Profile>;
  /** update data of the table: "profile_role" */
  update_profile_role?: Maybe<Profile_Role_Mutation_Response>;
  /** update single row of the table: "profile_role" */
  update_profile_role_by_pk?: Maybe<Profile_Role>;
  /** update data of the table: "profile_status" */
  update_profile_status?: Maybe<Profile_Status_Mutation_Response>;
  /** update single row of the table: "profile_status" */
  update_profile_status_by_pk?: Maybe<Profile_Status>;
  /** update data of the table: "profile_temp" */
  update_profile_temp?: Maybe<Profile_Temp_Mutation_Response>;
  /** update single row of the table: "profile_temp" */
  update_profile_temp_by_pk?: Maybe<Profile_Temp>;
  /** update data of the table: "resource" */
  update_resource?: Maybe<Resource_Mutation_Response>;
  /** update single row of the table: "resource" */
  update_resource_by_pk?: Maybe<Resource>;
  /** update data of the table: "role" */
  update_role?: Maybe<Role_Mutation_Response>;
  /** update single row of the table: "role" */
  update_role_by_pk?: Maybe<Role>;
  /** update data of the table: "venue" */
  update_venue?: Maybe<Venue_Mutation_Response>;
  /** update single row of the table: "venue" */
  update_venue_by_pk?: Maybe<Venue>;
  /** update data of the table: "waitlist" */
  update_waitlist?: Maybe<Waitlist_Mutation_Response>;
  /** update single row of the table: "waitlist" */
  update_waitlist_by_pk?: Maybe<Waitlist>;
  /** Creates or updates Zoom meeting with start date */
  upsertZoomMeeting?: Maybe<UpsertZoomMeetingPayload>;
};


/** mutation root */
export type Mutation_RootCreateStripeSubscriptionArgs = {
  customerId: Scalars['String'];
  priceId: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDeclineInviteArgs = {
  note?: InputMaybe<Scalars['String']>;
};


/** mutation root */
export type Mutation_RootDelete_Blended_Learning_StatusArgs = {
  where: Blended_Learning_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Blended_Learning_Status_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_ColorArgs = {
  where: Color_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Color_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_CourseArgs = {
  where: Course_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Course_CertificateArgs = {
  where: Course_Certificate_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Certificate_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Course_Certificate_ChangelogArgs = {
  where: Course_Certificate_Changelog_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Certificate_Changelog_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Course_Delivery_TypeArgs = {
  where: Course_Delivery_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Delivery_Type_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Course_Evaluation_AnswersArgs = {
  where: Course_Evaluation_Answers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Evaluation_Answers_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Course_Evaluation_Question_GroupArgs = {
  where: Course_Evaluation_Question_Group_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Evaluation_Question_Group_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Course_Evaluation_Question_TypeArgs = {
  where: Course_Evaluation_Question_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Evaluation_Question_Type_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Course_Evaluation_QuestionsArgs = {
  where: Course_Evaluation_Questions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Evaluation_Questions_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Course_Invite_StatusArgs = {
  where: Course_Invite_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Invite_Status_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Course_InvitesArgs = {
  where: Course_Invites_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Invites_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Course_LevelArgs = {
  where: Course_Level_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Level_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Course_ModuleArgs = {
  where: Course_Module_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Module_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Course_ParticipantArgs = {
  where: Course_Participant_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Participant_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Course_Participant_ModuleArgs = {
  where: Course_Participant_Module_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Participant_Module_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Course_ScheduleArgs = {
  where: Course_Schedule_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Schedule_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Course_StatusArgs = {
  where: Course_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Status_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Course_TrainerArgs = {
  where: Course_Trainer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Trainer_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Course_Trainer_TypeArgs = {
  where: Course_Trainer_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Trainer_Type_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Course_TypeArgs = {
  where: Course_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Type_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_GradeArgs = {
  where: Grade_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Grade_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_IdentityArgs = {
  where: Identity_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Identity_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Identity_TypeArgs = {
  where: Identity_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Identity_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Legacy_CertificateArgs = {
  where: Legacy_Certificate_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Legacy_Certificate_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_ModuleArgs = {
  where: Module_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Module_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Module_CategoryArgs = {
  where: Module_Category_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Module_Category_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Module_GroupArgs = {
  where: Module_Group_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Module_Group_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Module_Group_DurationArgs = {
  where: Module_Group_Duration_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Module_Group_Duration_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_OrderArgs = {
  where: Order_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Order_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_OrganizationArgs = {
  where: Organization_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Organization_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Organization_GroupArgs = {
  where: Organization_Group_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Organization_Group_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Organization_MemberArgs = {
  where: Organization_Member_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Organization_Member_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Organization_Member_RoleArgs = {
  where: Organization_Member_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Organization_Member_Role_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Organization_RoleArgs = {
  where: Organization_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Organization_Role_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Organization_StatusArgs = {
  where: Organization_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Organization_Status_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Payment_MethodsArgs = {
  where: Payment_Methods_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Payment_Methods_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_ProfileArgs = {
  where: Profile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Profile_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Profile_RoleArgs = {
  where: Profile_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Profile_Role_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Profile_StatusArgs = {
  where: Profile_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Profile_Status_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Profile_TempArgs = {
  where: Profile_Temp_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Profile_Temp_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_ResourceArgs = {
  where: Resource_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Resource_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_RoleArgs = {
  where: Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Role_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_VenueArgs = {
  where: Venue_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Venue_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_WaitlistArgs = {
  where: Waitlist_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Waitlist_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_Blended_Learning_StatusArgs = {
  objects: Array<Blended_Learning_Status_Insert_Input>;
  on_conflict?: InputMaybe<Blended_Learning_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Blended_Learning_Status_OneArgs = {
  object: Blended_Learning_Status_Insert_Input;
  on_conflict?: InputMaybe<Blended_Learning_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ColorArgs = {
  objects: Array<Color_Insert_Input>;
  on_conflict?: InputMaybe<Color_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Color_OneArgs = {
  object: Color_Insert_Input;
  on_conflict?: InputMaybe<Color_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_CourseArgs = {
  objects: Array<Course_Insert_Input>;
  on_conflict?: InputMaybe<Course_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_CertificateArgs = {
  objects: Array<Course_Certificate_Insert_Input>;
  on_conflict?: InputMaybe<Course_Certificate_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Certificate_ChangelogArgs = {
  objects: Array<Course_Certificate_Changelog_Insert_Input>;
  on_conflict?: InputMaybe<Course_Certificate_Changelog_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Certificate_Changelog_OneArgs = {
  object: Course_Certificate_Changelog_Insert_Input;
  on_conflict?: InputMaybe<Course_Certificate_Changelog_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Certificate_OneArgs = {
  object: Course_Certificate_Insert_Input;
  on_conflict?: InputMaybe<Course_Certificate_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Delivery_TypeArgs = {
  objects: Array<Course_Delivery_Type_Insert_Input>;
  on_conflict?: InputMaybe<Course_Delivery_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Delivery_Type_OneArgs = {
  object: Course_Delivery_Type_Insert_Input;
  on_conflict?: InputMaybe<Course_Delivery_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Evaluation_AnswersArgs = {
  objects: Array<Course_Evaluation_Answers_Insert_Input>;
  on_conflict?: InputMaybe<Course_Evaluation_Answers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Evaluation_Answers_OneArgs = {
  object: Course_Evaluation_Answers_Insert_Input;
  on_conflict?: InputMaybe<Course_Evaluation_Answers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Evaluation_Question_GroupArgs = {
  objects: Array<Course_Evaluation_Question_Group_Insert_Input>;
  on_conflict?: InputMaybe<Course_Evaluation_Question_Group_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Evaluation_Question_Group_OneArgs = {
  object: Course_Evaluation_Question_Group_Insert_Input;
  on_conflict?: InputMaybe<Course_Evaluation_Question_Group_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Evaluation_Question_TypeArgs = {
  objects: Array<Course_Evaluation_Question_Type_Insert_Input>;
  on_conflict?: InputMaybe<Course_Evaluation_Question_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Evaluation_Question_Type_OneArgs = {
  object: Course_Evaluation_Question_Type_Insert_Input;
  on_conflict?: InputMaybe<Course_Evaluation_Question_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Evaluation_QuestionsArgs = {
  objects: Array<Course_Evaluation_Questions_Insert_Input>;
  on_conflict?: InputMaybe<Course_Evaluation_Questions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Evaluation_Questions_OneArgs = {
  object: Course_Evaluation_Questions_Insert_Input;
  on_conflict?: InputMaybe<Course_Evaluation_Questions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Invite_StatusArgs = {
  objects: Array<Course_Invite_Status_Insert_Input>;
  on_conflict?: InputMaybe<Course_Invite_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Invite_Status_OneArgs = {
  object: Course_Invite_Status_Insert_Input;
  on_conflict?: InputMaybe<Course_Invite_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_InvitesArgs = {
  objects: Array<Course_Invites_Insert_Input>;
  on_conflict?: InputMaybe<Course_Invites_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Invites_OneArgs = {
  object: Course_Invites_Insert_Input;
  on_conflict?: InputMaybe<Course_Invites_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_LevelArgs = {
  objects: Array<Course_Level_Insert_Input>;
  on_conflict?: InputMaybe<Course_Level_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Level_OneArgs = {
  object: Course_Level_Insert_Input;
  on_conflict?: InputMaybe<Course_Level_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_ModuleArgs = {
  objects: Array<Course_Module_Insert_Input>;
  on_conflict?: InputMaybe<Course_Module_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Module_OneArgs = {
  object: Course_Module_Insert_Input;
  on_conflict?: InputMaybe<Course_Module_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_OneArgs = {
  object: Course_Insert_Input;
  on_conflict?: InputMaybe<Course_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_ParticipantArgs = {
  objects: Array<Course_Participant_Insert_Input>;
  on_conflict?: InputMaybe<Course_Participant_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Participant_ModuleArgs = {
  objects: Array<Course_Participant_Module_Insert_Input>;
  on_conflict?: InputMaybe<Course_Participant_Module_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Participant_Module_OneArgs = {
  object: Course_Participant_Module_Insert_Input;
  on_conflict?: InputMaybe<Course_Participant_Module_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Participant_OneArgs = {
  object: Course_Participant_Insert_Input;
  on_conflict?: InputMaybe<Course_Participant_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_ScheduleArgs = {
  objects: Array<Course_Schedule_Insert_Input>;
  on_conflict?: InputMaybe<Course_Schedule_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Schedule_OneArgs = {
  object: Course_Schedule_Insert_Input;
  on_conflict?: InputMaybe<Course_Schedule_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_StatusArgs = {
  objects: Array<Course_Status_Insert_Input>;
  on_conflict?: InputMaybe<Course_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Status_OneArgs = {
  object: Course_Status_Insert_Input;
  on_conflict?: InputMaybe<Course_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_TrainerArgs = {
  objects: Array<Course_Trainer_Insert_Input>;
  on_conflict?: InputMaybe<Course_Trainer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Trainer_OneArgs = {
  object: Course_Trainer_Insert_Input;
  on_conflict?: InputMaybe<Course_Trainer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Trainer_TypeArgs = {
  objects: Array<Course_Trainer_Type_Insert_Input>;
  on_conflict?: InputMaybe<Course_Trainer_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Trainer_Type_OneArgs = {
  object: Course_Trainer_Type_Insert_Input;
  on_conflict?: InputMaybe<Course_Trainer_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_TypeArgs = {
  objects: Array<Course_Type_Insert_Input>;
  on_conflict?: InputMaybe<Course_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Type_OneArgs = {
  object: Course_Type_Insert_Input;
  on_conflict?: InputMaybe<Course_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_GradeArgs = {
  objects: Array<Grade_Insert_Input>;
  on_conflict?: InputMaybe<Grade_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Grade_OneArgs = {
  object: Grade_Insert_Input;
  on_conflict?: InputMaybe<Grade_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_IdentityArgs = {
  objects: Array<Identity_Insert_Input>;
  on_conflict?: InputMaybe<Identity_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Identity_OneArgs = {
  object: Identity_Insert_Input;
  on_conflict?: InputMaybe<Identity_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Identity_TypeArgs = {
  objects: Array<Identity_Type_Insert_Input>;
  on_conflict?: InputMaybe<Identity_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Identity_Type_OneArgs = {
  object: Identity_Type_Insert_Input;
  on_conflict?: InputMaybe<Identity_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Legacy_CertificateArgs = {
  objects: Array<Legacy_Certificate_Insert_Input>;
  on_conflict?: InputMaybe<Legacy_Certificate_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Legacy_Certificate_OneArgs = {
  object: Legacy_Certificate_Insert_Input;
  on_conflict?: InputMaybe<Legacy_Certificate_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ModuleArgs = {
  objects: Array<Module_Insert_Input>;
  on_conflict?: InputMaybe<Module_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Module_CategoryArgs = {
  objects: Array<Module_Category_Insert_Input>;
  on_conflict?: InputMaybe<Module_Category_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Module_Category_OneArgs = {
  object: Module_Category_Insert_Input;
  on_conflict?: InputMaybe<Module_Category_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Module_GroupArgs = {
  objects: Array<Module_Group_Insert_Input>;
  on_conflict?: InputMaybe<Module_Group_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Module_Group_DurationArgs = {
  objects: Array<Module_Group_Duration_Insert_Input>;
  on_conflict?: InputMaybe<Module_Group_Duration_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Module_Group_Duration_OneArgs = {
  object: Module_Group_Duration_Insert_Input;
  on_conflict?: InputMaybe<Module_Group_Duration_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Module_Group_OneArgs = {
  object: Module_Group_Insert_Input;
  on_conflict?: InputMaybe<Module_Group_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Module_OneArgs = {
  object: Module_Insert_Input;
  on_conflict?: InputMaybe<Module_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_OrderArgs = {
  objects: Array<Order_Insert_Input>;
  on_conflict?: InputMaybe<Order_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Order_OneArgs = {
  object: Order_Insert_Input;
  on_conflict?: InputMaybe<Order_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_OrganizationArgs = {
  objects: Array<Organization_Insert_Input>;
  on_conflict?: InputMaybe<Organization_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_GroupArgs = {
  objects: Array<Organization_Group_Insert_Input>;
  on_conflict?: InputMaybe<Organization_Group_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_Group_OneArgs = {
  object: Organization_Group_Insert_Input;
  on_conflict?: InputMaybe<Organization_Group_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_MemberArgs = {
  objects: Array<Organization_Member_Insert_Input>;
  on_conflict?: InputMaybe<Organization_Member_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_Member_OneArgs = {
  object: Organization_Member_Insert_Input;
  on_conflict?: InputMaybe<Organization_Member_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_Member_RoleArgs = {
  objects: Array<Organization_Member_Role_Insert_Input>;
  on_conflict?: InputMaybe<Organization_Member_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_Member_Role_OneArgs = {
  object: Organization_Member_Role_Insert_Input;
  on_conflict?: InputMaybe<Organization_Member_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_OneArgs = {
  object: Organization_Insert_Input;
  on_conflict?: InputMaybe<Organization_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_RoleArgs = {
  objects: Array<Organization_Role_Insert_Input>;
  on_conflict?: InputMaybe<Organization_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_Role_OneArgs = {
  object: Organization_Role_Insert_Input;
  on_conflict?: InputMaybe<Organization_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_StatusArgs = {
  objects: Array<Organization_Status_Insert_Input>;
  on_conflict?: InputMaybe<Organization_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Organization_Status_OneArgs = {
  object: Organization_Status_Insert_Input;
  on_conflict?: InputMaybe<Organization_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Payment_MethodsArgs = {
  objects: Array<Payment_Methods_Insert_Input>;
  on_conflict?: InputMaybe<Payment_Methods_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Payment_Methods_OneArgs = {
  object: Payment_Methods_Insert_Input;
  on_conflict?: InputMaybe<Payment_Methods_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ProfileArgs = {
  objects: Array<Profile_Insert_Input>;
  on_conflict?: InputMaybe<Profile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Profile_OneArgs = {
  object: Profile_Insert_Input;
  on_conflict?: InputMaybe<Profile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Profile_RoleArgs = {
  objects: Array<Profile_Role_Insert_Input>;
  on_conflict?: InputMaybe<Profile_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Profile_Role_OneArgs = {
  object: Profile_Role_Insert_Input;
  on_conflict?: InputMaybe<Profile_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Profile_StatusArgs = {
  objects: Array<Profile_Status_Insert_Input>;
  on_conflict?: InputMaybe<Profile_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Profile_Status_OneArgs = {
  object: Profile_Status_Insert_Input;
  on_conflict?: InputMaybe<Profile_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Profile_TempArgs = {
  objects: Array<Profile_Temp_Insert_Input>;
  on_conflict?: InputMaybe<Profile_Temp_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Profile_Temp_OneArgs = {
  object: Profile_Temp_Insert_Input;
  on_conflict?: InputMaybe<Profile_Temp_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ResourceArgs = {
  objects: Array<Resource_Insert_Input>;
  on_conflict?: InputMaybe<Resource_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Resource_OneArgs = {
  object: Resource_Insert_Input;
  on_conflict?: InputMaybe<Resource_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_RoleArgs = {
  objects: Array<Role_Insert_Input>;
  on_conflict?: InputMaybe<Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Role_OneArgs = {
  object: Role_Insert_Input;
  on_conflict?: InputMaybe<Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_VenueArgs = {
  objects: Array<Venue_Insert_Input>;
  on_conflict?: InputMaybe<Venue_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Venue_OneArgs = {
  object: Venue_Insert_Input;
  on_conflict?: InputMaybe<Venue_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_WaitlistArgs = {
  objects: Array<Waitlist_Insert_Input>;
  on_conflict?: InputMaybe<Waitlist_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Waitlist_OneArgs = {
  object: Waitlist_Insert_Input;
  on_conflict?: InputMaybe<Waitlist_On_Conflict>;
};


/** mutation root */
export type Mutation_RootPlansCreateArgs = {
  data: PlansCreateInput;
};


/** mutation root */
export type Mutation_RootStripeCreatePaymentIntentArgs = {
  input: StripeCreatePaymentIntentInput;
};


/** mutation root */
export type Mutation_RootUpdate_Blended_Learning_StatusArgs = {
  _set?: InputMaybe<Blended_Learning_Status_Set_Input>;
  where: Blended_Learning_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Blended_Learning_Status_By_PkArgs = {
  _set?: InputMaybe<Blended_Learning_Status_Set_Input>;
  pk_columns: Blended_Learning_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_ColorArgs = {
  _set?: InputMaybe<Color_Set_Input>;
  where: Color_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Color_By_PkArgs = {
  _set?: InputMaybe<Color_Set_Input>;
  pk_columns: Color_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_CourseArgs = {
  _inc?: InputMaybe<Course_Inc_Input>;
  _set?: InputMaybe<Course_Set_Input>;
  where: Course_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_By_PkArgs = {
  _inc?: InputMaybe<Course_Inc_Input>;
  _set?: InputMaybe<Course_Set_Input>;
  pk_columns: Course_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_CertificateArgs = {
  _inc?: InputMaybe<Course_Certificate_Inc_Input>;
  _set?: InputMaybe<Course_Certificate_Set_Input>;
  where: Course_Certificate_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Certificate_By_PkArgs = {
  _inc?: InputMaybe<Course_Certificate_Inc_Input>;
  _set?: InputMaybe<Course_Certificate_Set_Input>;
  pk_columns: Course_Certificate_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Certificate_ChangelogArgs = {
  _set?: InputMaybe<Course_Certificate_Changelog_Set_Input>;
  where: Course_Certificate_Changelog_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Certificate_Changelog_By_PkArgs = {
  _set?: InputMaybe<Course_Certificate_Changelog_Set_Input>;
  pk_columns: Course_Certificate_Changelog_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Delivery_TypeArgs = {
  _set?: InputMaybe<Course_Delivery_Type_Set_Input>;
  where: Course_Delivery_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Delivery_Type_By_PkArgs = {
  _set?: InputMaybe<Course_Delivery_Type_Set_Input>;
  pk_columns: Course_Delivery_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Evaluation_AnswersArgs = {
  _inc?: InputMaybe<Course_Evaluation_Answers_Inc_Input>;
  _set?: InputMaybe<Course_Evaluation_Answers_Set_Input>;
  where: Course_Evaluation_Answers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Evaluation_Answers_By_PkArgs = {
  _inc?: InputMaybe<Course_Evaluation_Answers_Inc_Input>;
  _set?: InputMaybe<Course_Evaluation_Answers_Set_Input>;
  pk_columns: Course_Evaluation_Answers_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Evaluation_Question_GroupArgs = {
  _set?: InputMaybe<Course_Evaluation_Question_Group_Set_Input>;
  where: Course_Evaluation_Question_Group_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Evaluation_Question_Group_By_PkArgs = {
  _set?: InputMaybe<Course_Evaluation_Question_Group_Set_Input>;
  pk_columns: Course_Evaluation_Question_Group_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Evaluation_Question_TypeArgs = {
  _set?: InputMaybe<Course_Evaluation_Question_Type_Set_Input>;
  where: Course_Evaluation_Question_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Evaluation_Question_Type_By_PkArgs = {
  _set?: InputMaybe<Course_Evaluation_Question_Type_Set_Input>;
  pk_columns: Course_Evaluation_Question_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Evaluation_QuestionsArgs = {
  _inc?: InputMaybe<Course_Evaluation_Questions_Inc_Input>;
  _set?: InputMaybe<Course_Evaluation_Questions_Set_Input>;
  where: Course_Evaluation_Questions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Evaluation_Questions_By_PkArgs = {
  _inc?: InputMaybe<Course_Evaluation_Questions_Inc_Input>;
  _set?: InputMaybe<Course_Evaluation_Questions_Set_Input>;
  pk_columns: Course_Evaluation_Questions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Invite_StatusArgs = {
  _set?: InputMaybe<Course_Invite_Status_Set_Input>;
  where: Course_Invite_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Invite_Status_By_PkArgs = {
  _set?: InputMaybe<Course_Invite_Status_Set_Input>;
  pk_columns: Course_Invite_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_InvitesArgs = {
  _inc?: InputMaybe<Course_Invites_Inc_Input>;
  _set?: InputMaybe<Course_Invites_Set_Input>;
  where: Course_Invites_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Invites_By_PkArgs = {
  _inc?: InputMaybe<Course_Invites_Inc_Input>;
  _set?: InputMaybe<Course_Invites_Set_Input>;
  pk_columns: Course_Invites_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_LevelArgs = {
  _set?: InputMaybe<Course_Level_Set_Input>;
  where: Course_Level_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Level_By_PkArgs = {
  _set?: InputMaybe<Course_Level_Set_Input>;
  pk_columns: Course_Level_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_ModuleArgs = {
  _inc?: InputMaybe<Course_Module_Inc_Input>;
  _set?: InputMaybe<Course_Module_Set_Input>;
  where: Course_Module_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Module_By_PkArgs = {
  _inc?: InputMaybe<Course_Module_Inc_Input>;
  _set?: InputMaybe<Course_Module_Set_Input>;
  pk_columns: Course_Module_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_ParticipantArgs = {
  _inc?: InputMaybe<Course_Participant_Inc_Input>;
  _set?: InputMaybe<Course_Participant_Set_Input>;
  where: Course_Participant_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Participant_By_PkArgs = {
  _inc?: InputMaybe<Course_Participant_Inc_Input>;
  _set?: InputMaybe<Course_Participant_Set_Input>;
  pk_columns: Course_Participant_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Participant_ModuleArgs = {
  _set?: InputMaybe<Course_Participant_Module_Set_Input>;
  where: Course_Participant_Module_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Participant_Module_By_PkArgs = {
  _set?: InputMaybe<Course_Participant_Module_Set_Input>;
  pk_columns: Course_Participant_Module_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_ScheduleArgs = {
  _inc?: InputMaybe<Course_Schedule_Inc_Input>;
  _set?: InputMaybe<Course_Schedule_Set_Input>;
  where: Course_Schedule_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Schedule_By_PkArgs = {
  _inc?: InputMaybe<Course_Schedule_Inc_Input>;
  _set?: InputMaybe<Course_Schedule_Set_Input>;
  pk_columns: Course_Schedule_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_StatusArgs = {
  _set?: InputMaybe<Course_Status_Set_Input>;
  where: Course_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Status_By_PkArgs = {
  _set?: InputMaybe<Course_Status_Set_Input>;
  pk_columns: Course_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_TrainerArgs = {
  _inc?: InputMaybe<Course_Trainer_Inc_Input>;
  _set?: InputMaybe<Course_Trainer_Set_Input>;
  where: Course_Trainer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Trainer_By_PkArgs = {
  _inc?: InputMaybe<Course_Trainer_Inc_Input>;
  _set?: InputMaybe<Course_Trainer_Set_Input>;
  pk_columns: Course_Trainer_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Trainer_TypeArgs = {
  _set?: InputMaybe<Course_Trainer_Type_Set_Input>;
  where: Course_Trainer_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Trainer_Type_By_PkArgs = {
  _set?: InputMaybe<Course_Trainer_Type_Set_Input>;
  pk_columns: Course_Trainer_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_TypeArgs = {
  _set?: InputMaybe<Course_Type_Set_Input>;
  where: Course_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Type_By_PkArgs = {
  _set?: InputMaybe<Course_Type_Set_Input>;
  pk_columns: Course_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_GradeArgs = {
  _set?: InputMaybe<Grade_Set_Input>;
  where: Grade_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Grade_By_PkArgs = {
  _set?: InputMaybe<Grade_Set_Input>;
  pk_columns: Grade_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_IdentityArgs = {
  _set?: InputMaybe<Identity_Set_Input>;
  where: Identity_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Identity_By_PkArgs = {
  _set?: InputMaybe<Identity_Set_Input>;
  pk_columns: Identity_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Identity_TypeArgs = {
  _set?: InputMaybe<Identity_Type_Set_Input>;
  where: Identity_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Identity_Type_By_PkArgs = {
  _set?: InputMaybe<Identity_Type_Set_Input>;
  pk_columns: Identity_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Legacy_CertificateArgs = {
  _append?: InputMaybe<Legacy_Certificate_Append_Input>;
  _delete_at_path?: InputMaybe<Legacy_Certificate_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Legacy_Certificate_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Legacy_Certificate_Delete_Key_Input>;
  _inc?: InputMaybe<Legacy_Certificate_Inc_Input>;
  _prepend?: InputMaybe<Legacy_Certificate_Prepend_Input>;
  _set?: InputMaybe<Legacy_Certificate_Set_Input>;
  where: Legacy_Certificate_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Legacy_Certificate_By_PkArgs = {
  _append?: InputMaybe<Legacy_Certificate_Append_Input>;
  _delete_at_path?: InputMaybe<Legacy_Certificate_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Legacy_Certificate_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Legacy_Certificate_Delete_Key_Input>;
  _inc?: InputMaybe<Legacy_Certificate_Inc_Input>;
  _prepend?: InputMaybe<Legacy_Certificate_Prepend_Input>;
  _set?: InputMaybe<Legacy_Certificate_Set_Input>;
  pk_columns: Legacy_Certificate_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_ModuleArgs = {
  _set?: InputMaybe<Module_Set_Input>;
  where: Module_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Module_By_PkArgs = {
  _set?: InputMaybe<Module_Set_Input>;
  pk_columns: Module_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Module_CategoryArgs = {
  _set?: InputMaybe<Module_Category_Set_Input>;
  where: Module_Category_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Module_Category_By_PkArgs = {
  _set?: InputMaybe<Module_Category_Set_Input>;
  pk_columns: Module_Category_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Module_GroupArgs = {
  _set?: InputMaybe<Module_Group_Set_Input>;
  where: Module_Group_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Module_Group_By_PkArgs = {
  _set?: InputMaybe<Module_Group_Set_Input>;
  pk_columns: Module_Group_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Module_Group_DurationArgs = {
  _inc?: InputMaybe<Module_Group_Duration_Inc_Input>;
  _set?: InputMaybe<Module_Group_Duration_Set_Input>;
  where: Module_Group_Duration_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Module_Group_Duration_By_PkArgs = {
  _inc?: InputMaybe<Module_Group_Duration_Inc_Input>;
  _set?: InputMaybe<Module_Group_Duration_Set_Input>;
  pk_columns: Module_Group_Duration_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_OrderArgs = {
  _inc?: InputMaybe<Order_Inc_Input>;
  _set?: InputMaybe<Order_Set_Input>;
  where: Order_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Order_By_PkArgs = {
  _inc?: InputMaybe<Order_Inc_Input>;
  _set?: InputMaybe<Order_Set_Input>;
  pk_columns: Order_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_OrganizationArgs = {
  _append?: InputMaybe<Organization_Append_Input>;
  _delete_at_path?: InputMaybe<Organization_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Organization_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Organization_Delete_Key_Input>;
  _prepend?: InputMaybe<Organization_Prepend_Input>;
  _set?: InputMaybe<Organization_Set_Input>;
  where: Organization_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_By_PkArgs = {
  _append?: InputMaybe<Organization_Append_Input>;
  _delete_at_path?: InputMaybe<Organization_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Organization_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Organization_Delete_Key_Input>;
  _prepend?: InputMaybe<Organization_Prepend_Input>;
  _set?: InputMaybe<Organization_Set_Input>;
  pk_columns: Organization_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_GroupArgs = {
  _set?: InputMaybe<Organization_Group_Set_Input>;
  where: Organization_Group_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Group_By_PkArgs = {
  _set?: InputMaybe<Organization_Group_Set_Input>;
  pk_columns: Organization_Group_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_MemberArgs = {
  _set?: InputMaybe<Organization_Member_Set_Input>;
  where: Organization_Member_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Member_By_PkArgs = {
  _set?: InputMaybe<Organization_Member_Set_Input>;
  pk_columns: Organization_Member_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Member_RoleArgs = {
  _set?: InputMaybe<Organization_Member_Role_Set_Input>;
  where: Organization_Member_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Member_Role_By_PkArgs = {
  _set?: InputMaybe<Organization_Member_Role_Set_Input>;
  pk_columns: Organization_Member_Role_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_RoleArgs = {
  _set?: InputMaybe<Organization_Role_Set_Input>;
  where: Organization_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Role_By_PkArgs = {
  _set?: InputMaybe<Organization_Role_Set_Input>;
  pk_columns: Organization_Role_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_StatusArgs = {
  _set?: InputMaybe<Organization_Status_Set_Input>;
  where: Organization_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Organization_Status_By_PkArgs = {
  _set?: InputMaybe<Organization_Status_Set_Input>;
  pk_columns: Organization_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Payment_MethodsArgs = {
  _set?: InputMaybe<Payment_Methods_Set_Input>;
  where: Payment_Methods_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Payment_Methods_By_PkArgs = {
  _set?: InputMaybe<Payment_Methods_Set_Input>;
  pk_columns: Payment_Methods_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_ProfileArgs = {
  _append?: InputMaybe<Profile_Append_Input>;
  _delete_at_path?: InputMaybe<Profile_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Profile_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Profile_Delete_Key_Input>;
  _inc?: InputMaybe<Profile_Inc_Input>;
  _prepend?: InputMaybe<Profile_Prepend_Input>;
  _set?: InputMaybe<Profile_Set_Input>;
  where: Profile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Profile_By_PkArgs = {
  _append?: InputMaybe<Profile_Append_Input>;
  _delete_at_path?: InputMaybe<Profile_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Profile_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Profile_Delete_Key_Input>;
  _inc?: InputMaybe<Profile_Inc_Input>;
  _prepend?: InputMaybe<Profile_Prepend_Input>;
  _set?: InputMaybe<Profile_Set_Input>;
  pk_columns: Profile_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Profile_RoleArgs = {
  _set?: InputMaybe<Profile_Role_Set_Input>;
  where: Profile_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Profile_Role_By_PkArgs = {
  _set?: InputMaybe<Profile_Role_Set_Input>;
  pk_columns: Profile_Role_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Profile_StatusArgs = {
  _set?: InputMaybe<Profile_Status_Set_Input>;
  where: Profile_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Profile_Status_By_PkArgs = {
  _set?: InputMaybe<Profile_Status_Set_Input>;
  pk_columns: Profile_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Profile_TempArgs = {
  _inc?: InputMaybe<Profile_Temp_Inc_Input>;
  _set?: InputMaybe<Profile_Temp_Set_Input>;
  where: Profile_Temp_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Profile_Temp_By_PkArgs = {
  _inc?: InputMaybe<Profile_Temp_Inc_Input>;
  _set?: InputMaybe<Profile_Temp_Set_Input>;
  pk_columns: Profile_Temp_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_ResourceArgs = {
  _set?: InputMaybe<Resource_Set_Input>;
  where: Resource_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Resource_By_PkArgs = {
  _set?: InputMaybe<Resource_Set_Input>;
  pk_columns: Resource_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_RoleArgs = {
  _append?: InputMaybe<Role_Append_Input>;
  _delete_at_path?: InputMaybe<Role_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Role_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Role_Delete_Key_Input>;
  _inc?: InputMaybe<Role_Inc_Input>;
  _prepend?: InputMaybe<Role_Prepend_Input>;
  _set?: InputMaybe<Role_Set_Input>;
  where: Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Role_By_PkArgs = {
  _append?: InputMaybe<Role_Append_Input>;
  _delete_at_path?: InputMaybe<Role_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Role_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Role_Delete_Key_Input>;
  _inc?: InputMaybe<Role_Inc_Input>;
  _prepend?: InputMaybe<Role_Prepend_Input>;
  _set?: InputMaybe<Role_Set_Input>;
  pk_columns: Role_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_VenueArgs = {
  _set?: InputMaybe<Venue_Set_Input>;
  where: Venue_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Venue_By_PkArgs = {
  _set?: InputMaybe<Venue_Set_Input>;
  pk_columns: Venue_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_WaitlistArgs = {
  _inc?: InputMaybe<Waitlist_Inc_Input>;
  _set?: InputMaybe<Waitlist_Set_Input>;
  where: Waitlist_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Waitlist_By_PkArgs = {
  _inc?: InputMaybe<Waitlist_Inc_Input>;
  _set?: InputMaybe<Waitlist_Set_Input>;
  pk_columns: Waitlist_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpsertZoomMeetingArgs = {
  input?: InputMaybe<UpsertZoomMeetingInput>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']>;
  _gt?: InputMaybe<Scalars['numeric']>;
  _gte?: InputMaybe<Scalars['numeric']>;
  _in?: InputMaybe<Array<Scalars['numeric']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['numeric']>;
  _lte?: InputMaybe<Scalars['numeric']>;
  _neq?: InputMaybe<Scalars['numeric']>;
  _nin?: InputMaybe<Array<Scalars['numeric']>>;
};

/** columns and relationships of "order" */
export type Order = {
  __typename?: 'order';
  billingAddress: Scalars['String'];
  billingEmail: Scalars['String'];
  billingFamilyName: Scalars['String'];
  billingGivenName: Scalars['String'];
  billingPhone: Scalars['String'];
  /** An object relationship */
  course: Course;
  courseId: Scalars['Int'];
  createdAt: Scalars['timestamptz'];
  currency?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  orderTotal?: Maybe<Scalars['float8']>;
  /** An object relationship */
  organization: Organization;
  organizationId: Scalars['uuid'];
  paymentMethod: Payment_Methods_Enum;
  price?: Maybe<Scalars['float8']>;
  profileId: Scalars['uuid'];
  promoCodes?: Maybe<Scalars['json']>;
  quantity: Scalars['Int'];
  registrants: Scalars['json'];
  stripePaymentId?: Maybe<Scalars['String']>;
  vat?: Maybe<Scalars['float8']>;
};


/** columns and relationships of "order" */
export type OrderPromoCodesArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "order" */
export type OrderRegistrantsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "order" */
export type Order_Aggregate = {
  __typename?: 'order_aggregate';
  aggregate?: Maybe<Order_Aggregate_Fields>;
  nodes: Array<Order>;
};

/** aggregate fields of "order" */
export type Order_Aggregate_Fields = {
  __typename?: 'order_aggregate_fields';
  avg?: Maybe<Order_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Order_Max_Fields>;
  min?: Maybe<Order_Min_Fields>;
  stddev?: Maybe<Order_Stddev_Fields>;
  stddev_pop?: Maybe<Order_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Order_Stddev_Samp_Fields>;
  sum?: Maybe<Order_Sum_Fields>;
  var_pop?: Maybe<Order_Var_Pop_Fields>;
  var_samp?: Maybe<Order_Var_Samp_Fields>;
  variance?: Maybe<Order_Variance_Fields>;
};


/** aggregate fields of "order" */
export type Order_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Order_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Order_Avg_Fields = {
  __typename?: 'order_avg_fields';
  courseId?: Maybe<Scalars['Float']>;
  orderTotal?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  vat?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "order". All fields are combined with a logical 'AND'. */
export type Order_Bool_Exp = {
  _and?: InputMaybe<Array<Order_Bool_Exp>>;
  _not?: InputMaybe<Order_Bool_Exp>;
  _or?: InputMaybe<Array<Order_Bool_Exp>>;
  billingAddress?: InputMaybe<String_Comparison_Exp>;
  billingEmail?: InputMaybe<String_Comparison_Exp>;
  billingFamilyName?: InputMaybe<String_Comparison_Exp>;
  billingGivenName?: InputMaybe<String_Comparison_Exp>;
  billingPhone?: InputMaybe<String_Comparison_Exp>;
  course?: InputMaybe<Course_Bool_Exp>;
  courseId?: InputMaybe<Int_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  currency?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  orderTotal?: InputMaybe<Float8_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organizationId?: InputMaybe<Uuid_Comparison_Exp>;
  paymentMethod?: InputMaybe<Payment_Methods_Enum_Comparison_Exp>;
  price?: InputMaybe<Float8_Comparison_Exp>;
  profileId?: InputMaybe<Uuid_Comparison_Exp>;
  promoCodes?: InputMaybe<Json_Comparison_Exp>;
  quantity?: InputMaybe<Int_Comparison_Exp>;
  registrants?: InputMaybe<Json_Comparison_Exp>;
  stripePaymentId?: InputMaybe<String_Comparison_Exp>;
  vat?: InputMaybe<Float8_Comparison_Exp>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** unique or primary key constraints on table "order" */
export enum Order_Constraint {
  /** unique or primary key constraint */
  OrderPkey = 'order_pkey'
}

/** input type for incrementing numeric columns in table "order" */
export type Order_Inc_Input = {
  courseId?: InputMaybe<Scalars['Int']>;
  orderTotal?: InputMaybe<Scalars['float8']>;
  price?: InputMaybe<Scalars['float8']>;
  quantity?: InputMaybe<Scalars['Int']>;
  vat?: InputMaybe<Scalars['float8']>;
};

/** input type for inserting data into table "order" */
export type Order_Insert_Input = {
  billingAddress?: InputMaybe<Scalars['String']>;
  billingEmail?: InputMaybe<Scalars['String']>;
  billingFamilyName?: InputMaybe<Scalars['String']>;
  billingGivenName?: InputMaybe<Scalars['String']>;
  billingPhone?: InputMaybe<Scalars['String']>;
  course?: InputMaybe<Course_Obj_Rel_Insert_Input>;
  courseId?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  currency?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  orderTotal?: InputMaybe<Scalars['float8']>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organizationId?: InputMaybe<Scalars['uuid']>;
  paymentMethod?: InputMaybe<Payment_Methods_Enum>;
  price?: InputMaybe<Scalars['float8']>;
  profileId?: InputMaybe<Scalars['uuid']>;
  promoCodes?: InputMaybe<Scalars['json']>;
  quantity?: InputMaybe<Scalars['Int']>;
  registrants?: InputMaybe<Scalars['json']>;
  stripePaymentId?: InputMaybe<Scalars['String']>;
  vat?: InputMaybe<Scalars['float8']>;
};

/** aggregate max on columns */
export type Order_Max_Fields = {
  __typename?: 'order_max_fields';
  billingAddress?: Maybe<Scalars['String']>;
  billingEmail?: Maybe<Scalars['String']>;
  billingFamilyName?: Maybe<Scalars['String']>;
  billingGivenName?: Maybe<Scalars['String']>;
  billingPhone?: Maybe<Scalars['String']>;
  courseId?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  currency?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  orderTotal?: Maybe<Scalars['float8']>;
  organizationId?: Maybe<Scalars['uuid']>;
  price?: Maybe<Scalars['float8']>;
  profileId?: Maybe<Scalars['uuid']>;
  quantity?: Maybe<Scalars['Int']>;
  stripePaymentId?: Maybe<Scalars['String']>;
  vat?: Maybe<Scalars['float8']>;
};

/** aggregate min on columns */
export type Order_Min_Fields = {
  __typename?: 'order_min_fields';
  billingAddress?: Maybe<Scalars['String']>;
  billingEmail?: Maybe<Scalars['String']>;
  billingFamilyName?: Maybe<Scalars['String']>;
  billingGivenName?: Maybe<Scalars['String']>;
  billingPhone?: Maybe<Scalars['String']>;
  courseId?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  currency?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  orderTotal?: Maybe<Scalars['float8']>;
  organizationId?: Maybe<Scalars['uuid']>;
  price?: Maybe<Scalars['float8']>;
  profileId?: Maybe<Scalars['uuid']>;
  quantity?: Maybe<Scalars['Int']>;
  stripePaymentId?: Maybe<Scalars['String']>;
  vat?: Maybe<Scalars['float8']>;
};

/** response of any mutation on the table "order" */
export type Order_Mutation_Response = {
  __typename?: 'order_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Order>;
};

/** on_conflict condition type for table "order" */
export type Order_On_Conflict = {
  constraint: Order_Constraint;
  update_columns?: Array<Order_Update_Column>;
  where?: InputMaybe<Order_Bool_Exp>;
};

/** Ordering options when selecting data from "order". */
export type Order_Order_By = {
  billingAddress?: InputMaybe<Order_By>;
  billingEmail?: InputMaybe<Order_By>;
  billingFamilyName?: InputMaybe<Order_By>;
  billingGivenName?: InputMaybe<Order_By>;
  billingPhone?: InputMaybe<Order_By>;
  course?: InputMaybe<Course_Order_By>;
  courseId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  orderTotal?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organizationId?: InputMaybe<Order_By>;
  paymentMethod?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  profileId?: InputMaybe<Order_By>;
  promoCodes?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  registrants?: InputMaybe<Order_By>;
  stripePaymentId?: InputMaybe<Order_By>;
  vat?: InputMaybe<Order_By>;
};

/** primary key columns input for table: order */
export type Order_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "order" */
export enum Order_Select_Column {
  /** column name */
  BillingAddress = 'billingAddress',
  /** column name */
  BillingEmail = 'billingEmail',
  /** column name */
  BillingFamilyName = 'billingFamilyName',
  /** column name */
  BillingGivenName = 'billingGivenName',
  /** column name */
  BillingPhone = 'billingPhone',
  /** column name */
  CourseId = 'courseId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Currency = 'currency',
  /** column name */
  Id = 'id',
  /** column name */
  OrderTotal = 'orderTotal',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  PaymentMethod = 'paymentMethod',
  /** column name */
  Price = 'price',
  /** column name */
  ProfileId = 'profileId',
  /** column name */
  PromoCodes = 'promoCodes',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  Registrants = 'registrants',
  /** column name */
  StripePaymentId = 'stripePaymentId',
  /** column name */
  Vat = 'vat'
}

/** input type for updating data in table "order" */
export type Order_Set_Input = {
  billingAddress?: InputMaybe<Scalars['String']>;
  billingEmail?: InputMaybe<Scalars['String']>;
  billingFamilyName?: InputMaybe<Scalars['String']>;
  billingGivenName?: InputMaybe<Scalars['String']>;
  billingPhone?: InputMaybe<Scalars['String']>;
  courseId?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  currency?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  orderTotal?: InputMaybe<Scalars['float8']>;
  organizationId?: InputMaybe<Scalars['uuid']>;
  paymentMethod?: InputMaybe<Payment_Methods_Enum>;
  price?: InputMaybe<Scalars['float8']>;
  profileId?: InputMaybe<Scalars['uuid']>;
  promoCodes?: InputMaybe<Scalars['json']>;
  quantity?: InputMaybe<Scalars['Int']>;
  registrants?: InputMaybe<Scalars['json']>;
  stripePaymentId?: InputMaybe<Scalars['String']>;
  vat?: InputMaybe<Scalars['float8']>;
};

/** aggregate stddev on columns */
export type Order_Stddev_Fields = {
  __typename?: 'order_stddev_fields';
  courseId?: Maybe<Scalars['Float']>;
  orderTotal?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  vat?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Order_Stddev_Pop_Fields = {
  __typename?: 'order_stddev_pop_fields';
  courseId?: Maybe<Scalars['Float']>;
  orderTotal?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  vat?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Order_Stddev_Samp_Fields = {
  __typename?: 'order_stddev_samp_fields';
  courseId?: Maybe<Scalars['Float']>;
  orderTotal?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  vat?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Order_Sum_Fields = {
  __typename?: 'order_sum_fields';
  courseId?: Maybe<Scalars['Int']>;
  orderTotal?: Maybe<Scalars['float8']>;
  price?: Maybe<Scalars['float8']>;
  quantity?: Maybe<Scalars['Int']>;
  vat?: Maybe<Scalars['float8']>;
};

/** update columns of table "order" */
export enum Order_Update_Column {
  /** column name */
  BillingAddress = 'billingAddress',
  /** column name */
  BillingEmail = 'billingEmail',
  /** column name */
  BillingFamilyName = 'billingFamilyName',
  /** column name */
  BillingGivenName = 'billingGivenName',
  /** column name */
  BillingPhone = 'billingPhone',
  /** column name */
  CourseId = 'courseId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Currency = 'currency',
  /** column name */
  Id = 'id',
  /** column name */
  OrderTotal = 'orderTotal',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  PaymentMethod = 'paymentMethod',
  /** column name */
  Price = 'price',
  /** column name */
  ProfileId = 'profileId',
  /** column name */
  PromoCodes = 'promoCodes',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  Registrants = 'registrants',
  /** column name */
  StripePaymentId = 'stripePaymentId',
  /** column name */
  Vat = 'vat'
}

/** aggregate var_pop on columns */
export type Order_Var_Pop_Fields = {
  __typename?: 'order_var_pop_fields';
  courseId?: Maybe<Scalars['Float']>;
  orderTotal?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  vat?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Order_Var_Samp_Fields = {
  __typename?: 'order_var_samp_fields';
  courseId?: Maybe<Scalars['Float']>;
  orderTotal?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  vat?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Order_Variance_Fields = {
  __typename?: 'order_variance_fields';
  courseId?: Maybe<Scalars['Float']>;
  orderTotal?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
  vat?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "organization" */
export type Organization = {
  __typename?: 'organization';
  addresses: Scalars['jsonb'];
  attributes: Scalars['jsonb'];
  contactDetails: Scalars['jsonb'];
  createdAt: Scalars['timestamptz'];
  /** An array relationship */
  groups: Array<Organization_Group>;
  /** An aggregate relationship */
  groups_aggregate: Organization_Group_Aggregate;
  id: Scalars['uuid'];
  /** An array relationship */
  members: Array<Organization_Member>;
  /** An aggregate relationship */
  members_aggregate: Organization_Member_Aggregate;
  name: Scalars['String'];
  /** An array relationship */
  organizationGroupsByParentOrganizationId: Array<Organization_Group>;
  /** An aggregate relationship */
  organizationGroupsByParentOrganizationId_aggregate: Organization_Group_Aggregate;
  /** An object relationship */
  organization_status: Organization_Status;
  original_record?: Maybe<Scalars['jsonb']>;
  preferences: Scalars['jsonb'];
  /** An array relationship */
  roles: Array<Organization_Role>;
  /** An aggregate relationship */
  roles_aggregate: Organization_Role_Aggregate;
  status: Organization_Status_Enum;
  tags?: Maybe<Scalars['jsonb']>;
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "organization" */
export type OrganizationAddressesArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "organization" */
export type OrganizationAttributesArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "organization" */
export type OrganizationContactDetailsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "organization" */
export type OrganizationGroupsArgs = {
  distinct_on?: InputMaybe<Array<Organization_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Group_Order_By>>;
  where?: InputMaybe<Organization_Group_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationGroups_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Group_Order_By>>;
  where?: InputMaybe<Organization_Group_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationMembersArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Order_By>>;
  where?: InputMaybe<Organization_Member_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationMembers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Order_By>>;
  where?: InputMaybe<Organization_Member_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationOrganizationGroupsByParentOrganizationIdArgs = {
  distinct_on?: InputMaybe<Array<Organization_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Group_Order_By>>;
  where?: InputMaybe<Organization_Group_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationOrganizationGroupsByParentOrganizationId_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Group_Order_By>>;
  where?: InputMaybe<Organization_Group_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationOriginal_RecordArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "organization" */
export type OrganizationPreferencesArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "organization" */
export type OrganizationRolesArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};


/** columns and relationships of "organization" */
export type OrganizationTagsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "organization" */
export type Organization_Aggregate = {
  __typename?: 'organization_aggregate';
  aggregate?: Maybe<Organization_Aggregate_Fields>;
  nodes: Array<Organization>;
};

/** aggregate fields of "organization" */
export type Organization_Aggregate_Fields = {
  __typename?: 'organization_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Organization_Max_Fields>;
  min?: Maybe<Organization_Min_Fields>;
};


/** aggregate fields of "organization" */
export type Organization_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Organization_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "organization" */
export type Organization_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Organization_Max_Order_By>;
  min?: InputMaybe<Organization_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Organization_Append_Input = {
  addresses?: InputMaybe<Scalars['jsonb']>;
  attributes?: InputMaybe<Scalars['jsonb']>;
  contactDetails?: InputMaybe<Scalars['jsonb']>;
  original_record?: InputMaybe<Scalars['jsonb']>;
  preferences?: InputMaybe<Scalars['jsonb']>;
  tags?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "organization" */
export type Organization_Arr_Rel_Insert_Input = {
  data: Array<Organization_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_On_Conflict>;
};

/** Boolean expression to filter rows from the table "organization". All fields are combined with a logical 'AND'. */
export type Organization_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_Bool_Exp>>;
  _not?: InputMaybe<Organization_Bool_Exp>;
  _or?: InputMaybe<Array<Organization_Bool_Exp>>;
  addresses?: InputMaybe<Jsonb_Comparison_Exp>;
  attributes?: InputMaybe<Jsonb_Comparison_Exp>;
  contactDetails?: InputMaybe<Jsonb_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  groups?: InputMaybe<Organization_Group_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  members?: InputMaybe<Organization_Member_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  organizationGroupsByParentOrganizationId?: InputMaybe<Organization_Group_Bool_Exp>;
  organization_status?: InputMaybe<Organization_Status_Bool_Exp>;
  original_record?: InputMaybe<Jsonb_Comparison_Exp>;
  preferences?: InputMaybe<Jsonb_Comparison_Exp>;
  roles?: InputMaybe<Organization_Role_Bool_Exp>;
  status?: InputMaybe<Organization_Status_Enum_Comparison_Exp>;
  tags?: InputMaybe<Jsonb_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "organization" */
export enum Organization_Constraint {
  /** unique or primary key constraint */
  OrganizationPkey = 'organization_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Organization_Delete_At_Path_Input = {
  addresses?: InputMaybe<Array<Scalars['String']>>;
  attributes?: InputMaybe<Array<Scalars['String']>>;
  contactDetails?: InputMaybe<Array<Scalars['String']>>;
  original_record?: InputMaybe<Array<Scalars['String']>>;
  preferences?: InputMaybe<Array<Scalars['String']>>;
  tags?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Organization_Delete_Elem_Input = {
  addresses?: InputMaybe<Scalars['Int']>;
  attributes?: InputMaybe<Scalars['Int']>;
  contactDetails?: InputMaybe<Scalars['Int']>;
  original_record?: InputMaybe<Scalars['Int']>;
  preferences?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Organization_Delete_Key_Input = {
  addresses?: InputMaybe<Scalars['String']>;
  attributes?: InputMaybe<Scalars['String']>;
  contactDetails?: InputMaybe<Scalars['String']>;
  original_record?: InputMaybe<Scalars['String']>;
  preferences?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "organization_group" */
export type Organization_Group = {
  __typename?: 'organization_group';
  _source?: Maybe<Scalars['String']>;
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  /** An object relationship */
  organization: Organization;
  /** An object relationship */
  organizationByParentOrganizationId: Organization;
  organization_id: Scalars['uuid'];
  parent_organization_id: Scalars['uuid'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "organization_group" */
export type Organization_Group_Aggregate = {
  __typename?: 'organization_group_aggregate';
  aggregate?: Maybe<Organization_Group_Aggregate_Fields>;
  nodes: Array<Organization_Group>;
};

/** aggregate fields of "organization_group" */
export type Organization_Group_Aggregate_Fields = {
  __typename?: 'organization_group_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Organization_Group_Max_Fields>;
  min?: Maybe<Organization_Group_Min_Fields>;
};


/** aggregate fields of "organization_group" */
export type Organization_Group_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Organization_Group_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "organization_group" */
export type Organization_Group_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Organization_Group_Max_Order_By>;
  min?: InputMaybe<Organization_Group_Min_Order_By>;
};

/** input type for inserting array relation for remote table "organization_group" */
export type Organization_Group_Arr_Rel_Insert_Input = {
  data: Array<Organization_Group_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_Group_On_Conflict>;
};

/** Boolean expression to filter rows from the table "organization_group". All fields are combined with a logical 'AND'. */
export type Organization_Group_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_Group_Bool_Exp>>;
  _not?: InputMaybe<Organization_Group_Bool_Exp>;
  _or?: InputMaybe<Array<Organization_Group_Bool_Exp>>;
  _source?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organizationByParentOrganizationId?: InputMaybe<Organization_Bool_Exp>;
  organization_id?: InputMaybe<Uuid_Comparison_Exp>;
  parent_organization_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "organization_group" */
export enum Organization_Group_Constraint {
  /** unique or primary key constraint */
  OrganizationGroupOrganizationIdParentOrganizationIdKey = 'organization_group_organization_id_parent_organization_id_key',
  /** unique or primary key constraint */
  OrganizationGroupPkey = 'organization_group_pkey'
}

/** input type for inserting data into table "organization_group" */
export type Organization_Group_Insert_Input = {
  _source?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organizationByParentOrganizationId?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organization_id?: InputMaybe<Scalars['uuid']>;
  parent_organization_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Organization_Group_Max_Fields = {
  __typename?: 'organization_group_max_fields';
  _source?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  organization_id?: Maybe<Scalars['uuid']>;
  parent_organization_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "organization_group" */
export type Organization_Group_Max_Order_By = {
  _source?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  parent_organization_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Organization_Group_Min_Fields = {
  __typename?: 'organization_group_min_fields';
  _source?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  organization_id?: Maybe<Scalars['uuid']>;
  parent_organization_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "organization_group" */
export type Organization_Group_Min_Order_By = {
  _source?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  parent_organization_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "organization_group" */
export type Organization_Group_Mutation_Response = {
  __typename?: 'organization_group_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Organization_Group>;
};

/** on_conflict condition type for table "organization_group" */
export type Organization_Group_On_Conflict = {
  constraint: Organization_Group_Constraint;
  update_columns?: Array<Organization_Group_Update_Column>;
  where?: InputMaybe<Organization_Group_Bool_Exp>;
};

/** Ordering options when selecting data from "organization_group". */
export type Organization_Group_Order_By = {
  _source?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organizationByParentOrganizationId?: InputMaybe<Organization_Order_By>;
  organization_id?: InputMaybe<Order_By>;
  parent_organization_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: organization_group */
export type Organization_Group_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "organization_group" */
export enum Organization_Group_Select_Column {
  /** column name */
  Source = '_source',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  ParentOrganizationId = 'parent_organization_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "organization_group" */
export type Organization_Group_Set_Input = {
  _source?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  organization_id?: InputMaybe<Scalars['uuid']>;
  parent_organization_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "organization_group" */
export enum Organization_Group_Update_Column {
  /** column name */
  Source = '_source',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  ParentOrganizationId = 'parent_organization_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for inserting data into table "organization" */
export type Organization_Insert_Input = {
  addresses?: InputMaybe<Scalars['jsonb']>;
  attributes?: InputMaybe<Scalars['jsonb']>;
  contactDetails?: InputMaybe<Scalars['jsonb']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  groups?: InputMaybe<Organization_Group_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']>;
  members?: InputMaybe<Organization_Member_Arr_Rel_Insert_Input>;
  name?: InputMaybe<Scalars['String']>;
  organizationGroupsByParentOrganizationId?: InputMaybe<Organization_Group_Arr_Rel_Insert_Input>;
  organization_status?: InputMaybe<Organization_Status_Obj_Rel_Insert_Input>;
  original_record?: InputMaybe<Scalars['jsonb']>;
  preferences?: InputMaybe<Scalars['jsonb']>;
  roles?: InputMaybe<Organization_Role_Arr_Rel_Insert_Input>;
  status?: InputMaybe<Organization_Status_Enum>;
  tags?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Organization_Max_Fields = {
  __typename?: 'organization_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "organization" */
export type Organization_Max_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** columns and relationships of "organization_member" */
export type Organization_Member = {
  __typename?: 'organization_member';
  _source?: Maybe<Scalars['String']>;
  createdAt: Scalars['timestamptz'];
  id: Scalars['uuid'];
  memberType?: Maybe<Scalars['String']>;
  /** An object relationship */
  organization: Organization;
  organization_id: Scalars['uuid'];
  /** An object relationship */
  profile: Profile;
  profile_id: Scalars['uuid'];
  /** An array relationship */
  roles: Array<Organization_Member_Role>;
  /** An aggregate relationship */
  roles_aggregate: Organization_Member_Role_Aggregate;
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "organization_member" */
export type Organization_MemberRolesArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Role_Order_By>>;
  where?: InputMaybe<Organization_Member_Role_Bool_Exp>;
};


/** columns and relationships of "organization_member" */
export type Organization_MemberRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Role_Order_By>>;
  where?: InputMaybe<Organization_Member_Role_Bool_Exp>;
};

/** aggregated selection of "organization_member" */
export type Organization_Member_Aggregate = {
  __typename?: 'organization_member_aggregate';
  aggregate?: Maybe<Organization_Member_Aggregate_Fields>;
  nodes: Array<Organization_Member>;
};

/** aggregate fields of "organization_member" */
export type Organization_Member_Aggregate_Fields = {
  __typename?: 'organization_member_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Organization_Member_Max_Fields>;
  min?: Maybe<Organization_Member_Min_Fields>;
};


/** aggregate fields of "organization_member" */
export type Organization_Member_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Organization_Member_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "organization_member" */
export type Organization_Member_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Organization_Member_Max_Order_By>;
  min?: InputMaybe<Organization_Member_Min_Order_By>;
};

/** input type for inserting array relation for remote table "organization_member" */
export type Organization_Member_Arr_Rel_Insert_Input = {
  data: Array<Organization_Member_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_Member_On_Conflict>;
};

/** Boolean expression to filter rows from the table "organization_member". All fields are combined with a logical 'AND'. */
export type Organization_Member_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_Member_Bool_Exp>>;
  _not?: InputMaybe<Organization_Member_Bool_Exp>;
  _or?: InputMaybe<Array<Organization_Member_Bool_Exp>>;
  _source?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  memberType?: InputMaybe<String_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organization_id?: InputMaybe<Uuid_Comparison_Exp>;
  profile?: InputMaybe<Profile_Bool_Exp>;
  profile_id?: InputMaybe<Uuid_Comparison_Exp>;
  roles?: InputMaybe<Organization_Member_Role_Bool_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "organization_member" */
export enum Organization_Member_Constraint {
  /** unique or primary key constraint */
  OrganizationMemberPkey = 'organization_member_pkey',
  /** unique or primary key constraint */
  OrganizationMemberProfileIdOrganizationIdKey = 'organization_member_profile_id_organization_id_key'
}

/** input type for inserting data into table "organization_member" */
export type Organization_Member_Insert_Input = {
  _source?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  memberType?: InputMaybe<Scalars['String']>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organization_id?: InputMaybe<Scalars['uuid']>;
  profile?: InputMaybe<Profile_Obj_Rel_Insert_Input>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  roles?: InputMaybe<Organization_Member_Role_Arr_Rel_Insert_Input>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Organization_Member_Max_Fields = {
  __typename?: 'organization_member_max_fields';
  _source?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  memberType?: Maybe<Scalars['String']>;
  organization_id?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "organization_member" */
export type Organization_Member_Max_Order_By = {
  _source?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  memberType?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Organization_Member_Min_Fields = {
  __typename?: 'organization_member_min_fields';
  _source?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  memberType?: Maybe<Scalars['String']>;
  organization_id?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "organization_member" */
export type Organization_Member_Min_Order_By = {
  _source?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  memberType?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "organization_member" */
export type Organization_Member_Mutation_Response = {
  __typename?: 'organization_member_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Organization_Member>;
};

/** input type for inserting object relation for remote table "organization_member" */
export type Organization_Member_Obj_Rel_Insert_Input = {
  data: Organization_Member_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_Member_On_Conflict>;
};

/** on_conflict condition type for table "organization_member" */
export type Organization_Member_On_Conflict = {
  constraint: Organization_Member_Constraint;
  update_columns?: Array<Organization_Member_Update_Column>;
  where?: InputMaybe<Organization_Member_Bool_Exp>;
};

/** Ordering options when selecting data from "organization_member". */
export type Organization_Member_Order_By = {
  _source?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  memberType?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organization_id?: InputMaybe<Order_By>;
  profile?: InputMaybe<Profile_Order_By>;
  profile_id?: InputMaybe<Order_By>;
  roles_aggregate?: InputMaybe<Organization_Member_Role_Aggregate_Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: organization_member */
export type Organization_Member_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** columns and relationships of "organization_member_role" */
export type Organization_Member_Role = {
  __typename?: 'organization_member_role';
  _source?: Maybe<Scalars['String']>;
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  /** An object relationship */
  member: Organization_Member;
  organization_member_id: Scalars['uuid'];
  organization_role_id: Scalars['uuid'];
  /** An object relationship */
  role: Organization_Role;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregated selection of "organization_member_role" */
export type Organization_Member_Role_Aggregate = {
  __typename?: 'organization_member_role_aggregate';
  aggregate?: Maybe<Organization_Member_Role_Aggregate_Fields>;
  nodes: Array<Organization_Member_Role>;
};

/** aggregate fields of "organization_member_role" */
export type Organization_Member_Role_Aggregate_Fields = {
  __typename?: 'organization_member_role_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Organization_Member_Role_Max_Fields>;
  min?: Maybe<Organization_Member_Role_Min_Fields>;
};


/** aggregate fields of "organization_member_role" */
export type Organization_Member_Role_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Organization_Member_Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "organization_member_role" */
export type Organization_Member_Role_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Organization_Member_Role_Max_Order_By>;
  min?: InputMaybe<Organization_Member_Role_Min_Order_By>;
};

/** input type for inserting array relation for remote table "organization_member_role" */
export type Organization_Member_Role_Arr_Rel_Insert_Input = {
  data: Array<Organization_Member_Role_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_Member_Role_On_Conflict>;
};

/** Boolean expression to filter rows from the table "organization_member_role". All fields are combined with a logical 'AND'. */
export type Organization_Member_Role_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_Member_Role_Bool_Exp>>;
  _not?: InputMaybe<Organization_Member_Role_Bool_Exp>;
  _or?: InputMaybe<Array<Organization_Member_Role_Bool_Exp>>;
  _source?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  member?: InputMaybe<Organization_Member_Bool_Exp>;
  organization_member_id?: InputMaybe<Uuid_Comparison_Exp>;
  organization_role_id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<Organization_Role_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "organization_member_role" */
export enum Organization_Member_Role_Constraint {
  /** unique or primary key constraint */
  OrganizationMemeberRoleOrganizationMemberIdOrganizatiKey = 'organization_memeber_role_organization_member_id_organizati_key',
  /** unique or primary key constraint */
  OrganizationMemeberRolePkey = 'organization_memeber_role_pkey'
}

/** input type for inserting data into table "organization_member_role" */
export type Organization_Member_Role_Insert_Input = {
  _source?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  member?: InputMaybe<Organization_Member_Obj_Rel_Insert_Input>;
  organization_member_id?: InputMaybe<Scalars['uuid']>;
  organization_role_id?: InputMaybe<Scalars['uuid']>;
  role?: InputMaybe<Organization_Role_Obj_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Organization_Member_Role_Max_Fields = {
  __typename?: 'organization_member_role_max_fields';
  _source?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  organization_member_id?: Maybe<Scalars['uuid']>;
  organization_role_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "organization_member_role" */
export type Organization_Member_Role_Max_Order_By = {
  _source?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organization_member_id?: InputMaybe<Order_By>;
  organization_role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Organization_Member_Role_Min_Fields = {
  __typename?: 'organization_member_role_min_fields';
  _source?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  organization_member_id?: Maybe<Scalars['uuid']>;
  organization_role_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "organization_member_role" */
export type Organization_Member_Role_Min_Order_By = {
  _source?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organization_member_id?: InputMaybe<Order_By>;
  organization_role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "organization_member_role" */
export type Organization_Member_Role_Mutation_Response = {
  __typename?: 'organization_member_role_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Organization_Member_Role>;
};

/** on_conflict condition type for table "organization_member_role" */
export type Organization_Member_Role_On_Conflict = {
  constraint: Organization_Member_Role_Constraint;
  update_columns?: Array<Organization_Member_Role_Update_Column>;
  where?: InputMaybe<Organization_Member_Role_Bool_Exp>;
};

/** Ordering options when selecting data from "organization_member_role". */
export type Organization_Member_Role_Order_By = {
  _source?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  member?: InputMaybe<Organization_Member_Order_By>;
  organization_member_id?: InputMaybe<Order_By>;
  organization_role_id?: InputMaybe<Order_By>;
  role?: InputMaybe<Organization_Role_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: organization_member_role */
export type Organization_Member_Role_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "organization_member_role" */
export enum Organization_Member_Role_Select_Column {
  /** column name */
  Source = '_source',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationMemberId = 'organization_member_id',
  /** column name */
  OrganizationRoleId = 'organization_role_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "organization_member_role" */
export type Organization_Member_Role_Set_Input = {
  _source?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  organization_member_id?: InputMaybe<Scalars['uuid']>;
  organization_role_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "organization_member_role" */
export enum Organization_Member_Role_Update_Column {
  /** column name */
  Source = '_source',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationMemberId = 'organization_member_id',
  /** column name */
  OrganizationRoleId = 'organization_role_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select columns of table "organization_member" */
export enum Organization_Member_Select_Column {
  /** column name */
  Source = '_source',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  MemberType = 'memberType',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "organization_member" */
export type Organization_Member_Set_Input = {
  _source?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  memberType?: InputMaybe<Scalars['String']>;
  organization_id?: InputMaybe<Scalars['uuid']>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "organization_member" */
export enum Organization_Member_Update_Column {
  /** column name */
  Source = '_source',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  MemberType = 'memberType',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** aggregate min on columns */
export type Organization_Min_Fields = {
  __typename?: 'organization_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "organization" */
export type Organization_Min_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "organization" */
export type Organization_Mutation_Response = {
  __typename?: 'organization_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Organization>;
};

/** input type for inserting object relation for remote table "organization" */
export type Organization_Obj_Rel_Insert_Input = {
  data: Organization_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_On_Conflict>;
};

/** on_conflict condition type for table "organization" */
export type Organization_On_Conflict = {
  constraint: Organization_Constraint;
  update_columns?: Array<Organization_Update_Column>;
  where?: InputMaybe<Organization_Bool_Exp>;
};

/** Ordering options when selecting data from "organization". */
export type Organization_Order_By = {
  addresses?: InputMaybe<Order_By>;
  attributes?: InputMaybe<Order_By>;
  contactDetails?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  groups_aggregate?: InputMaybe<Organization_Group_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  members_aggregate?: InputMaybe<Organization_Member_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  organizationGroupsByParentOrganizationId_aggregate?: InputMaybe<Organization_Group_Aggregate_Order_By>;
  organization_status?: InputMaybe<Organization_Status_Order_By>;
  original_record?: InputMaybe<Order_By>;
  preferences?: InputMaybe<Order_By>;
  roles_aggregate?: InputMaybe<Organization_Role_Aggregate_Order_By>;
  status?: InputMaybe<Order_By>;
  tags?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: organization */
export type Organization_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Organization_Prepend_Input = {
  addresses?: InputMaybe<Scalars['jsonb']>;
  attributes?: InputMaybe<Scalars['jsonb']>;
  contactDetails?: InputMaybe<Scalars['jsonb']>;
  original_record?: InputMaybe<Scalars['jsonb']>;
  preferences?: InputMaybe<Scalars['jsonb']>;
  tags?: InputMaybe<Scalars['jsonb']>;
};

/** columns and relationships of "organization_role" */
export type Organization_Role = {
  __typename?: 'organization_role';
  _source?: Maybe<Scalars['String']>;
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  /** An object relationship */
  organization: Organization;
  /** An array relationship */
  organizationRoles: Array<Organization_Member_Role>;
  /** An aggregate relationship */
  organizationRoles_aggregate: Organization_Member_Role_Aggregate;
  organization_id: Scalars['uuid'];
  /** An object relationship */
  role: Role;
  role_id: Scalars['uuid'];
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "organization_role" */
export type Organization_RoleOrganizationRolesArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Role_Order_By>>;
  where?: InputMaybe<Organization_Member_Role_Bool_Exp>;
};


/** columns and relationships of "organization_role" */
export type Organization_RoleOrganizationRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Role_Order_By>>;
  where?: InputMaybe<Organization_Member_Role_Bool_Exp>;
};

/** aggregated selection of "organization_role" */
export type Organization_Role_Aggregate = {
  __typename?: 'organization_role_aggregate';
  aggregate?: Maybe<Organization_Role_Aggregate_Fields>;
  nodes: Array<Organization_Role>;
};

/** aggregate fields of "organization_role" */
export type Organization_Role_Aggregate_Fields = {
  __typename?: 'organization_role_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Organization_Role_Max_Fields>;
  min?: Maybe<Organization_Role_Min_Fields>;
};


/** aggregate fields of "organization_role" */
export type Organization_Role_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Organization_Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "organization_role" */
export type Organization_Role_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Organization_Role_Max_Order_By>;
  min?: InputMaybe<Organization_Role_Min_Order_By>;
};

/** input type for inserting array relation for remote table "organization_role" */
export type Organization_Role_Arr_Rel_Insert_Input = {
  data: Array<Organization_Role_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_Role_On_Conflict>;
};

/** Boolean expression to filter rows from the table "organization_role". All fields are combined with a logical 'AND'. */
export type Organization_Role_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_Role_Bool_Exp>>;
  _not?: InputMaybe<Organization_Role_Bool_Exp>;
  _or?: InputMaybe<Array<Organization_Role_Bool_Exp>>;
  _source?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  organization?: InputMaybe<Organization_Bool_Exp>;
  organizationRoles?: InputMaybe<Organization_Member_Role_Bool_Exp>;
  organization_id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<Role_Bool_Exp>;
  role_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "organization_role" */
export enum Organization_Role_Constraint {
  /** unique or primary key constraint */
  OrganizationRolePkey = 'organization_role_pkey',
  /** unique or primary key constraint */
  OrganizationRoleRoleIdOrganizationIdKey = 'organization_role_role_id_organization_id_key'
}

/** input type for inserting data into table "organization_role" */
export type Organization_Role_Insert_Input = {
  _source?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  organization?: InputMaybe<Organization_Obj_Rel_Insert_Input>;
  organizationRoles?: InputMaybe<Organization_Member_Role_Arr_Rel_Insert_Input>;
  organization_id?: InputMaybe<Scalars['uuid']>;
  role?: InputMaybe<Role_Obj_Rel_Insert_Input>;
  role_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Organization_Role_Max_Fields = {
  __typename?: 'organization_role_max_fields';
  _source?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  organization_id?: Maybe<Scalars['uuid']>;
  role_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "organization_role" */
export type Organization_Role_Max_Order_By = {
  _source?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Organization_Role_Min_Fields = {
  __typename?: 'organization_role_min_fields';
  _source?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  organization_id?: Maybe<Scalars['uuid']>;
  role_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "organization_role" */
export type Organization_Role_Min_Order_By = {
  _source?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organization_id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "organization_role" */
export type Organization_Role_Mutation_Response = {
  __typename?: 'organization_role_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Organization_Role>;
};

/** input type for inserting object relation for remote table "organization_role" */
export type Organization_Role_Obj_Rel_Insert_Input = {
  data: Organization_Role_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_Role_On_Conflict>;
};

/** on_conflict condition type for table "organization_role" */
export type Organization_Role_On_Conflict = {
  constraint: Organization_Role_Constraint;
  update_columns?: Array<Organization_Role_Update_Column>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};

/** Ordering options when selecting data from "organization_role". */
export type Organization_Role_Order_By = {
  _source?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organization?: InputMaybe<Organization_Order_By>;
  organizationRoles_aggregate?: InputMaybe<Organization_Member_Role_Aggregate_Order_By>;
  organization_id?: InputMaybe<Order_By>;
  role?: InputMaybe<Role_Order_By>;
  role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: organization_role */
export type Organization_Role_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "organization_role" */
export enum Organization_Role_Select_Column {
  /** column name */
  Source = '_source',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  RoleId = 'role_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "organization_role" */
export type Organization_Role_Set_Input = {
  _source?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  organization_id?: InputMaybe<Scalars['uuid']>;
  role_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "organization_role" */
export enum Organization_Role_Update_Column {
  /** column name */
  Source = '_source',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  RoleId = 'role_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select columns of table "organization" */
export enum Organization_Select_Column {
  /** column name */
  Addresses = 'addresses',
  /** column name */
  Attributes = 'attributes',
  /** column name */
  ContactDetails = 'contactDetails',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  OriginalRecord = 'original_record',
  /** column name */
  Preferences = 'preferences',
  /** column name */
  Status = 'status',
  /** column name */
  Tags = 'tags',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "organization" */
export type Organization_Set_Input = {
  addresses?: InputMaybe<Scalars['jsonb']>;
  attributes?: InputMaybe<Scalars['jsonb']>;
  contactDetails?: InputMaybe<Scalars['jsonb']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  original_record?: InputMaybe<Scalars['jsonb']>;
  preferences?: InputMaybe<Scalars['jsonb']>;
  status?: InputMaybe<Organization_Status_Enum>;
  tags?: InputMaybe<Scalars['jsonb']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** columns and relationships of "organization_status" */
export type Organization_Status = {
  __typename?: 'organization_status';
  /** An array relationship */
  organizations: Array<Organization>;
  /** An aggregate relationship */
  organizations_aggregate: Organization_Aggregate;
  value: Scalars['String'];
};


/** columns and relationships of "organization_status" */
export type Organization_StatusOrganizationsArgs = {
  distinct_on?: InputMaybe<Array<Organization_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Order_By>>;
  where?: InputMaybe<Organization_Bool_Exp>;
};


/** columns and relationships of "organization_status" */
export type Organization_StatusOrganizations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Order_By>>;
  where?: InputMaybe<Organization_Bool_Exp>;
};

/** aggregated selection of "organization_status" */
export type Organization_Status_Aggregate = {
  __typename?: 'organization_status_aggregate';
  aggregate?: Maybe<Organization_Status_Aggregate_Fields>;
  nodes: Array<Organization_Status>;
};

/** aggregate fields of "organization_status" */
export type Organization_Status_Aggregate_Fields = {
  __typename?: 'organization_status_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Organization_Status_Max_Fields>;
  min?: Maybe<Organization_Status_Min_Fields>;
};


/** aggregate fields of "organization_status" */
export type Organization_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Organization_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "organization_status". All fields are combined with a logical 'AND'. */
export type Organization_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Organization_Status_Bool_Exp>>;
  _not?: InputMaybe<Organization_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Organization_Status_Bool_Exp>>;
  organizations?: InputMaybe<Organization_Bool_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "organization_status" */
export enum Organization_Status_Constraint {
  /** unique or primary key constraint */
  OrganizationStatusPkey = 'organization_status_pkey'
}

export enum Organization_Status_Enum {
  Active = 'active'
}

/** Boolean expression to compare columns of type "organization_status_enum". All fields are combined with logical 'AND'. */
export type Organization_Status_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Organization_Status_Enum>;
  _in?: InputMaybe<Array<Organization_Status_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Organization_Status_Enum>;
  _nin?: InputMaybe<Array<Organization_Status_Enum>>;
};

/** input type for inserting data into table "organization_status" */
export type Organization_Status_Insert_Input = {
  organizations?: InputMaybe<Organization_Arr_Rel_Insert_Input>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Organization_Status_Max_Fields = {
  __typename?: 'organization_status_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Organization_Status_Min_Fields = {
  __typename?: 'organization_status_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "organization_status" */
export type Organization_Status_Mutation_Response = {
  __typename?: 'organization_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Organization_Status>;
};

/** input type for inserting object relation for remote table "organization_status" */
export type Organization_Status_Obj_Rel_Insert_Input = {
  data: Organization_Status_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Organization_Status_On_Conflict>;
};

/** on_conflict condition type for table "organization_status" */
export type Organization_Status_On_Conflict = {
  constraint: Organization_Status_Constraint;
  update_columns?: Array<Organization_Status_Update_Column>;
  where?: InputMaybe<Organization_Status_Bool_Exp>;
};

/** Ordering options when selecting data from "organization_status". */
export type Organization_Status_Order_By = {
  organizations_aggregate?: InputMaybe<Organization_Aggregate_Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: organization_status */
export type Organization_Status_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "organization_status" */
export enum Organization_Status_Select_Column {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "organization_status" */
export type Organization_Status_Set_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "organization_status" */
export enum Organization_Status_Update_Column {
  /** column name */
  Value = 'value'
}

/** update columns of table "organization" */
export enum Organization_Update_Column {
  /** column name */
  Addresses = 'addresses',
  /** column name */
  Attributes = 'attributes',
  /** column name */
  ContactDetails = 'contactDetails',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  OriginalRecord = 'original_record',
  /** column name */
  Preferences = 'preferences',
  /** column name */
  Status = 'status',
  /** column name */
  Tags = 'tags',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "payment_methods" */
export type Payment_Methods = {
  __typename?: 'payment_methods';
  name: Scalars['String'];
};

/** aggregated selection of "payment_methods" */
export type Payment_Methods_Aggregate = {
  __typename?: 'payment_methods_aggregate';
  aggregate?: Maybe<Payment_Methods_Aggregate_Fields>;
  nodes: Array<Payment_Methods>;
};

/** aggregate fields of "payment_methods" */
export type Payment_Methods_Aggregate_Fields = {
  __typename?: 'payment_methods_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Payment_Methods_Max_Fields>;
  min?: Maybe<Payment_Methods_Min_Fields>;
};


/** aggregate fields of "payment_methods" */
export type Payment_Methods_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payment_Methods_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "payment_methods". All fields are combined with a logical 'AND'. */
export type Payment_Methods_Bool_Exp = {
  _and?: InputMaybe<Array<Payment_Methods_Bool_Exp>>;
  _not?: InputMaybe<Payment_Methods_Bool_Exp>;
  _or?: InputMaybe<Array<Payment_Methods_Bool_Exp>>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "payment_methods" */
export enum Payment_Methods_Constraint {
  /** unique or primary key constraint */
  PaymentMethodsPkey = 'payment_methods_pkey'
}

export enum Payment_Methods_Enum {
  Cc = 'CC',
  Invoice = 'INVOICE'
}

/** Boolean expression to compare columns of type "payment_methods_enum". All fields are combined with logical 'AND'. */
export type Payment_Methods_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Payment_Methods_Enum>;
  _in?: InputMaybe<Array<Payment_Methods_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Payment_Methods_Enum>;
  _nin?: InputMaybe<Array<Payment_Methods_Enum>>;
};

/** input type for inserting data into table "payment_methods" */
export type Payment_Methods_Insert_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Payment_Methods_Max_Fields = {
  __typename?: 'payment_methods_max_fields';
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Payment_Methods_Min_Fields = {
  __typename?: 'payment_methods_min_fields';
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "payment_methods" */
export type Payment_Methods_Mutation_Response = {
  __typename?: 'payment_methods_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Payment_Methods>;
};

/** on_conflict condition type for table "payment_methods" */
export type Payment_Methods_On_Conflict = {
  constraint: Payment_Methods_Constraint;
  update_columns?: Array<Payment_Methods_Update_Column>;
  where?: InputMaybe<Payment_Methods_Bool_Exp>;
};

/** Ordering options when selecting data from "payment_methods". */
export type Payment_Methods_Order_By = {
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payment_methods */
export type Payment_Methods_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "payment_methods" */
export enum Payment_Methods_Select_Column {
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "payment_methods" */
export type Payment_Methods_Set_Input = {
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "payment_methods" */
export enum Payment_Methods_Update_Column {
  /** column name */
  Name = 'name'
}

/** Boolean expression to compare columns of type "point". All fields are combined with logical 'AND'. */
export type Point_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['point']>;
  _gt?: InputMaybe<Scalars['point']>;
  _gte?: InputMaybe<Scalars['point']>;
  _in?: InputMaybe<Array<Scalars['point']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['point']>;
  _lte?: InputMaybe<Scalars['point']>;
  _neq?: InputMaybe<Scalars['point']>;
  _nin?: InputMaybe<Array<Scalars['point']>>;
};

/** columns and relationships of "profile" */
export type Profile = {
  __typename?: 'profile';
  addresses: Scalars['jsonb'];
  attributes: Scalars['jsonb'];
  contactDetails: Scalars['jsonb'];
  createdAt: Scalars['timestamptz'];
  dietaryRestrictions?: Maybe<Scalars['String']>;
  disabilities?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['date']>;
  email?: Maybe<Scalars['String']>;
  familyName: Scalars['String'];
  fullName?: Maybe<Scalars['String']>;
  givenName: Scalars['String'];
  go1Id?: Maybe<Scalars['Int']>;
  go1_profile?: Maybe<Scalars['jsonb']>;
  id: Scalars['uuid'];
  /** An array relationship */
  identities: Array<Identity>;
  /** An aggregate relationship */
  identities_aggregate: Identity_Aggregate;
  jobTitle?: Maybe<Scalars['String']>;
  /** An array relationship */
  organizations: Array<Organization_Member>;
  /** An aggregate relationship */
  organizations_aggregate: Organization_Member_Aggregate;
  original_record: Scalars['jsonb'];
  phone?: Maybe<Scalars['String']>;
  preferences: Scalars['jsonb'];
  /** An object relationship */
  profile_status: Profile_Status;
  /** An array relationship */
  roles: Array<Profile_Role>;
  /** An aggregate relationship */
  roles_aggregate: Profile_Role_Aggregate;
  status: Profile_Status_Enum;
  stripe_customer_id?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['jsonb']>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "profile" */
export type ProfileAddressesArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "profile" */
export type ProfileAttributesArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "profile" */
export type ProfileContactDetailsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "profile" */
export type ProfileGo1_ProfileArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "profile" */
export type ProfileIdentitiesArgs = {
  distinct_on?: InputMaybe<Array<Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identity_Order_By>>;
  where?: InputMaybe<Identity_Bool_Exp>;
};


/** columns and relationships of "profile" */
export type ProfileIdentities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identity_Order_By>>;
  where?: InputMaybe<Identity_Bool_Exp>;
};


/** columns and relationships of "profile" */
export type ProfileOrganizationsArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Order_By>>;
  where?: InputMaybe<Organization_Member_Bool_Exp>;
};


/** columns and relationships of "profile" */
export type ProfileOrganizations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Order_By>>;
  where?: InputMaybe<Organization_Member_Bool_Exp>;
};


/** columns and relationships of "profile" */
export type ProfileOriginal_RecordArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "profile" */
export type ProfilePreferencesArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "profile" */
export type ProfileRolesArgs = {
  distinct_on?: InputMaybe<Array<Profile_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Role_Order_By>>;
  where?: InputMaybe<Profile_Role_Bool_Exp>;
};


/** columns and relationships of "profile" */
export type ProfileRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Profile_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Role_Order_By>>;
  where?: InputMaybe<Profile_Role_Bool_Exp>;
};


/** columns and relationships of "profile" */
export type ProfileTagsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "profile" */
export type Profile_Aggregate = {
  __typename?: 'profile_aggregate';
  aggregate?: Maybe<Profile_Aggregate_Fields>;
  nodes: Array<Profile>;
};

/** aggregate fields of "profile" */
export type Profile_Aggregate_Fields = {
  __typename?: 'profile_aggregate_fields';
  avg?: Maybe<Profile_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Profile_Max_Fields>;
  min?: Maybe<Profile_Min_Fields>;
  stddev?: Maybe<Profile_Stddev_Fields>;
  stddev_pop?: Maybe<Profile_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Profile_Stddev_Samp_Fields>;
  sum?: Maybe<Profile_Sum_Fields>;
  var_pop?: Maybe<Profile_Var_Pop_Fields>;
  var_samp?: Maybe<Profile_Var_Samp_Fields>;
  variance?: Maybe<Profile_Variance_Fields>;
};


/** aggregate fields of "profile" */
export type Profile_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Profile_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "profile" */
export type Profile_Aggregate_Order_By = {
  avg?: InputMaybe<Profile_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Profile_Max_Order_By>;
  min?: InputMaybe<Profile_Min_Order_By>;
  stddev?: InputMaybe<Profile_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Profile_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Profile_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Profile_Sum_Order_By>;
  var_pop?: InputMaybe<Profile_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Profile_Var_Samp_Order_By>;
  variance?: InputMaybe<Profile_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Profile_Append_Input = {
  addresses?: InputMaybe<Scalars['jsonb']>;
  attributes?: InputMaybe<Scalars['jsonb']>;
  contactDetails?: InputMaybe<Scalars['jsonb']>;
  go1_profile?: InputMaybe<Scalars['jsonb']>;
  original_record?: InputMaybe<Scalars['jsonb']>;
  preferences?: InputMaybe<Scalars['jsonb']>;
  tags?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "profile" */
export type Profile_Arr_Rel_Insert_Input = {
  data: Array<Profile_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Profile_On_Conflict>;
};

/** aggregate avg on columns */
export type Profile_Avg_Fields = {
  __typename?: 'profile_avg_fields';
  go1Id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "profile" */
export type Profile_Avg_Order_By = {
  go1Id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "profile". All fields are combined with a logical 'AND'. */
export type Profile_Bool_Exp = {
  _and?: InputMaybe<Array<Profile_Bool_Exp>>;
  _not?: InputMaybe<Profile_Bool_Exp>;
  _or?: InputMaybe<Array<Profile_Bool_Exp>>;
  addresses?: InputMaybe<Jsonb_Comparison_Exp>;
  attributes?: InputMaybe<Jsonb_Comparison_Exp>;
  contactDetails?: InputMaybe<Jsonb_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  dietaryRestrictions?: InputMaybe<String_Comparison_Exp>;
  disabilities?: InputMaybe<String_Comparison_Exp>;
  dob?: InputMaybe<Date_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  familyName?: InputMaybe<String_Comparison_Exp>;
  fullName?: InputMaybe<String_Comparison_Exp>;
  givenName?: InputMaybe<String_Comparison_Exp>;
  go1Id?: InputMaybe<Int_Comparison_Exp>;
  go1_profile?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  identities?: InputMaybe<Identity_Bool_Exp>;
  jobTitle?: InputMaybe<String_Comparison_Exp>;
  organizations?: InputMaybe<Organization_Member_Bool_Exp>;
  original_record?: InputMaybe<Jsonb_Comparison_Exp>;
  phone?: InputMaybe<String_Comparison_Exp>;
  preferences?: InputMaybe<Jsonb_Comparison_Exp>;
  profile_status?: InputMaybe<Profile_Status_Bool_Exp>;
  roles?: InputMaybe<Profile_Role_Bool_Exp>;
  status?: InputMaybe<Profile_Status_Enum_Comparison_Exp>;
  stripe_customer_id?: InputMaybe<String_Comparison_Exp>;
  tags?: InputMaybe<Jsonb_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "profile" */
export enum Profile_Constraint {
  /** unique or primary key constraint */
  ProfileEmailKey = 'profile_email_key',
  /** unique or primary key constraint */
  ProfilePkey = 'profile_pkey',
  /** unique or primary key constraint */
  ProfileStripeCustomerIdKey = 'profile_stripe_customer_id_key'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Profile_Delete_At_Path_Input = {
  addresses?: InputMaybe<Array<Scalars['String']>>;
  attributes?: InputMaybe<Array<Scalars['String']>>;
  contactDetails?: InputMaybe<Array<Scalars['String']>>;
  go1_profile?: InputMaybe<Array<Scalars['String']>>;
  original_record?: InputMaybe<Array<Scalars['String']>>;
  preferences?: InputMaybe<Array<Scalars['String']>>;
  tags?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Profile_Delete_Elem_Input = {
  addresses?: InputMaybe<Scalars['Int']>;
  attributes?: InputMaybe<Scalars['Int']>;
  contactDetails?: InputMaybe<Scalars['Int']>;
  go1_profile?: InputMaybe<Scalars['Int']>;
  original_record?: InputMaybe<Scalars['Int']>;
  preferences?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Profile_Delete_Key_Input = {
  addresses?: InputMaybe<Scalars['String']>;
  attributes?: InputMaybe<Scalars['String']>;
  contactDetails?: InputMaybe<Scalars['String']>;
  go1_profile?: InputMaybe<Scalars['String']>;
  original_record?: InputMaybe<Scalars['String']>;
  preferences?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "profile" */
export type Profile_Inc_Input = {
  go1Id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "profile" */
export type Profile_Insert_Input = {
  addresses?: InputMaybe<Scalars['jsonb']>;
  attributes?: InputMaybe<Scalars['jsonb']>;
  contactDetails?: InputMaybe<Scalars['jsonb']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  dietaryRestrictions?: InputMaybe<Scalars['String']>;
  disabilities?: InputMaybe<Scalars['String']>;
  dob?: InputMaybe<Scalars['date']>;
  email?: InputMaybe<Scalars['String']>;
  familyName?: InputMaybe<Scalars['String']>;
  givenName?: InputMaybe<Scalars['String']>;
  go1Id?: InputMaybe<Scalars['Int']>;
  go1_profile?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  identities?: InputMaybe<Identity_Arr_Rel_Insert_Input>;
  jobTitle?: InputMaybe<Scalars['String']>;
  organizations?: InputMaybe<Organization_Member_Arr_Rel_Insert_Input>;
  original_record?: InputMaybe<Scalars['jsonb']>;
  phone?: InputMaybe<Scalars['String']>;
  preferences?: InputMaybe<Scalars['jsonb']>;
  profile_status?: InputMaybe<Profile_Status_Obj_Rel_Insert_Input>;
  roles?: InputMaybe<Profile_Role_Arr_Rel_Insert_Input>;
  status?: InputMaybe<Profile_Status_Enum>;
  stripe_customer_id?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Scalars['jsonb']>;
  title?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Profile_Max_Fields = {
  __typename?: 'profile_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  dietaryRestrictions?: Maybe<Scalars['String']>;
  disabilities?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['date']>;
  email?: Maybe<Scalars['String']>;
  familyName?: Maybe<Scalars['String']>;
  givenName?: Maybe<Scalars['String']>;
  go1Id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  jobTitle?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  stripe_customer_id?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "profile" */
export type Profile_Max_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  dietaryRestrictions?: InputMaybe<Order_By>;
  disabilities?: InputMaybe<Order_By>;
  dob?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  familyName?: InputMaybe<Order_By>;
  givenName?: InputMaybe<Order_By>;
  go1Id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  jobTitle?: InputMaybe<Order_By>;
  phone?: InputMaybe<Order_By>;
  stripe_customer_id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Profile_Min_Fields = {
  __typename?: 'profile_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  dietaryRestrictions?: Maybe<Scalars['String']>;
  disabilities?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['date']>;
  email?: Maybe<Scalars['String']>;
  familyName?: Maybe<Scalars['String']>;
  givenName?: Maybe<Scalars['String']>;
  go1Id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['uuid']>;
  jobTitle?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  stripe_customer_id?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "profile" */
export type Profile_Min_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  dietaryRestrictions?: InputMaybe<Order_By>;
  disabilities?: InputMaybe<Order_By>;
  dob?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  familyName?: InputMaybe<Order_By>;
  givenName?: InputMaybe<Order_By>;
  go1Id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  jobTitle?: InputMaybe<Order_By>;
  phone?: InputMaybe<Order_By>;
  stripe_customer_id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "profile" */
export type Profile_Mutation_Response = {
  __typename?: 'profile_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Profile>;
};

/** input type for inserting object relation for remote table "profile" */
export type Profile_Obj_Rel_Insert_Input = {
  data: Profile_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Profile_On_Conflict>;
};

/** on_conflict condition type for table "profile" */
export type Profile_On_Conflict = {
  constraint: Profile_Constraint;
  update_columns?: Array<Profile_Update_Column>;
  where?: InputMaybe<Profile_Bool_Exp>;
};

/** Ordering options when selecting data from "profile". */
export type Profile_Order_By = {
  addresses?: InputMaybe<Order_By>;
  attributes?: InputMaybe<Order_By>;
  contactDetails?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  dietaryRestrictions?: InputMaybe<Order_By>;
  disabilities?: InputMaybe<Order_By>;
  dob?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  familyName?: InputMaybe<Order_By>;
  fullName?: InputMaybe<Order_By>;
  givenName?: InputMaybe<Order_By>;
  go1Id?: InputMaybe<Order_By>;
  go1_profile?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  identities_aggregate?: InputMaybe<Identity_Aggregate_Order_By>;
  jobTitle?: InputMaybe<Order_By>;
  organizations_aggregate?: InputMaybe<Organization_Member_Aggregate_Order_By>;
  original_record?: InputMaybe<Order_By>;
  phone?: InputMaybe<Order_By>;
  preferences?: InputMaybe<Order_By>;
  profile_status?: InputMaybe<Profile_Status_Order_By>;
  roles_aggregate?: InputMaybe<Profile_Role_Aggregate_Order_By>;
  status?: InputMaybe<Order_By>;
  stripe_customer_id?: InputMaybe<Order_By>;
  tags?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: profile */
export type Profile_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Profile_Prepend_Input = {
  addresses?: InputMaybe<Scalars['jsonb']>;
  attributes?: InputMaybe<Scalars['jsonb']>;
  contactDetails?: InputMaybe<Scalars['jsonb']>;
  go1_profile?: InputMaybe<Scalars['jsonb']>;
  original_record?: InputMaybe<Scalars['jsonb']>;
  preferences?: InputMaybe<Scalars['jsonb']>;
  tags?: InputMaybe<Scalars['jsonb']>;
};

/** columns and relationships of "profile_role" */
export type Profile_Role = {
  __typename?: 'profile_role';
  _source?: Maybe<Scalars['String']>;
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  /** An object relationship */
  profile: Profile;
  profile_id: Scalars['uuid'];
  /** An object relationship */
  role: Role;
  role_id: Scalars['uuid'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "profile_role" */
export type Profile_Role_Aggregate = {
  __typename?: 'profile_role_aggregate';
  aggregate?: Maybe<Profile_Role_Aggregate_Fields>;
  nodes: Array<Profile_Role>;
};

/** aggregate fields of "profile_role" */
export type Profile_Role_Aggregate_Fields = {
  __typename?: 'profile_role_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Profile_Role_Max_Fields>;
  min?: Maybe<Profile_Role_Min_Fields>;
};


/** aggregate fields of "profile_role" */
export type Profile_Role_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Profile_Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "profile_role" */
export type Profile_Role_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Profile_Role_Max_Order_By>;
  min?: InputMaybe<Profile_Role_Min_Order_By>;
};

/** input type for inserting array relation for remote table "profile_role" */
export type Profile_Role_Arr_Rel_Insert_Input = {
  data: Array<Profile_Role_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Profile_Role_On_Conflict>;
};

/** Boolean expression to filter rows from the table "profile_role". All fields are combined with a logical 'AND'. */
export type Profile_Role_Bool_Exp = {
  _and?: InputMaybe<Array<Profile_Role_Bool_Exp>>;
  _not?: InputMaybe<Profile_Role_Bool_Exp>;
  _or?: InputMaybe<Array<Profile_Role_Bool_Exp>>;
  _source?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  profile?: InputMaybe<Profile_Bool_Exp>;
  profile_id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<Role_Bool_Exp>;
  role_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "profile_role" */
export enum Profile_Role_Constraint {
  /** unique or primary key constraint */
  ProfileRolePkey = 'profile_role_pkey',
  /** unique or primary key constraint */
  ProfileRoleProfileIdRoleIdKey = 'profile_role_profile_id_role_id_key'
}

/** input type for inserting data into table "profile_role" */
export type Profile_Role_Insert_Input = {
  _source?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  profile?: InputMaybe<Profile_Obj_Rel_Insert_Input>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  role?: InputMaybe<Role_Obj_Rel_Insert_Input>;
  role_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Profile_Role_Max_Fields = {
  __typename?: 'profile_role_max_fields';
  _source?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
  role_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "profile_role" */
export type Profile_Role_Max_Order_By = {
  _source?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Profile_Role_Min_Fields = {
  __typename?: 'profile_role_min_fields';
  _source?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  profile_id?: Maybe<Scalars['uuid']>;
  role_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "profile_role" */
export type Profile_Role_Min_Order_By = {
  _source?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "profile_role" */
export type Profile_Role_Mutation_Response = {
  __typename?: 'profile_role_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Profile_Role>;
};

/** on_conflict condition type for table "profile_role" */
export type Profile_Role_On_Conflict = {
  constraint: Profile_Role_Constraint;
  update_columns?: Array<Profile_Role_Update_Column>;
  where?: InputMaybe<Profile_Role_Bool_Exp>;
};

/** Ordering options when selecting data from "profile_role". */
export type Profile_Role_Order_By = {
  _source?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  profile?: InputMaybe<Profile_Order_By>;
  profile_id?: InputMaybe<Order_By>;
  role?: InputMaybe<Role_Order_By>;
  role_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: profile_role */
export type Profile_Role_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "profile_role" */
export enum Profile_Role_Select_Column {
  /** column name */
  Source = '_source',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  RoleId = 'role_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "profile_role" */
export type Profile_Role_Set_Input = {
  _source?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  role_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "profile_role" */
export enum Profile_Role_Update_Column {
  /** column name */
  Source = '_source',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  RoleId = 'role_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select columns of table "profile" */
export enum Profile_Select_Column {
  /** column name */
  Addresses = 'addresses',
  /** column name */
  Attributes = 'attributes',
  /** column name */
  ContactDetails = 'contactDetails',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DietaryRestrictions = 'dietaryRestrictions',
  /** column name */
  Disabilities = 'disabilities',
  /** column name */
  Dob = 'dob',
  /** column name */
  Email = 'email',
  /** column name */
  FamilyName = 'familyName',
  /** column name */
  GivenName = 'givenName',
  /** column name */
  Go1Id = 'go1Id',
  /** column name */
  Go1Profile = 'go1_profile',
  /** column name */
  Id = 'id',
  /** column name */
  JobTitle = 'jobTitle',
  /** column name */
  OriginalRecord = 'original_record',
  /** column name */
  Phone = 'phone',
  /** column name */
  Preferences = 'preferences',
  /** column name */
  Status = 'status',
  /** column name */
  StripeCustomerId = 'stripe_customer_id',
  /** column name */
  Tags = 'tags',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "profile" */
export type Profile_Set_Input = {
  addresses?: InputMaybe<Scalars['jsonb']>;
  attributes?: InputMaybe<Scalars['jsonb']>;
  contactDetails?: InputMaybe<Scalars['jsonb']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  dietaryRestrictions?: InputMaybe<Scalars['String']>;
  disabilities?: InputMaybe<Scalars['String']>;
  dob?: InputMaybe<Scalars['date']>;
  email?: InputMaybe<Scalars['String']>;
  familyName?: InputMaybe<Scalars['String']>;
  givenName?: InputMaybe<Scalars['String']>;
  go1Id?: InputMaybe<Scalars['Int']>;
  go1_profile?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  jobTitle?: InputMaybe<Scalars['String']>;
  original_record?: InputMaybe<Scalars['jsonb']>;
  phone?: InputMaybe<Scalars['String']>;
  preferences?: InputMaybe<Scalars['jsonb']>;
  status?: InputMaybe<Profile_Status_Enum>;
  stripe_customer_id?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Scalars['jsonb']>;
  title?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** columns and relationships of "profile_status" */
export type Profile_Status = {
  __typename?: 'profile_status';
  /** An array relationship */
  profiles: Array<Profile>;
  /** An aggregate relationship */
  profiles_aggregate: Profile_Aggregate;
  value: Scalars['String'];
};


/** columns and relationships of "profile_status" */
export type Profile_StatusProfilesArgs = {
  distinct_on?: InputMaybe<Array<Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Order_By>>;
  where?: InputMaybe<Profile_Bool_Exp>;
};


/** columns and relationships of "profile_status" */
export type Profile_StatusProfiles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Order_By>>;
  where?: InputMaybe<Profile_Bool_Exp>;
};

/** aggregated selection of "profile_status" */
export type Profile_Status_Aggregate = {
  __typename?: 'profile_status_aggregate';
  aggregate?: Maybe<Profile_Status_Aggregate_Fields>;
  nodes: Array<Profile_Status>;
};

/** aggregate fields of "profile_status" */
export type Profile_Status_Aggregate_Fields = {
  __typename?: 'profile_status_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Profile_Status_Max_Fields>;
  min?: Maybe<Profile_Status_Min_Fields>;
};


/** aggregate fields of "profile_status" */
export type Profile_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Profile_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "profile_status". All fields are combined with a logical 'AND'. */
export type Profile_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Profile_Status_Bool_Exp>>;
  _not?: InputMaybe<Profile_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Profile_Status_Bool_Exp>>;
  profiles?: InputMaybe<Profile_Bool_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "profile_status" */
export enum Profile_Status_Constraint {
  /** unique or primary key constraint */
  ProfileStatusPkey = 'profile_status_pkey'
}

export enum Profile_Status_Enum {
  Active = 'active'
}

/** Boolean expression to compare columns of type "profile_status_enum". All fields are combined with logical 'AND'. */
export type Profile_Status_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Profile_Status_Enum>;
  _in?: InputMaybe<Array<Profile_Status_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Profile_Status_Enum>;
  _nin?: InputMaybe<Array<Profile_Status_Enum>>;
};

/** input type for inserting data into table "profile_status" */
export type Profile_Status_Insert_Input = {
  profiles?: InputMaybe<Profile_Arr_Rel_Insert_Input>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Profile_Status_Max_Fields = {
  __typename?: 'profile_status_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Profile_Status_Min_Fields = {
  __typename?: 'profile_status_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "profile_status" */
export type Profile_Status_Mutation_Response = {
  __typename?: 'profile_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Profile_Status>;
};

/** input type for inserting object relation for remote table "profile_status" */
export type Profile_Status_Obj_Rel_Insert_Input = {
  data: Profile_Status_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Profile_Status_On_Conflict>;
};

/** on_conflict condition type for table "profile_status" */
export type Profile_Status_On_Conflict = {
  constraint: Profile_Status_Constraint;
  update_columns?: Array<Profile_Status_Update_Column>;
  where?: InputMaybe<Profile_Status_Bool_Exp>;
};

/** Ordering options when selecting data from "profile_status". */
export type Profile_Status_Order_By = {
  profiles_aggregate?: InputMaybe<Profile_Aggregate_Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: profile_status */
export type Profile_Status_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "profile_status" */
export enum Profile_Status_Select_Column {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "profile_status" */
export type Profile_Status_Set_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "profile_status" */
export enum Profile_Status_Update_Column {
  /** column name */
  Value = 'value'
}

/** aggregate stddev on columns */
export type Profile_Stddev_Fields = {
  __typename?: 'profile_stddev_fields';
  go1Id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "profile" */
export type Profile_Stddev_Order_By = {
  go1Id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Profile_Stddev_Pop_Fields = {
  __typename?: 'profile_stddev_pop_fields';
  go1Id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "profile" */
export type Profile_Stddev_Pop_Order_By = {
  go1Id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Profile_Stddev_Samp_Fields = {
  __typename?: 'profile_stddev_samp_fields';
  go1Id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "profile" */
export type Profile_Stddev_Samp_Order_By = {
  go1Id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Profile_Sum_Fields = {
  __typename?: 'profile_sum_fields';
  go1Id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "profile" */
export type Profile_Sum_Order_By = {
  go1Id?: InputMaybe<Order_By>;
};

/** Contains partial temporary profiles until account in cognito is confirmed */
export type Profile_Temp = {
  __typename?: 'profile_temp';
  acceptMarketing: Scalars['Boolean'];
  acceptTnc: Scalars['Boolean'];
  /** An object relationship */
  course?: Maybe<Course>;
  courseId?: Maybe<Scalars['Int']>;
  createdAt: Scalars['timestamptz'];
  dob?: Maybe<Scalars['date']>;
  email: Scalars['String'];
  familyName: Scalars['String'];
  givenName: Scalars['String'];
  id: Scalars['Int'];
  jobTitle?: Maybe<Scalars['String']>;
  organizationId?: Maybe<Scalars['uuid']>;
  phone?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  sector?: Maybe<Scalars['String']>;
};

/** aggregated selection of "profile_temp" */
export type Profile_Temp_Aggregate = {
  __typename?: 'profile_temp_aggregate';
  aggregate?: Maybe<Profile_Temp_Aggregate_Fields>;
  nodes: Array<Profile_Temp>;
};

/** aggregate fields of "profile_temp" */
export type Profile_Temp_Aggregate_Fields = {
  __typename?: 'profile_temp_aggregate_fields';
  avg?: Maybe<Profile_Temp_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Profile_Temp_Max_Fields>;
  min?: Maybe<Profile_Temp_Min_Fields>;
  stddev?: Maybe<Profile_Temp_Stddev_Fields>;
  stddev_pop?: Maybe<Profile_Temp_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Profile_Temp_Stddev_Samp_Fields>;
  sum?: Maybe<Profile_Temp_Sum_Fields>;
  var_pop?: Maybe<Profile_Temp_Var_Pop_Fields>;
  var_samp?: Maybe<Profile_Temp_Var_Samp_Fields>;
  variance?: Maybe<Profile_Temp_Variance_Fields>;
};


/** aggregate fields of "profile_temp" */
export type Profile_Temp_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Profile_Temp_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Profile_Temp_Avg_Fields = {
  __typename?: 'profile_temp_avg_fields';
  courseId?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "profile_temp". All fields are combined with a logical 'AND'. */
export type Profile_Temp_Bool_Exp = {
  _and?: InputMaybe<Array<Profile_Temp_Bool_Exp>>;
  _not?: InputMaybe<Profile_Temp_Bool_Exp>;
  _or?: InputMaybe<Array<Profile_Temp_Bool_Exp>>;
  acceptMarketing?: InputMaybe<Boolean_Comparison_Exp>;
  acceptTnc?: InputMaybe<Boolean_Comparison_Exp>;
  course?: InputMaybe<Course_Bool_Exp>;
  courseId?: InputMaybe<Int_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  dob?: InputMaybe<Date_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  familyName?: InputMaybe<String_Comparison_Exp>;
  givenName?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  jobTitle?: InputMaybe<String_Comparison_Exp>;
  organizationId?: InputMaybe<Uuid_Comparison_Exp>;
  phone?: InputMaybe<String_Comparison_Exp>;
  quantity?: InputMaybe<Int_Comparison_Exp>;
  sector?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "profile_temp" */
export enum Profile_Temp_Constraint {
  /** unique or primary key constraint */
  ProfileTempPkey = 'profile_temp_pkey'
}

/** input type for incrementing numeric columns in table "profile_temp" */
export type Profile_Temp_Inc_Input = {
  courseId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
  quantity?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "profile_temp" */
export type Profile_Temp_Insert_Input = {
  acceptMarketing?: InputMaybe<Scalars['Boolean']>;
  acceptTnc?: InputMaybe<Scalars['Boolean']>;
  course?: InputMaybe<Course_Obj_Rel_Insert_Input>;
  courseId?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  dob?: InputMaybe<Scalars['date']>;
  email?: InputMaybe<Scalars['String']>;
  familyName?: InputMaybe<Scalars['String']>;
  givenName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  jobTitle?: InputMaybe<Scalars['String']>;
  organizationId?: InputMaybe<Scalars['uuid']>;
  phone?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['Int']>;
  sector?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Profile_Temp_Max_Fields = {
  __typename?: 'profile_temp_max_fields';
  courseId?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  dob?: Maybe<Scalars['date']>;
  email?: Maybe<Scalars['String']>;
  familyName?: Maybe<Scalars['String']>;
  givenName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  jobTitle?: Maybe<Scalars['String']>;
  organizationId?: Maybe<Scalars['uuid']>;
  phone?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  sector?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Profile_Temp_Min_Fields = {
  __typename?: 'profile_temp_min_fields';
  courseId?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  dob?: Maybe<Scalars['date']>;
  email?: Maybe<Scalars['String']>;
  familyName?: Maybe<Scalars['String']>;
  givenName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  jobTitle?: Maybe<Scalars['String']>;
  organizationId?: Maybe<Scalars['uuid']>;
  phone?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  sector?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "profile_temp" */
export type Profile_Temp_Mutation_Response = {
  __typename?: 'profile_temp_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Profile_Temp>;
};

/** on_conflict condition type for table "profile_temp" */
export type Profile_Temp_On_Conflict = {
  constraint: Profile_Temp_Constraint;
  update_columns?: Array<Profile_Temp_Update_Column>;
  where?: InputMaybe<Profile_Temp_Bool_Exp>;
};

/** Ordering options when selecting data from "profile_temp". */
export type Profile_Temp_Order_By = {
  acceptMarketing?: InputMaybe<Order_By>;
  acceptTnc?: InputMaybe<Order_By>;
  course?: InputMaybe<Course_Order_By>;
  courseId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  dob?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  familyName?: InputMaybe<Order_By>;
  givenName?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  jobTitle?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  phone?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  sector?: InputMaybe<Order_By>;
};

/** primary key columns input for table: profile_temp */
export type Profile_Temp_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "profile_temp" */
export enum Profile_Temp_Select_Column {
  /** column name */
  AcceptMarketing = 'acceptMarketing',
  /** column name */
  AcceptTnc = 'acceptTnc',
  /** column name */
  CourseId = 'courseId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Dob = 'dob',
  /** column name */
  Email = 'email',
  /** column name */
  FamilyName = 'familyName',
  /** column name */
  GivenName = 'givenName',
  /** column name */
  Id = 'id',
  /** column name */
  JobTitle = 'jobTitle',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  Phone = 'phone',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  Sector = 'sector'
}

/** input type for updating data in table "profile_temp" */
export type Profile_Temp_Set_Input = {
  acceptMarketing?: InputMaybe<Scalars['Boolean']>;
  acceptTnc?: InputMaybe<Scalars['Boolean']>;
  courseId?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  dob?: InputMaybe<Scalars['date']>;
  email?: InputMaybe<Scalars['String']>;
  familyName?: InputMaybe<Scalars['String']>;
  givenName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  jobTitle?: InputMaybe<Scalars['String']>;
  organizationId?: InputMaybe<Scalars['uuid']>;
  phone?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['Int']>;
  sector?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Profile_Temp_Stddev_Fields = {
  __typename?: 'profile_temp_stddev_fields';
  courseId?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Profile_Temp_Stddev_Pop_Fields = {
  __typename?: 'profile_temp_stddev_pop_fields';
  courseId?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Profile_Temp_Stddev_Samp_Fields = {
  __typename?: 'profile_temp_stddev_samp_fields';
  courseId?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Profile_Temp_Sum_Fields = {
  __typename?: 'profile_temp_sum_fields';
  courseId?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
};

/** update columns of table "profile_temp" */
export enum Profile_Temp_Update_Column {
  /** column name */
  AcceptMarketing = 'acceptMarketing',
  /** column name */
  AcceptTnc = 'acceptTnc',
  /** column name */
  CourseId = 'courseId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Dob = 'dob',
  /** column name */
  Email = 'email',
  /** column name */
  FamilyName = 'familyName',
  /** column name */
  GivenName = 'givenName',
  /** column name */
  Id = 'id',
  /** column name */
  JobTitle = 'jobTitle',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  Phone = 'phone',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  Sector = 'sector'
}

/** aggregate var_pop on columns */
export type Profile_Temp_Var_Pop_Fields = {
  __typename?: 'profile_temp_var_pop_fields';
  courseId?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Profile_Temp_Var_Samp_Fields = {
  __typename?: 'profile_temp_var_samp_fields';
  courseId?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Profile_Temp_Variance_Fields = {
  __typename?: 'profile_temp_variance_fields';
  courseId?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Float']>;
};

/** update columns of table "profile" */
export enum Profile_Update_Column {
  /** column name */
  Addresses = 'addresses',
  /** column name */
  Attributes = 'attributes',
  /** column name */
  ContactDetails = 'contactDetails',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DietaryRestrictions = 'dietaryRestrictions',
  /** column name */
  Disabilities = 'disabilities',
  /** column name */
  Dob = 'dob',
  /** column name */
  Email = 'email',
  /** column name */
  FamilyName = 'familyName',
  /** column name */
  GivenName = 'givenName',
  /** column name */
  Go1Id = 'go1Id',
  /** column name */
  Go1Profile = 'go1_profile',
  /** column name */
  Id = 'id',
  /** column name */
  JobTitle = 'jobTitle',
  /** column name */
  OriginalRecord = 'original_record',
  /** column name */
  Phone = 'phone',
  /** column name */
  Preferences = 'preferences',
  /** column name */
  Status = 'status',
  /** column name */
  StripeCustomerId = 'stripe_customer_id',
  /** column name */
  Tags = 'tags',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** aggregate var_pop on columns */
export type Profile_Var_Pop_Fields = {
  __typename?: 'profile_var_pop_fields';
  go1Id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "profile" */
export type Profile_Var_Pop_Order_By = {
  go1Id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Profile_Var_Samp_Fields = {
  __typename?: 'profile_var_samp_fields';
  go1Id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "profile" */
export type Profile_Var_Samp_Order_By = {
  go1Id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Profile_Variance_Fields = {
  __typename?: 'profile_variance_fields';
  go1Id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "profile" */
export type Profile_Variance_Order_By = {
  go1Id?: InputMaybe<Order_By>;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "blended_learning_status" */
  blended_learning_status: Array<Blended_Learning_Status>;
  /** fetch aggregated fields from the table: "blended_learning_status" */
  blended_learning_status_aggregate: Blended_Learning_Status_Aggregate;
  /** fetch data from the table: "blended_learning_status" using primary key columns */
  blended_learning_status_by_pk?: Maybe<Blended_Learning_Status>;
  /** fetch data from the table: "color" */
  color: Array<Color>;
  /** fetch aggregated fields from the table: "color" */
  color_aggregate: Color_Aggregate;
  /** fetch data from the table: "color" using primary key columns */
  color_by_pk?: Maybe<Color>;
  /** fetch data from the table: "course" */
  course: Array<Course>;
  /** fetch aggregated fields from the table: "course" */
  course_aggregate: Course_Aggregate;
  /** fetch data from the table: "course" using primary key columns */
  course_by_pk?: Maybe<Course>;
  /** fetch data from the table: "course_certificate" */
  course_certificate: Array<Course_Certificate>;
  /** fetch aggregated fields from the table: "course_certificate" */
  course_certificate_aggregate: Course_Certificate_Aggregate;
  /** fetch data from the table: "course_certificate" using primary key columns */
  course_certificate_by_pk?: Maybe<Course_Certificate>;
  /** fetch data from the table: "course_certificate_changelog" */
  course_certificate_changelog: Array<Course_Certificate_Changelog>;
  /** fetch aggregated fields from the table: "course_certificate_changelog" */
  course_certificate_changelog_aggregate: Course_Certificate_Changelog_Aggregate;
  /** fetch data from the table: "course_certificate_changelog" using primary key columns */
  course_certificate_changelog_by_pk?: Maybe<Course_Certificate_Changelog>;
  /** fetch data from the table: "course_delivery_type" */
  course_delivery_type: Array<Course_Delivery_Type>;
  /** fetch aggregated fields from the table: "course_delivery_type" */
  course_delivery_type_aggregate: Course_Delivery_Type_Aggregate;
  /** fetch data from the table: "course_delivery_type" using primary key columns */
  course_delivery_type_by_pk?: Maybe<Course_Delivery_Type>;
  /** fetch data from the table: "course_evaluation_answers" */
  course_evaluation_answers: Array<Course_Evaluation_Answers>;
  /** fetch aggregated fields from the table: "course_evaluation_answers" */
  course_evaluation_answers_aggregate: Course_Evaluation_Answers_Aggregate;
  /** fetch data from the table: "course_evaluation_answers" using primary key columns */
  course_evaluation_answers_by_pk?: Maybe<Course_Evaluation_Answers>;
  /** fetch data from the table: "course_evaluation_question_group" */
  course_evaluation_question_group: Array<Course_Evaluation_Question_Group>;
  /** fetch aggregated fields from the table: "course_evaluation_question_group" */
  course_evaluation_question_group_aggregate: Course_Evaluation_Question_Group_Aggregate;
  /** fetch data from the table: "course_evaluation_question_group" using primary key columns */
  course_evaluation_question_group_by_pk?: Maybe<Course_Evaluation_Question_Group>;
  /** fetch data from the table: "course_evaluation_question_type" */
  course_evaluation_question_type: Array<Course_Evaluation_Question_Type>;
  /** fetch aggregated fields from the table: "course_evaluation_question_type" */
  course_evaluation_question_type_aggregate: Course_Evaluation_Question_Type_Aggregate;
  /** fetch data from the table: "course_evaluation_question_type" using primary key columns */
  course_evaluation_question_type_by_pk?: Maybe<Course_Evaluation_Question_Type>;
  /** fetch data from the table: "course_evaluation_questions" */
  course_evaluation_questions: Array<Course_Evaluation_Questions>;
  /** fetch aggregated fields from the table: "course_evaluation_questions" */
  course_evaluation_questions_aggregate: Course_Evaluation_Questions_Aggregate;
  /** fetch data from the table: "course_evaluation_questions" using primary key columns */
  course_evaluation_questions_by_pk?: Maybe<Course_Evaluation_Questions>;
  /** fetch data from the table: "course_invite_status" */
  course_invite_status: Array<Course_Invite_Status>;
  /** fetch aggregated fields from the table: "course_invite_status" */
  course_invite_status_aggregate: Course_Invite_Status_Aggregate;
  /** fetch data from the table: "course_invite_status" using primary key columns */
  course_invite_status_by_pk?: Maybe<Course_Invite_Status>;
  /** fetch data from the table: "course_invites" */
  course_invites: Array<Course_Invites>;
  /** fetch aggregated fields from the table: "course_invites" */
  course_invites_aggregate: Course_Invites_Aggregate;
  /** fetch data from the table: "course_invites" using primary key columns */
  course_invites_by_pk?: Maybe<Course_Invites>;
  /** fetch data from the table: "course_level" */
  course_level: Array<Course_Level>;
  /** fetch aggregated fields from the table: "course_level" */
  course_level_aggregate: Course_Level_Aggregate;
  /** fetch data from the table: "course_level" using primary key columns */
  course_level_by_pk?: Maybe<Course_Level>;
  /** fetch data from the table: "course_module" */
  course_module: Array<Course_Module>;
  /** fetch aggregated fields from the table: "course_module" */
  course_module_aggregate: Course_Module_Aggregate;
  /** fetch data from the table: "course_module" using primary key columns */
  course_module_by_pk?: Maybe<Course_Module>;
  /** fetch data from the table: "course_participant" */
  course_participant: Array<Course_Participant>;
  /** fetch aggregated fields from the table: "course_participant" */
  course_participant_aggregate: Course_Participant_Aggregate;
  /** fetch data from the table: "course_participant" using primary key columns */
  course_participant_by_pk?: Maybe<Course_Participant>;
  /** fetch data from the table: "course_participant_module" */
  course_participant_module: Array<Course_Participant_Module>;
  /** fetch aggregated fields from the table: "course_participant_module" */
  course_participant_module_aggregate: Course_Participant_Module_Aggregate;
  /** fetch data from the table: "course_participant_module" using primary key columns */
  course_participant_module_by_pk?: Maybe<Course_Participant_Module>;
  /** fetch data from the table: "course_schedule" */
  course_schedule: Array<Course_Schedule>;
  /** fetch aggregated fields from the table: "course_schedule" */
  course_schedule_aggregate: Course_Schedule_Aggregate;
  /** fetch data from the table: "course_schedule" using primary key columns */
  course_schedule_by_pk?: Maybe<Course_Schedule>;
  /** fetch data from the table: "course_status" */
  course_status: Array<Course_Status>;
  /** fetch aggregated fields from the table: "course_status" */
  course_status_aggregate: Course_Status_Aggregate;
  /** fetch data from the table: "course_status" using primary key columns */
  course_status_by_pk?: Maybe<Course_Status>;
  /** fetch data from the table: "course_trainer" */
  course_trainer: Array<Course_Trainer>;
  /** fetch aggregated fields from the table: "course_trainer" */
  course_trainer_aggregate: Course_Trainer_Aggregate;
  /** fetch data from the table: "course_trainer" using primary key columns */
  course_trainer_by_pk?: Maybe<Course_Trainer>;
  /** fetch data from the table: "course_trainer_type" */
  course_trainer_type: Array<Course_Trainer_Type>;
  /** fetch aggregated fields from the table: "course_trainer_type" */
  course_trainer_type_aggregate: Course_Trainer_Type_Aggregate;
  /** fetch data from the table: "course_trainer_type" using primary key columns */
  course_trainer_type_by_pk?: Maybe<Course_Trainer_Type>;
  /** fetch data from the table: "course_type" */
  course_type: Array<Course_Type>;
  /** fetch aggregated fields from the table: "course_type" */
  course_type_aggregate: Course_Type_Aggregate;
  /** fetch data from the table: "course_type" using primary key columns */
  course_type_by_pk?: Maybe<Course_Type>;
  /** Fetches membership plans */
  fetchPlans?: Maybe<Array<Maybe<PlanObject>>>;
  getInvite?: Maybe<CourseInvite>;
  getTrainersLevels?: Maybe<Array<Maybe<TrainerLevels>>>;
  /** fetch data from the table: "grade" */
  grade: Array<Grade>;
  /** fetch aggregated fields from the table: "grade" */
  grade_aggregate: Grade_Aggregate;
  /** fetch data from the table: "grade" using primary key columns */
  grade_by_pk?: Maybe<Grade>;
  /** fetch data from the table: "identity" */
  identity: Array<Identity>;
  /** fetch aggregated fields from the table: "identity" */
  identity_aggregate: Identity_Aggregate;
  /** fetch data from the table: "identity" using primary key columns */
  identity_by_pk?: Maybe<Identity>;
  /** fetch data from the table: "identity_type" */
  identity_type: Array<Identity_Type>;
  /** fetch aggregated fields from the table: "identity_type" */
  identity_type_aggregate: Identity_Type_Aggregate;
  /** fetch data from the table: "identity_type" using primary key columns */
  identity_type_by_pk?: Maybe<Identity_Type>;
  /** Checks whether user is subscribed to membership */
  isUserSubscribedToMembership?: Maybe<IsUserSubscribedToMembershipResponse>;
  /** fetch data from the table: "legacy_certificate" */
  legacy_certificate: Array<Legacy_Certificate>;
  /** fetch aggregated fields from the table: "legacy_certificate" */
  legacy_certificate_aggregate: Legacy_Certificate_Aggregate;
  /** fetch data from the table: "legacy_certificate" using primary key columns */
  legacy_certificate_by_pk?: Maybe<Legacy_Certificate>;
  /** fetch data from the table: "module" */
  module: Array<Module>;
  /** fetch aggregated fields from the table: "module" */
  module_aggregate: Module_Aggregate;
  /** fetch data from the table: "module" using primary key columns */
  module_by_pk?: Maybe<Module>;
  /** fetch data from the table: "module_category" */
  module_category: Array<Module_Category>;
  /** fetch aggregated fields from the table: "module_category" */
  module_category_aggregate: Module_Category_Aggregate;
  /** fetch data from the table: "module_category" using primary key columns */
  module_category_by_pk?: Maybe<Module_Category>;
  /** fetch data from the table: "module_group" */
  module_group: Array<Module_Group>;
  /** fetch aggregated fields from the table: "module_group" */
  module_group_aggregate: Module_Group_Aggregate;
  /** fetch data from the table: "module_group" using primary key columns */
  module_group_by_pk?: Maybe<Module_Group>;
  /** fetch data from the table: "module_group_duration" */
  module_group_duration: Array<Module_Group_Duration>;
  /** fetch aggregated fields from the table: "module_group_duration" */
  module_group_duration_aggregate: Module_Group_Duration_Aggregate;
  /** fetch data from the table: "module_group_duration" using primary key columns */
  module_group_duration_by_pk?: Maybe<Module_Group_Duration>;
  /** fetch data from the table: "order" */
  order: Array<Order>;
  /** fetch aggregated fields from the table: "order" */
  order_aggregate: Order_Aggregate;
  /** fetch data from the table: "order" using primary key columns */
  order_by_pk?: Maybe<Order>;
  /** fetch data from the table: "organization" */
  organization: Array<Organization>;
  /** fetch aggregated fields from the table: "organization" */
  organization_aggregate: Organization_Aggregate;
  /** fetch data from the table: "organization" using primary key columns */
  organization_by_pk?: Maybe<Organization>;
  /** fetch data from the table: "organization_group" */
  organization_group: Array<Organization_Group>;
  /** fetch aggregated fields from the table: "organization_group" */
  organization_group_aggregate: Organization_Group_Aggregate;
  /** fetch data from the table: "organization_group" using primary key columns */
  organization_group_by_pk?: Maybe<Organization_Group>;
  /** fetch data from the table: "organization_member" */
  organization_member: Array<Organization_Member>;
  /** fetch aggregated fields from the table: "organization_member" */
  organization_member_aggregate: Organization_Member_Aggregate;
  /** fetch data from the table: "organization_member" using primary key columns */
  organization_member_by_pk?: Maybe<Organization_Member>;
  /** fetch data from the table: "organization_member_role" */
  organization_member_role: Array<Organization_Member_Role>;
  /** fetch aggregated fields from the table: "organization_member_role" */
  organization_member_role_aggregate: Organization_Member_Role_Aggregate;
  /** fetch data from the table: "organization_member_role" using primary key columns */
  organization_member_role_by_pk?: Maybe<Organization_Member_Role>;
  /** fetch data from the table: "organization_role" */
  organization_role: Array<Organization_Role>;
  /** fetch aggregated fields from the table: "organization_role" */
  organization_role_aggregate: Organization_Role_Aggregate;
  /** fetch data from the table: "organization_role" using primary key columns */
  organization_role_by_pk?: Maybe<Organization_Role>;
  /** fetch data from the table: "organization_status" */
  organization_status: Array<Organization_Status>;
  /** fetch aggregated fields from the table: "organization_status" */
  organization_status_aggregate: Organization_Status_Aggregate;
  /** fetch data from the table: "organization_status" using primary key columns */
  organization_status_by_pk?: Maybe<Organization_Status>;
  /** fetch data from the table: "payment_methods" */
  payment_methods: Array<Payment_Methods>;
  /** fetch aggregated fields from the table: "payment_methods" */
  payment_methods_aggregate: Payment_Methods_Aggregate;
  /** fetch data from the table: "payment_methods" using primary key columns */
  payment_methods_by_pk?: Maybe<Payment_Methods>;
  /** fetch data from the table: "profile" */
  profile: Array<Profile>;
  /** fetch aggregated fields from the table: "profile" */
  profile_aggregate: Profile_Aggregate;
  /** fetch data from the table: "profile" using primary key columns */
  profile_by_pk?: Maybe<Profile>;
  /** fetch data from the table: "profile_role" */
  profile_role: Array<Profile_Role>;
  /** fetch aggregated fields from the table: "profile_role" */
  profile_role_aggregate: Profile_Role_Aggregate;
  /** fetch data from the table: "profile_role" using primary key columns */
  profile_role_by_pk?: Maybe<Profile_Role>;
  /** fetch data from the table: "profile_status" */
  profile_status: Array<Profile_Status>;
  /** fetch aggregated fields from the table: "profile_status" */
  profile_status_aggregate: Profile_Status_Aggregate;
  /** fetch data from the table: "profile_status" using primary key columns */
  profile_status_by_pk?: Maybe<Profile_Status>;
  /** fetch data from the table: "profile_temp" */
  profile_temp: Array<Profile_Temp>;
  /** fetch aggregated fields from the table: "profile_temp" */
  profile_temp_aggregate: Profile_Temp_Aggregate;
  /** fetch data from the table: "profile_temp" using primary key columns */
  profile_temp_by_pk?: Maybe<Profile_Temp>;
  /** fetch data from the table: "resource" */
  resource: Array<Resource>;
  /** fetch aggregated fields from the table: "resource" */
  resource_aggregate: Resource_Aggregate;
  /** fetch data from the table: "resource" using primary key columns */
  resource_by_pk?: Maybe<Resource>;
  /** fetch data from the table: "role" */
  role: Array<Role>;
  /** fetch aggregated fields from the table: "role" */
  role_aggregate: Role_Aggregate;
  /** fetch data from the table: "role" using primary key columns */
  role_by_pk?: Maybe<Role>;
  searchTrainers?: Maybe<Array<Maybe<SearchTrainer>>>;
  /** fetch data from the table: "venue" */
  venue: Array<Venue>;
  /** fetch aggregated fields from the table: "venue" */
  venue_aggregate: Venue_Aggregate;
  /** fetch data from the table: "venue" using primary key columns */
  venue_by_pk?: Maybe<Venue>;
  /** fetch data from the table: "waitlist" */
  waitlist: Array<Waitlist>;
  /** fetch aggregated fields from the table: "waitlist" */
  waitlist_aggregate: Waitlist_Aggregate;
  /** fetch data from the table: "waitlist" using primary key columns */
  waitlist_by_pk?: Maybe<Waitlist>;
};


export type Query_RootBlended_Learning_StatusArgs = {
  distinct_on?: InputMaybe<Array<Blended_Learning_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Blended_Learning_Status_Order_By>>;
  where?: InputMaybe<Blended_Learning_Status_Bool_Exp>;
};


export type Query_RootBlended_Learning_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Blended_Learning_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Blended_Learning_Status_Order_By>>;
  where?: InputMaybe<Blended_Learning_Status_Bool_Exp>;
};


export type Query_RootBlended_Learning_Status_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootColorArgs = {
  distinct_on?: InputMaybe<Array<Color_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Color_Order_By>>;
  where?: InputMaybe<Color_Bool_Exp>;
};


export type Query_RootColor_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Color_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Color_Order_By>>;
  where?: InputMaybe<Color_Bool_Exp>;
};


export type Query_RootColor_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootCourseArgs = {
  distinct_on?: InputMaybe<Array<Course_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Order_By>>;
  where?: InputMaybe<Course_Bool_Exp>;
};


export type Query_RootCourse_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Order_By>>;
  where?: InputMaybe<Course_Bool_Exp>;
};


export type Query_RootCourse_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootCourse_CertificateArgs = {
  distinct_on?: InputMaybe<Array<Course_Certificate_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Certificate_Order_By>>;
  where?: InputMaybe<Course_Certificate_Bool_Exp>;
};


export type Query_RootCourse_Certificate_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Certificate_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Certificate_Order_By>>;
  where?: InputMaybe<Course_Certificate_Bool_Exp>;
};


export type Query_RootCourse_Certificate_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCourse_Certificate_ChangelogArgs = {
  distinct_on?: InputMaybe<Array<Course_Certificate_Changelog_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Certificate_Changelog_Order_By>>;
  where?: InputMaybe<Course_Certificate_Changelog_Bool_Exp>;
};


export type Query_RootCourse_Certificate_Changelog_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Certificate_Changelog_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Certificate_Changelog_Order_By>>;
  where?: InputMaybe<Course_Certificate_Changelog_Bool_Exp>;
};


export type Query_RootCourse_Certificate_Changelog_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCourse_Delivery_TypeArgs = {
  distinct_on?: InputMaybe<Array<Course_Delivery_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Delivery_Type_Order_By>>;
  where?: InputMaybe<Course_Delivery_Type_Bool_Exp>;
};


export type Query_RootCourse_Delivery_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Delivery_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Delivery_Type_Order_By>>;
  where?: InputMaybe<Course_Delivery_Type_Bool_Exp>;
};


export type Query_RootCourse_Delivery_Type_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootCourse_Evaluation_AnswersArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Answers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Answers_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Answers_Bool_Exp>;
};


export type Query_RootCourse_Evaluation_Answers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Answers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Answers_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Answers_Bool_Exp>;
};


export type Query_RootCourse_Evaluation_Answers_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCourse_Evaluation_Question_GroupArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Question_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Question_Group_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Question_Group_Bool_Exp>;
};


export type Query_RootCourse_Evaluation_Question_Group_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Question_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Question_Group_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Question_Group_Bool_Exp>;
};


export type Query_RootCourse_Evaluation_Question_Group_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootCourse_Evaluation_Question_TypeArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Question_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Question_Type_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Question_Type_Bool_Exp>;
};


export type Query_RootCourse_Evaluation_Question_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Question_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Question_Type_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Question_Type_Bool_Exp>;
};


export type Query_RootCourse_Evaluation_Question_Type_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootCourse_Evaluation_QuestionsArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Questions_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Questions_Bool_Exp>;
};


export type Query_RootCourse_Evaluation_Questions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Questions_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Questions_Bool_Exp>;
};


export type Query_RootCourse_Evaluation_Questions_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCourse_Invite_StatusArgs = {
  distinct_on?: InputMaybe<Array<Course_Invite_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Invite_Status_Order_By>>;
  where?: InputMaybe<Course_Invite_Status_Bool_Exp>;
};


export type Query_RootCourse_Invite_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Invite_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Invite_Status_Order_By>>;
  where?: InputMaybe<Course_Invite_Status_Bool_Exp>;
};


export type Query_RootCourse_Invite_Status_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootCourse_InvitesArgs = {
  distinct_on?: InputMaybe<Array<Course_Invites_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Invites_Order_By>>;
  where?: InputMaybe<Course_Invites_Bool_Exp>;
};


export type Query_RootCourse_Invites_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Invites_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Invites_Order_By>>;
  where?: InputMaybe<Course_Invites_Bool_Exp>;
};


export type Query_RootCourse_Invites_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCourse_LevelArgs = {
  distinct_on?: InputMaybe<Array<Course_Level_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Level_Order_By>>;
  where?: InputMaybe<Course_Level_Bool_Exp>;
};


export type Query_RootCourse_Level_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Level_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Level_Order_By>>;
  where?: InputMaybe<Course_Level_Bool_Exp>;
};


export type Query_RootCourse_Level_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootCourse_ModuleArgs = {
  distinct_on?: InputMaybe<Array<Course_Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Module_Order_By>>;
  where?: InputMaybe<Course_Module_Bool_Exp>;
};


export type Query_RootCourse_Module_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Module_Order_By>>;
  where?: InputMaybe<Course_Module_Bool_Exp>;
};


export type Query_RootCourse_Module_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCourse_ParticipantArgs = {
  distinct_on?: InputMaybe<Array<Course_Participant_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Participant_Order_By>>;
  where?: InputMaybe<Course_Participant_Bool_Exp>;
};


export type Query_RootCourse_Participant_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Participant_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Participant_Order_By>>;
  where?: InputMaybe<Course_Participant_Bool_Exp>;
};


export type Query_RootCourse_Participant_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCourse_Participant_ModuleArgs = {
  distinct_on?: InputMaybe<Array<Course_Participant_Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Participant_Module_Order_By>>;
  where?: InputMaybe<Course_Participant_Module_Bool_Exp>;
};


export type Query_RootCourse_Participant_Module_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Participant_Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Participant_Module_Order_By>>;
  where?: InputMaybe<Course_Participant_Module_Bool_Exp>;
};


export type Query_RootCourse_Participant_Module_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCourse_ScheduleArgs = {
  distinct_on?: InputMaybe<Array<Course_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Schedule_Order_By>>;
  where?: InputMaybe<Course_Schedule_Bool_Exp>;
};


export type Query_RootCourse_Schedule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Schedule_Order_By>>;
  where?: InputMaybe<Course_Schedule_Bool_Exp>;
};


export type Query_RootCourse_Schedule_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCourse_StatusArgs = {
  distinct_on?: InputMaybe<Array<Course_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Status_Order_By>>;
  where?: InputMaybe<Course_Status_Bool_Exp>;
};


export type Query_RootCourse_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Status_Order_By>>;
  where?: InputMaybe<Course_Status_Bool_Exp>;
};


export type Query_RootCourse_Status_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootCourse_TrainerArgs = {
  distinct_on?: InputMaybe<Array<Course_Trainer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Trainer_Order_By>>;
  where?: InputMaybe<Course_Trainer_Bool_Exp>;
};


export type Query_RootCourse_Trainer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Trainer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Trainer_Order_By>>;
  where?: InputMaybe<Course_Trainer_Bool_Exp>;
};


export type Query_RootCourse_Trainer_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCourse_Trainer_TypeArgs = {
  distinct_on?: InputMaybe<Array<Course_Trainer_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Trainer_Type_Order_By>>;
  where?: InputMaybe<Course_Trainer_Type_Bool_Exp>;
};


export type Query_RootCourse_Trainer_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Trainer_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Trainer_Type_Order_By>>;
  where?: InputMaybe<Course_Trainer_Type_Bool_Exp>;
};


export type Query_RootCourse_Trainer_Type_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootCourse_TypeArgs = {
  distinct_on?: InputMaybe<Array<Course_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Type_Order_By>>;
  where?: InputMaybe<Course_Type_Bool_Exp>;
};


export type Query_RootCourse_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Type_Order_By>>;
  where?: InputMaybe<Course_Type_Bool_Exp>;
};


export type Query_RootCourse_Type_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootGetTrainersLevelsArgs = {
  input: GetTrainersLevelsInput;
};


export type Query_RootGradeArgs = {
  distinct_on?: InputMaybe<Array<Grade_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Grade_Order_By>>;
  where?: InputMaybe<Grade_Bool_Exp>;
};


export type Query_RootGrade_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Grade_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Grade_Order_By>>;
  where?: InputMaybe<Grade_Bool_Exp>;
};


export type Query_RootGrade_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootIdentityArgs = {
  distinct_on?: InputMaybe<Array<Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identity_Order_By>>;
  where?: InputMaybe<Identity_Bool_Exp>;
};


export type Query_RootIdentity_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identity_Order_By>>;
  where?: InputMaybe<Identity_Bool_Exp>;
};


export type Query_RootIdentity_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootIdentity_TypeArgs = {
  distinct_on?: InputMaybe<Array<Identity_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identity_Type_Order_By>>;
  where?: InputMaybe<Identity_Type_Bool_Exp>;
};


export type Query_RootIdentity_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Identity_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identity_Type_Order_By>>;
  where?: InputMaybe<Identity_Type_Bool_Exp>;
};


export type Query_RootIdentity_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootIsUserSubscribedToMembershipArgs = {
  customerId: Scalars['String'];
};


export type Query_RootLegacy_CertificateArgs = {
  distinct_on?: InputMaybe<Array<Legacy_Certificate_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Legacy_Certificate_Order_By>>;
  where?: InputMaybe<Legacy_Certificate_Bool_Exp>;
};


export type Query_RootLegacy_Certificate_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Legacy_Certificate_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Legacy_Certificate_Order_By>>;
  where?: InputMaybe<Legacy_Certificate_Bool_Exp>;
};


export type Query_RootLegacy_Certificate_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootModuleArgs = {
  distinct_on?: InputMaybe<Array<Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Order_By>>;
  where?: InputMaybe<Module_Bool_Exp>;
};


export type Query_RootModule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Order_By>>;
  where?: InputMaybe<Module_Bool_Exp>;
};


export type Query_RootModule_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootModule_CategoryArgs = {
  distinct_on?: InputMaybe<Array<Module_Category_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Category_Order_By>>;
  where?: InputMaybe<Module_Category_Bool_Exp>;
};


export type Query_RootModule_Category_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Module_Category_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Category_Order_By>>;
  where?: InputMaybe<Module_Category_Bool_Exp>;
};


export type Query_RootModule_Category_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootModule_GroupArgs = {
  distinct_on?: InputMaybe<Array<Module_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Group_Order_By>>;
  where?: InputMaybe<Module_Group_Bool_Exp>;
};


export type Query_RootModule_Group_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Module_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Group_Order_By>>;
  where?: InputMaybe<Module_Group_Bool_Exp>;
};


export type Query_RootModule_Group_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootModule_Group_DurationArgs = {
  distinct_on?: InputMaybe<Array<Module_Group_Duration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Group_Duration_Order_By>>;
  where?: InputMaybe<Module_Group_Duration_Bool_Exp>;
};


export type Query_RootModule_Group_Duration_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Module_Group_Duration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Group_Duration_Order_By>>;
  where?: InputMaybe<Module_Group_Duration_Bool_Exp>;
};


export type Query_RootModule_Group_Duration_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootOrderArgs = {
  distinct_on?: InputMaybe<Array<Order_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Order_Order_By>>;
  where?: InputMaybe<Order_Bool_Exp>;
};


export type Query_RootOrder_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Order_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Order_Order_By>>;
  where?: InputMaybe<Order_Bool_Exp>;
};


export type Query_RootOrder_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootOrganizationArgs = {
  distinct_on?: InputMaybe<Array<Organization_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Order_By>>;
  where?: InputMaybe<Organization_Bool_Exp>;
};


export type Query_RootOrganization_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Order_By>>;
  where?: InputMaybe<Organization_Bool_Exp>;
};


export type Query_RootOrganization_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootOrganization_GroupArgs = {
  distinct_on?: InputMaybe<Array<Organization_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Group_Order_By>>;
  where?: InputMaybe<Organization_Group_Bool_Exp>;
};


export type Query_RootOrganization_Group_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Group_Order_By>>;
  where?: InputMaybe<Organization_Group_Bool_Exp>;
};


export type Query_RootOrganization_Group_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootOrganization_MemberArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Order_By>>;
  where?: InputMaybe<Organization_Member_Bool_Exp>;
};


export type Query_RootOrganization_Member_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Order_By>>;
  where?: InputMaybe<Organization_Member_Bool_Exp>;
};


export type Query_RootOrganization_Member_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootOrganization_Member_RoleArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Role_Order_By>>;
  where?: InputMaybe<Organization_Member_Role_Bool_Exp>;
};


export type Query_RootOrganization_Member_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Role_Order_By>>;
  where?: InputMaybe<Organization_Member_Role_Bool_Exp>;
};


export type Query_RootOrganization_Member_Role_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootOrganization_RoleArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};


export type Query_RootOrganization_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};


export type Query_RootOrganization_Role_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootOrganization_StatusArgs = {
  distinct_on?: InputMaybe<Array<Organization_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Status_Order_By>>;
  where?: InputMaybe<Organization_Status_Bool_Exp>;
};


export type Query_RootOrganization_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Status_Order_By>>;
  where?: InputMaybe<Organization_Status_Bool_Exp>;
};


export type Query_RootOrganization_Status_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootPayment_MethodsArgs = {
  distinct_on?: InputMaybe<Array<Payment_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Payment_Methods_Order_By>>;
  where?: InputMaybe<Payment_Methods_Bool_Exp>;
};


export type Query_RootPayment_Methods_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payment_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Payment_Methods_Order_By>>;
  where?: InputMaybe<Payment_Methods_Bool_Exp>;
};


export type Query_RootPayment_Methods_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootProfileArgs = {
  distinct_on?: InputMaybe<Array<Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Order_By>>;
  where?: InputMaybe<Profile_Bool_Exp>;
};


export type Query_RootProfile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Order_By>>;
  where?: InputMaybe<Profile_Bool_Exp>;
};


export type Query_RootProfile_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootProfile_RoleArgs = {
  distinct_on?: InputMaybe<Array<Profile_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Role_Order_By>>;
  where?: InputMaybe<Profile_Role_Bool_Exp>;
};


export type Query_RootProfile_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Profile_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Role_Order_By>>;
  where?: InputMaybe<Profile_Role_Bool_Exp>;
};


export type Query_RootProfile_Role_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootProfile_StatusArgs = {
  distinct_on?: InputMaybe<Array<Profile_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Status_Order_By>>;
  where?: InputMaybe<Profile_Status_Bool_Exp>;
};


export type Query_RootProfile_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Profile_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Status_Order_By>>;
  where?: InputMaybe<Profile_Status_Bool_Exp>;
};


export type Query_RootProfile_Status_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootProfile_TempArgs = {
  distinct_on?: InputMaybe<Array<Profile_Temp_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Temp_Order_By>>;
  where?: InputMaybe<Profile_Temp_Bool_Exp>;
};


export type Query_RootProfile_Temp_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Profile_Temp_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Temp_Order_By>>;
  where?: InputMaybe<Profile_Temp_Bool_Exp>;
};


export type Query_RootProfile_Temp_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootResourceArgs = {
  distinct_on?: InputMaybe<Array<Resource_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Resource_Order_By>>;
  where?: InputMaybe<Resource_Bool_Exp>;
};


export type Query_RootResource_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resource_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Resource_Order_By>>;
  where?: InputMaybe<Resource_Bool_Exp>;
};


export type Query_RootResource_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootRoleArgs = {
  distinct_on?: InputMaybe<Array<Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Role_Order_By>>;
  where?: InputMaybe<Role_Bool_Exp>;
};


export type Query_RootRole_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Role_Order_By>>;
  where?: InputMaybe<Role_Bool_Exp>;
};


export type Query_RootRole_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootSearchTrainersArgs = {
  input: SearchTrainersInput;
};


export type Query_RootVenueArgs = {
  distinct_on?: InputMaybe<Array<Venue_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Venue_Order_By>>;
  where?: InputMaybe<Venue_Bool_Exp>;
};


export type Query_RootVenue_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Venue_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Venue_Order_By>>;
  where?: InputMaybe<Venue_Bool_Exp>;
};


export type Query_RootVenue_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootWaitlistArgs = {
  distinct_on?: InputMaybe<Array<Waitlist_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Waitlist_Order_By>>;
  where?: InputMaybe<Waitlist_Bool_Exp>;
};


export type Query_RootWaitlist_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Waitlist_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Waitlist_Order_By>>;
  where?: InputMaybe<Waitlist_Bool_Exp>;
};


export type Query_RootWaitlist_By_PkArgs = {
  id: Scalars['uuid'];
};

/** columns and relationships of "resource" */
export type Resource = {
  __typename?: 'resource';
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "resource" */
export type Resource_Aggregate = {
  __typename?: 'resource_aggregate';
  aggregate?: Maybe<Resource_Aggregate_Fields>;
  nodes: Array<Resource>;
};

/** aggregate fields of "resource" */
export type Resource_Aggregate_Fields = {
  __typename?: 'resource_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Resource_Max_Fields>;
  min?: Maybe<Resource_Min_Fields>;
};


/** aggregate fields of "resource" */
export type Resource_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Resource_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "resource". All fields are combined with a logical 'AND'. */
export type Resource_Bool_Exp = {
  _and?: InputMaybe<Array<Resource_Bool_Exp>>;
  _not?: InputMaybe<Resource_Bool_Exp>;
  _or?: InputMaybe<Array<Resource_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "resource" */
export enum Resource_Constraint {
  /** unique or primary key constraint */
  ResourcePkey = 'resource_pkey'
}

/** input type for inserting data into table "resource" */
export type Resource_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Resource_Max_Fields = {
  __typename?: 'resource_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Resource_Min_Fields = {
  __typename?: 'resource_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "resource" */
export type Resource_Mutation_Response = {
  __typename?: 'resource_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Resource>;
};

/** on_conflict condition type for table "resource" */
export type Resource_On_Conflict = {
  constraint: Resource_Constraint;
  update_columns?: Array<Resource_Update_Column>;
  where?: InputMaybe<Resource_Bool_Exp>;
};

/** Ordering options when selecting data from "resource". */
export type Resource_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: resource */
export type Resource_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "resource" */
export enum Resource_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "resource" */
export type Resource_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "resource" */
export enum Resource_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** columns and relationships of "role" */
export type Role = {
  __typename?: 'role';
  data: Scalars['jsonb'];
  id: Scalars['uuid'];
  name: Scalars['String'];
  /** An array relationship */
  organization_roles: Array<Organization_Role>;
  /** An aggregate relationship */
  organization_roles_aggregate: Organization_Role_Aggregate;
  /** An array relationship */
  profile_roles: Array<Profile_Role>;
  /** An aggregate relationship */
  profile_roles_aggregate: Profile_Role_Aggregate;
  rank?: Maybe<Scalars['Int']>;
};


/** columns and relationships of "role" */
export type RoleDataArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "role" */
export type RoleOrganization_RolesArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};


/** columns and relationships of "role" */
export type RoleOrganization_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};


/** columns and relationships of "role" */
export type RoleProfile_RolesArgs = {
  distinct_on?: InputMaybe<Array<Profile_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Role_Order_By>>;
  where?: InputMaybe<Profile_Role_Bool_Exp>;
};


/** columns and relationships of "role" */
export type RoleProfile_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Profile_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Role_Order_By>>;
  where?: InputMaybe<Profile_Role_Bool_Exp>;
};

/** aggregated selection of "role" */
export type Role_Aggregate = {
  __typename?: 'role_aggregate';
  aggregate?: Maybe<Role_Aggregate_Fields>;
  nodes: Array<Role>;
};

/** aggregate fields of "role" */
export type Role_Aggregate_Fields = {
  __typename?: 'role_aggregate_fields';
  avg?: Maybe<Role_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Role_Max_Fields>;
  min?: Maybe<Role_Min_Fields>;
  stddev?: Maybe<Role_Stddev_Fields>;
  stddev_pop?: Maybe<Role_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Role_Stddev_Samp_Fields>;
  sum?: Maybe<Role_Sum_Fields>;
  var_pop?: Maybe<Role_Var_Pop_Fields>;
  var_samp?: Maybe<Role_Var_Samp_Fields>;
  variance?: Maybe<Role_Variance_Fields>;
};


/** aggregate fields of "role" */
export type Role_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Role_Append_Input = {
  data?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate avg on columns */
export type Role_Avg_Fields = {
  __typename?: 'role_avg_fields';
  rank?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "role". All fields are combined with a logical 'AND'. */
export type Role_Bool_Exp = {
  _and?: InputMaybe<Array<Role_Bool_Exp>>;
  _not?: InputMaybe<Role_Bool_Exp>;
  _or?: InputMaybe<Array<Role_Bool_Exp>>;
  data?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  organization_roles?: InputMaybe<Organization_Role_Bool_Exp>;
  profile_roles?: InputMaybe<Profile_Role_Bool_Exp>;
  rank?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "role" */
export enum Role_Constraint {
  /** unique or primary key constraint */
  RoleNameKey = 'role_name_key',
  /** unique or primary key constraint */
  RolePkey = 'role_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Role_Delete_At_Path_Input = {
  data?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Role_Delete_Elem_Input = {
  data?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Role_Delete_Key_Input = {
  data?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "role" */
export type Role_Inc_Input = {
  rank?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "role" */
export type Role_Insert_Input = {
  data?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  organization_roles?: InputMaybe<Organization_Role_Arr_Rel_Insert_Input>;
  profile_roles?: InputMaybe<Profile_Role_Arr_Rel_Insert_Input>;
  rank?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Role_Max_Fields = {
  __typename?: 'role_max_fields';
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  rank?: Maybe<Scalars['Int']>;
};

/** aggregate min on columns */
export type Role_Min_Fields = {
  __typename?: 'role_min_fields';
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  rank?: Maybe<Scalars['Int']>;
};

/** response of any mutation on the table "role" */
export type Role_Mutation_Response = {
  __typename?: 'role_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Role>;
};

/** input type for inserting object relation for remote table "role" */
export type Role_Obj_Rel_Insert_Input = {
  data: Role_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Role_On_Conflict>;
};

/** on_conflict condition type for table "role" */
export type Role_On_Conflict = {
  constraint: Role_Constraint;
  update_columns?: Array<Role_Update_Column>;
  where?: InputMaybe<Role_Bool_Exp>;
};

/** Ordering options when selecting data from "role". */
export type Role_Order_By = {
  data?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  organization_roles_aggregate?: InputMaybe<Organization_Role_Aggregate_Order_By>;
  profile_roles_aggregate?: InputMaybe<Profile_Role_Aggregate_Order_By>;
  rank?: InputMaybe<Order_By>;
};

/** primary key columns input for table: role */
export type Role_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Role_Prepend_Input = {
  data?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "role" */
export enum Role_Select_Column {
  /** column name */
  Data = 'data',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Rank = 'rank'
}

/** input type for updating data in table "role" */
export type Role_Set_Input = {
  data?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  rank?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Role_Stddev_Fields = {
  __typename?: 'role_stddev_fields';
  rank?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Role_Stddev_Pop_Fields = {
  __typename?: 'role_stddev_pop_fields';
  rank?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Role_Stddev_Samp_Fields = {
  __typename?: 'role_stddev_samp_fields';
  rank?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Role_Sum_Fields = {
  __typename?: 'role_sum_fields';
  rank?: Maybe<Scalars['Int']>;
};

/** update columns of table "role" */
export enum Role_Update_Column {
  /** column name */
  Data = 'data',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Rank = 'rank'
}

/** aggregate var_pop on columns */
export type Role_Var_Pop_Fields = {
  __typename?: 'role_var_pop_fields';
  rank?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Role_Var_Samp_Fields = {
  __typename?: 'role_var_samp_fields';
  rank?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Role_Variance_Fields = {
  __typename?: 'role_variance_fields';
  rank?: Maybe<Scalars['Float']>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "blended_learning_status" */
  blended_learning_status: Array<Blended_Learning_Status>;
  /** fetch aggregated fields from the table: "blended_learning_status" */
  blended_learning_status_aggregate: Blended_Learning_Status_Aggregate;
  /** fetch data from the table: "blended_learning_status" using primary key columns */
  blended_learning_status_by_pk?: Maybe<Blended_Learning_Status>;
  /** fetch data from the table: "color" */
  color: Array<Color>;
  /** fetch aggregated fields from the table: "color" */
  color_aggregate: Color_Aggregate;
  /** fetch data from the table: "color" using primary key columns */
  color_by_pk?: Maybe<Color>;
  /** fetch data from the table: "course" */
  course: Array<Course>;
  /** fetch aggregated fields from the table: "course" */
  course_aggregate: Course_Aggregate;
  /** fetch data from the table: "course" using primary key columns */
  course_by_pk?: Maybe<Course>;
  /** fetch data from the table: "course_certificate" */
  course_certificate: Array<Course_Certificate>;
  /** fetch aggregated fields from the table: "course_certificate" */
  course_certificate_aggregate: Course_Certificate_Aggregate;
  /** fetch data from the table: "course_certificate" using primary key columns */
  course_certificate_by_pk?: Maybe<Course_Certificate>;
  /** fetch data from the table: "course_certificate_changelog" */
  course_certificate_changelog: Array<Course_Certificate_Changelog>;
  /** fetch aggregated fields from the table: "course_certificate_changelog" */
  course_certificate_changelog_aggregate: Course_Certificate_Changelog_Aggregate;
  /** fetch data from the table: "course_certificate_changelog" using primary key columns */
  course_certificate_changelog_by_pk?: Maybe<Course_Certificate_Changelog>;
  /** fetch data from the table: "course_delivery_type" */
  course_delivery_type: Array<Course_Delivery_Type>;
  /** fetch aggregated fields from the table: "course_delivery_type" */
  course_delivery_type_aggregate: Course_Delivery_Type_Aggregate;
  /** fetch data from the table: "course_delivery_type" using primary key columns */
  course_delivery_type_by_pk?: Maybe<Course_Delivery_Type>;
  /** fetch data from the table: "course_evaluation_answers" */
  course_evaluation_answers: Array<Course_Evaluation_Answers>;
  /** fetch aggregated fields from the table: "course_evaluation_answers" */
  course_evaluation_answers_aggregate: Course_Evaluation_Answers_Aggregate;
  /** fetch data from the table: "course_evaluation_answers" using primary key columns */
  course_evaluation_answers_by_pk?: Maybe<Course_Evaluation_Answers>;
  /** fetch data from the table: "course_evaluation_question_group" */
  course_evaluation_question_group: Array<Course_Evaluation_Question_Group>;
  /** fetch aggregated fields from the table: "course_evaluation_question_group" */
  course_evaluation_question_group_aggregate: Course_Evaluation_Question_Group_Aggregate;
  /** fetch data from the table: "course_evaluation_question_group" using primary key columns */
  course_evaluation_question_group_by_pk?: Maybe<Course_Evaluation_Question_Group>;
  /** fetch data from the table: "course_evaluation_question_type" */
  course_evaluation_question_type: Array<Course_Evaluation_Question_Type>;
  /** fetch aggregated fields from the table: "course_evaluation_question_type" */
  course_evaluation_question_type_aggregate: Course_Evaluation_Question_Type_Aggregate;
  /** fetch data from the table: "course_evaluation_question_type" using primary key columns */
  course_evaluation_question_type_by_pk?: Maybe<Course_Evaluation_Question_Type>;
  /** fetch data from the table: "course_evaluation_questions" */
  course_evaluation_questions: Array<Course_Evaluation_Questions>;
  /** fetch aggregated fields from the table: "course_evaluation_questions" */
  course_evaluation_questions_aggregate: Course_Evaluation_Questions_Aggregate;
  /** fetch data from the table: "course_evaluation_questions" using primary key columns */
  course_evaluation_questions_by_pk?: Maybe<Course_Evaluation_Questions>;
  /** fetch data from the table: "course_invite_status" */
  course_invite_status: Array<Course_Invite_Status>;
  /** fetch aggregated fields from the table: "course_invite_status" */
  course_invite_status_aggregate: Course_Invite_Status_Aggregate;
  /** fetch data from the table: "course_invite_status" using primary key columns */
  course_invite_status_by_pk?: Maybe<Course_Invite_Status>;
  /** fetch data from the table: "course_invites" */
  course_invites: Array<Course_Invites>;
  /** fetch aggregated fields from the table: "course_invites" */
  course_invites_aggregate: Course_Invites_Aggregate;
  /** fetch data from the table: "course_invites" using primary key columns */
  course_invites_by_pk?: Maybe<Course_Invites>;
  /** fetch data from the table: "course_level" */
  course_level: Array<Course_Level>;
  /** fetch aggregated fields from the table: "course_level" */
  course_level_aggregate: Course_Level_Aggregate;
  /** fetch data from the table: "course_level" using primary key columns */
  course_level_by_pk?: Maybe<Course_Level>;
  /** fetch data from the table: "course_module" */
  course_module: Array<Course_Module>;
  /** fetch aggregated fields from the table: "course_module" */
  course_module_aggregate: Course_Module_Aggregate;
  /** fetch data from the table: "course_module" using primary key columns */
  course_module_by_pk?: Maybe<Course_Module>;
  /** fetch data from the table: "course_participant" */
  course_participant: Array<Course_Participant>;
  /** fetch aggregated fields from the table: "course_participant" */
  course_participant_aggregate: Course_Participant_Aggregate;
  /** fetch data from the table: "course_participant" using primary key columns */
  course_participant_by_pk?: Maybe<Course_Participant>;
  /** fetch data from the table: "course_participant_module" */
  course_participant_module: Array<Course_Participant_Module>;
  /** fetch aggregated fields from the table: "course_participant_module" */
  course_participant_module_aggregate: Course_Participant_Module_Aggregate;
  /** fetch data from the table: "course_participant_module" using primary key columns */
  course_participant_module_by_pk?: Maybe<Course_Participant_Module>;
  /** fetch data from the table: "course_schedule" */
  course_schedule: Array<Course_Schedule>;
  /** fetch aggregated fields from the table: "course_schedule" */
  course_schedule_aggregate: Course_Schedule_Aggregate;
  /** fetch data from the table: "course_schedule" using primary key columns */
  course_schedule_by_pk?: Maybe<Course_Schedule>;
  /** fetch data from the table: "course_status" */
  course_status: Array<Course_Status>;
  /** fetch aggregated fields from the table: "course_status" */
  course_status_aggregate: Course_Status_Aggregate;
  /** fetch data from the table: "course_status" using primary key columns */
  course_status_by_pk?: Maybe<Course_Status>;
  /** fetch data from the table: "course_trainer" */
  course_trainer: Array<Course_Trainer>;
  /** fetch aggregated fields from the table: "course_trainer" */
  course_trainer_aggregate: Course_Trainer_Aggregate;
  /** fetch data from the table: "course_trainer" using primary key columns */
  course_trainer_by_pk?: Maybe<Course_Trainer>;
  /** fetch data from the table: "course_trainer_type" */
  course_trainer_type: Array<Course_Trainer_Type>;
  /** fetch aggregated fields from the table: "course_trainer_type" */
  course_trainer_type_aggregate: Course_Trainer_Type_Aggregate;
  /** fetch data from the table: "course_trainer_type" using primary key columns */
  course_trainer_type_by_pk?: Maybe<Course_Trainer_Type>;
  /** fetch data from the table: "course_type" */
  course_type: Array<Course_Type>;
  /** fetch aggregated fields from the table: "course_type" */
  course_type_aggregate: Course_Type_Aggregate;
  /** fetch data from the table: "course_type" using primary key columns */
  course_type_by_pk?: Maybe<Course_Type>;
  /** fetch data from the table: "grade" */
  grade: Array<Grade>;
  /** fetch aggregated fields from the table: "grade" */
  grade_aggregate: Grade_Aggregate;
  /** fetch data from the table: "grade" using primary key columns */
  grade_by_pk?: Maybe<Grade>;
  /** fetch data from the table: "identity" */
  identity: Array<Identity>;
  /** fetch aggregated fields from the table: "identity" */
  identity_aggregate: Identity_Aggregate;
  /** fetch data from the table: "identity" using primary key columns */
  identity_by_pk?: Maybe<Identity>;
  /** fetch data from the table: "identity_type" */
  identity_type: Array<Identity_Type>;
  /** fetch aggregated fields from the table: "identity_type" */
  identity_type_aggregate: Identity_Type_Aggregate;
  /** fetch data from the table: "identity_type" using primary key columns */
  identity_type_by_pk?: Maybe<Identity_Type>;
  /** fetch data from the table: "legacy_certificate" */
  legacy_certificate: Array<Legacy_Certificate>;
  /** fetch aggregated fields from the table: "legacy_certificate" */
  legacy_certificate_aggregate: Legacy_Certificate_Aggregate;
  /** fetch data from the table: "legacy_certificate" using primary key columns */
  legacy_certificate_by_pk?: Maybe<Legacy_Certificate>;
  /** fetch data from the table: "module" */
  module: Array<Module>;
  /** fetch aggregated fields from the table: "module" */
  module_aggregate: Module_Aggregate;
  /** fetch data from the table: "module" using primary key columns */
  module_by_pk?: Maybe<Module>;
  /** fetch data from the table: "module_category" */
  module_category: Array<Module_Category>;
  /** fetch aggregated fields from the table: "module_category" */
  module_category_aggregate: Module_Category_Aggregate;
  /** fetch data from the table: "module_category" using primary key columns */
  module_category_by_pk?: Maybe<Module_Category>;
  /** fetch data from the table: "module_group" */
  module_group: Array<Module_Group>;
  /** fetch aggregated fields from the table: "module_group" */
  module_group_aggregate: Module_Group_Aggregate;
  /** fetch data from the table: "module_group" using primary key columns */
  module_group_by_pk?: Maybe<Module_Group>;
  /** fetch data from the table: "module_group_duration" */
  module_group_duration: Array<Module_Group_Duration>;
  /** fetch aggregated fields from the table: "module_group_duration" */
  module_group_duration_aggregate: Module_Group_Duration_Aggregate;
  /** fetch data from the table: "module_group_duration" using primary key columns */
  module_group_duration_by_pk?: Maybe<Module_Group_Duration>;
  /** fetch data from the table: "order" */
  order: Array<Order>;
  /** fetch aggregated fields from the table: "order" */
  order_aggregate: Order_Aggregate;
  /** fetch data from the table: "order" using primary key columns */
  order_by_pk?: Maybe<Order>;
  /** fetch data from the table: "organization" */
  organization: Array<Organization>;
  /** fetch aggregated fields from the table: "organization" */
  organization_aggregate: Organization_Aggregate;
  /** fetch data from the table: "organization" using primary key columns */
  organization_by_pk?: Maybe<Organization>;
  /** fetch data from the table: "organization_group" */
  organization_group: Array<Organization_Group>;
  /** fetch aggregated fields from the table: "organization_group" */
  organization_group_aggregate: Organization_Group_Aggregate;
  /** fetch data from the table: "organization_group" using primary key columns */
  organization_group_by_pk?: Maybe<Organization_Group>;
  /** fetch data from the table: "organization_member" */
  organization_member: Array<Organization_Member>;
  /** fetch aggregated fields from the table: "organization_member" */
  organization_member_aggregate: Organization_Member_Aggregate;
  /** fetch data from the table: "organization_member" using primary key columns */
  organization_member_by_pk?: Maybe<Organization_Member>;
  /** fetch data from the table: "organization_member_role" */
  organization_member_role: Array<Organization_Member_Role>;
  /** fetch aggregated fields from the table: "organization_member_role" */
  organization_member_role_aggregate: Organization_Member_Role_Aggregate;
  /** fetch data from the table: "organization_member_role" using primary key columns */
  organization_member_role_by_pk?: Maybe<Organization_Member_Role>;
  /** fetch data from the table: "organization_role" */
  organization_role: Array<Organization_Role>;
  /** fetch aggregated fields from the table: "organization_role" */
  organization_role_aggregate: Organization_Role_Aggregate;
  /** fetch data from the table: "organization_role" using primary key columns */
  organization_role_by_pk?: Maybe<Organization_Role>;
  /** fetch data from the table: "organization_status" */
  organization_status: Array<Organization_Status>;
  /** fetch aggregated fields from the table: "organization_status" */
  organization_status_aggregate: Organization_Status_Aggregate;
  /** fetch data from the table: "organization_status" using primary key columns */
  organization_status_by_pk?: Maybe<Organization_Status>;
  /** fetch data from the table: "payment_methods" */
  payment_methods: Array<Payment_Methods>;
  /** fetch aggregated fields from the table: "payment_methods" */
  payment_methods_aggregate: Payment_Methods_Aggregate;
  /** fetch data from the table: "payment_methods" using primary key columns */
  payment_methods_by_pk?: Maybe<Payment_Methods>;
  /** fetch data from the table: "profile" */
  profile: Array<Profile>;
  /** fetch aggregated fields from the table: "profile" */
  profile_aggregate: Profile_Aggregate;
  /** fetch data from the table: "profile" using primary key columns */
  profile_by_pk?: Maybe<Profile>;
  /** fetch data from the table: "profile_role" */
  profile_role: Array<Profile_Role>;
  /** fetch aggregated fields from the table: "profile_role" */
  profile_role_aggregate: Profile_Role_Aggregate;
  /** fetch data from the table: "profile_role" using primary key columns */
  profile_role_by_pk?: Maybe<Profile_Role>;
  /** fetch data from the table: "profile_status" */
  profile_status: Array<Profile_Status>;
  /** fetch aggregated fields from the table: "profile_status" */
  profile_status_aggregate: Profile_Status_Aggregate;
  /** fetch data from the table: "profile_status" using primary key columns */
  profile_status_by_pk?: Maybe<Profile_Status>;
  /** fetch data from the table: "profile_temp" */
  profile_temp: Array<Profile_Temp>;
  /** fetch aggregated fields from the table: "profile_temp" */
  profile_temp_aggregate: Profile_Temp_Aggregate;
  /** fetch data from the table: "profile_temp" using primary key columns */
  profile_temp_by_pk?: Maybe<Profile_Temp>;
  /** fetch data from the table: "resource" */
  resource: Array<Resource>;
  /** fetch aggregated fields from the table: "resource" */
  resource_aggregate: Resource_Aggregate;
  /** fetch data from the table: "resource" using primary key columns */
  resource_by_pk?: Maybe<Resource>;
  /** fetch data from the table: "role" */
  role: Array<Role>;
  /** fetch aggregated fields from the table: "role" */
  role_aggregate: Role_Aggregate;
  /** fetch data from the table: "role" using primary key columns */
  role_by_pk?: Maybe<Role>;
  /** fetch data from the table: "venue" */
  venue: Array<Venue>;
  /** fetch aggregated fields from the table: "venue" */
  venue_aggregate: Venue_Aggregate;
  /** fetch data from the table: "venue" using primary key columns */
  venue_by_pk?: Maybe<Venue>;
  /** fetch data from the table: "waitlist" */
  waitlist: Array<Waitlist>;
  /** fetch aggregated fields from the table: "waitlist" */
  waitlist_aggregate: Waitlist_Aggregate;
  /** fetch data from the table: "waitlist" using primary key columns */
  waitlist_by_pk?: Maybe<Waitlist>;
};


export type Subscription_RootBlended_Learning_StatusArgs = {
  distinct_on?: InputMaybe<Array<Blended_Learning_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Blended_Learning_Status_Order_By>>;
  where?: InputMaybe<Blended_Learning_Status_Bool_Exp>;
};


export type Subscription_RootBlended_Learning_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Blended_Learning_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Blended_Learning_Status_Order_By>>;
  where?: InputMaybe<Blended_Learning_Status_Bool_Exp>;
};


export type Subscription_RootBlended_Learning_Status_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootColorArgs = {
  distinct_on?: InputMaybe<Array<Color_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Color_Order_By>>;
  where?: InputMaybe<Color_Bool_Exp>;
};


export type Subscription_RootColor_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Color_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Color_Order_By>>;
  where?: InputMaybe<Color_Bool_Exp>;
};


export type Subscription_RootColor_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootCourseArgs = {
  distinct_on?: InputMaybe<Array<Course_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Order_By>>;
  where?: InputMaybe<Course_Bool_Exp>;
};


export type Subscription_RootCourse_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Order_By>>;
  where?: InputMaybe<Course_Bool_Exp>;
};


export type Subscription_RootCourse_By_PkArgs = {
  id: Scalars['Int'];
};


export type Subscription_RootCourse_CertificateArgs = {
  distinct_on?: InputMaybe<Array<Course_Certificate_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Certificate_Order_By>>;
  where?: InputMaybe<Course_Certificate_Bool_Exp>;
};


export type Subscription_RootCourse_Certificate_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Certificate_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Certificate_Order_By>>;
  where?: InputMaybe<Course_Certificate_Bool_Exp>;
};


export type Subscription_RootCourse_Certificate_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCourse_Certificate_ChangelogArgs = {
  distinct_on?: InputMaybe<Array<Course_Certificate_Changelog_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Certificate_Changelog_Order_By>>;
  where?: InputMaybe<Course_Certificate_Changelog_Bool_Exp>;
};


export type Subscription_RootCourse_Certificate_Changelog_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Certificate_Changelog_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Certificate_Changelog_Order_By>>;
  where?: InputMaybe<Course_Certificate_Changelog_Bool_Exp>;
};


export type Subscription_RootCourse_Certificate_Changelog_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCourse_Delivery_TypeArgs = {
  distinct_on?: InputMaybe<Array<Course_Delivery_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Delivery_Type_Order_By>>;
  where?: InputMaybe<Course_Delivery_Type_Bool_Exp>;
};


export type Subscription_RootCourse_Delivery_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Delivery_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Delivery_Type_Order_By>>;
  where?: InputMaybe<Course_Delivery_Type_Bool_Exp>;
};


export type Subscription_RootCourse_Delivery_Type_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootCourse_Evaluation_AnswersArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Answers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Answers_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Answers_Bool_Exp>;
};


export type Subscription_RootCourse_Evaluation_Answers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Answers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Answers_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Answers_Bool_Exp>;
};


export type Subscription_RootCourse_Evaluation_Answers_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCourse_Evaluation_Question_GroupArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Question_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Question_Group_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Question_Group_Bool_Exp>;
};


export type Subscription_RootCourse_Evaluation_Question_Group_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Question_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Question_Group_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Question_Group_Bool_Exp>;
};


export type Subscription_RootCourse_Evaluation_Question_Group_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootCourse_Evaluation_Question_TypeArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Question_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Question_Type_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Question_Type_Bool_Exp>;
};


export type Subscription_RootCourse_Evaluation_Question_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Question_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Question_Type_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Question_Type_Bool_Exp>;
};


export type Subscription_RootCourse_Evaluation_Question_Type_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootCourse_Evaluation_QuestionsArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Questions_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Questions_Bool_Exp>;
};


export type Subscription_RootCourse_Evaluation_Questions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Evaluation_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Evaluation_Questions_Order_By>>;
  where?: InputMaybe<Course_Evaluation_Questions_Bool_Exp>;
};


export type Subscription_RootCourse_Evaluation_Questions_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCourse_Invite_StatusArgs = {
  distinct_on?: InputMaybe<Array<Course_Invite_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Invite_Status_Order_By>>;
  where?: InputMaybe<Course_Invite_Status_Bool_Exp>;
};


export type Subscription_RootCourse_Invite_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Invite_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Invite_Status_Order_By>>;
  where?: InputMaybe<Course_Invite_Status_Bool_Exp>;
};


export type Subscription_RootCourse_Invite_Status_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootCourse_InvitesArgs = {
  distinct_on?: InputMaybe<Array<Course_Invites_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Invites_Order_By>>;
  where?: InputMaybe<Course_Invites_Bool_Exp>;
};


export type Subscription_RootCourse_Invites_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Invites_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Invites_Order_By>>;
  where?: InputMaybe<Course_Invites_Bool_Exp>;
};


export type Subscription_RootCourse_Invites_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCourse_LevelArgs = {
  distinct_on?: InputMaybe<Array<Course_Level_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Level_Order_By>>;
  where?: InputMaybe<Course_Level_Bool_Exp>;
};


export type Subscription_RootCourse_Level_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Level_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Level_Order_By>>;
  where?: InputMaybe<Course_Level_Bool_Exp>;
};


export type Subscription_RootCourse_Level_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootCourse_ModuleArgs = {
  distinct_on?: InputMaybe<Array<Course_Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Module_Order_By>>;
  where?: InputMaybe<Course_Module_Bool_Exp>;
};


export type Subscription_RootCourse_Module_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Module_Order_By>>;
  where?: InputMaybe<Course_Module_Bool_Exp>;
};


export type Subscription_RootCourse_Module_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCourse_ParticipantArgs = {
  distinct_on?: InputMaybe<Array<Course_Participant_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Participant_Order_By>>;
  where?: InputMaybe<Course_Participant_Bool_Exp>;
};


export type Subscription_RootCourse_Participant_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Participant_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Participant_Order_By>>;
  where?: InputMaybe<Course_Participant_Bool_Exp>;
};


export type Subscription_RootCourse_Participant_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCourse_Participant_ModuleArgs = {
  distinct_on?: InputMaybe<Array<Course_Participant_Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Participant_Module_Order_By>>;
  where?: InputMaybe<Course_Participant_Module_Bool_Exp>;
};


export type Subscription_RootCourse_Participant_Module_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Participant_Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Participant_Module_Order_By>>;
  where?: InputMaybe<Course_Participant_Module_Bool_Exp>;
};


export type Subscription_RootCourse_Participant_Module_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCourse_ScheduleArgs = {
  distinct_on?: InputMaybe<Array<Course_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Schedule_Order_By>>;
  where?: InputMaybe<Course_Schedule_Bool_Exp>;
};


export type Subscription_RootCourse_Schedule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Schedule_Order_By>>;
  where?: InputMaybe<Course_Schedule_Bool_Exp>;
};


export type Subscription_RootCourse_Schedule_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCourse_StatusArgs = {
  distinct_on?: InputMaybe<Array<Course_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Status_Order_By>>;
  where?: InputMaybe<Course_Status_Bool_Exp>;
};


export type Subscription_RootCourse_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Status_Order_By>>;
  where?: InputMaybe<Course_Status_Bool_Exp>;
};


export type Subscription_RootCourse_Status_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootCourse_TrainerArgs = {
  distinct_on?: InputMaybe<Array<Course_Trainer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Trainer_Order_By>>;
  where?: InputMaybe<Course_Trainer_Bool_Exp>;
};


export type Subscription_RootCourse_Trainer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Trainer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Trainer_Order_By>>;
  where?: InputMaybe<Course_Trainer_Bool_Exp>;
};


export type Subscription_RootCourse_Trainer_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCourse_Trainer_TypeArgs = {
  distinct_on?: InputMaybe<Array<Course_Trainer_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Trainer_Type_Order_By>>;
  where?: InputMaybe<Course_Trainer_Type_Bool_Exp>;
};


export type Subscription_RootCourse_Trainer_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Trainer_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Trainer_Type_Order_By>>;
  where?: InputMaybe<Course_Trainer_Type_Bool_Exp>;
};


export type Subscription_RootCourse_Trainer_Type_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootCourse_TypeArgs = {
  distinct_on?: InputMaybe<Array<Course_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Type_Order_By>>;
  where?: InputMaybe<Course_Type_Bool_Exp>;
};


export type Subscription_RootCourse_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Type_Order_By>>;
  where?: InputMaybe<Course_Type_Bool_Exp>;
};


export type Subscription_RootCourse_Type_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootGradeArgs = {
  distinct_on?: InputMaybe<Array<Grade_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Grade_Order_By>>;
  where?: InputMaybe<Grade_Bool_Exp>;
};


export type Subscription_RootGrade_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Grade_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Grade_Order_By>>;
  where?: InputMaybe<Grade_Bool_Exp>;
};


export type Subscription_RootGrade_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootIdentityArgs = {
  distinct_on?: InputMaybe<Array<Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identity_Order_By>>;
  where?: InputMaybe<Identity_Bool_Exp>;
};


export type Subscription_RootIdentity_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identity_Order_By>>;
  where?: InputMaybe<Identity_Bool_Exp>;
};


export type Subscription_RootIdentity_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootIdentity_TypeArgs = {
  distinct_on?: InputMaybe<Array<Identity_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identity_Type_Order_By>>;
  where?: InputMaybe<Identity_Type_Bool_Exp>;
};


export type Subscription_RootIdentity_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Identity_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Identity_Type_Order_By>>;
  where?: InputMaybe<Identity_Type_Bool_Exp>;
};


export type Subscription_RootIdentity_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootLegacy_CertificateArgs = {
  distinct_on?: InputMaybe<Array<Legacy_Certificate_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Legacy_Certificate_Order_By>>;
  where?: InputMaybe<Legacy_Certificate_Bool_Exp>;
};


export type Subscription_RootLegacy_Certificate_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Legacy_Certificate_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Legacy_Certificate_Order_By>>;
  where?: InputMaybe<Legacy_Certificate_Bool_Exp>;
};


export type Subscription_RootLegacy_Certificate_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootModuleArgs = {
  distinct_on?: InputMaybe<Array<Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Order_By>>;
  where?: InputMaybe<Module_Bool_Exp>;
};


export type Subscription_RootModule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Module_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Order_By>>;
  where?: InputMaybe<Module_Bool_Exp>;
};


export type Subscription_RootModule_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootModule_CategoryArgs = {
  distinct_on?: InputMaybe<Array<Module_Category_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Category_Order_By>>;
  where?: InputMaybe<Module_Category_Bool_Exp>;
};


export type Subscription_RootModule_Category_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Module_Category_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Category_Order_By>>;
  where?: InputMaybe<Module_Category_Bool_Exp>;
};


export type Subscription_RootModule_Category_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootModule_GroupArgs = {
  distinct_on?: InputMaybe<Array<Module_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Group_Order_By>>;
  where?: InputMaybe<Module_Group_Bool_Exp>;
};


export type Subscription_RootModule_Group_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Module_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Group_Order_By>>;
  where?: InputMaybe<Module_Group_Bool_Exp>;
};


export type Subscription_RootModule_Group_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootModule_Group_DurationArgs = {
  distinct_on?: InputMaybe<Array<Module_Group_Duration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Group_Duration_Order_By>>;
  where?: InputMaybe<Module_Group_Duration_Bool_Exp>;
};


export type Subscription_RootModule_Group_Duration_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Module_Group_Duration_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Module_Group_Duration_Order_By>>;
  where?: InputMaybe<Module_Group_Duration_Bool_Exp>;
};


export type Subscription_RootModule_Group_Duration_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootOrderArgs = {
  distinct_on?: InputMaybe<Array<Order_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Order_Order_By>>;
  where?: InputMaybe<Order_Bool_Exp>;
};


export type Subscription_RootOrder_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Order_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Order_Order_By>>;
  where?: InputMaybe<Order_Bool_Exp>;
};


export type Subscription_RootOrder_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootOrganizationArgs = {
  distinct_on?: InputMaybe<Array<Organization_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Order_By>>;
  where?: InputMaybe<Organization_Bool_Exp>;
};


export type Subscription_RootOrganization_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Order_By>>;
  where?: InputMaybe<Organization_Bool_Exp>;
};


export type Subscription_RootOrganization_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootOrganization_GroupArgs = {
  distinct_on?: InputMaybe<Array<Organization_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Group_Order_By>>;
  where?: InputMaybe<Organization_Group_Bool_Exp>;
};


export type Subscription_RootOrganization_Group_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Group_Order_By>>;
  where?: InputMaybe<Organization_Group_Bool_Exp>;
};


export type Subscription_RootOrganization_Group_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootOrganization_MemberArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Order_By>>;
  where?: InputMaybe<Organization_Member_Bool_Exp>;
};


export type Subscription_RootOrganization_Member_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Order_By>>;
  where?: InputMaybe<Organization_Member_Bool_Exp>;
};


export type Subscription_RootOrganization_Member_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootOrganization_Member_RoleArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Role_Order_By>>;
  where?: InputMaybe<Organization_Member_Role_Bool_Exp>;
};


export type Subscription_RootOrganization_Member_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Member_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Member_Role_Order_By>>;
  where?: InputMaybe<Organization_Member_Role_Bool_Exp>;
};


export type Subscription_RootOrganization_Member_Role_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootOrganization_RoleArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};


export type Subscription_RootOrganization_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Role_Order_By>>;
  where?: InputMaybe<Organization_Role_Bool_Exp>;
};


export type Subscription_RootOrganization_Role_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootOrganization_StatusArgs = {
  distinct_on?: InputMaybe<Array<Organization_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Status_Order_By>>;
  where?: InputMaybe<Organization_Status_Bool_Exp>;
};


export type Subscription_RootOrganization_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Organization_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Organization_Status_Order_By>>;
  where?: InputMaybe<Organization_Status_Bool_Exp>;
};


export type Subscription_RootOrganization_Status_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootPayment_MethodsArgs = {
  distinct_on?: InputMaybe<Array<Payment_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Payment_Methods_Order_By>>;
  where?: InputMaybe<Payment_Methods_Bool_Exp>;
};


export type Subscription_RootPayment_Methods_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payment_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Payment_Methods_Order_By>>;
  where?: InputMaybe<Payment_Methods_Bool_Exp>;
};


export type Subscription_RootPayment_Methods_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootProfileArgs = {
  distinct_on?: InputMaybe<Array<Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Order_By>>;
  where?: InputMaybe<Profile_Bool_Exp>;
};


export type Subscription_RootProfile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Order_By>>;
  where?: InputMaybe<Profile_Bool_Exp>;
};


export type Subscription_RootProfile_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootProfile_RoleArgs = {
  distinct_on?: InputMaybe<Array<Profile_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Role_Order_By>>;
  where?: InputMaybe<Profile_Role_Bool_Exp>;
};


export type Subscription_RootProfile_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Profile_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Role_Order_By>>;
  where?: InputMaybe<Profile_Role_Bool_Exp>;
};


export type Subscription_RootProfile_Role_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootProfile_StatusArgs = {
  distinct_on?: InputMaybe<Array<Profile_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Status_Order_By>>;
  where?: InputMaybe<Profile_Status_Bool_Exp>;
};


export type Subscription_RootProfile_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Profile_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Status_Order_By>>;
  where?: InputMaybe<Profile_Status_Bool_Exp>;
};


export type Subscription_RootProfile_Status_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootProfile_TempArgs = {
  distinct_on?: InputMaybe<Array<Profile_Temp_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Temp_Order_By>>;
  where?: InputMaybe<Profile_Temp_Bool_Exp>;
};


export type Subscription_RootProfile_Temp_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Profile_Temp_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Profile_Temp_Order_By>>;
  where?: InputMaybe<Profile_Temp_Bool_Exp>;
};


export type Subscription_RootProfile_Temp_By_PkArgs = {
  id: Scalars['Int'];
};


export type Subscription_RootResourceArgs = {
  distinct_on?: InputMaybe<Array<Resource_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Resource_Order_By>>;
  where?: InputMaybe<Resource_Bool_Exp>;
};


export type Subscription_RootResource_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Resource_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Resource_Order_By>>;
  where?: InputMaybe<Resource_Bool_Exp>;
};


export type Subscription_RootResource_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootRoleArgs = {
  distinct_on?: InputMaybe<Array<Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Role_Order_By>>;
  where?: InputMaybe<Role_Bool_Exp>;
};


export type Subscription_RootRole_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Role_Order_By>>;
  where?: InputMaybe<Role_Bool_Exp>;
};


export type Subscription_RootRole_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootVenueArgs = {
  distinct_on?: InputMaybe<Array<Venue_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Venue_Order_By>>;
  where?: InputMaybe<Venue_Bool_Exp>;
};


export type Subscription_RootVenue_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Venue_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Venue_Order_By>>;
  where?: InputMaybe<Venue_Bool_Exp>;
};


export type Subscription_RootVenue_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootWaitlistArgs = {
  distinct_on?: InputMaybe<Array<Waitlist_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Waitlist_Order_By>>;
  where?: InputMaybe<Waitlist_Bool_Exp>;
};


export type Subscription_RootWaitlist_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Waitlist_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Waitlist_Order_By>>;
  where?: InputMaybe<Waitlist_Bool_Exp>;
};


export type Subscription_RootWaitlist_By_PkArgs = {
  id: Scalars['uuid'];
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

/** columns and relationships of "venue" */
export type Venue = {
  __typename?: 'venue';
  addressLineOne: Scalars['String'];
  addressLineTwo?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  geoCoordinates?: Maybe<Scalars['point']>;
  googlePlacesId?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  name: Scalars['String'];
  postCode: Scalars['String'];
  /** An array relationship */
  schedule: Array<Course_Schedule>;
  /** An aggregate relationship */
  schedule_aggregate: Course_Schedule_Aggregate;
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "venue" */
export type VenueScheduleArgs = {
  distinct_on?: InputMaybe<Array<Course_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Schedule_Order_By>>;
  where?: InputMaybe<Course_Schedule_Bool_Exp>;
};


/** columns and relationships of "venue" */
export type VenueSchedule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Course_Schedule_Order_By>>;
  where?: InputMaybe<Course_Schedule_Bool_Exp>;
};

/** aggregated selection of "venue" */
export type Venue_Aggregate = {
  __typename?: 'venue_aggregate';
  aggregate?: Maybe<Venue_Aggregate_Fields>;
  nodes: Array<Venue>;
};

/** aggregate fields of "venue" */
export type Venue_Aggregate_Fields = {
  __typename?: 'venue_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Venue_Max_Fields>;
  min?: Maybe<Venue_Min_Fields>;
};


/** aggregate fields of "venue" */
export type Venue_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Venue_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "venue". All fields are combined with a logical 'AND'. */
export type Venue_Bool_Exp = {
  _and?: InputMaybe<Array<Venue_Bool_Exp>>;
  _not?: InputMaybe<Venue_Bool_Exp>;
  _or?: InputMaybe<Array<Venue_Bool_Exp>>;
  addressLineOne?: InputMaybe<String_Comparison_Exp>;
  addressLineTwo?: InputMaybe<String_Comparison_Exp>;
  city?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  geoCoordinates?: InputMaybe<Point_Comparison_Exp>;
  googlePlacesId?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  postCode?: InputMaybe<String_Comparison_Exp>;
  schedule?: InputMaybe<Course_Schedule_Bool_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "venue" */
export enum Venue_Constraint {
  /** unique or primary key constraint */
  VenuePkey = 'venue_pkey'
}

/** input type for inserting data into table "venue" */
export type Venue_Insert_Input = {
  addressLineOne?: InputMaybe<Scalars['String']>;
  addressLineTwo?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  geoCoordinates?: InputMaybe<Scalars['point']>;
  googlePlacesId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  postCode?: InputMaybe<Scalars['String']>;
  schedule?: InputMaybe<Course_Schedule_Arr_Rel_Insert_Input>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Venue_Max_Fields = {
  __typename?: 'venue_max_fields';
  addressLineOne?: Maybe<Scalars['String']>;
  addressLineTwo?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  googlePlacesId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  postCode?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Venue_Min_Fields = {
  __typename?: 'venue_min_fields';
  addressLineOne?: Maybe<Scalars['String']>;
  addressLineTwo?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  googlePlacesId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  postCode?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "venue" */
export type Venue_Mutation_Response = {
  __typename?: 'venue_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Venue>;
};

/** input type for inserting object relation for remote table "venue" */
export type Venue_Obj_Rel_Insert_Input = {
  data: Venue_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Venue_On_Conflict>;
};

/** on_conflict condition type for table "venue" */
export type Venue_On_Conflict = {
  constraint: Venue_Constraint;
  update_columns?: Array<Venue_Update_Column>;
  where?: InputMaybe<Venue_Bool_Exp>;
};

/** Ordering options when selecting data from "venue". */
export type Venue_Order_By = {
  addressLineOne?: InputMaybe<Order_By>;
  addressLineTwo?: InputMaybe<Order_By>;
  city?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  geoCoordinates?: InputMaybe<Order_By>;
  googlePlacesId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  postCode?: InputMaybe<Order_By>;
  schedule_aggregate?: InputMaybe<Course_Schedule_Aggregate_Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: venue */
export type Venue_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "venue" */
export enum Venue_Select_Column {
  /** column name */
  AddressLineOne = 'addressLineOne',
  /** column name */
  AddressLineTwo = 'addressLineTwo',
  /** column name */
  City = 'city',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  GeoCoordinates = 'geoCoordinates',
  /** column name */
  GooglePlacesId = 'googlePlacesId',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  PostCode = 'postCode',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "venue" */
export type Venue_Set_Input = {
  addressLineOne?: InputMaybe<Scalars['String']>;
  addressLineTwo?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  geoCoordinates?: InputMaybe<Scalars['point']>;
  googlePlacesId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
  postCode?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "venue" */
export enum Venue_Update_Column {
  /** column name */
  AddressLineOne = 'addressLineOne',
  /** column name */
  AddressLineTwo = 'addressLineTwo',
  /** column name */
  City = 'city',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  GeoCoordinates = 'geoCoordinates',
  /** column name */
  GooglePlacesId = 'googlePlacesId',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  PostCode = 'postCode',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** columns and relationships of "waitlist" */
export type Waitlist = {
  __typename?: 'waitlist';
  confirmed: Scalars['Boolean'];
  courseId: Scalars['Int'];
  createdAt: Scalars['timestamptz'];
  email: Scalars['String'];
  familyName: Scalars['String'];
  givenName: Scalars['String'];
  id: Scalars['uuid'];
  organizationId: Scalars['uuid'];
  phone: Scalars['String'];
};

/** aggregated selection of "waitlist" */
export type Waitlist_Aggregate = {
  __typename?: 'waitlist_aggregate';
  aggregate?: Maybe<Waitlist_Aggregate_Fields>;
  nodes: Array<Waitlist>;
};

/** aggregate fields of "waitlist" */
export type Waitlist_Aggregate_Fields = {
  __typename?: 'waitlist_aggregate_fields';
  avg?: Maybe<Waitlist_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Waitlist_Max_Fields>;
  min?: Maybe<Waitlist_Min_Fields>;
  stddev?: Maybe<Waitlist_Stddev_Fields>;
  stddev_pop?: Maybe<Waitlist_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Waitlist_Stddev_Samp_Fields>;
  sum?: Maybe<Waitlist_Sum_Fields>;
  var_pop?: Maybe<Waitlist_Var_Pop_Fields>;
  var_samp?: Maybe<Waitlist_Var_Samp_Fields>;
  variance?: Maybe<Waitlist_Variance_Fields>;
};


/** aggregate fields of "waitlist" */
export type Waitlist_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Waitlist_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Waitlist_Avg_Fields = {
  __typename?: 'waitlist_avg_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "waitlist". All fields are combined with a logical 'AND'. */
export type Waitlist_Bool_Exp = {
  _and?: InputMaybe<Array<Waitlist_Bool_Exp>>;
  _not?: InputMaybe<Waitlist_Bool_Exp>;
  _or?: InputMaybe<Array<Waitlist_Bool_Exp>>;
  confirmed?: InputMaybe<Boolean_Comparison_Exp>;
  courseId?: InputMaybe<Int_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  familyName?: InputMaybe<String_Comparison_Exp>;
  givenName?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  organizationId?: InputMaybe<Uuid_Comparison_Exp>;
  phone?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "waitlist" */
export enum Waitlist_Constraint {
  /** unique or primary key constraint */
  WaitlistCourseIdEmailKey = 'waitlist_course_id_email_key',
  /** unique or primary key constraint */
  WaitlistPkey = 'waitlist_pkey'
}

/** input type for incrementing numeric columns in table "waitlist" */
export type Waitlist_Inc_Input = {
  courseId?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "waitlist" */
export type Waitlist_Insert_Input = {
  confirmed?: InputMaybe<Scalars['Boolean']>;
  courseId?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  email?: InputMaybe<Scalars['String']>;
  familyName?: InputMaybe<Scalars['String']>;
  givenName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  organizationId?: InputMaybe<Scalars['uuid']>;
  phone?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Waitlist_Max_Fields = {
  __typename?: 'waitlist_max_fields';
  courseId?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  familyName?: Maybe<Scalars['String']>;
  givenName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  organizationId?: Maybe<Scalars['uuid']>;
  phone?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Waitlist_Min_Fields = {
  __typename?: 'waitlist_min_fields';
  courseId?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  familyName?: Maybe<Scalars['String']>;
  givenName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  organizationId?: Maybe<Scalars['uuid']>;
  phone?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "waitlist" */
export type Waitlist_Mutation_Response = {
  __typename?: 'waitlist_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Waitlist>;
};

/** on_conflict condition type for table "waitlist" */
export type Waitlist_On_Conflict = {
  constraint: Waitlist_Constraint;
  update_columns?: Array<Waitlist_Update_Column>;
  where?: InputMaybe<Waitlist_Bool_Exp>;
};

/** Ordering options when selecting data from "waitlist". */
export type Waitlist_Order_By = {
  confirmed?: InputMaybe<Order_By>;
  courseId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  familyName?: InputMaybe<Order_By>;
  givenName?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  organizationId?: InputMaybe<Order_By>;
  phone?: InputMaybe<Order_By>;
};

/** primary key columns input for table: waitlist */
export type Waitlist_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "waitlist" */
export enum Waitlist_Select_Column {
  /** column name */
  Confirmed = 'confirmed',
  /** column name */
  CourseId = 'courseId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Email = 'email',
  /** column name */
  FamilyName = 'familyName',
  /** column name */
  GivenName = 'givenName',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  Phone = 'phone'
}

/** input type for updating data in table "waitlist" */
export type Waitlist_Set_Input = {
  confirmed?: InputMaybe<Scalars['Boolean']>;
  courseId?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  email?: InputMaybe<Scalars['String']>;
  familyName?: InputMaybe<Scalars['String']>;
  givenName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  organizationId?: InputMaybe<Scalars['uuid']>;
  phone?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Waitlist_Stddev_Fields = {
  __typename?: 'waitlist_stddev_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Waitlist_Stddev_Pop_Fields = {
  __typename?: 'waitlist_stddev_pop_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Waitlist_Stddev_Samp_Fields = {
  __typename?: 'waitlist_stddev_samp_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Waitlist_Sum_Fields = {
  __typename?: 'waitlist_sum_fields';
  courseId?: Maybe<Scalars['Int']>;
};

/** update columns of table "waitlist" */
export enum Waitlist_Update_Column {
  /** column name */
  Confirmed = 'confirmed',
  /** column name */
  CourseId = 'courseId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Email = 'email',
  /** column name */
  FamilyName = 'familyName',
  /** column name */
  GivenName = 'givenName',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organizationId',
  /** column name */
  Phone = 'phone'
}

/** aggregate var_pop on columns */
export type Waitlist_Var_Pop_Fields = {
  __typename?: 'waitlist_var_pop_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Waitlist_Var_Samp_Fields = {
  __typename?: 'waitlist_var_samp_fields';
  courseId?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Waitlist_Variance_Fields = {
  __typename?: 'waitlist_variance_fields';
  courseId?: Maybe<Scalars['Float']>;
};

export type Unnamed_1_QueryVariables = Exact<{
  input: SearchTrainersInput;
}>;


export type Unnamed_1_Query = { __typename?: 'query_root', trainers?: Array<{ __typename?: 'SearchTrainer', id: any, fullName: string, avatar?: string | null, levels: Array<CourseLevel>, availability?: SearchTrainerAvailability | null } | null> | null };

export type UpsertZoomMeetingMutationVariables = Exact<{
  input?: InputMaybe<UpsertZoomMeetingInput>;
}>;


export type UpsertZoomMeetingMutation = { __typename?: 'mutation_root', upsertZoomMeeting?: { __typename?: 'UpsertZoomMeetingPayload', success: boolean, meeting?: { __typename?: 'ZoomMeeting', id: number, joinUrl: string } | null } | null };

export type StripeCreatePaymentMutationVariables = Exact<{
  input: StripeCreatePaymentIntentInput;
}>;


export type StripeCreatePaymentMutation = { __typename?: 'mutation_root', paymentIntent?: { __typename?: 'StripeCreatePaymentIntentOutput', clientSecret: string, amount: number, currency: Currency } | null };

export type CourseGradingDataQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type CourseGradingDataQuery = { __typename?: 'query_root', course?: { __typename?: 'course', id: number, name: string, type: Course_Type_Enum, level?: Course_Level_Enum | null, deliveryType: Course_Delivery_Type_Enum, participants: Array<{ __typename?: 'course_participant', id: any, attended?: boolean | null, grade?: Grade_Enum | null, profile: { __typename?: 'profile', id: any, fullName?: string | null } }>, modules: Array<{ __typename?: 'course_module', id: any, covered?: boolean | null, module: { __typename?: 'module', id: any, name: string, moduleGroup?: { __typename?: 'module_group', id: any, name: string } | null } }> } | null };

export type ProfilesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Profile_Order_By> | Profile_Order_By>;
  where?: InputMaybe<Profile_Bool_Exp>;
}>;


export type ProfilesQuery = { __typename?: 'query_root', profiles: Array<{ __typename?: 'profile', id: any, givenName: string, familyName: string, fullName?: string | null, title?: string | null, tags?: any | null, status: Profile_Status_Enum, addresses: any, attributes: any, contactDetails: any, dietaryRestrictions?: string | null, disabilities?: string | null, preferences: any, createdAt: any, updatedAt: any, email?: string | null, phone?: string | null, dob?: any | null, jobTitle?: string | null, organizations: Array<{ __typename?: 'organization_member', organization: { __typename?: 'organization', name: string, id: any, tags?: any | null, status: Organization_Status_Enum, contactDetails: any, attributes: any, addresses: any, preferences: any, createdAt: any, updatedAt: any } }>, roles: Array<{ __typename?: 'profile_role', role: { __typename?: 'role', name: string } }> }>, profilesAggregation: { __typename?: 'profile_aggregate', aggregate?: { __typename?: 'profile_aggregate_fields', count: number } | null } };

export type OrganizationsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Organization_Order_By> | Organization_Order_By>;
}>;


export type OrganizationsQuery = { __typename?: 'query_root', organizations: Array<{ __typename?: 'organization', id: any, name: string, tags?: any | null, status: Organization_Status_Enum, contactDetails: any, attributes: any, addresses: any, preferences: any, createdAt: any, updatedAt: any, members_aggregate: { __typename?: 'organization_member_aggregate', aggregate?: { __typename?: 'organization_member_aggregate_fields', count: number } | null } }>, organizationsAggregation: { __typename?: 'organization_aggregate', aggregate?: { __typename?: 'organization_aggregate_fields', count: number } | null } };

export type InsertWaitlistMutationVariables = Exact<{
  input: Waitlist_Insert_Input;
}>;


export type InsertWaitlistMutation = { __typename?: 'mutation_root', waitlist?: { __typename?: 'waitlist_mutation_response', affectedRows: number } | null };

export type FindLegacyCertificateQueryVariables = Exact<{
  code: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
}>;


export type FindLegacyCertificateQuery = { __typename?: 'query_root', results: Array<{ __typename?: 'legacy_certificate', id: any, number: string, courseName: string, expiryDate: any, certificationDate: any }> };

export type GetCertificateQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetCertificateQuery = { __typename?: 'query_root', certificate?: { __typename?: 'course_certificate', id: any, createdAt: any, updatedAt: any, number: string, expiryDate: any, certificationDate: any, courseName: string, courseLevel: string, profile?: { __typename?: 'profile', fullName?: string | null } | null, participant?: { __typename?: 'course_participant', id: any, grade?: Grade_Enum | null, dateGraded?: any | null, gradingModules: Array<{ __typename?: 'course_participant_module', completed: boolean, module: { __typename?: 'module', id: any, name: string, moduleGroup?: { __typename?: 'module_group', id: any, name: string } | null } }>, course: { __typename?: 'course', id: number, name: string, deliveryType: Course_Delivery_Type_Enum }, certificateChanges: Array<{ __typename?: 'course_certificate_changelog', id: any, createdAt: any, updatedAt: any, oldGrade: Grade_Enum, newGrade: Grade_Enum, notes: string, author: { __typename?: 'profile', fullName?: string | null } }> } | null } | null };

export type ImportLegacyCertificateMutationVariables = Exact<{
  id: Scalars['uuid'];
  number: Scalars['String'];
  expiryDate: Scalars['date'];
  certificationDate: Scalars['date'];
  courseName: Scalars['String'];
  courseLevel: Scalars['String'];
  profileId: Scalars['uuid'];
}>;


export type ImportLegacyCertificateMutation = { __typename?: 'mutation_root', insert_course_certificate_one?: { __typename?: 'course_certificate', id: any } | null, update_legacy_certificate?: { __typename?: 'legacy_certificate_mutation_response', returning: Array<{ __typename?: 'legacy_certificate', id: any }> } | null };

export type GetEvaluationQueryVariables = Exact<{
  courseId: Scalars['Int'];
  profileId: Scalars['uuid'];
}>;


export type GetEvaluationQuery = { __typename?: 'query_root', answers: Array<{ __typename?: 'course_evaluation_answers', id: any, answer?: string | null, question: { __typename?: 'course_evaluation_questions', id: any, type?: Course_Evaluation_Question_Type_Enum | null }, profile: { __typename?: 'profile', fullName?: string | null } }> };

export type GetEvaluationsSummaryQueryVariables = Exact<{
  courseId: Scalars['Int'];
}>;


export type GetEvaluationsSummaryQuery = { __typename?: 'query_root', answers: Array<{ __typename?: 'course_evaluation_answers', id: any, answer?: string | null, profile: { __typename?: 'profile', id: any, fullName?: string | null }, question: { __typename?: 'course_evaluation_questions', questionKey?: string | null, type?: Course_Evaluation_Question_Type_Enum | null, group?: Course_Evaluation_Question_Group_Enum | null } }> };

export type GetEvaluationsQueryVariables = Exact<{
  courseId: Scalars['Int'];
}>;


export type GetEvaluationsQuery = { __typename?: 'query_root', evaluations: Array<{ __typename?: 'course_evaluation_answers', id: any, profile: { __typename?: 'profile', id: any, fullName?: string | null, email?: string | null, organizations: Array<{ __typename?: 'organization_member', organization: { __typename?: 'organization', name: string } }> } }>, courseParticipantsAggregation: { __typename?: 'course_participant_aggregate', aggregate?: { __typename?: 'course_participant_aggregate_fields', count: number } | null } };

export type GetFeedbackUsersQueryVariables = Exact<{
  courseId: Scalars['Int'];
}>;


export type GetFeedbackUsersQuery = { __typename?: 'query_root', users: Array<{ __typename?: 'course_evaluation_answers', profile: { __typename?: 'profile', id: any, fullName?: string | null } }> };

export type GetCourseEvaluationQuestionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCourseEvaluationQuestionsQuery = { __typename?: 'query_root', questions: Array<{ __typename?: 'course_evaluation_questions', id: any, type?: Course_Evaluation_Question_Type_Enum | null, questionKey?: string | null, group?: Course_Evaluation_Question_Group_Enum | null, displayOrder: number, required: boolean }> };

export type SaveCourseEvaluationMutationVariables = Exact<{
  answers: Array<Course_Evaluation_Answers_Insert_Input> | Course_Evaluation_Answers_Insert_Input;
}>;


export type SaveCourseEvaluationMutation = { __typename?: 'mutation_root', inserted?: { __typename?: 'course_evaluation_answers_mutation_response', rows: Array<{ __typename?: 'course_evaluation_answers', id: any }> } | null };

export type GetCourseByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetCourseByIdQuery = { __typename?: 'query_root', course?: { __typename?: 'course', level?: Course_Level_Enum | null, id: number, createdAt: any, updatedAt: any, name: string, type: Course_Type_Enum, deliveryType: Course_Delivery_Type_Enum, status?: Course_Status_Enum | null, reaccreditation?: boolean | null, min_participants: number, max_participants: number, gradingConfirmed: boolean, go1Integration: boolean, aolCostOfCourse?: any | null, trainers: Array<{ __typename?: 'course_trainer', id: any, type: Course_Trainer_Type_Enum, profile: { __typename?: 'profile', id: any, givenName: string, familyName: string, fullName?: string | null } }>, schedule: Array<{ __typename?: 'course_schedule', id: any, createdAt: any, updatedAt: any, start: any, end: any, virtualLink?: string | null, venue?: { __typename?: 'venue', id: any, createdAt: any, updatedAt: any, name: string, city: string, addressLineOne: string, addressLineTwo?: string | null, postCode: string, geoCoordinates?: any | null, googlePlacesId?: string | null } | null }>, organization?: { __typename?: 'organization', id: any, name: string, tags?: any | null, status: Organization_Status_Enum, contactDetails: any, attributes: any, addresses: any, preferences: any, createdAt: any, updatedAt: any } | null, contactProfile?: { __typename?: 'profile', id: any, fullName?: string | null } | null, dates: { __typename?: 'course_schedule_aggregate', aggregate?: { __typename?: 'course_schedule_aggregate_fields', start?: { __typename?: 'course_schedule_min_fields', date?: any | null } | null, end?: { __typename?: 'course_schedule_max_fields', date?: any | null } | null } | null }, moduleGroupIds: Array<{ __typename?: 'course_module', module: { __typename?: 'module', moduleGroup?: { __typename?: 'module_group', id: any } | null } }>, certificateCount: { __typename?: 'course_participant_aggregate', aggregate?: { __typename?: 'course_participant_aggregate_fields', count: number } | null } } | null };

export type CourseModulesQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type CourseModulesQuery = { __typename?: 'query_root', courseModules: Array<{ __typename?: 'course_module', id: any, covered?: boolean | null, module: { __typename?: 'module', id: any, name: string, moduleGroup?: { __typename?: 'module_group', id: any, name: string } | null } }> };

export type TrainerCoursesQueryVariables = Exact<{
  orderBy?: InputMaybe<Array<Course_Order_By> | Course_Order_By>;
  where?: InputMaybe<Course_Bool_Exp>;
}>;


export type TrainerCoursesQuery = { __typename?: 'query_root', course: Array<{ __typename?: 'course', id: number, name: string, type: Course_Type_Enum, level?: Course_Level_Enum | null, status?: Course_Status_Enum | null, organization?: { __typename?: 'organization', name: string } | null, trainers: Array<{ __typename?: 'course_trainer', id: any, type: Course_Trainer_Type_Enum, status?: Course_Invite_Status_Enum | null, profile: { __typename?: 'profile', id: any } }>, dates: { __typename?: 'course_schedule_aggregate', aggregate?: { __typename?: 'course_schedule_aggregate_fields', start?: { __typename?: 'course_schedule_min_fields', date?: any | null } | null, end?: { __typename?: 'course_schedule_max_fields', date?: any | null } | null } | null }, modulesAgg: { __typename?: 'course_module_aggregate', aggregate?: { __typename?: 'course_module_aggregate_fields', count: number } | null } }> };

export type InsertCourseMutationVariables = Exact<{
  course: Course_Insert_Input;
}>;


export type InsertCourseMutation = { __typename?: 'mutation_root', insertCourse?: { __typename?: 'course_mutation_response', affectedRows: number, inserted: Array<{ __typename?: 'course', id: number }> } | null };

export type SaveCourseAttendanceMutationVariables = Exact<{
  attended: Array<Scalars['uuid']> | Scalars['uuid'];
  notAttended: Array<Scalars['uuid']> | Scalars['uuid'];
}>;


export type SaveCourseAttendanceMutation = { __typename?: 'mutation_root', saveAttended?: { __typename?: 'course_participant_mutation_response', affectedRows: number } | null, saveNotAttended?: { __typename?: 'course_participant_mutation_response', affectedRows: number } | null };

export type SaveModuleSelectionMutationVariables = Exact<{
  coveredModules: Array<Scalars['uuid']> | Scalars['uuid'];
  notCoveredModules: Array<Scalars['uuid']> | Scalars['uuid'];
  courseId: Scalars['Int'];
}>;


export type SaveModuleSelectionMutation = { __typename?: 'mutation_root', saveCovered?: { __typename?: 'course_module_mutation_response', affectedRows: number } | null, saveNotCovered?: { __typename?: 'course_module_mutation_response', affectedRows: number } | null, gradingConfirmed?: { __typename?: 'course', id: number } | null };

export type SaveCourseModulesMutationVariables = Exact<{
  courseId: Scalars['Int'];
  modules: Array<Course_Module_Insert_Input> | Course_Module_Insert_Input;
}>;


export type SaveCourseModulesMutation = { __typename?: 'mutation_root', deleted?: { __typename?: 'course_module_mutation_response', count: number } | null, inserted?: { __typename?: 'course_module_mutation_response', count: number } | null };

export type SetCourseStatusMutationVariables = Exact<{
  id: Scalars['Int'];
  status: Course_Status_Enum;
}>;


export type SetCourseStatusMutation = { __typename?: 'mutation_root', update_course_by_pk?: { __typename?: 'course', id: number } | null };

export type Unnamed_2_MutationVariables = Exact<{
  id: Scalars['uuid'];
  status: Course_Invite_Status_Enum;
}>;


export type Unnamed_2_Mutation = { __typename?: 'mutation_root', update_course_trainer_by_pk?: { __typename?: 'course_trainer', id: any, status?: Course_Invite_Status_Enum | null } | null };

export type SetCourseTrainersMutationVariables = Exact<{
  courseId: Scalars['Int'];
  trainers: Array<Course_Trainer_Insert_Input> | Course_Trainer_Insert_Input;
}>;


export type SetCourseTrainersMutation = { __typename?: 'mutation_root', delete_course_trainer?: { __typename?: 'course_trainer_mutation_response', returning: Array<{ __typename?: 'course_trainer', id: any }> } | null, insert_course_trainer?: { __typename?: 'course_trainer_mutation_response', returning: Array<{ __typename?: 'course_trainer', id: any }> } | null };

export type UpdateCourseMutationVariables = Exact<{
  courseId: Scalars['Int'];
  courseInput: Course_Set_Input;
  scheduleId: Scalars['uuid'];
  scheduleInput: Course_Schedule_Set_Input;
  trainers: Array<Course_Trainer_Insert_Input> | Course_Trainer_Insert_Input;
}>;


export type UpdateCourseMutation = { __typename?: 'mutation_root', updateCourse?: { __typename?: 'course', id: number, level?: Course_Level_Enum | null } | null, updateSchedule?: { __typename?: 'course_schedule', id: any } | null, deleteCourseTrainers?: { __typename?: 'course_trainer_mutation_response', returning: Array<{ __typename?: 'course_trainer', id: any }> } | null, insertCourseTrainers?: { __typename?: 'course_trainer_mutation_response', returning: Array<{ __typename?: 'course_trainer', id: any }> } | null };

export type OrganizationFragment = { __typename?: 'organization', id: any, name: string, tags?: any | null, status: Organization_Status_Enum, contactDetails: any, attributes: any, addresses: any, preferences: any, createdAt: any, updatedAt: any };

export type ProfileFragment = { __typename?: 'profile', id: any, givenName: string, familyName: string, fullName?: string | null, title?: string | null, tags?: any | null, status: Profile_Status_Enum, addresses: any, attributes: any, contactDetails: any, dietaryRestrictions?: string | null, disabilities?: string | null, preferences: any, createdAt: any, updatedAt: any, email?: string | null, phone?: string | null, dob?: any | null, jobTitle?: string | null, organizations: Array<{ __typename?: 'organization_member', organization: { __typename?: 'organization', id: any, name: string, tags?: any | null, status: Organization_Status_Enum, contactDetails: any, attributes: any, addresses: any, preferences: any, createdAt: any, updatedAt: any } }>, roles: Array<{ __typename?: 'profile_role', role: { __typename?: 'role', name: string } }> };

export type ModuleFragment = { __typename?: 'module', id: any, name: string, description?: string | null, level: Course_Level_Enum, type: Module_Category_Enum, createdAt: any, updatedAt: any };

export type ModuleGroupFragment = { __typename?: 'module_group', id: any, name: string, level: Course_Level_Enum, color: Color_Enum, mandatory: boolean, createdAt: any, updatedAt: any };

export type CourseFragment = { __typename?: 'course', id: number, createdAt: any, updatedAt: any, name: string, type: Course_Type_Enum, deliveryType: Course_Delivery_Type_Enum, status?: Course_Status_Enum | null, level?: Course_Level_Enum | null, reaccreditation?: boolean | null, min_participants: number, max_participants: number, gradingConfirmed: boolean, go1Integration: boolean, aolCostOfCourse?: any | null };

export type CourseDatesFragment = { __typename?: 'course_schedule_aggregate', aggregate?: { __typename?: 'course_schedule_aggregate_fields', start?: { __typename?: 'course_schedule_min_fields', date?: any | null } | null, end?: { __typename?: 'course_schedule_max_fields', date?: any | null } | null } | null };

export type CourseScheduleFragment = { __typename?: 'course_schedule', id: any, createdAt: any, updatedAt: any, start: any, end: any, virtualLink?: string | null };

export type VenueFragment = { __typename?: 'venue', id: any, createdAt: any, updatedAt: any, name: string, city: string, addressLineOne: string, addressLineTwo?: string | null, postCode: string, geoCoordinates?: any | null, googlePlacesId?: string | null };

export type CertificateFragment = { __typename?: 'course_certificate', id: any, createdAt: any, updatedAt: any, number: string, expiryDate: any, certificationDate: any, courseName: string, courseLevel: string };

export type CertificateChangelogFragment = { __typename?: 'course_certificate_changelog', id: any, createdAt: any, updatedAt: any, oldGrade: Grade_Enum, newGrade: Grade_Enum, notes: string };

export type LegacyCertificateFragment = { __typename?: 'legacy_certificate', id: any, number: string, courseName: string, expiryDate: any, certificationDate: any };

export type SaveCourseGradingMutationVariables = Exact<{
  modules: Array<Course_Participant_Module_Insert_Input> | Course_Participant_Module_Insert_Input;
  participantIds?: InputMaybe<Array<Scalars['uuid']> | Scalars['uuid']>;
  grade: Grade_Enum;
  feedback?: InputMaybe<Scalars['String']>;
}>;


export type SaveCourseGradingMutation = { __typename?: 'mutation_root', saveModules?: { __typename?: 'course_participant_module_mutation_response', affectedRows: number } | null, saveParticipantsGrade?: { __typename?: 'course_participant_mutation_response', affectedRows: number } | null };

export type UpdateGradeMutationVariables = Exact<{
  participantId: Scalars['uuid'];
  oldGrade: Grade_Enum;
  newGrade: Grade_Enum;
  note: Scalars['String'];
  authorId: Scalars['uuid'];
}>;


export type UpdateGradeMutation = { __typename?: 'mutation_root', updateCourseParticipant?: { __typename?: 'course_participant', id: any } | null, insertChangeLog?: { __typename?: 'course_certificate_changelog', id: any } | null };

export type AcceptInviteMutationVariables = Exact<{
  inviteId: Scalars['uuid'];
  courseId: Scalars['Int'];
}>;


export type AcceptInviteMutation = { __typename?: 'mutation_root', acceptInvite?: { __typename?: 'course_invites', status?: Course_Invite_Status_Enum | null } | null, addParticipant?: { __typename?: 'course_participant', id: any } | null };

export type DeclineInviteMutationVariables = Exact<{
  note?: InputMaybe<Scalars['String']>;
}>;


export type DeclineInviteMutation = { __typename?: 'mutation_root', invite?: { __typename?: 'DeclineInviteOutput', status: boolean } | null };

export type GetCourseInvitesQueryVariables = Exact<{
  courseId: Scalars['Int'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Course_Invites_Bool_Exp>;
  orderBy?: InputMaybe<Array<Course_Invites_Order_By> | Course_Invites_Order_By>;
}>;


export type GetCourseInvitesQuery = { __typename?: 'query_root', courseInvites: Array<{ __typename?: 'course_invites', id: any, email?: string | null, status?: Course_Invite_Status_Enum | null }>, courseInvitesAggregate: { __typename?: 'course_invites_aggregate', aggregate?: { __typename?: 'course_invites_aggregate_fields', count: number } | null } };

export type GetInviteQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInviteQuery = { __typename?: 'query_root', invite?: { __typename?: 'CourseInvite', id: string, status: InviteStatus, courseId: string, courseName: string, description?: string | null, trainerName: string, startDate: string, endDate: string, venueName: string, venueCoordinates?: string | null, venueAddress?: { __typename?: 'Address', addressLineOne?: string | null, addressLineTwo?: string | null, city?: string | null, postCode?: string | null } | null } | null };

export type RecreateCourseInviteMutationVariables = Exact<{
  inviteId: Scalars['uuid'];
  courseId?: InputMaybe<Scalars['Int']>;
  email?: InputMaybe<Scalars['String']>;
}>;


export type RecreateCourseInviteMutation = { __typename?: 'mutation_root', delete_course_invites_by_pk?: { __typename?: 'course_invites', id: any } | null, insert_course_invites_one?: { __typename?: 'course_invites', id: any } | null };

export type SaveCourseInvitesMutationVariables = Exact<{
  invites: Array<Course_Invites_Insert_Input> | Course_Invites_Insert_Input;
}>;


export type SaveCourseInvitesMutation = { __typename?: 'mutation_root', insert_course_invites?: { __typename?: 'course_invites_mutation_response', returning: Array<{ __typename?: 'course_invites', id: any }> } | null };

export type ModuleGroupsQueryVariables = Exact<{
  level: Course_Level_Enum;
  courseDeliveryType: Course_Delivery_Type_Enum;
  reaccreditation: Scalars['Boolean'];
  go1Integration: Scalars['Boolean'];
}>;


export type ModuleGroupsQuery = { __typename?: 'query_root', groups: Array<{ __typename?: 'module_group', id: any, name: string, level: Course_Level_Enum, color: Color_Enum, mandatory: boolean, createdAt: any, updatedAt: any, modules: Array<{ __typename?: 'module', id: any, name: string, description?: string | null, level: Course_Level_Enum, type: Module_Category_Enum, createdAt: any, updatedAt: any }>, duration: { __typename?: 'module_group_duration_aggregate', aggregate?: { __typename?: 'module_group_duration_aggregate_fields', sum?: { __typename?: 'module_group_duration_sum_fields', duration?: number | null } | null } | null } }> };

export type GetOrderQueryVariables = Exact<{
  orderId: Scalars['uuid'];
}>;


export type GetOrderQuery = { __typename?: 'query_root', order?: { __typename?: 'order', id: any, courseId: number, profileId: any, quantity: number, registrants: any, paymentMethod: Payment_Methods_Enum, orderTotal?: any | null, currency?: string | null, stripePaymentId?: string | null } | null };

export type GetOrdersQueryVariables = Exact<{
  orderBy?: InputMaybe<Array<Order_Order_By> | Order_Order_By>;
  where?: InputMaybe<Order_Bool_Exp>;
}>;


export type GetOrdersQuery = { __typename?: 'query_root', orders: Array<{ __typename?: 'order', id: any, createdAt: any, profileId: any, quantity: number, registrants: any, paymentMethod: Payment_Methods_Enum, orderTotal?: any | null, currency?: string | null, stripePaymentId?: string | null, course: { __typename?: 'course', name: string }, organization: { __typename?: 'organization', name: string } }> };

export type InsertOrderMutationVariables = Exact<{
  input: Order_Insert_Input;
}>;


export type InsertOrderMutation = { __typename?: 'mutation_root', order?: { __typename?: 'order', id: any } | null };

export type Unnamed_3_QueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type Unnamed_3_Query = { __typename?: 'query_root', organization?: { __typename?: 'organization', id: any, name: string, tags?: any | null, status: Organization_Status_Enum, contactDetails: any, attributes: any, addresses: any, preferences: any, createdAt: any, updatedAt: any, members: Array<{ __typename?: 'organization_member', profile: { __typename?: 'profile', id: any, givenName: string, familyName: string, fullName?: string | null, title?: string | null, tags?: any | null, status: Profile_Status_Enum, addresses: any, attributes: any, contactDetails: any, dietaryRestrictions?: string | null, disabilities?: string | null, preferences: any, createdAt: any, updatedAt: any, email?: string | null, phone?: string | null, dob?: any | null, jobTitle?: string | null, organizations: Array<{ __typename?: 'organization_member', organization: { __typename?: 'organization', id: any, name: string, tags?: any | null, status: Organization_Status_Enum, contactDetails: any, attributes: any, addresses: any, preferences: any, createdAt: any, updatedAt: any } }>, roles: Array<{ __typename?: 'profile_role', role: { __typename?: 'role', name: string } }> } }> } | null };

export type GetOrganizationsQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
}>;


export type GetOrganizationsQuery = { __typename?: 'query_root', orgs: Array<{ __typename?: 'organization', id: any, name: string, tags?: any | null, status: Organization_Status_Enum, contactDetails: any, attributes: any, addresses: any, preferences: any, createdAt: any, updatedAt: any }> };

export type InsertOrgMutationVariables = Exact<{
  name: Scalars['String'];
  addresses: Scalars['jsonb'];
}>;


export type InsertOrgMutation = { __typename?: 'mutation_root', org?: { __typename?: 'organization', id: any, name: string, tags?: any | null, status: Organization_Status_Enum, contactDetails: any, attributes: any, addresses: any, preferences: any, createdAt: any, updatedAt: any } | null };

export type CourseParticipantQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type CourseParticipantQuery = { __typename?: 'query_root', participant?: { __typename?: 'course_participant', id: any, attended?: boolean | null, grade?: Grade_Enum | null, dateGraded?: any | null, course: { __typename?: 'course', id: number, name: string, level?: Course_Level_Enum | null, deliveryType: Course_Delivery_Type_Enum }, profile: { __typename?: 'profile', fullName?: string | null, email?: string | null, contactDetails: any, organizations: Array<{ __typename?: 'organization_member', organization: { __typename?: 'organization', id: any, name: string } }> }, gradingModules: Array<{ __typename?: 'course_participant_module', id: any, completed: boolean, module: { __typename?: 'module', id: any, name: string, moduleGroup?: { __typename?: 'module_group', id: any, name: string } | null } }>, certificate?: { __typename?: 'course_certificate', id: any, createdAt: any, updatedAt: any, number: string, expiryDate: any, certificationDate: any, courseName: string, courseLevel: string } | null } | null };

export type GetCourseParticipantIdQueryVariables = Exact<{
  profileId: Scalars['uuid'];
  courseId: Scalars['Int'];
}>;


export type GetCourseParticipantIdQuery = { __typename?: 'query_root', course_participant: Array<{ __typename?: 'course_participant', id: any, grade?: Grade_Enum | null, dateGraded?: any | null, attended?: boolean | null, profile: { __typename?: 'profile', fullName?: string | null }, gradingModules: Array<{ __typename?: 'course_participant_module', completed: boolean, module: { __typename?: 'module', id: any, name: string, moduleGroup?: { __typename?: 'module_group', id: any, name: string } | null } }>, certificate?: { __typename?: 'course_certificate', id: any, createdAt: any, updatedAt: any, number: string, expiryDate: any, certificationDate: any, courseName: string, courseLevel: string } | null }> };

export type CourseParticipantsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Course_Participant_Order_By> | Course_Participant_Order_By>;
  where?: InputMaybe<Course_Participant_Bool_Exp>;
}>;


export type CourseParticipantsQuery = { __typename?: 'query_root', courseParticipants: Array<{ __typename?: 'course_participant', id: any, attended?: boolean | null, invoiceID?: any | null, bookingDate?: any | null, go1EnrolmentStatus?: Blended_Learning_Status_Enum | null, grade?: Grade_Enum | null, profile: { __typename?: 'profile', fullName?: string | null, email?: string | null, contactDetails: any, organizations: Array<{ __typename?: 'organization_member', organization: { __typename?: 'organization', id: any, name: string } }> }, certificate?: { __typename?: 'course_certificate', id: any, createdAt: any, updatedAt: any, number: string, expiryDate: any, certificationDate: any, courseName: string, courseLevel: string } | null, course: { __typename?: 'course', id: number, createdAt: any, updatedAt: any, name: string, type: Course_Type_Enum, deliveryType: Course_Delivery_Type_Enum, status?: Course_Status_Enum | null, level?: Course_Level_Enum | null, reaccreditation?: boolean | null, min_participants: number, max_participants: number, gradingConfirmed: boolean, go1Integration: boolean, aolCostOfCourse?: any | null } }>, courseParticipantsAggregation: { __typename?: 'course_participant_aggregate', aggregate?: { __typename?: 'course_participant_aggregate_fields', count: number } | null } };

export type FindProfilesQueryVariables = Exact<{
  where?: InputMaybe<Profile_Bool_Exp>;
}>;


export type FindProfilesQuery = { __typename?: 'query_root', profiles: Array<{ __typename?: 'profile', id: any, givenName: string, familyName: string, fullName?: string | null, title?: string | null, tags?: any | null, status: Profile_Status_Enum, addresses: any, attributes: any, contactDetails: any, dietaryRestrictions?: string | null, disabilities?: string | null, preferences: any, createdAt: any, updatedAt: any, email?: string | null, phone?: string | null, dob?: any | null, jobTitle?: string | null, organizations: Array<{ __typename?: 'organization_member', organization: { __typename?: 'organization', id: any, name: string, tags?: any | null, status: Organization_Status_Enum, contactDetails: any, attributes: any, addresses: any, preferences: any, createdAt: any, updatedAt: any } }>, roles: Array<{ __typename?: 'profile_role', role: { __typename?: 'role', name: string } }> }> };

export type GetProfileCertificationsQueryVariables = Exact<{
  profileId: Scalars['uuid'];
}>;


export type GetProfileCertificationsQuery = { __typename?: 'query_root', certificates: Array<{ __typename?: 'course_certificate', id: any, createdAt: any, updatedAt: any, number: string, expiryDate: any, certificationDate: any, courseName: string, courseLevel: string, participant?: { __typename?: 'course_participant', grade?: Grade_Enum | null } | null }>, upcomingCourses: Array<{ __typename?: 'course', id: number, level?: Course_Level_Enum | null }> };

export type GetTempProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTempProfileQuery = { __typename?: 'query_root', tempProfiles: Array<{ __typename?: 'profile_temp', quantity?: number | null, course?: { __typename?: 'course', id: number, name: string, maxParticipants: number, dates: { __typename?: 'course_schedule_aggregate', aggregate?: { __typename?: 'course_schedule_aggregate_fields', start?: { __typename?: 'course_schedule_min_fields', date?: any | null } | null, end?: { __typename?: 'course_schedule_max_fields', date?: any | null } | null } | null }, participants: { __typename?: 'course_participant_aggregate', aggregate?: { __typename?: 'course_participant_aggregate_fields', count: number } | null } } | null }> };

export type InsertProfileTempMutationVariables = Exact<{
  input: Profile_Temp_Insert_Input;
}>;


export type InsertProfileTempMutation = { __typename?: 'mutation_root', profile?: { __typename?: 'profile_temp_mutation_response', affectedRows: number } | null };

export type UpdateProfileMutationVariables = Exact<{
  input?: InputMaybe<Profile_Set_Input>;
  profileId: Scalars['uuid'];
}>;


export type UpdateProfileMutation = { __typename?: 'mutation_root', updated?: { __typename?: 'profile', id: any } | null };

export type TrainerScheduleQueryVariables = Exact<{ [key: string]: never; }>;


export type TrainerScheduleQuery = { __typename?: 'query_root', course: Array<{ __typename?: 'course', id: number, name: string, schedule: Array<{ __typename?: 'course_schedule', id: any, start: any, end: any, venue?: { __typename?: 'venue', city: string, addressLineOne: string, addressLineTwo?: string | null } | null }>, participants: { __typename?: 'course_participant_aggregate', aggregate?: { __typename?: 'course_participant_aggregate_fields', count: number } | null } }> };

export type GetUserCourseByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetUserCourseByIdQuery = { __typename?: 'query_root', course?: { __typename?: 'course', id: number, name: string, type: Course_Type_Enum, deliveryType: Course_Delivery_Type_Enum, level?: Course_Level_Enum | null, reaccreditation?: boolean | null, min_participants: number, max_participants: number, trainers: Array<{ __typename?: 'course_trainer', id: any, type: Course_Trainer_Type_Enum, profile: { __typename?: 'profile', id: any, givenName: string, familyName: string, fullName?: string | null } }>, schedule: Array<{ __typename?: 'course_schedule', id: any, createdAt: any, updatedAt: any, start: any, end: any, virtualLink?: string | null, venue?: { __typename?: 'venue', id: any, createdAt: any, updatedAt: any, name: string, city: string, addressLineOne: string, addressLineTwo?: string | null, postCode: string, geoCoordinates?: any | null, googlePlacesId?: string | null } | null }>, dates: { __typename?: 'course_schedule_aggregate', aggregate?: { __typename?: 'course_schedule_aggregate_fields', start?: { __typename?: 'course_schedule_min_fields', date?: any | null } | null, end?: { __typename?: 'course_schedule_max_fields', date?: any | null } | null } | null } } | null };

export type UserCoursesQueryVariables = Exact<{
  orderBy?: InputMaybe<Array<Course_Order_By> | Course_Order_By>;
  where?: InputMaybe<Course_Bool_Exp>;
}>;


export type UserCoursesQuery = { __typename?: 'query_root', course: Array<{ __typename?: 'course', id: number, name: string, type: Course_Type_Enum, level?: Course_Level_Enum | null, dates: { __typename?: 'course_schedule_aggregate', aggregate?: { __typename?: 'course_schedule_aggregate_fields', start?: { __typename?: 'course_schedule_min_fields', date?: any | null } | null, end?: { __typename?: 'course_schedule_max_fields', date?: any | null } | null } | null }, modulesAgg: { __typename?: 'course_module_aggregate', aggregate?: { __typename?: 'course_module_aggregate_fields', count: number } | null } }> };

export type GetProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileQuery = { __typename?: 'query_root', profile: Array<{ __typename?: 'profile', id: any, givenName: string, familyName: string, fullName?: string | null, title?: string | null, tags?: any | null, status: Profile_Status_Enum, addresses: any, attributes: any, contactDetails: any, dietaryRestrictions?: string | null, disabilities?: string | null, preferences: any, createdAt: any, updatedAt: any, email?: string | null, phone?: string | null, dob?: any | null, jobTitle?: string | null, organizations: Array<{ __typename?: 'organization_member', organization: { __typename?: 'organization', id: any, name: string, tags?: any | null, status: Organization_Status_Enum, contactDetails: any, attributes: any, addresses: any, preferences: any, createdAt: any, updatedAt: any } }>, roles: Array<{ __typename?: 'profile_role', role: { __typename?: 'role', name: string } }> }> };

export type GetProfileByIdQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetProfileByIdQuery = { __typename?: 'query_root', profile?: { __typename?: 'profile', id: any, givenName: string, familyName: string, fullName?: string | null, title?: string | null, tags?: any | null, status: Profile_Status_Enum, addresses: any, attributes: any, contactDetails: any, dietaryRestrictions?: string | null, disabilities?: string | null, preferences: any, createdAt: any, updatedAt: any, email?: string | null, phone?: string | null, dob?: any | null, jobTitle?: string | null, organizations: Array<{ __typename?: 'organization_member', organization: { __typename?: 'organization', id: any, name: string, tags?: any | null, status: Organization_Status_Enum, contactDetails: any, attributes: any, addresses: any, preferences: any, createdAt: any, updatedAt: any } }>, roles: Array<{ __typename?: 'profile_role', role: { __typename?: 'role', name: string } }> } | null };

export type GetProfileWithCriteriaQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Profile_Bool_Exp>;
}>;


export type GetProfileWithCriteriaQuery = { __typename?: 'query_root', profiles: Array<{ __typename?: 'profile', id: any, givenName: string, familyName: string, fullName?: string | null, title?: string | null, tags?: any | null, status: Profile_Status_Enum, addresses: any, attributes: any, contactDetails: any, dietaryRestrictions?: string | null, disabilities?: string | null, preferences: any, createdAt: any, updatedAt: any, email?: string | null, phone?: string | null, dob?: any | null, jobTitle?: string | null, organizations: Array<{ __typename?: 'organization_member', organization: { __typename?: 'organization', id: any, name: string, tags?: any | null, status: Organization_Status_Enum, contactDetails: any, attributes: any, addresses: any, preferences: any, createdAt: any, updatedAt: any } }>, roles: Array<{ __typename?: 'profile_role', role: { __typename?: 'role', name: string } }> }>, profile_aggregate: { __typename?: 'profile_aggregate', aggregate?: { __typename?: 'profile_aggregate_fields', count: number } | null } };

export type FindVenuesQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type FindVenuesQuery = { __typename?: 'query_root', venues: Array<{ __typename?: 'venue', id: any, createdAt: any, updatedAt: any, name: string, city: string, addressLineOne: string, addressLineTwo?: string | null, postCode: string, geoCoordinates?: any | null, googlePlacesId?: string | null }> };

export type InsertVenueMutationVariables = Exact<{
  venue: Venue_Insert_Input;
}>;


export type InsertVenueMutation = { __typename?: 'mutation_root', venue?: { __typename?: 'venue', id: any, createdAt: any, updatedAt: any, name: string, city: string, addressLineOne: string, addressLineTwo?: string | null, postCode: string, geoCoordinates?: any | null, googlePlacesId?: string | null } | null };
