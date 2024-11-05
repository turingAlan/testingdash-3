'use client'

import { Grid, Typography } from '@mui/material'

import type { customUsersType } from '@/types/apps/customUserTypes'
import CustomCustomerQueriesListTable from '@/views/apps/user/list/CustomCustomerQueriesListTable'

const dummyUserData: customUsersType[] = [
  {
    id: 1,
    fullName: 'Galen Slixby',
    role: 'editor',
    email: 'gslixby0@enterprise.com',
    status: 'Inactive',
    avatar: '/images/avatar1.png',
    avatarColor: 'primary',
    company: 'Enterprise',
    country: 'USA',
    city: 'City1',
    contact: '1234567890',
    username: 'gslixby0',
    billing: 'Auto Debit',
    currentPlan: 'Auto Debit',
    created_at: '2024-10-10T00:09:14.808009+05:30'
  },
  {
    id: 2,
    fullName: 'John Doe',
    role: 'admin',
    email: 'jdoe@bigcorp.com',
    city: 'City1',
    status: 'Active',
    avatar: '/images/avatar2.png',
    avatarColor: 'secondary',
    company: 'Big Corp',
    country: 'Canada',
    contact: '3216540987',
    username: 'jdoe1',
    billing: 'Manual Payment',
    currentPlan: 'Basic',
    created_at: '2024-10-10T00:09:14.808009+05:30'
  },
  {
    id: 3,
    fullName: 'Alice Smith',
    role: 'subscriber',
    email: 'asmith@smallbiz.com',
    status: 'Active',
    avatar: '/images/avatar3.png',
    avatarColor: 'info',
    company: 'Small Biz',
    country: 'UK',
    city: 'City1',
    contact: '5555555555',
    username: 'asmith2',
    billing: 'Auto Debit',
    currentPlan: 'Premium',
    created_at: '2024-10-10T00:09:14.808009+05:30'
  }
]

export default function CostumerQueries() {
  return (
    <>
      <Grid>
        <Typography variant='h3'>Costumer Queries</Typography>
      </Grid>
      <Grid xs={12}>
        <CustomCustomerQueriesListTable tableData={dummyUserData} />
      </Grid>
    </>
  )
}
