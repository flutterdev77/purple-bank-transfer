
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronRight, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransferSummary from "./TransferSummary";

// Define form schemas for validation
const domesticFormSchema = z.object({
  transferType: z.literal("domestic"),
  recipientName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  accountNumber: z.string().min(8, { message: "Account number must be at least 8 characters." }),
  routingNumber: z.string().min(9, { message: "Routing number must be 9 digits." }).max(9),
  bankName: z.string().min(2, { message: "Bank name is required." }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  description: z.string().optional(),
});

const internationalFormSchema = z.object({
  transferType: z.literal("international"),
  recipientName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  iban: z.string().min(15, { message: "IBAN must be at least 15 characters." }),
  swiftCode: z.string().min(8, { message: "SWIFT/BIC code must be at least 8 characters." }).max(11),
  bankName: z.string().min(2, { message: "Bank name is required." }),
  bankAddress: z.string().min(5, { message: "Bank address is required." }),
  bankCountry: z.string().min(2, { message: "Bank country is required." }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  currency: z.string().min(3, { message: "Currency code is required." }),
  description: z.string().optional(),
});

// Union type for the form schemas
const transferFormSchema = z.discriminatedUnion("transferType", [
  domesticFormSchema,
  internationalFormSchema,
]);

type TransferFormValues = z.infer<typeof transferFormSchema>;

const TransferForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"domestic" | "international">("domestic");
  const [step, setStep] = useState<"form" | "summary" | "success">("form");
  const [formData, setFormData] = useState<TransferFormValues | null>(null);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(activeTab === "domestic" ? domesticFormSchema : internationalFormSchema),
    defaultValues: {
      transferType: activeTab,
      recipientName: "",
      amount: "",
      description: "",
      ...(activeTab === "domestic"
        ? { accountNumber: "", routingNumber: "", bankName: "" }
        : { iban: "", swiftCode: "", bankName: "", bankAddress: "", bankCountry: "", currency: "USD" }),
    },
  });

  // Update the form when the active tab changes
  React.useEffect(() => {
    form.reset({
      transferType: activeTab,
      recipientName: form.getValues("recipientName") || "",
      amount: form.getValues("amount") || "",
      description: form.getValues("description") || "",
      ...(activeTab === "domestic"
        ? { accountNumber: "", routingNumber: "", bankName: form.getValues("bankName") || "" }
        : { iban: "", swiftCode: "", bankName: form.getValues("bankName") || "", bankAddress: "", bankCountry: "", currency: "USD" }),
    });
  }, [activeTab, form]);

  // Handle form submission
  const onSubmit = (data: TransferFormValues) => {
    console.log("Form submitted:", data);
    setFormData(data);
    setStep("summary");
  };

  // Handle confirmation of transfer
  const handleConfirmTransfer = () => {
    // Here you would typically make an API call to process the transfer
    console.log("Transfer confirmed:", formData);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      toast({
        title: "Transfer Successful!",
        description: `Your transfer of $${formData?.amount} has been initiated.`,
        variant: "success",
      });
      setStep("success");
    }, 1500);
  };

  // Handle starting a new transfer
  const handleNewTransfer = () => {
    form.reset();
    setStep("form");
    setFormData(null);
  };

  // Switch between domestic and international tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value as "domestic" | "international");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg bg-gradient-to-b from-dark-purple to-black border-primary-purple/20 animate-fade-in">
      <CardHeader className="border-b border-white/10 pb-8">
        <CardTitle className="text-2xl font-bold text-gradient">Bank Transfer</CardTitle>
        <CardDescription className="text-gray-400">
          Send money securely to domestic or international accounts.
        </CardDescription>
      </CardHeader>

      {step === "form" && (
        <CardContent className="pt-6">
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="domestic" className="text-sm">Domestic Transfer</TabsTrigger>
              <TabsTrigger value="international" className="text-sm">International Transfer</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TabsContent value="domestic" className="space-y-4 animate-fade-in">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="recipientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="bg-black/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234567890" {...field} className="bg-black/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="routingNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Routing Number</FormLabel>
                            <FormControl>
                              <Input placeholder="123456789" {...field} className="bg-black/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Bank of America" {...field} className="bg-black/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (USD)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0.00"
                                {...field}
                                className="bg-black/50"
                                onChange={(e) => {
                                  // Only allow numbers and decimals
                                  const value = e.target.value.replace(/[^0-9.]/g, '');
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Rent payment, Gift, etc." {...field} className="bg-black/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="international" className="space-y-4 animate-fade-in">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="recipientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="bg-black/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="iban"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IBAN</FormLabel>
                            <FormControl>
                              <Input placeholder="GBXX XXXX XXXX XXXX XXXX XX" {...field} className="bg-black/50" />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500">
                              International Bank Account Number
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="swiftCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SWIFT/BIC Code</FormLabel>
                            <FormControl>
                              <Input placeholder="XXXXGB2LXXX" {...field} className="bg-black/50" />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500">
                              Bank Identifier Code
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input placeholder="International Bank" {...field} className="bg-black/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Bank St, City" {...field} className="bg-black/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United Kingdom" {...field} className="bg-black/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0.00"
                                {...field}
                                className="bg-black/50"
                                onChange={(e) => {
                                  // Only allow numbers and decimals
                                  const value = e.target.value.replace(/[^0-9.]/g, '');
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <FormControl>
                              <Input placeholder="USD" {...field} className="bg-black/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Rent payment, Gift, etc." {...field} className="bg-black/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <div className="flex justify-end pt-4">
                  <Button type="submit" className="bg-primary-purple hover:bg-secondary-purple text-white">
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      )}

      {step === "summary" && formData && (
        <TransferSummary 
          formData={formData} 
          onConfirm={handleConfirmTransfer} 
          onEdit={() => setStep("form")} 
        />
      )}

      {step === "success" && (
        <CardContent className="pt-6 flex flex-col items-center justify-center space-y-6 py-12">
          <div className="rounded-full bg-primary-purple/20 p-3">
            <CheckCircle className="h-12 w-12 text-primary-purple" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Transfer Initiated!</h3>
            <p className="text-gray-400">
              Your transfer of ${formData?.amount} {activeTab === "international" ? `(${(formData as any).currency})` : ""} has been successfully initiated.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              A confirmation has been sent to your email address.
            </p>
          </div>

          <div className="flex flex-col space-y-2 w-full items-center pt-6">
            <Button 
              onClick={handleNewTransfer} 
              className="bg-primary-purple hover:bg-secondary-purple w-48"
            >
              New Transfer
            </Button>
            <Button 
              variant="outline" 
              className="border-white/20 text-gray-400 hover:text-white w-48"
              onClick={() => {
                // Navigate to transfer history (in a real app)
                toast({
                  title: "View Transfer History",
                  description: "This would navigate to your transfer history in a real application.",
                });
              }}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex flex-col space-y-4 border-t border-white/10 pt-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 self-center">
          <Info className="h-4 w-4" />
          <span>Your transfer is protected by bank-level security encryption</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransferForm;
