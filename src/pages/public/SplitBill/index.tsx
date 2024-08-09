import { useEffect, useState } from "react";
import TopNavbar from "../../../Components/TopNavbar";
import axiosInstance from "../../../axiosConfig";
import { useNavigate } from "react-router-dom";

// interface OrderItem {
//   menuId: string;
//   note: string;
//   price: Number;
//   name: string;
//   tax: Number;
// }

// interface Bill {
//   tableId: number;
//   _id: string;
//   orderItems: OrderItem;
// }

enum CalculateAmountType {
  TAX = "tax",
  PRICE = "Price",
}

interface Bill {
  orderItems: {
    id: number;
    menuId: string;
    note: string;
    price: string;
    name: string;
    tax: number;
  }[];
  tableId: number;
}
interface Person {
  id: number;
  name: string;
}

interface PersonOrder {
  personName: string;
  orders: {
    id: number;
    menuId: string;
    note: string;
    price: string;
    name: string;
    tax: number;
  }[];
}

interface ProductSelectedCount {
  id: number;
  menuId: string;
  count: number;
}

const Index = () => {
  const tableId = localStorage.getItem("tableId");
  const [bill, setBill] = useState<Bill | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [personOrder, setPersonOrder] = useState<PersonOrder[]>([]);

  const [productSelectedCount, setProductSelectedCount] = useState<
    ProductSelectedCount[]
  >([]);

  const [newPersonName, setNewPersonName] = useState("");
  const navigate = useNavigate();

  const handleAddPerson = () => {
    if (newPersonName !== "") {
      setPeople([...people, { id: people.length + 1, name: newPersonName }]);
      setPersonOrder((prev) => [
        ...prev,
        { personName: newPersonName, orders: [] },
      ]);
      setNewPersonName("");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);

      axiosInstance
        .get(`/order?tableId=${tableId}`)
        .then((res: any) => {
          if (res.status === 204) {
            alert("this table has no data");
            navigate(`/${tableId}`);
            return;
          }
          setBill(res.data[0]);
        })
        .catch((err: any) => {
          console.log(err);
        })
        .finally(() => {
          setFetchLoading(false);
        });
    };

    fetchData();
    // console.log(fetchData);
  }, []);

  useEffect(() => {
    if (bill && bill.orderItems.length > 0) {
      const orderItems = bill.orderItems;

      const newCount: ProductSelectedCount[] = [];
      orderItems.forEach((el) => {
        newCount.push({
          id: el.id,
          menuId: el.menuId,
          count: 0,
        });
      });
      setProductSelectedCount(newCount);
    }
  }, [bill]);

  // useEffect(() => {
  //   console.log(productSelectedCount)
  // }, [productSelectedCount])

  useEffect(() => {
    if (personOrder.length === 0) return;
    console.log(personOrder);
  }, [personOrder]);

   const calculatedAmount = (id: number, type: string): number => {
    if (!bill || productSelectedCount.length === 0) return 0;

    const productCountItem = productSelectedCount.find((e) => e.id === id);
    const orderItem = bill.orderItems.find((e) => e.id === id);

    const count: number = productCountItem ? productCountItem.count : 0;

    let amount: number = 0;

    if (type === CalculateAmountType.PRICE) {
      amount = orderItem ? parseFloat(orderItem.price) : 0;
    }

    if (type === CalculateAmountType.TAX) {
      amount = orderItem ? orderItem.tax : 0;
    }

    const totalPrice = amount / count;

    return totalPrice;
  };

  const calculateTax = (orderIds: number[]): number => {
    if (!bill || productSelectedCount.length === 0) return 0;

    const matchingItems = bill.orderItems.filter((item) =>
      orderIds.includes(item.id)
    );

    let totalTax: number = 0;
    matchingItems.forEach((e) => {
      totalTax += calculatedAmount(e.id, CalculateAmountType.TAX);
    });

    return totalTax;
  };

  const calculateTotalprice = (orderIds: number[]) => {
    if (!bill || productSelectedCount.length === 0) return 0;

    const matchingItems = bill.orderItems.filter((item) =>
      orderIds.includes(item.id)
    );

    let totalPrice: number = 0;
    matchingItems.forEach((e) => {
      totalPrice += calculatedAmount(e.id, CalculateAmountType.PRICE);
    });

    return totalPrice;
  };

  const checkBoxChecked = (id: number): boolean => {
    const selectedPersonOrder = personOrder.find(
      (e: PersonOrder) => e.personName === selectedPerson
    );
    if (!selectedPersonOrder) return false;

    const orderAvailable = selectedPersonOrder.orders.find((e) => e.id === id);

    if (orderAvailable) return true;

    return false;
  };

  // const checkBoxDisabled = (id: number): boolean => {
  //   for (let i = 0; i < personOrder.length; i++) {
  //     const idFinded = personOrder[i].orders.find((e) => e.id === id);
  //     if (idFinded && personOrder[i].personName !== selectedPerson) return true;
  //   }
  //   return false;
  // };

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
    <>
      <TopNavbar />

      <div className="section p-4">
        <div className="w-full">
          <div className="mb-2">
            <span className="font-bold text-xl">Detail Transaction</span>
          </div>
          {bill ? (
            <div className="">
              <span className="font-bold">Table ID: {bill.tableId}</span>
              {bill.orderItems.map((orderItem) => (
                <div className="flex justify-between w-[90vw] ">
                  <div className="">
                    <span className="text-md">{orderItem.name}</span>
                  </div>
                  <div className="ml-auto mr-4">
                    <span className="text-md">Rp. {orderItem.price}</span>
                  </div>
                  <div>
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      // disabled={checkBoxDisabled(orderItem.id)}
                      checked={checkBoxChecked(orderItem.id)}
                      onChange={(e) => {
                        console.log(e.target.checked);
                        if (e.target.checked) {
                          const newPersonOrder: PersonOrder[] = [];
                          personOrder.forEach((e: PersonOrder) => {
                            if (e.personName === selectedPerson) {
                              e.orders.push(orderItem);
                            }
                            newPersonOrder.push(e);
                          });
                          setPersonOrder([...newPersonOrder]);

                          const selectedProduct = productSelectedCount.find(
                            (item) => item.id === orderItem.id
                          );
                          if (selectedProduct) {
                            selectedProduct.count += 1;
                          }
                          setProductSelectedCount((prev) => [...prev]);

                          return;
                        }

                        const newPersonOrder: PersonOrder[] = [];
                        personOrder.forEach((e: PersonOrder) => {
                          if (e.personName === selectedPerson) {
                            e.orders = e.orders.filter(
                              (item) => item.id !== orderItem.id
                            );
                          }
                          newPersonOrder.push(e);
                        });
                        setPersonOrder([...newPersonOrder]);

                        const selectedProduct = productSelectedCount.find(
                          (item) => item.id === orderItem.id
                        );
                        if (selectedProduct) {
                          selectedProduct.count -= 1;
                        }
                        setProductSelectedCount((prev) => [...prev]);
                      }}
                      className="w-4 h-4  text-blue-600 bg-gray-100 border-gray-300 rounded  focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No data...</div>
          )}
        </div>
        <div className="w-full mt-4">
          <span className="font-bold text-xl">Person</span>
          <div className="flex flex-row flex-wrap">
            {people.map((person, index) => (
              <div className="p-2">
                <button
                  key={index}
                  value={selectedPerson}
                  onClick={() => setSelectedPerson(person.name)}
                  className={`relative flex flex-col ${
                    person.name === selectedPerson
                      ? "ring-4 outline-none ring-blue-300"
                      : ""
                  } justify-center items-center w-10 h-10 mt-4 overflow-hidden bg-gray-300 rounded-full dark:bg-gray-600`}
                >
                  <svg
                    className="absolute w-12 h-12 text-gray-500 -left-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>

                <div className="flex justify-center ">
                  <span className="absolute font-semibold text-lg text-black mb-10">
                    {person.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className=" mt-8">
            <input
              type="text"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              className="w-40 pl-2 text-sm text-gray-700 bg-gray-200 border-none rounded-lg"
              placeholder="Enter person name"
            />
            <button
              type="button"
              onClick={handleAddPerson}
              className="ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Add Person
            </button>
          </div>
        </div>
        <div className="w-full">
          {personOrder.map((data: PersonOrder) => {
            const orderIds = data.orders.map((e) => e.id);
            return (
              <div className="">
                <div className="mb-4 border-b-2 ">
                  <span className="font-bold">{data.personName}</span>
                </div>

                <div className="divide-t-2 divide-dashed">
                  {data.orders.map((order) => {
                    return (
                      <div className="flex justify-between mb-4">
                        <div>
                          <span className="font-normal">{order.name}</span>
                        </div>
                        <div>
                          <span>
                            Rp.
                            {calculatedAmount(
                              order.id,
                              CalculateAmountType.PRICE
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex justify-between mb-4">
                    <div>
                      <span className="font-normal">Tax</span>
                    </div>
                    <div>
                      <span>Rp.{calculateTax(orderIds)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div>
                      <span className="font-normal">Total</span>
                    </div>
                    <div>
                      <span>
                        Rp.
                        {calculateTax(orderIds) + calculateTotalprice(orderIds)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className="w-full mt-5">
          <button type="button" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Confirm </button>
        </div> */}
      </div>
    </>
  );
};

export default Index;
