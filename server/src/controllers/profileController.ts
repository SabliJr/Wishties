import { Request, Response } from 'express';

const onProfileUpdate = (req: Request, res: Response) => {
  console.log(req.body);

  const cookies = req.cookies;
  if (!cookies?.refreshToken)
    return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;
  console.log(refreshToken);
  
  try {
    
  } catch (error) {
    
  }
};

export { onProfileUpdate }; 
