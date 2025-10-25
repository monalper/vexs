import { requireEditor } from "@/lib/auth";
import AdminHeader from "@/components/AdminHeader";

export const metadata = {
  title: {
    default: 'Yönetim • vexs',
    template: '%s • Yönetim • vexs'
  }
};

export default async function AdminProtectedLayout({ children }) {
  await requireEditor();
  return (
    <div className="container" style={{ paddingBottom: 32 }}>
      <AdminHeader />
      {children}
    </div>
  );
}

