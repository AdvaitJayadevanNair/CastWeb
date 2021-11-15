import * as Chakra from '@chakra-ui/react';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';

export default function Home({ setIsSender }) {
    const { toggleColorMode } = Chakra.useColorMode();
    const boxBackground = Chakra.useColorModeValue('gray.100', 'gray.700');

    return (
        <Chakra.Flex height="100vh" alignItems="center" justifyContent="center">
            <Chakra.Flex direction="column">
                <Chakra.Box background={boxBackground} p={12} rounded={6} mb={4}>
                    <Chakra.Heading align="center" mb={4}>CastWeb</Chakra.Heading>
                    <Chakra.Center mb={4}>
                        <Chakra.Button
                            leftIcon={<TriangleUpIcon />}
                            colorScheme="teal"
                            variant="solid"
                            mr={4}
                            onClick={() => {
                                setIsSender(true);
                            }}
                        >
                            Cast
                        </Chakra.Button>
                        <Chakra.Button
                            leftIcon={<TriangleDownIcon />}
                            colorScheme="teal"
                            variant="solid"
                            onClick={() => {
                                setIsSender(false);
                            }}
                        >
                            Receive
                        </Chakra.Button>
                    </Chakra.Center>
                    <Chakra.Center>
                        <Chakra.Button onClick={toggleColorMode}>Toggle Colors</Chakra.Button>
                    </Chakra.Center>
                </Chakra.Box>

                <Chakra.Text align="center">© 2021 Advait Jayadevan Nair. All rights reserved.</Chakra.Text>
            </Chakra.Flex>
        </Chakra.Flex>
    );
}
