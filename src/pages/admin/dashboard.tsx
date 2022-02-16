import React from 'react'
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  InboxIcon,
  UsersIcon,
} from '@heroicons/react/outline'
import { Link, Outlet } from 'react-router-dom'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const navigation = [
  {
    name: 'Organizations',
    href: '/admin/organizations',
    icon: FolderIcon,
    current: false,
  },
  {
    name: 'Trainers',
    href: '/admin/trainers',
    icon: UsersIcon,
    current: false,
  },
  {
    name: 'Trainees',
    href: '/admin/trainees',
    icon: UsersIcon,
    current: false,
  },
  { name: 'Members', href: '/admin/members', icon: UsersIcon, current: false },
  { name: 'Leads', href: '/admin/leads', icon: InboxIcon, current: false },
  {
    name: 'Calendar',
    href: '/admin/calendar',
    icon: CalendarIcon,
    current: false,
  },
  { name: 'Team', href: '/admin/team', icon: UsersIcon, current: false },
  {
    name: 'Documents',
    href: '/admin/documents',
    icon: InboxIcon,
    current: false,
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: ChartBarIcon,
    current: false,
  },
  {
    name: 'Plans',
    href: '/admin/plans',
    icon: UsersIcon,
    current: false,
  },
]

function Dashboard() {
  return (
    <section className="mt-4 grid grid-cols-12 flex-1">
      <div className="col-span-3">
        <nav className="space-y-1 pr-8" aria-label="Sidebar">
          {navigation.map(item => (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                item.current
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? 'text-gray-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="col-span-9 flex flex-col flex-1">
        <Outlet />
      </div>
    </section>
  )
}

export default Dashboard
