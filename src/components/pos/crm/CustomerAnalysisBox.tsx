import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { UsersRound } from "lucide-react";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerAnalysisBox = ({ data }: any) => {
  // Define chart data
  const chartData = {
    datasets: [
      {
        label: "Gender %",
        data: [data?.genderPercents?.MALE, data?.genderPercents?.FEMALE],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-2 bg-white p-6 rounded-lg border-[1.5px] border-gray-200">
        <div className="gap-3 items-baseline flex h-full justify-center flex-col">
          <UsersRound size={32} />
          <div className="space-y-0.5">
            <p className="text-2xl font-medium">{data?.totalCustomers}</p>
            <p className="text-base font-normal">Total Customers</p>
          </div>
        </div>
      </div>

      <div className="col-span-4 bg-white p-6 rounded-lg border-[1.5px] border-gray-200">
        <div>
          <p className="text-end text-xl mb-3">Age Analysis</p>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="w-[130px] text-sm text-primary/60 font-light">
                Young (&gt;=20)
              </p>
              <div className="w-1/2 h-2 bg-secondary relative">
                <div
                  style={{ width: `${data?.agePercents?.young}%` }}
                  className="h-2 bg-yellow-300 absolute"
                ></div>
              </div>
              <p className="text-sm text-primary/60 font-light">
                {data?.agePercents?.young}%
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="w-[130px] text-sm text-primary/60 font-light">
                Middle (20 &lt; 40)
              </p>
              <div className="w-1/2 h-2 bg-secondary relative">
                <div
                  style={{ width: `${data?.agePercents?.MIDDLE}%` }}
                  className="w-[75%] h-2 bg-purple-500 absolute"
                ></div>
              </div>
              <p className="text-sm text-primary/60 font-light">
                {data?.agePercents?.MIDDLE}%
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="w-[130px] text-sm text-primary/60 font-light">
                Old (&gt;40)
              </p>
              <div className="w-1/2 h-2 bg-secondary relative">
                <div
                  style={{ width: `${data?.agePercents?.OLD}%` }}
                  className={`h-2 bg-blue-300 absolute`}
                ></div>
              </div>
              <p className="text-sm text-primary/60 font-light">
                {data?.agePercents?.OLD}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-6 bg-white p-6 rounded-lg border-[1.5px] border-gray-200">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6 space-y-3">
            <div>
              <p className="text-xl mb-6">Gender Analysis</p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#37a2eb]"></div>
                  <p className="text-xs">Male</p>
                </div>
                <div className="flex items-center gap-8">
                  <p className="text-xs">{data?.genderPercents?.MALE}%</p>
                </div>
              </div>
            </div>
            <hr className="border-[1px]" />
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#ff6384]"></div>
                  <p className="text-xs">Female</p>
                </div>
                <div className="flex items-center gap-8">
                  <p className="text-xs">{data?.genderPercents?.FEMALE}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-6 flex justify-center">
            <div className="w-[150px] h-[150px]">
              <Doughnut data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalysisBox;
