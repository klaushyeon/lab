import { readDb, send } from '@/common/serverCommon'
import { Post } from '@/type/post'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import path from 'path'

const postsDbFile = path.resolve(process.cwd(), 'db', 'posts.json')

export const searchPost = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.body) {
			return send(400, { message: 'Request body is required.' })
		}
        const posts: Post[] = await readDb(postsDbFile)
        const res : Post[] = []
        const body = JSON.parse(event.body)
		const searchInput = String(body.searchInput).trim()
        for(const target of posts){
            const regex = new RegExp(searchInput)
            if (regex.test(target.title)){
                res.push(target)
            }
        }
        return send(200, res)

    } catch (error) {
        console.error(error)
        return send(500, { message: 'Failed to load posts.' })
    }
    
}
