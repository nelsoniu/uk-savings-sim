import { SavingsSimulator } from "@/components/SavingsSimulator";
import accountsData from "@/data/accounts.json";
import { AccountsData } from "@/types";

export default function Home() {
  return <SavingsSimulator accounts={accountsData as AccountsData} />;
}
