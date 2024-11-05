import { Grid } from '@mui/material'

import CustomPrivacyPolicy from './CustomPrivacyPolicy'

const PrivacyPolicy = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CustomPrivacyPolicy />
      </Grid>
    </Grid>
  )
}

export default PrivacyPolicy
