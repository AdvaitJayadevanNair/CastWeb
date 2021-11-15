import * as Chakra from '@chakra-ui/react';

export default function Loader() {
  return (
    <Chakra.Center w="100vw" h="100vh">
      <Chakra.Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Chakra.Center>
  );
}
