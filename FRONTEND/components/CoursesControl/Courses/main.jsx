import { useState, useEffect } from "react";
import axios from "/utils/rest";

import { Space, Loader, Title, Button, Center, Table, Stack } from "@mantine/core";
import { Plus, TrashX, Edit, ListNumbers, List } from "tabler-icons-react";

export const Main = ({
  setAddCourseModalOpened,
  setEditCourseModalOpened,
  setEditCourseId,
  setDaysModalOpened,
  coursesLoading,
  coursesListError,
  coursesList,
  setCourseId,
}) => {
  return (
    <div>
      <Space h="xl" />
      <Table verticalSpacing="sm" striped highlightOnHover>
        <thead>
          <tr>
            <th>Название</th>
            <th>Количество дней</th>
            <th>Количество участников</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {!coursesLoading &&
            coursesList.map((course) => {
              return (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{course.days}</td>
                  <td>{course.selected_users}</td>
                  <td>
                    <Stack>
                      <Button
                        variant="outline"
                        color="blue"
                        leftIcon={<Edit />}
                        onClick={() => {
                          setEditCourseId(course.id);
                          setEditCourseModalOpened(true);
                        }}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="outline"
                        color="red"
                        leftIcon={<TrashX />}
                        onClick={() => {
                          setDeleteCourseId(course.id);
                          setDeleteCourseModalOpened(true);
                        }}
                      >
                        Удалить
                      </Button>
                    </Stack>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      {coursesLoading && (
        <Center>
          <Loader color="orange" variant="bars" />
        </Center>
      )}
      {!coursesLoading && coursesList.length === 0 && <Center>Список курсов пуст</Center>}
      <Center>{coursesListError}</Center>
    </div>
  );
};
