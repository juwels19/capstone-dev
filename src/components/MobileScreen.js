import { Center, Button, ButtonGroup, Card, CardBody, CardFooter, Text, VStack} from "@chakra-ui/react";
import Image from "next/image";
import timeifyLogo from "public/timeify.svg"

export default function MobileScreen() {
    return (
            <Center h="100vh">
              <Card size="lg" variant="ghost" align="center" justify="center">
                  <CardBody>
                      <Image src={timeifyLogo} alt="timeify logo"/>
                  </CardBody> 
                  <CardFooter>
                    <VStack>
                      <Text align="center" as="b" mb="5%">
                        The Timeify mobile experience is currently under construction 👷‍♂️👷‍♀️🚧.
                      </Text>
                      <Text align="center" as="b" mb="5%">
                        Try turning your device to landscape or access this website on a larger device.
                      </Text>
                    </VStack>
                  </CardFooter>
              </Card>
            </Center>
    );
}
