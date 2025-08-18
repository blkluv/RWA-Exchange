import { OneID } from '@oneid-xyz/inspect';
import { Button } from '@chakra-ui/react';
import type { Account } from 'thirdweb/wallets';

type Props = {
  account: Account;
};

export function OneIdVerification({ account }: Props) {
  const checkVerification = async () => {
    try {
      const oneid = new OneID();
      await oneid.systemConfig.initConfig();
      const ids = await oneid.getLinkedIDs(account.address);
      console.log('OneID Data:', ids);
      // TODO: Check for KYC status in the `ids` object
      if (ids && ids.length > 0) {
        // Placeholder for actual verification logic
        alert('Verification data logged to console. Check for KYC status.');
      } else {
        alert('No OneID found for this address.');
      }
    } catch (error) {
      console.error('OneID verification failed:', error);
      alert('OneID verification failed. See console for details.');
    }
  };

  return (
    <Button onClick={checkVerification} colorScheme="blue" mt={4}>
      Verify with OneID (Test)
    </Button>
  );
}
