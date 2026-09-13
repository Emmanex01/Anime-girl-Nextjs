import AccountMenu from "./account-menu";
import { getCustomer } from "@/lib/shopify/customer";


export default async function AccountMenuServer() {
  let Customer = null;
  try {
    Customer = await getCustomer();
  } catch {
    Customer = null; // treat any auth error as "not logged in"
  }
  return <AccountMenu currentCustomer={Customer} />;
}