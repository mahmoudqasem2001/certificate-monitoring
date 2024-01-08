import { AnyAction, createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import  {CertificateModel}  from '../interfaces/certificate'
import axios from 'axios'
import { getEnv } from '../env'

interface MessagesSlice {
  certificates: CertificateModel[]
  hasError: boolean
  isLoading: boolean
  isFetched:boolean
  showExpired: boolean
  domain:string
}

const initialState: MessagesSlice = {
  certificates: [],
  hasError: false,
  isLoading: false,
  isFetched:false,
  showExpired: false,
  domain:''

}

const apiUrl = getEnv('API_URL')

 export const fetchCertificatesAsync = createAsyncThunk<CertificateModel[], string>(
    'certificates/fetchCertificates',
    async (domain: string, {rejectWithValue}) => {
        try {
             const response = await axios.get(`${apiUrl}?domain=${domain}`);
             return response.data;
        } catch (error) {
            return rejectWithValue({ message: 'Error: Something went wrong.' })
        }
     
    }

  );

 export const certificatesSlice = createSlice({
    name: 'certificates',
    initialState,
    reducers: {
        setDomain(state , action: PayloadAction<string>){
            state.domain = action.payload
        },
        setFetched(state , action: PayloadAction<boolean>){
            state.isFetched= action.payload
        },
        setShowExpired(state , action: PayloadAction<boolean>){
            state.showExpired= action.payload
        },
        
        
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCertificatesAsync.pending, (state) => {
          state.isLoading = true;
          state.isFetched=false;
        })
        .addCase(fetchCertificatesAsync.fulfilled, (state, action: PayloadAction<CertificateModel[]>) => {
          state.isLoading = false;
          state.isFetched=true;
        if(action.payload.length>0){
          const transformedCertificates : CertificateModel[] = action.payload.map((certData : any) => ({
            id: certData.id,
            crtShId: certData.serial_number,
            loggedAt: certData.entry_timestamp,
            notBefore: certData.not_before,
            notAfter: certData.not_after,
            commonName: certData.common_name,
            matchingIdentities: certData.name_value,
            issuerName: certData.issuer_name,
          }));
        
          state.certificates = transformedCertificates;
        }
          
          state.hasError = false;
        })
        .addCase(fetchCertificatesAsync.rejected, (state) => {
          state.isLoading = false;
          state.hasError = true;
          state.isFetched=false;
        });
    },
  });

  const {
    setDomain,
    setFetched,
    setShowExpired,
  } = certificatesSlice.actions
  

  const fetchCertificates = (domain: string) => {
    return ((dispatch: Dispatch) => {
      dispatch(fetchCertificatesAsync(domain) as unknown as AnyAction)
    }) as unknown as AnyAction
  }
  export  { fetchCertificates , setDomain , setFetched, setShowExpired} 

export default certificatesSlice.reducer
