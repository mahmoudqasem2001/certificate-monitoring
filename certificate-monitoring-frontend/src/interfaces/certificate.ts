export interface CertificateModel {
    id: number;
    crtShId: string;
    loggedAt: string; 
    notBefore: string; 
    notAfter: string; 
    commonName: string;
    matchingIdentities: string;
    issuerName: string;
  }
  
 
  