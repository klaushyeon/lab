import { readDb, generateObjectId, send, writeDb } from '@/common/serverCommon'
import { Post } from '@/type/post'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import path from 'path'

const postsDbFile = path.resolve(process.cwd(), 'db', 'posts.json')

export const addPost = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		if (!event.body) {
			return send(400, { message: 'Request body is required.' })
		}

		const body = JSON.parse(event.body)
		const title = String(body.title).trim()
		const content = String(body.content).trim()

		if (!title || !content) {
			return send(400, { message: 'title and content are required.' })
		}

		const posts: Post[] = await readDb(postsDbFile)

		const newPost: Post = {
			id: generateObjectId(),
			title,
			content,
			date: new Date().toISOString().split('T')[0],
		}

		posts.unshift(newPost)
		await writeDb(postsDbFile, posts)
		return send(201, newPost)
	} catch (error) {
		console.error(error)
		return send(500, { message: 'Internal server error.' })
	}
}
