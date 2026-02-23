import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";


export const innegest = new Inngest({ id: "interview-platform" });

const syncUser = Inngest.creatFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async ({event}) => {
        await connectDB()

        const {id,email_addresses, first_name, last_name, image_url} = event.data

        const newUser = {
            clerkId:id,
            email:email_addresses[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}`,
            profileImage:image_url
        }

        await User.create(newUser);

        // todo: do sth
    }
)

const deleteUserFromDB = Inngest.creatFunction(
    {id:"delete-user-from-db"},
    {event:"clerk/user.deleted"},
    async ({event}) => {
        await connectDB()

        const {id} = event.data
            await User.deleteOne({clerkId: id });

        //todo: do sth else
    }
)

export const functions = [syncUser, deleteUserFromDB]