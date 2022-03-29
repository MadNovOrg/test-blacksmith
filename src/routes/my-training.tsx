import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { NotFound } from '@app/components/NotFound'

import { MyTrainingPage } from '@app/pages/MyTraining'
import { ParticipantCourse } from '@app/pages/MyTraining/ParticipantCourse'
import { AcceptInvite } from '@app/pages/MyTraining/AcceptInvite'
import { MyTrainingDashboard } from '@app/pages/MyTraining/MyTrainingDashboard'
import { MyCertifications } from '@app/pages/MyTraining/MyCertifications'
import { MyResources } from '@app/pages/MyTraining/MyResources'
import { MyMembership } from '@app/pages/MyTraining/MyMembership'
import { MyUpcomingTraining } from '@app/pages/MyTraining/MyUpcomingTraining'
import { CourseEvaluation } from '@app/pages/MyTraining/CourseEvaluation'

const MyTrainingRoutes = () => {
  return (
    <Routes>
      <Route element={<MyTrainingPage />}>
        <Route index element={<MyTrainingDashboard />} />
        <Route path="upcoming-training" element={<MyUpcomingTraining />} />
        <Route path="courses">
          <Route path=":id">
            <Route index element={<ParticipantCourse />} />
            <Route path="evaluation" element={<CourseEvaluation />} />
          </Route>
        </Route>
        <Route path="accept-invite/:id" element={<AcceptInvite />} />
        <Route path="certifications" element={<MyCertifications />} />
        <Route path="resources" element={<MyResources />} />
        <Route path="membership" element={<MyMembership />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default MyTrainingRoutes
