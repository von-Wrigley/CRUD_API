import http from 'http';
import { URL } from 'url';
import { validate as isUUID } from 'uuid';
import { createUser, deleteUser, findUser, getUsers, putUser } from './db';
import  getPostBodyAsync  from './methods'


import { Users } from './db.js';

const serverSideError = async(res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; }, err: unknown)=>{
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ 
             message: `We have a problem. Error: ${err}`,
        }))
}

const PORT = parseInt(process.env.WORKER_PORT || '4000');

const server = http.createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);
      const userId = pathname.split('/')[2];

   
    
      if (pathname.trim() === '/users' && (pathname.trim()).length===6 && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(await getUsers()));
    }
    
    if ( pathname.startsWith('/users/') && req.method === 'GET') {
          const userId = pathname.split('/')[2];
      try {
        if (!isUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
             message: 'Invalid id (must be UUID)' 
        }));
      }
      
  
      if (! await findUser(userId as string)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'User not found' }));
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      console.log(await findUser(userId as string))
      return res.end(JSON.stringify(await findUser(userId as string)));
        
      } catch (error) {
       await serverSideError(res, error)
      }    
    }





      if (pathname.length > 6 && pathname.trim() === '/users'   && req.method === 'PUT') {
                  const body  = (await getPostBodyAsync(req)) as Users;
                     if (!isUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          message: 'Invalid id (must be UUID)' 
        }));
      }

      if(!await findUser(userId as string)){
         res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          message: 'There is no user with given id' 
        }))
      }
     

       if(!body.username || !body.age || !body.hobbies ){
           res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          message: 'You should add required fields: username, age, hobbies' 
        }))
      }




      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(await putUser(body, userId as string)));
    }



      if (pathname.length > 6 && req.method === 'DELETE') {

              if (!isUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          message: 'Invalid id (must be UUID)' 
        }));
      }
          
             if(!await findUser(userId as string)){
         res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          message: 'There is no user with given id' 
        }))
      }
  



      res.writeHead(204, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(await deleteUser(userId as string))
    );
    
    }




       if (req.method === 'POST') {
          const body = (await getPostBodyAsync(req)) as Users;

      if(!body.username || !body.age || !body.hobbies ){
           res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          message: 'You should add required fields: username, age, hobbies' 
        }))
      }

      res.writeHead(201, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(await createUser(body)));
    }

 
      
    
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint not found. Type existing endpoint' }));
    
  } catch (error) {
    console.error('Request error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`Worker ${process.pid} listening on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error: ', err);
  process.exit(1);
});