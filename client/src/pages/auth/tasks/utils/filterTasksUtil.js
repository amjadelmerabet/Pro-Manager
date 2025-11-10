export default function updateTasksListUtil(
  filter,
  search,
  tasks,
  setFilteredList
) {
  if (Object.keys(filter).length !== 0) {
    if (filter.state && Number(filter.state) !== 0) {
      if (search !== "") {
        let newList = tasks.filter((task) => {
          if (
            task.state === Number(filter.state) &&
            task.name.toLowerCase().includes(search.toLowerCase())
          ) {
            return task;
          }
        });
        setFilteredList(newList);
      } else {
        let newList = tasks.filter((task) => {
          if (task.state === Number(filter.state)) {
            return task;
          }
        });
        setFilteredList(newList);
      }
    } else {
      let newList = tasks.filter((task) => {
        if (task.name.toLowerCase().includes(search.toLowerCase())) return task;
      });
      setFilteredList(newList);
    }
  }
}
