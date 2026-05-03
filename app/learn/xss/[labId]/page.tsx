import GenericLabPage from "../../components/generic-lab-page";

export default async function XssLabPage({
  params,
}: {
  params: Promise<{ labId: string }>;
}) {
  const { labId } = await params;
  return <GenericLabPage moduleId="xss" labId={labId} />;
}
