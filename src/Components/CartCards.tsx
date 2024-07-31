import React from "react";

interface ShoppingCartCardProps {
  name: string;
  price?: number;
  imgPath?: string;
  note?: string;
  quantity?: number;
  handleUpdateItemQty: (id: string, action: string) => void;
  id: string;
}

const CartCards: React.FC<ShoppingCartCardProps> = ({
  name,
  price,
  imgPath,
  quantity,
  note,
  handleUpdateItemQty,
  id
}) => (
  <div className="w-[90vw] font-primary bg-white shadow-md rounded-lg p-4 flex ml-2 space-x-4 mb-12">
    <img src={imgPath} alt={name} className="w-20 h-20 object-cover" />
    <div>
      <div>

      <h2 className="text-lg font-semibold mb-2">{name}</h2>
      <p className="text-gray-400 mb-2">{note}</p>
      <p className="text-gray-600 mb-2">Quantity: {quantity}</p>
      <p className="text-gray-600 mb-2">Price: Rp{price}</p>
      </div>
      <div className="flex justify-between items-center gap-2 bg-gray-300 rounded-full w-24">
        <div>

        <button
          className="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2.5 text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
          onClick={()=>handleUpdateItemQty(id,"decrease")}
          // disabled={quantity === 1}
        >
          -
        </button>
        </div>
        
        <span className="text-md font-bold text-black dark:text-white text-center flex justify-center">
          {quantity}
        </span>
        <div>

        <button
          onClick={()=>handleUpdateItemQty(id,"increase")}
          className="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2.5 text-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          +
        </button>
        </div>
      </div>
      {/* <button
        onClick={()=>handleRemoveItem(id)}
        className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600"
      >
        Remove
      </button> */}
    </div>
  </div>
);

export default CartCards;
