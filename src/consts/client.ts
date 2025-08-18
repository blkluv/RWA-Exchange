import { createThirdwebClient } from "thirdweb";

// Thirdweb client used by MediaRenderer and other SDK utilities
// Ensure NEXT_PUBLIC_THIRDWEB_CLIENT_ID is set in your environment
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your_thirdweb_client_id_here",
});
