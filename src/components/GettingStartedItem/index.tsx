import { Box, Typography } from '@mui/material'

import { PlayIcon } from '@app/assets'
import theme from '@app/theme'

export type GettingStartedItemProps = {
  image: string
  title: string
  description: string
}

function GettingStartedItem({
  image,
  title,
  description,
}: Readonly<GettingStartedItemProps>) {
  return (
    <Box
      sx={{
        cursor: 'pointer',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        width: '100%',
        backgroundColor: 'grey.100',
        padding: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.100',
        '&:hover': {
          border: `1px solid ${theme.palette.secondary.main}`,
        },
      }}
    >
      <Box
        sx={{
          width: 100,
          height: 100,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          borderRadius: 4,
          marginRight: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          gridRowStart: 2,
        }}
      >
        <PlayIcon width={32} height={32} />
      </Box>

      <Typography
        variant="h5"
        fontWeight={600}
        sx={{
          gridColumnStart: 2,
          gridRowStart: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          gridColumnStart: 2,
          gridRowStart: 2,
        }}
      >
        {description}
      </Typography>
    </Box>
  )
}

export default GettingStartedItem
