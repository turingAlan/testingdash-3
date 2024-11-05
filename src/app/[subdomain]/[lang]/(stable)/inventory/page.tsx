'use client'

import { useState } from 'react'

import Inventory from '@/views/apps/inventory'
import CustomTextField from '@/@core/components/mui/TextField'

export default function InventoryScreen() {
  const [switchmode, setSwitchmode] = useState(true)
  const [search, setSearch] = useState('')

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex justify-between'>
        <div className='flex gap-2 items-center'>
          {!switchmode && (
            <i
              className='tabler-arrow-left cursor-pointer'
              onClick={() => {
                setSwitchmode(true)
              }}
            />
          )}
          <h2>{switchmode ? 'Inventory' : 'History'}</h2>
        </div>
        <div className='relative'>
          <CustomTextField
            placeholder='Search name'
            value={search}
            onChange={e => setSearch(e.target.value)}
            id='custom-search'
            sx={{ width: '200px' }}
          />
          <i className='tabler-search text-[20px] text-gray-500 absolute top-2 cursor-pointer right-2' />
        </div>
      </div>
      <Inventory setSwitchmode={setSwitchmode} search={search} />
    </div>
  )
}
