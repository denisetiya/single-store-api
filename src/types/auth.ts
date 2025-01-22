
import { z } from "zod";



const UserDetailsSchema = z.object({
    username : z.string().min(3, "Username must be at least 3 characters long"),
    fullName : z.string().min(3, "Full name must be at least 3 characters long"),
    phoneNumber : z.string().optional(),
    profileImage : z.string().optional()
})

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
}).extend({
  userDetail: UserDetailsSchema,
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});






type iLogin = z.infer<typeof loginSchema>;
type iUser = z.infer<typeof UserSchema>;
type iUserDetails = z.infer<typeof UserDetailsSchema>;

export { UserSchema, UserDetailsSchema, loginSchema };
export type { iUser, iUserDetails, iLogin };
