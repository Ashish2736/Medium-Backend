import {createBlogInput,updateBlogInput} from "@tdem6842/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";



export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string;
        JWT_SECRET: string
    },
    Variables:{
        userId: string
    }
}>();



blogRouter.use("/*",async(c,next)=>{
    const authHeader = c.req.header("authorization")|| "";
    try{
 const user = await verify(authHeader,c.env.JWT_SECRET)
    if(user){
        c.set("userId", user.id as string)
      await next();
    }else{
        return c.text("Invalid token or user")
    }
    }catch(e){
      console.log(e);
        return c.text("You are not logged in yet")
    }
   
})



blogRouter.post('/', async(c) => {
    const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body);
       if(!success){
        return c.json({
            msg:"Inputs not correct"
        })
    
       }
    const authorId = c.get("userId");
   const prisma =  new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const blog = await prisma.blog.create({
    data:{
        title: body.title,
        content: body.content,
        authorId: Number(authorId)
    }
  })

  return c.json({
    blog:blog.id
  })
})



blogRouter.put('/', async(c) => {
    const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body);
       if(!success){
        return c.json({
            msg:"Inputs not correct"
        })
    
       }
   const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const blog = await prisma.blog.update({
    where:{
         id: body.id
    },
    data:{
        title: body.title,
        content: body.content,
    }
  })
  return c.json({
    blog:blog.id
  })
})


blogRouter.get('/bulk', async(c) => {
   const prisma =new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const blog = await prisma.blog.findMany({
  })
  return c.json({
    blog
  })
})





blogRouter.get('/:id', async(c) => {
    const id = c.req.param("id");
   const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
try{
const blog = await prisma.blog.findFirst({
    where:{
        id:Number(id),
    }
})
return c.json({
    id:blog
})

}catch(e){
    c.json({
        message:"Error while fetching the blog"
    })
}

})



