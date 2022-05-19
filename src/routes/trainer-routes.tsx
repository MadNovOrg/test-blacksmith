import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { NotFound } from '@app/pages/common/NotFound'
import { CreateCourse } from '@app/pages/CreateCourse'
import { AssignTrainers } from '@app/pages/CreateCourse/components/AssignTrainers'
import { CreateCourseForm } from '@app/pages/CreateCourse/components/CreateCourseForm'
import { EditCourse } from '@app/pages/EditCourse'
import { MembershipAreaPage } from '@app/pages/MembershipArea'
import { BlogPage } from '@app/pages/MembershipArea/BlogPage'
import { BlogPostPage } from '@app/pages/MembershipArea/BlogPostPage'
import { MembershipDetailsPage } from '@app/pages/MembershipArea/MemberShipDetails'
import { CourseBuilder } from '@app/pages/trainer-pages/CourseBuilder'
import { CourseCertificationDetails } from '@app/pages/trainer-pages/CourseCertificationDetails'
import { CourseDetails } from '@app/pages/trainer-pages/CourseDetails'
import { CourseGrading } from '@app/pages/trainer-pages/CourseGrading'
import { ParticipantGrading } from '@app/pages/trainer-pages/CourseGrading/components/ParticipantGrading'
import { CourseGradingDetails } from '@app/pages/trainer-pages/CourseGradingDetails'
import { CourseAttendance } from '@app/pages/trainer-pages/CourseGradingDetails/CourseAttendance'
import { ModulesSelection } from '@app/pages/trainer-pages/CourseGradingDetails/ModulesSelection'
import { EvaluationSummary } from '@app/pages/trainer-pages/EvaluationSummary'
import { MyCourses } from '@app/pages/trainer-pages/MyCourses'
import { TrainerFeedback } from '@app/pages/trainer-pages/TrainerFeedback'
import { CourseEvaluation } from '@app/pages/user-pages/CourseEvaluation'

const TrainerBaseRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate replace to="courses" />} />

      <Route
        path="certification/:certificateId"
        element={<CourseCertificationDetails />}
      />

      <Route path="courses">
        <Route index element={<MyCourses />} />

        <Route path="new" element={<CreateCourse />}>
          <Route index element={<CreateCourseForm />} />
          <Route path="assign-trainers" element={<AssignTrainers />} />
        </Route>

        <Route path="edit/:id" element={<EditCourse />} />

        <Route path=":id">
          <Route index element={<Navigate replace to="details" />} />
          <Route path="modules" element={<CourseBuilder />} />
          <Route path="details" element={<CourseDetails />} />
          <Route path="grading" element={<CourseGrading />} />
          <Route
            path="grading/:participantId"
            element={<ParticipantGrading />}
          />
          <Route path="evaluation">
            <Route path="submit" element={<TrainerFeedback />} />
            <Route path="view" element={<CourseEvaluation />} />
            <Route path="summary" element={<EvaluationSummary />} />
          </Route>

          <Route path="grading-details" element={<CourseGradingDetails />}>
            <Route element={<CourseAttendance />} index />
            <Route path="modules" element={<ModulesSelection />} />
          </Route>
        </Route>
      </Route>

      <Route path="membership" element={<MembershipAreaPage />}>
        <Route index element={<Navigate replace to="details" />} />
        <Route path="details" element={<MembershipDetailsPage />} />
        <Route path="blog">
          <Route index element={<BlogPage />} />
          <Route path=":postId" element={<BlogPostPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default TrainerBaseRoutes
