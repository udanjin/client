import React from "react";
import { useNavigate } from "react-router-dom";


interface CardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  price: string;
}

const Cards: React.FC<CardProps> = ({ id, image, title, description,price }) => {
  const navigate = useNavigate();
  const tableId = localStorage.getItem("tableId");
  return (

    <div
      id={id}
      className="font-primary max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
      onClick={()=>navigate(`/${tableId}/details/${id}`)}
    >
      <div className="">
        <img className="rounded-t-lg object-cover aspect-square w-full h-full" src={image} alt="" />
      </div>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 font-head text-2xl font-bold tracking-loose dark:text-white">
            {title}
          </h5>
        </a>
        <p className="mb-3 font-head font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
        <p className="mb-3 font-head font-bold text-gray-800 dark:text-gray-400">
         Rp. {price}
        </p>
      </div>
    </div>
  );
};

export default Cards;
