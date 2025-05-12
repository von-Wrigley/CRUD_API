
import { getUsers } from "../src/db";
import { expect, jest, test} from '@jest/globals';
import fs from 'node:fs/promises';

const arr:never[] = []
jest.mock('node:fs/promises')
 


test('get retrun empty array', async () => {
                
 ( fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(arr) as never)
  const x = await getUsers()
  expect(x).toStrictEqual([]);
});


