export default function sortProjectsUtil(unsoredProjectsList, projects, sort) {
  let unsortedList =
    unsoredProjectsList.length === 0 ? [...projects] : [...unsoredProjectsList];
  if (Number(sort.sort_by) !== 0) {
    if (sort.sort_by === "1") {
      unsortedList.sort((a, b) => {
        if (sort.type === 1) {
          return a.state - b.state;
        } else {
          return b.state - a.state;
        }
      });
    } else if (sort.sort_by === "2") {
      unsortedList.sort((a, b) => {
        if (sort.type === 1) {
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        } else {
          return (
            new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
          );
        }
      });
    }
  }
  return unsortedList;
}
