export const INITIAL_DATA = {
    admin: {
        username: 'admin',
        password: 'admin123' // In a real app, this would be hashed
    },
    tenants: [
        {
            id: 1,
            username: 'tenant1',
            password: 'password123',
            name: 'John Doe',
            building: 'Building A',
            apartment: '101',
            email: 'john@example.com'
        },
        {
            id: 2,
            username: 'tenant2',
            password: 'password123',
            name: 'Jane Smith',
            building: 'Building B',
            apartment: '205',
            email: 'jane@example.com'
        }
    ],
    staff: [
        {
            id: 1,
            name: 'Mike Cleaner',
            role: 'cleaner',
            building: 'Building A',
            salary: 1500,
            paid: false
        },
        {
            id: 2,
            name: 'Steve Driver',
            role: 'driver',
            building: 'All',
            salary: 2000,
            paid: true
        }
    ],
    complaints: [
        {
            id: 1,
            tenantId: 1,
            type: 'Plumbing',
            description: 'Leaking faucet in kitchen',
            status: 'pending',
            date: '2023-10-25'
        }
    ]
};
