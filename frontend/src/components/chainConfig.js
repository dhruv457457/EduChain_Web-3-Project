const chainConfig = {
  linea: {
    chainId: "59141",
    rpcUrl: "https://rpc.sepolia.linea.build",
    fundTransferAddress: "0xf5646e10B042567d23753D587DDa16dc6E4061Ab",
    cryptifySWCAddress: "0xfA6272595Eb32b1Fe6A6AbB6D74D1B1C49502913",
    usernameRegistryAddress: "0x0f87ea1419E33c57D5106762F34C971561A1162a",
    name: "Linea Sepolia",
  },
  eduChain: {
    chainId: "656476",
    rpcUrl: "https://opencampus-codex-sepolia.rpc.caldera.xyz/http",
    fundTransferAddress: "0x31bCF4cC0c6c7F13Ab92260FAdc8BCeFFBfEef5c",
    cryptifySWCAddress: "0x6114B9FA1f90e6DDFea9fD8f8e7427F43B00F70A",
    usernameRegistryAddress: "0x55C5C1991714595969c66F0b55DFF740f3031Cb4",
    name: "EDU Chain",
  },
};
export default chainConfig;