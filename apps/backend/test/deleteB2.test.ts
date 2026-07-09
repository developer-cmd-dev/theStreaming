import {expect, test} from "bun:test"
import { deleteStreamDataB2 } from "../src/lib/delete_hls_b2"



test("delete-stream-b2",async()=>{

    const streaId = "3b560b13-1db5-4b79-adab-489381ed9f90";
    const result= await deleteStreamDataB2(streaId)

    expect(result).toBe(true)

})