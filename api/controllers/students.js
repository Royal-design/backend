const getAllStudents = (req, res) => {
  res.send("get all students");
};

const createStudent = (req, res) => {
  res.send("create student");
};

const updateStudent = (req, res) => {
  res.send(`update student ${req.params.id}`);
};

const deleteStudent = (req, res) => {
  res.send(`delete student ${req.params.id}`);
};
export { getAllStudents, createStudent, updateStudent, deleteStudent };
