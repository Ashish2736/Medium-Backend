import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import {signupInput} from "@tdem6842/medium-common";


export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();


userRouter.post("/signup",async(c)=>{
    const body = await c.req.json();

    const {success} = signupInput.safeParse(body);
   if(!success){
    return c.json({
        msg:"Inputs not correct"
    })

   }
     const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())

try{
const user = await prisma.user.create({
        data:{
            username: body.username,
            password: body.password,
             }
      })

      const jwt = await sign({
        id: user.id
      },c.env.JWT_SECRET)

    return c.text(jwt)
}catch(e){
    return c.text("User cannot be created")
}
      
})





userRouter.post("/signin", async(c)=>{
    const body = await c.req.json();
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
try{
const user = await prisma.user.findFirst({
        where:{
            username : body.username,
            password: body.passsword,
        }
     })
     if(!user){
            return c.text("Invalid credentials ")
        }

     const jwt = await sign({
        id: user.id
     },c.env.JWT_SECRET)
      return c.text(jwt)
}catch(e){
    return c.text("Something went wrong")
}
     
})