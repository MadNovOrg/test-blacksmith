import { Link, Outlet } from 'react-router-dom'
import React from 'react'

const navigation = [
  {
    name: 'Membership Details',
    href: '/membership-area/details',
    current: false,
  },
  {
    name: 'Blog',
    href: '/membership-area/blog',
    current: false,
  },
]

export function MembershipAreaPage() {
  return (
    <section>
      <div>
        <nav aria-label="Sidebar">
          {navigation.map(item => (
            <Link
              key={item.name}
              to={item.href}
              aria-current={item.current ? 'page' : undefined}
            >
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div>
        <Outlet />
      </div>
    </section>
  )
}
