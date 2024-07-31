import { useEffect, useState } from "react";
import NavbarTop from "../../../Components/NavbarTop";
import Sidebar from "../../../Components/Sidebar";
import axiosInstance from "../../../axiosConfig";
import Pagination from "../../../Components/Pagination";




const index = () => {
  const [transaction, setTransaction] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);


  const handlePageChange = (newPageNumber: number) => {
    setCurrentPage(newPageNumber);
  };

  const paginatedTransactions = transaction.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const getTransaction = async () => {
      axiosInstance
        .get(`/transaction`)
        .then((res: any) => {
          const data = res.data;
          // console.log(data);
          setTransaction(data);
          console.log(data);
        })
        .catch((e: any) => {
          console.log(e);
        });
    };
    getTransaction();
  }, []);

  return (
    <>
      <NavbarTop />
      <div className="flex pt-16 overflow-hidden font-primary">
        <Sidebar />
        <div className="relative w-full h-full overflow-y-auto lg:ml-64">
          <main>
            <div className="p-4 bg-white block sm:flex items-center justify-start border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 ">
              <div className="w-full mb-1">
                <div className="">
                  <span className="text-xl font-bold text-black sm:text-2xl dark:text-white">
                    Transactions
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden shadow">
                    <table className="w-full divide-y divide-gray-200 table-auto dark:divide-gray-600">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th
                            scope="col"
                            className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[8rem]"
                          >
                            ID
                          </th>

                          <th
                            scope="col"
                            className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[15rem]"
                          >
                            Transaction Date
                          </th>

                          <th
                            scope="col"
                            className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[10rem]"
                          >
                            Transaction Status
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 justify-end"
                          >
                            Total Price
                          </th>
                        </tr>
                      </thead>
                      {paginatedTransactions.map((item: any) => (
                        <tbody className="bg-white  divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                          {/* {{< products.inline >}}
                        {{- Range (index $.Site.Data "products") }} */}
                          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {item._id}
                            </td>
                            <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark{}:text-white">
                              {item.transactionStatus === "pending" ? (
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                  {item.transactionStatus}
                                </span>
                              ):(
                                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">{item.transactionStatus}</span>
                              )}
                            </td>
                            <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              Rp.{item.totalAmount + item.totalTax}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  
                  </div>
                </div>
              </div>
            </div>
            <Pagination
              items={transaction}
              onChangePage={handlePageChange}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          </main>
        </div>
      </div>
    </>
  );
};

export default index;
