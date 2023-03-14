import { Box } from '@chakra-ui/react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'


export default function TrendAccordion(props) {
    return (
        <Accordion allowToggle mt="2%" mx="7%">
            <AccordionItem 
                borderRadius={5} 
                borderColor="gray.400" 
                borderLeft="1px" 
                borderLeftColor="gray.400"
                borderRight="1px"
                borderRightColor="gray.400"
            >
                <AccordionButton bg="white" borderRadius={5} _expanded={{borderBottomRadius: 0}}>
                    <Box as="span" flex='1' textAlign='left'>
                        {props.buttonText}
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel bg="white" borderBottomRadius={5}>
                    {props.children}
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}