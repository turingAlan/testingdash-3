// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import CustomNextSteps from './CustomNextSteps'
import CustomAccountDetails from './CustomAccountDetails'
import CustomDialogAddPayment from '../../dialog-examples/CustomDialogAddPayment'

const Account = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CustomAccountDetails />
      </Grid>
      <Grid item>
        <CustomDialogAddPayment />
      </Grid>
      <Grid item xs={12}>
        <CustomNextSteps />
      </Grid>
    </Grid>
  )
}

export default Account
