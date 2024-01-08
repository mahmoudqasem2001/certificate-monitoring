import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const SubscriptionForm = ({
  domain,
  onSubmit,
}: {
  domain: string;
  onSubmit: Function;
}) => {
  const [email, setEmail] = useState("");
  const [domainError, setDomainError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const subscriptionLoading = useSelector(
    (state: RootState) => state.subscriptionReducer.loading
  );
  const subscriptionError = useSelector(
    (state: RootState) => state.subscriptionReducer.error
  );
  const handleSubscribe = () => {
    if (!isValidDomain(domain)) {
      console.error("Invalid domain");
      return;
    }

    if (!isValidEmail(email)) {
      console.error("Invalid email");
      return;
    }
    onSubmit({ domain, email });
  };

  const isValidDomain = (domain: string) => {
    const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return domainPattern.test(domain);
  };

  const isValidEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-md">
      <h3 className="text-xl font-bold mb-4">Subscribe to {domain}</h3>
      <div className="flex items-center mb-4">
        <input
          className={`flex-grow p-2 border ${
            domainError ? "border-red-500" : "border-gray-300"
          } rounded-l-md focus:outline-none`}
          type="text"
          placeholder="Enter domain"
          value={domain}
          onChange={(e) => {
            setDomainError(null);
            onSubmit({ domain: e.target.value, email });
          }}
        />
        <input
          className={`flex-grow p-2 border ${
            emailError ? "border-red-500" : "border-gray-300"
          } rounded-r-md focus:outline-none`}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmailError(null);
            setEmail(e.target.value);
          }}
        />
        <button
          className="px-4 py-2 bg-yellow text-black rounded-r-md focus:outline-none"
          onClick={handleSubscribe}
          disabled={subscriptionLoading}
        >
          {subscriptionLoading ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {domainError && (
        <p className="text-red-500 mb-2">{`Domain Error: ${domainError}`}</p>
      )}
      {emailError && (
        <p className="text-red-500 mb-2">{`Email Error: ${emailError}`}</p>
      )}
      {subscriptionError && (
        <p className="text-red-500 mb-2">{`Subscription Error: ${subscriptionError}`}</p>
      )}
    </div>
  );
};

export default SubscriptionForm;
