import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Typography } from '@app/components/Typography'

import { DashboardCard } from './components/DashboardCard'

type TrainerDashboardProps = unknown

export const TrainerDashboard: React.FC<TrainerDashboardProps> = () => {
  const navigate = useNavigate()

  return (
    <div className="">
      <Typography variant="h4" className="mb-4">
        Trainer Base
      </Typography>
      <Typography variant="body2">&nbsp;</Typography>
      <div className="flex">
        <DashboardCard
          title="My Calendar"
          icon="calender"
          onClick={() => navigate('management')}
        >
          <p className="font-bold text-white text-sm">Next Event</p>
          <p className="font-light text-white text-2xl mb-4">
            3rd-4th May 2022
          </p>
          <p className="font-light text-white text-sm">
            Birchwood Academy, Wrotham, Kent Positive Behaviour Training: Level
            Two 14 Attendees
          </p>
        </DashboardCard>

        <DashboardCard
          title="Create a Course"
          icon="bookmark-collection"
          onClick={() => navigate('course')}
        >
          <Link
            to="course/create"
            className="block my-2 font-light text-white text-sm hover:underline"
          >
            Create a new course
          </Link>
          <Link
            to="course/history"
            className="block my-2 font-light text-white text-sm hover:underline"
          >
            Select from your previous courses
          </Link>
          <Link
            to="course/templates"
            className="block my-2 font-light text-white text-sm hover:underline"
          >
            Select a Team Teach template
          </Link>
          <Link
            to=""
            className="block my-2 font-light text-white text-sm hover:underline"
          >
            Create an exception
          </Link>
        </DashboardCard>
      </div>

      <div className="flex">
        <DashboardCard
          title="Course Manager"
          icon="supervisor"
          onClick={() => console.log('TBD')}
        >
          <p className="font-bold text-white text-sm">Next Event</p>
          <p className="font-light text-white text-2xl mb-4">
            Registration in progress
          </p>
          <p className="font-light text-white text-sm">
            Birchwood Academy, Wrotham, Kent Positive Behaviour Training: Level
            Two 14 Attendees
          </p>
        </DashboardCard>

        <DashboardCard
          title="Certification Centre"
          icon="school"
          onClick={() => console.log('TBD')}
        >
          <Link
            to=""
            className="block my-2 font-light text-white text-sm hover:underline"
          >
            Grade a course
          </Link>
          <Link
            to=""
            className="block my-2 font-light text-white text-sm hover:underline"
          >
            View your certification history
          </Link>
        </DashboardCard>
      </div>
    </div>
  )
}
