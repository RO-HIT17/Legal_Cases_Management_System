'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Divider, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, DatePicker, useDisclosure } from '@nextui-org/react';

interface Case {
  case_id: number;
  title: string;
  status: string;
  next_hearing_date: string;
  lawyer_id: number;
}

interface Appointment {
  appointment_id: number;
  case_id: number;
  appointment_date: string;
  location: string;
}

const ClientDashboard: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cases, setCases] = useState<Case[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    case_id: '',
    appointment_date: '',
    location: '',
  });

  useEffect(() => {
    // Fetch cases
    fetch('/api/client/cases')
      .then((response) => response.json())
      .then((data) => setCases(data))
      .catch((error) => console.error(error));

    // Fetch appointments
    fetch('/api/client/appointments')
      .then((response) => response.json())
      .then((data) => setAppointments(data))
      .catch((error) => console.error(error));
  }, []);

  const handleBookAppointment = () => {
    // Logic to book a new appointment
    fetch('/api/client/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAppointment),
    })
      .then((response) => response.json())
      .then((data) => {
        setAppointments([...appointments, data]);
        onClose(); // Close modal after booking
      })
      .catch((error) => console.error(error));
  };

  const upcomingAppointments = appointments.filter(
    (appointment) => new Date(appointment.appointment_date) > new Date()
  );

  const recentAppointments = appointments.filter(
    (appointment) => new Date(appointment.appointment_date) <= new Date()
  );

  return (
    <div className="p-4">
      <h1 className="text-center mb-8 text-4xl text-blue-600">Client Dashboard</h1>

      <h2 className="text-2xl text-blue-600">Upcoming Appointments</h2>
      <div className="flex flex-wrap gap-6">
        {upcomingAppointments.map((appointment) => (
          <Card key={appointment.appointment_id} isHoverable variant="bordered" className="flex-1 min-w-[300px] bg-gray-100">
            <CardHeader className="bg-blue-600 text-white">
              <h3 className="text-lg">Appointment</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <p>Case ID: {appointment.case_id}</p>
              <p>{new Date(appointment.appointment_date).toLocaleString()}</p>
              <p>Location: {appointment.location}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 text-2xl text-blue-600">Recent Appointments</h2>
      <div className="flex flex-wrap gap-6">
        {recentAppointments.map((appointment) => (
          <Card key={appointment.appointment_id} isHoverable variant="bordered" className="flex-1 min-w-[300px] bg-gray-100">
            <CardHeader className="bg-blue-600 text-white">
              <h3 className="text-lg">Appointment</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <p>Case ID: {appointment.case_id}</p>
              <p>{new Date(appointment.appointment_date).toLocaleString()}</p>
              <p>Location: {appointment.location}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Button className="mt-8" onPress={onOpen}>
        Book New Appointment
      </Button>

      {/* Modal to book new appointment */}
      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          <ModalHeader>
            <h3>Book New Appointment</h3>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Case ID"
              placeholder="Enter Case ID"
              value={newAppointment.case_id}
              onChange={(e) => setNewAppointment({ ...newAppointment, case_id: e.target.value })}
            />
            <DatePicker
              label="Appointment Date"
              placeholder="Select Date"
              value={newAppointment.appointment_date ? new Date(newAppointment.appointment_date) : undefined}
              onChange={(date) => setNewAppointment({ ...newAppointment, appointment_date: date?.toISOString() || '' })}
            />
            <Input
              label="Location"
              placeholder="Enter Location"
              value={newAppointment.location}
              onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={handleBookAppointment}>
              Book Appointment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ClientDashboard;
