import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import { nanoid } from 'nanoid'

import axios from '/utils/rest';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';


import { Input, Text, Container, Space, Card, Group, Badge, Button, useMantineTheme, Loader, Grid, Alert } from '@mantine/core';
import { Send, File, Upload, X, Check } from 'tabler-icons-react';

export default function Task() {
	const router = useRouter()
	const { id, day_id, task_id } = router.query
	const [taskLoading, setTaskLoading] = useState(false);
	const [chatLoading, setChatLoading] = useState(false);
	const [taskError, setTaskError] = useState(false);
	const [day, setDay] = useState([]);
	const [course, setCourse] = useState([]);
	const [chatError, setChatError] = useState([]);
	const [task, setTask] = useState([]);
	const [chat, setChat] = useState([]);

	const [acceptLoading, setAcceptLoading] = useState(false);

	const [message, setMessage] = useState('');
	const [files, setFiles] = useState([]);

	const theme = useMantineTheme();

	const secondaryColor = theme.colorScheme === 'dark'
		? theme.colors.dark[1]
		: theme.colors.gray[7];

	const setAccepted = (status) => {
		setAcceptLoading(true);
		axios.post(`/main/courses/${id}/days/${day_id}/tasks/${task_id}/accept`)
			.then(res => {
				task.accepted = true;
				setTask(task);
			})
			.catch(error => {

			})
			.finally(() => {
				setAcceptLoading(false);
			})
	}

	const getIconColor = (status, theme) => {
		return status.accepted
			? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
			: status.rejected
				? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
				: theme.colorScheme === 'dark'
					? theme.colors.dark[0]
					: theme.colors.gray[7];
	}

	const FileUploadIcon = ({
		status,
		...props
	}) => {
		if (status.accepted) {
			return <Upload {...props} />;
		}

		if (status.rejected) {
			return <X {...props} />;
		}

		return <File {...props} />;
	}

	const dropzoneChildren = (status, theme) => (
		<Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
			<FileUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />
			<div>
				<Text size="xl" inline>
					Переместите файлы сюда
				</Text>
				<Text size="sm" color="dimmed" inline mt={7}>
					Файл размером не более 5 мегабайт
				</Text>
			</div>
		</Group>
	);

	const sendMessage = (e) => {
		e.preventDefault();
		const body = new FormData();
		body.append('message', e.target.message.value);
		if (files) {
			for (let index in files) {
				console.log(files[index].path);
				body.append(`file_${index}`, files[index], `task_${nanoid()}.${files[index].path.split('.')[files[index].path.split('.').length - 1]}`);
			}
		}
		axios.post(`/main/courses/${id}/days/${day_id}/tasks/${task_id}/answer`, body)
			.then(res => {
				e.target.reset();
				showNotification({
					title: 'Сообщение отправлено',
					message: 'Скоро эксперты проверят выполнение задания и дадут вам ответ',
					autoClose: 3500,
					color: 'green',
					icon: <Check size={18} />,
				});
				setFiles([]);
				setChat([...chat, res.data]);
			})
			.catch(error => {

			})
			.finally(() => {

			})
	}

	useEffect(() => {
		if (id && day_id && task_id) {
			setTaskLoading(true);
			setChatLoading(true);
			axios.get(`/main/courses/${id}`)
				.then(res => {
					if (res.status === 200) {
						if (res.data.length === 1) {
							setCourse(res.data[0]);
						}
					}
				})
				.catch(error => {
					console.log(error);
				})
			axios.get(`/main/courses/${id}/days/${day_id}`)
				.then(res => {
					if (res.status === 200) {
						setDay(res.data);
					}
				})
				.catch(error => {
					console.log(error);
				})
			axios.get(`/main/courses/${id}/days/${day_id}/tasks/${task_id}`)
				.then(res => {
					if (res.status === 200) {
						setTask(res.data);
					} else {
						setTaskError('Ошибка получения задания, пожалуйста, попробуйте позже');
					}
				})
				.catch(error => {
					console.log(error);
					setTaskError('Ошибка получения задания, пожалуйста, попробуйте позже');
				})
				.finally(() => {
					setTaskLoading(false);
				})
			axios.get(`/main/courses/${id}/days/${day_id}/tasks/${task_id}/chat`)
				.then(res => {
					if (res.status === 200) {
						setChat(res.data);
					} else {
						setChatError('Ошибка получения чата, пожалуйста, попробуйте позже');
					}
				})
				.catch(error => {
					console.log(error);
					setChatError('Ошибка получения чата, пожалуйста, попробуйте позже');
				})
				.finally(() => {
					setChatLoading(false);
				})
		}
	}, [id, day_id, task_id])

	return (
		<>
			<Head>
				<title>Инкубатор талантов</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Container>
				<Space h="xl" />
				<Card p="lg">
					{taskLoading && <Loader color="orange" variant="bars" />}
					<Card.Section>
						{task.image ?
							<Image src={'/' + task.image} width={1200} height={550} alt="Инкубатор талантов" /> :
							day.image ? <Image src={'/' + day.image} width={1200} height={550} alt="Инкубатор талантов" /> :
								course.image ? <Image src={'/' + course.image} width={1200} height={550} alt="Инкубатор талантов" /> :
									<></>
						}
					</Card.Section>

					<Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
						<Text weight={700} color="orange" size="xl">{task.name}</Text>
					</Group>

					<Text size="sm" weight={500} style={{ color: secondaryColor, lineHeight: 1.5 }}
						dangerouslySetInnerHTML={{ __html: task.description }}>
					</Text>

					<Space h="lg" />
					{task.accepted
						?
						<>
							<Text weight={500} color="blue">
								В файлах ниже содержатся материалы для работы, скачайте их все и изучите
							</Text>
							<Space h="sm" />
							{task.files.map((file, index) => {
								return <Text key={file} variant="link" component="a" href={`/${file}`}>
									Скачать файл {index + 1}
								</Text>
							})}
							<Space h="md" />
							{chatLoading && <Loader color="orange" variant="bars" />}
							<Text color="red" weight={500}>
								{chatError}
							</Text>
							<Space h="md" />
							{!chatLoading && <Text color="orange" weight={500} size="lg">
								Общение с экспертом
							</Text>}
							{!chatLoading && <>
								<div style={{ width: '100%', minHeight: '100px', backgroundColor: '#eee', border: '2px solid #ddd', borderRadius: '15px', padding: '20px' }}>
									{chat.map(message => {
										return <div style={{ backgroundColor: message.answer_id ? '#37c8b855' : '#f7670755', borderRadius: '15px', width: '70%', marginTop: '5px', padding: '5px' }} key={message}>
											<Text size="sm">{message.answer_id ? 'Эксперт' : 'Вы'}:</Text>
											<Text size="md" weight={500}>{message.message}</Text>
											{message.files.map((file, index) => {
												return <>
													<Text key={file} variant="link" component="a" size="sm" href={`/${file}`}>
														Скачать файл {index + 1}
													</Text>
													<Space h="sm" />
												</>
											})}
										</div>
									})}
								</div>
								{task.status !== 'ready' && 
								<div>
									<form onSubmit={(e) => sendMessage(e)} >
										<Grid >
											<Grid.Col span={10}>
												<Input type="text" placeholder="Введите ваше сообщение" name="message" />
											</Grid.Col>
											<Grid.Col span={2}>
												<Button variant="light" color="blue" type="submit" rightIcon={<Send />}>Отправить</Button>
											</Grid.Col>
										</Grid>
										<Space h="sm" />
										{files.length > 0 && <>
											<Text size="sm">Прикрепленные файлы: {files.map(el => {
												return ` ${el.name},`
											})}</Text>
										</>}
										<Dropzone
											onDrop={(files) => {
												setFiles(files);
											}}
											onReject={() => {
												showNotification({
													title: 'Файл отклонен',
													autoClose: 3500,
													color: 'red',
													icon: <X size={18} />,
												});
											}}
											maxSize={3 * 4024 ** 2}
											padding="xs"
										>
											{(status) => dropzoneChildren(status, theme)}
										</Dropzone>
									</form>
								</div>}
								{task.status === 'ready' && <Alert color="greed"> Вы выполнили задание!
									</Alert>}
							</>
							}
						</>
						:
						<Button loading={acceptLoading} color="green" onClick={() => setAccepted(true)}>Приступить к выполнения</Button>}

				</Card>
			</Container >
		</>
	)
}
