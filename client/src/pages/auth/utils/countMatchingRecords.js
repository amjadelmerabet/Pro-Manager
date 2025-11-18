export default function countMatchingRecords(globalSearchList, globalSearch) {
  let projectsMatchingSearch = 0;
  let tasksMatchingSearch = 0;
  globalSearchList.forEach((record) => {
    if (
      Object.keys(record).indexOf("project_id") !== -1 &&
      record.name.toLowerCase().includes(globalSearch.toLowerCase())
    ) {
      projectsMatchingSearch = projectsMatchingSearch + 1;
    } else if (
      Object.keys(record).indexOf("task_id") !== -1 &&
      record.name.toLowerCase().includes(globalSearch.toLowerCase())
    ) {
      tasksMatchingSearch = tasksMatchingSearch + 1;
    }
  });
  return { projectsMatchingSearch, tasksMatchingSearch };
}
