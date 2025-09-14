import RoleLayout from "./RoleLayout";

export default function AdminLayout({ children, userInfo = null }) {
  return (
    <RoleLayout role="admin" userInfo={userInfo}>
      {children}
    </RoleLayout>
  );
}
