import {
  customerAccountQuery,
} from "./customer-account";
import { shopifyCustomer } from "./types";

const CUSTOMER_QUERY = /* GraphQL */ `
  query Customer {
    customer {
      id

      firstName
      lastName

      emailAddress {
        emailAddress
      }

      defaultAddress {
        address1
        address2
        city
        province
        country
        zip
      }
    }
  }
`;

export async function getCustomer() {
  const result =
    await customerAccountQuery<{
      customer: shopifyCustomer;
    }>(
      CUSTOMER_QUERY,
      {},
      "Customer",
    );

  return result.customer;
}