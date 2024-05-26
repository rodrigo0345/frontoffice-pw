import JobRepository from "../repositories/JobRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
export default class UserService {
    userRepository = new UserRepository();
    jobsRepository = new JobRepository();
    constructor() { }
    createUser(user) {
        if (user.email === "" || user.password === "") {
            throw new Error("Email and Password are required.");
        }
        // verifica se já existe um usuário com o mesmo email
        const userExists = this.userRepository.find({ email: user.email });
        if (userExists) {
            throw new Error("User already exists.");
        }
        return this.userRepository.create(user);
    }
    findUser(query) {
        return this.userRepository.find(query);
    }
    updateUser(id, data) {
        // check if the email is already in use
        const user = this.userRepository.find({ email: data.email });
        if (user && user.id !== id) {
            throw new Error("Email already in use.");
        }
        return this.userRepository.update(id, data);
    }
    deleteUser(id) {
        return this.userRepository.delete(id);
    }
    listUsers(query) {
        return this.userRepository.all(query);
    }
    // ---- user's Job ----
    createUserJob(job) {
        return this.jobsRepository.create(job);
    }
    updateUserJob(id, data) {
        return this.jobsRepository.update(id, data);
    }
    deleteUserJob(id) {
        return this.jobsRepository.delete(id);
    }
    getAllAvailableJobs(jobQueryModel) {
        return this.jobsRepository.all(jobQueryModel);
    }
    getUserJob(id) {
        return this.jobsRepository.find({ id });
    }
    addJobToUser(userId, jobId) {
        const user = this.userRepository.find({ id: userId });
        if (!user) {
            throw new Error("User not found.");
        }
        const job = this.jobsRepository.find({ id: jobId });
        if (!job) {
            throw new Error("Job not found.");
        }
        user.jobId = jobId;
        return this.userRepository.update(userId, user);
    }
    async loginWithGoogle(window, allowNewUser = true) {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        if (!user)
            return null;
        if (!user.email)
            throw new Error("User email not found.");
        // Check if the user is already in the databased
        // If not, add It
        // If yes, return the user
        const userExists = this.userRepository.find({ email: user.email });
        if (userExists) {
            if (userExists.role === "admin") {
                // send to the admin page, TODO alterar o link para o correto
                window.location.href = "/admin";
                return userExists;
            }
            return userExists;
        }
        if (!allowNewUser) {
            throw new Error("User not found.");
        }
        const randomPassword = Math.random().toString(36).substring(7);
        const newUser = {
            id: 0,
            email: user.email,
            name: user.displayName || "",
            role: "worker",
            jobId: 0,
            isDeleted: false,
            password: randomPassword,
            photoUrl: user.photoURL || "",
        };
        return this.userRepository.create(newUser);
    }
}
export { UserService };
//# sourceMappingURL=UserService.js.map