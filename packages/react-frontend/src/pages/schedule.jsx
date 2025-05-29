import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import getDay from "date-fns/getDay";
import addDays from "date-fns/addDays";
import startOfDay from "date-fns/startOfDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  Text,
  Switch,
} from "@chakra-ui/react";

import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

const customStartOfWeek = (date) => {
  return addDays(startOfDay(date), -date.getDay() + 1); // Monday = 1, so -1+1=0 offset
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: customStartOfWeek,
  getDay,
  locales,
});

const dayNames = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const dayToIndex = (day) => {
  return dayNames.indexOf(day.toLowerCase());
};

// Helper function to convert minutes since midnight to Date object
const minutesToDate = (day, minutes) => {
  const dayIndex = typeof day === "string" ? dayToIndex(day) : day;
  const mondayDate = customStartOfWeek(new Date());
  const dayDate = addDays(mondayDate, dayIndex);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return new Date(dayDate.setHours(hours, mins, 0, 0));
};

// Mock event data
const initialEvents = [
  {
    id: 1,
    title: "CS 307 Lecture",
    day: "monday",
    start_time: 600, // 10:00 AM
    end_time: 710, // 11:50 AM
    location: "Building 14, Room 232",
    can_sit: true,
    // Converted properties for the calendar component
    start: minutesToDate("monday", 600),
    end: minutesToDate("monday", 710),
  },
  {
    id: 2,
    title: "Study Group",
    day: "tuesday",
    start_time: 840, // 2:00 PM
    end_time: 930, // 3:30 PM
    location: "Library, Study Room 3",
    can_sit: false,
    start: minutesToDate("tuesday", 840),
    end: minutesToDate("tuesday", 930),
  },
  {
    id: 3,
    title: "Gym Workout",
    day: "wednesday",
    start_time: 1080, // 6:00 PM
    end_time: 1140, // 7:00 PM
    location: "Recreation Center",
    can_sit: true,
    start: minutesToDate("wednesday", 1080),
    end: minutesToDate("wednesday", 1140),
  },
  {
    id: 4,
    title: "Weekend Hike",
    day: "saturday",
    start_time: 600, // 10:00 AM
    end_time: 780, // 1:00 PM
    location: "Mountain Trail",
    can_sit: false,
    start: minutesToDate("saturday", 600),
    end: minutesToDate("saturday", 780),
  },
];

