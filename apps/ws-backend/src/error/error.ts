export default class ErrorResponse extends Error {
    data:object
    type:string="error"
    override message: string
    constructor(data:object,message:string){
        super(message)
        this.message=message
        this.data=data
    }
}