import { useEffect, useState } from 'react';

import { Modal, InputWrapper, Input, Group, Text, Space, Button, useMantineTheme, Center, NativeSelect, Grid } from '@mantine/core';
import { nanoid } from 'nanoid';
import { showNotification } from '@mantine/notifications';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Upload, X, File, Check, Send } from 'tabler-icons-react';
import axios from '/utils/rest';
import styles from './messages.module.scss';

export const Answer = ({ opened, setOpened, task }) => {

	const theme = useMantineTheme();

	const [chatLoading, setChatLoading] = useState(false);
	const [chat, setChat] = useState([]);

	const [taskStatus, setTaskStatus] = useState('check');

	const [files, setFiles] = useState([]);

	useEffect(() => {
		if (task.task) {
			axios.get(`/to_check/${task.task.id}/${task.user.id}/chat`)
				.then(res => {
					if (res.status === 200) {
						setChat(res.data);
						setTaskStatus(task.task.status);
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
	}, [task]);

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
		body.append('user_id', task.user.id.toString());
		body.append('status', e.target.status.value === 'Доработать' ? 'waiting' : 'ready');
		setTaskStatus('Доработать' ? 'waiting' : 'ready');
		if (files) {
			for (let index in files) {
				console.log(files[index].path);
				body.append(`file_${index}`, files[index], `task_${nanoid()}.${files[index].path.split('.')[files[index].path.split('.').length - 1]}`);
			}
		}
		axios.post(`/to_check/${task.task.id}/answer`, body)
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
	return (
		<Modal
			opened={opened}
			onClose={() => setOpened(false)}
			title={`Ответ на задание ${task.task && task.task.name}`}
			size="xl"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			{!chatLoading && <>
				<Text>
					{task.day && task.day.name}
				</Text>
				<Text color="blue">
					Статус задания: {taskStatus === 'check' ? 'Ожидает проверки' : taskStatus === 'waiting' ? 'На доработке' : 'Готово'}
				</Text>
				<Text color="orange" weight={500} size="lg">
					Общение с талантом {task.user && `${task.user.name} ${task.user.surname}`}
				</Text>
				<Space h="md" />
			</>}
			{!chatLoading && <>
				<div className={styles.messages}>
					{chat.map(message => {
						return <div className={`${styles.message} ${(message.answer_id ? styles.you : styles.interlocutor)}`} key={message.id}>
							<Text size="sm">{message.answer_id ? 'Вы' : `Талант ${task.user.name} ${task.user.surname}`}:</Text>
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
				<div>
					<form onSubmit={(e) => sendMessage(e)} >
						<div className={styles.input}>
							<input type="text" placeholder="Введите ваше сообщение" name="message" />
							<Send onClick={() => { document.getElementById('send-message').click() }} />
							<button type="submit" id="send-message"></button>
						</div>
						<Space h="md" />
						<NativeSelect
							data={['Сделано', 'Доработать']}
							placeholder="Выберите вариант"
							label="Выберите статус задания"
							description="Этот статус относится к вашему ответу и не отражает текущий статус задания"
							required
							name="status"
						/>
						<Space h="md" />
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
				</div>
			</>}
		</Modal>
	)
}
