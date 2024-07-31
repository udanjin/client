import { useEffect, useState } from "react";
import Sidebar from "../../../Components/Sidebar";
import NavbarTop from "../../../Components/NavbarTop";
import Menus from "../../../Components/Menus";
import ReactApexChart from "react-apexcharts";
import axiosInstance from "../../../axiosConfig";

interface SeriesData {
  x: string;
  y: number;
}

const Index = () => {
  const [timePeriod, setTimePeriod] = useState("last7days");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chartCategories, setChartCategories] = useState<string[]>([]);
  const [chartValue, setChartValue] = useState<number[]>([]);
  const [totalValue, setTotalValue] = useState<string>("");

  const fetchIncome = async (timePeriod: string) => {
    axiosInstance
      .get(`/transaction/chart?timePeriod=${timePeriod}`)
      .then((res): any => {
        const chartData = res.data;
        const seriesData: SeriesData[] = chartData.series;

        const groupedData: SeriesData[] = [];
        let total = 0;
        let formattedTotal = "";
        seriesData.forEach((data: SeriesData) => {
          const date = new Date(data.x).toLocaleDateString();
          const existDate = groupedData.find((item) => item.x === date);

          if (existDate) {
            existDate.y += data.y;
          } else {
            groupedData.push({
              x: date,
              y: data.y,
            });
          }
          total += data.y;
        });
        const rounded = Math.round(total);
        formattedTotal = rounded.toLocaleString("en-US", {
          maximumFractionDigits: 1,
        });
        console.log(formattedTotal);
        const dateData = groupedData.map((data: SeriesData) => data.x);
        const valueData = groupedData.map((data: SeriesData) =>
          parseFloat(data.y.toFixed(2))
        );
        setTotalValue(formattedTotal);
        setChartCategories(dateData);
        setChartValue(valueData);
        // console.log(categories)
      });
  };

  useEffect(() => {
    fetchIncome(timePeriod);
  }, [timePeriod]);

  return (
    <>
      <NavbarTop />
      <div className="flex pt-16 overflow-hidden font-primary">
        <Sidebar />
        {/* <div className="fixed inset-0 z-10 hidden bg-gray-900/50 dark:bg-gray-900/90" id="sidebarBackdrop"></div> */}
        <div className="relative w-full h-full overflow-y-auto lg:ml-64">
          <main>
            <div className="p-4 pt-6">
              <div className="">
                <Menus />
              </div>
            </div>
            <div className="p-5">
              <div className="max-w-xl w-full bg-white rounded-lg shadow-lg dark:bg-gray-800 p-4 md:p-6">
                <div className="flex justify-between">
                  <div>
                    <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
                      Rp. {totalValue}
                    </h5>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Sales {timePeriod}
                    </p>
                  </div>
                </div>
                <div id="area-chart">
                  {chartCategories.length > 0 && (
                    <ReactApexChart
                      options={{
                        chart: {
                          id: "basic-bar",
                        },
                        xaxis: {
                          categories: chartCategories,
                        },
                      }}
                      type="line"
                      series={[
                        {
                          name: "series-1",
                          data: chartValue,
                        },
                      ]}
                      width={500}
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                  <div className="flex justify-between items-center pt-5">
                    {/* <!-- Button --> */}
                    <button
                      id="dropdownDefaultButton"
                      data-dropdown-toggle="lastDaysdropdown"
                      data-dropdown-placement="bottom"
                      className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
                      type="button"
                      onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                        console.log("Dropdown button clicked", dropdownOpen);
                      }}
                    >
                      {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}
                      <svg
                        className="w-2.5 m-2.5 ms-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>
                    {/* <!-- Dropdown menu --> */}
                    <div
                      id="lastDaysdropdown"
                      style={{ display: dropdownOpen ? "block" : "none" }}
                      className="absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton"
                      >
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setTimePeriod("last7days");
                              setDropdownOpen(false);
                            }}
                          >
                            Last 7 days
                          </a>
                        </li>

                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setTimePeriod("last30days");
                              setDropdownOpen(false);
                            }}
                          >
                            Last 30 days
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setTimePeriod("last90days");
                              setDropdownOpen(false);
                            }}
                          >
                            Last 90 days
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Index;
