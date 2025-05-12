import { IncomingMessage } from "http";

  const getPostBodyAsync = (req: IncomingMessage) => {
  
    return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        body = body ? JSON.parse(body) : {};

        resolve(body);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default getPostBodyAsync