export default function updateTasksListUtil(
  filter,
  search,
  tasks,
  setFilteredList
) {
  if (Object.keys(filter).length !== 0) {
    if (Number(filter.state) !== 0 || Number(filter.priority) !== 0) {
      if (search !== "") {
        let newList = tasks.filter((task) => {
          if (task.name.toLowerCase().includes(search.toLowerCase())) {
            if (Number(filter.state) !== 0 && Number(filter.priority) !== 0) {
              if (
                task.state === Number(filter.state) &&
                task.priority === Number(filter.priority)
              ) {
                return task;
              }
            } else if (Number(filter.state) !== 0) {
              if (task.state === Number(filter.state)) {
                return task;
              }
            } else if (Number(filter.priority) !== 0) {
              if (task.priority === Number(filter.priority)) {
                return task;
              }
            }
          }
        });
        setFilteredList(newList);
      } else {
        let newList = tasks.filter((task) => {
          if (Number(filter.state) !== 0 && Number(filter.priority) !== 0) {
            if (
              task.state === Number(filter.state) &&
              task.priority === Number(filter.priority)
            ) {
              return task;
            }
          } else if (Number(filter.state) !== 0) {
            if (task.state === Number(filter.state)) {
              return task;
            }
          } else if (Number(filter.priority) !== 0) {
            if (task.priority === Number(filter.priority)) {
              return task;
            }
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
