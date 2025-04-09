
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronRight, AlertCircle, CheckCircle, Info, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import TransferSummary from "./TransferSummary";

// Updated form schema for international transfers
const internationalFormSchema = z.object({
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
  useStripe: z.boolean().default(false),
  // Fixed Stripe fields validation
  stripeAccountId: z.string().optional(),
  stripePublishableKey: z.string().optional(),
}).refine((data) => {
  // If useStripe is true, validate that stripeAccountId is provided
  if (data.useStripe && (!data.stripeAccountId || data.stripeAccountId.length < 3)) {
    return false;
  }
  return true;
}, {
  message: "Stripe Account ID is required when using Stripe.",
  path: ["stripeAccountId"],
}).refine((data) => {
  // If useStripe is true, validate that stripePublishableKey is provided
  if (data.useStripe && (!data.stripePublishableKey || data.stripePublishableKey.length < 10)) {
    return false;
  }
  return true;
}, {
  message: "Stripe Publishable Key is required when using Stripe.",
  path: ["stripePublishableKey"],
});

type TransferFormValues = z.infer<typeof internationalFormSchema>;

const TransferForm: React.FC = () => {
  const [step, setStep] = useState<"form" | "summary" | "success">("form");
  const [formData, setFormData] = useState<TransferFormValues | null>(null);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(internationalFormSchema),
    defaultValues: {
      recipientName: "",
      iban: "",
      swiftCode: "",
      bankName: "",
      bankAddress: "",
      bankCountry: "",
      amount: "",
      currency: "USD",
      description: "",
      useStripe: false,
      stripeAccountId: "",
      stripePublishableKey: "",
    },
  });

  // Watch the useStripe field to show/hide Stripe fields
  const useStripe = form.watch("useStripe");

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
        variant: "default",
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

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg bg-gradient-to-b from-dark-purple to-black border-primary-purple/20 animate-fade-in">
      <CardHeader className="border-b border-white/10 pb-8">
        <CardTitle className="text-2xl font-bold text-gradient">International Bank Transfer</CardTitle>
        <CardDescription className="text-gray-400">
          Send money securely to international accounts with optional Stripe integration.
        </CardDescription>
      </CardHeader>

      {step === "form" && (
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                <Separator className="my-2" />

                <FormField
                  control={form.control}
                  name="useStripe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/10 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4 text-primary-purple" />
                          Use Stripe for this transfer
                        </FormLabel>
                        <FormDescription>
                          Enable Stripe integration for secure payment processing
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {useStripe && (
                  <div className="space-y-4 p-4 bg-black/30 rounded-md border border-primary-purple/20">
                    <h3 className="text-sm font-medium flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-primary-purple" /> 
                      Stripe Account Details
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="stripeAccountId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stripe Account ID</FormLabel>
                          <FormControl>
                            <Input placeholder="acct_xxxxxxxxxx" {...field} className="bg-black/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="stripePublishableKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stripe Publishable Key</FormLabel>
                          <FormControl>
                            <Input placeholder="pk_xxxx_xxxxxxxxxxxxxxxx" {...field} className="bg-black/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-primary-purple hover:bg-secondary-purple text-white">
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
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
              Your transfer of ${formData?.amount} ({formData?.currency}) has been successfully initiated.
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
