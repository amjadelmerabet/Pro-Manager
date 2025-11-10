export default function sortTasksUtil(unsortedTasksList, tasks, sort) {
  let unsortedList =
    unsortedTasksList.length === 0 ? [...tasks] : [...unsortedTasksList];
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
