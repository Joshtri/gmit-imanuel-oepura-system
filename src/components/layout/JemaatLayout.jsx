import RoleLayout from "./RoleLayout";

export default function JemaatLayout({ children, userInfo = null }) {
  return (
    <RoleLayout role="jemaat" userInfo={userInfo}>
      {children}
    </RoleLayout>
  );
}
