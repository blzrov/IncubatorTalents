import { useState, useEffect } from "react";
import axios from "/utils/rest";

import { Space, Loader, Title, Button, Center, Table, Stack } from "@mantine/core";
import { Plus, TrashX, Edit, ListNumbers, List } from "tabler-icons-react";
import Container from "react-bootstrap/Container";

import { AddCourse } from "./addCourse";
import { DeleteCourse } from "./deleteCourse";
import { EditCourse } from "./editCourse";
import { Main } from "./main";
import { Days } from "../Days";

export const CoursesControl = () => {
  const [addCourseModalOpened, setAddCourseModalOpened] = useState(false);
  const [deleteCourseModalOpened, setDeleteCourseModalOpened] = useState(false);
  const [editCourseModalOpened, setEditCourseModalOpened] = useState(false);
  const [daysModalOpened, setDaysModalOpened] = useState(false);

  const [deleteCourseId, setDeleteCourseId] = useState(-1);
  const [editCourseId, setEditCourseId] = useState(-1);
  const [courseId, setCourseId] = useState(-1);

  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesList, setCoursesList] = useState([]);
  const [coursesListError, setCoursesListError] = useState("");

  useEffect(() => {
    axios
      .get("/courses")
      .then((res) => {
        setCoursesList(res.data);
      })
      .catch((error) => {
        setCoursesListError("Ошибка получения списка курсов");
      })
      .finally(() => {
        setCoursesLoading(false);
      });
  }, []);

  const pushCourse = (course) => {
    setCoursesList([course, ...coursesList]);
  };

  const removeCourse = (id) => {
    const delete_index = coursesList.findIndex((course) => course.id === id);
    if (delete_index !== -1) {
      coursesList.splice(delete_index, 1);
      setCoursesList(coursesList);
    }
  };

  const updateCourse = (updatedCourse) => {
    const update_index = coursesList.findIndex((course) => course.id === updatedCourse.id);
    if (update_index !== -1) {
      coursesList[update_index] = updatedCourse;
      setCoursesList(coursesList);
    }
  };

  return (
    <Container style={{ width: "100%" }}>
      <Title order={2}>Курсы</Title>
      <Space h="xl" />
      {!addCourseModalOpened && !deleteCourseModalOpened && !editCourseModalOpened && !daysModalOpened && (
        <Main
          setAddCourseModalOpened={setAddCourseModalOpened}
          setEditCourseModalOpened={setEditCourseModalOpened}
          setEditCourseId={setEditCourseId}
          setDaysModalOpened={setDaysModalOpened}
          setCourseId={setCourseId}
          coursesLoading={coursesLoading}
          coursesListError={coursesListError}
          coursesList={coursesList}
        />
      )}
      {addCourseModalOpened && (
        <AddCourse opened={addCourseModalOpened} setOpened={setAddCourseModalOpened} pushCourse={pushCourse} />
      )}
      {deleteCourseModalOpened && (
        <DeleteCourse
          opened={deleteCourseModalOpened}
          setOpened={setDeleteCourseModalOpened}
          removeCourse={removeCourse}
          deleteCourseId={deleteCourseId}
        />
      )}
      {editCourseModalOpened && (
        <EditCourse
          opened={editCourseModalOpened}
          setOpened={setEditCourseModalOpened}
          updateCoursesList={updateCourse}
          editCourseId={editCourseId}
        />
      )}
      {daysModalOpened && <Days opened={daysModalOpened} setOpened={setDaysModalOpened} courseId={courseId} />}
    </Container>
  );
};
