'use client'

import { Grid, Typography } from '@mui/material'

import CustomUserListTable from '@/views/apps/user/list/CustomUserListTable'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { customUsersType } from '@/types/apps/customUserTypes'

export type UsersType = {
  id: number
  role: string
  email: string
  status: string
  avatar: string
  company: string
  country: string
  contact: string
  fullName: string
  username: string
  currentPlan: string
  avatarColor?: ThemeColor
  billing: string
}

// create a dummy data of above types
// Galen Slixby gslixby0 editor enterprise Auto Debit inactive like this

const dummyUserData: customUsersType[] = [
  {
    id: 1,
    fullName: 'Galen Slixby',
    role: 'editor',
    email: 'gslixby0@enterprise.com',
    status: 'write',
    avatar: '/images/avatar1.png',
    avatarColor: 'primary',
    company: 'Enterprise',
    country: 'USA',
    city: 'City1',
    contact: '(123) 456-7890',
    username: 'gslixby0',
    billing: 'Auto Debit',
    currentPlan: 'Auto Debit'
  },
  {
    id: 2,
    fullName: 'John Doe',
    role: 'admin',
    email: 'jdoe@bigcorp.com',
    status: 'write',
    avatar: '/images/avatar2.png',
    avatarColor: 'secondary',
    company: 'Big Corp',
    city: 'City1',
    country: 'Canada',
    contact: '(321) 654-0987',
    username: 'jdoe1',
    billing: 'Manual Payment',
    currentPlan: 'Basic'
  },
  {
    id: 3,
    fullName: 'Alice Smith',
    role: 'subscriber',
    email: 'asmith@smallbiz.com',
    status: 'read',
    avatar: '/images/avatar3.png',
    avatarColor: 'info',
    company: 'Small Biz',
    country: 'UK',
    city: 'City1',
    contact: '(555) 555-5555',
    username: 'asmith2',
    billing: 'Auto Debit',
    currentPlan: 'Premium'
  }
]

export default function managerdetails() {
  return (
    <>
      <Grid container>
        <Typography variant='h3'>Access Control</Typography>
      </Grid>
      <br />
      <Grid>
        <Grid item xs={12} sm={6}>
          <CustomUserListTable tableData={dummyUserData} />
        </Grid>
      </Grid>
    </>
  )
}
