import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../axiosConfig";

interface MenuDetails {
  _id: string;
  name: string;
  desc: string;
  price: number;
  imgPath: string;
}
export interface CartItem {
  item: MenuDetails;
  quantity: number;
  note: string;
}

const CardDetails = () => {
  const { id } = useParams();
  const tableId = localStorage.getItem("tableId");
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [menuDetails, setMenuDetails] = useState<MenuDetails | null>(null);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  // const [sugarLevel, setSugarLevel] = useState(25);
  // const [type, setType] = useState("hot");

  // const handleSugarLevelChange = (level: number) => {
  //   setSugarLevel(level);
  // };

  // const handleTemperatureChange = (temp: string) => {
  //   setType(temp);
  // };
  const increment = () => {
    setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddCart = () => {
    if (!menuDetails) return;

    const order: CartItem = {
      item: menuDetails,
      quantity: quantity,
      note: note,
    };
    const existingOrders = localStorage.getItem("orders");
    let orders = existingOrders ? JSON.parse(existingOrders) : [];

    const existingItem: CartItem = orders.find(
      (e: CartItem) => e.item._id === menuDetails._id
    );

    if (existingItem) {
      existingItem.quantity = quantity;
      console.log(orders);
    } else {
      orders.push(order);
    }

    localStorage.setItem("orders", JSON.stringify(orders));
    // console.log(orders)
    // Reset the note input
    setNote("");
    navigate(`/${tableId}`);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      setFetchLoading(true);
      axiosInstance
        .get(`/menu/${id}`)
        .then((res: any) => {
          const data: MenuDetails = res.data;
          setMenuDetails(data);
        })
        .catch((err: any) => {
          console.log(err);
        })
        .finally(() => {
          setFetchLoading(false);
        });

      // const res = await fetch (`http://localhost:4000/api/menu/${id}`);
      // const json = await res.json();
      // if (res.ok) {
      //   setMenuDetails(json);
      // }
    };
    fetchMenu();
  }, []);

  if (fetchLoading) {
    return (
      <div
        role="status"
        className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
      >
        <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
        <div className="w-full">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="font-primary">
      {menuDetails && (
        <div className="bg-gray-200 dark:bg-gray-800 shadow-md rounded-lg overflow-hidden h-full">
          <button
            className="absolute top-4 left-4 bg-gray-200 dark:bg-gray-800 rounded-full p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition duration-300 ease-in-out"
            onClick={() => navigate(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <img src={menuDetails.imgPath} className="w-full h-60 object-cover" />
          <div className="p-5 lg:h-[74vh] h-screen w-screen">
            <h5 className="text-2xl font-primary font-bold tracking-loose text-gray-900 dark:text-white">
              {menuDetails.name}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {menuDetails.desc}
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              Rp.{menuDetails.price}
            </p>
            {/* <div className="mt-10">
              <label
                htmlFor="note"
                className="block mb-6 text-xl  font-sub font-bold text-black  dark:text-white"
              >
                Sugar Level
              </label>
              <div className="flex gap-2">
                <button onClick={() => handleSugarLevelChange(25)} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  25%
                </button>
                <button onClick={() => handleSugarLevelChange(50)} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  50%
                </button>
                <button onClick={() => handleSugarLevelChange(100)} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  100%
                </button>
              </div>
            </div> */}
            {/* <div className="mt-5">
              <label
                htmlFor="note"
                className="block mb-6 text-xl  font-sub font-bold text-black  dark:text-white"
              >
                Type
              </label>
              <div className="flex gap-2">
                <button onClick={() => handleTemperatureChange('hot')} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Hot
                </button>
                <button onClick={() => handleTemperatureChange('iced')} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Iced
                </button>
              </div>
            </div> */}
            <div className="mt-5">
              <label
                htmlFor="note"
                className="block mb-2 text-xl font-bold text-gray-900 dark:text-white"
              >
                Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                id="note"
                rows={4}
                className="block p-2.5 lg:w-[40vh] w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              ></textarea>
            </div>
            <div className="mt-5 flex justify-between absolute inset-x-4 bottom-4 ">
              <div className="flex items-center gap-2 bg-gray-300 rounded-full">
                <button
                  className="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2.5 text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={decrement}
                  disabled={quantity === 1}
                >
                  -
                </button>
                <span className="text-xl font-bold text-black dark:text-white text-center flex justify-center">
                  {quantity}
                </span>
                <button
                  onClick={increment}
                  className="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2.5 text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddCart}
                className="bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4F text-white font-bold py-2 px-4 rounded-full"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
      {!menuDetails && !fetchLoading && <div>No Content</div>}
    </div>
  );
};

export default CardDetails;
