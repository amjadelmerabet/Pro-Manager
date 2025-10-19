export default function updateProjectsList(
  filter,
  search,
  projects,
  setFilteredList
) {
  if (Object.keys(filter).length !== 0) {
    if (filter.state && Number(filter.state) !== 0) {
      if (search !== "") {
        let newList = projects.filter((project) => {
          if (
            project.state === Number(filter.state) &&
            project.name.toLowerCase().includes(search.toLowerCase())
          ) {
            return project;
          }
        });
        setFilteredList(newList);
      } else {
        let newList = projects.filter((project) => {
          if (project.state === Number(filter.state)) {
            return project;
          }
        });
        setFilteredList(newList);
      }
    } else {
      let newList = projects.filter((project) => {
        if (project.name.toLowerCase().includes(search.toLowerCase()))
          return project;
      });
      setFilteredList(newList);
    }
  }
}
