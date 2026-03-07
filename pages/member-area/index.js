import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { withAuthPage } from "@/lib/auth";

function MemberAreaPage({ user }) {
  const router = useRouter();

  useEffect(() => {
    router.replace("/member-area/articles");
  }, [router]);

  return (
    <Layout user={user}>
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Redirecting to articles...</p>
      </div>
    </Layout>
  );
}

export default MemberAreaPage;

export const getServerSideProps = withAuthPage(
  async (_context, user) => ({ props: { user } })
);
