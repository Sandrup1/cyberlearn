import GenericLabPage from "../../components/generic-lab-page";

export default async function XxeLabPage({
  params,
}: {
  params: Promise<{ labId: string }>;
}) {
  const { labId } = await params;
  return <GenericLabPage moduleId="xxe" labId={labId} />;
}
