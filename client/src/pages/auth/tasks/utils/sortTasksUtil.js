export default function sortTasksUtil(tasks, sort) {
  let unsortedList = [...tasks];
  if (Number(sort.sort_by) === 1) {
    unsortedList.sort((a, b) => {
      if (sort.type === 1) {
        return a.state - b.state;
      } else {
        return b.state - a.state;
      }
    });
  } else if (Number(sort.sort_by) === 2) {
    unsortedList.sort((a, b) => {
      if (sort.type === 1) {
        return a.priority - b.priority;
      } else {
        return b.priority - a.priority;
      }
    });
  }
  return unsortedList;
}
