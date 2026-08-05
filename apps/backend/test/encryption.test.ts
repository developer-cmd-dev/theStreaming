import {test,expect} from 'bun:test'
import { decrypt, encryption } from '../src/controller/agent.controller'



test("encryption",()=>{
   const encrypted= encryption("thisisencrypted")

   console.log(encrypted);
   expect(encrypted).toBeString()
})


test("decrypt",()=>{
    const encrypted= decrypt("8c577824412b31cc224db5e1797d80ee20195ce19e67d91bb0c7994be9c2dab6")
 
    console.log(encrypted);
    expect(encrypted).toBeString()
 })