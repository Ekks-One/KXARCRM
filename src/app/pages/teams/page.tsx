'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/app/server/supabaseClient';

interface TeamMember {
    id: string;
    full_name: string;
    email: string | null;
    role: string | null;
    status: 'active' | 'inactive';
    pending_tasks: number;
    completed_tasks: number;
    in_progress_tasks: number;
    performance: number;
}

export default function TeamPage() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        // Dummy data for testing
    //     { id: 1, name: 'Sarah Johnson', role: 'Manager', initials: 'SJ', status: 'active', completed_tasks: 34, in_progress_tasks: 5, performance: 92 },
    //     { id: 2, name: 'Mike Williams', role: 'Developer', initials: 'MW', status: 'active', completed_tasks: 28, in_progress_tasks: 8, performance: 85 },
    //     { id: 3, name: 'Emily Davis', role: 'Designer', initials: 'ED', status: 'active', completed_tasks: 31, in_progress_tasks: 4, performance: 88 },
    //     { id: 4, name: 'David Brown', role: 'Developer', initials: 'DB', status: 'active', completed_tasks: 22, in_progress_tasks: 6, performance: 78 },
    //     { id: 5, name: 'Lisa Anderson', role: 'Manager', initials: 'LA', status: 'inactive', completed_tasks: 42, in_progress_tasks: 3, performance: 95 },
    ]);

    // Fetch team members from Supabase
    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    };

    //Fetch team members and their task stats
    const fetchTeamMembers = async () => {
        // Fetch profiles to get team members
        const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, email, role, status, created_at')
            .order('created_at', { ascending: true });

        if (profilesError) {
            console.error('Error fetching team members:', profilesError);
            return;
        }

        // Fetch tasks to calculate stats
        const {data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('id, status, assignee_profile_id');

        if (tasksError) {
            console.error('Error fetching tasks:', tasksError);
            return;
        }

        // Map profiles to team members, calculating task stats
        const members: TeamMember[] = (profilesData || []).map((profile: any) => {
            const memberTasks = (tasksData || []).filter(
                (task: any) => task.assignee_profile_id === profile.id
            );

            const pending = memberTasks.filter(
                (task: any) => task.status === 'pending'
            ).length;

            const completed = memberTasks.filter(
                (task: any) => task.status === 'completed'
            ).length;

            const inProgress = memberTasks.filter(
                (task: any) => task.status === 'in-progress'
            ).length;

            const totalTasks = memberTasks.length;

            const performance = totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100);

            return {
                id: profile.id,
                full_name: profile.full_name ?? 'Unnamed User',
                email: profile.email ?? null,
                role: profile.role ?? 'Team Member',
                status: profile.status === 'inactive' ? 'inactive' : 'active',
                pending_tasks: pending,
                completed_tasks: completed,
                in_progress_tasks: inProgress,
                performance,
            };
        });

        setTeamMembers(members);
    };

    // Calculate total stats
    const totalMembers = teamMembers.length;
    const activeMembers = teamMembers.filter(m => m.status === 'active').length;
    const totalCompleted = teamMembers.reduce((sum, m) => sum + m.completed_tasks, 0);
    const totalInProgress = teamMembers.reduce((sum, m) => sum + m.in_progress_tasks, 0);
    const totalPending = teamMembers.reduce((sum, m) => sum + m.pending_tasks, 0);
    const avgPerformance = teamMembers.length > 0? Math.round(teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length): 0;


    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-green-500' : 'bg-gray-400';
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'manager':
                return 'bg-gray-100';
            case 'developer':
                return 'bg-green-100';
            case 'designer':
                return 'bg-yellow-100';
            default:
                return 'bg-gray-100';
        }
    };

    const handleDeleteMember = async (id: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({ status: 'inactive' })
            .eq('id', id);

        if (error) {
            console.error('Error deleting team member:', error);
            alert('Error deleting team member: ' + error.message);
        } else {
            setTeamMembers((prev) =>
                prev.map((member) =>
                    member.id === id ? { ...member, status: 'inactive' } : member
                )            
            );
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Our Team</CardTitle>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                        <Card className="bg-white">
                            <CardContent className="p-6">
                                <div className="text-sm text-gray-500 mb-1">Team Members</div>
                                <div className="text-2xl font-medium">{totalMembers}</div>
                                <div className="text-xs text-gray-400 mt-1">{activeMembers} active</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white">
                            <CardContent className="p-6">
                                <div className="text-sm text-gray-500 mb-1">Completed</div>
                                <div className="text-2xl font-medium">{totalCompleted}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white">
                            <CardContent className="p-6">
                                <div className="text-sm text-gray-500 mb-1">In Progress</div>
                                <div className="text-2xl font-medium">{totalInProgress}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white">
                            <CardContent className="p-6">
                                <div className="text-sm text-gray-500 mb-1">Pending</div>
                                <div className="text-2xl font-medium">{totalPending}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white">
                            <CardContent className="p-6">
                                <div className="text-sm text-gray-500 mb-1">Performance</div>
                                <div className="text-2xl font-medium">{avgPerformance}%</div>
                            </CardContent>
                        </Card>
                    </div>
                </CardHeader>

                <CardContent>
                    <h3 className="text-lg font-medium mb-4">Team Members</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {teamMembers.map((member) => (
                            <Card key={member.id} className="bg-white">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-full ${getRoleColor(member.role || 'Team Member')} flex items-center justify-center text-gray-700 font-medium`}>
                                            {getInitials(member.full_name)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-gray-900">{member.full_name}</h4>
                                                <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                                            </div>
                                            <p className="text-sm text-gray-500">{member.role || 'Team Member'}</p>
                                            {member.email && (
                                                <p className="text-xs text-gray-400 mt-1">{member.email}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Completed</span>
                                            <span className="font-medium">{member.completed_tasks}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">In Progress</span>
                                            <span className="font-medium">{member.in_progress_tasks}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Pending</span>
                                            <span className="font-medium">{member.pending_tasks}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Performance</span>
                                            <span className="font-medium">{member.performance}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
