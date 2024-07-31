import { useEffect, useState } from "react";
import Pagination from "../../../Components/Pagination";
import NavbarTop from "../../../Components/NavbarTop";
import Sidebar from "../../../Components/Sidebar";
import axiosInstance from "../../../axiosConfig";


interface orderItems {
  _id: string;
  name: string;
  note: string;
  imgPath:string;
  price:string;
}
interface order {
  _id: string;
  orderItems?: orderItems[];
}

const index = () => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState<order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  // const [selectedId, setSelectedId] = useState(null);
  //   const [orderId, setOrderId] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [openDrawerItem, setOpenDrawerItem] = useState(false);
  // const [refresh, setRefresh] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  const [product, setProduct] = useState<orderItems[]>([]);
  const handlePageChange = (newPageNumber: number) => {
    setCurrentPage(newPageNumber);
  };

  const handleCloseDrawer = () => {
    setIsOpen(false);
    setOpenDrawerItem(false);
  };
  const paginatedTransactions = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    const getOrder = async () => {
      axiosInstance
        .get(`/order`)
        .then((res: any) => {
          const data = res.data;
          // console.log(data);
          //   setOrder(data);
          setOrders(data);
          console.log(data);
          //   console.log(res.data.tableId);
        })
        .catch((e: any) => {
          console.log(e);
        });
    };
    // setRefresh(true)
    getOrder();
    // const intervalId = setInterval(getOrder, 5000); // fetch every 5 seconds
    // return () => clearInterval(intervalId);
  }, []);

  const openItems = (_id: any) => {
    // setOpenItem(true)
    // setSelectedId(_id);
    setOpenDrawerItem(true);
    axiosInstance
      .get(`/order/${_id}`)
      .then((res: any) => {
        const data: order = res.data;
        if (data.orderItems) setProduct(data.orderItems);
        console.log(data.orderItems);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };

  const openUpdateDrawer = (_id: any) => {
    // setSelectedId(_id);
    setIsOpen(true);
    axiosInstance
      .get(`/order/${_id}`)
      .then((res: any) => {
        const data: orderItems = res.data;
        setOrder(data);
        console.log(data);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };
  const updateStatus = () => {
    const id = order?._id;
    console.log(id);
    if (!order) return;
    axiosInstance
      .put(`/order/${id}`, { orderStatus: "0" })
      .then((res: any) => {
        console.log(res.data);
        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      })
      .catch((error: any) => {
        console.error(`Error updating order status: ${error.message}`);
        console.error(error.response.data);
        setFail(true);
      });
  };

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
                    Order
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
                            Table
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[10rem]"
                          >
                            Order Status
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[10rem]"
                          >
                            Actions
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
                              {item.tableId}
                            </td>
                            <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark{}:text-white">
                              {item.orderStatus === "1" ? (
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                  On Process
                                </span>
                              ) : (
                                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                  Done
                                </span>
                              )}
                            </td>
                            <td className="p-4 space-x-2 whitespace-nowrap">
                              <button
                                type="button"
                                id="updateProductButton"
                                onClick={() => openItems(item._id)}
                                data-drawer-target="drawer-update-product-default"
                                data-drawer-show="drawer-update-product-default"
                                aria-controls="drawer-update-product-default"
                                data-drawer-placement="right"
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-centerfocus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 rounded-lg  me-2 mb-2 dark:focus:ring-yellow-900"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                                  <path
                                    fill-rule="evenodd"
                                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                    clip-rule="evenodd"
                                  ></path>
                                </svg>
                                Details Order Item
                              </button>

                              <button
                                type="button"
                                id="deleteProductButton"
                                onClick={() => openUpdateDrawer(item._id)}
                                data-drawer-target="drawer-delete-product-default"
                                data-drawer-show="drawer-delete-product-default"
                                aria-controls="drawer-delete-product-default"
                                data-drawer-placement="right"
                                disabled={item.orderStatus === "0"}
                                className="inline-flex items-center px-3 py-2 focus:outline-none text-white disabled:bg-gray-800 disabled:cursor-not-allowed bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                              >
                                <svg
                                  className="w-4 h-4 mr-2 text-white dark:text-white"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
                                  />
                                </svg>
                                Done
                              </button>
                            </td>
                            {isOpen && (
                              <div
                                id="drawer-delete-product-default"
                                className="fixed top-0 right-0 z-40 w-full h-screen max-w-xs p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 transform-none"
                                // tabIndex="-1"
                                aria-labelledby="drawer-label"
                                aria-modal="true"
                                role="dialog"
                              >
                                <h5
                                  id="drawer-label"
                                  className="inline-flex items-center text-sm font-semibold text-gray-500 uppercase dark:text-gray-400"
                                >
                                  Update Status
                                </h5>
                                <button
                                  type="button"
                                  onClick={handleCloseDrawer}
                                  data-drawer-dismiss="drawer-delete-product-default"
                                  aria-controls="drawer-delete-product-default"
                                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  <svg
                                    aria-hidden="true"
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clip-rule="evenodd"
                                    ></path>
                                  </svg>
                                  <span className="sr-only">Close menu</span>
                                </button>
                                <svg
                                  className="w-10 h-10 mt-8 mb-4 text-red-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  ></path>
                                </svg>
                                <h3 className="mb-6 text-lg text-gray-500 dark:text-gray-400">
                                  Are you sure you want to update the status?
                                </h3>
                                {success && (
                                  <div
                                    className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                                    role="alert"
                                  >
                                    <span className="font-medium">
                                      Status Updated.
                                    </span>
                                  </div>
                                )}
                                {fail && (
                                  <div
                                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                                    role="alert"
                                  >
                                    <span className="font-medium">
                                      Failed to Update Status.
                                    </span>
                                  </div>
                                )}
                                <button
                                  onClick={updateStatus}
                                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                >
                                  Yes, I'm sure
                                </button>
                              </div>
                            )}
                            {openDrawerItem && (
                              <div
                                id="drawer-create-product-default"
                                className="fixed top-0 right-0 z-40 w-full h-screen max-w-xs p-4 overflow-y-auto transition-transform bg-gray-100 drop-shadow-md dark:bg-gray-800 "
                                // tabIndex="-1"
                                aria-labelledby="drawer-label"
                                aria-hidden="true"
                              >
                                <h5
                                  id="drawer-label"
                                  className="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400"
                                >
                                  Details Product
                                </h5>
                                <button
                                  type="button"
                                  onClick={handleCloseDrawer}
                                  data-drawer-dismiss="drawer-create-product-default"
                                  aria-controls="drawer-create-product-default"
                                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  <svg
                                    aria-hidden="true"
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clip-rule="evenodd"
                                    ></path>
                                  </svg>
                                  <span className="sr-only">Close menu</span>
                                </button>
                                <div>
                                  {product.map((products) => (
                                    <div className="mt-8 ">
                                      <div className="flow-root">
                                        <ul className="rounded-lg border border-gray-200">
                                          <li className="flex py-6">
                                           
                                            <div className="flex flex-2 flex-col w-full">
                                              <div className="flex justify-between">
                                                <div className=" ">
                                                  <span className="ml-2 font-bold">
                                                    {products.name}
                                                  </span>
                                                </div>
                                                <div className="mr-2">
                                                    <span className="font-medium">Rp.{products.price}</span>
                                                </div>
                                              </div>
                                              <div>
                                                  <span className="ml-2"> {products.note} </span>
                                                </div>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <Pagination
              items={orders}
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
