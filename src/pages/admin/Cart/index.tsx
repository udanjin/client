import { useEffect, useState } from "react";
import CartCards from "../../../Components/CartCards";
import TopNavbar from "../../../Components/TopNavbar";
import { CartItem } from "../../public/home/CardDetails";
import axiosInstance from "../../../axiosConfig";
import { useNavigate } from "react-router-dom";

interface OrderItems {
  menuId: string;
  note: string;
  price: Number;
  name: string;
  tax: Number;
}

const Index = () => {
  const [orders, setOrders] = useState<CartItem[]>([]);
  const tableId = localStorage.getItem("tableId");

  const navigate = useNavigate();

  useEffect(() => {
    const existingOrders = localStorage.getItem("orders");
    let orders = existingOrders ? JSON.parse(existingOrders) : [];
    setOrders(orders);
  }, []);

  const submit = () => {
    const orderItems: OrderItems[] = [];
    orders.forEach((item: CartItem) => {
      for (let i = 0; i < item.quantity; i++) {
        orderItems.push({
          menuId: item.item._id,
          note: item.note,
          price: item.item.price,
          name: item.item.name,
          tax: item.item.price * 0.1,
        });
      }
    });

    const orderPayload = {
      tableId: tableId,
      orderItems: orderItems,
    };

    axiosInstance
      .post(`/order`, orderPayload)
      .then((res: any) => {
        if (res.status !== 201) {
          return;
        }
        console.log(res.data._id);
        localStorage.removeItem("orders");
        navigate(`/payment/${res.data._id}`);
      })
      .catch((e: any) => {
        console.log(e)
      })
      .finally(() => {});
  };
  const totalPrice = orders.reduce((acc, order) => {
    return acc + order.item.price * order.quantity;
  }, 0);
  const tax = totalPrice * 0.1;

  const grandTotal = totalPrice + tax;
  const handleUpdateItemQty = (id: string, action: string) => {
    const item = orders.find((item) => item.item._id === id);
    if (item && action === "increase") {
      item.quantity += 1;
    }
    if (item && action === "decrease") {
      item.quantity -= 1;
    }
    if (item && item.quantity <= 0) {
      const newOrder = orders.filter((item) => item.item._id != id);
      setOrders(newOrder);
      return;
    }
    setOrders([...orders]);
  };

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("orders", JSON.stringify(orders));
    }
  }, [orders]);

  return (
    <>
      <TopNavbar />
      <div className="relative">
        <div className="overflow-y-auto h-[65vh]">
          {orders.length > 0 ? (
            orders.map((order: CartItem) => {
              return (
                <CartCards
                  name={order.item.name}
                  price={order.item.price}
                  imgPath={order.item.imgPath}
                  note={order.note}
                  quantity={order.quantity}
                  id={order.item._id}
                  handleUpdateItemQty={handleUpdateItemQty}
                />
              );
            })
          ) : (
            <div className="text-center font-bold flex items-center justify-center h-[50vh]">No Product Added</div>
          )}
        </div>
        <div className="overflow-visible fixed shadow-lg bottom-0 p-4 bg-white w-screen">
          <div className="mb-6">
            <span className="font-bold text-xl">Order Summary</span>
          </div>
          <div className="flex justify-between mb-2">
            <div>SubTotal</div>
            <div>Rp. {totalPrice}</div>
          </div>
          <div className="flex justify-between mb-6">
            <div>Tax 10%</div>
            <div>Rp. {tax}</div>
          </div>
          <div className="flex justify-between">
            <div>Total Price</div>
            <div>Rp. {grandTotal}</div>
          </div>
          <div className=" flex justify-center items-center mt-10">
            <button
              type="button"
              onClick={submit}
              className=" w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Process Transaction
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
