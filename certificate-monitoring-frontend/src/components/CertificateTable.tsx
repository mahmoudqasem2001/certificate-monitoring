import React, { useState } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { loadingIndicator } from "../assets";
import { setShowExpired } from "../store/certificate-slice";

const CertificateTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const dispatch = useDispatch();
  const certificates = useSelector(
    (state: RootState) => state.certificatesReducer.certificates
  );
  const loading = useSelector(
    (state: RootState) => state.certificatesReducer.isLoading
  );
  const fetched = useSelector(
    (state: RootState) => state.certificatesReducer.isFetched
  );
  const error = useSelector(
    (state: RootState) => state.certificatesReducer.hasError
  );
  const showExpired = useSelector(
    (state: RootState) => state.certificatesReducer.showExpired
  );
  const itemsPerPage = 10;

  const filteredCertificates = showExpired
    ? certificates.filter(
        (certificate) => new Date(certificate.notAfter) < new Date()
      )
    : certificates;

  const sortedCertificates = [...filteredCertificates].sort((a, b) => {
    if (
      sortColumn === "loggedAt" ||
      sortColumn === "notBefore" ||
      sortColumn === "notAfter"
    ) {
      const dateA = new Date(a[sortColumn]);
      const dateB = new Date(b[sortColumn]);

      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    } else {
      return 0;
    }
  });

  const sortIndicator = (column: string) => {
    if (column === sortColumn) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCertificates = sortedCertificates.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const lastPage = Math.ceil(certificates.length / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  if (!fetched && !loading) {
    return <></>;
  }
  if (loading) {
    return (
      <img
        src={loadingIndicator}
        alt="Loading Indicator"
        className="w-12 m-auto"
      />
    );
  }

  if (error) {
    return <h1>An error Occur, Please try Again!</h1>;
  }

  return (
    <>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Certificate Information</h2>
        <div className="mb-4">
          <label className="mr-2">
            Show Expired Certificates
            <input
              type="checkbox"
              checked={showExpired}
              onChange={() => dispatch(setShowExpired(!showExpired))}
              className="ml-2"
            />
          </label>
        </div>
        <div className="overflow-x-auto flex">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-black text-white hover:cursor-pointer">
                <th
                  className="py-2 px-4 border-b"
                  onClick={() => handleSort("crtShId")}
                >
                  crt.sh ID {sortIndicator("crtShId")}
                </th>
                <th
                  className="py-2 px-4 border-b"
                  onClick={() => handleSort("loggedAt")}
                >
                  Logged At {sortIndicator("loggedAt")}{" "}
                </th>
                <th
                  className="py-2 px-4 border-b"
                  onClick={() => handleSort("notBefore")}
                >
                  Not Before {sortIndicator("notBefore")}
                </th>
                <th
                  className="py-2 px-4 border-b"
                  onClick={() => handleSort("notAfter")}
                >
                  Not After {sortIndicator("notAfter")}
                </th>
                <th className="py-2 px-4 border-b">Common Name</th>
                <th className="py-2 px-4 border-b">Matching Identities</th>
                <th
                  className="py-2 px-4 border-b"
                  onClick={() => handleSort("issuerName")}
                >
                  Issuer Name {sortIndicator("issuerName")}
                </th>
              </tr>
            </thead>
            <tbody>
              {certificates.length > 0 ? (
                currentCertificates.map((certificate) => (
                  <tr
                    key={certificate.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="py-2 px-4 border-b">
                      {certificate.crtShId}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {format(
                        new Date(certificate.loggedAt),
                        "yyyy-MM-dd HH:mm:ss"
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {format(new Date(certificate.notBefore), "yyyy-MM-dd")}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {format(new Date(certificate.notAfter), "yyyy-MM-dd")}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {certificate.commonName}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {certificate.matchingIdentities}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {certificate.issuerName}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center font-semibold">
                  No Certificates Available
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {fetched ? (
          <div className="pagination my-4 ">
            Page
            <span
              onClick={() => goToPage(currentPage - 1)}
              className={`cursor-pointer px-3 py-2 border mx-1 rounded-sm hover:bg-gray-100 ${
                currentPage === 1 ? "bg-gray-300" : "bg-white"
              }`}
            >
              {"<"}
            </span>
            <span
              className={`cursor-pointer px-2 py-1 border mx-1 rounded-md ${
                currentPage === 1 ? "bg-gray-300" : "bg-white"
              }`}
            >
              {currentPage}
            </span>
            {lastPage > 1 && (
              <span
                onClick={() => goToPage(currentPage + 1)}
                className={`cursor-pointer px-3 py-2 border mx-1 rounded-sm hover:bg-gray-100 ${
                  currentPage === lastPage ? "bg-gray-300" : "bg-white"
                }`}
              >
                {">"}
              </span>
            )}
            out of {lastPage}
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
export default CertificateTable;
