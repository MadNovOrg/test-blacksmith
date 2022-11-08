import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const NotFound = React.lazy(() =>
  import('@app/pages/common/NotFound').then(module => ({
    default: module.NotFound,
  }))
)

const CreateCourse = React.lazy(() =>
  import('@app/pages/CreateCourse').then(module => ({
    default: module.CreateCourse,
  }))
)

const AssignTrainers = React.lazy(() =>
  import('@app/pages/CreateCourse/components/AssignTrainers').then(module => ({
    default: module.AssignTrainers,
  }))
)

const TrainerExpenses = React.lazy(() =>
  import('@app/pages/CreateCourse/components/TrainerExpenses').then(module => ({
    default: module.TrainerExpenses,
  }))
)

const ReviewAndConfirm = React.lazy(() =>
  import('@app/pages/CreateCourse/components/ReviewAndConfirm').then(
    module => ({
      default: module.ReviewAndConfirm,
    })
  )
)

const CreateCourseForm = React.lazy(() =>
  import('@app/pages/CreateCourse/components/CreateCourseForm').then(
    module => ({
      default: module.CreateCourseForm,
    })
  )
)

const EditCourse = React.lazy(() =>
  import('@app/pages/EditCourse').then(module => ({
    default: module.EditCourse,
  }))
)

const CourseDetails = React.lazy(() =>
  import('@app/pages/trainer-pages/CourseDetails').then(module => ({
    default: module.CourseDetails,
  }))
)

const MyCourses = React.lazy(() =>
  import('@app/pages/trainer-pages/MyCourses').then(module => ({
    default: module.MyCourses,
  }))
)

const SalesAdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate replace to="courses" />} />

      <Route path="courses">
        <Route index element={<MyCourses />} />

        <Route path="new" element={<CreateCourse />}>
          <Route index element={<CreateCourseForm />} />
          <Route path="assign-trainers" element={<AssignTrainers />} />
          <Route path="trainer-expenses" element={<TrainerExpenses />} />
          <Route path="review-and-confirm" element={<ReviewAndConfirm />} />
        </Route>

        <Route path="edit/:id" element={<EditCourse />} />

        <Route path=":id">
          <Route index element={<Navigate replace to="details" />} />
          <Route path="details" element={<CourseDetails />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default SalesAdminRoutes
