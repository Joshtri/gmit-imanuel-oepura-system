import RoleLayout from "./RoleLayout";

export default function MajelisLayout({ children, userInfo = null }) {
  return (
    <RoleLayout role="majelis" userInfo={userInfo}>
      {children}
    </RoleLayout>
  );
}
