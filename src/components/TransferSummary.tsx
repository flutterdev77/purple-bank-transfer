
import React from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TransferSummaryProps {
  formData: any;
  onConfirm: () => void;
  onEdit: () => void;
}

const TransferSummary: React.FC<TransferSummaryProps> = ({ formData, onConfirm, onEdit }) => {
  const isDomestic = formData.transferType === 'domestic';
  
  return (
    <CardContent className="pt-6 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Transfer Summary</h3>
        <p className="text-sm text-gray-400">Review your transfer details before confirming</p>
      </div>
      
      <div className="space-y-4 bg-black/30 p-4 rounded-lg">
        <div className="flex justify-between">
          <span className="text-gray-400">Transfer Type:</span>
          <span className="text-white font-medium">
            {isDomestic ? 'Domestic Transfer' : 'International Transfer'}
          </span>
        </div>
        
        <Separator className="bg-white/10" />
        
        <div className="flex justify-between">
          <span className="text-gray-400">Recipient:</span>
          <span className="text-white font-medium">{formData.recipientName}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Bank:</span>
          <span className="text-white font-medium">{formData.bankName}</span>
        </div>
        
        {isDomestic ? (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400">Account Number:</span>
              <span className="text-white font-medium">
                {formData.accountNumber.slice(0, -4).replace(/./g, '*') + formData.accountNumber.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Routing Number:</span>
              <span className="text-white font-medium">{formData.routingNumber}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400">IBAN:</span>
              <span className="text-white font-medium">
                {formData.iban.slice(0, 4) + '•••••••••' + formData.iban.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">SWIFT/BIC:</span>
              <span className="text-white font-medium">{formData.swiftCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bank Address:</span>
              <span className="text-white font-medium">{formData.bankAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bank Country:</span>
              <span className="text-white font-medium">{formData.bankCountry}</span>
            </div>
          </>
        )}
        
        <Separator className="bg-white/10" />
        
        <div className="flex justify-between text-lg">
          <span className="text-gray-400">Amount:</span>
          <span className="text-primary-purple font-bold">
            ${parseFloat(formData.amount).toFixed(2)} {!isDomestic && formData.currency}
          </span>
        </div>
        
        {formData.description && (
          <div className="flex justify-between">
            <span className="text-gray-400">Description:</span>
            <span className="text-white font-medium">{formData.description}</span>
          </div>
        )}
      </div>
      
      <Alert className="bg-yellow-500/10 border-yellow-600/30 text-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-sm">
          Please verify all details are correct. Transfers cannot be reversed once processed.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-between pt-4 space-x-4">
        <Button 
          variant="outline" 
          className="border-white/20 text-gray-400 hover:text-white" 
          onClick={onEdit}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button 
          className="bg-primary-purple hover:bg-secondary-purple flex-1"
          onClick={onConfirm}
        >
          Confirm Transfer
        </Button>
      </div>
    </CardContent>
  );
};

export default TransferSummary;
