import { Button, ButtonGroup, Flex, FormControl, FormLabel, FormHelperText, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Textarea, useDisclosure, VStack } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { Select } from "chakra-react-select"
import { useState } from "react";

export default function ExternalSessionModal(props) {
    const { userId } = props;
    const { isOpen: externalSessionIsOpen, onClose: externalSessionsOnClose, onOpen: externalSessionOnOpen } = useDisclosure();
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [productivityRating, setProductivityRating] = useState(null); // This should always be a dictionary
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");

    const productivityRatingOptions = [
        {value: 1, label: "I finished less than I expected to"},
        {value: 2, label: "I finished exactly what I expected to"},
        {value: 3, label: "I finished more than I expected to"},
    ];

    const locationOptions = [
        {value: "In-Class", label: "In-Class"},
        {value: "Library", label: "Library"},
        {value: "Home", label: "Home"},
        {value: "Other", label: "Other"},
    ];

    return(
        <>
            <Modal size="2xl" isOpen={externalSessionIsOpen} onClose={externalSessionsOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold" fontSize="2xl">Log External Working Session</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex justify="space-between">
                            <VStack>
                                <FormControl isRequired>
                                    <FormLabel fontWeight="bold">Session Start Date and Time</FormLabel>
                                    <Input 
                                        type="datetime-local"
                                        onChange={(e) => setStartDateTime(e.target.value)}
                                    />
                                </FormControl>
                            </VStack>
                            <VStack>
                                <FormControl isRequired>
                                    <FormLabel fontWeight="bold">Session End Date and Time</FormLabel>
                                    <Input 
                                        type="datetime-local"
                                        onChange={(e) => setEndDateTime(e.target.value)}
                                    />
                                </FormControl>
                            </VStack>
                        </Flex>
                        <FormControl isRequired>
                            <FormLabel mt="2%" fontWeight="bold">Productivity Rating</FormLabel>
                                <FormHelperText mb="1%">Rate how productive you felt your working session was:</FormHelperText>
                                <Select 
                                    width="50%" 
                                    variant="outline" 
                                    bg="white"
                                    placeholder="Select a Productivity Rating"
                                    options={productivityRatingOptions}
                                    onChange={(e) => setProductivityRating(e.value)}
                                />
                        </FormControl>
                        <FormControl>
                            <FormLabel mt="2%" fontWeight="bold">Location</FormLabel>
                            <Select 
                                width="50%" 
                                variant="outline" 
                                bg="white"
                                placeholder="Select a location for your working session..."
                                options={locationOptions}
                                onChange={(e) => setLocation(e.value)}
                            />
                        </FormControl>
                        <FormControl mt="2%">
                            <FormLabel fontWeight="bold">Notes</FormLabel>
                            <Textarea onChange={(e) => setNotes(e.target.value)} value={notes}/>
                        </ FormControl>
                        <ButtonGroup sz="md" mt="5%" minWidth="100%">
                            <Button colorScheme="gray" onClick={externalSessionsOnClose} width="100%">
                                Cancel
                            </Button>
                            <Button colorScheme="green" 
                                    width="100%" 
                                    type="submit">
                                Log Session
                            </Button>
                        </ButtonGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Button
                colorScheme="green"
                onClick={externalSessionOnOpen}
                variant="outline"
                leftIcon={<SmallAddIcon />}
            >
                Log External Working Session
            </Button>
        </>
    )
}