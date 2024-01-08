import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCertificates, setDomain } from "../store/certificate-slice";
import { AppDispatch, RootState } from "../store/store";
import SubscriptionForm from "./SubscriptionForm";
import { subscribeToDomain } from "../store/subscription-slice";

interface SubscriptionFormType {
  domain: string;
  email: string;
}

const DomainInput: React.FC = () => {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const fetched = useSelector(
    (state: RootState) => state.certificatesReducer.isFetched
  );
  const domain = useSelector(
    (state: RootState) => state.certificatesReducer.domain
  );

  const handleDomainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDomain(event.target.value));
  };

  const handleFetchCertificates = () => {
    dispatch(fetchCertificates(domain));
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleFetchCertificates();
    }
  };

  const handleSubscribe = ({ domain, email }: SubscriptionFormType) => {
    dispatch(subscribeToDomain({ domain, email }));
    setShowSubscribeModal(false);
  };

  return (
    <div className="">
      <div className="text-gray-400 text-center">
        Enter an Identity (Domain Name, Organization Name, etc), a Certificate
        Fingerprint (SHA-1 or SHA-256) or a crt.sh ID :
      </div>
      <div className="my-6 mx-auto">
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="py-2 px-4 flex-grow border border-gray-300 rounded-l-md focus:outline-none focus:border-yellow"
            placeholder="Enter domain..."
            value={domain}
            onChange={handleDomainChange}
            onKeyDown={handleKeyPress}
          />
          <button
            className="py-2 px-4 bg-yellow text-black font-bold rounded-md hover:bg-amber-400 focus:outline-none"
            onClick={handleFetchCertificates}
          >
            Fetch Certificates
          </button>
          <button
            className="py-2 px-4 border-red-500 border text-black font-bold rounded-md hover:bg-red-200 focus:outline-none"
            onClick={handleRefreshPage}
          >
            Refresh
          </button>
        </div>
      </div>
      {fetched && (
        <button
          onClick={() => setShowSubscribeModal(!showSubscribeModal)}
          className="bg-black text-white px-2 py-1 rounded-sm hover:bg-gray-800"
        >
          Subscribe
        </button>
      )}

      {showSubscribeModal && fetched && (
        <SubscriptionForm domain={domain} onSubmit={handleSubscribe} />
      )}
    </div>
  );
};

export default DomainInput;
