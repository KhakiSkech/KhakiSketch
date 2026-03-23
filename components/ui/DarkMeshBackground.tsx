/**
 * Shared dark gradient mesh background for dark-themed sections.
 * Renders absolute-positioned gradient + blur blobs.
 * Parent must have `relative overflow-hidden`.
 */
export default function DarkMeshBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2618] via-[#263122] to-[#2d4a25]" />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-secondary opacity-[0.07] blur-[200px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-[#445d3a] opacity-[0.10] blur-[160px] pointer-events-none" />
    </>
  );
}
