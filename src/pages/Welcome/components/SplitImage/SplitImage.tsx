import { Box, Typography } from '@mui/material'

export const SplitImage: React.FC<
  React.PropsWithChildren<{
    image: string
    title: string
    description: string
    imagePosition?: 'left' | 'right'
  }>
> = ({ image, title, description, imagePosition = 'left', children }) => {
  return (
    <Box
      sx={{
        display: {
          md: 'flex',
        },
        justifyItems: {
          md: 'space-between',
        },
        flexDirection: {
          md: imagePosition === 'left' ? 'row' : 'row-reverse',
        },
      }}
    >
      <Box flex="1">
        <img src={image} alt={title} style={{ maxWidth: '100%' }} />
      </Box>
      <Box
        flex="1"
        sx={{
          pt: { md: 2 },
          pl: { md: imagePosition === 'left' ? 10 : 0 },
          pr: { md: imagePosition === 'left' ? 0 : 10 },
        }}
      >
        <Typography
          variant="h3"
          color="primary"
          fontWeight={500}
          fontFamily="Poppins"
          mb={3}
          mt={6}
        >
          {title}
        </Typography>

        <Typography>{description}</Typography>

        <Box mt={2}>{children}</Box>
      </Box>
    </Box>
  )
}
