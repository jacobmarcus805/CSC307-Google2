import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import getDay from "date-fns/getDay";
import addDays from "date-fns/addDays";
import startOfDay from "date-fns/startOfDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

const dayNames = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const customStartOfWeek = (date) => {
  return addDays(startOfDay(date), -date.getDay() + 1);
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: customStartOfWeek,
  getDay,
  locales,
});

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

const formatAmPmFromMinutes = (minutes) => {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${mins.toString().padStart(2, "0")} ${period}`;
};

function UserScheduleModal({ user, isOpen, onClose }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

  if (!user) return null;

  // Prepare events with start/end Date objects for the calendar
  const userEvents = user.schedule.map((event) => ({
    ...event,
    start: event.start || new Date(event.start), // ensure Date object
    end: event.end || new Date(event.end),
  }));

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleCloseEventDetails = () => {
    setSelectedEvent(null);
    setIsEventDetailsOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{user.name}&apos;s Schedule</ModalHeader>
          <ModalCloseButton />
          <ModalBody height="600px">
            {userEvents.length === 0 ? (
              <Text>No events scheduled.</Text>
            ) : (
              <Calendar
                localizer={localizer}
                events={userEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                views={["week"]}
                view="week"
                formats={formats}
                defaultView="week"
                min={new Date(new Date().setHours(8, 0, 0, 0))} // 8:00 AM
                max={new Date(new Date().setHours(22, 0, 0, 0))} // 10:00 PM
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                // No editing: no onDoubleClickEvent, no draggable events
                // Toolbar can be default or custom if you want
              />
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Event Details Modal */}
      <Modal isOpen={isEventDetailsOpen} onClose={handleCloseEventDetails}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Event Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent && (
              <>
                <Heading size="md" mb={2}>
                  {selectedEvent.title}
                </Heading>
                <Text>
                  <strong>Day:</strong>{" "}
                  {selectedEvent.day.charAt(0).toUpperCase() +
                    selectedEvent.day.slice(1)}
                </Text>
                <Text>
                  <strong>Start Time:</strong>{" "}
                  {formatAmPmFromMinutes(selectedEvent.start_time)}
                </Text>
                <Text>
                  <strong>End Time:</strong>{" "}
                  {formatAmPmFromMinutes(selectedEvent.end_time)}
                </Text>
                <Text>
                  <strong>Location:</strong> {selectedEvent.location}
                </Text>
                <Text>
                  <strong>Status:</strong>{" "}
                  <Text
                    as="span"
                    color={selectedEvent.can_sit ? "green.700" : "red.500"}
                    fontWeight="bold"
                  >
                    {selectedEvent.can_sit ? "Can Sit" : "Cannot Sit"}
                  </Text>
                </Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseEventDetails}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

UserScheduleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    schedule: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
        location: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default UserScheduleModal;
