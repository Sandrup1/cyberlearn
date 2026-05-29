import LabListPage from "../../components/lab-list-page";

export default async function DynamicLabListPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  return <LabListPage moduleId={moduleId} />;
}
