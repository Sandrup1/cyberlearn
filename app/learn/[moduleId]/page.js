import ModuleContentPage from "../components/module-content-page";

export default async function DynamicModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  return <ModuleContentPage moduleId={moduleId} />;
}
