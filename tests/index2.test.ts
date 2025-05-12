
import { findUser } from "../src/db";
import {expect, jest, test} from '@jest/globals';
import fs from 'node:fs/promises';

export interface Users {
      id?: string;
      username: string;
      age: number;
      hobbies: string[]
}


const arr = [{
      id: '550e8400-e29b-41d4-a716-446655440000',
  username: 'John Doe',
  age: 30,
  hobbies: [ 'Football', 'gardening' ]
},
{
      id: '110e8400-e29b-41d4-a716-446655440000',
  username: 'Pedro Pascal',
  age: 22,
  hobbies: [ 'Football', 'Youtube' ]
},
{
      id: '220e8400-e29b-41d4-a716-446655440000',
  username: 'Will Smith',
  age: 333,
  hobbies: [ 'Boxing', 'cooking' ]
},


] 


jest.mock('node:fs/promises')
 
test('get retrun empty array', async () => {
( fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(arr) as never)
 

  const x = await findUser("110e8400-e29b-41d4-a716-446655440000")
  expect(x).toStrictEqual({
      id: '110e8400-e29b-41d4-a716-446655440000',
  username: 'Pedro Pascal',
  age: 22,
  hobbies: [ 'Football', 'Youtube' ]
});
});


