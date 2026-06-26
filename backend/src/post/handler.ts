import { readDb, send } from '@/common/serverCommon'
import { Post } from '@/type/post'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import path from 'path'

const postsDbFile = path.resolve(process.cwd(), 'db', 'posts.json')

export const post = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const posts: Post[] = await readDb(postsDbFile)

		return send(200, posts)
	} catch (error) {
		console.error(error)
		return send(500, { message: 'Failed to load posts.' })
	}
}
