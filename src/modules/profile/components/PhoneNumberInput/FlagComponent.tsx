export const FlagComponent = ({
  isoCode,
  countryName,
}: {
  isoCode: string
  countryName: string
}) => {
  return (
    <img
      src={`https://flagcdn.com/16x12/${isoCode.toLowerCase()}.webp`}
      alt={countryName}
    />
  )
}
