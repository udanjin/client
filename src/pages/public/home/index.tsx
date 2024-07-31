import { useParams } from "react-router-dom";
import Menus from "../../../Components/Menus";
import TopNavbar from "../../../Components/TopNavbar";
import { useEffect } from "react";
const index = () => {
  const { tableId } = useParams();

  useEffect(() => {
    if (!tableId || tableId === "") return;
    localStorage.setItem("tableId", tableId);
  }, [tableId]);

  return (
    <>
      <TopNavbar />
      <Menus />
      {/* <Navbar/> */}
    </>
  );
};

export default index;
