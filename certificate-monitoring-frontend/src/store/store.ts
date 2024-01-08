import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import subscriptionSlice from './subscription-slice';
import certificateSlice from './certificate-slice'

const store = configureStore({
  reducer: {
    certificatesReducer: certificateSlice,
   subscriptionReducer : subscriptionSlice,

  },
})

setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
