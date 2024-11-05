// contains all the query/mutation keys for queries and mutations
export const queryKey = {
  login: 'login',
  getOtp: 'getOtp',
  verifyOtp: 'verifyOtp',
  loginGoogle: 'loginGoogle',
  loginPhone: 'loginPhone',
  loginEmail: 'loginEmail',
  register: 'register',
  forgotPassword: 'forgotPassword',
  getPaymentDetails: 'getPaymentDetails',
  getCategoryMetaData: 'getCategoryMetaData',
  getOrganizationData: 'getOrganizationData',

  getProfileData: 'getProfileData',
  profile: 'updateProfile',

  getInventoryItems: 'getInventoryItems',
  getInventoryItem: 'getInventoryItem',

  getAllStore: 'getAllStores',
  addStore: 'addStore',
  addStoreImage: 'addStoreImage',
  deleteStoreImage: 'deleteStoreImage',
  makeStoreImageThumbnail: 'makeStoreImageThumbnail',
  getStoreDetails: 'getStoreDetails',
  editStoreDetails: 'editStoreDetails',
  editStoreTimings: 'editStoreTimings',
  addPayment: 'addPayment',
  getOrders: 'getOrders',
  updateOrder: 'updateOrder',
  updateFulfillmentStatus: 'updateFulfillmentStatus',
  getOrderDetails: 'getOrderDetails',
  getInvoice: 'getInvoice',
  exportOrderData: 'exportOrderData',
  orderResolution: 'orderResolution'
}
