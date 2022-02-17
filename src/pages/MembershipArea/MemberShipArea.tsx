import React from 'react'

import { Dropdown } from '@app/components/Dropdown'

type MembershipAreaPageProps = unknown

export const MembershipAreaPage: React.FC<MembershipAreaPageProps> = () => {
  return (
    <div>
      <div className="p-8 clear-rightpb-8 font-light text-2xl sm:text-4xl">
        Membership Details
        <div className="mt-8">
          <Dropdown
            title={'Choose plan'}
            items={['Choice 1', 'Choice 2', 'Choice 3']}
            handleClick={item => console.log(item)}
          />
        </div>
      </div>
    </div>
  )
}
