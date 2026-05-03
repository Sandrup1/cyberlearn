import GenericLabPage from "../../components/generic-lab-page";

export default async function DynamicLabPage({
  params,
}: {
  params: Promise<{ moduleId: string; labId: string }>;
}) {
  const { moduleId, labId } = await params;
  return <GenericLabPage moduleId={moduleId} labId={labId} />;
}

