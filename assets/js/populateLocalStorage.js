import InitiativeService from "/frontoffice/assets/LocalStorage/services/InitiativeService.js";
import UserService from "/frontoffice/assets/LocalStorage/services/UserService.js";

const initializeLocalStorage = () => {
    const initiativeService = new InitiativeService();
    const userService = new UserService();

    const initiatives = [
        {
            id: 1,
            sugestionId: 1,
            local: "City Park",
            status: "approved",
            createdOn: new Date("2023-01-01"),
            date: new Date("2023-06-15"),
            duration: 120,
            maxParticipants: 50,
            minParticipants: 10,
            eventType: "food_safety",
            isDeleted: false,
        },
        {
            id: 2,
            sugestionId: 2,
            local: "Community Center",
            status: "approved",
            createdOn: new Date("2023-02-10"),
            date: new Date("2023-07-20"),
            duration: 90,
            maxParticipants: 30,
            minParticipants: 5,
            eventType: "healthy_diets",
            isDeleted: false,
        },
        {
            id: 3,
            sugestionId: 3,
            local: "Downtown Plaza",
            status: "approved",
            createdOn: new Date("2023-03-15"),
            date: new Date("2023-05-25"),
            duration: 60,
            maxParticipants: 100,
            minParticipants: 20,
            eventType: "zero_waste",
            isDeleted: false,
        },
        {
            id: 4,
            sugestionId: 4,
            local: "School Auditorium",
            status: "approved",
            createdOn: new Date("2023-04-05"),
            date: new Date("2023-08-10"),
            duration: 150,
            maxParticipants: 200,
            minParticipants: 50,
            eventType: "food_rescue",
            isDeleted: false,
        },
    ];

    const users = [
        {
            id: 1,
            name: "John Doe",
            role: "worker",
            email: "john@example.com",
            password: "password123",
            photoUrl: "assets/images/user1.jpg",
            isDeleted: false,
            jobId: 1,
        },
        {
            id: 2,
            name: "Jane Smith",
            role: "admin",
            email: "jane@example.com",
            password: "password456",
            photoUrl: "assets/images/user2.jpg",
            isDeleted: false,
            jobId: 2,
        },
        {
            id: 3,
            name: "Emily Johnson",
            role: "worker",
            email: "emily@example.com",
            password: "password789",
            photoUrl: "assets/images/user3.jpg",
            isDeleted: false,
            jobId: 3,
        },
    ];

    console.log("Populating initiatives...");
    initiatives.forEach((initiative) => {
        try {
            initiativeService.createInitiative(initiative);
            console.log(`Created initiative: ${initiative.id}`);
        } catch (error) {
            console.error(`Error creating initiative ${initiative.id}: `, error);
        }
    });

    console.log("Populating users...");
    users.forEach((user) => {
        try {
            userService.createUser(user);
            console.log(`Created user: ${user.email}`);
        } catch (error) {
            return;
            //console.log(`Error creating user ${user.email}: `, error);
        }
    });
};

window.onload = initializeLocalStorage({});
