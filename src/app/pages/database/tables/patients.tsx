'use client';

import { useEffect, useState } from 'react';
import "./tableStyle.css";
import { supabase } from '@/app/server/supabaseClient';

type Patient = {
  patient_id: number;
  first_name: string;
  last_name: string;
  visit_reason: string;
  visit_date: string;
};

export function ShowPatients () {

    const[patients, setPatients] = useState<Patient[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const {data, error } = await supabase.from('patients').select('*');

        if (error) {
            console.error('Error fetching patients: ', error);
        }
        else {
            setPatients(data || []);
        }
    };

    return (
        <div>
        <h2>Patients</h2>
            <table>
                <thead>
                <tr>
                    <th>Patient ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Visit Reason</th>
                    <th>Visit Date</th>
                </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.patient_id}>
                            <td>{patient.patient_id}</td>
                            <td>{patient.first_name}</td>
                            <td>{patient.last_name}</td>
                            <td>{patient.visit_reason}</td>
                            <td>{patient.visit_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
