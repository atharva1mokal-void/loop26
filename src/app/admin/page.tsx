import { getProjects } from '@/lib/storage';
import AdminClient from './AdminClient';

export default async function AdminPage() {
    const projects = await getProjects();

    return (
        <AdminClient initialProjects={projects} />
    );
}
