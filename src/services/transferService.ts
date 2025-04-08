
// This service would typically interact with your backend API

export interface TransferData {
  transferType: "domestic" | "international";
  recipientName: string;
  amount: string;
  bankName: string;
  description?: string;
  // Domestic specific fields
  accountNumber?: string;
  routingNumber?: string;
  // International specific fields
  iban?: string;
  swiftCode?: string;
  bankAddress?: string;
  bankCountry?: string;
  currency?: string;
}

// Function to simulate API call for creating a transfer
export async function createTransfer(transferData: TransferData): Promise<{ success: boolean; id: string }> {
  console.log("Creating transfer with data:", transferData);
  
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a mock transaction ID
      const transactionId = "TXN" + Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
      
      resolve({
        success: true,
        id: transactionId,
      });
    }, 1500);
  });
}

// Function to simulate API call for getting a user's transfer history
export async function getTransferHistory(): Promise<TransferData[]> {
  console.log("Fetching transfer history");
  
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          transferType: "domestic",
          recipientName: "John Doe",
          amount: "250.00",
          bankName: "Bank of America",
          accountNumber: "****1234",
          routingNumber: "123456789",
          description: "Rent payment",
        },
        {
          transferType: "international",
          recipientName: "Jane Smith",
          amount: "1000.00",
          bankName: "HSBC",
          iban: "GB29NWBK****1234",
          swiftCode: "HSBCGB2L",
          bankAddress: "8 Canada Square, London",
          bankCountry: "United Kingdom",
          currency: "GBP",
          description: "Invoice payment",
        },
      ]);
    }, 1000);
  });
}

// Function to cancel a transfer (if possible)
export async function cancelTransfer(transferId: string): Promise<{ success: boolean }> {
  console.log("Cancelling transfer:", transferId);
  
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
      });
    }, 1000);
  });
}
