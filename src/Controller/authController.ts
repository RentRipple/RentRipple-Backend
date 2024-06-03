import { Request, Response, NextFunction } from 'express';
import { BadRequest, InternalServerError, Unauthorized } from 'http-errors';
import { signedAccessToken, signedRefreshToken, verifyRefreshToken } from '../Helpers/generateJWTTokens';
import JWT from 'jsonwebtoken';
import { User } from '../Models/user.model';
import { redisClient } from '..';
import { loginSchema, registerationSchema } from '../Helpers/validationSchema';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { userName, email, password } = req.body;
          const result = registerationSchema.validate({
            userName,
            email,
            password,
          });
          if (result.error) {
            throw BadRequest(result.error.message);
          }
          const doesExist = await User.findOne({ email: result.value.email });
          if (doesExist) {
            throw BadRequest(
              `User with this email already exists: ${result.value.email}`,
            );
          }
          const user = new User(result.value);
          const savedUser = await user.save();
          const accessToken = await signedAccessToken(savedUser.id);
          const refreshToken = await signedRefreshToken(savedUser.id);
          res.json({ accessToken: accessToken, refreshToken: refreshToken });
        } catch (error: any) {
          if (error.isJoi === true) {
            error.status = 422;
          }
          next(error);
        }
     
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { error, value } = loginSchema.validate(req.body);
          if (error) {
            throw BadRequest("Invalid email or password");
          }
    
          const user = await User.findOne({ email: value.email });
          if (!user) {
            throw BadRequest("Invalid email or password");
          }
    
          const isMatch = await user.checkPassword(value.password);
          if (!isMatch) {
            throw BadRequest("Invalid email or password");
          }
    
          const accessToken = await signedAccessToken(user.id);
          const refreshToken = await signedRefreshToken(user.id);
          res.json({ accessToken, refreshToken });
        } catch (error: any) {
          if (error.isJoi) {
            return next(BadRequest("Invalid email or password"));
          }
          next(error);
        }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw BadRequest();
      }
      const userId: string = await verifyRefreshToken(refreshToken, next);
      const accessToken = await signedAccessToken(userId);
      const newRefreshToken = await signedRefreshToken(userId);


      res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error: any) {
      next(error);
    }
}

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
     const { refreshToken } = req.body;
     if(!refreshToken){
       throw BadRequest("Invalid request");
     }
      const userId = await verifyRefreshToken(refreshToken,next);
      await redisClient.del(userId);
      
      res.sendStatus(204);

     }
     catch(error: any){
        next(error);
      }
}
