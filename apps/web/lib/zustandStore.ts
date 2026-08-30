import { PublicUser } from '@repo/zod/schema';
import {create} from 'zustand';

type UserAuthState = {
    userPayload: PublicUser|null;  // This holds the current count
    setUserPaylod: (data:PublicUser) => void;  // Action to increase the count
};

export const userUserAuth = create<UserAuthState>(set => ({
  userPayload:null,
  setUserPaylod:(data:PublicUser)=>set(state=>({userPayload:data}))
}));
