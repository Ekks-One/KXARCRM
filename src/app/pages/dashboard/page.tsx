'use client';

import "./pageStyle.css";
import PieChart from "@/app/pages/dashboard/piechart";
import BarChart from "@/app/pages/dashboard/bargraph";

export default function DashboardPage() {

  return (

    <>
    <div className='infographics'>
        <PieChart />
        <BarChart />
    </div>
    </>

  );
}
