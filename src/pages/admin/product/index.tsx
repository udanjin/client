import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../../Components/Sidebar";
import NavbarTop from "../../../Components/NavbarTop";
import axiosInstance from "../../../axiosConfig";

import Pagination from "../../../Components/Pagination";

interface MenuDetails {
  _id: string;
  name: string;
  desc: string;
  price: number;
  imgPath: string;
}

const Index = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [image, setImage] = useState<File>();
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuDetails | null>(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handlePageChange = (newPageNumber: number) => {
    setCurrentPage(newPageNumber);
  };
  const paginatedTransactions = selectedMenus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleCloseDrawer = () => {
    setIsOpen(false);
    setIsUpdateOpen(false);
    setIsDeleteOpen(false);
  };

  useEffect(() => {
    if (!refresh) return;
    const fetchMenus = async () => {
      const res = await fetch("https://pos-app-api-five.vercel.app/api/menu");
      const json = await res.json();
      console.log(res);
      if (res.ok) {
        setSelectedMenus(json);
      }
    };
    setRefresh(false);
    fetchMenus();
  }, [refresh]);

  useEffect(() => {
    const fetchMenus = async () => {
      const res = await fetch("https://pos-app-api-five.vercel.app/api/menu");
      const json = await res.json();
      console.log(res);
      if (res.ok) {
        setSelectedMenus(json);
      }
    };
    fetchMenus();
    console.log(fetchMenus);
    // const fetch = fetch("/api/menu")
  }, []);

  useEffect(() => {
    console.log(name);
  }, [name]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      // setStatus("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("desc", description);
    formData.append("price", price ? price.toString() : "0");
    formData.append("imgPath", image);

    axiosInstance
      .post("/menu", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res: any) => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsOpen(false);
        }, 2000);
        console.log(res.data);
        setRefresh(true);
      })
      .catch((e: any) => {
        console.log(e);
        setFail(true);
      })
      .finally(() => {
        setName("");
        setDescription("");
        setPrice(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        } else {
          console.error("fileInput element not found");
        }
        setImage(undefined);
      });
  };

  const handleUpdateProduct = async (e: any) => {
    e.preventDefault();
    if (!image) {
      // setStatus("Please select an image to upload");
      return;
    }
    if (!selectedMenu) return;

    const id = selectedMenu?._id;
    console.log(id);
    const formData = new FormData();
    formData.append("name", selectedMenu.name);
    formData.append("desc", selectedMenu.desc);
    formData.append("price", selectedMenu.price.toString());

    if (image) {
      formData.append("imgPath", image);
    }

    axiosInstance
      .put(`/menu/${id}`, formData)
      .then((res: any) => {
        console.log(res.data);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsUpdateOpen(false);
        }, 2000);
        setRefresh(true);
      })
      .catch((e: any) => {
        console.log(e);
        setFail(true);
      });
  };

  const deleteProduct = async () => {
    // e.preventDefault();
    const id = selectedItemId;
    console.log(id);
    axiosInstance
      .delete(`/menu/${id}`)
      .then((res: any) => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsDeleteOpen(false);
        }, 2000);
        console.log(res);

        // setIsDeleteOpen(true);
        setRefresh(true);
      })
      .catch((e: any) => {
        console.log(e);
        setFail(true);
      });
  };

  const handleOpenDrawer = () => {
    setIsOpen(true);
    // console.log();
  };

  const handleUpdateClick = (itemId: any) => {
    setSelectedItemId(itemId);
    setIsUpdateOpen(true);
    console.log(itemId);
    // console.log(updatedMenu);
    // setFetchLoading(true);
    axiosInstance
      .get(`/menu/${itemId}`)
      .then((res: any) => {
        const data: MenuDetails = res.data;
        setSelectedMenu(data);
        // setUpdatedMenu(data);
        console.log(data);
        // console.log(updatedMenu);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        // setFetchLoading(false);
      });
  };

  const handleDeleteClick = (itemId: any) => {
    setSelectedItemId(itemId);
    setIsDeleteOpen(true);
    console.log(itemId);
  };

  return (
    <>
      <NavbarTop />
      <div className="flex pt-16 overflow-hidden bg-gray-50 font-primary">
        <Sidebar />

        <div className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900">
          <main>
            <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 ">
              <div className="w-full mb-1">
                <div className="mb-4">
                  <span className="text-xl font-bold text-black sm:text-2xl dark:text-white">
                    All Products
                  </span>
                </div>
              </div>
              <div className="items-center justify-end block sm:flex md:divide-x ">
                <button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  type="button"
                  data-drawer-target="drawer-create-product-default"
                  data-drawer-show="drawer-create-product-default"
                  aria-controls="drawer-create-product-default"
                  data-drawer-placement="right"
                  onClick={handleOpenDrawer}
                >
                  Add new product
                </button>
              </div>
            </div>
            {isOpen && (
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
                  New Product
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
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Type product name"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={price?.toString()}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="$2999"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        value={description}
                        required
                        onChange={(e) => setDescription(e.target.value)}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter event description here"
                      ></textarea>
                    </div>
                    <div>
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        htmlFor="file_input"
                      >
                        Upload file
                      </label>
                      <input
                      required
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="file_input"
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </div>
                    {success && (
                      <div
                        className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                        role="alert"
                      >
                        <span className="font-medium">Product Added</span>
                      </div>
                    )}
                    {fail && (
                      <div
                        className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                        role="alert"
                      >
                        <span className="font-medium">
                          Failed to Add Product
                        </span>
                      </div>
                    )}

                    <div className="bottom-0 left-0 flex justify-center w-full pb-4 space-x-4 md:px-4 md:absolute">
                      <button
                        type="submit"
                        className="text-white w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        Add product
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            {isUpdateOpen && (
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
                  Update Product
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
                <form onSubmit={handleUpdateProduct}>
                  {selectedMenu && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={selectedMenu?.name || ""}
                          onChange={(e) =>
                            setSelectedMenu({
                              ...selectedMenu,
                              name: e.target.value,
                            })
                          }
                          id="name"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type product name"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="price"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          value={selectedMenu.price}
                          onChange={(e) =>
                            setSelectedMenu({
                              ...selectedMenu,
                              price: Number(e.target.value),
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="$2999"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={4}
                          value={selectedMenu.desc}
                          onChange={(e) =>
                            setSelectedMenu({
                              ...selectedMenu,
                              desc: e.target.value,
                            })
                          }
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Enter event description here"
                        ></textarea>
                      </div>
                      <div>
                        <label
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          htmlFor="file_input"
                        >
                          Upload file
                        </label>
                        <span className="text-xs">
                          Current image:{selectedMenu.imgPath}
                        </span>
                        <input
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                          id="file_input"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </div>
                      {success && (
                        <div
                          className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                          role="alert"
                        >
                          <span className="font-medium">Product Updated</span>
                        </div>
                      )}
                      {fail && (
                        <div
                          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                          role="alert"
                        >
                          <span className="font-medium">
                            Failed to Update Product
                          </span>
                        </div>
                      )}
                      <div className="bottom-0 left-0 flex justify-center w-full pb-4 space-x-4 md:px-4 md:absolute">
                        <button
                          type="submit"
                          className="text-white w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                          Update Product
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
            {isDeleteOpen && (
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
                  Delete item
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
                  Are you sure you want to delete this product?
                </h3>
                {success && (
                  <div
                    className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                    role="alert"
                  >
                    <span className="font-medium">Product Deleted</span>
                  </div>
                )}
                {fail && (
                  <div
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                    role="alert"
                  >
                    <span className="font-medium">
                      Failed to Delete Product
                    </span>
                  </div>
                )}
                <button
                  onClick={deleteProduct}
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-3 py-2.5 text-center mr-2 dark:focus:ring-red-900"
                >
                  Yes, I'm sure
                </button>
              </div>
            )}
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden shadow">
                    <table className="w-full divide-y divide-gray-200 table-auto dark:divide-gray-600">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th
                            scope="col"
                            className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[15rem]"
                          >
                            Product Name
                          </th>

                          <th
                            scope="col"
                            className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[15rem]"
                          >
                            Description
                          </th>

                          <th
                            scope="col"
                            className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 min-w-[10rem]"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400 justify-end"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      {selectedMenus.length > 0 ? (
                        paginatedTransactions.map((item: any) => (
                          <tbody className="bg-white  divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {/* {{< products.inline >}}
                          {{- Range (index $.Site.Data "products") }} */}
                            <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                              <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {item.name}
                              </td>
                              <td className="p-4 text-base font-medium text-gray-90 dark:text-white break-words whitespace-normal">
                                {item.desc}
                              </td>
                              <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Rp.{item.price}
                              </td>
                              <td className="p-4 space-x-2 whitespace-nowrap">
                                <button
                                  type="button"
                                  id="updateProductButton"
                                  onClick={() => handleUpdateClick(item._id)}
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
                                  Update
                                </button>
                                <button
                                  type="button"
                                  id="deleteProductButton"
                                  onClick={() => handleDeleteClick(item._id)}
                                  data-drawer-target="drawer-delete-product-default"
                                  data-drawer-show="drawer-delete-product-default"
                                  aria-controls="drawer-delete-product-default"
                                  data-drawer-placement="right"
                                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                                >
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                      clip-rule="evenodd"
                                    ></path>
                                  </svg>
                                  Delete item
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center font-bold h-[60vh] "
                          >
                            No data
                          </td>
                        </tr>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <Pagination
              items={selectedMenus}
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

export default Index;
