import type { APIGatewayProxyResult } from 'aws-lambda'
import { promises as fs } from 'fs'
import path from 'path'

const postsDbFile = path.resolve(process.cwd(), 'db', 'posts.json')
const headers = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'POST,OPTIONS',
}

export const readDb = async <T>(dbFile: string): Promise<T[]> => {
	const json = await fs.readFile(dbFile, 'utf8')
	return JSON.parse(json) as T[]
}

export const writeDb = async <T>(dbFile: string, posts: T[]) => {
	await fs.writeFile(dbFile, JSON.stringify(posts, null, 2), 'utf8')
}

export const generateObjectId = (): string => {
	const timestamp = Math.floor(Date.now() / 1000)
		.toString(16)
		.padStart(8, '0')
	const random = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(
		'',
	)
	return `${timestamp}${random}`
}

export const send = <T>(statusCode: number, body: T): APIGatewayProxyResult => ({
	statusCode,
	headers,
	body: JSON.stringify(body),
})
