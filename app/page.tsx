"use client"

import { useUser } from "@clerk/nextjs";
import Wrapper from "./components/Wrapper";
import ProductOverview from "./components/ProductOverview";
import CategoryChart from "./components/CategoryChart";
import RecentTransactions from "./components/RecentTransacton";
import StockSummaryTable from "./components/StockSummaryTable";

export default function Home() {

  const {user} = useUser()
  const email = user?.primaryEmailAddress?.emailAddress as string

  return (

    <div>
      <Wrapper>
        <div className='flex flex-col md:flex-row'>
          <div className="md:w-2/3">
            <ProductOverview email = {email} />
            <CategoryChart email={email}/>
            <RecentTransactions email={email}/>
          </div>

          <div className="md:w-1/3 md:ml-4 md:mt-0 mt-4 ">
             <StockSummaryTable email={email}/>

          </div>

        </div>
      </Wrapper>
    </div>
    
  );
}
