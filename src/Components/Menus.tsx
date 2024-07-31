import { useEffect, useState } from "react";
import Cards from "./Cards";
import axiosInstance from "../axiosConfig";

const Menus = () => {
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [popularMenu, setPopularMenu] = useState([]);
  const [newMenu, setNewMenu] = useState([]);
  const [selectedNavItem, setSelectedNavItem] = useState<number>(0);

  const getPopularMenu = () => {
    axiosInstance
      .get(`/menu/popular`)
      .then((res: any) => {
        const data = res.data;
        setPopularMenu(data);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };

  const getNewMenu = () => {
    axiosInstance
      .get(`/menu/newMenu`)
      .then((res: any) => {
        const data = res.data;
        setNewMenu(data);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };
  useEffect(() => {
    const fetchMenu = async () => {
      const res = await fetch("http://localhost:4000/api/menu");
      const json = await res.json();
      console.log(res);
      if (res.ok) {
        setSelectedMenus(json);
      }
    };
    fetchMenu();
    getPopularMenu();
    getNewMenu();
    // console.log(fetchMenu);
    // const fetch = fetch("/api/menu")
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 font-primary">
        {selectedNavItem === 0 &&
          selectedMenus.map((item: any) => (
            <Cards
              key={item._id}
              id={item._id}
              image={item.imgPath}
              title={item.name}
              price={item.price}
              description={item.desc}
            />
          ))}
        {selectedNavItem === 1 &&
          newMenu.map((item: any) => (
            <Cards
              key={item._id}
              id={item._id}
              image={item.imgPath}
              title={item.name}
              price={item.price}
              description={item.desc}
            />
          ))}
        {selectedNavItem === 2 &&
          popularMenu.map((item: any) => (
            <Cards
              key={item._id}
              id={item._id}
              image={item.imgPath}
              title={item.name}
              price={item.price}
              description={item.desc}
            />
          ))}
      </div>
      <div className="fixed bottom-0 z-50 w-full -translate-x-1/2   border-gray-200 left-1/2 dark:bg-gray-700 dark:border-gray-600">
        <div className="w-full">
          <div
            className="grid max-w-xs grid-cols-3 gap-1 p-1 mx-auto my-2 bg-gray-100 rounded-lg dark:bg-gray-600"
            role="group"
          >
            <button
              type="button"
              onClick={() => {
                setSelectedNavItem(0);
              }}
              className={`px-5 py-1.5 text-xs font-medium ${
                selectedNavItem === 0 ? 'bg-gray-900 text-white' : 'text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700'
              } rounded-lg`}
            >
              Menus
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedNavItem(1);
              }}
              className={`px-5 py-1.5 text-xs font-medium ${
                selectedNavItem === 1 ? 'bg-gray-900 text-white' : 'text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700'
              } rounded-lg`}
            >
              New
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedNavItem(2);
              }}
              className={`px-5 py-1.5 text-xs font-medium ${
                selectedNavItem === 2 ? 'bg-gray-900 text-white' : 'text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700'
              } rounded-lg`}
            >
              Popular
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menus;
