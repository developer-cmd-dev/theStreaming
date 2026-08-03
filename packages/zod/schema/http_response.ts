export type HttpResponse<T=any> = {
    success:boolean;
    message:string;
    status:number;
    data:T;
}