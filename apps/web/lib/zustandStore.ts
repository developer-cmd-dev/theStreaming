import { PublicUser } from '@repo/zod/schema';
import {create} from 'zustand';

type UserAuthState = {
    userPayload: PublicUser|null;  // This holds the current count
    setUserPaylod: (data:PublicUser) => void;  // Action to increase the count
    logout:()=>void;
};

export const useUserAuth = create<UserAuthState>(set => ({
  userPayload:null,
  setUserPaylod:(data:PublicUser)=>set(state=>({userPayload:data})),
  logout:()=>set(state=>({userPayload:null}))
}));
