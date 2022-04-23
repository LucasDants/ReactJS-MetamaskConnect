import type { NextPage } from 'next'
import { Button, Flex, Heading, Image } from "@chakra-ui/react";

import { useMetamask } from "../hooks/metamask";

const Home: NextPage = () => {
  const { connectMetamask, walletIdShrunk, metamaskIsConnected } = useMetamask()

  return (
      <Flex h="100vh" w="100%" justifyContent="center" alignItems="center" bg="orange.50">
      <Button
        leftIcon={<Image src="images/metamask.png" alt="Orange fox Metamask" />}
        p="10"
        bg={metamaskIsConnected() ? 'orange.50' : 'orange'}
        _hover={{
          backgroundColor: metamaskIsConnected() ? 'none' : 'orange.500'
        }}
        disabled={metamaskIsConnected()}
        _disabled={{
          opacity: 1,
          cursor: 'default',
        }}
        _active={{
          backgroundColor: metamaskIsConnected() ? 'none' : 'orange.900'
        }}
        onClick={connectMetamask}
        >
        <Heading color={metamaskIsConnected() ? 'black' : 'white'}>
          {
            metamaskIsConnected() ? walletIdShrunk : 'Connect Metamask'
          }
        </Heading>
      </Button>
    </Flex>
  )
}

export default Home
