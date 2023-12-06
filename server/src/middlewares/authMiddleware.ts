import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const validate = (statusCodes: number) => { 
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
      if (!errors.isEmpty()) {
        return res.status(statusCodes).json({
          errors: errors.array()
        });
      }
    next();
  };
}

export { validate };