function Schedule() {
  const [events, setEvents] = useState(initialEvents);
  const [newEvent, setNewEvent] = useState({
    id: null,
    title: "",
    day: "monday",
    start_time: 540,
    end_time: 600,
    location: "",
    can_sit: true,
    start: null,
    end: null,
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEventDetailsOpen,
    onOpen: onEventDetailsOpen,
    onClose: onEventDetailsClose,
  } = useDisclosure();

  const handleAddEvent = () => {
    const defaultStart = 540; // 9:00 AM
    const defaultEnd = 600; // 10:00 AM

    setNewEvent({
      id: Date.now(),
      title: "",
      day: "monday",
      start_time: defaultStart,
      end_time: defaultEnd,
      location: "",
      can_sit: true,
      start: minutesToDate("monday", defaultStart),
      end: minutesToDate("monday", defaultEnd),
    });
    setIsEditMode(false);
    onOpen();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const handleCanSitToggle = () => {
    setNewEvent((prev) => ({
      ...prev,
      can_sit: !prev.can_sit,
    }));
  };

  const handleDayChange = (e) => {
    const day = e.target.value;

    setNewEvent((prev) => {
      const updated = {
        ...prev,
        day,
        start: minutesToDate(day, prev.start_time),
        end: minutesToDate(day, prev.end_time),
      };
      return updated;
    });
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    const [hours, minutes] = value.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    setNewEvent((prev) => {
      const updated = { ...prev };

      if (name === "startTime") {
        updated.start_time = totalMinutes;
        updated.start = minutesToDate(prev.day, totalMinutes);
      } else if (name === "endTime") {
        updated.end_time = totalMinutes;
        updated.end = minutesToDate(prev.day, totalMinutes);
      }

      return updated;
    });
  };

  const formatTimeFromMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditEvent = () => {
    setNewEvent({
      ...selectedEvent,
    });
    setIsEditMode(true);
    onEventDetailsClose();
    onOpen();
  };

  const handleSaveEvent = () => {
    console.log("Events before saving:", events);

    if (
      newEvent.title &&
      newEvent.day &&
      newEvent.start_time &&
      newEvent.end_time &&
      newEvent.location
    ) {
      // Recalculate start and end
      const updatedEvent = {
        ...newEvent,
        start: minutesToDate(newEvent.day, newEvent.start_time),
        end: minutesToDate(newEvent.day, newEvent.end_time),
      };

      let updatedEvents;
      if (isEditMode) {
        // Replace the original event with the updated event
        updatedEvents = events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event,
        );
        setIsEditMode(false); // Reset edit mode
      } else {
        // Add a new event
        updatedEvents = [...events, { ...updatedEvent, id: Date.now() }];
      }

      setEvents(updatedEvents);

      console.log("Updated Events:", updatedEvents);

      onClose(); // Close modal
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    onEventDetailsOpen();
  };

  const handleRemoveEvent = () => {
    const updatedEvents = events.filter((e) => e.id !== selectedEvent.id);
    setEvents(updatedEvents);
    onEventDetailsClose();
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.can_sit ? "green" : "red";

    const style = {
      backgroundColor,
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style,
    };
  };

  const formats = {
    dayFormat: (date) => {
      const jsDay = date.getDay();
      const dayIndex = jsDay === 0 ? 6 : jsDay - 1;
      return (
        dayNames[dayIndex].charAt(0).toUpperCase() + dayNames[dayIndex].slice(1)
      );
    },
  };

  return (
    <Box p={5}>
      <Heading mb={4}>Weekly Schedule</Heading>
      <Button colorScheme="green" onClick={handleAddEvent} mb={4}>
        Add New Event
      </Button>
      <Box
        height="600px"
        backgroundColor="white"
        boxShadow="md"
        borderRadius="md"
        p={2}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          views={["week"]}
          view="week"
          formats={formats}
          defaultView="week"
          min={minutesToDate("monday", 480)} // Start at 8:00 AM
          max={minutesToDate("monday", 1320)} // End at 10:00 PM
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </Box>

      {/* Modal for adding new events */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditMode ? "Edit Event" : "Add New Event"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel>Event Title</FormLabel>
              <Input
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Day</FormLabel>
              <Select
                name="day"
                value={newEvent.day}
                onChange={handleDayChange}
              >
                {dayNames.map((day, index) => (
                  <option key={index} value={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Start Time</FormLabel>
              <Input
                name="startTime"
                type="time"
                onChange={handleTimeChange}
                value={formatTimeFromMinutes(newEvent.start_time)}
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>End Time</FormLabel>
              <Input
                name="endTime"
                type="time"
                onChange={handleTimeChange}
                value={formatTimeFromMinutes(newEvent.end_time)}
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={newEvent.location}
                onChange={handleInputChange}
                placeholder="Enter location"
              />
            </FormControl>

            <FormControl mb={3} display="flex" alignItems="center" isRequired>
              <FormLabel mb="0">Can Sit?</FormLabel>
              <Switch
                isChecked={newEvent.can_sit}
                onChange={handleCanSitToggle}
                colorScheme={newEvent.can_sit ? "green" : "red"}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveEvent}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for event details */}
      <Modal isOpen={isEventDetailsOpen} onClose={onEventDetailsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Event Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent && (
              <>
                <Heading size="md">{selectedEvent.title}</Heading>
                <Box mt={2}>
                  <strong>Day:</strong>{" "}
                  {selectedEvent.day.charAt(0).toUpperCase() +
                    selectedEvent.day.slice(1)}
                </Box>
                <Box>
                  <strong>Start Time:</strong>{" "}
                  {formatTimeFromMinutes(selectedEvent.start_time)}
                </Box>
                <Box>
                  <strong>End Time:</strong>{" "}
                  {formatTimeFromMinutes(selectedEvent.end_time)}
                </Box>
                <Box>
                  <strong>Location:</strong> {selectedEvent.location}
                </Box>
                <Box>
                  <strong>Status:</strong>{" "}
                  <Text
                    as="span"
                    color={selectedEvent.can_sit ? "green.700" : "red.500"}
                    fontWeight="bold"
                  >
                    {selectedEvent.can_sit ? "Can Sit" : "Cannot Sit"}
                  </Text>
                </Box>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditEvent}>
              Edit Event
            </Button>
            <Button colorScheme="red" mr={3} onClick={handleRemoveEvent}>
              Remove Event
            </Button>
            <Button variant="ghost" onClick={onEventDetailsClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

const CustomToolbar = () => {
  return (
    <Box display="flex" justifyContent="center" mb={4}>
      <Text fontWeight="bold">Weekly Schedule</Text>
    </Box>
  );
};

export default Schedule;
