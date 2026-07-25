export default function DashboardReport({
  title,
  value,
  classes,
  conditionalClasses,
}) {
  return (
    <div
      className={
        "dashboard-report" +
        (classes ? classes : "") +
        (conditionalClasses
          ? conditionalClasses.condition
            ? conditionalClasses.classes
            : ""
          : "")
      }
    >
      <div className="report-container">
        <div className="report-title poppins-medium">{title}</div>
        <div className="value poppins-bold">{value}</div>
      </div>
    </div>
  );
}
