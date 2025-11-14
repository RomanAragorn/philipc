'use client';

import { useParams } from 'next/navigation';

const UserPage: React.FC = () => {
    const { username } = useParams();

    return <h1>Profile: {username}</h1>;
};

export default UserPage;
