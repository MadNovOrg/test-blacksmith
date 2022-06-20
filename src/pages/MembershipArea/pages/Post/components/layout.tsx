import { Box, Skeleton, styled } from '@mui/material'

import { PostImage } from '@app/pages/MembershipArea/components/PostImage'

export const RecentPostsBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 8),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0, 3),
  },
}))

export const PostImageBox = styled(Box)(({ theme }) => ({
  transform: 'translateX(-8%)',
  maxWidth: '120%',

  [theme.breakpoints.down('lg')]: {
    transform: 'none',
  },
}))

export const BleedPostImage = styled(PostImage)(({ theme }) => ({
  maxWidth: '120%',

  [theme.breakpoints.down('lg')]: {
    maxWidth: '100%',
  },
}))

export const BleedPostImageSkeleton = styled(Skeleton)(({ theme }) => ({
  width: '120%',
  maxWidth: '120%',

  [theme.breakpoints.down('lg')]: {
    width: '100%',
    maxWidth: '120%',
  },
}))
