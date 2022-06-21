import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { MembershipAreaPage } from '@app/pages/MembershipArea'

const Blog = React.lazy(() => import('@app/pages/MembershipArea/pages/Blog'))
const Post = React.lazy(() => import('@app/pages/MembershipArea/pages/Post'))
const Category = React.lazy(
  () => import('@app/pages/MembershipArea/pages/Category')
)

const Ebooks = React.lazy(
  () => import('@app/pages/MembershipArea/pages/Ebooks')
)
const Home = React.lazy(() => import('@app/pages/MembershipArea/pages/Home'))
const Podcast = React.lazy(
  () => import('@app/pages/MembershipArea/pages/Podcast')
)
const Podcasts = React.lazy(
  () => import('@app/pages/MembershipArea/pages/Podcasts')
)
const ResearchSummaries = React.lazy(
  () => import('@app/pages/MembershipArea/pages/ResearchSummaries')
)
const Tag = React.lazy(() => import('@app/pages/MembershipArea/pages/Tag'))
const VideoItem = React.lazy(
  () => import('@app/pages/MembershipArea/pages/VideoItem')
)
const VideoSeries = React.lazy(
  () => import('@app/pages/MembershipArea/pages/VideoSeries')
)
const Webinar = React.lazy(
  () => import('@app/pages/MembershipArea/pages/Webinar')
)
const Webinars = React.lazy(
  () => import('@app/pages/MembershipArea/pages/Webinars')
)

const MembershipRoutes: React.FC = () => (
  <Routes>
    <Route path="" element={<MembershipAreaPage />}>
      <Route index element={<Home />} />
      <Route path="blog">
        <Route index element={<Blog />} />
        <Route path=":id" element={<Post />} />
        <Route path="tag/:id" element={<Tag />} />
        <Route path="category/:id" element={<Category />} />
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
    </Route>
  </Routes>
)

export default MembershipRoutes
