import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { MembershipAreaPage } from '@app/modules/membership_area/pages/MembershipArea'

const Blog = React.lazy(() => import('@app/modules/membership_area/pages/Blog'))
const Post = React.lazy(() => import('@app/modules/membership_area/pages/Post'))

const Ebooks = React.lazy(
  () => import('@app/modules/membership_area/pages/Ebooks'),
)
const Home = React.lazy(() => import('@app/modules/membership_area/pages/Home'))
const Podcast = React.lazy(
  () => import('@app/modules/membership_area/pages/Podcast'),
)
const Podcasts = React.lazy(
  () => import('@app/modules/membership_area/pages/Podcasts'),
)
const ResearchSummaries = React.lazy(
  () => import('@app/modules/membership_area/pages/ResearchSummaries'),
)
const VideoItem = React.lazy(
  () => import('@app/modules/membership_area/pages/VideoItem'),
)
const VideoSeries = React.lazy(
  () => import('@app/modules/membership_area/pages/VideoSeries'),
)
const Webinar = React.lazy(
  () => import('@app/modules/membership_area/pages/Webinar'),
)
const Webinars = React.lazy(
  () => import('@app/modules/membership_area/pages/Webinars'),
)
const Term = React.lazy(() => import('@app/modules/membership_area/pages/Term'))

const MembershipRoutes: React.FC<React.PropsWithChildren<unknown>> = () => (
  <Routes>
    <Route path="" element={<MembershipAreaPage />}>
      <Route index element={<Home />} />
      <Route path="blog">
        <Route index element={<Blog />} />
        <Route path=":id" element={<Post />} />
      </Route>
      <Route path="podcasts">
        <Route index element={<Podcasts />} />
        <Route path=":id" element={<Podcast />} />
      </Route>
      <Route path="video-series">
        <Route index element={<VideoSeries />} />
        <Route path=":id" element={<VideoItem />} />
      </Route>
      <Route path="ebooks">
        <Route index element={<Ebooks />} />
      </Route>
      <Route path="research-summaries">
        <Route index element={<ResearchSummaries />} />
      </Route>
      <Route path="webinars">
        <Route index element={<Webinars />} />
        <Route path=":id" element={<Webinar />} />
      </Route>
      <Route path="term/:id" element={<Term />} />
    </Route>
  </Routes>
)

export default MembershipRoutes
