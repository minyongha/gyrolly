import bs58 from "bs58";

const useGenerateReferralCode = (walletAddress: string) => {
  const walletBytes = Buffer.from(walletAddress.slice(2), "hex");
  const base58Encoded = bs58.encode(walletBytes);
  const referralCode = base58Encoded.slice(0, 8);
  return referralCode;
};

export default useGenerateReferralCode;
