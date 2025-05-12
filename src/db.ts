import fs from 'node:fs/promises'
import { v4 as uuidv4 } from 'uuid';



export interface Users {
      id?: string;
      username: string;
      age: number;
      hobbies: string[]
}


export const getUsers = async()=> {
  try {
    const users = await fs.readFile('src/dataUsers.json', "utf-8")
      return JSON.parse(users)
    
  } catch (error) {
     console.log(error)
    
  }
      
}


export const findUser = async(userId: string)=> {
  try {
    const users = await fs.readFile('src/dataUsers.json', "utf-8")
   const usersArray = JSON.parse(users);
   
      
    const myUser  = usersArray.find((u: { id: string; }) => u.id === userId);

     return myUser
  } catch (error) {
     console.log(error)
  }
      
}


export const createUser = async(body:Users)=> {
  try {
     const users = await fs.readFile('src/dataUsers.json', "utf-8")
     const usersArray = JSON.parse(users);
      // let hob = []
      // hob.push(body.hobbies)
      const newID = uuidv4()
    
      usersArray.push(
{
    id: newID,
    username: body.username ,
    age: body.age,
      hobbies: body.hobbies
  }
        )

    await fs.writeFile('src/dataUsers.json', JSON.stringify(usersArray, null, 2), "utf-8")
    const x = await findUser(newID)
     return x
  } catch (error) {
     console.log(error)
  }
      
}

export const putUser = async(body:Users, userId:string)=> {
  try {
     const users = await fs.readFile('src/dataUsers.json', "utf-8")
     const usersArray = JSON.parse(users);
      // let hob = []
      // hob.push(body.hobbies)
     const usersArray2=  usersArray.map((obj: { id: string; })=> obj.id === userId ? {...obj,   username: body.username,
                   age: body.age,
                    hobbies: body.hobbies,} : obj)
    


    await fs.writeFile('src/dataUsers.json', JSON.stringify(usersArray2, null, 2), "utf-8")
    const x = await findUser(userId)
     return x
  } catch (error) {
     console.log(error)
  }
      
}

export const deleteUser =async (id:string)=> {

  try {
    const users = await fs.readFile('src/dataUsers.json', "utf-8")
     const usersArray = JSON.parse(users);
 
    const deletedUser =await usersArray.findIndex((x: { id: string; })=> x.id === id)
     
    await  usersArray.splice(deletedUser, 1)
    await fs.writeFile('src/dataUsers.json', JSON.stringify(usersArray, null, 2), "utf-8")
 return {
  message: "The record is found and deleted"
 }
    
  } catch (error) {
         console.log(error)
  }
  
}