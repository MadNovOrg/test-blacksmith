import { Box, IconButton } from '@mui/material'
import { ArrowDropDownIcon } from '@mui/x-date-pickers'

export const FlagComponent = ({
  isoCode,
  countryName,
  isSelected,
}: {
  isoCode: string
  countryName: string
  isSelected: boolean
}) => {
  return (
    <Box sx={{ padding: '0px 0px 0px 10px' }}>
      <img
        src={`https://flagcdn.com/16x12/${isoCode.toLowerCase()}.webp`}
        alt={countryName}
      />
      {isSelected ? (
        <IconButton
          size="small"
          sx={{
            padding: '0px',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
          disableRipple
        >
          <ArrowDropDownIcon />
        </IconButton>
      ) : null}
    </Box>
  )
}
