import {z} from 'zod'

export const UsernameSearchQuerySchema = z.object({
    query:z.string(),
    limit:z.string()
})


export type UsernameSearchQuery = z.infer<typeof UsernameSearchQuerySchema> 