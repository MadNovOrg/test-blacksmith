import React from 'react'

type MyMembershipProps = unknown

const Plans: React.FC<MyMembershipProps> = () => {
  return (
    <div className="flex">
      <div className="p-8">
        <div className="pb-8 font-light text-2xl sm:text-4xl">Plans</div>
      </div>
    </div>
  )
}

export default Plans
