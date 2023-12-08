import { UserRolesType } from "@/lib/interfaces/user.interface";

export async function getUserByEmail({
  email,
}: {
  email: string | undefined | null;
}) {
  console.log(email);
  try {
    return null;
  } catch (error: any) {
    throw new Error(`Error getting User by Email: ${error.message}`);
  }
}

export async function authUser({
  email,
  password,
  role = "user",
}: {
  email: string;
  password: string;
  role?: UserRolesType;
}) {
  try {
    // connectDB();

    // const user = await User.findOne({ email });
    // const userparent = await Parent.findOne({ email });
    // // const userparent = false;
    // if (!user && !userparent) {
    //   console.log("No email found");
    //   throw new Error("Email does not exist!");
    // } else if (!user) {
    //   console.log("User is parent");
    //   return {
    //     ...userparent._doc,
    //     _id: userparent._id.toString(),
    //     children: userparent?.children.map((s: any) => {
    //       return { ...s, _id: s._id.toString() };
    //     }),
    //   };
    // } else if (user) {
    //   console.log("User is not parent");
    //   return { ...user._doc, _id: user._id.toString() };
    // }
    return null;
  } catch (error: any) {
    throw new Error(`Error getting User by Email: ${error.message}`);
  }
}
