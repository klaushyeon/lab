'use client'

import React, { FC, useCallback, useEffect, useState } from 'react'
import {
	Container,
	Typography,
	TextField,
	Button,
	Box,
	Paper,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	IconButton,
	Divider,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CreateIcon from '@mui/icons-material/Create'
import axios from 'axios'
import { Post } from './type'

const Board: FC = () => {
	const [posts, setPosts] = useState<Post[]>([])
	const [title, setTitle] = useState<string>('')
	const [content, setContent] = useState<string>('')
	const [viewingPost, setViewingPost] = useState<Post | null>(null)
	const [searchInput, setSearchInput] = useState<string>('')
	const [resetInput, setResetInput] = useState<string>("")
	const [editMode, setEditMode] = useState<boolean>(false)


	const loadPosts = useCallback(async () => {
		try {
			const response = await axios.post<Post[]>('http://localhost:3012/post')
			setPosts(response.data)
		} catch (error) {
			console.error('API load failed', error)
		}
	}, [setPosts])

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadPosts()
	}, [loadPosts])

	const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!title.trim() || !content.trim()) {
			alert('Please enter both a title and content.')
			return
		}

		await axios.post<Post>('http://localhost:3012/addPost', {
			title,
			content,
		})
		loadPosts()
		setTitle('')
		setContent('')
	}

	const handleDelete = async (id: string | undefined, e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		if (!id) {
			return
		}
		if (window.confirm('Are you sure you want to delete this post?')) {
			await axios.post<Post>('http://localhost:3012/delPost', {
				id,
			})
			handleSearch(searchInput)
			if (viewingPost && viewingPost.id === id) {
				setViewingPost(null)
			}
		}
	}

	const handleSearch = async (searchInput: string) => {
		if (!searchInput) {
			alert('Please write search keywords.')
			return
		}
		const response = await axios.post('http://localhost:3012/searchPost', {
			searchInput
		})
		setPosts(response.data)
	}

	const handleReset = async () => {
		setSearchInput("")
		loadPosts()
	}

	const handleUpdate = async () => {
		if ((!viewingPost || !viewingPost.content || !viewingPost.title)) {
			alert('Please enter both a title and content.')
			return
		}

		await axios.post<Post>('http://localhost:3012/editPost', {
			id: viewingPost.id,
			title: viewingPost.title,
			content: viewingPost.content,
		})
		setEditMode(false)
		loadPosts()
	}



	return (
		<Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
			<Typography
				variant="h4"
				align="center"
				component="h1"
				gutterBottom
				sx={{ fontWeight: 'bold', color: '#000000' }}
			>
				LAB
			</Typography>

			<Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#fcfcfc' }}>
				<Typography variant="h6" gutterBottom>
					New Post
				</Typography>
				<Box
					component="form"
					onSubmit={handleCreate}
					sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
				>
					<TextField
						label="Title"
						variant="outlined"
						fullWidth
						value={title}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
					/>
					<TextField
						label="Content"
						variant="outlined"
						fullWidth
						multiline
						rows={3}
						value={content}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
					/>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						startIcon={<CreateIcon />}
						size="large"
					>
						Post
					</Button>
				</Box>
			</Paper>
			<Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: '#ffffff' }}>
				<Typography variant="h6" gutterBottom>
					Search Posts
				</Typography>
				<Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
					<TextField label="Search" variant="outlined" fullWidth value={searchInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)} />
					<Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
						<Button variant="contained" color="primary"
							onClick={() =>
								handleSearch(searchInput)}>
							Search
						</Button>
						<Button variant="contained" color="secondary" onClick={handleReset}>
							Reset
						</Button>
					</Box>
				</Box>
			</Paper>
			<Divider sx={{ my: 3 }} />

			<Box
				sx={{
					display: 'grid',
					gap: 3,
					gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
				}}
			>
				<Box>
					<Typography variant="h6" gutterBottom>
						Posts ({posts.length})
					</Typography>
					<Paper elevation={2}>
						{posts.length === 0 ? (
							<Box
								sx={{
									p: 3,
									textAlign: 'center',
									color: 'text.secondary',
								}}
							>
								No posts have been created yet.
							</Box>
						) : (
							<List sx={{ p: 0 }}>
								{posts.map((post) => (
									<React.Fragment key={post.id}>
										<ListItem disablePadding>
											<ListItemButton
												selected={viewingPost?.id === post.id}
												onClick={() => setViewingPost(post)}
												sx={{
													justifyContent: 'space-between',
													px: 2,
													py: 1.5,
													'&.Mui-selected': {
														borderLeft: '4px solid #1976d2',
													},
												}}
											>
												{/* To-do: 제목이 길어질 경우 ...으로 표시되도록 수정 */}
												<ListItemText
													primary={
														<Typography variant="subtitle1" noWrap>
															{post.title}
														</Typography>
													}
													secondary={post.date}
												/>
												<IconButton
													edge="end"
													aria-label="delete"
													onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
														handleDelete(post.id, e)
													}
													color="error"
												>
													<DeleteIcon />
												</IconButton>
											</ListItemButton>
										</ListItem>
										<Divider />
									</React.Fragment>
								))}
							</List>
						)}
					</Paper>
				</Box>

				<Box>
					<Typography variant="h6" gutterBottom>
						Post Details
					</Typography>
					{viewingPost ? (editMode ? (
						<Paper
							elevation={2}
							sx={{
								p: 3,
								minHeight: '200px',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
							}}
						>
							<Box>
								<TextField
									fullWidth
									variant="outlined"
									type="text"
									value={viewingPost.title}
									onChange={(e) => setViewingPost({ ...viewingPost, title: e.target.value })}
								/>
								<Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 2 }}>
									Posted on: {viewingPost.date}
								</Typography>
								<TextField
									fullWidth
									multiline
									rows={4}
									variant="outlined"
									type="text"
									value={viewingPost.content}
									onChange={(e) => setViewingPost({ ...viewingPost, content: e.target.value })}
								/>
							</Box>
							<Box>
								<Button
									variant="outlined"
									color="inherit"
									size="small"
									onClick={() => 
										handleUpdate()
									}

									sx={{ mt: 3, alignSelf: 'flex-start' }}
								>
									Submit

								</Button>
								<Button
									variant="outlined"
									color="inherit"
									size="small"
									onClick={() => setViewingPost(null)}
									sx={{ mt: 3, alignSelf: 'flex-start' }}
								>
									Close

								</Button>
							</Box>
						</Paper>
					) : (
						<Paper
							elevation={2}
							sx={{
								p: 3,
								minHeight: '200px',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
							}}
						>
							<Box>
								<Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
									{viewingPost.title}
								</Typography>
								<Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 2 }}>
									Posted on: {viewingPost.date}
								</Typography>
								<Typography
									variant="body1"
									sx={{
										whiteSpace: 'pre-wrap',
										lineHeight: 1.6,
									}}
								>
									{viewingPost.content}
								</Typography>
							</Box>
							<Box>
								<Button
									variant="outlined"
									color="inherit"
									size="small"
									onClick={() => setEditMode(true)}
									sx={{ mt: 3, alignSelf: 'flex-start' }}
								>
									Update

								</Button>
								<Button
									variant="outlined"
									color="inherit"
									size="small"
									onClick={() => setViewingPost(null)}
									sx={{ mt: 3, alignSelf: 'flex-start' }}
								>
									Close

								</Button>
							</Box>
						</Paper>
					)
					) : (
						<Paper
							elevation={1}
							sx={{
								p: 3,
								textAlign: 'center',
								color: 'text.secondary',
								border: '1px dashed #ccc',
								bgcolor: '#fafafa',
							}}
						>
							Select a post from the list to view its details here.
						</Paper>
					)}
				</Box>
			</Box>
		</Container>
	)
}

export default Board
