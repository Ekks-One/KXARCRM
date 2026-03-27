'use client';

import { useEffect, useState } from 'react';
import AddEntry from "./addEntry";
import RemoveEntry from "./removeEntry";
import "./tableStyle.css";
import { supabase } from '@/app/server/supabaseClient';

export function ShowCustomers () {

    const[customers, setCustomers] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const {
            data: {user},
        } = await supabase.auth.getUser();

        if (!user) {
            console.error("No user found");
            return;
        }

        const {data, error } = await supabase
        .from('customers')
        .select('*')
        .eq("user_id", user.id);

        if (error) {
            console.error('Error fetching customers: ', error);
        }
        else {
            setCustomers(data);}
    };

    return (
        <div>
        <h2>Customers</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>Last Contact</th>
                    <th>Notes</th>
                </tr>
                </thead>
                <tbody>
                    {customers.map(customer => (
                        <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>{customer.first_name}</td>
                        <td>{customer.last_name}</td>
                        <td>{customer.email_address}</td>
                        <td>{customer.phone_number}</td>
                        <td>{customer.address}</td>
                        <td>{customer.last_contact}</td>
                        <td>{customer.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="modifier">
                <AddEntry />
            </div>

            <div className="modifier">
                <RemoveEntry />
            </div>
        </div>
    );
}
