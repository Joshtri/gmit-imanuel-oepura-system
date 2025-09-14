import RoleLayout from "./RoleLayout";

export default function EmployeeLayout({ children, userInfo = null }) {
  return (
    <RoleLayout role="employee" userInfo={userInfo}>
      {children}
    </RoleLayout>
  );
}
