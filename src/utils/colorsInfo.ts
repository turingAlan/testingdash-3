export const orderSatusColor = (orderStatus: string) => {
  switch (orderStatus) {
    case 'Pending':
      return '#edbc37'
    case 'Return':
      return '#ED4337'
    case 'ReturnToOrigin':
      return '#ED4337'
    case 'Packed':
      return '#FF7A00'
    case 'Processing':
      return '#3881E6'
    case 'Delivered':
      return '#00852A'
    case 'Completed':
      return '#00852A'
    case 'Cancelled':
      return '#002B49'
    default:
      return '#3881E6'
  }
}
