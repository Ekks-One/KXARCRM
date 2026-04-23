'use client';

import { useEffect, useState } from 'react';
import "./tableStyle.css";
import { supabase } from '@/app/server/supabaseClient';

type Project = {
  project_id: number;
  customer_id: number;
  type: string;
  notes: string;
  status: string;
  due_date: string;
};

export function ShowProjects () {

    const[projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const {data, error } = await supabase.from('projects').select('*');

        if (error) {
            console.error('Error fetching customers: ', error);
        }
        else {
            setProjects(data || []);
        }
    };

    return (
        <div>
        <h2>Projects</h2>
            <table>
                <thead>
                <tr>
                    <th>Project ID</th>
                    <th>Customer ID</th>
                    <th>Type</th>
                    <th>Notes</th>
                    <th>Status</th>
                    <th>Due Date</th>
                </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project.project_id}>
                            <td>{project.project_id}</td>
                            <td>{project.customer_id}</td>
                            <td>{project.type}</td>
                            <td>{project.notes}</td>
                            <td>{project.status}</td>
                            <td>{project.due_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
