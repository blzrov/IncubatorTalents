import { useEffect, useState } from 'react';

import { Modal, InputWrapper, Input, Textarea, Group, Text, Space, Button, useMantineTheme, Center, Title, Table } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Upload, X, Photo, Check, Plus, TrashX, Edit, ListNumbers, Loader } from 'tabler-icons-react';
import axios from '/utils/rest';

import { AddTask } from './addTask';
import { DeleteTask } from './deleteTask';

export const Tasks = ({ opened, setOpened, courseId, dayId }) => {
	const [addTaskModalOpened, setAddTaskModalOpened] = useState(false);
	const [deleteTaskModalOpened, setDeleteTaskModalOpened] = useState(false);
	const [editTaskModalOpened, setEditTaskModalOpened] = useState(false);

	const [deleteTaskId, setDeleteTaskId] = useState(-1);
	const [editTaskId, setEditTaskId] = useState(-1);

	const [tasksLoading, setTasksLoading] = useState(false);
	const [tasksListError, setTasksListError] = useState(false);

	const [tasksList, setTasksList] = useState([]);

	const theme = useMantineTheme();

	useEffect(() => {
		if (dayId !== -1 && courseId !== -1) {
			setTasksList([]);
			setTasksLoading(true);
			axios.get(`/courses/${courseId}/days/${dayId}/tasks`)
				.then(res => {
					setTasksList(res.data);
				})
				.catch(error => {
					console.log(error);
					setTasksListError('Ошибка получения списка курсов')
				})
				.finally(() => {
					setTasksLoading(false);
				});
		}
	}, [dayId, courseId]);

	const pushTask = (task) => {
		setTasksList([task, ...tasksList]);
	}

	const removeTask = (id) => {
		const delete_index = tasksList.findIndex(task => task.id === id);
		if (delete_index !== -1) {
			tasksList.splice(delete_index, 1)
			setTasksList(tasksList);
		}
	}

	const updateTask = (updatedTask) => {
		const update_index = tasksList.findIndex(task => task.id === updatedTask.id);
		if (update_index !== -1) {
			tasksList[update_index] = updatedTask;
			setTasksList(tasksList);
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={() => setOpened(false)}
			title="Список заданий"
			size="lg"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			<Button
				leftIcon={<Plus />}
				variant="light"
				color="green"
				onClick={() => setAddTaskModalOpened(true)}
			>
				Добавить задание
			</Button>
			<Space h="sm" />
			<Table verticalSpacing="sm" striped highlightOnHover>
				<thead>
					<tr>
						<th>Название</th>
						{/* <th>Описание</th> */}
						<th>Изображение</th>
						<th>Количество прикрепленных файлов</th>
					</tr>
				</thead>
				<tbody>
					{!tasksLoading && tasksList.map(task => {
						return <tr key={task.id}>
							<td>{task.name}</td>
							{/* <td>{course.description || 'Нет описания' }</td> */}
							<td>{task.image ? 'Прикреплено' : 'Не прикреплено'}</td>
							<td>{task.files.length}</td>
							<td>
								<Center>
									<Edit
										style={{ cursor: 'pointer', color: '#007bff' }}
										onClick={() => {
											setEditTaskId(task.id);
											setEditTaskModalOpened(true);
										}}
									/>
									<TrashX
										style={{ cursor: 'pointer', color: '#dc3545' }}
										onClick={() => {
											setDeleteTaskId(task.id);
											setDeleteTaskModalOpened(true);
										}}
									/>
								</Center>
							</td>
						</tr>
					})}
				</tbody>
			</Table>
			{tasksLoading && <Center><Loader color="orange" variant="bars" /></Center>}
			{(!tasksLoading && tasksList.length === 0) && <Center>Список заданий пуст</Center>}
			<Center>
				{tasksListError}
			</Center>
			<AddTask opened={addTaskModalOpened} setOpened={setAddTaskModalOpened} pushTask={pushTask} courseId={courseId} dayId={dayId}/>
			<DeleteTask opened={deleteTaskModalOpened} setOpened={setDeleteTaskModalOpened} removeTask={removeTask} courseId={courseId} dayId={dayId} deleteTaskId={deleteTaskId} />
		</Modal>
	)
}
