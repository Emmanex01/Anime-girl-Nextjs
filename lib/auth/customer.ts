import { redirect } from "next/navigation";
import {
  getCustomer,
} from "@/lib/shopify/customer";
import {
  getCustomerSession,
} from "./session";

export async function requireCustomer() {
  const session =
    await getCustomerSession();

  if (!session) {
    redirect(
      "/auth/login?returnTo=/account",
    );
  }

  try {
    return await getCustomer();
  } catch (error) {
    console.error(
      "Unable to load authenticated customer",
      error,
    );

    redirect(
      "/auth/login?returnTo=/account",
    );
  }
}