import {expect,test} from "bun:test"
import { axiosHandler } from "."





test("axios test",async()=>{
try {
    
    const response = await axiosHandler<{name:string,health:string}>(
        {
            url:"http://localhost:3000/ai/v1/health",
            method:'GET'
        }
    )

    console.log(response)

    expect(response).pass("Failed")
} catch (error) {
    console.log(error)
}
        

})