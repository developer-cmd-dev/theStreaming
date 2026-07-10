import {z} from 'zod'

export const UsernameSearchQuerySchema = z.object({
    query:z.string(),
    limit:z.number()
})


export type UsernameSearchQuery = z.infer<typeof UsernameSearchQuerySchema> 