import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../../axiosConfig";



const Status = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const statusCode = params.get("status_code");
  const orderId = params.get("order_id");
  const [updated, setUpdated] = useState(false);
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    const updateStatus = () => {
      const status = "DONE";
      if (statusCode === "200") {
        axiosInstance
          .put(`/transaction`, { orderId: orderId, transactionStatus: status })
          .then((res: any) => {
            console.log(res.data);
          })
          .catch((e: any) => {
            console.log(e);
          })
          .finally(() => {
            setUpdated(true);
          });
      }
    };
    updateStatus();
  }, []);

  const splitBill = () => {
    const tableId = localStorage.getItem("tableId");
    navigate(`/${tableId}/split`);
  };

  const backToHome = () =>{
    const tableId = localStorage.getItem("tableId");
    navigate(`/${tableId}`)
  }

    return (
      <>
      {updated?(
        <div className="flex justify-center items-center w-[100vw] h-[100vh]">
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          {statusCode === "200" ? (
            <>
              <div className="flex justify-center">
                <svg
                  className="w-[64px] h-[64px] text-blue-600 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex justify-center">
                <p className="mb-3 font-bold text-black text-center dark:text-gray-400">
                  Your order is Confirmed.
                </p>
              </div>
            </>
          ) : statusCode === "201" ? (
            <>
              <div className="flex justify-center">
                <svg
                  className="w-[64px] h-[64px] text-orange-400 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.5 3a1 1 0 0 0 0 2H7v2.333a3 3 0 0 0 .556 1.74l1.57 2.814A1.1 1.1 0 0 0 9.2 12a.998.998 0 0 0-.073.113l-1.57 2.814A3 3 0 0 0 7 16.667V19H5.5a1 1 0 1 0 0 2h13a1 1 0 1 0 0-2H17v-2.333a3 3 0 0 0-.56-1.745l-1.616-2.82a1 1 0 0 0-.067-.102 1 1 0 0 0 .067-.103l1.616-2.819A3 3 0 0 0 17 7.333V5h1.5a1 1 0 1 0 0-2h-13Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex justify-center">
                <p className="mb-3 font-bold text-black text-center dark:text-gray-400">
                  Your order is Pending.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <svg
                  className="w-[64px] h-[64px] text-red-600 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex justify-center">
                <p className="mb-3 font-bold text-black text-center dark:text-gray-400">
                  Failed To Order.
                </p>
              </div>
            </>
          )}

          <div className="flex justify-between">
            <div>
              <button
                type="button"
                onClick={backToHome}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                back to home
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={splitBill}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                split the bill
              </button>
            </div>
          </div>
        </div>
      </div>
      ):(
        <div>loading</div>
      )}

      
      </>

      
    );
  }


export default Status;
