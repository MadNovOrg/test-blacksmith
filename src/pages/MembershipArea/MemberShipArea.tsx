import React from 'react'

type MembershipAreaPageProps = unknown

export const MembershipAreaPage: React.FC<MembershipAreaPageProps> = () => {
  return (
    <div>
      <div className="p-8 clear-rightpb-8 font-light text-2xl sm:text-4xl">
        Membership Details
      </div>

      <div className="p-8">
        id, start, end, cycle dates, amount, free period information etc)
      </div>
    </div>
  )
}
