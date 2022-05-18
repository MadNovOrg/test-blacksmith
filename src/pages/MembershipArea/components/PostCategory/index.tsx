import { Link, Typography } from '@mui/material'
import React from 'react'

import { getCategoryLink } from '../../utils'

type Props = {
  category: { id: string; name: string }
}

export const PostCategory: React.FC<Props> = ({ category }) => (
  <Link href={getCategoryLink(category.id)}>
    <Typography variant="body2" mb={1} sx={{ fontWeight: 500 }}>
      {category.name}
    </Typography>
  </Link>
)
