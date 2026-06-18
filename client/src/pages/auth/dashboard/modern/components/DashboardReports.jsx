import DashboardReport from "./DashboardReport";

export default function DashboardReports({ reportsStats }) {
  const reportsData = {
    projects: [
      {
        name: "close-to-deadline",
        display: "Close to deadline",
        value: reportsStats.projects.closeToDeadline,
        conditionalClasses: {
          condition: reportsStats.projects.closeToDeadline > 0,
          classes: " close-to-deadline attention",
        },
      },
      {
        name: "overdue",
        display: "Overdue",
        value: reportsStats.projects.overdue,
        conditionalClasses: {
          condition: reportsStats.projects.overdue > 0,
          classes: " overdue attention",
        },
      },
      {
        name: "not-started",
        display: "Not started",
        value: reportsStats.projects.notStarted,
      },
      {
        name: "in-progress",
        display: "In progress",
        value: reportsStats.projects.inProgress,
      },
      {
        name: "completed",
        display: "Completed",
        value: reportsStats.projects.completed,
        classes: " completed",
      },
    ],
    tasks: [
      {
        name: "today",
        diplay: "Today",
        value: reportsStats.tasks.today,
        classes: " today",
      },
      {
        name: "inbox",
        display: "Inbox",
        value: reportsStats.tasks.inbox,
      },
      {
        name: "to-do",
        display: "To do",
        value: reportsStats.tasks.toDo,
      },
      {
        name: "doing",
        display: "Doing",
        value: reportsStats.tasks.doing,
      },
      {
        name: "done",
        display: "Done",
        value: reportsStats.tasks.done,
        classes: " done",
      },
    ],
  };

  return (
    <div className="dashboard-reports">
      <div className="section projects">
        <div className="section-title poppins-bold">Projects</div>
        <div className="section-reports">
          {reportsData.projects.map((reportData, index) => {
            return (
              <DashboardReport
                key={index}
                title={reportData.display}
                value={reportData.value}
                classes={reportData?.classes}
                conditionalClasses={reportData?.conditionalClasses}
              />
            );
          })}
        </div>
      </div>
      <div className="section tasks">
        <div className="section-title poppins-bold">Tasks</div>
        <div className="section-reports">
          {reportsData.tasks.map((reportData, index) => {
            return (
              <DashboardReport
                key={index}
                title={reportData.display}
                value={reportData.value}
                classes={reportData?.classes}
                conditionalClasses={reportData?.conditionalClasses}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
